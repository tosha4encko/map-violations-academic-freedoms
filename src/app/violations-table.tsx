import React, { useMemo, useState } from 'react'
import { applyFiltersToList, IViolation } from '../violation'
import { isNotion } from '../is-notion'
import { Input } from 'antd'

export function ViolationsTable(props: { region: string; violations: IViolation[] }) {
  const [filterStr, setFilterStr] = useState('')

  const currentViolations = useMemo(
    () => applyFiltersToList(props.violations, { filterStr }),
    [props.violations, filterStr],
  )

  if (props.violations.length === 0) {
    return null
  }

  return (
    <div
      className={isNotion() ? 'violations-table-container notion' : 'violations-table-container'}
    >
      {!isNotion() ? <h3 className="violations-table-title"> {props.region}</h3> : null}
      <Input.Search
        size={isNotion() ? 'small' : 'middle'}
        style={{ maxWidth: '60%', display: 'flex', margin: '10px auto' }}
        value={filterStr}
        onChange={(ev) => setFilterStr(ev.target.value)}
      />
      {Object.keys(currentViolations).length ? (
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
      ) : null}
    </div>
  )
}
