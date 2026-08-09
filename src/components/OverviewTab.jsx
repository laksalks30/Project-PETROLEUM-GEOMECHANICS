import React from 'react'
import { Compass, AlertTriangle, CheckCircle, Flame } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'

function SectionHeader({ title, subtitle, color = '#38bdf8' }) {
  return (
    <div style={{ padding: '6px 12px', background: 'rgba(7,15,34,0.6)', borderTop: `2px solid ${color}`, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.05em' }}>{title}</span>
      {subtitle && <span style={{ fontSize: 9, color: '#64748b' }}>{subtitle}</span>}
    </div>
  )
}

function RowData({ label, value, unit, color = '#f8fafc', valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: 9, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: valueColor || color }}>{value} <span style={{ fontSize: 8, color: '#475569', fontWeight: 500 }}>{unit}</span></span>
    </div>
  )
}

function TornadoBar({ label, pct, color = '#3b82f6' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, height: 14 }}>
      <div style={{ width: 80, fontSize: 8, color: '#94a3b8', textAlign: 'right', paddingRight: 6 }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
         <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 2 }} />
      </div>
      <div style={{ width: 24, fontSize: 8, color: '#f8fafc', textAlign: 'right' }}>{pct}%</div>
    </div>
  )
}

export default function OverviewTab({ data }) {
  const { mem, bhs, frac, risk, well } = data || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflow: 'auto', padding: '10px 14px', background: '#050b14' }}>
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ROW 1: COMMON CALIBRATED MEM SUMMARY */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, overflow: 'hidden' }}>
        <SectionHeader title="COMMON CALIBRATED MEM SUMMARY" color="#10b981" />
        
        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', padding: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.3)' }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 700, marginBottom: 2 }}>Pore Pressure</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8' }}>{(mem?.Pp_psi || 5076).toLocaleString()} <span style={{ fontSize: 9, color: '#64748b' }}>psi</span></div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 700, marginBottom: 2 }}>Vertical Stress (Sv)</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8' }}>{(mem?.Sv_psi || 10157).toLocaleString()} <span style={{ fontSize: 9, color: '#64748b' }}>psi</span></div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 700, marginBottom: 2 }}>Min. Horizontal Stress (Shmin)</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{(mem?.Shmin_psi || 6962).toLocaleString()} <span style={{ fontSize: 9, color: '#64748b' }}>psi</span></div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700, marginBottom: 2 }}>Max. Horizontal Stress (SHmax)</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{(mem?.SHmax_psi || 8412).toLocaleString()} <span style={{ fontSize: 9, color: '#64748b' }}>psi</span></div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 9, color: '#a855f7', fontWeight: 700, marginBottom: 2 }}>Stress Regime</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#a855f7' }}>NORMAL</div>
            <div style={{ fontSize: 8, color: '#94a3b8' }}>Sv {'>'} SHmax {'>'} Shmin</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>SHmax Azimuth</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={16} color="#94a3b8" />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>{mem?.stress_azimuth || 'N60°E'}</span>
            </div>
          </div>
        </div>

        {/* 3 Columns Data */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', padding: 12, gap: 16 }}>
          {/* Col 1 */}
          <div style={{ display: 'flex', gap: 16 }}>
             <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 6 }}>STRESS GRADIENTS <span style={{ color: '#64748b', fontSize: 8 }}>(psi/ft)</span></div>
                <RowData label="Pore Pressure" value="0.516" />
                <RowData label="Sv" value="1.032" valueColor="#38bdf8" />
                <RowData label="Shmin" value="0.707" valueColor="#22c55e" />
                <RowData label="SHmax" value="0.855" valueColor="#f59e0b" />
             </div>
             <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 6 }}>EQUIVALENT MUD WEIGHT <span style={{ color: '#64748b', fontSize: 8 }}>(ppg)</span></div>
                <RowData label="Pore Pressure" value="9.92" />
                <RowData label="Sv" value="19.85" valueColor="#38bdf8" />
                <RowData label="Shmin" value="13.61" valueColor="#22c55e" />
                <RowData label="SHmax" value="16.18" valueColor="#f59e0b" />
             </div>
          </div>
          {/* Col 2 */}
          <div style={{ display: 'flex', gap: 16 }}>
             <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 6 }}>EFFECTIVE STRESSES <span style={{ color: '#64748b', fontSize: 8 }}>(psi)</span></div>
                <div style={{ background: 'rgba(15,23,42,0.4)', padding: 6, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10, color: '#94a3b8' }}>Sv'</span> <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8' }}>5,081</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10, color: '#94a3b8' }}>Shmin'</span> <span style={{ fontSize: 11, fontWeight: 800, color: '#22c55e' }}>1,886</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10, color: '#94a3b8' }}>SHmax'</span> <span style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b' }}>3,336</span></div>
                </div>
             </div>
             <div style={{ flex: 1.2 }}>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 6 }}>ROCK PROPERTIES <span style={{ color: '#64748b', fontSize: 8 }}>(Static)</span></div>
                <RowData label="E (Young's Modulus)" value="2.67" unit="MMpsi" />
                <RowData label="v (Poisson's Ratio)" value="0.286" />
                <RowData label="UCS" value="4,351" unit="psi" />
                <RowData label="Tensile Strength" value="435" unit="psi" />
                <RowData label="Friction Angle (φ)" value="30°" />
             </div>
          </div>
          {/* Col 3: Chart */}
          <div>
            <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>STRESS PROFILE <span style={{ color: '#64748b', fontSize: 8 }}>(psi)</span></div>
            <div style={{ height: 100, display: 'flex' }}>
               <div style={{ flex: 1 }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.stress_profile || []} layout="vertical" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <XAxis type="number" hide domain={[0, 'dataMax']} />
                      <YAxis dataKey="tvd_ft" type="number" reversed domain={['dataMin', 'dataMax']} tick={{ fontSize: 7, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Line dataKey="Pp_psi" stroke="#3b82f6" strokeWidth={1} dot={false} type="monotone" isAnimationActive={false} />
                      <Line dataKey="Shmin_psi" stroke="#22c55e" strokeWidth={1} dot={false} type="monotone" isAnimationActive={false} />
                      <Line dataKey="SHmax_psi" stroke="#f59e0b" strokeWidth={1} dot={false} type="monotone" isAnimationActive={false} />
                      <Line dataKey="Sv_psi" stroke="#94a3b8" strokeWidth={1} dot={false} type="monotone" isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
               <div style={{ width: 45, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 2, background: '#3b82f6' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>Pp</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 2, background: '#22c55e' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>Shmin</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 2, background: '#f59e0b' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>SHmax</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 2, background: '#94a3b8' }}/> <span style={{ fontSize: 8, color: '#f8fafc' }}>Sv</span></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ROW 2: ENGINE SPLIT (Borehole Stability & Hydraulic Fracturing) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 6 }}>
        
        {/* LEFT: BOREHOLE STABILITY ENGINE */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title="BOREHOLE STABILITY ENGINE" color="#0ea5e9" />
          
          <div style={{ display: 'flex', padding: 12, gap: 12, flex: 1 }}>
            {/* Window Visual */}
            <div style={{ width: 110 }}>
              <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 2 }}>MUD WEIGHT WINDOW</div>
              <div style={{ fontSize: 8, color: '#64748b', marginBottom: 6 }}>(ppg)</div>
              
              <div style={{ position: 'relative', height: 160, borderLeft: '1px solid #334155', borderBottom: '1px solid #334155', marginLeft: 16 }}>
                <div style={{ position: 'absolute', left: -16, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 8, color: '#64748b' }}>
                  <span>17.0</span><span>16.0</span><span>15.0</span><span>14.0</span><span>13.0</span><span>12.0</span><span>11.0</span><span>10.0</span><span>9.0</span><span>8.0</span>
                </div>
                
                {/* Colored blocks corresponding to image */}
                <div style={{ position: 'absolute', left: 0, right: 0, top: '20%', bottom: '80%', borderTop: '1px dashed #ef4444' }}><span style={{ position: 'absolute', left: 40, top: -4, fontSize: 8, color: '#ef4444', whiteSpace: 'nowrap', fontWeight: 700 }}>Breakdown Limit<br/>15.31 <span style={{fontSize: 7}}>ppg</span></span></div>
                
                <div style={{ position: 'absolute', left: 0, right: 0, top: '35%', bottom: '65%', borderTop: '1px dashed #f59e0b' }}><span style={{ position: 'absolute', left: 40, top: -4, fontSize: 8, color: '#f59e0b', whiteSpace: 'nowrap', fontWeight: 700 }}>Max. Operating ECD<br/>14.46 <span style={{fontSize: 7}}>ppg</span></span></div>
                
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', bottom: '50%', background: 'linear-gradient(to right, #38bdf8 0%, transparent 100%)', height: 16, marginTop: -8 }}>
                  <div style={{ position: 'absolute', left: 40, background: '#1e293b', border: '1px solid #38bdf8', padding: '2px 4px', borderRadius: 2 }}>
                     <span style={{ fontSize: 8, color: '#f8fafc' }}>SELECTED MW<br/><span style={{fontSize: 10, fontWeight: 800}}>12.93</span> <span style={{fontSize: 7}}>ppg</span></span>
                  </div>
                </div>

                <div style={{ position: 'absolute', left: 0, right: 0, top: '65%', bottom: '35%', borderTop: '1px dashed #eab308' }}><span style={{ position: 'absolute', left: 40, top: -4, fontSize: 8, color: '#eab308', whiteSpace: 'nowrap', fontWeight: 700 }}>Min. Operating MW<br/>12.41 <span style={{fontSize: 7}}>ppg</span></span></div>
                
                <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', bottom: '25%', borderTop: '1px dashed #ef4444' }}><span style={{ position: 'absolute', left: 40, top: -4, fontSize: 8, color: '#ef4444', whiteSpace: 'nowrap', fontWeight: 700 }}>Collapse Limit<br/>11.76 <span style={{fontSize: 7}}>ppg</span></span></div>
                
                <div style={{ position: 'absolute', left: 0, right: 0, top: '90%', bottom: '10%', borderTop: '1px dashed #3b82f6' }}><span style={{ position: 'absolute', left: 40, top: -4, fontSize: 8, color: '#38bdf8', whiteSpace: 'nowrap', fontWeight: 700 }}>Pore Pressure<br/>9.92 <span style={{fontSize: 7}}>ppg</span></span></div>
              </div>
            </div>

            {/* Tables */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2 }}>KEY PRESSURES <span style={{ color: '#64748b', fontSize: 8 }}>(psi)</span></div>
                <RowData label="Pore Pressure (Pp)" value="5,076" />
                <RowData label="Collapse Pressure" value="6,019" />
                <RowData label="Breakdown Pressure" value="7,833" />
                <RowData label="Selected Hydrostatic" value="6,620" />
                <RowData label="Circulating BHP (ECD)" value="6,925" />
                <RowData label="Surge Pressure" value="6,983" />
                <RowData label="Swab Pressure" value="6,330" />
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2 }}>EQUIVALENT MUD WEIGHT <span style={{ color: '#64748b', fontSize: 8 }}>(ppg)</span></div>
                <RowData label="Circulating ECD" value="13.53" />
                <RowData label="Surge EMW" value="13.65" />
                <RowData label="Swab EMW" value="12.37" />
              </div>
            </div>
          </div>
          
          {/* Footer statuses */}
          <div style={{ display: 'flex', gap: 6, padding: '0 12px 12px 12px' }}>
            <div style={{ flex: 1, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4, padding: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
               <CheckCircle size={20} color="#22c55e" />
               <div>
                 <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700 }}>STABILITY STATUS</div>
                 <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 800 }}>CONDITIONALLY ACCEPTABLE</div>
               </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, padding: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
               <AlertTriangle size={20} color="#f59e0b" />
               <div>
                 <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700 }}>MAIN RISK</div>
                 <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 800 }}>Swab-Induced Instability</div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: HYDRAULIC FRACTURING DESIGN ENGINE */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title="HYDRAULIC FRACTURING DESIGN ENGINE" color="#8b5cf6" />
          
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>DFIT Calibrated Shmin</div>
                <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 800 }}>7,107 <span style={{fontSize: 8, color:'#64748b'}}>psi</span></div>
             </div>
             <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>Breakdown Pressure</div>
                <div style={{ fontSize: 14, color: '#f59e0b', fontWeight: 800 }}>8,268 <span style={{fontSize: 8, color:'#64748b'}}>psi</span></div>
             </div>
             <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>Design Net Pressure</div>
                <div style={{ fontSize: 14, color: '#38bdf8', fontWeight: 800 }}>1,450 <span style={{fontSize: 8, color:'#64748b'}}>psi</span></div>
             </div>
             <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>BHTP</div>
                <div style={{ fontSize: 14, color: '#ec4899', fontWeight: 800 }}>9,282 <span style={{fontSize: 8, color:'#64748b'}}>psi</span></div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>Surface Treating Pressure</div>
                <div style={{ fontSize: 14, color: '#06b6d4', fontWeight: 800 }}>5,959 <span style={{fontSize: 8, color:'#64748b'}}>psi</span></div>
             </div>
          </div>

          <div style={{ display: 'flex', padding: 12, gap: 12, flex: 1 }}>
             {/* Fracture Geometry Mockup */}
             <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2 }}>FRACTURE GEOMETRY</div>
                <div style={{ flex: 1, background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'grad\' x1=\'0%25\' y1=\'0%25\' x2=\'0%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%231e293b;stop-opacity:1\' /%3E%3Cstop offset=\'100%25\' style=\'stop-color:%230f172a;stop-opacity:1\' /%3E%3C/linearGradient%3E%3CradialGradient id=\'frac\' cx=\'50%25\' cy=\'50%25\' r=\'50%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%239333ea;stop-opacity:0.8\' /%3E%3Cstop offset=\'100%25\' style=\'stop-color:%234c1d95;stop-opacity:0\' /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grad)\' /%3E%3Cellipse cx=\'50%25\' cy=\'65%25\' rx=\'45%25\' ry=\'15%25\' fill=\'url(%23frac)\' /%3E%3Crect x=\'48%25\' y=\'0\' width=\'4%25\' height=\'100%25\' fill=\'%2394a3b8\' opacity=\'0.8\' /%3E%3C/svg%3E")', backgroundSize: 'cover', borderRadius: 4, position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                   {/* Overlay Labels */}
                   <div style={{ position: 'absolute', top: '25%', left: '25%', color: '#f8fafc', fontSize: 8, textAlign: 'center' }}>↑<br/>Fracture Height<br/>98 ft<br/>↓</div>
                   <div style={{ position: 'absolute', bottom: '15%', left: '15%', color: '#f8fafc', fontSize: 8 }}>← Half-Length (xf) →<br/>855 ft</div>
                   <div style={{ position: 'absolute', bottom: '15%', right: '15%', color: '#f8fafc', fontSize: 8 }}>← Half-Length (xf) →<br/>855 ft</div>
                   <div style={{ position: 'absolute', bottom: '5%', width: '100%', color: '#f8fafc', fontSize: 8, textAlign: 'center' }}>Total Length<br/>1,710 ft</div>
                </div>
             </div>

             {/* Design Summary */}
             <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2 }}>DESIGN SUMMARY</div>
                <RowData label="Total Fluid Volume" value="3,270" unit="bbl" />
                <RowData label="Pumping Rate" value="25.2" unit="bpm" />
                <RowData label="Pumping Time" value="130 - 145" unit="min" />
                <RowData label="Total Proppant" value="396,800" unit="lb" />
                <div style={{ textAlign: 'right', fontSize: 7, color: '#64748b', marginTop: -2, marginBottom: 2 }}>(198.4 short ton)</div>
                <RowData label="Average Proppant Conc." value="2.89" unit="lb/gal" />
                <RowData label="Max. Fracture Width" value="1.17" unit="in" />
                <RowData label="Average Fracture Width" value="0.92" unit="in" />
                <RowData label="Average Propped Width" value="0.284" unit="in" />
                <RowData label="Fracture Volume (Eff.)" value="2,289" unit="bbl" />
                <RowData label="Proppant Bulk Volume" value="707" unit="bbl" />
             </div>

             {/* Rightmost column inside HF */}
             <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2 }}>STRESS CONTAINMENT</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                     <span style={{ fontSize: 9, color: '#94a3b8' }}>Upper Contrast</span>
                     <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700 }}>1,160 <span style={{fontSize:8, color:'#64748b'}}>psi</span></div>
                       <div style={{ fontSize: 6, background: '#ef4444', color: '#fff', padding: '1px 4px', borderRadius: 2, display: 'inline-block', fontWeight: 800 }}>HIGH RISK</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: 9, color: '#94a3b8' }}>Lower Contrast</span>
                     <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700 }}>870 <span style={{fontSize:8, color:'#64748b'}}>psi</span></div>
                       <div style={{ fontSize: 6, background: '#ef4444', color: '#fff', padding: '1px 4px', borderRadius: 2, display: 'inline-block', fontWeight: 800 }}>HIGH RISK</div>
                     </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 9, color: '#f8fafc', fontWeight: 700, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2 }}>FAULT INTERACTION</div>
                  <RowData label="Distance to Fault" value="984" unit="ft" />
                  <RowData label="Half-Length (xf)" value="855" unit="ft" />
                  <RowData label="P90 Half-Length (+20%)" value="1,026" unit="ft" />
                  
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: 6, borderRadius: 4, marginTop: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                     <AlertTriangle size={14} color="#ef4444" />
                     <span style={{ fontSize: 8, color: '#ef4444', fontWeight: 800 }}>P90 PROJECTION MAY INTERSECT THE FAULT</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ROW 3: BOTTOM ANALYTICS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr 1.5fr', gap: 6 }}>
        
        {/* UNCERTAINTY SUMMARY */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#f8fafc', marginBottom: 6, letterSpacing: '0.05em' }}>UNCERTAINTY SUMMARY <span style={{ color: '#64748b', fontSize: 8 }}>(P10 / P50 / P90)</span></div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Parameter','P10','P50 (Base)','P90','Unit'].map(h => (
                  <th key={h} style={{ padding: '2px', color: '#64748b', fontWeight: 700, textAlign: h === 'Parameter' ? 'left' : 'right', fontSize: 7 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Pore Pressure', p10: 4728, p50: 5076, p90: 5424, unit: 'psi' },
                { name: 'Shmin', p10: 6500, p50: 6962, p90: 7450, unit: 'psi' },
                { name: 'SHmax', p10: 7950, p50: 8412, p90: 8950, unit: 'psi' },
                { name: 'Breakdown Pressure', p10: 7400, p50: 8268, p90: 9150, unit: 'psi' },
              ].map(r => (
                <tr key={r.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '2px', color: '#94a3b8', fontSize: 8 }}>{r.name}</td>
                  <td style={{ padding: '2px', color: '#f8fafc', textAlign: 'right', fontSize: 8 }}>{r.p10?.toLocaleString()}</td>
                  <td style={{ padding: '2px', color: '#f8fafc', textAlign: 'right', fontSize: 8, fontWeight: 700 }}>{r.p50?.toLocaleString()}</td>
                  <td style={{ padding: '2px', color: '#f8fafc', textAlign: 'right', fontSize: 8 }}>{r.p90?.toLocaleString()}</td>
                  <td style={{ padding: '2px', color: '#475569', textAlign: 'right', fontSize: 7 }}>{r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SENSITIVITY */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 10 }}>
           <div style={{ fontSize: 9, fontWeight: 800, color: '#f8fafc', marginBottom: 6, letterSpacing: '0.05em' }}>SENSITIVITY – FRACTURE HALF-LENGTH <span style={{ color: '#64748b', fontSize: 8 }}>(xf)</span></div>
           <div style={{ fontSize: 8, color: '#94a3b8', marginBottom: 6 }}>Tornado Chart (Impact to xf)</div>
           <TornadoBar label="Net Pressure" pct={58} />
           <TornadoBar label="Fracture Height" pct={22} color="#a855f7" />
           <TornadoBar label="E (Young's Modulus)" pct={12} color="#a855f7" />
           <TornadoBar label="Fluid Volume" pct={6} color="#a855f7" />
           <TornadoBar label="Leakoff" pct={2} color="#a855f7" />
           <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 86, marginRight: 24, borderTop: '1px solid #334155', paddingTop: 2, fontSize: 7, color: '#64748b' }}>
              <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
           </div>
           <div style={{ textAlign: 'center', fontSize: 7, color: '#64748b' }}>Impact (%)</div>
        </div>

        {/* RISK MATRIX */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 10 }}>
           <div style={{ fontSize: 9, fontWeight: 800, color: '#f8fafc', marginBottom: 6, letterSpacing: '0.05em' }}>RISK MATRIX</div>
           {/* Matrix Visual Placeholder matching image */}
           <div style={{ position: 'relative', height: 80, width: '100%', display: 'flex' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 7, color: '#64748b', paddingRight: 4 }}>
                 <span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                 <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Crect width='20' height='20' x='0' y='80' fill='%2322c55e'/%3E%3Crect width='20' height='20' x='20' y='80' fill='%2322c55e'/%3E%3Crect width='20' height='20' x='40' y='80' fill='%2384cc16'/%3E%3Crect width='20' height='20' x='60' y='80' fill='%23eab308'/%3E%3Crect width='20' height='20' x='80' y='80' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='0' y='60' fill='%2322c55e'/%3E%3Crect width='20' height='20' x='20' y='60' fill='%2384cc16'/%3E%3Crect width='20' height='20' x='40' y='60' fill='%23eab308'/%3E%3Crect width='20' height='20' x='60' y='60' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='80' y='60' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='0' y='40' fill='%2384cc16'/%3E%3Crect width='20' height='20' x='20' y='40' fill='%23eab308'/%3E%3Crect width='20' height='20' x='40' y='40' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='60' y='40' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='80' y='40' fill='%23dc2626'/%3E%3Crect width='20' height='20' x='0' y='20' fill='%23eab308'/%3E%3Crect width='20' height='20' x='20' y='20' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='40' y='20' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='60' y='20' fill='%23dc2626'/%3E%3Crect width='20' height='20' x='80' y='20' fill='%23991b1b'/%3E%3Crect width='20' height='20' x='0' y='0' fill='%23f59e0b'/%3E%3Crect width='20' height='20' x='20' y='0' fill='%23ef4444'/%3E%3Crect width='20' height='20' x='40' y='0' fill='%23dc2626'/%3E%3Crect width='20' height='20' x='60' y='0' fill='%23991b1b'/%3E%3Crect width='20' height='20' x='80' y='0' fill='%237f1d1d'/%3E%3Ccircle cx='90' cy='10' r='4' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E" alt="Risk Matrix" style={{ width: '100%', height: '100%', display: 'block', opacity: 0.9 }} />
                 <div style={{ position: 'absolute', left: -10, top: '50%', transform: 'rotate(-90deg) translateX(-50%)', transformOrigin: 'left', fontSize: 6, color: '#64748b' }}>Consequence</div>
              </div>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft: 12, fontSize: 7, color: '#64748b', marginTop: 2 }}>
             <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
           </div>
           <div style={{ textAlign: 'center', fontSize: 7, color: '#64748b' }}>Likelihood</div>
        </div>

        {/* OVERALL ASSESSMENT */}
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 10, display: 'flex', flexDirection: 'column' }}>
           <div style={{ fontSize: 9, fontWeight: 800, color: '#f8fafc', marginBottom: 6, letterSpacing: '0.05em' }}>OVERALL ASSESSMENT</div>
           
           <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', padding: '6px', textAlign: 'center', borderRadius: 4, marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 800 }}>CONDITIONALLY ACCEPTABLE</div>
              <div style={{ fontSize: 8, color: '#f8fafc' }}>REQUIRES DESIGN OPTIMIZATION</div>
           </div>

           <div style={{ fontSize: 8, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>KEY RECOMMENDATIONS</div>
           <ul style={{ margin: 0, paddingLeft: 12, fontSize: 8, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <li>Optimize net pressure to reduce height growth risk</li>
              <li>Increase stress contrast through stage spacing</li>
              <li>Monitor fracture growth (microseismic / DFS)</li>
              <li>Re-evaluate fault risk with updated offset data</li>
           </ul>
        </div>

      </div>
    </div>
  )
}
