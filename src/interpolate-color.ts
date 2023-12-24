const startColor = '#fbe2e2'
const endColor = '#6a0909'

export function interpolateColor(size: number, maxViolation: number): string {
  const normalizedPopulation = size / maxViolation

  const r1 = parseInt(startColor.slice(1, 3), 16)
  const g1 = parseInt(startColor.slice(3, 5), 16)
  const b1 = parseInt(startColor.slice(5, 7), 16)

  const r2 = parseInt(endColor.slice(1, 3), 16)
  const g2 = parseInt(endColor.slice(3, 5), 16)
  const b2 = parseInt(endColor.slice(5, 7), 16)

  const r = Math.round((1 - normalizedPopulation) * r1 + normalizedPopulation * r2)
  const g = Math.round((1 - normalizedPopulation) * g1 + normalizedPopulation * g2)
  const b = Math.round((1 - normalizedPopulation) * b1 + normalizedPopulation * b2)

  const rStr = r.toString(16).padStart(2, '0')
  const gStr = g.toString(16).padStart(2, '0')
  const bStr = b.toString(16).padStart(2, '0')

  return `#${rStr}${gStr}${bStr}`
}
