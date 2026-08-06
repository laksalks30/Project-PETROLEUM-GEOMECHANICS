import React from 'react'
import { Gauge } from 'lucide-react'

export default function PressureComponents({ pressure }) {
  if (!pressure) return <div className="card h-full animate-pulse" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}><div className="card-title">LOADING PRESSURE...</div></div>

  const components = [
    { label: 'FRACTURE PRESSURE',    value: pressure.Pf_psi,       unit: 'psi', color: '#22c55e', highlight: false },
    { label: 'PERF FRICTION',        value: pressure.DeltaPperf_psi, unit: 'psi', color: '#f59e0b', highlight: false },
    { label: 'NWB TORTUOSITY',       value: pressure.DeltaPNWB_psi,  unit: 'psi', color: '#f59e0b', highlight: false },
    { label: 'BHTP',                 value: pressure.BHTP_psi,      unit: 'psi', color: '#ef4444', highlight: true },
    { label: 'HYDROSTATIC',          value: pressure.Phyd_psi,      unit: 'psi', color: '#3b82f6', highlight: false },
    { label: 'TUBING FRICTION',      value: pressure.DeltaPtubing_psi, unit: 'psi', color: '#f59e0b', highlight: false },
    { label: 'SURFACE TREATING',     value: pressure.Psurface_psi,  unit: 'psi', color: '#06b6d4', highlight: true },
  ]

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-pressure" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <Gauge size={12} color="#38bdf8" />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>PRESSURE COMPONENTS</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-2">
        {/* Pressure waterfall bars */}
        <div className="bg-[#070f22] p-2.5 rounded-lg border border-[#1e293b]">
          <PressureBar label="Shmin" value={pressure.Shmin_psi} max={12000} color="#22c55e" />
          <PressureBar label="+ Pnet" value={pressure.Pnet_psi} max={12000} color="#38bdf8" prefix="+" />
          <PressureBar label="+ ΔP perf" value={pressure.DeltaPperf_psi} max={12000} color="#f59e0b" prefix="+" />
          <PressureBar label="+ NWB" value={pressure.DeltaPNWB_psi} max={12000} color="#f59e0b" prefix="+" />
        </div>
        
        <div className="flex flex-col gap-1">
          {components.map(({ label, value, unit, color, highlight }) => (
            <div key={label} className="flex justify-between items-center px-2 py-2 rounded-md" style={{
              background: highlight ? `${color}15` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${highlight ? color + '40' : 'rgba(255,255,255,0.02)'}`,
              borderLeft: highlight ? `2px solid ${color}` : 'none',
              paddingLeft: highlight ? 8 : 10
            }}>
              <span style={{ fontSize: 10, color: highlight ? color : '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>{label}</span>
              <span style={{ fontSize: 12, color: highlight ? color : '#f8fafc', fontWeight: 800, letterSpacing: '0.02em' }}>
                {value?.toLocaleString()} <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 600 }}>{unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PressureBar({ label, value, max, color, prefix = '' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: '0.02em' }}>{prefix}{label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 800 }}>{value?.toLocaleString()} psi</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, boxShadow: `0 0 6px ${color}80`, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}
