import React from 'react'
import { AlertTriangle, MapPin } from 'lucide-react'

function RiskBadge({ level }) {
  const cfg = {
    High:     { class: 'badge-red',    label: 'HIGH RISK' },
    Moderate: { class: 'badge-yellow', label: 'MODERATE' },
    Low:      { class: 'badge-green',  label: 'LOW RISK' },
  }
  const { class: cls, label } = cfg[level] || cfg['Low']
  return <span className={`badge ${cls}`} style={{ padding: '2px 8px', fontSize: 11 }}>{label}</span>
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
      <div className="card-title text-[#38bdf8]" style={{ padding: '6px 10px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
        <div className="flex items-center gap-2">
          <MapPin size={12} />
          FAULT INTERACTION
        </div>
      </div>
      <div className="flex-1 p-2 flex flex-col gap-2.5">
        {/* Grouped Stats Block */}
        <div className="flex flex-col rounded-md" style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(30,41,59,0.8)' }}>
          <Row label="Distance to Fault"     value={`${fault_distance_ft?.toLocaleString()} ft`} color="#94a3b8" />
          <Row label="Base Half-Length (xf)" value={`${xf_base_ft?.toLocaleString()} ft`}        color="#a855f7" />
          <Row label="Remaining Distance"    value={`${remaining_ft?.toLocaleString()} ft`}       color="#f59e0b" />
          <Row label="P90 Half-Length (+20%)" value={`${xf_P90_ft?.toLocaleString()} ft`}        color="#ef4444" isLast />
        </div>

        <div className="flex items-center justify-between bg-[#0f172a] px-3 py-2 rounded-md border border-[#1e293b]">
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Fault Risk Assessment</span>
          <RiskBadge level={fault_risk} />
        </div>

        {P90_intersects_fault && (
          <div className="rounded-md p-2 mt-0.5" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(15,23,42,1))', border: '1px solid rgba(245,158,11,0.3)', borderLeft: '3px solid #f59e0b' }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={12} color="#f59e0b" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>P90 FRACTURE MAY INTERSECT FAULT</span>
            </div>
            <div style={{ fontSize: 11, color: '#f8fafc', paddingLeft: 20 }}>
              P90 xf <span className="font-bold text-[#ef4444]">{xf_P90_ft} ft</span> ≥ Fault Distance <span className="font-bold text-[#f59e0b]">{fault_distance_ft} ft</span>
            </div>
          </div>
        )}

        {/* Distance visual */}
        <div className="mt-auto">
          <FaultDistanceViz
            xf={xf_base_ft}
            xfP90={xf_P90_ft}
            faultDist={fault_distance_ft}
          />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, color, isLast }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.01em' }}>{label}</span>
      <span style={{ fontSize: 12, color, fontWeight: 700 }}>{value}</span>
    </div>
  )
}

function FaultDistanceViz({ xf, xfP90, faultDist }) {
  const max = Math.max(faultDist, xfP90) * 1.15
  const xf_pct   = (xf / max) * 100
  const p90_pct  = (xfP90 / max) * 100
  const fault_pct = (faultDist / max) * 100
  
  const isBreach = xfP90 >= faultDist

  return (
    <div className="flex flex-col mt-1">
      <div className="flex justify-between items-center mb-1.5">
        <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fracture Reach vs Fault</span>
      </div>
      
      <div style={{ position: 'relative', height: 28, background: 'rgba(15,23,42,0.8)', borderRadius: 4, border: '1px solid rgba(30,41,59,1)', overflow: 'hidden' }}>
        {/* Track Grid lines */}
        <div style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', left: '75%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(255,255,255,0.05)' }} />

        {/* Wellbore Marker (Left edge) */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#3b82f6', zIndex: 10 }} />

        {/* Base xf bar */}
        <div style={{
          position: 'absolute', left: 0, top: '25%', height: '50%',
          width: `${xf_pct}%`, background: 'linear-gradient(90deg, #7e22ce, #a855f7)',
          borderTopRightRadius: 2, borderBottomRightRadius: 2,
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 3,
          boxShadow: '0 0 10px rgba(168,85,247,0.3)'
        }} />
        
        {/* P90 xf bar extension */}
        <div style={{
          position: 'absolute', left: `${xf_pct}%`, top: '35%', height: '30%',
          width: `${p90_pct - xf_pct}%`, 
          background: isBreach ? 'rgba(239,68,68,0.7)' : 'rgba(245,158,11,0.6)', 
          borderTopRightRadius: 2, borderBottomRightRadius: 2,
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 2,
        }} />

        {/* Fault line */}
        <div style={{
          position: 'absolute', left: `${fault_pct}%`, top: 0, bottom: 0, width: 2,
          background: '#ef4444', transform: 'translateX(-50%)', zIndex: 5,
          boxShadow: '0 0 8px rgba(239,68,68,0.8)'
        }} />
        
        {/* Fault Danger Zone (Area past fault) */}
        <div style={{
          position: 'absolute', left: `${fault_pct}%`, right: 0, top: 0, bottom: 0,
          background: 'repeating-linear-gradient(45deg, rgba(239,68,68,0.1), rgba(239,68,68,0.1) 4px, rgba(239,68,68,0.2) 4px, rgba(239,68,68,0.2) 8px)',
          zIndex: 1
        }} />
      </div>
      
      {/* Legend below the bar */}
      <div className="flex justify-between items-center mt-1.5 px-1 relative h-4">
        {/* xf label */}
        <div style={{ position: 'absolute', left: `${xf_pct}%`, transform: 'translateX(-50%)', fontSize: 11, color: '#a855f7', fontWeight: 600 }}>
          Base xf
        </div>
        {/* P90 label */}
        <div style={{ position: 'absolute', left: `${p90_pct}%`, transform: 'translateX(-50%)', fontSize: 11, color: isBreach ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
          P90
        </div>
        {/* Fault label */}
        <div style={{ position: 'absolute', left: `${fault_pct}%`, transform: 'translateX(-50%)', top: -45, fontSize: 11, color: '#fca5a5', fontWeight: 800, background: '#7f1d1d', padding: '1px 4px', borderRadius: 2 }}>
          FAULT
        </div>
      </div>
    </div>
  )
}
