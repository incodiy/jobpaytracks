
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Users, 
  Calculator, 
  BarChart3, 
  Shield, 
  Smartphone,
  Code,
  Database,
  FileText,
  Settings,
  Zap
} from "lucide-react";

const Documentation = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Work Pay Tracker Pro</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Sistem Pencatatan & Perhitungan Remunerasi Pegawai yang komprehensif untuk mengelola 
          waktu kerja, menghitung gaji, dan menganalisis produktivitas tim Anda.
        </p>
        <div className="flex justify-center space-x-2 mt-4">
          <Badge variant="secondary">Version 1.0.0</Badge>
          <Badge variant="secondary">React + TypeScript</Badge>
          <Badge variant="secondary">Responsive Design</Badge>
        </div>
      </div>

      {/* Fitur Utama */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Fitur Utama</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Pencatatan Waktu Kerja</h3>
              </div>
              <p className="text-sm text-gray-600">
                Record waktu kerja pegawai dengan detail tugas, tanggal, jam kerja, dan tarif per jam.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Manajemen Pegawai</h3>
              </div>
              <p className="text-sm text-gray-600">
                Kelola data pegawai lengkap dengan informasi kontak, departemen, posisi, dan tarif.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Laporan & Analitik</h3>
              </div>
              <p className="text-sm text-gray-600">
                Dashboard analitik dengan grafik tren, statistik departemen, dan performa pegawai.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold">Export Data</h3>
              </div>
              <p className="text-sm text-gray-600">
                Export laporan ke format CSV, Excel, atau PDF untuk keperluan administrasi.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Responsive Design</h3>
              </div>
              <p className="text-sm text-gray-600">
                Interface yang responsif dan dapat diakses dengan baik di desktop, tablet, dan mobile.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold">Validasi Data</h3>
              </div>
              <p className="text-sm text-gray-600">
                Sistem validasi yang ketat untuk memastikan integritas dan akurasi data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panduan Penggunaan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span>Panduan Penggunaan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">1</span>
              <span>Mengelola Data Pegawai</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 ml-8">
              <li>• Klik tab "Pegawai" untuk mengakses manajemen pegawai</li>
              <li>• Gunakan form "Tambah Pegawai Baru" untuk menambah pegawai</li>
              <li>• Isi data lengkap: nama, email, telepon, departemen, posisi, dan tarif per jam</li>
              <li>• Gunakan fitur pencarian dan filter untuk menemukan pegawai tertentu</li>
              <li>• Klik tombol edit (✏️) untuk mengubah data pegawai</li>
              <li>• Klik tombol hapus (🗑️) untuk menghapus data pegawai</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">2</span>
              <span>Mencatat Waktu Kerja</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 ml-8">
              <li>• Klik tab "Record Kerja" untuk mengakses pencatatan waktu</li>
              <li>• Gunakan form di sisi kiri untuk menambah record baru</li>
              <li>• Isi nama pegawai, deskripsi tugas, tanggal, jam kerja, dan tarif</li>
              <li>• Tambahkan biaya tambahan jika diperlukan (lembur, transport, dll)</li>
              <li>• Sistem akan otomatis menghitung total remunerasi</li>
              <li>• Record akan muncul di daftar di sisi kanan setelah disimpan</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm">3</span>
              <span>Melihat Laporan & Analitik</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 ml-8">
              <li>• Dashboard menampilkan ringkasan statistik keseluruhan</li>
              <li>• Tab "Laporan" menyediakan analisis mendalam dengan grafik</li>
              <li>• Lihat tren pendapatan bulanan dalam grafik garis</li>
              <li>• Analisis distribusi pendapatan per departemen</li>
              <li>• Daftar top 5 pegawai berdasarkan pendapatan</li>
              <li>• Statistik detail per departemen dalam bentuk tabel</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm">4</span>
              <span>Export & Backup Data</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 ml-8">
              <li>• Gunakan tombol "Export CSV" untuk mendapat data dalam format spreadsheet</li>
              <li>• Pilih "Export Excel" untuk format yang kompatibel dengan Microsoft Excel</li>
              <li>• Gunakan "Export PDF" untuk laporan siap cetak</li>
              <li>• Data export mencakup semua record dengan perhitungan lengkap</li>
              <li>• Lakukan backup data secara berkala untuk keamanan</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Spesifikasi Teknis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-gray-600" />
            <span>Spesifikasi Teknis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Frontend Technology</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• React 18.3.1 dengan TypeScript</li>
                <li>• Vite untuk build tools</li>
                <li>• Tailwind CSS untuk styling</li>
                <li>• Shadcn/ui untuk komponen UI</li>
                <li>• Lucide React untuk icons</li>
                <li>• Recharts untuk visualisasi data</li>
                <li>• Date-fns untuk manipulasi tanggal</li>
                <li>• React Hook Form untuk form handling</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Features & Capabilities</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Responsive design untuk semua device</li>
                <li>• Real-time calculation sistem remunerasi</li>
                <li>• Data validation dan error handling</li>
                <li>• Interactive charts dan graphs</li>
                <li>• Search dan filter functionality</li>
                <li>• Export data ke multiple format</li>
                <li>• Modern UI/UX design</li>
                <li>• Performance optimized</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formula Perhitungan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Formula Perhitungan Remunerasi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Rumus Dasar:</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Total Remunerasi = (Jam Kerja × Tarif per Jam) + Biaya Tambahan</strong>
              </div>
            </div>
            
            <h3 className="font-semibold mt-6 mb-4">Contoh Perhitungan:</h3>
            <div className="space-y-2 text-sm">
              <p>• Jam Kerja: 8 jam</p>
              <p>• Tarif per Jam: Rp 150.000</p>
              <p>• Biaya Tambahan: Rp 50.000 (transport + makan)</p>
              <p className="font-semibold text-green-600">• Total: (8 × 150.000) + 50.000 = Rp 1.250.000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <span>Support & Pengembangan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Fitur yang Direncanakan</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Integrasi dengan sistem payroll</li>
                <li>• Notifikasi email otomatis</li>
                <li>• Multi-tenancy untuk berbagai perusahaan</li>
                <li>• API untuk integrasi eksternal</li>
                <li>• Mobile app native</li>
                <li>• Approval workflow untuk overtime</li>
                <li>• Advanced reporting dengan pivot tables</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Dukungan Teknis</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Aplikasi ini dibangun dengan teknologi modern dan best practices untuk memastikan:</p>
                <ul className="space-y-1">
                  <li>• Performa optimal</li>
                  <li>• Keamanan data</li>
                  <li>• Skalabilitas sistem</li>
                  <li>• Maintenance yang mudah</li>
                </ul>
                <p className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  💡 <strong>Tips:</strong> Untuk penggunaan optimal, pastikan browser Anda up-to-date dan gunakan Chrome, Firefox, atau Safari versi terbaru.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;
