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

// 5x5 Risk Matrix color coding (likelihood x consequence)
function getRiskColor(likelihood, consequence) {
  const bg = MATRIX_COLORS[consequence - 1][likelihood - 1];
  return { bg, border: 'rgba(255,255,255,0.1)', text: '#ffffff' };
}

export default function RiskSection({ risk }) {
  if (!risk) return <div className="card h-full animate-pulse"><div className="card-title">Risk Assessment</div></div>

  const risks = risk.risks || []
  const recs  = risk.recommendations || []
  const overallRisk = risk.overall_risk || 'High'

  return (
    <div className="flex gap-2 h-full">
      {/* Risk Matrix */}
      <div className="card flex-shrink-0 flex flex-col" id="panel-risk-matrix" style={{ width: 220 }}>
        <div className="card-title">Risk Matrix</div>
        <div className="p-2 flex flex-col gap-1 flex-1">
          <RiskMatrix risks={risks} />
          <div className="mt-1">
            <div style={{ fontSize: 9, color: '#475569', marginBottom: 4 }}>Risk Level Guide</div>
            <div className="flex gap-2">
              <LegendDot color="#22c55e" label="Low Risk" />
              <LegendDot color="#f59e0b" label="Moderate" />
              <LegendDot color="#ef4444" label="High Risk" />
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted Risks */}
      <div className="card flex-shrink-0 flex flex-col" id="panel-highlighted-risks" style={{ width: 200 }}>
        <div className="card-title">Highlighted Risks</div>
        <div className="p-2 flex flex-col gap-2 flex-1">
          {(risk.highlighted_risks || []).map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{i + 1}.</span>
                <span style={{ fontSize: 10, color: '#e2e8f0' }}>{r.name}</span>
              </div>
              <RiskBadge level={r.level} />
            </div>
          ))}
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="card flex-1 flex flex-col" id="panel-overall-assessment">
        <div className="card-title">Overall Assessment</div>
        <div className="p-3 flex flex-col gap-2 flex-1">
          <div className="rounded-lg p-3 text-center" style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.1))',
            border: '1px solid rgba(239,68,68,0.3)',
          }}>
            <div className="flex justify-center gap-4 mb-2">
              <IconBox icon={AlertOctagon} label="High Height Growth Potential" color="#ef4444" />
              <IconBox icon={AlertTriangle} label="Fault Intersection Risk" color="#f59e0b" />
              <IconBox icon={XCircle} label="Optimize Before Execution" color="#3b82f6" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#ef4444', letterSpacing: '0.02em' }}>
              REQUIRES DESIGN OPTIMIZATION
            </div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 4 }}>
              Overall Risk Level: <span style={{ color: overallRisk === 'High' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>{overallRisk}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card flex-1 flex flex-col" id="panel-recommendations">
        <div className="card-title">Recommendations</div>
        <div className="p-2 flex flex-col gap-1.5 flex-1 overflow-auto">
          {recs.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 p-1.5 rounded" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
              <CheckCircle size={10} color="#22c55e" className="flex-shrink-0 mt-0.5" />
              <span style={{ fontSize: 10, color: '#cbd5e1', lineHeight: 1.4 }}>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskMatrix({ risks }) {
  // Build 5x5 grid
  const grid = []
  for (let c = 5; c >= 1; c--) {
    const row = []
    for (let l = 1; l <= 5; l++) {
      const { bg, border, text } = getRiskColor(l, c)
      // Check if any risk falls here
      const match = risks.find(r => r.likelihood === l && r.consequence === c)
      row.push({ l, c, bg, border, text, match })
    }
    grid.push({ c, cells: row })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <div style={{ fontSize: 8, color: '#475569', writingMode: 'vertical-rl', transform: 'rotate(180deg)', paddingRight: 2 }}>
          Consequence →
        </div>
        <div>
          {grid.map(({ c, cells }) => (
            <div key={c} style={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
              <span style={{ fontSize: 7, color: '#475569', width: 8, textAlign: 'right', marginRight: 1 }}>{c}</span>
              {cells.map(({ l, bg, border, text, match }) => (
                <div
                  key={`${l}-${c}`}
                  className="risk-cell"
                  style={{ background: bg, border: `1px solid ${border}`, color: text, width: 28, height: 28, borderRadius: 2 }}
                  title={match ? match.name : `L${l}×C${c}`}
                >
                  {match ? (
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', background: '#0a1428', 
                      border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 9, fontWeight: 900
                    }}>
                      {risks.indexOf(match) + 1}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 2, marginLeft: 10 }}>
            {[1, 2, 3, 4, 5].map(l => (
              <div key={l} style={{ width: 28, textAlign: 'center', fontSize: 7, color: '#475569' }}>{l}</div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginLeft: 10, fontSize: 8, color: '#475569', marginTop: 1 }}>
            Likelihood →
          </div>
        </div>
      </div>
    </div>
  )
}

function RiskBadge({ level }) {
  const cfg = {
    High:     { class: 'badge-red',    label: 'HIGH' },
    Moderate: { class: 'badge-yellow', label: 'MODERATE' },
    Low:      { class: 'badge-green',  label: 'LOW' },
  }
  const { class: cls, label } = cfg[level] || cfg['Low']
  return <span className={`badge ${cls}`}>{label}</span>
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
      <span style={{ fontSize: 8, color: '#64748b' }}>{label}</span>
    </div>
  )
}

function IconBox({ icon: Icon, label, color }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={14} color={color} />
      </div>
      <span style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center', maxWidth: 60 }}>{label}</span>
    </div>
  )
}
