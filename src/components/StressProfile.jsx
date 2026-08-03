import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts'
import { Layers } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0d1e3d', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, padding: '6px 10px', fontSize: 11 }}>
        <div style={{ color: '#94a3b8', marginBottom: 2 }}>TVD: {label?.toLocaleString()} ft</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value?.toLocaleString()} psi
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function StressProfile({ stressProfile }) {
  if (!stressProfile) return <div className="card h-full animate-pulse"><div className="card-title">Stress Profile vs Depth</div></div>

  const data = stressProfile.vs_depth || []
  const reservoirTop = stressProfile.reservoir_top_ft
  const reservoirBase = stressProfile.reservoir_base_ft

  return (
    <div className="card h-full flex flex-col" id="panel-stress-profile">
      <div className="card-title flex items-center gap-2">
        <Layers size={10} />
        Stress Profile vs Depth
      </div>
      <div className="flex-1 p-2">
        {/* Legend */}
        <div className="flex gap-3 mb-1 flex-wrap">
          {[
            { label: 'Shmin', color: '#22c55e' },
            { label: 'SHmax', color: '#f59e0b' },
            { label: 'Sv',    color: '#94a3b8' },
            { label: 'Pp',    color: '#3b82f6' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: color }} />
              <span style={{ fontSize: 9, color: '#94a3b8' }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} layout="vertical" margin={{ top: 0, right: 60, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(59,130,246,0.1)" horizontal={false} />
              <XAxis type="number" domain={[2000, 12000]} tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="tvd_ft" type="number" reversed domain={[9500, 10200]} tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={v => `${v}`} width={42} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={reservoirTop}  stroke="#a855f7" strokeDasharray="3 2" />
              <ReferenceLine y={reservoirBase} stroke="#a855f7" strokeDasharray="3 2" />
              <Line dataKey="Shmin_psi" name="Shmin" stroke="#22c55e" strokeWidth={2} dot={false} type="monotone" />
              <Line dataKey="SHmax_psi" name="SHmax" stroke="#f59e0b" strokeWidth={2} dot={false} type="monotone" />
              <Line dataKey="Sv_psi"    name="Sv"    stroke="#94a3b8" strokeWidth={1.5} dot={false} type="monotone" strokeDasharray="4 2" />
              <Line dataKey="Pp_psi"    name="Pp"    stroke="#3b82f6" strokeWidth={1.5} dot={false} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Barrier markers */}
        <div className="flex gap-2 mt-1">
          <BarrierBadge label="Upper Barrier" value="8,267 psi" color="#f59e0b" />
          <BarrierBadge label="Reservoir (Shmin)" value="7,107 psi" color="#22c55e" />
          <BarrierBadge label="Lower Barrier" value="7,977 psi" color="#ef4444" />
        </div>
      </div>
    </div>
  )
}

function BarrierBadge({ label, value, color }) {
  return (
    <div style={{ fontSize: 9, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 6px' }}>
      <div style={{ color: '#94a3b8' }}>{label}</div>
      <div style={{ color, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
