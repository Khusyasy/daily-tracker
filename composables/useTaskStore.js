export const parseTasks = (string) => {
  // const parsed = string ? JSON.parse(string) : []
  // DUMMY DATA
  const parsed = [
    {
      id: 'ABCD',
      task: 'Task 1',
      url: 'https://example.com',
      lastCheckin: '2025-07-12T06:00:00Z',
      refreshTime: '12:00',
    },
    {
      id: 'EFGH',
      task: 'Task 2',
      url: 'https://example.com',
      lastCheckin: '2025-07-11T00:00:00Z',
      refreshTime: '14:30',
    },
  ]
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

      // last checkin is within 24 hours
      const diff = getMSDiff(task.lastCheckin, refreshDate);
      task.done = diff <= MS_DAY;
    }
  })
  return parsed;
}

export const parseCheckins = (string) => {
  // const parsed = string ? JSON.parse(string) : []
  // DUMMY DATA
  const parsed = [
    {
      taskId: 'EFGH',
      time: '2025-07-08T00:00:00Z',
    },
    {
      taskId: 'ABCD',
      time: '2025-07-08T00:00:00Z',
    },
    {
      taskId: 'EFGH',
      time: '2025-07-09T00:00:00Z',
    },
    {
      taskId: 'ABCD',
      time: '2025-07-10T00:00:00Z',
    },
    {
      taskId: 'EFGH',
      time: '2025-07-10T00:00:00Z',
    },
    {
      taskId: 'EFGH',
      time: '2025-07-11T00:00:00Z',
    },
    {
      taskId: 'ABCD',
      time: '2025-07-11T00:00:00Z',
    },
    {
      taskId: 'ABCD',
      time: '2025-07-12T00:00:00Z',
    },
    {
      taskId: 'EFGH',
      time: '2025-07-12T00:00:00Z',
    },
  ]
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
