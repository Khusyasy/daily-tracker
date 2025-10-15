<script setup lang="ts">
const { tasks, checkins } = useTaskStore()

function handleExport() {
  const now = new Date()
  const data = JSON.stringify({
    version: LATEST_SAVE_VERSION,
    exportedAt: now,
    tasks: tasks.value,
    checkins: checkins.value,
  })
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `daily-tracker_${now.getTime()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const MIGRATIONS = new Map<number, (data: SaveType) => SaveType>()
MIGRATIONS.set(1, (data) => {
  // 1 -> 2: change refreshTime HH:mm to be UTC offset -12 to +14
  const localOffset = new Date().getTimezoneOffset() / 60
  data.tasks = data.tasks.map((oldTask: object) => {
    if ('refreshTime' in oldTask && typeof oldTask.refreshTime == 'string') {
      // minute is ignored
      const [hoursStr, _] = oldTask.refreshTime.split(':')
      if (!hoursStr) return oldTask

      const hours = parseInt(hoursStr, 10)
      let offset = 0
      if (hours >= 0 && hours <= 12) {
        offset = hours
      } else if (hours >= 13 && hours <= 23) {
        offset = hours - 24
      }

      offset += localOffset

      if (offset < -12) {
        offset = offset + 24
      } else if (offset > 12) {
        offset = offset - 24
      }

      return { ...oldTask, refreshTime: -offset }
    }
  })
  data.version = 2
  return data
});

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    const file = event.target?.files?.[0]

    if (!file || !confirm('Importing data will delete ALL existing data and it cannot be undone. Make sure you have a backup. Continue?')) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        if (!e.target?.result || typeof e.target.result !== 'string') {
          alert('Invalid file content')
          return
        }
        const parsed = JSON.parse(e.target.result)
        const saveRes = SaveSchema.safeParse(parsed)

        if (!saveRes.success) {
          alert('Invalid file format')
          return
        }

        let saveData = saveRes.data

        while (saveData.version < LATEST_SAVE_VERSION) {
          const migrate = MIGRATIONS.get(saveData.version)
          if (!migrate) {
            throw new Error('Migration not found for version ' + saveData.version)
          }
          saveData = migrate(saveData)
        }

        if (saveData.tasks) {
          const res = TasksSchema.safeParse(saveData.tasks)
          if (res.success) {
            tasks.value = res.data
          }
        }
        if (saveData.checkins) {
          const res = CheckinsSchema.safeParse(saveData.checkins)
          if (res.success) {
            checkins.value = res.data
          }
        }
      } catch (error) {
        console.error('Invalid JSON file:', error)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<template>
  <header class="w-screen px-2 py-4 text-green-800 border-b border-green-800 bg-white shadow">
    <div class="flex flex-row items-center justify-between h-full max-w-4xl mx-auto gap-4">
      <div class="flex flex-row items-center">
        <Icon name="mdi:clipboard-clock-outline" class="w-8 h-8" />
        <h1 class="pl-2 text-lg font-bold">Daily Tracker</h1>
      </div>
      <div class="flex flex-row items-center justify-start gap-2 flex-1">
        <!-- TODO: add page transition or no?? -->
        <NuxtLink to="/">
          Tasks
        </NuxtLink>
        <NuxtLink to="/calendar">
          Calendar
        </NuxtLink>
      </div>
      <div class="flex flex-row items-center">
        <button @click="handleExport" aria-label="Export tasks"
          class="p-2 rounded-s font-semibold flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Icon name="mdi:download" class="w-5 h-5" />
        </button>
        <button @click="handleImport" aria-label="Import tasks"
          class="p-2 rounded-e font-semibold flex items-center justify-center text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Icon name="mdi:upload" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>
