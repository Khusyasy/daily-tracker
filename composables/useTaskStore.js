import { parse } from "vue/compiler-sfc";

const MS_SEC = 1000;
const MS_MIN = 60 * MS_SEC;
const MS_HOUR = 60 * MS_MIN;
const MS_DAY = 24 * MS_HOUR;

export const parseTasks = (string) => {
  const parsed = string ? JSON.parse(string) : []
  parsed.forEach(task => {
    if (task.lastCheckin) {
      task.lastCheckin = new Date(task.lastCheckin)

      // get the next refresh date
      const [hours, minutes] = task.refreshTime.split(':').map(Number);
      const refreshDate = new Date();
      const today = new Date();
      refreshDate.setHours(hours, minutes, 0, 0);
      if (refreshDate < today) {
        refreshDate.setDate(refreshDate.getDate() + 1);
      }
      task.refreshDate = refreshDate;

      // last checkin is within 24 hours
      const diff = Math.abs(task.lastCheckin.getTime() - refreshDate.getTime());
      task.done = diff <= MS_DAY;
    }
  })
  return parsed;
}

export const parseCheckins = (string) => {
  const parsed = string ? JSON.parse(string) : []
  parsed.forEach(checkin => {
    checkin.time = new Date(checkin.time)
  })
  return parsed;
}

export const useTaskStore = () => {
  const tasks = useState('tasks', () => {
    const saved = localStorage.getItem('tasks')
    const parsed = parseTasks(saved)
    return parsed
  })

  const checkins = useState('checkins', () => {
    const saved = localStorage.getItem('checkins')
    const parsed = parseCheckins(saved)
    return parsed
  })

  watch(tasks, (val) => {
    localStorage.setItem('tasks', JSON.stringify(val))
  }, { deep: true })

  watch(checkins, (val) => {
    localStorage.setItem('checkins', JSON.stringify(val))
  }, { deep: true })

  return { tasks, checkins }
}
