import React from 'react'
import { Compass, Droplet, MoveHorizontal, Maximize, Activity, Grip, ArrowDownToLine, Layers, MoveVertical, Shield } from 'lucide-react'

const SECTION_1 = [
  { label: 'Reservoir Pressure', key: 'Pp_psi',           unit: 'psi',   color: '#3b82f6', icon: Droplet,         fmt: v => v?.toLocaleString() },
  { label: 'SHmax',              key: 'SHmax_psi',         unit: 'psi',   color: '#f59e0b', icon: MoveHorizontal,  fmt: v => v?.toLocaleString() },
  { label: 'Stress Azimuth',     key: 'stress_azimuth',    unit: '',      color: '#94a3b8', icon: Compass,         fmt: v => v },
  { label: 'E_static',           key: 'E_static_MMpsi',    unit: 'MMpsi', color: '#22c55e', icon: Activity,        fmt: v => v },
  { label: 'Plane-Strain Mod.',  key: 'Eprime_MMpsi',      unit: 'MMpsi', color: '#22c55e', icon: Maximize,        fmt: v => v },
]
const SECTION_2 = [
  { label: 'Tensile Strength',   key: 'T0_psi',            unit: 'psi',   color: '#a855f7', icon: Shield,          fmt: v => v },
  { label: 'Permeability',       key: 'permeability_mD',   unit: 'mD',    color: '#06b6d4', icon: Grip,            fmt: v => v },
  { label: 'Target TVD',         key: 'target_tvd_ft',     unit: 'ft',    color: '#94a3b8', icon: ArrowDownToLine, fmt: v => v?.toLocaleString() },
  { label: 'Net Pay',            key: 'net_pay_ft',         unit: 'ft',    color: '#f59e0b', icon: Layers,          fmt: v => v },
  { label: 'Fracture Height',    key: 'fracture_height_ft', unit: 'ft',    color: '#a855f7', icon: MoveVertical,    fmt: v => v },
]

function Row({ label, keyName, unit, color, icon: Icon, mem, fmt }) {
  const raw = mem?.[keyName]
  const val = raw !== undefined && raw !== null ? fmt(raw) : '—'
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded"
      style={{ background: 'rgba(15,23,42,0.5)', borderLeft: `2px solid ${color}80` }}>
      <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded"
        style={{ background: `${color}15` }}>
        <Icon size={11} color={color} strokeWidth={2} />
      </div>
      <div className="flex flex-1 items-center justify-between min-w-0">
        <span style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.01em' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#f8fafc', fontWeight: 700, flexShrink: 0 }}>
          {val}{unit ? <span style={{ fontSize: 11, color: '#475569', marginLeft: 2, fontWeight: 500 }}>{unit}</span> : null}
        </span>
      </div>
    </div>
  )
}

export default function TargetIntervalSummary({ mem }) {
  if (!mem) return <CardSkeleton />

  return (
    <div className="card h-full flex flex-col" id="panel-mem-summary">
      <div className="card-title text-[#38bdf8]" style={{ padding: '6px 10px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
        <div className="flex items-center gap-2">
          <Compass size={12} />
          TARGET INTERVAL SUMMARY
        </div>
      </div>
      <div className="flex-1 p-2 overflow-auto min-h-0 flex flex-col gap-3">
        {/* Section 1: Pressures & Moduli */}
        <div>
          <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4, paddingLeft: 2 }}>
            ◈ Pressures & Elastic Properties
          </div>
          <div className="flex flex-col gap-1">
            {SECTION_1.map(p => <Row key={p.key} keyName={p.key} mem={mem} {...p} />)}
          </div>
        </div>
        {/* Section 2: Geometry & Rock Props */}
        <div>
          <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4, paddingLeft: 2 }}>
            ◈ Rock Properties & Geometry
          </div>
          <div className="flex flex-col gap-1">
            {SECTION_2.map(p => <Row key={p.key} keyName={p.key} mem={mem} {...p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card h-full animate-pulse">
      <div className="card-title">Target Interval Summary</div>
      <div className="p-3 flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 rounded" style={{ background: 'rgba(59,130,246,0.05)' }} />
        ))}
      </div>
    </div>
  )
}
