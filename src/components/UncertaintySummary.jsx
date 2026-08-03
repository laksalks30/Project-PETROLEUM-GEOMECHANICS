import React from 'react'
import { BarChart2 } from 'lucide-react'

const PARAM_LABELS = {
  Shmin:             'Shmin',
  Breakdown:         'Breakdown Pres.',
  Half_length:       'Half-Length (ft)',
  Surface_pressure:  'Surface Pressure',
  Fluid_efficiency:  'Fluid Efficiency',
  Fracture_height:   'Fracture Height',
}

export default function UncertaintySummary({ uncertainty }) {
  if (!uncertainty) return <div className="card h-full animate-pulse"><div className="card-title">Uncertainty Summary</div></div>

  const rows = Object.entries(uncertainty).map(([key, val]) => ({
    param: PARAM_LABELS[key] || key,
    P10: val.P10,
    P50: val.P50,
    P90: val.P90,
    unit: val.unit,
  }))

  return (
    <div className="card h-full flex flex-col" id="panel-uncertainty">
      <div className="card-title flex items-center gap-2">
        <BarChart2 size={10} />
        Uncertainty Summary (P10/P50/P90)
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="tbl">
          <thead>
            <tr>
              <th>Parameter</th>
              <th style={{ color: '#22c55e' }}>P10</th>
              <th style={{ color: '#3b82f6' }}>P50</th>
              <th style={{ color: '#ef4444' }}>P90</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ param, P10, P50, P90, unit }) => (
              <tr key={param}>
                <td style={{ fontSize: 10 }}>{param}</td>
                <td style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>{formatVal(P10)}</td>
                <td style={{ fontSize: 10, color: '#3b82f6', fontWeight: 600 }}>{formatVal(P50)}</td>
                <td style={{ fontSize: 10, color: '#ef4444', fontWeight: 600 }}>{formatVal(P90)}</td>
                <td style={{ fontSize: 9, color: '#475569' }}>{unit || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatVal(v) {
  if (v === undefined || v === null) return '—'
  if (typeof v === 'number' && v >= 1) return v.toLocaleString()
  return v
}
