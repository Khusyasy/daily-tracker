<script setup>
  useHead({
    title: 'Daily Tracker',
    meta: [
      { name: 'description', content: 'Simple App to Track Your Dailies' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  })

  const { tasks, checkins } = useTaskStore()
  const form = ref({
    task: '',
    url: '',
    refreshTime: '',
  })
  const deleteMode = ref(false)
  const clockTime = ref(new Date())

  const tasksDone = computed(() => {
    const temp = {}
    tasks.value.forEach(task => {
      if (!task.lastCheckin || !task.refreshTime) {
        temp[task.id] = false
        return
      }

      // get the next refresh date
      const [hours, minutes] = task.refreshTime.split(':').map(Number);
      const refreshDate = new Date();
      refreshDate.setHours(hours, minutes, 0, 0);
      if (refreshDate < clockTime.value) {
        refreshDate.setDate(refreshDate.getDate() + 1);
      }

      // last checkin is within 24 hours
      const diff = getMSDiff(task.lastCheckin, refreshDate);
      temp[task.id] = diff <= MS_DAY
    })
    return temp
  })

  function handleSubmit() {
    tasks.value.push({
      id: generateId(4),
      task: form.value.task,
      url: form.value.url,
      refreshTime: form.value.refreshTime,
      lastCheckin: null,
    })

    form.value = {
      task: '',
      url: '',
      refreshTime: ''
    }
  }

  function removeTask(id) {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
    checkins.value = checkins.value.filter(checkin => checkin.taskId !== id)
  }

  function checkinTask(id) {
    const task = tasks.value.find(task => task.id === id)
    if (task.url) {
      window.open(task.url, '_blank')
    }
    if (task && !tasksDone.value[id]) {
      const now = new Date()
      task.lastCheckin = now
      checkins.value.push({
        id: generateId(8),
        taskId: task.id,
        time: now,
      })
    }
  }

  function uncheckinTask(id) {
    const task = tasks.value.find(task => task.id === id)
    if (task && tasksDone.value[id]) {
      const checkinIndex = checkins.value.findIndex(checkin => checkin.taskId === id && checkin.time.getTime() === task.lastCheckin.getTime())
      checkins.value.splice(checkinIndex, 1)
      task.lastCheckin = null
    }
  }

  setInterval(() => {
    clockTime.value = new Date()
  }, 100)

  const streaks = computed(() => {
    const streaks = {}
    tasks.value.forEach(task => {
      const taskCheckins = checkins.value.filter(checkin => checkin.taskId === task.id)
      streaks[task.id] = 0
      if (taskCheckins.length === 0) {
        return
      }
      let currCheckinTime = task.lastCheckin ? new Date(task.lastCheckin) : taskCheckins[taskCheckins.length - 1].time
      // assumed sorted by time ascending
      for (let i = taskCheckins.length - 1; i >= 0; i--) {
        const nextCheckinTime = taskCheckins[i].time
        const diff = getMSDiff(currCheckinTime, nextCheckinTime)
        // console.log(currCheckinTime, nextCheckinTime, diff)
        if (diff <= MS_DAY) {
          streaks[task.id]++
          currCheckinTime = nextCheckinTime
        } else {
          break
        }
      }
    })
    return streaks
  })
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />

    <form @submit.prevent="handleSubmit"
      class="flex flex-row items-center justify-center w-full max-w-4xl my-4 mx-auto gap-2">
      <div class="flex-1">
        <label for="task" class="block text-sm font-medium text-gray-700">
          Task
        </label>
        <input v-model="form.task" type="text" id="task" name="task" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
      </div>

      <div class="flex-1">
        <label for="url" class="block text-sm font-medium text-gray-700">
          URL (optional)
        </label>
        <input v-model="form.url" type="url" id="url" name="url"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
      </div>

      <div class="flex-1">
        <label for="refresh-time" class="block text-sm font-medium text-gray-700">
          Refresh Time (local time)
        </label>
        <input v-model="form.refreshTime" type="time" id="refresh-time" name="refresh-time" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
      </div>

      <div>
        <button type="submit" aria-label="Add task"
          class="flex items-center justify-center w-12 h-12 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Icon name="mdi:plus" class="w-5 h-5" />
        </button>
      </div>
    </form>

    <div class="max-w-4xl mx-auto my-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">
          Tasks
        </h2>
        <p class="text-lg font-bold text-gray-800">
          {{ timeFormat(clockTime) }}
        </p>
        <button @click="deleteMode = !deleteMode" aria-label="Toggle delete mode"
          class="ml-2 p-2 flex items-center justify-center text-sm font-medium rounded" :class="{
            'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100': !deleteMode,
            'text-red-50 hover:text-red-100 bg-red-600 hover:bg-red-700': deleteMode
          }">
          <Icon name="mdi:delete" class="w-5 h-5" />
        </button>
      </div>
      <ul class="mt-2 space-y-2">
        <!-- TODO: drag and drop reorder task thingy -->
        <li v-for="task in tasks" :key="task.id" class="bg-white hover:bg-gray-50 rounded shadow">
          <div class="flex items-center justify-between p-4 gap-4">
            <div class="flex-1 flex flex-row items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ task.task }}
              </h3>
              <div class="flex flex-row gap-2">
                <p v-if="tasksDone[task.id]" class="text-md text-green-600 flex items-center justify-center">
                  <Icon name="mdi:check" class="w-5 h-5 mr-1" />
                  {{ dateFromNow(task.lastCheckin) }}
                </p>
                <p v-if="streaks[task.id] > 0" class="text-md text-yellow-600 flex items-center justify-center">
                  <Icon name="mdi:fire" class="w-5 h-5 mr-1 text-yellow-500" />
                  {{ streaks[task.id] }}
                </p>
                <p class="text-md text-gray-600 flex items-center justify-center">
                  <Icon name="mdi:refresh" class="w-5 h-5 mr-1" />
                  {{ task.refreshTime }}
                </p>
              </div>
            </div>
            <div v-if="!deleteMode">
              <button @click.stop.prevent="checkinTask(task.id)" :aria-label="task.url ? 'Open URL' : 'Check-in task'"
                class="flex items-center justify-center p-2 rounded text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200">
                <Icon v-if="tasksDone[task.id]" name="mdi:check-bold" class="w-5 h-5" />
                <Icon v-else-if="task.url" name="mdi:share-variant" class="w-5 h-5" />
                <Icon v-else name="mdi:send-outline" class="w-5 h-5" />
              </button>
            </div>
            <div v-if="deleteMode" class="flex flex-row items-center">
              <button @click.stop.prevent="tasksDone[task.id] ? uncheckinTask(task.id) : null"
                aria-label="Uncheck-in task" :disabled="!tasksDone[task.id]"
                class="flex items-center justify-center p-2 rounded-s text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200">
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
              <button @click.stop.prevent="removeTask(task.id)" aria-label="Delete task" :disabled="!deleteMode"
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
