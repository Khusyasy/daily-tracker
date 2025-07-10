import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const dateFromNow = (date) => {
  if (!date) return ''
  return dayjs(date).fromNow()
}

export const dateToNow = (date) => {
  if (!date) return ''
  return dayjs(date).toNow()
}
