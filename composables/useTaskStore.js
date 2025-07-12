export const parseTasks = (string) => {
  const parsed = string ? JSON.parse(string) : []
  parsed.forEach(task => {
    if (task.lastCheckin) {
      task.lastCheckin = new Date(task.lastCheckin)
      delete task.done
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
