import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts'
import { Layers } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0a101f', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, padding: '6px 10px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <div style={{ color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>TVD: {label?.toLocaleString()} ft</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, fontWeight: 500 }}>
            {p.name}: {p.value?.toLocaleString()} psi
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function StressProfile({ stressProfile }) {
  if (!stressProfile) return <CardSkeleton />

  const data = stressProfile.vs_depth || stressProfile.layers || []
  const reservoirTop = stressProfile.reservoir_top_ft || 9950
  const reservoirBase = stressProfile.reservoir_base_ft || 10050

  // Dynamically extract layer stresses
  const upperLayer = data.find(l => l.layer === "Upper Barrier")
  const reservoirLayer = data.find(l => l.layer === "Reservoir") || data.find(l => l.layer === "Target Interval")
  const lowerLayer = data.find(l => l.layer === "Lower Barrier")

  return (
    <div className="card h-full flex flex-col" id="panel-stress-profile">
      <div className="card-title text-[#38bdf8]" style={{ padding: '6px 10px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
        <div className="flex items-center gap-2">
          <Layers size={12} />
          STRESS PROFILE VS DEPTH
        </div>
      </div>
      
      <div className="flex-1 p-2 flex flex-col gap-2">
        {/* Legend */}
        <div className="flex gap-4 flex-wrap bg-[#0f172a] px-3 py-1.5 rounded-md border border-[#1e293b]">
          {[
            { label: 'Shmin', color: '#22c55e' },
            { label: 'SHmax', color: '#f59e0b' },
            { label: 'Sv',    color: '#94a3b8' },
            { label: 'Pp',    color: '#3b82f6' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, flexShrink: 0, opacity: 0.8 }} />
              <span style={{ fontSize: 11, color: '#f8fafc', fontWeight: 600, letterSpacing: '0.02em' }}>{label}</span>
            </div>
          ))}
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 min-h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[2000, 12000]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="tvd_ft" type="number" reversed domain={['dataMin', 'dataMax']} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={reservoirTop}  stroke="#a855f7" strokeDasharray="4 4" strokeOpacity={0.6} />
              <ReferenceLine y={reservoirBase} stroke="#a855f7" strokeDasharray="4 4" strokeOpacity={0.6} />
              <Line dataKey="Shmin_psi" name="Shmin" stroke="#22c55e" strokeWidth={2.5} dot={false} type="monotone" activeDot={{ r: 5, fill: '#22c55e', stroke: '#166534', strokeWidth: 2 }} />
              <Line dataKey="SHmax_psi" name="SHmax" stroke="#f59e0b" strokeWidth={2.5} dot={false} type="monotone" />
              <Line dataKey="Sv_psi"    name="Sv"    stroke="#64748b" strokeWidth={2} dot={false} type="monotone" strokeDasharray="4 4" />
              <Line dataKey="Pp_psi"    name="Pp"    stroke="#0ea5e9" strokeWidth={2} dot={false} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Barrier markers - Dynamically populated */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          <BarrierBadge label="Upper Barrier" value={upperLayer ? `${upperLayer.Shmin_psi.toLocaleString()} psi` : 'N/A'} color="#f59e0b" />
          <BarrierBadge label="Reservoir (Shmin)" value={reservoirLayer ? `${reservoirLayer.Shmin_psi.toLocaleString()} psi` : 'N/A'} color="#22c55e" />
          <BarrierBadge label="Lower Barrier" value={lowerLayer ? `${lowerLayer.Shmin_psi.toLocaleString()} psi` : 'N/A'} color="#ef4444" />
        </div>
      </div>
    </div>
  )
}

function BarrierBadge({ label, value, color }) {
  return (
    <div className="flex flex-col p-2 rounded-md" style={{
      background: 'rgba(15,23,42,0.6)',
      border: `1px solid ${color}25`,
      borderTop: `2px solid ${color}`,
    }}>
      <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: color, fontWeight: 800, marginTop: 2, textShadow: `0 0 12px ${color}50` }}>{value}</span>
    </div>
  )
}

function CardSkeleton() {
  return <div className="card h-full animate-pulse flex items-center justify-center"><span className="text-[#334155] font-bold text-xs">LOADING PROFILE...</span></div>
}
