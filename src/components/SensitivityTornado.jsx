import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp } from 'lucide-react'

const DEFAULT_SENSITIVITY = [
  { parameter: 'Net Pressure',         impact_pct: 52 },
  { parameter: 'Fracture Height',      impact_pct: 20 },
  { parameter: 'Plane-Strain Modulus', impact_pct: 11 },
  { parameter: 'Fluid Efficiency',     impact_pct: 7 },
  { parameter: 'Fluid Volume',         impact_pct: 6 },
  { parameter: 'Leakoff',              impact_pct: 4 },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0d1e3d', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, padding: '6px 10px', fontSize: 11 }}>
        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{payload[0]?.payload?.parameter}</div>
        <div style={{ color: '#3b82f6' }}>Impact: {payload[0]?.value}%</div>
      </div>
    )
  }
  return null
}

export default function SensitivityTornado({ sensitivity }) {
  const rawData = sensitivity?.sensitivity || DEFAULT_SENSITIVITY
  const data = [...rawData].sort((a, b) => b.impact_pct - a.impact_pct)

  const getColor = (impact) => {
    if (impact >= 40) return '#ef4444'
    if (impact >= 15) return '#f59e0b'
    if (impact >= 8)  return '#3b82f6'
    return '#22c55e'
  }

  return (
    <div className="card h-full flex flex-col" id="panel-sensitivity">
      <div className="card-title flex items-center gap-2">
        <TrendingUp size={10} />
        Sensitivity — Fracture Half-Length (xf)
      </div>
      <div className="flex-1 p-2">
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 90, bottom: 0 }}
              barSize={8}
            >
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(59,130,246,0.1)" horizontal={false} />
              <XAxis type="number" domain={[0, 60]} tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={v => `${v}%`} label={{ value: 'Impact on Half-Length (%)', position: 'insideBottom', fill: '#64748b', fontSize: 9, dy: 8 }} />
              <YAxis type="category" dataKey="parameter" tick={{ fill: '#94a3b8', fontSize: 9 }} width={88} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="rgba(59,130,246,0.3)" />
              <Bar dataKey="impact_pct" name="Impact %">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.impact_pct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex gap-2 mt-1 flex-wrap">
          <LegendItem color="#ef4444" label="High Impact (≥40%)" />
          <LegendItem color="#f59e0b" label="Med (15-40%)" />
          <LegendItem color="#3b82f6" label="Low (8-15%)" />
          <LegendItem color="#22c55e" label="Minor (<8%)" />
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
      <span style={{ fontSize: 9, color: '#64748b' }}>{label}</span>
    </div>
  )
}
