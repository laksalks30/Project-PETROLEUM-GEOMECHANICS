import React from 'react'
import { Shield, AlertTriangle } from 'lucide-react'

function RiskBadge({ level }) {
  const cfg = {
    High:     { class: 'badge-red',    label: 'HIGH RISK' },
    Moderate: { class: 'badge-yellow', label: 'MODERATE' },
    Low:      { class: 'badge-green',  label: 'LOW RISK' },
  }
  const { class: cls, label } = cfg[level] || cfg['Low']
  return <span className={`badge ${cls}`}>{label}</span>
}

export default function ContainmentAnalysis({ containment }) {
  if (!containment) return <div className="card h-full animate-pulse"><div className="card-title">Containment Analysis</div></div>

  const { upper_stress_contrast_psi, lower_stress_contrast_psi, Pnet_psi,
          upper_breach, lower_breach, containment_risk } = containment

  return (
    <div className="card h-full flex flex-col" id="panel-containment">
      <div className="card-title flex items-center gap-2">
        <Shield size={10} />
        Containment Analysis
      </div>
      <div className="flex-1 p-2 flex flex-col gap-2">
        <ContrastRow
          label="Upper Stress Contrast"
          value={`${upper_stress_contrast_psi?.toLocaleString()} psi`}
          risk={upper_breach ? 'High' : 'Low'}
        />
        <ContrastRow
          label="Lower Stress Contrast"
          value={`${lower_stress_contrast_psi?.toLocaleString()} psi`}
          risk={lower_breach ? 'Moderate' : 'Low'}
        />

        {(upper_breach || lower_breach) && (
          <div className="alert-red mt-1">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={11} color="#ef4444" />
              <span className="font-bold">NET PRESSURE ({Pnet_psi?.toLocaleString()} psi) EXCEEDS</span>
            </div>
            <div>BOTH STRESS CONTRASTS</div>
            <div className="font-bold mt-1">HIGH RISK OF HEIGHT GROWTH</div>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Containment Risk:</span>
          <RiskBadge level={containment_risk} />
        </div>

        {/* Barrier visualization */}
        <BarrierViz
          upperContrast={upper_stress_contrast_psi}
          lowerContrast={lower_stress_contrast_psi}
          pnet={Pnet_psi}
        />
      </div>
    </div>
  )
}

function ContrastRow({ label, value, risk }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: 10, color: '#94a3b8' }}>{label}</span>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{value}</span>
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
      <div style={{ fontSize: 9, color: '#475569', marginBottom: 4 }}>Barrier vs Net Pressure</div>
      <BarRow label="Upper" value={upperContrast} pct={upper_pct} color="#f59e0b" />
      <BarRow label="Pnet"  value={pnet}          pct={pnet_pct}  color="#ef4444" />
      <BarRow label="Lower" value={lowerContrast} pct={lower_pct} color="#ef4444" />
    </div>
  )
}

function BarRow({ label, value, pct, color }) {
  return (
    <div className="mb-1">
      <div className="flex justify-between mb-0.5">
        <span style={{ fontSize: 9, color: '#64748b' }}>{label}</span>
        <span style={{ fontSize: 9, color, fontWeight: 600 }}>{value?.toLocaleString()} psi</span>
      </div>
      <div style={{ height: 4, background: 'rgba(59,130,246,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}
