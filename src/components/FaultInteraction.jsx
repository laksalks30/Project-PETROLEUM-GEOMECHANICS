import React from 'react'
import { AlertTriangle, MapPin } from 'lucide-react'

function RiskBadge({ level }) {
  const cfg = {
    High:     { class: 'badge-red',    label: 'HIGH RISK' },
    Moderate: { class: 'badge-yellow', label: 'MODERATE' },
    Low:      { class: 'badge-green',  label: 'LOW RISK' },
  }
  const { class: cls, label } = cfg[level] || cfg['Low']
  return <span className={`badge ${cls}`}>{label}</span>
}

export default function FaultInteraction({ containment }) {
  if (!containment) return <div className="card h-full animate-pulse"><div className="card-title">Fault Interaction</div></div>

  const {
    fault_distance_ft,
    xf_base_ft,
    remaining_ft,
    xf_P90_ft,
    P90_intersects_fault,
    fault_risk,
  } = containment

  return (
    <div className="card h-full flex flex-col" id="panel-fault">
      <div className="card-title flex items-center gap-2">
        <MapPin size={10} />
        Fault Interaction
      </div>
      <div className="flex-1 p-2 flex flex-col gap-2">
        <Row label="Distance to Fault"     value={`${fault_distance_ft?.toLocaleString()} ft`} color="#94a3b8" />
        <Row label="Base Half-Length (xf)" value={`${xf_base_ft?.toLocaleString()} ft`}        color="#a855f7" />
        <Row label="Remaining Distance"    value={`${remaining_ft?.toLocaleString()} ft`}       color="#f59e0b" />
        <Row label="P90 Half-Length (+20%)" value={`${xf_P90_ft?.toLocaleString()} ft`}        color="#ef4444" />

        <div className="flex items-center justify-between">
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Fault Risk:</span>
          <RiskBadge level={fault_risk} />
        </div>

        {P90_intersects_fault && (
          <div className="alert-yellow mt-1">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={11} color="#f59e0b" />
              <span className="font-bold">P90 FRACTURE MAY INTERSECT THE FAULT</span>
            </div>
            <div style={{ fontSize: 10 }}>
              P90 xf = {xf_P90_ft} ft ≥ Fault at {fault_distance_ft} ft
            </div>
          </div>
        )}

        {/* Distance visual */}
        <FaultDistanceViz
          xf={xf_base_ft}
          xfP90={xf_P90_ft}
          faultDist={fault_distance_ft}
        />
      </div>
    </div>
  )
}

function Row({ label, value, color }) {
  return (
    <div className="data-row">
      <span style={{ fontSize: 10, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 10, color, fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function FaultDistanceViz({ xf, xfP90, faultDist }) {
  const max = Math.max(faultDist, xfP90) * 1.1
  const xf_pct   = (xf / max) * 100
  const p90_pct  = (xfP90 / max) * 100
  const fault_pct = (faultDist / max) * 100

  return (
    <div>
      <div style={{ fontSize: 9, color: '#475569', marginBottom: 4 }}>Fracture Reach vs Fault</div>
      <div style={{ position: 'relative', height: 40, background: 'rgba(59,130,246,0.05)', borderRadius: 4, overflow: 'hidden' }}>
        {/* Base xf bar */}
        <div style={{
          position: 'absolute', left: 0, top: '30%', height: '40%',
          width: `${xf_pct}%`, background: 'linear-gradient(90deg,#a855f7,#7c3aed)', borderRadius: '0 2px 2px 0',
          transition: 'width 0.6s ease',
        }} />
        {/* P90 xf bar */}
        <div style={{
          position: 'absolute', left: 0, top: '10%', height: '15%',
          width: `${p90_pct}%`, background: 'rgba(239,68,68,0.4)', borderRadius: '0 2px 2px 0',
          transition: 'width 0.6s ease',
        }} />
        {/* Fault line */}
        <div style={{
          position: 'absolute', left: `${fault_pct}%`, top: 0, bottom: 0, width: 2,
          background: '#ef4444', transform: 'translateX(-50%)',
        }} />
        {/* Labels */}
        <div style={{ position: 'absolute', left: `${xf_pct}%`, bottom: 2, transform: 'translateX(-50%)', fontSize: 8, color: '#a855f7' }}>
          xf
        </div>
        <div style={{ position: 'absolute', left: `${fault_pct}%`, top: 2, transform: 'translateX(-50%)', fontSize: 8, color: '#ef4444' }}>
          Fault
        </div>
      </div>
    </div>
  )
}
