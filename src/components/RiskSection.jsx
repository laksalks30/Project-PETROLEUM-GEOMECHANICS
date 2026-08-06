import React from 'react'
import { AlertTriangle, CheckCircle, XCircle, AlertOctagon } from 'lucide-react'

const MATRIX_COLORS = [
  // C=1 (bottom)
  ['#166534', '#22c55e', '#22c55e', '#eab308', '#eab308'],
  // C=2
  ['#22c55e', '#22c55e', '#eab308', '#eab308', '#f97316'],
  // C=3
  ['#22c55e', '#eab308', '#eab308', '#f97316', '#ef4444'],
  // C=4
  ['#eab308', '#eab308', '#f97316', '#ef4444', '#ef4444'],
  // C=5 (top)
  ['#eab308', '#f97316', '#ef4444', '#ef4444', '#991b1b'],
];

function getRiskColor(likelihood, consequence) {
  const bg = MATRIX_COLORS[consequence - 1][likelihood - 1];
  return { bg, border: 'rgba(255,255,255,0.05)', text: '#ffffff' };
}

export default function RiskSection({ risk }) {
  if (!risk) return <div className="card h-full animate-pulse" style={{ background: '#0a1428' }}><div className="card-title">LOADING RISK...</div></div>

  const risks = risk.risks || []
  const recs  = risk.recommendations || []
  const overallRisk = risk.overall_risk || 'High'

  return (
    <div className="grid gap-2 h-full" style={{ gridTemplateColumns: '220px 230px 1.2fr 1.8fr' }}>
      {/* 1. Risk Matrix */}
      <div className="card flex flex-col overflow-hidden" id="panel-risk-matrix" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
        <div className="flex items-center gap-2" style={{ padding: '8px 12px', background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)', borderBottom: '1px solid rgba(56,189,248,0.15)', borderLeft: '2px solid #38bdf8' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>RISK MATRIX</span>
        </div>
        <div className="p-2 flex flex-col gap-2 flex-1">
          <RiskMatrix risks={risks} />
          <div className="mt-1 flex flex-col items-center">
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6, fontWeight: 800, letterSpacing: '0.05em' }}>RISK LEVEL GUIDE</div>
            <div className="flex gap-3 justify-center">
              <LegendDot color="#22c55e" label="LOW" />
              <LegendDot color="#f59e0b" label="MODERATE" />
              <LegendDot color="#ef4444" label="HIGH" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Highlighted Risks */}
      <div className="card flex flex-col overflow-hidden" id="panel-highlighted-risks" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
        <div className="flex items-center gap-2" style={{ padding: '8px 12px', background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)', borderBottom: '1px solid rgba(56,189,248,0.15)', borderLeft: '2px solid #38bdf8' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>HIGHLIGHTED RISKS</span>
        </div>
        <div className="p-2.5 flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
          {(risk.highlighted_risks || []).map((r, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: '#070f22', border: '1px solid rgba(30,41,59,0.8)' }}>
              <div className="flex gap-2 items-center">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-900/40 text-blue-400 border border-blue-500/30" style={{ fontSize: 11, fontWeight: 800 }}>{i + 1}</div>
                <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600 }}>{r.name}</span>
              </div>
              <RiskBadge level={r.level} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Overall Assessment */}
      <div className="card flex flex-col overflow-hidden" id="panel-overall-assessment" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
        <div className="flex items-center gap-2" style={{ padding: '8px 12px', background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)', borderBottom: '1px solid rgba(56,189,248,0.15)', borderLeft: '2px solid #38bdf8' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>OVERALL ASSESSMENT</span>
        </div>
        <div className="p-3 flex flex-col gap-2 flex-1 justify-center">
          <div className="rounded-xl p-5 text-center flex flex-col justify-center h-full relative overflow-hidden" style={{
            background: overallRisk === 'High' ? 'linear-gradient(145deg, rgba(239,68,68,0.15), rgba(7,15,34,1))' : 'linear-gradient(145deg, rgba(34,197,94,0.15), rgba(7,15,34,1))',
            border: `1px solid ${overallRisk === 'High' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
            boxShadow: `0 0 30px ${overallRisk === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'} inset`
          }}>
            <div className="flex justify-center gap-6 mb-4 relative z-10">
              <IconBox icon={AlertOctagon} label="Height Growth" color={overallRisk === 'High' ? '#ef4444' : '#22c55e'} />
              <IconBox icon={AlertTriangle} label="Fault Proximity" color={overallRisk === 'High' ? '#f59e0b' : '#22c55e'} />
              <IconBox icon={XCircle} label="Design Review" color="#38bdf8" />
            </div>
            <div className="relative z-10" style={{ fontSize: 18, fontWeight: 900, color: overallRisk === 'High' ? '#ef4444' : '#22c55e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {risk.overall_assessment || 'REQUIRES OPTIMIZATION'}
            </div>
            <div className="relative z-10 mt-2" style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
              Overall Risk Level: <span style={{ color: overallRisk === 'High' ? '#ef4444' : (overallRisk === 'Moderate' ? '#f59e0b' : '#22c55e'), fontWeight: 900, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4, marginLeft: 6 }}>{overallRisk}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recommendations */}
      <div className="card flex flex-col min-w-0 overflow-hidden" id="panel-recommendations" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
        <div className="flex items-center gap-2" style={{ padding: '8px 12px', background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)', borderBottom: '1px solid rgba(56,189,248,0.15)', borderLeft: '2px solid #38bdf8' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>RECOMMENDATIONS</span>
        </div>
        <div className="p-2.5 flex flex-col gap-2.5 flex-1 overflow-y-auto custom-scrollbar">
          {recs.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', borderLeft: '3px solid #38bdf8' }}>
              <CheckCircle size={14} color="#38bdf8" className="flex-shrink-0 mt-[2px]" />
              <span style={{ fontSize: 11, color: '#e2e8f0', lineHeight: 1.6, letterSpacing: '0.02em', fontWeight: 500 }}>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskMatrix({ risks }) {
  const grid = []
  for (let c = 5; c >= 1; c--) {
    const row = []
    for (let l = 1; l <= 5; l++) {
      const { bg, text, border } = getRiskColor(l, c)
      const match = risks.find(r => r.likelihood === l && r.consequence === c)
      row.push({ l, c, bg, border, text, match })
    }
    grid.push({ c, cells: row })
  }

  return (
    <div className="flex items-center justify-center p-2 bg-[#070f22] rounded-lg border border-[#1e293b]">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 10, color: '#64748b', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.15em', fontWeight: 800 }}>
          CONSEQUENCE
        </div>
        <div>
          {grid.map(({ c, cells }) => (
            <div key={c} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#64748b', width: 10, textAlign: 'right', marginRight: 4, fontWeight: 800 }}>{c}</span>
              {cells.map(({ l, bg, border, text, match }) => (
                <div
                  key={`${l}-${c}`}
                  className="flex items-center justify-center transition-transform hover:scale-105 cursor-default"
                  style={{ background: bg, border: `1px solid ${border}`, color: text, width: 30, height: 30, borderRadius: 6, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)' }}
                  title={match ? match.name : `L${l}×C${c}`}
                >
                  {match ? (
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#0a1428', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 11, fontWeight: 900, boxShadow: '0 2px 6px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {risks.indexOf(match) + 1}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 4, marginLeft: 18, marginTop: 4 }}>
            {[1, 2, 3, 4, 5].map(l => (
              <div key={l} style={{ width: 30, textAlign: 'center', fontSize: 10, color: '#64748b', fontWeight: 800 }}>{l}</div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginLeft: 18, fontSize: 10, color: '#64748b', marginTop: 6, letterSpacing: '0.15em', fontWeight: 800 }}>
            LIKELIHOOD
          </div>
        </div>
      </div>
    </div>
  )
}

function RiskBadge({ level }) {
  const cfg = {
    High:     { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.3)', label: 'HIGH RISK' },
    Moderate: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)', label: 'MODERATE' },
    Low:      { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'rgba(34,197,94,0.3)', label: 'LOW RISK' },
  }
  const c = cfg[level] || cfg['Low']
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em'
    }}>
      {c.label}
    </span>
  )
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '0.05em', fontWeight: 800 }}>{label}</span>
    </div>
  )
}

function IconBox({ icon: Icon, label, color }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: `${color}15`, border: `1px solid ${color}40`, boxShadow: `0 0 15px ${color}15` }}>
        <Icon size={18} color={color} />
      </div>
      <span style={{ fontSize: 11, color: '#e2e8f0', textAlign: 'center', maxWidth: 65, letterSpacing: '0.05em', fontWeight: 700 }}>{label}</span>
    </div>
  )
}
