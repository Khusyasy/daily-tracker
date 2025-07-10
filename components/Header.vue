<script setup>

</script>

<template>
  <header class="w-screen px-2 py-4 text-green-600 border-b border-green-800 bg-white shadow">
    <div class="flex flex-row items-center justify-between h-full max-w-4xl mx-auto">
      <div class="flex flex-row items-center">
        <Icon name="mdi:clipboard-clock-outline" class="w-8 h-8" />
        <h1 class="pl-2 text-lg font-bold">Daily Tracker</h1>
      </div>
      <div>
        <!-- TODO: make the cross platform sync -->
        <!-- <button
          class="flex items-center px-4 py-2 text-sm font-semibold bg-green-200 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Icon name="mdi:sync" class="w-4 h-4 text-green-600" />
          Sync
        </button> -->
      </div>
    </div>
  </header>
</template>
