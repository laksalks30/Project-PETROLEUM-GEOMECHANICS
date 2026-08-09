import React from 'react'

function RowData({ label, value, unit, color = '#f8fafc' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{value} <span style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>{unit}</span></span>
    </div>
  )
}

export default function BHS_MudWeightWindow({ bhs }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
      {/* Chart Mockup Area */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>MUD-WEIGHT WINDOW</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <span style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '2px 6px', fontSize: 9, borderRadius: 4, fontWeight: 700 }}>ppg</span>
            <span style={{ background: 'transparent', color: '#64748b', padding: '2px 6px', fontSize: 9, borderRadius: 4, fontWeight: 700, border: '1px solid #334155' }}>psi</span>
          </div>
        </div>
        
        {/* Simplified visual representation of the Mud Weight Window */}
        <div style={{ position: 'relative', flex: 1, marginLeft: 24, borderLeft: '1px solid #334155', borderBottom: '1px solid #334155' }}>
          {/* Y-Axis Labels */}
          <div style={{ position: 'absolute', left: -24, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 9, color: '#64748b' }}>
            <span>16.0</span><span>15.0</span><span>14.0</span><span>13.0</span><span>12.0</span><span>11.0</span><span>10.0</span><span>9.0</span><span>8.0</span>
          </div>
          
          {/* Gradient Background Block */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '10%', bottom: '20%', background: 'linear-gradient(to bottom, rgba(239,68,68,0.3) 0%, rgba(245,158,11,0.3) 30%, rgba(34,197,94,0.3) 70%, rgba(59,130,246,0.3) 100%)' }} />
          
          {/* Reference Lines and Labels */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '10%', borderTop: '2px dashed #ef4444' }}>
            <span style={{ position: 'absolute', right: 8, top: -18, fontSize: 10, color: '#ef4444', fontWeight: 700 }}>Breakdown Limit <br/><span style={{ fontSize: 9 }}>{bhs?.MW_breakdown_ppg || '15.31'} ppg</span></span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', borderTop: '2px dashed #f59e0b' }}>
            <span style={{ position: 'absolute', right: 8, top: -18, fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>Max Operating ECD <br/><span style={{ fontSize: 9 }}>{bhs?.MW_max_op_ppg || '14.46'} ppg</span></span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', borderTop: '2px dashed #a855f7' }}>
            <span style={{ position: 'absolute', right: 8, top: -18, fontSize: 10, color: '#a855f7', fontWeight: 700 }}>Circulating ECD <br/><span style={{ fontSize: 9 }}>{bhs?.ECD_ppg || '13.53'} ppg</span></span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '55%', borderTop: '2px solid #38bdf8' }}>
            <div style={{ position: 'absolute', right: 8, top: -12, background: 'rgba(56,189,248,0.2)', border: '1px solid #38bdf8', padding: '4px 8px', borderRadius: 4 }}>
              <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 700 }}>Selected MW <br/><span style={{ fontSize: 9 }}>{bhs?.MW_selected_ppg || '12.93'} ppg</span></span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '70%', borderTop: '2px dashed #22c55e' }}>
            <span style={{ position: 'absolute', right: 8, top: -18, fontSize: 10, color: '#22c55e', fontWeight: 700 }}>Min Operating MW <br/><span style={{ fontSize: 9 }}>{bhs?.MW_min_op_ppg || '12.41'} ppg</span></span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '80%', borderTop: '2px dashed #f59e0b' }}>
            <span style={{ position: 'absolute', right: 8, top: 4, fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>Collapse Limit <br/><span style={{ fontSize: 9 }}>{bhs?.MW_collapse_ppg || '11.76'} ppg</span></span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '90%', borderTop: '2px dashed #3b82f6' }}>
            <span style={{ position: 'absolute', right: 8, top: 4, fontSize: 10, color: '#3b82f6', fontWeight: 700 }}>Pore Pressure <br/><span style={{ fontSize: 9 }}>{bhs?.pore_emw_ppg || '9.92'} ppg</span></span>
          </div>
        </div>
        <div style={{ fontSize: 9, color: '#64748b', marginTop: 8 }}>
          Window: 2.05 ppg  |  Safety Margin (to CL/BD): 0.65 / 0.85 ppg
        </div>
      </div>

      {/* Table Area */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>EQUIVALENT MUD WEIGHT SUMMARY</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#64748b', fontWeight: 700 }}>PARAMETER</span>
          <span style={{ fontSize: 9, color: '#64748b', fontWeight: 700 }}>VALUE (ppg)</span>
        </div>
        <RowData label="Pore Pressure (PP)" value={bhs?.pore_emw_ppg?.toFixed(2) || '9.92'} color="#3b82f6" />
        <RowData label="Collapse Pressure (CL)" value={bhs?.MW_collapse_ppg?.toFixed(2) || '11.76'} color="#f59e0b" />
        <RowData label="Selected MW" value={bhs?.MW_selected_ppg?.toFixed(2) || '12.93'} color="#38bdf8" />
        <RowData label="Circulating ECD" value={bhs?.ECD_ppg?.toFixed(2) || '13.53'} color="#a855f7" />
        <RowData label="Surge EMW" value={bhs?.EMW_surge_ppg?.toFixed(2) || '13.65'} color="#f8fafc" />
        <RowData label="Swab EMW" value={bhs?.EMW_swab_ppg?.toFixed(2) || '12.37'} color="#f8fafc" />
        <RowData label="Max Operating ECD" value={bhs?.MW_max_op_ppg?.toFixed(2) || '14.46'} color="#f59e0b" />
        <RowData label="Breakdown Pressure (BD)" value={bhs?.MW_breakdown_ppg?.toFixed(2) || '15.31'} color="#ef4444" />
      </div>
    </div>
  )
}
