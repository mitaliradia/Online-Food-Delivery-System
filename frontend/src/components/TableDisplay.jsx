"use client"

import { useState } from "react"

function TableDisplay({ tableName, tableData }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!tableData || tableData.length === 0) {
    return (
      <div className="table-container">
        <h3 className="table-name">{tableName}</h3>
        <p>No data available</p>
      </div>
    )
  }

  // Get column names from the first row
  const columns = Object.keys(tableData[0])

  return (
    <div className="table-container">
      <div className="table-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="table-name">{tableName}</h3>
        <span className="table-toggle">
          <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
        </span>
      </div>

      {isExpanded && (
        <div className="table-content">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column}`}>{row[column] !== null ? String(row[column]) : "NULL"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TableDisplay
