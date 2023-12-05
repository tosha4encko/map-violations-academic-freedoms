import React, { useMemo } from 'react'
import { IViolation, toTimestamp } from '../violation'
import dayjs from 'dayjs'

export function ViolationsTable(props: {
  region: string
  category?: string
  range?: [dayjs.Dayjs, dayjs.Dayjs]
  violations: IViolation[]
}) {
  const currentViolations = useMemo(() => {
    let currentViolations = props.violations
    if (props.category) {
      currentViolations = props.violations.filter(({ type }) => type === props.category)
    }
    if (props.range) {
      currentViolations = currentViolations.filter(({ date }) => {
        const current = toTimestamp(date)
        const b1 = props.range[0].valueOf()
        const b2 = props.range[1].valueOf()
        return current >= b1 && current <= b2
      })
    }

    return currentViolations
  }, [props.category, props.violations, props.range])

  return (
    <div className="violations-table-container">
      <h3 className="violations-table-title"> {props.region}</h3>
      <table className="violations-table-table">
        <thead>
          <tr>
            <th>Когда</th>
            <th>Где</th>
            <th>Что</th>
            <th>Источник</th>
          </tr>
        </thead>
        <tbody>
          {currentViolations.map((item, index) => (
            <tr key={index}>
              <td title={item.date} className="violations-table-table-date">
                {item.date}
              </td>
              <td title={item.where}>{item.where}</td>
              <td title={item.description} className="violations-table-table-description">
                {item.description}
              </td>
              <td title={item.source} className="violations-table-table-source">
                {item.source.includes('http') ? (
                  <a href={item.source}>{item.source}</a>
                ) : (
                  item.source
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
