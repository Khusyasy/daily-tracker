<script setup>
const { tasks, checkins } = useTaskStore()

const SAVE_VERSION = '1.0'

function handleExport() {
  const now = new Date()
  const data = JSON.stringify({
    version: SAVE_VERSION,
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

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (!data.version || data.version !== SAVE_VERSION) {
            alert(`Incompatible file version: ${data.version}. Expected version: ${SAVE_VERSION}.`)
            return
          }
          if (data.tasks) {
            transformTasks(data.tasks).forEach(task => {
              const existingTask = tasks.value.find(t => t.id === task.id)
              if (existingTask) {
                Object.assign(existingTask, task)
              } else {
                tasks.value.push(task)
              }
            })
          }
          if (data.checkins) {
            transformCheckins(data.checkins).forEach(checkin => {
              const existingCheckin = checkins.value.find(c => c.id === checkin.id)
              if (existingCheckin) {
                Object.assign(existingCheckin, checkin)
              } else {
                checkins.value.push(checkin)
              }
            })
          }
        } catch (error) {
          console.error('Invalid JSON file:', error)
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}
</script>

<template>
  <header class="w-screen px-2 py-4 text-green-800 border-b border-green-800 bg-white shadow">
    <div class="flex flex-row items-center justify-between h-full max-w-4xl mx-auto">
      <div class="flex flex-row items-center">
        <Icon name="mdi:clipboard-clock-outline" class="w-8 h-8" />
        <h1 class="pl-2 text-lg font-bold">Daily Tracker</h1>
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
