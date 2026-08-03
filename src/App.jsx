import React, { useState, useEffect, useCallback, useRef } from 'react'
import { CheckCircle, RefreshCw, AlertCircle, Wifi, WifiOff, Upload } from 'lucide-react'
import { fetchDashboard } from './api.js'

import Sidebar             from './components/Sidebar.jsx'
import KPIStrip            from './components/KPIStrip.jsx'
import MEMSummary          from './components/MEMSummary.jsx'
import DFITAnalysis        from './components/DFITAnalysis.jsx'
import StressProfile       from './components/StressProfile.jsx'
import FractureGeometry    from './components/FractureGeometry.jsx'
import DesignSummary       from './components/DesignSummary.jsx'
import PumpingSchedule     from './components/PumpingSchedule.jsx'
import PressureComponents  from './components/PressureComponents.jsx'
import PerforationCluster  from './components/PerforationCluster.jsx'
import ContainmentAnalysis from './components/ContainmentAnalysis.jsx'
import FaultInteraction    from './components/FaultInteraction.jsx'
import UncertaintySummary  from './components/UncertaintySummary.jsx'
import SensitivityTornado  from './components/SensitivityTornado.jsx'
import RiskSection         from './components/RiskSection.jsx'
import DataRequirements    from './components/DataRequirements.jsx'
import EngineWorkflow      from './components/EngineWorkflow.jsx'
import ValidationChecklist from './components/ValidationChecklist.jsx'
import UserGuide           from './components/UserGuide.jsx'
import Glossary            from './components/Glossary.jsx'


export default function App() {
  const [activeMenu, setActiveMenu] = useState('hydraulic-frac')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('Loading...')
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || 'Upload failed')
      }
      await loadData(true) // Refresh UI with new data
    } catch (err) {
      setError('Upload failed: ' + err.message)
      setLoading(false)
    } finally {
      if (event.target) event.target.value = '' // reset input
    }
  }

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const result = await fetchDashboard()
      setData(result)
      
      const now = new Date()
      const day = now.getDate().toString().padStart(2, '0')
      const month = now.toLocaleString('en-GB', { month: 'short' })
      const year = now.getFullYear()
      const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
      setLastUpdated(`${day} ${month} ${year} · ${time}`)
    } catch (err) {
      setError(err.message || 'Cannot connect to backend. Make sure Python server is running on port 8000.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => loadData(true), 60_000)
    return () => clearInterval(interval)
  }, [loadData])

  const well = data?.well
  const status = data?.well?.status || 'Calibrated'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a1428' }}>
      {/* Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        well={well}
        lastUpdated={lastUpdated}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header style={{
          padding: '8px 16px',
          borderBottom: '1px solid rgba(59,130,246,0.15)',
          background: '#070f22',
          flexShrink: 0,
        }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Geometric Logo */}
              <div className="w-8 h-8 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left middle Teal */}
                  <polygon points="4,18 20,24 20,27 4,27" fill="#06b6d4" />
                  {/* Right middle Blue */}
                  <polygon points="20,24 36,18 36,22 20,27" fill="#3b82f6" />
                  {/* Bottom Teal */}
                  <polygon points="8,29 32,29 20,38" fill="#0891b2" />
                  {/* Top White */}
                  <polygon points="20,2 34,14 20,24 6,14" fill="#f8fafc" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 900, color: '#e2e8f0', letterSpacing: '0.02em', lineHeight: 1 }}>
                  HYDRAULIC FRACTURING DESIGN ENGINE DASHBOARD
                </h1>
                <div style={{ fontSize: 10, color: '#06b6d4', marginTop: 3 }}>
                  Common Calibrated MEM Database — Well GM-01
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Well info badges */}
              <InfoBadge icon="🏭" label="WELL"        value={well?.name || 'GM-01'} />
              <InfoBadge icon="🌍" label="FIELD"       value={well?.field || 'Green Meadow'} />
              <InfoBadge icon="📅" label="DATE"        value={well?.date || '20 May 2024'} />
              <InfoBadge icon="⚙️" label="MEM VERSION" value={well?.mem_version || 'MEM-GM01-V1.1'} />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <CheckCircle size={11} color="#22c55e" />
                <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>Calibrated</span>
              </div>
              
              {/* Upload Button */}
              <input type="file" accept=".json" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Upload size={11} color="#a855f7" />
                <span style={{ fontSize: 9, color: '#a855f7' }}>Upload JSON</span>
              </button>

              {/* Refresh button */}
              <button
                onClick={() => loadData(true)}
                disabled={refreshing}
                id="btn-refresh"
                style={{
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <RefreshCw size={11} color="#3b82f6" className={refreshing ? 'animate-spin' : ''} />
                <span style={{ fontSize: 9, color: '#3b82f6' }}>Refresh</span>
              </button>
            </div>
          </div>

          {/* Connection status + KPI */}
          {error ? (
            <div className="alert-red flex items-center gap-2" style={{ fontSize: 10 }}>
              <WifiOff size={12} color="#ef4444" />
              <span>{error}</span>
              <button onClick={() => loadData()} style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: 10, cursor: 'pointer', background: 'none', border: 'none' }}>
                Retry
              </button>
            </div>
          ) : (
            <KPIStrip data={data} />
          )}
        </header>

        {/* ── Dashboard Body ──────────────────────────────────────────────── */}
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {activeMenu === 'hydraulic-frac' && (
              <main style={{ flex: 1, overflow: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>

                {/* Row 1: MEM Summary | DFIT | Stress Profile */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 6, minHeight: 220, flexShrink: 0 }}>
                  <MEMSummary    mem={data?.mem} />
                  <DFITAnalysis  dfit={data?.dfit} />
                  <StressProfile stressProfile={data?.stress_profile} />
                </div>

                {/* Row 2: Fracture Geometry | Design Summary | Pumping Schedule | Pressure Components */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr 1fr', gap: 6, minHeight: 230, flexShrink: 0 }}>
                  <FractureGeometry geometry={data?.fracture_geometry} />
                  <DesignSummary   design={data?.design_summary} />
                  <PumpingSchedule schedule={data?.pumping_schedule} />
                  <PressureComponents pressure={data?.pressure} />
                </div>

                {/* Row 3: Perforation | Containment | Fault | Uncertainty | Sensitivity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.1fr 1.3fr', gap: 6, minHeight: 210, flexShrink: 0 }}>
                  <PerforationCluster  design={data?.design_summary} />
                  <ContainmentAnalysis containment={data?.containment} />
                  <FaultInteraction    containment={data?.containment} />
                  <UncertaintySummary  uncertainty={data?.uncertainty} />
                  <SensitivityTornado  sensitivity={data?.sensitivity} />
                </div>

                {/* Row 4: Risk Matrix + Highlighted Risks + Overall Assessment + Recommendations */}
                <div style={{ minHeight: 160, flexShrink: 0 }}>
                  <RiskSection risk={data?.risk} />
                </div>

              </main>
            )}
            
            {activeMenu === 'data-requirements' && <DataRequirements />}
            {activeMenu === 'engine-workflow' && <EngineWorkflow />}
            {activeMenu === 'validation' && <ValidationChecklist />}
            {activeMenu === 'how-to-use' && <UserGuide />}
            {activeMenu === 'glossary' && <Glossary />}
          </>
        )}
      </div>
    </div>
  )
}

function InfoBadge({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)' }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 8, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{value}</div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      <div style={{ color: '#475569', fontSize: 13 }}>Connecting to backend…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
