import { Head } from '@inertiajs/react';

interface PesananItem {
  id: number;
  nama_produk: string;
  sku_produk: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
}

interface Pesanan {
  id: number;
  nomor_pesanan: string;
  nama_customer: string;
  email_customer: string;
  telepon_customer: string;
  alamat_pengiriman: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  subtotal: number;
  ongkir: number;
  diskon: number;
  total_akhir: number;
  status_pesanan: string;
  status_pembayaran: string;
  metode_pembayaran: string;
  kurir: string;
  layanan_kurir: string;
  tanggal_pesanan: string;
  items: PesananItem[];
}

interface Props {
  pesanan: Pesanan;
}

export default function Invoice({ pesanan }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Head title={`Invoice - ${pesanan.nomor_pesanan}`} />
      
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600 mt-2">Toko Tas Berkah</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">No. Invoice</p>
            <p className="text-xl font-bold">{pesanan.nomor_pesanan}</p>
            <p className="text-sm text-gray-600 mt-2">Tanggal: {pesanan.tanggal_pesanan}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tagihan Kepada:</h3>
            <div className="text-sm">
              <p className="font-medium">{pesanan.nama_customer}</p>
              <p>{pesanan.email_customer}</p>
              <p>{pesanan.telepon_customer}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Alamat Pengiriman:</h3>
            <div className="text-sm">
              <p>{pesanan.alamat_pengiriman}</p>
              <p>{pesanan.kota}, {pesanan.provinsi} {pesanan.kode_pos}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Produk</th>
                <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Harga</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(pesanan.items || []).map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.nama_produk}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.sku_produk}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.jumlah || 0}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    Rp {(item.subtotal || 0).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {(pesanan.subtotal || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir ({pesanan.kurir}):</span>
                <span>Rp {(pesanan.ongkir || 0).toLocaleString('id-ID')}</span>
              </div>
              {(pesanan.diskon || 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon:</span>
                  <span>-Rp {(pesanan.diskon || 0).toLocaleString('id-ID')}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>Rp {(pesanan.total_akhir || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-8 pt-4 border-t">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Metode Pembayaran:</h3>
              <p className="text-sm">{pesanan.metode_pembayaran}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status:</h3>
              <p className="text-sm">
                Pesanan: <span className="font-medium">{pesanan.status_pesanan}</span>
              </p>
              <p className="text-sm">
                Pembayaran: <span className="font-medium">{pesanan.status_pembayaran}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
          <p>Terima kasih atas kepercayaan Anda berbelanja di Toko Tas Berkah</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { print-color-adjust: exact; }
          .no-print { display: none; }
        }
      `}</style>
    </div>
  );
}
