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
      <div style={{
        background: 'rgba(7,15,34,0.95)',
        border: '1px solid rgba(56,189,248,0.3)',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 11,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ color: '#94a3b8', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{payload[0]?.payload?.parameter}</div>
        <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: 13 }}>IMPACT: {payload[0]?.value}%</div>
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
    if (impact >= 8)  return '#38bdf8'
    return '#22c55e'
  }

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-sensitivity" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <TrendingUp size={12} color="#38bdf8" />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>SENSITIVITY — FRACTURE HALF-LENGTH (XF)</span>
      </div>

      <div className="flex-1 p-2.5 flex flex-col gap-2">
        <div className="flex-1 min-h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
              barSize={12}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 60]} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} tickLine={false} axisLine={{ stroke: '#334155' }} tickFormatter={v => `${v}%`} label={{ value: 'IMPACT ON HALF-LENGTH (%)', position: 'insideBottom', fill: '#475569', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', dy: 10 }} />
              <YAxis type="category" dataKey="parameter" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} tickLine={false} axisLine={false} width={98} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56,189,248,0.05)' }} />
              <ReferenceLine x={0} stroke="rgba(56,189,248,0.2)" />
              <Bar dataKey="impact_pct" name="Impact %" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.impact_pct)} style={{ filter: `drop-shadow(0 0 4px ${getColor(entry.impact_pct)}80)` }} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-3 mt-2 flex-wrap">
          <LegendItem color="#ef4444" label="HIGH (≥40%)" />
          <LegendItem color="#f59e0b" label="MED (15-40%)" />
          <LegendItem color="#38bdf8" label="LOW (8-15%)" />
          <LegendItem color="#22c55e" label="MINOR (<8%)" />
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ fontSize: 8, color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>{label}</span>
    </div>
  )
}
