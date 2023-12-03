import React from 'react'
import { IViolation } from '../violation'

export function ViolationsTable(props: { region: string; violations: IViolation[] }) {
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
          {props.violations.map((item, index) => (
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
