import React from 'react'
import { Shield, AlertTriangle } from 'lucide-react'

function RiskBadge({ level }) {
  const cfg = {
    High:     { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.3)', label: 'HIGH RISK' },
    Moderate: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)', label: 'MODERATE' },
    Low:      { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'rgba(34,197,94,0.3)', label: 'LOW RISK' },
  }
  const c = cfg[level] || cfg['Low']
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em'
    }}>
      {c.label}
    </span>
  )
}

export default function ContainmentAnalysis({ containment }) {
  if (!containment) return <div className="card h-full animate-pulse" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}><div className="card-title">LOADING CONTAINMENT...</div></div>

  const { upper_stress_contrast_psi, lower_stress_contrast_psi, Pnet_psi,
          upper_breach, lower_breach, containment_risk } = containment

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-containment" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <Shield size={12} color="#38bdf8" />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>CONTAINMENT ANALYSIS</span>
      </div>

      <div className="flex-1 p-2.5 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-1.5">
          <ContrastRow label="UPPER STRESS CONTRAST" value={`${upper_stress_contrast_psi?.toLocaleString()} psi`} risk={upper_breach ? 'High' : 'Low'} />
          <ContrastRow label="LOWER STRESS CONTRAST" value={`${lower_stress_contrast_psi?.toLocaleString()} psi`} risk={lower_breach ? 'Moderate' : 'Low'} />
        </div>

        {(upper_breach || lower_breach) && (
          <div className="flex flex-col gap-1 rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderLeft: '3px solid #ef4444' }}>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={11} color="#ef4444" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em' }}>NET PRESSURE ({Pnet_psi?.toLocaleString()} PSI) EXCEEDS CONTRASTS</span>
            </div>
            <div style={{ fontSize: 11, color: '#f8fafc', fontWeight: 700 }}>HIGH RISK OF HEIGHT GROWTH</div>
          </div>
        )}

        <div className="flex items-center justify-between bg-[#070f22] px-3 py-2.5 rounded-lg border border-[#1e293b]">
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 800, letterSpacing: '0.05em' }}>OVERALL RISK</span>
          <RiskBadge level={containment_risk} />
        </div>

        {/* Barrier visualization */}
        <div className="mt-1">
          <BarrierViz upperContrast={upper_stress_contrast_psi} lowerContrast={lower_stress_contrast_psi} pnet={Pnet_psi} />
        </div>
      </div>
    </div>
  )
}

function ContrastRow({ label, value, risk }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>{label}</span>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>{value}</span>
        <RiskBadge level={risk} />
      </div>
    </div>
  )
}

function BarrierViz({ upperContrast, lowerContrast, pnet }) {
  const maxC = Math.max(upperContrast, lowerContrast, pnet, 1500)
  const upper_pct = (upperContrast / maxC) * 100
  const lower_pct = (lowerContrast / maxC) * 100
  const pnet_pct  = (pnet / maxC) * 100

  return (
    <div>
      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800, letterSpacing: '0.05em', marginBottom: 8, textTransform: 'uppercase' }}>Barrier vs Net Pressure</div>
      <BarRow label="Upper Barrier" value={upperContrast} pct={upper_pct} color="#f59e0b" />
      <BarRow label="Net Pressure"  value={pnet}          pct={pnet_pct}  color="#ef4444" isPnet />
      <BarRow label="Lower Barrier" value={lowerContrast} pct={lower_pct} color="#f59e0b" />
    </div>
  )
}

function BarRow({ label, value, pct, color, isPnet }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: 11, color: isPnet ? color : '#64748b', fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 800 }}>{value?.toLocaleString()} psi</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, boxShadow: `0 0 6px ${color}80`, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}
