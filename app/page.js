// ========================================
// OHA Invoice Generator
// A modern invoice system for trading companies
// ========================================

'use client'
import { useState, useRef } from 'react'
import { Download, Plus, Trash2, Save, FileText, Users, Package, History } from 'lucide-react'

// Default company info
const COMPANY_INFO = {
  name: 'HAO YANG HK INTL CO LTD',
  address: 'Unit 37, G/F, Block A, Hang Wai Industrial Centre, Tuen Mun, NT',
  tel: '852-98168789',
  email: 'info@haoyang.com',
  bank: 'HSBC 741-536536-838',
  fps: 'FPS ID 100384072'
}

// Sample customers
const SAMPLE_CUSTOMERS = [
  { id: 'C001', name: 'KOA HK LTD', address: 'ROOM 2602, PROSPERITY CENTRE, 25 CHONG YIP STREET, KWUN TONG, HONG KONG', attn: 'Mina', tel: '55429364' },
  { id: 'C002', name: 'ABC TRADING CO', address: 'FLAT A, 15/F, WORLD TRADE CENTRE, HONG KONG', attn: 'John', tel: '98765432' },
]

// Sample products
const SAMPLE_PRODUCTS = [
  { jan: '4547691803863', name: 'CLOUDY (6pcs)', price: 17 },
  { jan: '4547691806475', name: 'GROOVE (6pcs)', price: 33 },
  { jan: '4547691810687', name: 'GROOVE Large (6pcs)', price: 33 },
  { jan: '4974234020782', name: 'Sagami 009 Super Dots (3pcs)', price: 14 },
  { jan: '4974234020720', name: 'Sagami 009 Dots (10pcs)', price: 47 },
  { jan: '4974234020560', name: 'Value 1000 (12pcs)', price: 15 },
  { jan: '4974234021048', name: 'SQUEEZE!!! (5pcs)', price: 16 },
  { jan: '4974234021055', name: 'SQUEEZE!!! (10pcs)', price: 31 },
]

export default function InvoiceGenerator() {
  const invoiceRef = useRef(null)
  const [invoiceNo, setInvoiceNo] = useState(`HY${new Date().toISOString().slice(0,10).replace(/-/g,'')}-1`)
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [customer, setCustomer] = useState(SAMPLE_CUSTOMERS[0])
  const [items, setItems] = useState([
    { id: 1, jan: '4547691803863', name: 'CLOUDY (6pcs)', qty: 12, price: 17 },
    { id: 2, jan: '4547691806475', name: 'GROOVE (6pcs)', qty: 12, price: 33 },
    { id: 3, jan: '4547691810687', name: 'GROOVE Large (6pcs)', qty: 12, price: 33 },
  ])
  const [activeTab, setActiveTab] = useState('invoice')

  const addItem = () => {
    setItems([...items, { id: Date.now(), jan: '', name: '', qty: 1, price: 0 }])
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0)

  const exportPDF = async () => {
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default
    
    const element = invoiceRef.current
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${invoiceNo}.pdf`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Header */}
      <header className="shadow-2xl" style={{ background: 'linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c9a227 0%, #f4d03f 50%, #c9a227 100%)' }}>
              <span className="text-xl">🧾</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#f4d03f', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>
              OHA <span style={{ color: '#e8e8e8', fontWeight: 300 }}>Invoice System</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('invoice')} 
              className="px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{ 
                background: activeTab === 'invoice' ? 'linear-gradient(135deg, #c9a227 0%, #f4d03f 100%)' : 'transparent',
                color: activeTab === 'invoice' ? '#0d0d0d' : '#a0a0a0',
                border: activeTab === 'invoice' ? 'none' : '1px solid #333'
              }}
            >
              <FileText size={18} /> Invoice
            </button>
            <button 
              onClick={() => setActiveTab('customers')} 
              className="px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{ 
                background: activeTab === 'customers' ? 'linear-gradient(135deg, #c9a227 0%, #f4d03f 100%)' : 'transparent',
                color: activeTab === 'customers' ? '#0d0d0d' : '#a0a0a0',
                border: activeTab === 'customers' ? 'none' : '1px solid #333'
              }}
            >
              <Users size={18} /> Customers
            </button>
            <button 
              onClick={() => setActiveTab('products')} 
              className="px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{ 
                background: activeTab === 'products' ? 'linear-gradient(135deg, #c9a227 0%, #f4d03f 100%)' : 'transparent',
                color: activeTab === 'products' ? '#0d0d0d' : '#a0a0a0',
                border: activeTab === 'products' ? 'none' : '1px solid #333'
              }}
            >
              <Package size={18} /> Products
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'invoice' && (
          <>
            {/* Controls */}
            <div className="rounded-2xl p-6 mb-6 shadow-2xl" style={{ background: 'rgba(26, 26, 46, 0.95)', border: '1px solid rgba(201, 162, 39, 0.3)' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#c9a227' }}>Invoice No.</label>
                  <input 
                    type="text" 
                    value={invoiceNo} 
                    onChange={(e) => setInvoiceNo(e.target.value)} 
                    className="w-full rounded-lg px-4 py-3 transition-all focus:ring-2 focus:ring-yellow-500 outline-none"
                    style={{ background: '#0d0d0d', border: '1px solid #333', color: '#f4d03f', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#c9a227' }}>Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="w-full rounded-lg px-4 py-3 transition-all focus:ring-2 focus:ring-yellow-500 outline-none"
                    style={{ background: '#0d0d0d', border: '1px solid #333', color: '#e8e8e8' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#c9a227' }}>Customer</label>
                  <select 
                    value={customer.id} 
                    onChange={(e) => setCustomer(SAMPLE_CUSTOMERS.find(c => c.id === e.target.value))} 
                    className="w-full rounded-lg px-4 py-3 transition-all focus:ring-2 focus:ring-yellow-500 outline-none"
                    style={{ background: '#0d0d0d', border: '1px solid #333', color: '#e8e8e8' }}
                  >
                    {SAMPLE_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#c9a227' }}>Payment</label>
                  <select 
                    className="w-full rounded-lg px-4 py-3 transition-all focus:ring-2 focus:ring-yellow-500 outline-none"
                    style={{ background: '#0d0d0d', border: '1px solid #333', color: '#e8e8e8' }}
                  >
                    <option>COD</option>
                    <option>Net 30</option>
                    <option>Net 60</option>
                  </select>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button 
                  onClick={addItem} 
                  className="px-5 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg font-medium"
                  style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', color: '#fff' }}
                >
                  <Plus size={18} /> Add Item
                </button>
                <button 
                  onClick={exportPDF} 
                  className="px-5 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg font-medium"
                  style={{ background: 'linear-gradient(135deg, #c9a227 0%, #f4d03f 100%)', color: '#0d0d0d' }}
                >
                  <Download size={18} /> Export PDF
                </button>
                <button 
                  className="px-5 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg font-medium"
                  style={{ background: 'linear-gradient(135deg, #34495e 0%, #4a5568 100%)', color: '#fff' }}
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </div>

            {/* Invoice Preview */}
            <div ref={invoiceRef} className="rounded-xl p-10 shadow-2xl" style={{ minHeight: '297mm', background: '#fff' }}>
              {/* Company Header */}
              <div className="pb-6 mb-8" style={{ borderBottom: '3px solid #0d0d0d' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold tracking-wide" style={{ 
                      color: '#0d0d0d', 
                      fontFamily: 'Georgia, serif',
                      letterSpacing: '2px'
                    }}>
                      {COMPANY_INFO.name}
                    </h1>
                    <p className="mt-3 text-base" style={{ color: '#4a4a4a', fontFamily: 'Georgia, serif' }}>{COMPANY_INFO.address}</p>
                    <p className="text-base" style={{ color: '#4a4a4a', fontFamily: 'Georgia, serif' }}>
                      TEL: {COMPANY_INFO.tel} | Email: {COMPANY_INFO.email}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)' }}>
                    <span className="text-2xl">🧾</span>
                  </div>
                </div>
              </div>

              {/* Invoice Title */}
              <div className="text-center mb-10">
                <h2 className="text-5xl font-bold tracking-widest uppercase" style={{ 
                  color: '#0d0d0d', 
                  fontFamily: 'Georgia, serif',
                  textShadow: '2px 2px 0 rgba(201, 162, 39, 0.3)'
                }}>
                  Invoice
                </h2>
                <div className="w-32 mx-auto mt-3" style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }}></div>
              </div>

              {/* Invoice Info & Customer */}
              <div className="grid grid-cols-2 gap-10 mb-10">
                <div className="p-5 rounded-lg" style={{ background: 'linear-gradient(135deg, #f8f8f8 0%, #fff 100%)', border: '1px solid #e0e0e0' }}>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: '#c9a227' }}>Bill To</h3>
                  <p className="font-bold text-lg" style={{ color: '#0d0d0d', fontFamily: 'Georgia, serif' }}>{customer.name}</p>
                  <p className="mt-2 text-sm" style={{ color: '#4a4a4a', lineHeight: '1.6' }}>{customer.address}</p>
                  <p className="mt-2 text-sm" style={{ color: '#4a4a4a' }}>
                    <span style={{ color: '#0d0d0d', fontWeight: 600 }}>ATTN:</span> {customer.attn} | <span style={{ color: '#0d0d0d', fontWeight: 600 }}>TEL:</span> {customer.tel}
                  </p>
                </div>
                <div className="p-5 rounded-lg text-right" style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)' }}>
                  <div className="mb-3">
                    <span className="text-sm uppercase tracking-wider" style={{ color: '#888' }}>Invoice No.</span>
                    <p className="font-mono text-lg font-bold" style={{ color: '#f4d03f' }}>{invoiceNo}</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-sm uppercase tracking-wider" style={{ color: '#888' }}>Date</span>
                    <p className="font-medium" style={{ color: '#e8e8e8' }}>{date}</p>
                  </div>
                  <div>
                    <span className="text-sm uppercase tracking-wider" style={{ color: '#888' }}>Payment</span>
                    <p className="font-medium" style={{ color: '#e8e8e8' }}>COD</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 100%)' }}>
                    <th className="py-4 px-4 text-center text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227', width: '50px' }}>#</th>
                    <th className="py-4 px-4 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>JAN Code</th>
                    <th className="py-4 px-4 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>Description</th>
                    <th className="py-4 px-4 text-center text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227', width: '80px' }}>Qty</th>
                    <th className="py-4 px-4 text-right text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227', width: '140px' }}>Unit Price (HK$)</th>
                    <th className="py-4 px-4 text-right text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227', width: '140px' }}>Amount (HK$)</th>
                    <th className="py-4 px-4" style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} style={{ background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td className="py-4 px-4 text-center font-medium" style={{ color: '#4a4a4a' }}>{index + 1}</td>
                      <td className="py-4 px-4">
                        <input 
                          type="text" 
                          value={item.jan} 
                          onChange={(e) => updateItem(item.id, 'jan', e.target.value)} 
                          className="w-full border-0 bg-transparent font-mono text-sm"
                          style={{ color: '#4a4a4a' }}
                          placeholder="JAN Code" 
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
                          className="w-full border-0 bg-transparent"
                          style={{ color: '#0d0d0d' }}
                          placeholder="Description" 
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} 
                          className="w-full border rounded px-3 py-2 text-center font-medium"
                          style={{ borderColor: '#ddd', color: '#0d0d0d' }}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input 
                          type="number" 
                          value={item.price} 
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} 
                          className="w-full border rounded px-3 py-2 text-right font-mono"
                          style={{ borderColor: '#ddd', color: '#0d0d0d' }}
                        />
                      </td>
                      <td className="py-4 px-4 text-right font-bold font-mono" style={{ color: '#0d0d0d' }}>{(item.qty * item.price).toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="p-2 rounded-lg transition-colors hover:bg-red-100"
                          style={{ color: '#c0392b' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="flex justify-end mb-10">
                <div className="w-72">
                  <div className="py-5 px-6 flex justify-between items-center" style={{ 
                    background: 'linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 100%)',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    <span className="font-bold text-lg uppercase tracking-wider" style={{ color: '#e8e8e8' }}>Total</span>
                    <span className="font-bold text-xl font-mono" style={{ color: '#f4d03f' }}>HK$ {subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 grid grid-cols-2 gap-10" style={{ borderTop: '2px solid #0d0d0d' }}>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: '#0d0d0d' }}>Freight: <span style={{ color: '#c9a227' }}>Collect</span></p>
                  <p className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: '#0d0d0d' }}>Country of Origin: <span style={{ color: '#c9a227' }}>JAPAN & CHINA</span></p>
                  <p className="font-bold text-sm uppercase tracking-wider" style={{ color: '#0d0d0d' }}>Payment: <span style={{ color: '#c9a227' }}>COD</span></p>
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: '#c9a227' }}>Bank Info</p>
                  <p className="font-mono text-sm" style={{ color: '#4a4a4a' }}>{COMPANY_INFO.bank}</p>
                  <p className="font-mono text-sm" style={{ color: '#4a4a4a' }}>{COMPANY_INFO.fps}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-12 grid grid-cols-2 gap-12">
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#0d0d0d' }}>Received By</p>
                  <p className="italic mb-2" style={{ color: '#4a4a4a' }}>For {customer.name}</p>
                  <p className="mb-1" style={{ borderBottom: '2px solid #0d0d0d' }}></p>
                  <p className="text-xs mt-2" style={{ color: '#888' }}>Client Signature & Company Chop</p>
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#0d0d0d' }}>Issued By</p>
                  <p className="italic mb-2" style={{ color: '#4a4a4a' }}>For {COMPANY_INFO.name}</p>
                  <p className="mb-1" style={{ borderBottom: '2px solid #0d0d0d' }}></p>
                  <p className="text-xs mt-2" style={{ color: '#888' }}>Authorized Signature & Company Chop</p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-3">
                  <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #c9a227)' }}></div>
                  <span className="text-sm italic" style={{ color: '#888', fontFamily: 'Georgia, serif' }}>Thank you for your business</span>
                  <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #c9a227, transparent)' }}></div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <div className="rounded-2xl shadow-2xl p-6" style={{ background: 'rgba(26, 26, 46, 0.95)', border: '1px solid rgba(201, 162, 39, 0.3)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#f4d03f', fontFamily: 'Georgia, serif' }}>Customers</h2>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 100%)' }}>
                  <th className="py-4 px-5 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>ID</th>
                  <th className="py-4 px-5 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>Name</th>
                  <th className="py-4 px-5 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>Address</th>
                  <th className="py-4 px-5 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>ATTN</th>
                  <th className="py-4 px-5 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>Tel</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_CUSTOMERS.map((c, idx) => (
                  <tr key={c.id} style={{ background: idx % 2 === 0 ? 'rgba(13, 13, 13, 0.5)' : 'rgba(26, 26, 46, 0.5)' }}>
                    <td className="py-4 px-5 font-mono" style={{ color: '#f4d03f' }}>{c.id}</td>
                    <td className="py-4 px-5 font-bold" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>{c.name}</td>
                    <td className="py-4 px-5" style={{ color: '#a0a0a0' }}>{c.address}</td>
                    <td className="py-4 px-5" style={{ color: '#a0a0a0' }}>{c.attn}</td>
                    <td className="py-4 px-5" style={{ color: '#a0a0a0' }}>{c.tel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="rounded-2xl shadow-2xl p-6" style={{ background: 'rgba(26, 26, 46, 0.95)', border: '1px solid rgba(201, 162, 39, 0.3)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#f4d03f', fontFamily: 'Georgia, serif' }}>Products</h2>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 100%)' }}>
                  <th className="py-4 px-5 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>JAN Code</th>
                  <th className="py-4 px-5 text-left text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>Product Name</th>
                  <th className="py-4 px-5 text-right text-sm font-medium uppercase tracking-wider" style={{ color: '#c9a227' }}>Unit Price (HK$)</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_PRODUCTS.map((p, idx) => (
                  <tr key={p.jan} style={{ background: idx % 2 === 0 ? 'rgba(13, 13, 13, 0.5)' : 'rgba(26, 26, 46, 0.5)' }}>
                    <td className="py-4 px-5 font-mono" style={{ color: '#f4d03f' }}>{p.jan}</td>
                    <td className="py-4 px-5" style={{ color: '#e8e8e8' }}>{p.name}</td>
                    <td className="py-4 px-5 text-right font-mono font-bold" style={{ color: '#2ecc71' }}>${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        
        input::placeholder {
          color: #666;
        }
        
        option {
          background: #0d0d0d;
          color: #e8e8e8;
        }
      `}</style>
    </div>
  )
}
