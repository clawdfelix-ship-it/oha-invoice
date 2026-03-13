// ========================================
// OHA Invoice Generator - Luxury Dark/Gold Theme
// ========================================

'use client'
import { useState, useRef } from 'react'
import { Download, Plus, Trash2, Save, FileText, Users, Package, Printer } from 'lucide-react'

// Company Info
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
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().slice(0,10)
  })
  const [customer, setCustomer] = useState(SAMPLE_CUSTOMERS[0])
  const [items, setItems] = useState([
    { id: 1, jan: '4547691803863', name: 'CLOUDY (6pcs)', qty: 12, price: 17 },
    { id: 2, jan: '4547691806475', name: 'GROOVE (6pcs)', qty: 12, price: 33 },
    { id: 3, jan: '4547691810687', name: 'GROOVE Large (6pcs)', qty: 12, price: 33 },
  ])
  const [activeTab, setActiveTab] = useState('invoice')
  const [payment, setPayment] = useState('COD')

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
  const tax = subtotal * 0.0
  const total = subtotal + tax

  const exportPDF = async () => {
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default
    
    const element = invoiceRef.current
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#1a1a2e' })
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${invoiceNo}.pdf`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      {/* Header */}
      <header className="shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)', borderBottom: '1px solid #d4af37' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' }}>
              <span className="text-xl text-gray-900 font-bold">O</span>
            </div>
            <h1 className="text-xl font-bold" style={{ color: '#d4af37' }}>OHA Invoice System</h1>
          </div>
          <div className="flex gap-2">
            {['invoice', 'customers', 'products'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ 
                  backgroundColor: activeTab === tab ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' : 'transparent',
                  color: activeTab === tab ? '#1a1a2e' : '#d4af37',
                  border: activeTab === tab ? 'none' : '1px solid #d4af37'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'invoice' && (
          <>
            {/* Controls */}
            <div className="rounded-xl p-4 mb-6 shadow-lg" style={{ background: 'rgba(26, 26, 46, 0.9)', border: '1px solid #d4af37' }}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#d4af37' }}>Invoice No.</label>
                  <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: '#0f0f23', border: '1px solid #d4af37', color: '#fff' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#d4af37' }}>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: '#0f0f23', border: '1px solid #d4af37', color: '#fff' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#d4af37' }}>Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: '#0f0f23', border: '1px solid #d4af37', color: '#fff' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#d4af37' }}>Customer</label>
                  <select value={customer.id} onChange={(e) => setCustomer(SAMPLE_CUSTOMERS.find(c => c.id === e.target.value))} className="w-full rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: '#0f0f23', border: '1px solid #d4af37', color: '#fff' }}>
                    {SAMPLE_CUSTOMERS.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#0f0f23' }}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#d4af37' }}>Payment</label>
                  <select value={payment} onChange={(e) => setPayment(e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: '#0f0f23', border: '1px solid #d4af37', color: '#fff' }}>
                    <option style={{ backgroundColor: '#0f0f23' }}>COD</option>
                    <option style={{ backgroundColor: '#0f0f23' }}>Net 30</option>
                    <option style={{ backgroundColor: '#0f0f23' }}>Net 60</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={addItem} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #2dce89 0%, #2dce8f 100%)', color: '#fff' }}>
                  <Plus size={16} /> Add Item
                </button>
                <button onClick={exportPDF} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#1a1a2e' }}>
                  <Download size={16} /> Export PDF
                </button>
                <button onClick={() => window.print()} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ background: 'transparent', border: '1px solid #d4af37', color: '#d4af37' }}>
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>

            {/* Invoice Preview - Luxury Dark/Gold Theme */}
            <div ref={invoiceRef} className="p-8 shadow-2xl" style={{ minHeight: '297mm', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)', border: '2px solid #d4af37' }}>
              {/* Decorative gold line */}
              <div className="h-1 mb-8 rounded" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}></div>

              {/* Top Section */}
              <div className="flex justify-between mb-8">
                {/* Company Info */}
                <div>
                  <h1 className="text-2xl font-bold mb-1" style={{ color: '#d4af37' }}>{COMPANY_INFO.name}</h1>
                  <p className="text-gray-400 text-sm">{COMPANY_INFO.address}</p>
                  <p className="text-gray-400 text-sm">{COMPANY_INFO.tel} | {COMPANY_INFO.email}</p>
                </div>
                {/* Invoice Info */}
                <div className="text-right">
                  <h2 className="text-4xl font-bold mb-2" style={{ color: '#d4af37', textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}>INVOICE</h2>
                  <p className="text-gray-300"><span className="font-medium" style={{ color: '#d4af37' }}>Invoice No:</span> {invoiceNo}</p>
                  <p className="text-gray-300"><span className="font-medium" style={{ color: '#d4af37' }}>Date:</span> {date}</p>
                  <p className="text-gray-300"><span className="font-medium" style={{ color: '#d4af37' }}>Due Date:</span> {dueDate}</p>
                </div>
              </div>

              {/* Bill To / Ship To */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="rounded-lg p-4" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid #d4af37' }}>
                  <h3 className="font-bold text-sm mb-3 uppercase" style={{ color: '#d4af37' }}>Bill To</h3>
                  <p className="font-bold text-white">{customer.name}</p>
                  <p className="text-gray-400 text-sm">{customer.address}</p>
                  <p className="text-gray-400 text-sm">ATTN: {customer.attn} | {customer.tel}</p>
                </div>
                <div className="rounded-lg p-4" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid #d4af37' }}>
                  <h3 className="font-bold text-sm mb-3 uppercase" style={{ color: '#d4af37' }}>Ship To</h3>
                  <p className="font-bold text-white">{customer.name}</p>
                  <p className="text-gray-400 text-sm">{customer.address}</p>
                  <p className="text-gray-400 text-sm">ATTN: {customer.attn} | {customer.tel}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-6">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' }}>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">#</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">JAN Code</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900">Qty</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Unit Price</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Amount</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                      <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                      <td className="py-3 px-4">
                        <input type="text" value={item.jan} onChange={(e) => updateItem(item.id, 'jan', e.target.value)} className="w-full border-0 bg-transparent font-mono text-sm" style={{ color: '#d4af37' }} placeholder="JAN Code" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full border-0 bg-transparent text-white" placeholder="Description" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} className="w-16 border rounded px-2 py-1 text-center text-sm" style={{ backgroundColor: '#0f0f23', borderColor: '#d4af37', color: '#fff' }} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-24 border rounded px-2 py-1 text-right text-sm" style={{ backgroundColor: '#0f0f23', borderColor: '#d4af37', color: '#fff' }} />
                      </td>
                      <td className="py-3 px-4 text-right font-medium" style={{ color: '#d4af37' }}>${(item.qty * item.price).toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <button onClick={() => removeItem(item.id)} className="hover:opacity-70" style={{ color: '#f5365c' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-72">
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="font-medium text-white">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                    <span className="text-gray-400">Tax (0%):</span>
                    <span className="font-medium text-white">${tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 rounded-lg px-4 mt-2" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' }}>
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-gray-900">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bank Info & Notes */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                <div>
                  <h4 className="font-bold mb-3" style={{ color: '#d4af37' }}>Bank Information</h4>
                  <p className="text-gray-400 text-sm"><span className="font-medium" style={{ color: '#d4af37' }}>Bank:</span> {COMPANY_INFO.bank}</p>
                  <p className="text-gray-400 text-sm"><span className="font-medium" style={{ color: '#d4af37' }}>FPS:</span> {COMPANY_INFO.fps}</p>
                  <p className="text-gray-400 text-sm mt-2"><span className="font-medium" style={{ color: '#d4af37' }}>Payment Terms:</span> {payment}</p>
                </div>
                <div>
                  <h4 className="font-bold mb-3" style={{ color: '#d4af37' }}>Notes</h4>
                  <p className="text-gray-500 text-sm">Thank you for your business!</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                <div>
                  <p className="font-medium text-white mb-4">Received By:</p>
                  <p className="text-gray-500 text-sm mb-2">For {customer.name}</p>
                  <p className="border-b mb-1" style={{ borderColor: '#d4af37' }}>_______________________________</p>
                  <p className="text-gray-500 text-xs">Client Signature & Chop</p>
                </div>
                <div>
                  <p className="font-medium text-white mb-4">Issued By:</p>
                  <p className="text-gray-500 text-sm mb-2">For {COMPANY_INFO.name}</p>
                  <p className="border-b mb-1" style={{ borderColor: '#d4af37' }}>_______________________________</p>
                  <p className="text-gray-500 text-xs">Authorized Signature & Chop</p>
                </div>
              </div>

              {/* Decorative gold line */}
              <div className="h-1 mt-8 rounded" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}></div>
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <div className="rounded-xl shadow-lg p-6" style={{ background: 'rgba(26, 26, 46, 0.9)', border: '1px solid #d4af37' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>Customers</h2>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                  <th className="py-3 px-4 text-left text-sm font-semibold" style={{ color: '#d4af37' }}>ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold" style={{ color: '#d4af37' }}>Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold" style={{ color: '#d4af37' }}>Address</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold" style={{ color: '#d4af37' }}>ATTN</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold" style={{ color: '#d4af37' }}>Tel</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_CUSTOMERS.map(c => (
                  <tr key={c.id} className="border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <td className="py-3 px-4 text-sm text-gray-300">{c.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-white">{c.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{c.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{c.attn}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{c.tel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="rounded-xl shadow-lg p-6" style={{ background: 'rgba(26, 26, 46, 0.9)', border: '1px solid #d4af37' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>Products</h2>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                  <th className="py-3 px-4 text-left text-sm font-semibold" style={{ color: '#d4af37' }}>JAN Code</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold" style={{ color: '#d4af37' }}>Product Name</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold" style={{ color: '#d4af37' }}>Unit Price (HK$)</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_PRODUCTS.map(p => (
                  <tr key={p.jan} className="border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <td className="py-3 px-4 text-sm font-mono text-gray-400">{p.jan}</td>
                    <td className="py-3 px-4 text-sm text-white">{p.name}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium" style={{ color: '#d4af37' }}>${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
