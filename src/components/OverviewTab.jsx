import React from 'react'
import { CheckCircle, AlertTriangle, TrendingUp, Shield, Zap, Layers } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const card = (extra) => ({ background: '#0d1b2e', border: '1px solid rgba(56,189,248,0.12)', borderRadius: 8, ...extra })
const label = { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }
const val = (color = '#f8fafc') => ({ fontSize: 22, fontWeight: 900, color })
const unit = { fontSize: 11, color: '#475569', fontWeight: 500 }

function KpiCard({ lbl, value, u, color = '#38bdf8', tag }) {
  return (
    <div style={{ ...card(), padding: '14px 16px', borderTop: `3px solid ${color}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={label}>{lbl}</span>
        {tag && <span style={{ fontSize: 9, fontWeight: 800, color: tag === 'CALC' ? '#06b6d4' : '#a855f7', border: `1px solid`, borderColor: tag === 'CALC' ? '#06b6d4' : '#a855f7', padding: '1px 5px', borderRadius: 3 }}>{tag}</span>}
      </div>
      <div style={val(color)}>{value} <span style={unit}>{u}</span></div>
    </div>
  )
}

function Row({ label: l, value, color = '#f8fafc' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: 12, color: '#94a3b8' }}>{l}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

function SectionTitle({ icon: Icon, title, color = '#38bdf8' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: `linear-gradient(90deg, ${color}18 0%, transparent 100%)`, borderLeft: `3px solid ${color}`, borderRadius: '0 4px 4px 0', marginBottom: 12 }}>
      <Icon size={14} color={color} />
      <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.06em' }}>{title}</span>
    </div>
  )
}

export default function OverviewTab({ data }) {
  const { mem, bhs, well } = data || {}
  const sp = data?.stress_profile || []

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#050b14' }}>

      {/* ── SECTION 1: MEM KPI ─────────────────────────────────────────── */}
      <div style={{ ...card(), overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.05)' }}>
          <Layers size={14} color="#10b981" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.06em' }}>COMMON CALIBRATED MEM SUMMARY</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 1, background: 'rgba(255,255,255,0.04)' }}>
          {[
            { lbl: 'Pore Pressure',      val: (mem?.Pp_psi||5076).toLocaleString(),  u: 'psi', c: '#3b82f6' },
            { lbl: 'Vertical Stress (Sv)',val: (mem?.Sv_psi||10157).toLocaleString(), u: 'psi', c: '#38bdf8' },
            { lbl: 'Shmin',              val: (mem?.Shmin_psi||6962).toLocaleString(),u: 'psi', c: '#22c55e' },
            { lbl: 'SHmax',              val: (mem?.SHmax_psi||8412).toLocaleString(),u: 'psi', c: '#f59e0b' },
            { lbl: 'Stress Regime',      val: 'NORMAL',                               u: 'Sv > SHmax > Shmin', c: '#a855f7' },
            { lbl: 'SHmax Azimuth',      val: mem?.stress_azimuth||'N60°E',           u: '',    c: '#f8fafc' },
          ].map(k => (
            <div key={k.lbl} style={{ background: '#0d1b2e', padding: '14px 16px' }}>
              <div style={label}>{k.lbl}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: k.c, marginTop: 6 }}>{k.val}</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{k.u}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: Detail MEM (3 columns) ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.6fr', gap: 12 }}>

        {/* Gradients */}
        <div style={{ ...card(), padding: 16 }}>
          <SectionTitle icon={TrendingUp} title="STRESS GRADIENTS" color="#38bdf8" />
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>psi/ft</div>
          <Row label="Pore Pressure" value="0.516 psi/ft" />
          <Row label="Sv" value="1.032 psi/ft" color="#38bdf8" />
          <Row label="Shmin" value="0.707 psi/ft" color="#22c55e" />
          <Row label="SHmax" value="0.855 psi/ft" color="#f59e0b" />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>EMW (ppg)</div>
            <Row label="Pore Pressure" value="9.92 ppg" />
            <Row label="Sv" value="19.85 ppg" color="#38bdf8" />
            <Row label="Shmin" value="13.61 ppg" color="#22c55e" />
            <Row label="SHmax" value="16.18 ppg" color="#f59e0b" />
          </div>
        </div>

        {/* Rock Properties */}
        <div style={{ ...card(), padding: 16 }}>
          <SectionTitle icon={Layers} title="ROCK PROPERTIES (Static)" color="#10b981" />
          <Row label="E (Young's Modulus)" value="2.67 MMpsi" />
          <Row label="v (Poisson's Ratio)" value="0.286" />
          <Row label="UCS" value={`${(mem?.UCS_psi||4351).toLocaleString()} psi`} />
          <Row label="Tensile Strength" value={`${mem?.T0_psi||435} psi`} />
          <Row label="Friction Angle (φ)" value={`${mem?.friction_angle_deg||30}°`} />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>Effective Stresses (psi)</div>
            <Row label="Sv'" value={`${(bhs?.Sv_eff_psi||5081).toLocaleString()} psi`} color="#38bdf8" />
            <Row label="Shmin'" value={`${(bhs?.Shmin_eff_psi||1886).toLocaleString()} psi`} color="#22c55e" />
            <Row label="SHmax'" value={`${(bhs?.SHmax_eff_psi||3336).toLocaleString()} psi`} color="#f59e0b" />
          </div>
        </div>

        {/* Stress Profile Chart */}
        <div style={{ ...card(), padding: 16 }}>
          <SectionTitle icon={TrendingUp} title="STRESS PROFILE vs. TVD" color="#a855f7" />
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sp} layout="vertical" margin={{ top: 4, right: 20, left: 10, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0,'dataMax']} />
                <YAxis dataKey="tvd_ft" type="number" reversed tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d1b2e', border: '1px solid #334155', borderRadius: 6, fontSize: 11 }} />
                <Line dataKey="Pp_psi" stroke="#3b82f6" strokeWidth={2} dot={false} name="Pp" isAnimationActive={false} />
                <Line dataKey="Shmin_psi" stroke="#22c55e" strokeWidth={2} dot={false} name="Shmin" isAnimationActive={false} />
                <Line dataKey="SHmax_psi" stroke="#f59e0b" strokeWidth={2} dot={false} name="SHmax" isAnimationActive={false} />
                <Line dataKey="Sv_psi" stroke="#94a3b8" strokeWidth={2} dot={false} name="Sv" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            {[['Pp','#3b82f6'],['Shmin','#22c55e'],['SHmax','#f59e0b'],['Sv','#94a3b8']].map(([n,c])=>(
              <div key={n} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:14, height:3, background:c, borderRadius:2 }}/>
                <span style={{ fontSize:10, color:'#f8fafc' }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Two Engines side by side ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12 }}>

        {/* BOREHOLE STABILITY */}
        <div style={{ ...card(), padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionTitle icon={Shield} title="BOREHOLE STABILITY ENGINE" color="#0ea5e9" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <KpiCard lbl="Pore Pressure" value={(bhs?.pore_emw_ppg||9.92).toFixed(2)} u="ppg" color="#3b82f6" />
            <KpiCard lbl="Collapse Limit" value={(bhs?.MW_collapse_ppg||11.76).toFixed(2)} u="ppg" color="#f59e0b" />
            <KpiCard lbl="Selected MW" value={(bhs?.MW_selected_ppg||12.93).toFixed(2)} u="ppg" color="#38bdf8" />
            <KpiCard lbl="Circulating ECD" value={(bhs?.ECD_ppg||13.53).toFixed(2)} u="ppg" color="#a855f7" />
            <KpiCard lbl="Min. Op. MW" value={(bhs?.MW_min_op_ppg||12.41).toFixed(2)} u="ppg" color="#22c55e" />
            <KpiCard lbl="Breakdown Limit" value={(bhs?.MW_breakdown_ppg||15.31).toFixed(2)} u="ppg" color="#ef4444" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={22} color="#22c55e" />
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>STABILITY STATUS</div>
                <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 800 }}>{bhs?.status || 'CONDITIONALLY ACCEPTABLE'}</div>
              </div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={22} color="#f59e0b" />
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>MAIN RISK</div>
                <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 800 }}>{bhs?.main_risk || 'Swab-Induced Instability'}</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>PRESSURE CHECKS (at TD)</div>
            <Row label="Hydrostatic" value={`${(bhs?.Ph_psi||6620).toLocaleString()} psi`} />
            <Row label="Circulating BHP (ECD)" value={`${(bhs?.PBHC_psi||6925).toLocaleString()} psi`} />
            <Row label="Surge Pressure" value={`${(bhs?.Ph_surge_psi||6983).toLocaleString()} psi`} />
            <Row label="Swab Pressure" value={`${(bhs?.Ph_swab_psi||6330).toLocaleString()} psi`} />
          </div>
        </div>

        {/* HYDRAULIC FRACTURING */}
        <div style={{ ...card(), padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionTitle icon={Zap} title="HYDRAULIC FRACTURING DESIGN ENGINE" color="#8b5cf6" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            {[
              { l: 'DFIT Shmin',     v: '7,107', u: 'psi', c: '#22c55e' },
              { l: 'Breakdown Pres.',v: '8,268', u: 'psi', c: '#f59e0b' },
              { l: 'Net Pressure',   v: '1,450', u: 'psi', c: '#38bdf8' },
              { l: 'BHTP',           v: '9,282', u: 'psi', c: '#ec4899' },
              { l: 'Surf. Treating', v: '5,959', u: 'psi', c: '#06b6d4' },
            ].map(k => (
              <div key={k.l} style={{ background: '#07111f', borderRadius: 6, padding: '12px 10px', textAlign: 'center', border: `1px solid ${k.c}25` }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{k.l}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: k.c }}>{k.v}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>{k.u}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {/* Design Summary */}
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>DESIGN SUMMARY</div>
              <Row label="Total Fluid" value="3,270 bbl" />
              <Row label="Pump Rate" value="25.2 bpm" />
              <Row label="Pump Time" value="130-145 min" />
              <Row label="Total Proppant" value="396,800 lb" />
              <Row label="Avg Prop Conc." value="2.89 lb/gal" />
            </div>
            {/* Fracture Dimensions */}
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>FRACTURE DIMENSIONS</div>
              <Row label="Half-Length (xf)" value="855 ft" color="#a855f7" />
              <Row label="Total Length" value="1,710 ft" color="#a855f7" />
              <Row label="Height" value="98 ft" />
              <Row label="Max Width" value="1.17 in" />
              <Row label="Avg Width" value="0.92 in" />
            </div>
            {/* Containment & Fault */}
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>CONTAINMENT & FAULT</div>
              <Row label="Upper Contrast" value="1,160 psi" />
              <div style={{ fontSize: 10, background: '#ef4444', color: '#fff', textAlign: 'center', borderRadius: 3, padding: '2px 6px', marginBottom: 4, fontWeight: 800 }}>HIGH RISK</div>
              <Row label="Lower Contrast" value="870 psi" />
              <div style={{ fontSize: 10, background: '#ef4444', color: '#fff', textAlign: 'center', borderRadius: 3, padding: '2px 6px', marginBottom: 4, fontWeight: 800 }}>HIGH RISK</div>
              <Row label="Dist. to Fault" value="984 ft" />
              <Row label="P90 Half-Length" value="1,026 ft" color="#ef4444" />
            </div>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={18} color="#ef4444" />
            <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>P90 Half-Length projection (1,026 ft) may intersect the fault (984 ft away). Review required.</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: Analytics Row ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 1.4fr', gap: 12 }}>

        {/* Uncertainty */}
        <div style={{ ...card(), padding: 16 }}>
          <SectionTitle icon={TrendingUp} title="UNCERTAINTY SUMMARY" color="#06b6d4" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Parameter','P10','P50','P90','Unit'].map(h => (
                  <th key={h} style={{ padding: '4px 2px', fontSize: 10, color: '#64748b', fontWeight: 700, textAlign: h === 'Parameter' ? 'left' : 'right', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Pore Pressure', 4728, 5076, 5424, 'psi'],
                ['Shmin',         6500, 6962, 7450, 'psi'],
                ['SHmax',         7950, 8412, 8950, 'psi'],
                ['Breakdown P.',  7400, 8268, 9150, 'psi'],
              ].map(([n,p10,p50,p90,u]) => (
                <tr key={n} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '5px 2px', fontSize: 11, color: '#94a3b8' }}>{n}</td>
                  <td style={{ padding: '5px 2px', fontSize: 11, color: '#f8fafc', textAlign: 'right' }}>{p10.toLocaleString()}</td>
                  <td style={{ padding: '5px 2px', fontSize: 12, fontWeight: 700, color: '#f8fafc', textAlign: 'right' }}>{p50.toLocaleString()}</td>
                  <td style={{ padding: '5px 2px', fontSize: 11, color: '#f8fafc', textAlign: 'right' }}>{p90.toLocaleString()}</td>
                  <td style={{ padding: '5px 2px', fontSize: 10, color: '#475569', textAlign: 'right' }}>{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sensitivity */}
        <div style={{ ...card(), padding: 16 }}>
          <SectionTitle icon={TrendingUp} title="SENSITIVITY — Impact on Fracture Half-Length" color="#8b5cf6" />
          {[
            ['Net Pressure',      58, '#3b82f6'],
            ['Fracture Height',   22, '#8b5cf6'],
            ["Young's Modulus",   12, '#8b5cf6'],
            ['Fluid Volume',       6, '#8b5cf6'],
            ['Leakoff',            2, '#8b5cf6'],
          ].map(([n,pct,c]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 120, fontSize: 11, color: '#94a3b8', textAlign: 'right', flexShrink: 0 }}>{n}</div>
              <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${c} 0%, ${c}99 100%)`, borderRadius: 4 }} />
              </div>
              <div style={{ width: 36, fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>{pct}%</div>
            </div>
          ))}
        </div>

        {/* Risk Matrix */}
        <div style={{ ...card(), padding: 16 }}>
          <SectionTitle icon={AlertTriangle} title="RISK MATRIX" color="#ef4444" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 2, marginBottom: 6 }}>
            {[5,4,3,2,1].map(row =>
              [1,2,3,4,5].map(col => {
                const risk = row * col
                const bg = risk >= 15 ? '#991b1b' : risk >= 9 ? '#ef4444' : risk >= 4 ? '#f59e0b' : risk >= 2 ? '#84cc16' : '#22c55e'
                const isDot = (row === 4 && col === 5)
                return (
                  <div key={`${row}-${col}`} style={{ aspectRatio:'1', background: bg, borderRadius: 2, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isDot && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '2px solid #0d1b2e' }} />}
                  </div>
                )
              })
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#64748b', paddingLeft: 2, paddingRight: 2, marginBottom: 8 }}>
            {['1','2','3','4','5'].map(n => <span key={n}>{n}</span>)}
          </div>
          <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginBottom: 10 }}>← Likelihood →</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[['Extreme','#991b1b'],['High','#ef4444'],['Moderate','#f59e0b'],['Low','#84cc16'],['Very Low','#22c55e']].map(([l,c])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c, flexShrink:0 }} />
                <span style={{ fontSize:10, color:'#94a3b8' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Assessment */}
        <div style={{ ...card(), padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionTitle icon={CheckCircle} title="OVERALL ASSESSMENT" color="#22c55e" />
          <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: '#22c55e', fontWeight: 900, letterSpacing: '0.04em' }}>CONDITIONALLY ACCEPTABLE</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Requires design optimization before execution</div>
          </div>
          <div style={{ fontSize: 12, color: '#f8fafc', fontWeight: 700 }}>Key Recommendations</div>
          {[
            'Optimize net pressure to reduce height growth risk',
            'Increase stress contrast through stage spacing',
            'Monitor fracture growth via microseismic / DFS',
            'Re-evaluate fault risk with updated offset data',
          ].map((r,i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
