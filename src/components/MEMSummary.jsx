import React from 'react'
import { Compass, Droplet, MoveHorizontal, Maximize, Activity, Grip, ArrowDownToLine, Layers, MoveVertical, Shield } from 'lucide-react'

export default function MEMSummary({ mem }) {
  if (!mem) return <CardSkeleton />

  const items = [
    { label: 'Reservoir Pressure', value: `${mem.Pp_psi?.toLocaleString()} psi`, color: '#3b82f6', icon: Droplet },
    { label: 'SHmax',              value: `${mem.SHmax_psi?.toLocaleString()} psi`, color: '#f59e0b', icon: MoveHorizontal },
    { label: 'Stress Azimuth',     value: mem.stress_azimuth, color: '#94a3b8', icon: Compass },
    { label: 'E_static',           value: `${mem.E_static_MMpsi} MMpsi`, color: '#22c55e', icon: Activity },
    { label: 'Plane-Strain Mod.',  value: `${mem.Eprime_MMpsi} MMpsi`, color: '#22c55e', icon: Maximize },
    { label: 'Tensile Strength',   value: `${mem.T0_psi} psi`, color: '#a855f7', icon: Shield },
    { label: 'Permeability',       value: `${mem.permeability_mD} mD`, color: '#06b6d4', icon: Grip },
    { label: 'Target TVD',         value: `${mem.target_tvd_ft?.toLocaleString()} ft`, color: '#94a3b8', icon: ArrowDownToLine },
    { label: 'Net Pay',            value: `${mem.net_pay_ft} ft`, color: '#f59e0b', icon: Layers },
    { label: 'Fracture Height',    value: `${mem.fracture_height_ft} ft`, color: '#a855f7', icon: MoveVertical },
  ]

  return (
    <div className="card h-full flex flex-col" id="panel-mem-summary">
      <div className="card-title flex items-center gap-2">
        <Compass size={10} />
        Common MEM / Target Interval Summary
      </div>
      <div className="flex-1 p-2 overflow-auto min-h-0">
        <div className="mem-grid">
          {items.map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="mem-cell flex items-center gap-3">
              <div style={{ color, opacity: 0.8 }}>
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <div className="mc-label">{label}</div>
                <div className="mc-value" style={{ color }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card h-full animate-pulse">
      <div className="card-title">Common MEM / Target Interval Summary</div>
      <div className="p-3 flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 rounded" style={{ background: 'rgba(59,130,246,0.05)' }} />
        ))}
      </div>
    </div>
  )
}
