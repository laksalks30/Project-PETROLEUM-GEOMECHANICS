import React from 'react'
import { Gauge } from 'lucide-react'

export default function PressureComponents({ pressure }) {
  if (!pressure) return <div className="card h-full animate-pulse"><div className="card-title">Pressure Components</div></div>

  const components = [
    { label: 'Fracture Pressure',      value: pressure.Pf_psi,       unit: 'psi', color: '#22c55e', highlight: false },
    { label: 'Perforation Friction',   value: pressure.DeltaPperf_psi, unit: 'psi', color: '#f59e0b', highlight: false },
    { label: 'NWB Tortuosity',         value: pressure.DeltaPNWB_psi,  unit: 'psi', color: '#f59e0b', highlight: false },
    { label: 'BHTP',                   value: pressure.BHTP_psi,      unit: 'psi', color: '#ef4444', highlight: true },
    { label: 'Hydrostatic',            value: pressure.Phyd_psi,      unit: 'psi', color: '#3b82f6', highlight: false },
    { label: 'Tubing Friction',        value: pressure.DeltaPtubing_psi, unit: 'psi', color: '#f59e0b', highlight: false },
    { label: 'Surface Treating Pres.', value: pressure.Psurface_psi,  unit: 'psi', color: '#06b6d4', highlight: true },
  ]

  return (
    <div className="card h-full flex flex-col" id="panel-pressure">
      <div className="card-title flex items-center gap-2">
        <Gauge size={10} />
        Pressure Components
      </div>
      <div className="flex-1 overflow-auto p-2">
        {/* Pressure waterfall bars */}
        <PressureBar label="Shmin" value={pressure.Shmin_psi} max={10000} color="#22c55e" />
        <PressureBar label="+ Pnet" value={pressure.Pnet_psi} max={10000} color="#3b82f6" prefix="+" />
        <PressureBar label="+ ΔP perf" value={pressure.DeltaPperf_psi} max={10000} color="#f59e0b" prefix="+" />
        <PressureBar label="+ NWB" value={pressure.DeltaPNWB_psi} max={10000} color="#f59e0b" prefix="+" />
        <div className="my-1 border-t" style={{ borderColor: 'rgba(59,130,246,0.15)' }} />
        {components.map(({ label, value, unit, color, highlight }) => (
          <div key={label} className="data-row" style={highlight ? {
            background: `${color}10`, borderRadius: 4, padding: '2px 4px', margin: '2px 0'
          } : {}}>
            <span className="label" style={{ fontSize: 10, fontWeight: highlight ? 700 : 400 }}>{label}</span>
            <span className="value" style={{ fontSize: 10, color, fontWeight: highlight ? 800 : 600 }}>
              {value?.toLocaleString()} <span style={{ fontSize: 9, opacity: 0.7 }}>{unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PressureBar({ label, value, max, color, prefix = '' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="mb-1">
      <div className="flex justify-between mb-0.5">
        <span style={{ fontSize: 9, color: '#64748b' }}>{prefix}{label}</span>
        <span style={{ fontSize: 9, color, fontWeight: 600 }}>{value?.toLocaleString()} psi</span>
      </div>
      <div style={{ height: 3, background: 'rgba(59,130,246,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}
