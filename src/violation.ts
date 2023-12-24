import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { toTimestamp } from './to-timestamp'
import { fetchGet } from './fetch-get'

dayjs.extend(customParseFormat)

export interface IViolation {
  readonly date: string
  readonly where: string
  readonly type: string
  readonly description: string
  readonly source: string
  readonly region: string
}

export type IViolations = Record<string, IViolation[]>

export function getViolations() {
  return fetchGet('violations.json')
}
export function getViolationTypes(violations: IViolations) {
  const violationTypes = Object.values(violations).reduce((acc, item) => {
    item.forEach(({ type }) => acc.add(type))

    return acc
  }, new Set<string>())

  return violationTypes
}

function* iterateViolations(violations: IViolations) {
  for (const vi of Object.values(violations)) {
    for (const item of vi) {
      yield item
    }
  }
}

export function getMetaViolations(violations: IViolations) {
  const violationMeta: { types: Set<string>; minDate: number; maxDate: number } = {
    types: new Set(),
    minDate: Number.MAX_SAFE_INTEGER,
    maxDate: 0,
  }

  for (const violation of iterateViolations(violations)) {
    violationMeta.types.add(violation.type)
    violationMeta.minDate = Math.min(violationMeta.minDate, toTimestamp(violation.date))
    violationMeta.maxDate = Math.max(violationMeta.maxDate, toTimestamp(violation.date))
  }

  return violationMeta
}

export function getMaxViolation(violations: IViolations): [number, string] {
  let maxViolation = 0
  let region = ''
  for (const key of Object.keys(violations)) {
    if (key.includes('Москва') || key.includes('Санкт-петербург')) {
      continue
    }
    if (maxViolation < violations[key].length) {
      maxViolation = Math.max(maxViolation, violations[key].length)
      region = key
    }
  }

  return [maxViolation, region]
}
