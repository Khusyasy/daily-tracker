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
    return oldTask
  })
  data.version = 2
  return data
});

export function handleMigration(data: SaveType): SaveType {
  let currData = data
  while (currData.version < LATEST_SAVE_VERSION) {
    const migrate = MIGRATIONS.get(currData.version)
    if (!migrate) {
      console.error('Migration not found for version ' + currData.version)
      throw new Error('Migration not found for version ' + currData.version)
    }
    currData = migrate(currData)
  }
  return currData
}
