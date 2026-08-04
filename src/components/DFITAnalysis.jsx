import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { Activity } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
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
        <div style={{ color: '#94a3b8', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>TIME: {label} MIN</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span>{p.name.toUpperCase()}</span>
            <span>{p.value?.toLocaleString()} psi</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function DFITAnalysis({ dfit }) {
  if (!dfit) return <CardSkeleton />

  const data = dfit.pressure_curve || []

  return (
    <div className="card h-full flex flex-col" id="panel-dfit" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <Activity size={12} color="#38bdf8" />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>DFIT ANALYSIS — PRESSURE DECLINE</span>
      </div>
      
      <div className="flex-1 p-2.5 flex flex-col gap-3">
        {/* Top References */}
        <div className="flex gap-4 flex-wrap px-3 py-2 rounded-lg" style={{ background: 'rgba(7,15,34,0.6)', border: '1px solid rgba(30,41,59,0.8)' }}>
          <RefItem label="BREAKDOWN" value={dfit.breakdown_psi} color="#ef4444" />
          <RefItem label="ISIP"      value={dfit.ISIP_psi}      color="#f59e0b" />
          <RefItem label="CLOSURE"   value={dfit.closure_psi}   color="#22c55e" />
          <RefItem label="RES PRES"  value={dfit.reservoir_pressure_psi} color="#3b82f6" />
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 min-h-[140px] w-full" style={{ paddingRight: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time_min" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} tickLine={false} axisLine={{ stroke: '#334155' }} label={{ value: 'TIME (MIN)', position: 'insideBottom', fill: '#475569', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', dy: 10 }} />
              <YAxis domain={[4000, 9500]} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(56,189,248,0.2)', strokeWidth: 2 }} />
              <ReferenceLine y={dfit.breakdown_psi}         stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: `BD ${dfit.breakdown_psi}`, fill: '#ef4444', fontSize: 9, position: 'right', fontWeight: 700 }} />
              <ReferenceLine y={dfit.ISIP_psi}             stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: `ISIP ${dfit.ISIP_psi}`, fill: '#f59e0b', fontSize: 9, position: 'right', fontWeight: 700 }} />
              <ReferenceLine y={dfit.closure_psi}          stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: `Closure ${dfit.closure_psi}`, fill: '#22c55e', fontSize: 9, position: 'right', fontWeight: 700 }} />
              <ReferenceLine y={dfit.reservoir_pressure_psi} stroke="#3b82f6" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: `Pp ${dfit.reservoir_pressure_psi}`, fill: '#3b82f6', fontSize: 9, position: 'right', fontWeight: 700 }} />
              <Line type="monotone" dataKey="pressure_psi" name="Pressure" stroke="#0ea5e9" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#0a1428', stroke: '#38bdf8', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Bottom Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          <MetricBox label="Injected Volume" value={`${dfit.injected_volume_bbl} bbl`} color="#8b5cf6" />
          <MetricBox label="Injection Rate"  value={`${dfit.injection_rate_bpm} bpm`} color="#06b6d4" />
          <MetricBox label="DFIT Closure"    value={`${dfit.closure_psi?.toLocaleString()} psi`} color="#22c55e" highlight />
        </div>
      </div>
    </div>
  )
}

function RefItem({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ fontSize: 8, color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>{label}:</span>
      <span style={{ fontSize: 10, color: '#f8fafc', fontWeight: 800 }}>{value?.toLocaleString()}</span>
    </div>
  )
}

function MetricBox({ label, value, color, highlight }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg" style={{ 
      background: highlight ? 'rgba(34,197,94,0.05)' : 'rgba(7,15,34,0.6)',
      border: `1px solid ${highlight ? 'rgba(34,197,94,0.2)' : 'rgba(30,41,59,0.8)'}`,
      borderTop: `2px solid ${highlight ? '#22c55e' : color}`
    }}>
      <span style={{ fontSize: 8, color: highlight ? '#22c55e' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 13, color: highlight ? '#22c55e' : '#f8fafc', fontWeight: 800, marginTop: 2, letterSpacing: '0.02em' }}>{value}</span>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card h-full animate-pulse flex flex-col" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      <div className="h-8 border-b" style={{ borderColor: 'rgba(30,41,59,0.8)' }} />
      <div className="flex-1 flex items-center justify-center">
        <span style={{ color: '#334155', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>LOADING DFIT...</span>
      </div>
    </div>
  )
}
