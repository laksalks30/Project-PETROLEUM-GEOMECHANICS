import React from 'react'
import { Target } from 'lucide-react'

export default function PerforationCluster({ design }) {
  if (!design) return <div className="card h-full animate-pulse"><div className="card-title">Perforation & Cluster</div></div>

  const clusters = design.clusters || 5
  const shotsPerCluster = design.shots_per_cluster || 8

  return (
    <div className="card h-full flex flex-col" id="panel-perforation">
      <div className="card-title flex items-center gap-2">
        <Target size={10} />
        Perforation & Cluster Distribution
      </div>
      <div className="flex-1 p-2 flex flex-col gap-2">
        {/* Visual cluster diagram */}
        <div className="flex justify-center">
          <ClusterDiagram clusters={clusters} shotsPerCluster={shotsPerCluster} />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-1">
          <StatRow label="Clusters"           value={clusters}                        color="#3b82f6" />
          <StatRow label="Shots/Cluster"      value={shotsPerCluster}                 color="#3b82f6" />
          <StatRow label="Total Perforations" value={design.total_perforations || 40} color="#f59e0b" />
          <StatRow label="Phasing"            value={`${design.phasing_deg || 60}°`}  color="#94a3b8" />
          <StatRow label="Perf Diameter"      value={`${design.perf_diameter_in || 0.39} in`} color="#94a3b8" />
          <StatRow label="Rate/Cluster"       value={`${design.flow_per_cluster_bpm} bpm`}   color="#22c55e" />
          <StatRow label="Rate/Perforation"   value={`${design.flow_per_perforation_bpm} bpm`} color="#22c55e" />
          <StatRow label="Total Rate"         value={`${design.avg_pump_rate_bpm} bpm`}  color="#f59e0b" />
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
      {/* Background glow behind wellbore */}
      <defs>
        <filter id="glowPerf">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Wellbore vertical */}
      <line x1={wellX} y1={10} x2={wellX} y2={H - 10} stroke="#111827" strokeWidth="12" strokeLinecap="round" />
      <line x1={wellX - 6} y1={10} x2={wellX - 6} y2={H - 10} stroke="#3b82f6" strokeWidth="0.5" />
      <line x1={wellX + 6} y1={10} x2={wellX + 6} y2={H - 10} stroke="#3b82f6" strokeWidth="0.5" />
      
      {/* Clusters */}
      {Array.from({ length: clusters }).map((_, ci) => {
        const cy = spacing * (ci + 1)
        return (
          <g key={ci}>
            {/* Cluster horizontal glow */}
            <rect x={wellX - 16} y={cy - 2} width={32} height={4} fill="#a855f7" opacity="0.4" rx="2" filter="url(#glowPerf)" />
            
            {/* Perforation dots on the sides */}
            {Array.from({ length: Math.min(4, shotsPerCluster / 2) }).map((_, si) => {
              const dy = (si - 1.5) * 4
              return (
                <g key={si}>
                  <circle cx={wellX - 6} cy={cy + dy} r="1.5" fill="#3b82f6" filter="url(#glowPerf)" />
                  <circle cx={wellX + 6} cy={cy + dy} r="1.5" fill="#3b82f6" filter="url(#glowPerf)" />
                  {/* Perf jets */}
                  <line x1={wellX - 6} y1={cy + dy} x2={wellX - 14} y2={cy + dy} stroke="#3b82f6" strokeWidth="0.5" opacity="0.8" />
                  <line x1={wellX + 6} y1={cy + dy} x2={wellX + 14} y2={cy + dy} stroke="#3b82f6" strokeWidth="0.5" opacity="0.8" />
                </g>
              )
            })}
            <text x={wellX + 22} y={cy + 3} fill="#94a3b8" fontSize="8" fontWeight="600">C{ci + 1}</text>
          </g>
        )
      })}
    </svg>
  )
}

function StatRow({ label, value, color }) {
  return (
    <div className="data-row py-0.5">
      <span style={{ fontSize: 10, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 10, color, fontWeight: 600 }}>{value}</span>
    </div>
  )
}
