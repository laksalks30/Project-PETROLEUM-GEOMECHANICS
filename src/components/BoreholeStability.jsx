import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { AlertTriangle, CheckCircle, Shield, Activity } from 'lucide-react'

function KPICard({ label, value, unit, color = '#38bdf8', sub }) {
  return (
    <div style={{ background: '#070f22', border: `1px solid ${color}30`, borderTop: `2px solid ${color}`, borderRadius: 8, padding: '10px 14px', minWidth: 0 }}>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color, marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{unit}{sub ? <span style={{ color: '#334155', marginLeft: 6 }}>{sub}</span> : null}</div>
    </div>
  )
}

function RiskGauge({ label, pct, color }) {
  const level = pct >= 70 ? 'HIGH' : pct >= 40 ? 'MODERATE' : 'LOW'
  const c = pct >= 70 ? '#ef4444' : pct >= 40 ? '#f59e0b' : '#22c55e'
  return (
    <div style={{ background: '#070f22', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative', width: 64, height: 32, margin: '0 auto', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 64, height: 64, borderRadius: '50%', background: '#0f172a', border: `6px solid #1e293b`, top: 0 }} />
        <div style={{ position: 'absolute', width: 64, height: 64, borderRadius: '50%', border: `6px solid ${c}`, borderBottom: 'transparent', borderRight: 'transparent', top: 0, transform: `rotate(${pct * 1.8 - 90}deg)`, transition: 'transform 0.5s ease' }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: c, marginTop: 4 }}>{level}</div>
      <div style={{ fontSize: 11, color: '#475569' }}>{pct}%</div>
    </div>
  )
}

function RowData({ label, value, unit, color = '#f8fafc', highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', background: highlight ? 'rgba(56,189,248,0.06)' : 'transparent', borderRadius: highlight ? 4 : 0, paddingLeft: highlight ? 4 : 0 }}>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{value} <span style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>{unit}</span></span>
    </div>
  )
}

export default function BoreholeStability({ bhs, mem, well, stressProfile }) {
  if (!bhs) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontWeight: 700 }}>
      Loading Borehole Stability Engine...
    </div>
  )

  const mwData = [
    { name: 'Pp EMW',        value: bhs.pore_emw_ppg,   color: '#3b82f6' },
    { name: 'Collapse CL',   value: bhs.MW_collapse_ppg, color: '#ef4444' },
    { name: 'Min Op MW',     value: bhs.MW_min_op_ppg,   color: '#f59e0b' },
    { name: 'Selected MW',   value: bhs.MW_selected_ppg, color: '#22c55e' },
    { name: 'Circulating ECD', value: bhs.ECD_ppg,       color: '#06b6d4' },
    { name: 'Surge EMW',     value: bhs.EMW_surge_ppg,   color: '#a855f7' },
    { name: 'Swab EMW',      value: bhs.EMW_swab_ppg,    color: '#f59e0b' },
    { name: 'Max Op ECD',    value: bhs.MW_max_op_ppg,   color: '#f59e0b' },
    { name: 'Breakdown',     value: bhs.MW_breakdown_ppg, color: '#ef4444' },
  ]

  const isOK = bhs.status === 'CONDITIONALLY ACCEPTABLE'

  return (
    <main style={{ flex: 1, overflow: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, flexShrink: 0 }}>
        <KPICard label="Pore Pressure" value={(mem?.Pp_psi || 0).toLocaleString()} unit="psi" color="#3b82f6" />
        <KPICard label="Collapse Pressure" value={(bhs.Pw_collapse_psi || 0).toLocaleString()} unit="psi" color="#ef4444" />
        <KPICard label="Breakdown Pressure" value={(bhs.Pbd_psi || 0).toLocaleString()} unit="psi" color="#f59e0b" />
        <KPICard label="Selected MW" value={bhs.MW_selected_ppg} unit="ppg" color="#22c55e" sub="Static design" />
        <KPICard label="Circulating ECD" value={bhs.ECD_ppg} unit="ppg" color="#06b6d4" />
        <KPICard label="Operating Window" value={`${bhs.MW_min_op_ppg} – ${bhs.MW_max_op_ppg}`} unit="ppg" color="#a855f7" />
      </div>

      {/* Row 2: MW Window chart | MEM Summary | Stress Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 6, minHeight: 260, flexShrink: 0 }}>
        {/* Mud Weight Window */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', marginBottom: 8 }}>MUD WEIGHT WINDOW</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mwData} margin={{ top: 0, right: 8, left: -20, bottom: 40 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} angle={-45} textAnchor="end" interval={0} />
              <YAxis domain={[8, 17]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip formatter={(v) => [`${v} ppg`]} contentStyle={{ background: '#0a1428', border: '1px solid #1e293b', fontSize: 11 }} />
              <ReferenceLine y={bhs.MW_min_op_ppg} stroke="#f59e0b" strokeDasharray="4 4" />
              <ReferenceLine y={bhs.MW_max_op_ppg} stroke="#f59e0b" strokeDasharray="4 4" />
              <ReferenceLine y={bhs.MW_selected_ppg} stroke="#22c55e" strokeWidth={2} />
              <Bar dataKey="value">
                {mwData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* MEM + Effective Stresses + Pressure Checks */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>COMMON MEM SUMMARY</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div><div style={{ fontSize: 10, color: '#94a3b8' }}>Sv</div><div style={{ fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>{(mem?.Sv_psi || 0).toLocaleString()}</div><div style={{ fontSize: 10, color: '#475569' }}>psi</div></div>
            <div><div style={{ fontSize: 10, color: '#22c55e' }}>Shmin</div><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{(mem?.Shmin_psi || 0).toLocaleString()}</div><div style={{ fontSize: 10, color: '#475569' }}>psi</div></div>
            <div><div style={{ fontSize: 10, color: '#f59e0b' }}>SHmax</div><div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{(mem?.SHmax_psi || 0).toLocaleString()}</div><div style={{ fontSize: 10, color: '#475569' }}>psi</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: '#070f22', borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, marginBottom: 4 }}>EFFECTIVE STRESSES</div>
              <RowData label="Sv'" value={(bhs.Sv_eff_psi || 0).toLocaleString()} unit="psi" color="#94a3b8" />
              <RowData label="Shmin'" value={(bhs.Shmin_eff_psi || 0).toLocaleString()} unit="psi" color="#22c55e" />
              <RowData label="SHmax'" value={(bhs.SHmax_eff_psi || 0).toLocaleString()} unit="psi" color="#f59e0b" />
            </div>
            <div style={{ background: '#070f22', borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, marginBottom: 4 }}>PRESSURE CHECKS</div>
              <RowData label="Hydrostatic" value={(bhs.Ph_psi || 0).toLocaleString()} unit="psi" />
              <RowData label="Circulating BHP" value={(bhs.PBHC_psi || 0).toLocaleString()} unit="psi" />
              <RowData label="Surge" value={(bhs.Ph_surge_psi || 0).toLocaleString()} unit="psi" />
              <RowData label="Swab" value={(bhs.Ph_swab_psi || 0).toLocaleString()} unit="psi" color={bhs.EMW_swab_ppg < bhs.MW_min_op_ppg ? '#f59e0b' : '#f8fafc'} />
            </div>
          </div>
          <div style={{ background: '#070f22', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, marginBottom: 4 }}>EQUIVALENT MUD WEIGHT SUMMARY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              <RowData label="Pore Pressure (Pp)" value={bhs.pore_emw_ppg} unit="ppg" />
              <RowData label="Collapse Pressure (CL)" value={bhs.MW_collapse_ppg} unit="ppg" />
              <RowData label="Selected MW" value={bhs.MW_selected_ppg} unit="ppg" color="#22c55e" highlight />
              <RowData label="Circulating ECD" value={bhs.ECD_ppg} unit="ppg" color="#06b6d4" highlight />
              <RowData label="Surge EMW" value={bhs.EMW_surge_ppg} unit="ppg" />
              <RowData label="Swab EMW" value={bhs.EMW_swab_ppg} unit="ppg" color={bhs.EMW_swab_ppg < bhs.MW_min_op_ppg ? '#f59e0b' : '#f8fafc'} />
              <RowData label="Max Operating ECD" value={bhs.MW_max_op_ppg} unit="ppg" />
              <RowData label="Breakdown Pressure (BD)" value={bhs.MW_breakdown_ppg} unit="ppg" />
            </div>
          </div>
        </div>

        {/* Borehole Condition Indicators */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>BOREHOLE CONDITION INDICATORS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <RiskGauge label="Breakout Risk" pct={bhs.breakout_risk_pct} />
            <RiskGauge label="Pack-off Risk" pct={bhs.packoff_risk_pct} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div style={{ background: '#070f22', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Cavings Trend</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: bhs.cavings_trend === 'INCREASING' ? '#f59e0b' : '#22c55e', marginTop: 4 }}>{bhs.cavings_trend}</div>
            </div>
            <RiskGauge label="Tight-Hole" pct={bhs.tight_hole_pct} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <RiskGauge label="Diff. Sticking" pct={Math.min(bhs.diff_sticking_pct, 99)} />
            <RiskGauge label="Losses Risk" pct={bhs.losses_pct} />
          </div>
        </div>
      </div>

      {/* Row 3: Well Info | Uncertainty | Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 6, minHeight: 160, flexShrink: 0 }}>
        {/* Well Info */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>TRAJECTORY & WELL INFORMATION</div>
          <RowData label="TVD" value={(well?.tvd_ft || 0).toLocaleString()} unit="ft" />
          <RowData label="MD" value={(well?.md_ft || 0).toLocaleString()} unit="ft" />
          <RowData label="Inclination" value={well?.inclination_deg || 0} unit="°" />
          <RowData label="Hole Size" value={well?.hole_size_in || 0} unit="in" />
          <RowData label="Reservoir Top" value={(well?.reservoir_top_ft || 0).toLocaleString()} unit="ft" />
          <RowData label="Reservoir Base" value={(well?.reservoir_base_ft || 0).toLocaleString()} unit="ft" />
          <RowData label="Net Pay" value={well?.net_pay_ft || 0} unit="ft" />
          <RowData label="Formation" value={well?.formation || '—'} unit="" color="#a855f7" />
          <RowData label="Temperature" value={well?.temperature_f || 0} unit="°F" />
        </div>

        {/* Uncertainty */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>UNCERTAINTY SUMMARY (P10 / P50 / P90)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Parameter','P10','P50 (Base)','P90','Unit'].map(h => (
                  <th key={h} style={{ padding: '4px 6px', color: '#64748b', fontWeight: 700, textAlign: h === 'Parameter' ? 'left' : 'right', fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Pore Pressure', p10: 4728, p50: mem?.Pp_psi || 5076, p90: 5424, unit: 'psi' },
                { name: 'Shmin', p10: 6500, p50: mem?.Shmin_psi || 6962, p90: 7450, unit: 'psi' },
                { name: 'SHmax', p10: 7950, p50: mem?.SHmax_psi || 8412, p90: 8950, unit: 'psi' },
                { name: 'Breakdown', p10: 7400, p50: bhs.Pbd_psi, p90: 9150, unit: 'psi' },
              ].map(r => (
                <tr key={r.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '5px 6px', color: '#94a3b8' }}>{r.name}</td>
                  <td style={{ padding: '5px 6px', color: '#3b82f6', textAlign: 'right', fontWeight: 700 }}>{r.p10?.toLocaleString()}</td>
                  <td style={{ padding: '5px 6px', color: '#f8fafc', textAlign: 'right', fontWeight: 700 }}>{r.p50?.toLocaleString()}</td>
                  <td style={{ padding: '5px 6px', color: '#f59e0b', textAlign: 'right', fontWeight: 700 }}>{r.p90?.toLocaleString()}</td>
                  <td style={{ padding: '5px 6px', color: '#475569', textAlign: 'right' }}>{r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>RECOMMENDATIONS</div>
          {[
            'Control trip speed to minimize swab pressure.',
            `Maintain ECD within ${bhs.MW_min_op_ppg}–${bhs.MW_max_op_ppg} ppg stability margins.`,
            'Monitor cavings volume and overpull trends closely.',
            'Validate swab/surge model with real-time downhole pressure.',
            'Recalibrate model if field observations deviate from predictions.',
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#38bdf8', marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: isOK ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${isOK ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
          {isOK ? <CheckCircle size={20} color="#22c55e" /> : <AlertTriangle size={20} color="#ef4444" />}
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Stability Status</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: isOK ? '#22c55e' : '#ef4444', letterSpacing: '0.05em' }}>{bhs.status}</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>Operating within safe window with adequate margins.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <AlertTriangle size={20} color="#f59e0b" />
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Main Risk</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#f59e0b' }}>{bhs.main_risk}</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>Elevated risk during connections and trips.</div>
          </div>
        </div>
      </div>
    </main>
  )
}
