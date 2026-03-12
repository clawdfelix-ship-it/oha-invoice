// ========================================
// OHA Invoice Generator - ThemeSelection Style
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
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${invoiceNo}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl text-white font-bold">O</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">OHA Invoice System</h1>
          </div>
          <div className="flex gap-2">
            {['invoice', 'customers', 'products'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
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
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Invoice No.</label>
                  <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Customer</label>
                  <select value={customer.id} onChange={(e) => setCustomer(SAMPLE_CUSTOMERS.find(c => c.id === e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    {SAMPLE_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Payment</label>
                  <select value={payment} onChange={(e) => setPayment(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option>COD</option>
                    <option>Net 30</option>
                    <option>Net 60</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={addItem} className="px-4 py-2 bg-success text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90">
                  <Plus size={16} /> Add Item
                </button>
                <button onClick={exportPDF} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90">
                  <Download size={16} /> Export PDF
                </button>
                <button onClick={() => window.print()} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90">
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>

            {/* Invoice Preview - ThemeSelection Style */}
            <div ref={invoiceRef} className="bg-white p-8 shadow-lg" style={{ minHeight: '297mm' }}>
              {/* Top Section */}
              <div className="flex justify-between mb-8">
                {/* Company Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">{COMPANY_INFO.name}</h1>
                  <p className="text-gray-500 text-sm">{COMPANY_INFO.address}</p>
                  <p className="text-gray-500 text-sm">{COMPANY_INFO.tel} | {COMPANY_INFO.email}</p>
                </div>
                {/* Invoice Info */}
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-primary mb-2">INVOICE</h2>
                  <p className="text-gray-600"><span className="font-medium">Invoice No:</span> {invoiceNo}</p>
                  <p className="text-gray-600"><span className="font-medium">Date:</span> {date}</p>
                  <p className="text-gray-600"><span className="font-medium">Due Date:</span> {dueDate}</p>
                </div>
              </div>

              {/* Bill To / Invoice To */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-light rounded-lg p-4">
                  <h3 className="font-bold text-primary text-sm mb-3 uppercase">Bill To</h3>
                  <p className="font-bold text-gray-800">{customer.name}</p>
                  <p className="text-gray-600 text-sm">{customer.address}</p>
                  <p className="text-gray-600 text-sm">ATTN: {customer.attn} | {customer.tel}</p>
                </div>
                <div className="bg-light rounded-lg p-4">
                  <h3 className="font-bold text-primary text-sm mb-3 uppercase">Ship To</h3>
                  <p className="font-bold text-gray-800">{customer.name}</p>
                  <p className="text-gray-600 text-sm">{customer.address}</p>
                  <p className="text-gray-600 text-sm">ATTN: {customer.attn} | {customer.tel}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-6">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="py-3 px-4 text-left text-sm font-semibold">#</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">JAN Code</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Description</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">Qty</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold">Unit Price</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold">Amount</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4">
                        <input type="text" value={item.jan} onChange={(e) => updateItem(item.id, 'jan', e.target.value)} className="w-full border-0 bg-transparent text-gray-800 font-mono text-sm" placeholder="JAN Code" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full border-0 bg-transparent text-gray-800" placeholder="Description" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} className="w-16 border border-gray-200 rounded px-2 py-1 text-center text-sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-24 border border-gray-200 rounded px-2 py-1 text-right text-sm" />
                      </td>
                      <td className="py-3 px-4 text-right font-medium">${(item.qty * item.price).toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <button onClick={() => removeItem(item.id)} className="text-danger hover:opacity-70">
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
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tax (0%):</span>
                    <span className="font-medium">${tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-primary text-white rounded-lg px-4 mt-2">
                    <span className font-semibold">Total:</span>
                    <span className="font-bold text-lg">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bank Info & Notes */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
                <div>
                  <h4 className="font-bold text-primary mb-3">Bank Information</h4>
                  <p className="text-gray-600 text-sm"><span className="font-medium">Bank:</span> {COMPANY_INFO.bank}</p>
                  <p className="text-gray-600 text-sm"><span className="font-medium">FPS:</span> {COMPANY_INFO.fps}</p>
                  <p className="text-gray-600 text-sm mt-2"><span className="font-medium">Payment Terms:</span> {payment}</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-3">Notes</h4>
                  <p className="text-gray-500 text-sm">Thank you for your business!</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-12 mt-12 pt-8">
                <div>
                  <p className="font-medium text-gray-700 mb-4">Received By:</p>
                  <p className="text-gray-500 text-sm mb-2">For {customer.name}</p>
                  <p className="border-b border-gray-300 mb-1">_______________________________</p>
                  <p className="text-gray-400 text-xs">Client Signature & Chop</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-4">Issued By:</p>
                  <p className="text-gray-500 text-sm mb-2">For {COMPANY_INFO.name}</p>
                  <p className="border-b border-gray-300 mb-1">_______________________________</p>
                  <p className="text-gray-400 text-xs">Authorized Signature & Chop</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Customers</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Address</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ATTN</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Tel</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_CUSTOMERS.map(c => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{c.id}</td>
                    <td className="py-3 px-4 text-sm font-medium">{c.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{c.address}</td>
                    <td className="py-3 px-4 text-sm">{c.attn}</td>
                    <td className="py-3 px-4 text-sm">{c.tel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Products</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">JAN Code</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Product Name</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">Unit Price (HK$)</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_PRODUCTS.map(p => (
                  <tr key={p.jan} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">{p.jan}</td>
                    <td className="py-3 px-4 text-sm">{p.name}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium">${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx global>{`
        .bg-primary { background-color: #5e72e4; }
        .text-primary { color: #5e72e4; }
        .bg-success { background-color: #2dce89; }
        .text-success { color: #2dce89; }
        .bg-danger { background-color: #f5365c; }
        .text-danger { color: #f5365c; }
        .bg-light { background-color: #f7f8fc; }
        .bg-warning { background-color: #fb6340; }
        .text-warning { color: #fb6340; }
      `}</style>
    </div>
  )
}
