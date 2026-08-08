import React from 'react'
import { Compass, Activity, Shield, ArrowDownToLine, MoveHorizontal, Droplet } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function MEMSummary({ mem, stressProfile }) {
  if (!mem) return <CardSkeleton />

  const tvd = mem.target_tvd_ft || 0
  const E = mem.E_static_MMpsi || 0
  const v = mem.nu_static || 0
  const ucs = mem.UCS_psi || 0
  const t0 = mem.T0_psi || 0
  const phi = mem.friction_angle_deg || 0

  // Fallbacks if backend doesn't provide them
  const grads = mem.gradients || { Pp: 0, Sv: 0, Shmin: 0, SHmax: 0 }
  const emw = mem.emw || { Pp: 0, Sv: 0, Shmin: 0, SHmax: 0 }
  const eff = mem.effective || { Sv: 0, Shmin: 0, SHmax: 0 }
  
  const regime = mem.stress_regime_calc || 'NORMAL'
  const regimeDesc = mem.stress_regime_desc || 'Sv > Shmax > Shmin'

  const profileData = stressProfile?.vs_depth || stressProfile?.layers || []
  const resTop = stressProfile?.reservoir_top_ft || 0
  const resBase = stressProfile?.reservoir_base_ft || 0

  return (
    <div className="card flex flex-col" id="panel-mem-summary" style={{ background: '#0a1428', border: '1px solid rgba(56,189,248,0.2)' }}>
      {/* HEADER */}
      <div className="flex items-center gap-2" style={{ padding: '8px 12px', background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)', borderBottom: '1px solid rgba(56,189,248,0.15)', borderLeft: '2px solid #38bdf8' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', textTransform: 'uppercase' }}>COMMON CALIBRATED MEM SUMMARY</span>
      </div>

      <div className="p-3 flex flex-col gap-4">
        {/* TOP ROW - BIG NUMBERS */}
        <div className="grid grid-cols-6 gap-3">
          <TopNumber label="Pore Pressure" value={mem.Pp_psi} unit="psi" color="#3b82f6" />
          <TopNumber label="Vertical Stress (Sv)" value={mem.Sv_psi} unit="psi" color="#94a3b8" />
          <TopNumber label="Min. Horizontal Stress (Shmin)" value={mem.Shmin_psi} unit="psi" color="#22c55e" />
          <TopNumber label="Max. Horizontal Stress (SHmax)" value={mem.SHmax_psi} unit="psi" color="#f59e0b" />
          
          <div className="flex flex-col justify-center px-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Stress Regime</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#a855f7', marginTop: 2, letterSpacing: '0.05em' }}>{regime}</span>
            <span style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{regimeDesc}</span>
          </div>
          
          <div className="flex items-center gap-3 px-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex flex-col justify-center">
              <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>SHmax Azimuth</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>{mem.stress_azimuth}</span>
            </div>
            <Compass size={36} color="#475569" strokeWidth={1} />
          </div>
        </div>

        {/* BOTTOM ROW - SUB-TABLES */}
        <div className="grid grid-cols-5 gap-3">
          {/* Gradients */}
          <SubTable title="STRESS GRADIENTS (psi/ft)">
            <SubRow label="Pore Pressure" value={grads.Pp?.toFixed(3)} color="#3b82f6" />
            <SubRow label="Sv" value={grads.Sv?.toFixed(3)} color="#94a3b8" />
            <SubRow label="Shmin" value={grads.Shmin?.toFixed(3)} color="#22c55e" />
            <SubRow label="SHmax" value={grads.SHmax?.toFixed(3)} color="#f59e0b" />
          </SubTable>

          {/* EMW */}
          <SubTable title="EQUIVALENT MUD WEIGHT (ppg)">
            <SubRow label="Pore Pressure" value={emw.Pp?.toFixed(2)} color="#3b82f6" />
            <SubRow label="Sv" value={emw.Sv?.toFixed(2)} color="#94a3b8" />
            <SubRow label="Shmin" value={emw.Shmin?.toFixed(2)} color="#22c55e" />
            <SubRow label="SHmax" value={emw.SHmax?.toFixed(2)} color="#f59e0b" />
          </SubTable>

          {/* Effective Stresses */}
          <SubTable title="EFFECTIVE STRESSES (psi)">
            <SubRow label="Sv'" value={eff.Sv?.toLocaleString()} color="#94a3b8" />
            <div className="my-2" />
            <SubRow label="Shmin'" value={eff.Shmin?.toLocaleString()} color="#22c55e" />
            <div className="my-2" />
            <SubRow label="SHmax'" value={eff.SHmax?.toLocaleString()} color="#f59e0b" />
          </SubTable>

          {/* Rock Properties */}
          <SubTable title="ROCK PROPERTIES (Static)">
            <SubRow label="E (Young's Modulus)" value={E?.toFixed(2)} unit="MMpsi" />
            <SubRow label="v (Poisson's Ratio)" value={v?.toFixed(3)} />
            <SubRow label="UCS" value={ucs?.toLocaleString()} unit="psi" />
            <SubRow label="Tensile Strength" value={t0?.toLocaleString()} unit="psi" />
            <SubRow label="Friction Angle (φ)" value={`${phi}°`} />
          </SubTable>

          {/* Stress Profile Chart */}
          <div className="flex flex-col">
            <span style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 6 }}>STRESS PROFILE (psi)</span>
            <div className="flex-1 w-full" style={{ minHeight: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profileData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis dataKey="tvd_ft" type="number" domain={['dataMax + 50', 'dataMin - 50']} hide />
                  {resTop > 0 && <ReferenceLine y={resTop} stroke="#a855f7" strokeDasharray="3 3" opacity={0.3} />}
                  {resBase > 0 && <ReferenceLine y={resBase} stroke="#a855f7" strokeDasharray="3 3" opacity={0.3} />}
                  <Line dataKey="Shmin_psi" stroke="#22c55e" strokeWidth={1.5} dot={false} type="monotone" isAnimationActive={false} />
                  <Line dataKey="SHmax_psi" stroke="#f59e0b" strokeWidth={1.5} dot={false} type="monotone" isAnimationActive={false} />
                  <Line dataKey="Sv_psi"    stroke="#64748b" strokeWidth={1}   dot={false} type="monotone" isAnimationActive={false} />
                  <Line dataKey="Pp_psi"    stroke="#3b82f6" strokeWidth={1}   dot={false} type="monotone" isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Small Legend */}
            <div className="flex flex-col items-end gap-1 mt-1">
              <LegendItem color="#3b82f6" label="Pp" />
              <LegendItem color="#22c55e" label="Shmin" />
              <LegendItem color="#f59e0b" label="SHmax" />
              <LegendItem color="#64748b" label="Sv" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopNumber({ label, value, unit, color }) {
  return (
    <div className="flex flex-col justify-center px-1">
      <span style={{ fontSize: 10, color: color, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.02em', marginBottom: 2 }}>{label}</span>
      <div className="flex items-baseline gap-1">
        <span style={{ fontSize: 26, fontWeight: 900, color: color, letterSpacing: '0.02em' }}>{value?.toLocaleString()}</span>
        <span style={{ fontSize: 11, color: color, opacity: 0.6, fontWeight: 600 }}>{unit}</span>
      </div>
    </div>
  )
}

function SubTable({ title, children }) {
  return (
    <div className="flex flex-col p-2.5 rounded" style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 10, color: '#f8fafc', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>{title}</span>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

function SubRow({ label, value, unit, color = '#f8fafc' }) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
        {label.includes('(') ? (
          <>
            <span style={{ color }}>{label.charAt(0)}</span>
            {label.slice(1)}
          </>
        ) : (
          <span style={{ color }}>{label}</span>
        )}
      </span>
      <span style={{ fontSize: 12, color: '#f8fafc', fontWeight: 700 }}>
        {value} {unit && <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>{unit}</span>}
      </span>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ width: 10, height: 2, background: color }} />
      <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{label}</span>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card h-full animate-pulse flex flex-col p-4 gap-4">
      <div className="h-6 w-1/4 rounded bg-[#1e293b]" />
      <div className="h-16 w-full rounded bg-[#0f172a]" />
      <div className="h-32 w-full rounded bg-[#0f172a]" />
    </div>
  )
}
