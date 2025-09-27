<script setup>

const now = ref(new Date())
const year = computed(() => now.value.getFullYear())
const month = computed(() => now.value.getMonth() + 1)
const firstDayOfMonth = computed(() => new Date(year.value, month.value - 1, 1).getDay())
const daysInMonth = computed(() => new Date(year.value, month.value, 0).getDate())
const emptyDaysComplete = computed(() => {
  const total = firstDayOfMonth.value + daysInMonth.value
  return total % 7 === 0 ? 0 : 7 - (total % 7)
})

function prevMonth() {
  if (month.value === 1) {
    now.value = new Date(year.value - 1, 11, 1)
  } else {
    now.value = new Date(year.value, month.value - 2, 1)
  }
}

function nextMonth() {
  if (month.value === 12) {
    now.value = new Date(year.value + 1, 0, 1)
  } else {
    now.value = new Date(year.value, month.value, 1)
  }
}

const { tasks, checkins } = useTaskStore()
// TODO: implement task and checkins display in calendar

</script>

<template>
  <div>
    <div class="max-w-4xl mx-auto my-4">
      <h2 class="text-lg font-semibold text-gray-800">
        Calendar View
      </h2>
      <div class="flex flex-row items-center justify-center gap-2 p-2">
        <button @click="prevMonth"
          class="p-1 rounded-s font-semibold flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Icon name="mdi:chevron-left" class="w-4 h-4" />
        </button>
        <h3>{{ year }}-{{ month }}</h3>
        <button @click="nextMonth"
          class="p-1 rounded-e font-semibold flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Icon name="mdi:chevron-right" class="w-4 h-4" />
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <div class="font-bold text-center">Sun</div>
        <div class="font-bold text-center">Mon</div>
        <div class="font-bold text-center">Tue</div>
        <div class="font-bold text-center">Wed</div>
        <div class="font-bold text-center">Thu</div>
        <div class="font-bold text-center">Fri</div>
        <div class="font-bold text-center">Sat</div>
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="border p-2 h-20"></div>
        <div v-for="day in daysInMonth" :key="day" class="border p-2 h-20 flex flex-col">
          <div class="text-sm font-semibold mb-1">{{ day }}</div>
          <div class="flex-1 overflow-y-auto">
            <div class="text-xs bg-blue-100 rounded p-1 mb-1">Task 1</div>
          </div>
        </div>
        <div v-for="n in emptyDaysComplete" :key="'empty-complete-' + n" class="border p-2 h-20"></div>
      </div>
    </div>
  </div>
</template>
