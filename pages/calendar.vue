<script setup lang="ts">

const now = ref(new Date())
const nowYear = computed(() => now.value.getUTCFullYear())
const nowMonth = computed(() => now.value.getUTCMonth() + 1)
const nowDate = computed(() => now.value.getUTCDate())
const curr = ref(new Date())
const year = computed(() => curr.value.getUTCFullYear())
const month = computed(() => curr.value.getUTCMonth() + 1)
const firstDayOfMonth = computed(() => new Date(year.value, month.value - 1, 1).getUTCDay())
const datesInMonth = computed(() => new Date(year.value, month.value, 0).getUTCDate())
const emptyDaysComplete = computed(() => {
  const total = firstDayOfMonth.value + datesInMonth.value
  return total % 7 === 0 ? 0 : 7 - (total % 7)
})

function prevMonth() {
  if (month.value <= 1) {
    curr.value = new Date(year.value - 1, 12, 1)
  } else {
    curr.value = new Date(year.value, month.value - 1, 1)
  }
}

function nextMonth() {
  if (month.value >= 12) {
    curr.value = new Date(year.value + 1, 1, 1)
  } else {
    curr.value = new Date(year.value, month.value + 1, 1)
  }
}

const { tasks, checkins } = useTaskStore()

const ID2Task = computed(() => {
  const map: Record<string, TaskType> = {}
  tasks.value.forEach(t => {
    map[t.id] = t
  })
  return map
})

const taskID2Color = computed(() => {
  const map: Record<string, string> = {}
  tasks.value.forEach(t => {
    map[t.id] = stringToHexColor(t.task)
  })
  return map
})

const dateCheckins = computed(() => {
  const taskMap: Record<string, boolean> = {}
  tasks.value.forEach(t => {
    taskMap[t.id] = false
  })

  const map: Record<string, Record<string, boolean>> = {}
  for (let i = 1; i <= datesInMonth.value; i++) {
    map[i] = { ...taskMap }
  }

  const checkinsInMonth = checkins.value.filter(c => {
    const task = ID2Task.value[c.taskId]
    if (!task) return false

    const time = dayjs(c.time).utc().utcOffset(task.refreshTime || 0)
    return time.year() === year.value && (time.month() + 1) === month.value
  })
  checkinsInMonth.forEach(c => {
    const task = ID2Task.value[c.taskId]
    if (!task) return

    const time = dayjs(c.time).utc().utcOffset(task.refreshTime || 0)
    const day = time.date()
    if (map[day]) {
      map[day][c.taskId] = true
    }
  })

  return map
})

</script>

<template>
  <div>
    <!-- TODO: implement mobile responsive ui -->
    <div class="max-w-4xl mx-auto my-4">
      <h2 class="text-lg font-semibold text-gray-800">
        Calendar View
      </h2>
      <div class="mb-1">
        <h3 class="mb-1 font-semibold">Tasks</h3>
        <!-- TODO: implement jadi checkboxes buat milih apa aja yang ditampilin -->
        <div class="flex flex-row flex-wrap gap-x-4">
          <div v-for="task in tasks" :key="task.id" class="flex items-center justify-center gap-1">
            <p class="h-4 w-4 rounded" :style="{
              'background-color': taskID2Color[task.id]
            }"></p>
            <p>{{ task.task }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-row items-center justify-center p-2">
        <div class="flex flex-row items-center justify-center gap-2" :class="{
          'bg-green-50': year == nowYear && month == nowMonth
        }">
          <button @click="prevMonth"
            class="p-1 rounded-s font-semibold flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            <Icon name="mdi:chevron-left" class="w-4 h-4" />
          </button>
          <h3>
            {{ year }}-{{ month }}
          </h3>
          <button @click="nextMonth"
            class="p-1 rounded-e font-semibold flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            <Icon name="mdi:chevron-right" class="w-4 h-4" />
          </button>

        </div>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <div class="font-bold text-center">Sun</div>
        <div class="font-bold text-center">Mon</div>
        <div class="font-bold text-center">Tue</div>
        <div class="font-bold text-center">Wed</div>
        <div class="font-bold text-center">Thu</div>
        <div class="font-bold text-center">Fri</div>
        <div class="font-bold text-center">Sat</div>
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="border p-2 h-20 rounded"></div>
        <div v-for="date in datesInMonth" :key="date" class="border p-2 h-20 rounded flex flex-col" :class="{
          'bg-green-50': year == nowYear && month == nowMonth && date == nowDate
        }">
          <div class="text-sm mb-1 font-semibold">{{ date }}</div>
          <div class="flex flex-row gap-1 flex-wrap overflow-y-auto">
            <div v-for="(yes, taskId) in dateCheckins[date]" class="text-xs rounded h-4 w-4 border"
              style="background-color: var(--bg-color); border-color: var(--color);" :style="{
                '--color': taskID2Color[taskId],
                '--bg-color': yes ? taskID2Color[taskId] : 'transparent',
              }"></div>
          </div>
        </div>
        <div v-for="n in emptyDaysComplete" :key="'empty-complete-' + n" class="border p-2 h-20 rounded"></div>
      </div>
    </div>
  </div>
</template>
