import React, { useState, useEffect, useCallback, useRef } from 'react'
import { CheckCircle, RefreshCw, AlertCircle, WifiOff, Upload, X, ChevronRight, Loader2 } from 'lucide-react'
import { fetchDashboard } from './api.js'

import Sidebar             from './components/Sidebar.jsx'
import KPIStrip            from './components/KPIStrip.jsx'
import MEMSummary          from './components/MEMSummary.jsx'
import TargetIntervalSummary from './components/TargetIntervalSummary.jsx'
import BoreholeStability  from './components/BoreholeStability.jsx'
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


// ─── Toast Notification System ────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 380 }}>
      {toasts.map(t => {
        const colors = {
          success: { border: 'rgba(34,197,94,0.4)', left: '#22c55e', text: '#22c55e' },
          error:   { border: 'rgba(239,68,68,0.4)', left: '#ef4444', text: '#ef4444' },
          info:    { border: 'rgba(59,130,246,0.4)', left: '#3b82f6', text: '#60a5fa' },
        }
        const c = colors[t.type] || colors.info
        return (
          <div key={t.id} className="flex items-start gap-3 rounded-lg" style={{
            padding: '10px 14px',
            background: 'rgba(7,15,34,0.98)',
            border: `1px solid ${c.border}`,
            borderLeft: `3px solid ${c.left}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            animation: 'slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)',
            minWidth: 300,
            backdropFilter: 'blur(8px)',
          }}>
            <div className="flex-shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle size={15} color="#22c55e" />}
              {t.type === 'error'   && <AlertCircle size={15} color="#ef4444" />}
              {t.type === 'info'    && <Loader2 size={15} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />}
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 12, fontWeight: 700, color: c.text, letterSpacing: '0.03em' }}>{t.title}</div>
              {t.message && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, lineHeight: 1.5 }}>{t.message}</div>}
            </div>
            <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 2, flexShrink: 0 }}>
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}


// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeMenu, setActiveMenu]   = useState('overview')
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [refreshing, setRefreshing]   = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [lastUpdated, setLastUpdated] = useState('Loading...')
  const [toasts, setToasts]           = useState([])
  const fileInputRef    = useRef(null)
  const toastCounter    = useRef(0)

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((type, title, message, duration = 5000) => {
    const id = ++toastCounter.current
    setToasts(prev => [...prev, { id, type, title, message }])
    if (duration > 0) setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Load / Refresh data ────────────────────────────────────────────────────
  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const result = await fetchDashboard()
      setData(result)
      const now   = new Date()
      const day   = now.getDate().toString().padStart(2, '0')
      const month = now.toLocaleString('en-GB', { month: 'short' })
      const year  = now.getFullYear()
      const time  = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
      setLastUpdated(`${day} ${month} ${year} · ${time}`)
      if (showRefreshing) addToast('success', 'Data Diperbarui', `Sinkronisasi selesai pukul ${time}`, 3000)
    } catch (err) {
      setError(err.message || 'Cannot connect to backend. Make sure Python server is running on port 8000.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [addToast])

  useEffect(() => { loadData() }, [loadData])

  // Auto-refresh setiap 60 detik
  useEffect(() => {
    const interval = setInterval(() => loadData(true), 60_000)
    return () => clearInterval(interval)
  }, [loadData])

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validasi ekstensi
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['json', 'xlsx', 'txt'].includes(ext)) {
      addToast('error', 'Format Tidak Didukung', `File ".${ext}" tidak valid. Gunakan: .json, .xlsx, atau .txt`)
      if (event.target) event.target.value = ''
      return
    }

    setUploading(true)
    const loadingId = addToast('info', 'Memproses File...', `Mengunggah: ${file.name}`, 0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      removeToast(loadingId)

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Server mengembalikan error.' }))
        throw new Error(errData.detail || `HTTP ${response.status}`)
      }

      const result = await response.json()
      addToast('success', 'Upload Berhasil!', result.message || `File "${file.name}" berhasil diproses dan dashboard diperbarui.`)

      // Refresh dashboard dengan data baru
      await loadData(true)

    } catch (err) {
      removeToast(loadingId)
      if (err.message.includes('fetch')) {
        addToast('error', 'Koneksi Gagal', 'Tidak dapat menghubungi backend. Pastikan server Python berjalan di port 8000.')
      } else {
        addToast('error', 'Upload Gagal', err.message)
      }
    } finally {
      setUploading(false)
      if (event.target) event.target.value = ''
    }
  }

  const well   = data?.well
  const status = data?.well?.status || 'Calibrated'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a1428' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        #btn-upload:hover:not(:disabled) { background: rgba(168,85,247,0.18) !important; border-color: rgba(168,85,247,0.6) !important; }
        #btn-refresh:hover:not(:disabled) { background: rgba(59,130,246,0.18) !important; border-color: rgba(59,130,246,0.6) !important; }
      `}</style>

      {/* Toast System */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} well={well} lastUpdated={lastUpdated} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* ─────────────────────────── HEADER ──────────────────────────────── */}
        <header style={{
          padding: '0 16px',
          background: 'linear-gradient(180deg, #050c1a 0%, #0a1428 100%)',
          borderBottom: '1px solid rgba(56,189,248,0.1)',
          flexShrink: 0,
          position: 'relative',
        }}>
          {/* Top shimmer line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.6) 50%, transparent 100%)',
          }} />

          {/* ── Top Row ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between" style={{ minHeight: 50, gap: 12 }}>

            {/* LEFT: Logo + Title + Breadcrumb */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <polygon points="4,18 20,24 20,27 4,27"    fill="#06b6d4" />
                <polygon points="20,24 36,18 36,22 20,27"  fill="#3b82f6" />
                <polygon points="8,29 32,29 20,38"          fill="#0891b2" />
                <polygon points="20,2 34,14 20,24 6,14"    fill="#f8fafc" />
              </svg>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 900, color: '#f8fafc', letterSpacing: '0.06em', lineHeight: 1.1, textTransform: 'uppercase', margin: 0 }}>
                  Hydraulic Fracturing Design Engine
                </h1>
                <div className="flex items-center gap-1.5" style={{ marginTop: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }} />
                  <span style={{ fontSize: 11, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Common Calibrated MEM Database
                  </span>
                  <ChevronRight size={9} color="#1e293b" />
                  <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 800, letterSpacing: '0.03em' }}>
                    Well {well?.name || 'GM-01'}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Badges + Actions */}
            <div className="flex items-center gap-1.5">
              {/* Info Badges */}
              <InfoBadge label="WELL"        value={well?.name        || 'GM-01'}          icon="🏭" accentColor="#334155" />
              <InfoBadge label="FIELD"       value={well?.field       || 'Green Meadow'}   icon="🌍" accentColor="#06b6d4" />
              <InfoBadge label="DATE"        value={well?.date        || '—'}              icon="📅" accentColor="#334155" />
              <InfoBadge label="MEM VERSION" value={well?.mem_version || 'MEM-GM01-V1.1'} icon="⚙️" accentColor="#334155" />

              {/* Divider */}
              <div style={{ width: 1, height: 30, background: 'rgba(30,41,59,1)', margin: '0 6px' }} />

              {/* Calibration Status */}
              <div className="flex items-center gap-2 rounded-lg" style={{
                padding: '5px 11px',
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {status}
                </span>
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 30, background: 'rgba(30,41,59,1)', margin: '0 4px' }} />

              {/* Hidden File Input */}
              <input type="file" accept=".json,.xlsx,.txt" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileUpload} />

              {/* Upload File Button */}
              <button
                id="btn-upload"
                onClick={() => !uploading && fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload file MEM (.json, .xlsx, .txt) untuk memperbarui seluruh data dashboard"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 13px', borderRadius: 7,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  opacity: uploading ? 0.55 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {uploading
                  ? <Loader2 size={12} color="#a855f7" style={{ animation: 'spin 0.8s linear infinite' }} />
                  : <Upload size={12} color="#a855f7" />
                }
                <span style={{ fontSize: 11, color: '#a855f7', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                </span>
              </button>

              {/* Refresh Button */}
              <button
                id="btn-refresh"
                onClick={() => !refreshing && loadData(true)}
                disabled={refreshing}
                title="Sinkronisasi ulang semua data dari server backend"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 13px', borderRadius: 7,
                  cursor: refreshing ? 'not-allowed' : 'pointer',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  opacity: refreshing ? 0.55 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <RefreshCw
                  size={12}
                  color="#3b82f6"
                  style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
                />
                <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
            </div>
          </div>

          {/* ── KPI Strip OR Error Banner ────────────────────────────────────── */}
          {error ? (
            <div className="flex items-center gap-3 mb-2 px-4 py-2.5 rounded-lg" style={{
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderLeft: '3px solid #ef4444',
            }}>
              <WifiOff size={14} color="#ef4444" />
              <div className="flex-1">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', letterSpacing: '0.04em' }}>BACKEND CONNECTION FAILED</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{error}</div>
              </div>
              <button
                onClick={() => loadData()}
                style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, cursor: 'pointer', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 5, padding: '4px 12px', whiteSpace: 'nowrap' }}
              >
                Retry Connection
              </button>
            </div>
          ) : (
            (activeMenu === 'overview' || activeMenu === 'hydraulic-frac') && <KPIStrip data={data} />
          )}
        </header>

        {/* ── Dashboard Body ───────────────────────────────────────────────── */}
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {/* ─── OVERVIEW: Full dashboard (MEM + HF + Risk) ─────────── */}
            {activeMenu === 'overview' && (
              <main style={{ flex: 1, overflow: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Row 0: COMMON CALIBRATED MEM SUMMARY – full width */}
                <div style={{ flexShrink: 0, minHeight: 250 }}>
                  <MEMSummary mem={data?.mem} stressProfile={data?.stress_profile} />
                </div>

                {/* Row 1: Target Interval Summary | DFIT Analysis | Stress Profile */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 6, minHeight: 220, flexShrink: 0 }}>
                  <TargetIntervalSummary mem={data?.mem} />
                  <DFITAnalysis  dfit={data?.dfit} />
                  <StressProfile stressProfile={data?.stress_profile} />
                </div>

                {/* Row 2: Fracture Geometry | Design Summary | Pumping Schedule | Pressure */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr 1fr', gap: 6, minHeight: 230, flexShrink: 0 }}>
                  <FractureGeometry   geometry={data?.fracture_geometry} />
                  <DesignSummary      design={data?.design_summary} />
                  <PumpingSchedule    schedule={data?.pumping_schedule} />
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

                {/* Row 4: Risk Assessment */}
                <div style={{ minHeight: 160, flexShrink: 0 }}>
                  <RiskSection risk={data?.risk} />
                </div>
                
                {/* Row 5: Borehole Stability Engine */}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '2px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', marginBottom: 12, padding: '8px 12px', background: 'rgba(56,189,248,0.1)', borderLeft: '3px solid #38bdf8', letterSpacing: '0.05em' }}>
                    BOREHOLE STABILITY ENGINE (Integrated View)
                  </div>
                  <BoreholeStability bhs={data?.bhs} mem={data?.mem} well={data?.well} stressProfile={data?.stress_profile} isNested={true} />
                </div>
              </main>
            )}

            {/* ─── COMMON MEM: Full-width detail view ─────────────────── */}
            {activeMenu === 'common-mem' && (
              <main style={{ flex: 1, overflow: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 250 }}>
                  <MEMSummary mem={data?.mem} stressProfile={data?.stress_profile} />
                </div>
              </main>
            )}

            {/* ─── HYDRAULIC FRACTURING: Design panels ────────────────── */}
            {activeMenu === 'hydraulic-frac' && (
              <main style={{ flex: 1, overflow: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Row 1: Target Interval Summary | DFIT Analysis | Stress Profile */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 6, minHeight: 220, flexShrink: 0 }}>
                  <TargetIntervalSummary mem={data?.mem} />
                  <DFITAnalysis  dfit={data?.dfit} />
                  <StressProfile stressProfile={data?.stress_profile} />
                </div>

                {/* Row 2: Fracture Geometry | Design Summary | Pumping Schedule | Pressure */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr 1fr', gap: 6, minHeight: 230, flexShrink: 0 }}>
                  <FractureGeometry   geometry={data?.fracture_geometry} />
                  <DesignSummary      design={data?.design_summary} />
                  <PumpingSchedule    schedule={data?.pumping_schedule} />
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

                {/* Row 4: Risk Assessment */}
                <div style={{ minHeight: 160, flexShrink: 0 }}>
                  <RiskSection risk={data?.risk} />
                </div>
              </main>
            )}

            {activeMenu === 'borehole-stability' && (
              <BoreholeStability bhs={data?.bhs} mem={data?.mem} well={data?.well} stressProfile={data?.stress_profile} />
            )}

            {activeMenu === 'data-requirements' && <DataRequirements />}
            {activeMenu === 'engine-workflow'   && <EngineWorkflow />}
            {activeMenu === 'validation'        && <ValidationChecklist />}
            {activeMenu === 'how-to-use'        && <UserGuide />}
            {activeMenu === 'glossary'          && <Glossary />}
          </>
        )}
      </div>
    </div>
  )
}


// ─── InfoBadge ────────────────────────────────────────────────────────────────
function InfoBadge({ icon, label, value, accentColor = '#1e293b' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '5px 10px', borderRadius: 6,
      background: 'rgba(7,15,34,0.8)',
      border: '1px solid rgba(30,41,59,0.9)',
      borderTop: `2px solid ${accentColor}`,
    }}>
      <span style={{ fontSize: 13.5, lineHeight: 1, opacity: 0.85 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 9, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, lineHeight: 1 }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.01em', lineHeight: 1.3, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  )
}


// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(56,189,248,0.12)', borderTopColor: '#38bdf8', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px solid rgba(59,130,246,0.12)', borderTopColor: '#3b82f6', animation: 'spin 1.6s linear infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <polygon points="4,18 20,24 20,27 4,27"   fill="#06b6d4" opacity="0.8" />
            <polygon points="20,24 36,18 36,22 20,27" fill="#3b82f6" opacity="0.8" />
            <polygon points="20,2 34,14 20,24 6,14"   fill="#f8fafc" />
          </svg>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: 13.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Initializing Engine</div>
        <div style={{ color: '#1e293b', fontSize: 11, marginTop: 6, letterSpacing: '0.02em' }}>Connecting to backend server on port 8000…</div>
      </div>
    </div>
  )
}
