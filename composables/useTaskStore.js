export const transformTasks = (arr) => {
  return arr.map(task => {
    if (task.lastCheckin) {
      task.lastCheckin = new Date(task.lastCheckin)
    }
    delete task.done
    delete task.refreshDate
    return task
  })
}

export const transformCheckins = (arr) => {
  return arr.map(checkin => {
    checkin.time = new Date(checkin.time)
    return checkin
  })
}

export const useTaskStore = () => {
  const tasks = useState('tasks', () => {
    const saved = localStorage.getItem('tasks')
    const parsed = saved ? JSON.parse(saved) : []
    return transformTasks(parsed)
  })

  const checkins = useState('checkins', () => {
    const saved = localStorage.getItem('checkins')
    const parsed = saved ? JSON.parse(saved) : []
    return transformCheckins(parsed)
  })

  watch(tasks, (val) => {
    localStorage.setItem('tasks', JSON.stringify(val))
  }, { deep: true })

  watch(checkins, (val) => {
    localStorage.setItem('checkins', JSON.stringify(val))
  }, { deep: true })

  return { tasks, checkins }
}
