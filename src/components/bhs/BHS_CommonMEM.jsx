import React from 'react'
import { Compass } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'

function RowData({ label, value, unit, color = '#f8fafc' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{value} <span style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>{unit}</span></span>
    </div>
  )
}

function Sparkline({ data, dataKey, color, label, value, unit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '6px 8px', background: 'rgba(7,15,34,0.4)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 800 }}>{value} <span style={{ fontSize: 9, color: '#64748b' }}>{unit}</span></span>
      </div>
      <div style={{ height: 24, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function BHS_CommonMEM({ bhs, mem }) {
  // Mock data for sparklines
  const sparkData = Array.from({ length: 20 }).map((_, i) => ({
    i,
    mw: 12.9 + Math.random() * 0.1,
    flow: 600 + Math.random() * 40,
    spp: 2300 + Math.random() * 200,
    torque: 12 + Math.random() * 2,
    hookload: 105 + Math.random() * 5,
    rop: 30 + Math.random() * 10,
    pit: 475 + Math.random() * 10
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
      {/* COMMON MEM SUMMARY */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', marginBottom: 12 }}>COMMON MEM SUMMARY</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 700, marginBottom: 2 }}>Sv</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8' }}>{(mem?.Sv_psi || 0).toLocaleString()}</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>psi</div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, marginBottom: 2 }}>Shmin</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{(mem?.Shmin_psi || 0).toLocaleString()}</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>psi</div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, marginBottom: 2 }}>SHmax</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{(mem?.SHmax_psi || 0).toLocaleString()}</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>psi</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>SHmax Azimuth</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={16} color="#94a3b8" />
              <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{mem?.stress_azimuth || 'N60°E'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>Stress Regime</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#a855f7' }}>NORMAL FAULTING</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>UCS</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{(mem?.UCS_psi || 0).toLocaleString()} <span style={{ fontSize: 9, color: '#64748b' }}>psi</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>Tensile Strength</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{(mem?.T0_psi || 0).toLocaleString()} <span style={{ fontSize: 9, color: '#64748b' }}>psi</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8 }}>
           <div><span style={{ fontSize: 9, color: '#94a3b8', marginRight: 6 }}>POISSON RATIO</span> <span style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>{mem?.nu_static || 0.286}</span></div>
           <div><span style={{ fontSize: 9, color: '#94a3b8', marginRight: 6 }}>FRICTION ANGLE (φ)</span> <span style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>{mem?.friction_angle_deg || 30}°</span></div>
        </div>
      </div>

      {/* EFFECTIVE STRESSES & PRESSURE CHECKS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 6 }}>
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>EFFECTIVE STRESSES</div>
          <RowData label="Sv'" value={(bhs?.Sv_eff_psi || 0).toLocaleString()} unit="psi" color="#38bdf8" />
          <RowData label="Shmin'" value={(bhs?.Shmin_eff_psi || 0).toLocaleString()} unit="psi" color="#22c55e" />
          <RowData label="SHmax'" value={(bhs?.SHmax_eff_psi || 0).toLocaleString()} unit="psi" color="#f59e0b" />
        </div>
        <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>PRESSURE CHECKS <span style={{ color: '#64748b', fontSize: 9 }}>(at TD)</span></div>
          <RowData label="Hydrostatic Pressure" value={(bhs?.Ph_psi || 0).toLocaleString()} unit="psi" />
          <RowData label="Bottomhole Circulating Pressure" value={(bhs?.PBHC_psi || 0).toLocaleString()} unit="psi" />
          <RowData label="Surge Pressure" value={(bhs?.Ph_surge_psi || 0).toLocaleString()} unit="psi" />
          <RowData label="Swab Pressure" value={(bhs?.Ph_swab_psi || 0).toLocaleString()} unit="psi" />
        </div>
      </div>

      {/* REAL-TIME DRILLING STATUS */}
      <div style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 6, padding: 12, flex: 1 }}>
        <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, marginBottom: 12, letterSpacing: '0.05em' }}>REAL-TIME DRILLING STATUS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          <Sparkline data={sparkData} dataKey="mw" color="#38bdf8" label="MUD WEIGHT" value="12.93" unit="ppg" />
          <Sparkline data={sparkData} dataKey="flow" color="#38bdf8" label="FLOW RATE" value="620" unit="gpm" />
          <Sparkline data={sparkData} dataKey="spp" color="#22c55e" label="SPP" value="2,420" unit="psi" />
          <Sparkline data={sparkData} dataKey="torque" color="#f59e0b" label="TORQUE" value="12.8" unit="klbf-ft" />
          <Sparkline data={sparkData} dataKey="hookload" color="#a855f7" label="HOOKLOAD" value="108" unit="klbf" />
          <Sparkline data={sparkData} dataKey="rop" color="#3b82f6" label="ROP" value="35.6" unit="ft/hr" />
          <Sparkline data={sparkData} dataKey="pit" color="#06b6d4" label="PIT VOLUME" value="480" unit="bbl" />
          
          {/* ECD Trend Mini-Chart (Placeholder for the 13.53 ppg chart in image) */}
          <div style={{ padding: '6px 8px', background: 'rgba(7,15,34,0.4)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#f8fafc', fontWeight: 800 }}>13.53 <span style={{ fontSize: 9, color: '#64748b' }}>(ppg)</span></div>
             <div style={{ fontSize: 9, color: '#a855f7', marginTop: 4 }}>ECD Trend</div>
          </div>
        </div>
      </div>
    </div>
  )
}
