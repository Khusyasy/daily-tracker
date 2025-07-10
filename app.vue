<script setup>
  import { dateFromNow, dateToNow } from './utils/date'

  useHead({
    title: 'My Vue App',
    meta: [
      { name: 'description', content: 'A simple Vue.js application' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  })

  const { tasks, checkins } = useTaskStore()

  const form = ref({
    task: '',
    url: '',
    refreshTime: '',
  })

  function handleSubmit() {
    tasks.value.push({
      id: generateId(),
      task: form.value.task,
      url: form.value.url,
      refreshTime: form.value.refreshTime,
      lastCheckin: null,
      done: false,
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
    if (task) {
      const now = new Date()
      task.lastCheckin = now
      task.done = true
      checkins.value.push({
        taskId: task.id,
        time: now,
      })
    }
  }
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />

    <div class="flex flex-row items-center justify-center w-full max-w-4xl my-4 mx-auto gap-2">
      <div class="flex-1">
        <label for="task" class="block text-sm font-medium text-gray-700">
          Task
        </label>
        <input v-model="form.task" type="text" id="task" name="task" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
      </div>

      <div class="flex-1">
        <label for="url" class="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input v-model="form.url" type="url" id="url" name="url"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
      </div>

      <div class="flex-1">
        <label for="refresh-time" class="block text-sm font-medium text-gray-700">
          Refresh Time (local time)
        </label>
        <input v-model="form.refreshTime" type="time" id="refresh-time" name="refresh-time"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
      </div>

      <div>
        <button @click.prevent="handleSubmit" type="button"
          class="flex items-center justify-center w-12 h-12 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Icon name="mdi:plus" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="max-w-4xl mx-auto my-4">
      <h2 class="text-lg font-semibold text-gray-800">Tasks</h2>
      <ul class="mt-2 space-y-2">
        <li v-for="task in tasks" :key="task.id" class="bg-white rounded shadow">
          <a class="flex items-center justify-between p-4 gap-4" :href="task.url" target="_blank"
            rel="noopener noreferrer" @click="task.done ? null : checkinTask(task.id)">
            <div class="flex-1 flex flex-row items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ task.task }}
              </h3>
              <div class="flex flex-row gap-2">
                <p v-if="task.done" class="text-md text-green-600 flex items-center justify-center">
                  <Icon name="mdi:check" class="inline-block w-5 h-5 mr-1" />
                  {{ dateFromNow(task.lastCheckin) }}
                </p>
                <p class="text-md text-gray-600 flex items-center justify-center">
                  <Icon name="mdi:refresh" class="inline-block w-5 h-5 mr-1" />
                  {{ task.refreshTime }}
                </p>
              </div>
            </div>
            <div>
              <button @click.prevent="task.done ? null : checkinTask(task.id)"
                class="text-green-600 hover:text-green-800 px-4 py-2 rounded-s bg-green-50 hover:bg-green-100"
                :class="{ 'opacity-50 cursor-not-allowed': task.done }">
                <Icon v-if="task.done" name="mdi:check-bold" class="w-5 h-5" />
                <Icon v-else name="mdi:send" class="w-5 h-5" />
              </button>
              <button @click.prevent="removeTask(task.id)"
                class="text-red-600 hover:text-red-800 px-4 py-2 rounded-e bg-red-50 hover:bg-red-100">
                <Icon name="mdi:delete" class="w-5 h-5" />
              </button>
            </div>
          </a>
        </li>
        <li v-if="tasks.length === 0" class="text-gray-500 text-center p-4">
          No tasks added yet.
        </li>
      </ul>
    </div>
  </div>
</template>
