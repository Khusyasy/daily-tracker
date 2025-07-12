import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export const MS_SEC = 1000;
export const MS_MIN = 60 * MS_SEC;
export const MS_HOUR = 60 * MS_MIN;
export const MS_DAY = 24 * MS_HOUR;

dayjs.extend(relativeTime)

export const dateFromNow = (date) => {
  if (!date) return ''
  return dayjs(date).fromNow()
}

export const dateToNow = (date) => {
  if (!date) return ''
  return dayjs(date).toNow()
}

export const timeFormat = (date) => {
  if (!date) return ''
  return dayjs(date).format('HH:mm:ss')
}

export const getMSDiff = (date1, date2) => {
  if (!date1 || !date2) return 0
  return Math.abs(dayjs(date1).diff(dayjs(date2)))
}
