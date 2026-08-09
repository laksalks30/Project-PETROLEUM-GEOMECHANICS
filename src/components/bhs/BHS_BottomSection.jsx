import React from 'react'

function TornadoBar({ label, dec, inc, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
      <div style={{ width: 80, fontSize: 9, color: '#94a3b8', textAlign: 'right', paddingRight: 6 }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', height: 12 }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
           {dec && <div style={{ width: `${Math.abs(dec)}%`, background: '#ef4444', height: '100%', position: 'relative' }}>
              <span style={{ position: 'absolute', left: -22, top: -1, fontSize: 8, color: '#ef4444' }}>{dec}%</span>
           </div>}
        </div>
        <div style={{ width: 1, background: '#475569', zIndex: 2 }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
           {inc && <div style={{ width: `${Math.abs(inc)}%`, background: '#22c55e', height: '100%', position: 'relative' }}>
              <span style={{ position: 'absolute', right: -22, top: -1, fontSize: 8, color: '#22c55e' }}>+{inc}%</span>
           </div>}
        </div>
      </div>
      <div style={{ width: 30, fontSize: 9, color: '#f8fafc', textAlign: 'right' }}>{pct}%</div>
    </div>
  )
}

export default function BHS_BottomSection({ bhs, mem }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr', gap: 6, minHeight: 140, flexShrink: 0 }}>
      {/* UNCERTAINTY SUMMARY */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', marginBottom: 8, letterSpacing: '0.05em' }}>UNCERTAINTY SUMMARY <span style={{ color: '#64748b', fontSize: 9 }}>(P10 / P50 / P90)</span></div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['PARAMETER','P10','P50 (BASE)','P90','UNIT'].map(h => (
                <th key={h} style={{ padding: '2px 4px', color: '#64748b', fontWeight: 700, textAlign: h === 'PARAMETER' ? 'left' : 'right', fontSize: 8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Pore Pressure', p10: 4728, p50: mem?.Pp_psi || 5076, p90: 5424, unit: 'psi' },
              { name: 'Shmin', p10: 6500, p50: mem?.Shmin_psi || 6962, p90: 7450, unit: 'psi' },
              { name: 'SHmax', p10: 7950, p50: mem?.SHmax_psi || 8412, p90: 8950, unit: 'psi' },
              { name: 'Breakdown Pressure', p10: 7400, p50: bhs?.Pbd_psi || 7833, p90: 8250, unit: 'psi' },
            ].map(r => (
              <tr key={r.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '3px 4px', color: '#94a3b8', fontSize: 9 }}>{r.name}</td>
                <td style={{ padding: '3px 4px', color: '#ef4444', textAlign: 'right', fontWeight: 700, fontSize: 10 }}>{r.p10?.toLocaleString()}</td>
                <td style={{ padding: '3px 4px', color: '#f8fafc', textAlign: 'right', fontWeight: 700, fontSize: 10 }}>{r.p50?.toLocaleString()}</td>
                <td style={{ padding: '3px 4px', color: '#22c55e', textAlign: 'right', fontWeight: 700, fontSize: 10 }}>{r.p90?.toLocaleString()}</td>
                <td style={{ padding: '3px 4px', color: '#475569', textAlign: 'right', fontSize: 9 }}>{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SENSITIVITY TORNADO */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', marginBottom: 8, letterSpacing: '0.05em' }}>SENSITIVITY - COLLAPSE WINDOW IMPACT <span style={{ color: '#64748b', fontSize: 9 }}>(to Collapse Limit)</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, paddingBottom: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
           <span style={{ fontSize: 8, color: '#64748b', width: 80, textAlign: 'right' }}>INPUT VARIABLE</span>
           <span style={{ fontSize: 8, color: '#64748b', flex: 1, textAlign: 'center', paddingRight: 40 }}>DECREASES WINDOW <span style={{ padding: '0 10px' }}>|</span> INCREASES WINDOW</span>
           <span style={{ fontSize: 8, color: '#64748b', width: 30, textAlign: 'right' }}>IMPACT (%)</span>
        </div>
        <TornadoBar label="Pore Pressure" dec={-26} inc={26} pct={52} />
        <TornadoBar label="UCS" dec={-17} inc={17} pct={34} />
        <TornadoBar label="SHmax" dec={-17} inc={13} pct={26} />
        <TornadoBar label="Shmin" dec={-13} inc={13} pct={16} />
        <TornadoBar label="Friction Angle (φ)" dec={-9} inc={9} pct={18} />
        <TornadoBar label="Mud Weight" dec={-4} inc={4} pct={8} />
      </div>

      {/* RISK MATRIX */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', marginBottom: 8, letterSpacing: '0.05em' }}>RISK MATRIX <span style={{ color: '#64748b', fontSize: 9 }}>(Likelihood vs. Consequence)</span></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Matrix Graphic Placeholder */}
          <div style={{ flex: 1, position: 'relative' }}>
             <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='20' height='20' x='0' y='80' fill='%2322c55e'/%3E%3Crect width='20' height='20' x='20' y='80' fill='%2322c55e'/%3E%3Crect width='20' height='20' x='40' y='80' fill='%2384cc16'/%3E%3Crect width='20' height='20' x='60' y='80' fill='%23eab308'/%3E%3Crect width='20' height='20' x='80' y='80' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='0' y='60' fill='%2322c55e'/%3E%3Crect width='20' height='20' x='20' y='60' fill='%2384cc16'/%3E%3Crect width='20' height='20' x='40' y='60' fill='%23eab308'/%3E%3Crect width='20' height='20' x='60' y='60' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='80' y='60' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='0' y='40' fill='%2384cc16'/%3E%3Crect width='20' height='20' x='20' y='40' fill='%23eab308'/%3E%3Crect width='20' height='20' x='40' y='40' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='60' y='40' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='80' y='40' fill='%23dc2626'/%3E%3Crect width='20' height='20' x='0' y='20' fill='%23eab308'/%3E%3Crect width='20' height='20' x='20' y='20' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='40' y='20' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='60' y='20' fill='%23dc2626'/%3E%3Crect width='20' height='20' x='80' y='20' fill='%23991b1b'/%3E%3Crect width='20' height='20' x='0' y='0' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='20' y='0' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='40' y='0' fill='%23dc2626'/%3E%3Crect width='20' height='20' x='60' y='0' fill='%23991b1b'/%3E%3Crect width='20' height='20' x='80' y='0' fill='%237f1d1d'/%3E%3Ccircle cx='70' cy='30' r='5' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E" alt="Risk Matrix" style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.8 }} />
             <div style={{ position: 'absolute', bottom: -12, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', fontSize: 6, color: '#64748b' }}>
               <span>Rare</span><span>Unlikely</span><span>Possible</span><span>Likely</span><span>Almost Certain</span>
             </div>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 60 }}>
             <div style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>RISK LEVEL</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#991b1b' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>Extreme</span></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>High</span></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>Moderate</span></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>Low</span></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>Very Low</span></div>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', marginBottom: 8, letterSpacing: '0.05em' }}>RECOMMENDATIONS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { icon: 'svg1', text: 'Control trip speed to minimize swab pressure.' },
            { icon: 'svg2', text: `Maintain ECD within ${bhs?.MW_min_op_ppg || 12.41} – ${bhs?.MW_max_op_ppg || 14.46} ppg to balance stability margins.` },
            { icon: 'svg3', text: 'Monitor cavings volume and overpull trends closely.' },
            { icon: 'svg4', text: 'Validate swab/surge model with real-time downhole pressure data.' },
            { icon: 'svg5', text: 'Recalibrate model if field observations deviate from predictions.' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(56,189,248,0.2)', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                 <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#38bdf8' }} />
              </div>
              <span style={{ fontSize: 9, color: '#94a3b8', lineHeight: 1.4 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
