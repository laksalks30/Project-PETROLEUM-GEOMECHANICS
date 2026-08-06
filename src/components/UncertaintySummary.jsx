import React from 'react'
import { BarChart2 } from 'lucide-react'

const PARAM_LABELS = {
  Shmin:             'Shmin',
  Breakdown:         'Breakdown Pres.',
  Half_length:       'Half-Length (ft)',
  Surface_pressure:  'Surface Pressure',
  Fluid_efficiency:  'Fluid Efficiency',
  Fracture_height:   'Fracture Height',
}

export default function UncertaintySummary({ uncertainty }) {
  if (!uncertainty) return <div className="card h-full animate-pulse" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}><div className="card-title">LOADING UNCERTAINTY...</div></div>

  const rows = Object.entries(uncertainty).map(([key, val]) => ({
    param: PARAM_LABELS[key] || key,
    P10: val.P10,
    P50: val.P50,
    P90: val.P90,
    unit: val.unit,
  }))

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-uncertainty" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <BarChart2 size={12} color="#38bdf8" />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>UNCERTAINTY SUMMARY (P10/P50/P90)</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#070f22', borderBottom: '1px solid rgba(30,41,59,0.8)', position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              <th style={{ color: '#64748b', fontWeight: 800, padding: '8px 10px', textAlign: 'left', fontSize: 10, letterSpacing: '0.05em' }}>PARAMETER</th>
              <th style={{ color: '#22c55e', fontWeight: 800, padding: '8px 10px', textAlign: 'right', fontSize: 10, letterSpacing: '0.05em' }}>P10</th>
              <th style={{ color: '#38bdf8', fontWeight: 800, padding: '8px 10px', textAlign: 'right', fontSize: 10, letterSpacing: '0.05em' }}>P50</th>
              <th style={{ color: '#ef4444', fontWeight: 800, padding: '8px 10px', textAlign: 'right', fontSize: 10, letterSpacing: '0.05em' }}>P90</th>
              <th style={{ color: '#64748b', fontWeight: 800, padding: '8px 10px', textAlign: 'left', fontSize: 10, letterSpacing: '0.05em' }}>UNIT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ param, P10, P50, P90, unit }) => (
              <tr key={param} className="hover:bg-blue-900/10 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ fontSize: 11, padding: '8px 10px', color: '#e2e8f0', fontWeight: 600 }}>{param.toUpperCase()}</td>
                <td style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, textAlign: 'right', padding: '8px 10px' }}>{formatVal(P10)}</td>
                <td style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, textAlign: 'right', padding: '8px 10px' }}>{formatVal(P50)}</td>
                <td style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, textAlign: 'right', padding: '8px 10px' }}>{formatVal(P90)}</td>
                <td style={{ fontSize: 10, color: '#64748b', fontWeight: 700, padding: '8px 10px' }}>{unit || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatVal(v) {
  if (v === undefined || v === null) return '—'
  if (typeof v === 'number' && v >= 1) return v.toLocaleString(undefined, { maximumFractionDigits: 1 })
  if (typeof v === 'number') return v.toFixed(2)
  return v
}
