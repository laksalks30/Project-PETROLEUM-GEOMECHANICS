import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine } from 'recharts'

function RiskGauge({ label, pct, color }) {
  const level = pct >= 70 ? 'HIGH' : pct >= 40 ? 'MODERATE' : 'LOW'
  const c = pct >= 70 ? '#ef4444' : pct >= 40 ? '#f59e0b' : '#22c55e'
  return (
    <div style={{ background: 'transparent', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 9, color: '#f8fafc', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{label}</div>
      <div style={{ position: 'relative', width: 64, height: 32, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 64, height: 64, borderRadius: '50%', background: '#0f172a', border: `6px solid #1e293b`, top: 0 }} />
        <div style={{ position: 'absolute', width: 64, height: 64, borderRadius: '50%', border: `6px solid ${c}`, borderBottom: 'transparent', borderRight: 'transparent', top: 0, transform: `rotate(${pct * 1.8 - 90}deg)`, transition: 'transform 0.5s ease' }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: c, marginTop: 6 }}>{level}</div>
      <div style={{ fontSize: 10, color: '#94a3b8' }}>{pct}%</div>
    </div>
  )
}

function RowData({ label, value, unit, color = '#f8fafc' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
      <span style={{ fontSize: 10, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{value} <span style={{ fontSize: 9, color: '#64748b', fontWeight: 500 }}>{unit}</span></span>
    </div>
  )
}

export default function BHS_StressAndIndicators({ bhs, well, stressProfile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
      {/* STRESS PROFILE vs TVD */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12, height: 200, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', marginBottom: 8 }}>STRESS PROFILE <span style={{ fontSize: 9, color: '#64748b', fontWeight: 400 }}>vs. TVD</span></div>
        <div style={{ flex: 1, display: 'flex' }}>
           <div style={{ flex: 1, minHeight: 0 }}>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stressProfile || []} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis dataKey="tvd_ft" type="number" reversed domain={['dataMin', 'dataMax']} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Line dataKey="Pp_psi" stroke="#3b82f6" strokeWidth={1.5} dot={false} type="monotone" isAnimationActive={false} />
                  <Line dataKey="Shmin_psi" stroke="#22c55e" strokeWidth={1.5} dot={false} type="monotone" isAnimationActive={false} />
                  <Line dataKey="SHmax_psi" stroke="#f59e0b" strokeWidth={1.5} dot={false} type="monotone" isAnimationActive={false} />
                  <Line dataKey="Sv_psi" stroke="#94a3b8" strokeWidth={1.5} dot={false} type="monotone" isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
           </div>
           <div style={{ width: 60, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#3b82f6' }}/> <span style={{ fontSize: 9, color: '#f8fafc' }}>Pp</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#22c55e' }}/> <span style={{ fontSize: 9, color: '#f8fafc' }}>Shmin</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#f59e0b' }}/> <span style={{ fontSize: 9, color: '#f8fafc' }}>SHmax</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#94a3b8' }}/> <span style={{ fontSize: 9, color: '#f8fafc' }}>Sv</span></div>
           </div>
        </div>
      </div>

      {/* BOREHOLE CONDITION INDICATORS */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', marginBottom: 12 }}>BOREHOLE CONDITION INDICATORS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
          <RiskGauge label="Breakout Risk" pct={bhs?.breakout_risk_pct || 58} />
          <RiskGauge label="Pack-off Risk" pct={bhs?.packoff_risk_pct || 44} />
          
          {/* Cavings Trend Special Component */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 9, color: '#f8fafc', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cavings Trend</div>
            <div style={{ width: 64, height: 32, background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 50\'%3E%3Cpath fill=\'%23f8fafc\' opacity=\'0.8\' d=\'M20,30 Q30,20 40,30 T60,30 T80,25\'/%3E%3Ccircle cx=\'30\' cy=\'25\' r=\'2\' fill=\'%23f8fafc\'/%3E%3Ccircle cx=\'50\' cy=\'20\' r=\'3\' fill=\'%23f8fafc\'/%3E%3Ccircle cx=\'70\' cy=\'30\' r=\'1.5\' fill=\'%23f8fafc\'/%3E%3C/svg%3E")', backgroundSize: 'cover' }} />
            <div style={{ fontSize: 11, fontWeight: 800, color: bhs?.cavings_trend === 'INCREASING' ? '#ef4444' : '#22c55e', marginTop: 6 }}>{bhs?.cavings_trend || 'INCREASING'}</div>
          </div>
          
          <RiskGauge label="Tight-Hole Tendency" pct={bhs?.tight_hole_pct || 28} />
          <RiskGauge label="Differential Sticking Risk" pct={bhs?.diff_sticking_pct || 55} />
          <RiskGauge label="Losses Risk" pct={bhs?.losses_pct || 22} />
        </div>
      </div>

      {/* TRAJECTORY & WELL INFORMATION */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', marginBottom: 8 }}>TRAJECTORY & WELL INFORMATION</div>
        <div style={{ display: 'flex', gap: 16, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RowData label="TVD" value={(well?.tvd_ft || 9843).toLocaleString()} unit="ft" />
            <RowData label="MD" value={(well?.md_ft || 10250).toLocaleString()} unit="ft" />
            <RowData label="Inclination" value={`${well?.inclination_deg || 90.0}°`} unit="(Vertical)" />
            <RowData label="Hole Size" value={(well?.hole_size_in || 8.50).toFixed(2)} unit="in" />
            <RowData label="Reservoir Top" value={(well?.reservoir_top_ft || 9780).toLocaleString()} unit="ft" color="#a855f7" />
            <RowData label="Reservoir Base" value={(well?.reservoir_base_ft || 9846).toLocaleString()} unit="ft" color="#a855f7" />
            <RowData label="Net Pay" value={well?.net_pay_ft || 66} unit="ft" />
            <RowData label="Formation" value={well?.formation || 'Sandstone'} unit="" />
            <RowData label="Temperature" value={well?.temperature_f || 230} unit="°F" />
          </div>
          {/* Simple Wellbore Graphic Placeholder */}
          <div style={{ width: 140, background: 'linear-gradient(180deg, #3d3023 0%, #2b2218 40%, #1c361e 50%, #2b2218 60%, #3d3023 100%)', borderRadius: 4, position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
             <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 12, background: '#94a3b8', transform: 'translateX(-50%)', borderLeft: '2px solid #e2e8f0', borderRight: '2px solid #64748b' }} />
             <div style={{ position: 'absolute', top: '40%', bottom: '40%', left: 0, right: 0, borderTop: '1px dashed #22c55e', borderBottom: '1px dashed #22c55e', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', right: -65, fontSize: 9, color: '#22c55e' }}>Reservoir Top<br/>{(well?.reservoir_top_ft || 9780).toLocaleString()} ft</div>
                <div style={{ position: 'absolute', right: -65, bottom: -15, fontSize: 9, color: '#22c55e' }}>Reservoir Base<br/>{(well?.reservoir_base_ft || 9846).toLocaleString()} ft</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
