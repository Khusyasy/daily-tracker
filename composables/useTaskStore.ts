export const useTaskStore = () => {
  const tasks = useState<TasksType>('tasks', () => {
    const saved = localStorage.getItem('tasks')
    const parsed = saved ? JSON.parse(saved) : []
    const res = TasksSchema.safeParse(parsed)
    if (!res.success) {
      return []
    } else {
      return res.data
    }
  })

  const checkins = useState<CheckinsType>('checkins', () => {
    const saved = localStorage.getItem('checkins')
    const parsed = saved ? JSON.parse(saved) : []
    const res = CheckinsSchema.safeParse(parsed)
    if (!res.success) {
      return []
    } else {
      return res.data
    }
  })

  watch(tasks, (val) => {
    localStorage.setItem('tasks', JSON.stringify(val))
  }, { deep: true })

  watch(checkins, (val) => {
    localStorage.setItem('checkins', JSON.stringify(val))
  }, { deep: true })

  return { tasks, checkins }
}
