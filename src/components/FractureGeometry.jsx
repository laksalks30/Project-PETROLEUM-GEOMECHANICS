import React from 'react'
import { GitBranch } from 'lucide-react'

export default function FractureGeometry({ geometry }) {
  if (!geometry) return <div className="card h-full animate-pulse" style={{ background: '#0a1428' }}><div className="card-title">LOADING GEOMETRY...</div></div>

  const xf   = geometry.xf_ft || 855
  const hf   = geometry.hf_ft || 98
  const formatNum = (num, decimals = 2) => (num !== undefined && num !== null) ? Number(num).toLocaleString(undefined, { maximumFractionDigits: decimals }) : '—'

  const stats = [
    { label: 'MAX WIDTH',             value: `${formatNum(geometry.wmax_in, 2)} in` },
    { label: 'AVG WIDTH',             value: `${formatNum(geometry.wavg_in, 2)} in` },
    { label: 'PROPPED WIDTH',         value: `${formatNum(geometry.wprop_in, 3)} in` },
    { label: 'FRACTURE CONDUCTIVITY', value: `${formatNum(geometry.fracture_conductivity_md_ft ?? (geometry.Cd ? geometry.Cd * 100 : 197), 0)} md-ft`, highlight: true },
    { label: 'FRACTURE AREA',         value: `${formatNum(geometry.Af_ft2, 0)} ft²` },
    { label: 'DIMENSIONLESS HEIGHT',  value: formatNum(geometry.hf_ft && geometry.xf_ft ? geometry.hf_ft / (2 * geometry.xf_ft) : 0, 3) },
    { label: 'GEOMETRY MODEL',        value: geometry.geometry_model || 'PKN' },
    { label: 'HEIGHT CONTAINMENT',    value: `${formatNum(geometry.height_containment_pct ?? 98, 0)}%`, highlight: true },
  ]

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-fracture-geometry" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <GitBranch size={12} color="#38bdf8" />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>FRACTURE GEOMETRY</span>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginLeft: 4, letterSpacing: '0.05em' }}>(DESIGN)</span>
      </div>

      <div className="flex-1 flex flex-row overflow-hidden">
        {/* SVG Diagram Area */}
        <div className="flex-1 relative" style={{ background: '#1c1712' }}>
          <FractureDiagram xf={xf} hf={hf} total_length={geometry.total_length_ft || (xf * 2)} />
        </div>
        
        {/* Stats Table Area */}
        <div className="w-[175px] flex flex-col justify-center px-3 py-2 border-l" style={{ borderColor: 'rgba(30,41,59,0.8)', background: '#070f22' }}>
          {stats.map((s, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 9, color: s.highlight ? '#38bdf8' : '#64748b', fontWeight: 700, letterSpacing: '0.05em', width: '55%' }}>{s.label}</span>
              <span style={{ fontSize: 11, color: s.highlight ? '#f8fafc' : '#e2e8f0', fontWeight: 800, textAlign: 'right', width: '45%' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FractureDiagram({ xf, hf, total_length }) {
  const W = 400, H = 220
  const cx = W / 2, cy = H / 2
  const fracW = 340
  const fracH = 60
  
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', background: '#1c1712' }}>
      {/* Background rock layers */}
      <rect x="0" y="0" width={W} height={H} fill="#29221b" />
      <path d="M -10 60 Q 200 100 410 50" stroke="#1c150f" strokeWidth="6" fill="none" />
      <path d="M -10 140 Q 200 110 410 150" stroke="#1c150f" strokeWidth="6" fill="none" />
      <rect x="0" y="75" width={W} height="50" fill="#211a14" opacity="0.6" />
      
      <defs>
        <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#111" />
          <stop offset="20%" stopColor="#888" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="80%" stopColor="#888" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        
        <linearGradient id="fracGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#581c87" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* The Fracture (Purple Ellipse) */}
      <ellipse cx={cx} cy={cy} rx={fracW/2} ry={fracH/2} fill="url(#fracGrad)" stroke="#e9d5ff" strokeWidth="1" />
      
      {/* Texture lines across fracture */}
      <line x1={cx - fracW/2} y1={cy} x2={cx + fracW/2} y2={cy} stroke="#f3e8ff" strokeWidth="1.5" opacity="0.6" />
      <line x1={cx - fracW/2.1} y1={cy - 10} x2={cx + fracW/2.1} y2={cy - 10} stroke="#d8b4fe" strokeWidth="1" opacity="0.4" />
      <line x1={cx - fracW/2.1} y1={cy + 10} x2={cx + fracW/2.1} y2={cy + 10} stroke="#d8b4fe" strokeWidth="1" opacity="0.4" />
      
      {/* Wellbore Pipe (Vertical, Metallic) */}
      <rect x={cx - 10} y="0" width={20} height={H} fill="url(#pipeGrad)" stroke="#000" strokeWidth="1" />
      
      {/* Arrows and Labels */}
      <g transform={`translate(${cx - fracW/3}, ${cy - fracH/2 - 25})`}>
        <text x="0" y="-2" fill="#cbd5e1" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle">FRACTURE HEIGHT</text>
        <text x="0" y="12" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">{hf} ft</text>
        <line x1="0" y1="18" x2="0" y2="40" stroke="#f8fafc" strokeWidth="1.5" />
        <polygon points="-3,21 3,21 0,16" fill="#f8fafc" />
        <polygon points="-3,37 3,37 0,42" fill="#f8fafc" />
      </g>

      <g transform={`translate(${cx - fracW/4}, ${cy + fracH/2 + 25})`}>
        <line x1={-fracW/4 + 10} y1="0" x2={fracW/4 - 12} y2="0" stroke="#f8fafc" strokeWidth="1.5" />
        <polygon points={`${-fracW/4 + 13},-3 ${-fracW/4 + 13},3 ${-fracW/4 + 8},0`} fill="#f8fafc" />
        <polygon points={`${fracW/4 - 15},-3 ${fracW/4 - 15},3 ${fracW/4 - 10},0`} fill="#f8fafc" />
        <text x="0" y="-8" fill="#cbd5e1" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle">HALF-LENGTH (xf)</text>
        <text x="0" y="16" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">{xf.toLocaleString()} ft</text>
      </g>

      <g transform={`translate(${cx + fracW/4}, ${cy + fracH/2 + 25})`}>
        <line x1={-fracW/4 + 12} y1="0" x2={fracW/4 - 10} y2="0" stroke="#f8fafc" strokeWidth="1.5" />
        <polygon points={`${-fracW/4 + 15},-3 ${-fracW/4 + 15},3 ${-fracW/4 + 10},0`} fill="#f8fafc" />
        <polygon points={`${fracW/4 - 13},-3 ${fracW/4 - 13},3 ${fracW/4 - 8},0`} fill="#f8fafc" />
        <text x="0" y="-8" fill="#cbd5e1" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle">HALF-LENGTH (xf)</text>
        <text x="0" y="16" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">{xf.toLocaleString()} ft</text>
      </g>

      <line x1={cx - fracW/2} y1={cy + 5} x2={cx - fracW/2} y2={H - 12} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1={cx + fracW/2} y1={cy + 5} x2={cx + fracW/2} y2={H - 12} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />

      <g transform={`translate(${cx}, ${H - 12})`}>
        <line x1={-fracW/2 + 10} y1="0" x2={fracW/2 - 10} y2="0" stroke="#f8fafc" strokeWidth="1.5" />
        <polygon points={`${-fracW/2 + 13},-3 ${-fracW/2 + 13},3 ${-fracW/2 + 8},0`} fill="#f8fafc" />
        <polygon points={`${fracW/2 - 13},-3 ${fracW/2 - 13},3 ${fracW/2 - 8},0`} fill="#f8fafc" />
        <text x="0" y="4" fill="#f8fafc" fontSize="12" textAnchor="middle" fontWeight="bold">
          <tspan fill="#94a3b8" fontSize="10" letterSpacing="0.05em">TOTAL LENGTH </tspan> {total_length?.toLocaleString()} ft
        </text>
      </g>
    </svg>
  )
}

