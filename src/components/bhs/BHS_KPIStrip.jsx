import React from 'react'

function KPICard({ label, value, unit, color = '#38bdf8' }) {
  return (
    <div style={{ background: 'rgba(7,15,34,0.6)', border: `1px solid ${color}30`, borderTop: `2px solid ${color}`, borderRadius: 6, padding: '10px 14px', minWidth: 0 }}>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color, marginTop: 4 }}>
        {value} <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{unit}</span>
      </div>
    </div>
  )
}

export default function BHS_KPIStrip({ bhs, mem }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, flexShrink: 0 }}>
      <KPICard label="Pore Pressure" value={(mem?.Pp_psi || 0).toLocaleString()} unit="psi" color="#3b82f6" />
      <KPICard label="Collapse Pressure" value={(bhs?.Pw_collapse_psi || 0).toLocaleString()} unit="psi" color="#22c55e" />
      <KPICard label="Breakdown Pressure" value={(bhs?.Pbd_psi || 0).toLocaleString()} unit="psi" color="#ef4444" />
      <KPICard label="Selected MW" value={(bhs?.MW_selected_ppg || 0).toFixed(2)} unit="ppg" color="#3b82f6" />
      <KPICard label="Circulating ECD" value={(bhs?.ECD_ppg || 0).toFixed(2)} unit="ppg" color="#a855f7" />
      <KPICard label="Operating Window" value={`${(bhs?.MW_min_op_ppg || 0).toFixed(2)} - ${(bhs?.MW_max_op_ppg || 0).toFixed(2)}`} unit="ppg" color="#f59e0b" />
    </div>
  )
}
