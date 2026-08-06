import React from 'react'
import { Table } from 'lucide-react'

export default function PumpingSchedule({ schedule }) {
  if (!schedule) return <div className="card h-full animate-pulse" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}><div className="card-title">LOADING SCHEDULE...</div></div>

  const stages = schedule.stages || []
  const colors = ['#94a3b8', '#38bdf8', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-pumping-schedule" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <Table size={12} color="#38bdf8" />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>PUMPING SCHEDULE</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#070f22', borderBottom: '1px solid rgba(30,41,59,0.8)', position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              <th title="Tahapan injeksi" style={{ color: '#64748b', fontWeight: 800, padding: '8px 10px', textAlign: 'left', fontSize: 10, letterSpacing: '0.05em' }}>STAGE</th>
              <th title="Volume fluida per stage" style={{ color: '#64748b', fontWeight: 800, padding: '8px 10px', textAlign: 'right', fontSize: 10, letterSpacing: '0.05em' }}>FLUID (BBL)</th>
              <th title="Laju injeksi per stage" style={{ color: '#64748b', fontWeight: 800, padding: '8px 10px', textAlign: 'right', fontSize: 10, letterSpacing: '0.05em' }}>RATE (BPM)</th>
              <th title="Konsentrasi proppant" style={{ color: '#64748b', fontWeight: 800, padding: '8px 10px', textAlign: 'right', fontSize: 10, letterSpacing: '0.05em' }}>PROP (LB/GAL)</th>
              <th title="Massa proppant" style={{ color: '#64748b', fontWeight: 800, padding: '8px 10px', textAlign: 'right', fontSize: 10, letterSpacing: '0.05em' }}>PROPPANT (LB)</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s, i) => (
              <tr key={s.stage} className="hover:bg-blue-900/10 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '6px 10px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length], boxShadow: `0 0 4px ${colors[i % colors.length]}` }} />
                    <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600 }}>{s.stage}</span>
                  </div>
                </td>
                <td style={{ fontSize: 11, textAlign: 'right', padding: '6px 10px', color: '#f8fafc', fontWeight: 600 }}>{s.fluid_bbl?.toLocaleString()}</td>
                <td style={{ fontSize: 11, textAlign: 'right', padding: '6px 10px', color: '#f8fafc', fontWeight: 600 }}>{s.rate_bpm}</td>
                <td style={{ fontSize: 11, textAlign: 'right', padding: '6px 10px', color: '#f8fafc', fontWeight: 600 }}>{s.proppant_lb_gal}</td>
                <td style={{ fontSize: 11, textAlign: 'right', padding: '6px 10px', color: '#fbbf24', fontWeight: 700 }}>{s.proppant_lb?.toLocaleString()}</td>
              </tr>
            ))}
            <tr style={{ background: 'rgba(56,189,248,0.05)', borderTop: '1px solid rgba(56,189,248,0.3)' }}>
              <td style={{ fontSize: 11, padding: '10px', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em' }}>TOTAL</td>
              <td style={{ fontSize: 12, textAlign: 'right', padding: '10px', color: '#38bdf8', fontWeight: 800 }}>{schedule.total_fluid_bbl?.toLocaleString()}</td>
              <td style={{ fontSize: 11, textAlign: 'right', padding: '10px', color: '#94a3b8', fontWeight: 600 }}>{schedule.avg_rate_bpm} avg</td>
              <td style={{ fontSize: 11, textAlign: 'right', padding: '10px', color: '#94a3b8', fontWeight: 600 }}>—</td>
              <td style={{ fontSize: 12, textAlign: 'right', padding: '10px', color: '#fbbf24', fontWeight: 800 }}>{schedule.total_proppant_lb?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
