import React from 'react'
import { BookOpen } from 'lucide-react'

const GLOSSARY = [
  { term: 'Shmin', def: 'Minimum Horizontal Stress. Tekanan horizontal minimum batuan; harus dilampaui untuk membuka rekahan.' },
  { term: 'SHmax', def: 'Maximum Horizontal Stress. Tekanan horizontal maksimum batuan.' },
  { term: 'Sv', def: 'Vertical Stress (Overburden). Tekanan yang dihasilkan oleh berat batuan di atas formasi.' },
  { term: 'Pp', def: 'Pore Pressure. Tekanan fluida alami yang ada di dalam pori-pori batuan.' },
  { term: 'BHTP', def: 'Bottom Hole Treating Pressure. Total tekanan yang terjadi di dasar sumur selama proses perekahan (fracturing) berlangsung.' },
  { term: 'DFIT', def: 'Diagnostic Fracture Injection Test. Tes injeksi kecil awal untuk mengukur tekanan closure, permeabilitas, dan leakoff batuan.' },
  { term: 'ISIP', def: 'Instantaneous Shut-In Pressure. Tekanan sesaat setelah pompa dimatikan; merepresentasikan tekanan rekahan tanpa gaya gesek pipa.' },
  { term: 'TVD', def: 'True Vertical Depth. Kedalaman vertikal sebenarnya dari permukaan hingga target reservoir.' },
  { term: 'MD', def: 'Measured Depth. Total panjang lubang sumur yang dibor (termasuk belokan/inklinasi).' },
  { term: 'Pnet', def: 'Net Pressure. Selisih antara tekanan fluida di dalam rekahan dan tekanan penutup batuan (Shmin). Penting untuk pembukaan rekahan.' },
  { term: 'E (Static)', def: 'Static Young\'s Modulus. Mengukur kekakuan batuan; seberapa tahan batuan tersebut terhadap deformasi elastis.' },
  { term: 'nu (Poisson Ratio)', def: 'Rasio kompresi; perubahan dimensi lateral batuan saat ditekan.' },
  { term: 'Half-Length (xf)', def: 'Jarak panjang retakan (fracture) dari lubang sumur ke ujung retakan di satu sisi.' },
  { term: 'Proppant', def: 'Pasir atau material butiran padat yang disuntikkan bersama fluida untuk mengganjal rekahan agar tidak menutup kembali.' },
]

export default function Glossary() {
  return (
    <div className="card h-full flex flex-col" style={{ padding: 24 }}>
      <div className="flex items-center gap-3 mb-6 border-b pb-4" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
        <BookOpen size={28} color="#a855f7" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>Glossary / Daftar Istilah</h2>
      </div>
      <div className="flex-1 overflow-auto min-h-0" style={{ paddingRight: 16 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOSSARY.map(({ term, def }) => (
            <div key={term} className="p-4 rounded-lg bg-blue-900/10 border border-blue-500/10">
              <h3 className="font-bold text-blue-400 mb-1" style={{ fontSize: 13 }}>{term}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
