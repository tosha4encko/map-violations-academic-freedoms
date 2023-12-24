import dayjs from 'dayjs'

export function toTimestamp(dateString: string, format = 'DD.MM.YYYY'): number {
  const td = dayjs(dateString, format)

  return td.valueOf()
}
