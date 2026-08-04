import React from 'react'
import { Target } from 'lucide-react'

export default function PerforationCluster({ design }) {
  if (!design) return <div className="card h-full animate-pulse" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}><div className="card-title">LOADING...</div></div>

  const clusters = design.clusters || 5
  const shotsPerCluster = design.shots_per_cluster || 8

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-perforation" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <Target size={12} color="#38bdf8" />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>PERFORATION & CLUSTER DISTRIBUTION</span>
      </div>

      <div className="flex-1 p-2 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar">
        {/* Visual cluster diagram */}
        <div className="flex justify-center py-2.5 rounded-lg border" style={{ background: '#070f22', borderColor: 'rgba(30,41,59,0.8)' }}>
          <ClusterDiagram clusters={clusters} shotsPerCluster={shotsPerCluster} />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          <StatRow label="CLUSTERS"           value={clusters}                        color="#38bdf8" />
          <StatRow label="SHOTS/CLUSTER"      value={shotsPerCluster}                 color="#38bdf8" />
          <StatRow label="TOTAL PERFS"        value={design.total_perforations || 40} color="#f59e0b" highlight />
          <StatRow label="PHASING"            value={`${design.phasing_deg || 60}°`}  color="#94a3b8" />
          <StatRow label="PERF DIAMETER"      value={`${design.perf_diameter_in || 0.39} in`} color="#94a3b8" />
          <StatRow label="RATE/CLUSTER"       value={`${design.flow_per_cluster_bpm} bpm`}   color="#22c55e" />
          <StatRow label="RATE/PERFORATION"   value={`${design.flow_per_perforation_bpm} bpm`} color="#22c55e" />
          <StatRow label="TOTAL RATE"         value={`${design.avg_pump_rate_bpm} bpm`}  color="#f59e0b" />
        </div>
      </div>
    </div>
  )
}

function ClusterDiagram({ clusters, shotsPerCluster }) {
  const W = 100, H = 150
  const wellX = W / 2
  const spacing = H / (clusters + 1)

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <filter id="glowPerf">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Wellbore casing */}
      <line x1={wellX} y1={5} x2={wellX} y2={H - 5} stroke="#0f172a" strokeWidth="16" strokeLinecap="round" />
      <line x1={wellX - 8} y1={5} x2={wellX - 8} y2={H - 5} stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
      <line x1={wellX + 8} y1={5} x2={wellX + 8} y2={H - 5} stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
      
      {/* Clusters */}
      {Array.from({ length: clusters }).map((_, ci) => {
        const cy = spacing * (ci + 1)
        return (
          <g key={ci}>
            {/* Cluster horizontal glow */}
            <rect x={wellX - 18} y={cy - 2} width={36} height={4} fill="#c084fc" opacity="0.4" rx="2" filter="url(#glowPerf)" />
            
            {/* Perforation dots on the sides */}
            {Array.from({ length: Math.min(4, shotsPerCluster / 2) }).map((_, si) => {
              const dy = (si - 1.5) * 4
              return (
                <g key={si}>
                  <circle cx={wellX - 8} cy={cy + dy} r="1.5" fill="#38bdf8" filter="url(#glowPerf)" />
                  <circle cx={wellX + 8} cy={cy + dy} r="1.5" fill="#38bdf8" filter="url(#glowPerf)" />
                  {/* Perf jets */}
                  <line x1={wellX - 8} y1={cy + dy} x2={wellX - 16} y2={cy + dy} stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
                  <line x1={wellX + 8} y1={cy + dy} x2={wellX + 16} y2={cy + dy} stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
                </g>
              )
            })}
            <text x={wellX + 24} y={cy + 3} fill="#64748b" fontSize="8" fontWeight="800" letterSpacing="0.05em">C{ci + 1}</text>
          </g>
        )
      })}
    </svg>
  )
}

function StatRow({ label, value, color, highlight }) {
  return (
    <div className="flex flex-col justify-center p-2 rounded-md" style={{ 
      background: highlight ? `${color}10` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${highlight ? color + '40' : 'rgba(255,255,255,0.03)'}`,
      borderLeft: highlight ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.03)'
    }}>
      <span style={{ fontSize: 8, color: highlight ? color : '#64748b', fontWeight: 800, letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 12, color: highlight ? color : '#f8fafc', fontWeight: 800, letterSpacing: '0.02em', marginTop: 2 }}>{value}</span>
    </div>
  )
}
