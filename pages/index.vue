<script setup lang="ts">
const { tasks, checkins } = useTaskStore()
const form = ref<{
  task: string,
  url: string,
  refreshTime: '' | number,
}>({
  task: '',
  url: '',
  refreshTime: '',
})
const editMode = ref(false)
const clockTime = ref(new Date())

const utcOffsets = ref([
  -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
])

const tasksDone = computed(() => {
  const temp: Record<string, boolean> = {}
  tasks.value.forEach(task => {
    if (!task.lastCheckin) {
      temp[task.id] = false
      return
    }

    const offset = task.refreshTime

    const now = dayjs(clockTime.value.getTime())
    const refreshUTC = now.utc().utcOffset(offset).hour(0).minute(0).second(0).millisecond(0)
    const lastCheckinUTC = dayjs(task.lastCheckin).utc().utcOffset(offset)

    const sameDay = lastCheckinUTC.isSame(refreshUTC, 'day')
    temp[task.id] = sameDay
  })
  return temp
})

function handleSubmit() {
  if (!form.value.task || form.value.refreshTime === '') {
    return
  }

  tasks.value.push({
    id: generateId(4),
    task: form.value.task,
    url: form.value.url,
    refreshTime: form.value.refreshTime,
    lastCheckin: null,
    createdAt: new Date(),
  })

  form.value = {
    task: '',
    url: '',
    refreshTime: '',
  }
}

function removeTask(id: string) {
  const index = tasks.value.findIndex(task => task.id === id)
  const task = tasks.value[index]
  if (!task) return
  // TODO: change confirm with better ui
  if (!confirm(`Are you sure you want to delete the task "${task.task}"? This action cannot be undone.`)) {
    return
  }

  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
  checkins.value = checkins.value.filter(checkin => checkin.taskId !== id)
}

function checkinTask(id: string) {
  const task = tasks.value.find(task => task.id === id)
  if (task && task.url) {
    window.open(task.url, '_blank')
  }
  if (task && !tasksDone.value[id]) {
    const now = new Date()
    task.lastCheckin = now
    checkins.value.push({
      id: generateId(8),
      taskId: task.id,
      createdAt: now,
    })
  }
}

function uncheckinTask(id: string) {
  const task = tasks.value.find(task => task.id === id)
  if (!task) return
  // TODO: change confirm with better ui
  if (!confirm(`Are you sure you want to remove last checkin for the task "${task.task}"? This action cannot be undone.`)) {
    return
  }
  if (!tasksDone.value[id]) return

  const checkinIndex = checkins.value.findIndex(checkin => {
    return checkin.taskId === id && task.lastCheckin && checkin.createdAt.getTime() === task.lastCheckin.getTime()
  })
  checkins.value.splice(checkinIndex, 1)
  task.lastCheckin = null
}

setInterval(() => {
  clockTime.value = new Date()
}, 100)

const streaks = computed(() => {
  const counts: Record<string, number> = {}
  tasks.value.forEach(task => {
    const taskCheckins = checkins.value.filter(checkin => checkin.taskId === task.id)
    counts[task.id] = 0
    if (taskCheckins.length === 0) {
      return
    }
    let currCheckinTime = tasksDone.value[task.id] && task.lastCheckin ? new Date(task.lastCheckin) : new Date()
    // assumed sorted by time ascending
    for (let i = taskCheckins.length - 1; i >= 0; i--) {
      const checkin = taskCheckins[i]
      if (!checkin) break

      const nextCheckinTime = checkin.createdAt
      const daysDiff = dayjs(currCheckinTime).diff(dayjs(nextCheckinTime), 'day')
      // console.log(task.task, currCheckinTime, nextCheckinTime, daysDiff)

      if (daysDiff >= 0 && daysDiff < 2) {
        counts[task.id] = (counts[task.id] ?? 0) + 1;
        currCheckinTime = nextCheckinTime
      } else {
        break
      }
    }
  })
  return counts
})

// reorder with drag and drop
const dragIndex = ref(-1)
const dragHoverIndex = ref(-1)
function handleDragStart(index: number) {
  if (isMobile()) return
  dragIndex.value = index
  dragHoverIndex.value = index
}
function handleDragOver(index: number) {
  if (isMobile()) return
  if (dragIndex.value > -1) {
    dragHoverIndex.value = index
  } else {
    dragHoverIndex.value = -1
  }
}
function handleDrop(index: number) {
  if (isMobile()) return

  const draggedTask = tasks.value[dragIndex.value]
  if (!draggedTask) return

  if (dragIndex.value !== index) {
    tasks.value.splice(dragIndex.value, 1)
    tasks.value.splice(index, 0, draggedTask)
  }
  dragIndex.value = -1
  dragHoverIndex.value = -1
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit"
      class="flex flex-col sm:flex-row items-center sm:items-end justify-center w-full max-w-4xl my-2 mx-auto p-4 gap-2 bg-cyan-50/50 shadow rounded">
      <div class="flex-1 w-full sm:w-auto">
        <label for="task" class="block text-sm font-medium text-gray-700">
          Task
        </label>
        <input v-model="form.task" type="text" id="task" name="task" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-cyan-500 sm:text-sm" />
      </div>

      <div class="flex-1 w-full sm:w-auto">
        <label for="url" class="block text-sm font-medium text-gray-700">
          URL (optional)
        </label>
        <input v-model="form.url" type="url" id="url" name="url"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-cyan-500 sm:text-sm" />
      </div>

      <div class="flex-[0.75] w-full sm:w-auto">
        <label for="refresh-time" class="block text-sm font-medium text-gray-700">
          Refresh Time (UTC)
        </label>
        <select v-model="form.refreshTime" id="refresh-time" name="refresh-time" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-cyan-500 sm:text-sm">
          <option value="">Select Offset</option>
          <option v-for="offset in utcOffsets" :key="offset" :value="offset">
            {{ offsetFormat(offset) }} | UTC{{ offset >= 0 ? '+' : '' }}{{ offset }}
          </option>
        </select>
      </div>

      <div class=" w-full sm:w-auto">
        <button type="submit" aria-label="Add task"
          class="flex items-center justify-center p-2 text-sm font-semibold text-white bg-cyan-600 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Icon name="mdi:plus" class="w-5 h-5" />
        </button>
      </div>
    </form>

    <div class="max-w-4xl mx-auto my-2 bg-cyan-50/50 shadow rounded relative">
      <div class="flex items-center justify-between sticky top-0 p-4 bg-cyan-50/50 backdrop-blur z-50">
        <h2 class="text-lg font-semibold text-gray-800">
          Tasks
        </h2>
        <p class="text-lg font-bold text-gray-800">
          {{ timeFormat(clockTime) }}
        </p>
        <button @click="editMode = !editMode" aria-label="Toggle edit mode"
          class="ml-2 p-2 flex items-center justify-center text-sm font-medium rounded" :class="{
            'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100': !editMode,
            'text-red-50 hover:text-red-100 bg-red-600 hover:bg-red-700': editMode
          }">
          <Icon name="mdi:note-edit" class="w-5 h-5" />
        </button>
      </div>

      <ul class="space-y-2 px-4 py-2">
        <li v-for="(task, index) in tasks" :key="task.id" @dragstart="handleDragStart(index)"
          @dragover.prevent="handleDragOver(index)" @drop="handleDrop(index)" :draggable="!isMobile()"
          class="flex items-center justify-between rounded shadow cursor-auto sm:cursor-move text-sm sm:text-base"
          :class="{
            'ring': dragIndex === index,
            'bg-blue-50': dragHoverIndex === index,
            'bg-white hover:bg-gray-50': dragIndex !== index && dragHoverIndex !== index,
          }">
          <div class="flex items-center justify-center my-auto mx-1 h-full text-gray-200 sm:text-gray-600">
            <Icon name="mdi:drag-vertical" class="w-5 h-5" />
          </div>
          <div class="flex-1 flex items-center justify-between py-4 pr-4 gap-4">
            <div class="flex-1 flex flex-col items-start sm:flex-row sm:items-center justify-between ">
              <h3 class="text-base sm:text-lg font-medium text-gray-900">
                {{ task.task }}
              </h3>
              <div class="flex flex-row-reverse sm:flex-row gap-2 items-end">
                <p v-if="tasksDone[task.id]" class="text-md text-green-700 flex items-center justify-center">
                  <Icon name="mdi:check" class="w-5 h-5 mr-1" />
                  {{ dateFromNow(task.lastCheckin) }}
                </p>
                <p v-if="streaks[task.id] ?? 0 > 0" class="text-md text-yellow-600 flex items-center justify-center">
                  <Icon name="mdi:fire" class="w-5 h-5 mr-1 text-yellow-500" />
                  {{ streaks[task.id] }}
                </p>
                <p class="text-md text-gray-600 flex items-center justify-center">
                  <Icon name="mdi:refresh" class="w-5 h-5 mr-1" />
                  {{ offsetFormat(task.refreshTime) }}
                </p>
              </div>
            </div>
            <div v-if="!editMode">
              <button @click.stop.prevent="checkinTask(task.id)" :aria-label="task.url ? 'Open URL' : 'Check-in task'"
                class="flex items-center justify-center p-2 rounded text-cyan-600 hover:text-cyan-800 bg-cyan-100 hover:bg-cyan-200">
                <Icon v-if="tasksDone[task.id]" name="mdi:check-bold" class="w-5 h-5" />
                <Icon v-else-if="task.url" name="mdi:share-variant" class="w-5 h-5" />
                <Icon v-else name="mdi:send-outline" class="w-5 h-5" />
              </button>
            </div>
            <div v-if="editMode" class="flex flex-row items-center">
              <button @click.stop.prevent="tasksDone[task.id] ? uncheckinTask(task.id) : null"
                aria-label="Uncheck-in task" :disabled="!tasksDone[task.id]"
                class="flex items-center justify-center p-2 rounded-s text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200">
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
              <button @click.stop.prevent="removeTask(task.id)" aria-label="Delete task" :disabled="!editMode"
                class="flex items-center justify-center p-2 rounded-e text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200">
                <Icon name="mdi:delete" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </li>
        <li v-if="tasks.length === 0" class="text-gray-500 text-center p-4">
          No tasks added yet.
        </li>
      </ul>
    </div>
  </div>
</template>
