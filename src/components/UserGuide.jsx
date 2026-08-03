import React from 'react'
import { HelpCircle } from 'lucide-react'

export default function UserGuide() {
  return (
    <div className="card h-full flex flex-col" style={{ padding: 24 }}>
      <div className="flex items-center gap-3 mb-6 border-b pb-4" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
        <HelpCircle size={28} color="#3b82f6" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>How to Use This Dashboard</h2>
      </div>
      <div className="flex-1 overflow-auto min-h-0 text-gray-300 text-sm" style={{ paddingRight: 16 }}>
        <div className="space-y-6">
          <p>
            Dashboard ini mengikuti 8 langkah alur kerja utama untuk desain <strong>Hydraulic Fracturing</strong>.
            Ikuti panduan berikut untuk memahami setiap bagian aplikasi:
          </p>

          <Step
            num={1}
            title="Langkah 1 — Load MEM"
            desc="Dashboard membaca snapshot Common Calibrated MEM (data pore pressure, stress, mechanical properties) sebagai baseline. Di aplikasi ini, datanya sudah dimuat (well GM-01) sebagai contoh kalkulasi dasar."
          />
          <Step
            num={2}
            title="Langkah 2 — Lihat Target/Barrier Layer"
            desc="Panel 'Common MEM / Target Interval Summary' menampilkan properti batuan reservoir tempat fluida akan diinjeksikan, serta lapisan penahan (barrier) di atas dan di bawahnya."
          />
          <Step
            num={3}
            title="Langkah 3 — Analisa DFIT"
            desc="Panel 'DFIT Analysis' menunjukkan hasil kalibrasi tes tekanan mini-frac (breakdown, ISIP, closure pressure). Nilai closure inilah yang dipakai untuk memperbarui Shmin."
          />
          <Step
            num={4}
            title="Langkah 4 — Atur Completion & Fluid Design"
            desc="Panel 'Design Summary' dan 'Pumping Schedule' berisi parameter input (seperti durasi pompa, laju fluida, volume, dan konsentrasi proppant). Field dengan ikon pensil ✎ menandakan parameter yang secara logis diinput/diubah oleh user."
          />
          <Step
            num={5}
            title="Langkah 5 — Lihat Prediksi Geometry"
            desc="Panel 'Fracture Geometry' menampilkan hasil kalkulasi otomatis dimensi retakan (half-length, width, height) yang terbentuk akibat injeksi dari langkah 4."
          />
          <Step
            num={6}
            title="Langkah 6 — Cek Risk Assessment"
            desc="Amati panel 'Containment Analysis' dan 'Fault Interaction'. Perhatikan lencana warna peringatan (hijau=aman, kuning=waspada, merah=risiko tinggi). Matriks risiko di bawah akan merangkum semua bahaya."
          />
          <Step
            num={7}
            title="Langkah 7 — Optimasi"
            desc="Jika indikator menunjukkan 'High Risk' atau 'REQUIRES DESIGN OPTIMIZATION', engineer disarankan menyesuaikan kembali parameter desain (rate, volume, spacing) di file input untuk menurunkan tekanan."
          />
          <Step
            num={8}
            title="Langkah 8 — Review & Export"
            desc="Cek panel 'Recommendations' untuk melihat saran tindakan selanjutnya. Pastikan semua Checklist Validation sudah hijau sebelum desain disahkan."
          />
        </div>
      </div>
    </div>
  )
}

function Step({ num, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
        {num}
      </div>
      <div>
        <h3 className="font-bold text-gray-100 mb-1" style={{ fontSize: 14 }}>{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
