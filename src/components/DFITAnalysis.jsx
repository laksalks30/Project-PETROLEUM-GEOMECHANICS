import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts'
import { Activity } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0d1e3d', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, padding: '6px 10px', fontSize: 11 }}>
        <div style={{ color: '#94a3b8', marginBottom: 2 }}>Time: {label} min</div>
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

export default function DFITAnalysis({ dfit }) {
  if (!dfit) return <CardSkeleton />

  const data = dfit.pressure_curve || []

  return (
    <div className="card h-full flex flex-col" id="panel-dfit">
      <div className="card-title flex items-center gap-2">
        <Activity size={10} />
        DFIT Analysis — Pressure Decline
      </div>
      <div className="flex-1 p-2">
        <div className="flex gap-4 mb-1 flex-wrap">
          <RefItem label="Breakdown" value={dfit.breakdown_psi} color="#ef4444" />
          <RefItem label="ISIP"      value={dfit.ISIP_psi}      color="#f59e0b" />
          <RefItem label="Closure"   value={dfit.closure_psi}   color="#22c55e" />
          <RefItem label="Res. Pres" value={dfit.reservoir_pressure_psi} color="#3b82f6" />
        </div>
        <div style={{ height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(59,130,246,0.1)" />
              <XAxis dataKey="time_min" tick={{ fill: '#64748b', fontSize: 9 }} label={{ value: 'Time (min)', position: 'insideBottom', fill: '#64748b', fontSize: 9, dy: 8 }} />
              <YAxis domain={[4000, 9000]} tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={dfit.breakdown_psi}         stroke="#ef4444" strokeDasharray="3 3" label={{ value: `BD ${dfit.breakdown_psi}`, fill: '#ef4444', fontSize: 8, position: 'right' }} />
              <ReferenceLine y={dfit.ISIP_psi}             stroke="#f59e0b" strokeDasharray="3 3" label={{ value: `ISIP ${dfit.ISIP_psi}`, fill: '#f59e0b', fontSize: 8, position: 'right' }} />
              <ReferenceLine y={dfit.closure_psi}          stroke="#22c55e" strokeDasharray="3 3" label={{ value: `Closure ${dfit.closure_psi}`, fill: '#22c55e', fontSize: 8, position: 'right' }} />
              <ReferenceLine y={dfit.reservoir_pressure_psi} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: `Pp ${dfit.reservoir_pressure_psi}`, fill: '#3b82f6', fontSize: 8, position: 'right' }} />
              <Line type="monotone" dataKey="pressure_psi" name="Pressure" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-1">
          <InfoItem label="Injected Volume" value={`${dfit.injected_volume_bbl} bbl`} />
          <InfoItem label="Injection Rate"  value={`${dfit.injection_rate_bpm} bpm`} />
          <InfoItem label="DFIT Closure"    value={`${dfit.closure_psi?.toLocaleString()} psi`} />
        </div>
      </div>
    </div>
  )
}

function RefItem({ label, value, color }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-3 h-0.5" style={{ background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 9, color: '#94a3b8' }}>{label}:</span>
      <span style={{ fontSize: 9, color, fontWeight: 700 }}>{value?.toLocaleString()}</span>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div style={{ fontSize: 10 }}>
      <span style={{ color: '#64748b' }}>{label}: </span>
      <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function CardSkeleton() {
  return <div className="card h-full animate-pulse"><div className="card-title">DFIT Analysis</div></div>
}
