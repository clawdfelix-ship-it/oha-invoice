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
    const canvas = await html2canvas(element, { scale: 2 })
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
      <header className="bg-blue-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🧾 OHA Invoice System</h1>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('invoice')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'invoice' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>
              <FileText size={18} /> Invoice
            </button>
            <button onClick={() => setActiveTab('customers')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'customers' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>
              <Users size={18} /> Customers
            </button>
            <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'products' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>
              <Package size={18} /> Products
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'invoice' && (
          <>
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No.</label>
                  <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select value={customer.id} onChange={(e) => setCustomer(SAMPLE_CUSTOMERS.find(c => c.id === e.target.value))} className="w-full border rounded-lg px-3 py-2">
                    {SAMPLE_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                  <select className="w-full border rounded-lg px-3 py-2">
                    <option>COD</option>
                    <option>Net 30</option>
                    <option>Net 60</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={addItem} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
                  <Plus size={18} /> Add Item
                </button>
                <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <Download size={18} /> Export PDF
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700">
                  <Save size={18} /> Save
                </button>
              </div>
            </div>

            {/* Invoice Preview */}
            <div ref={invoiceRef} className="bg-white p-8 shadow-lg" style={{ minHeight: '297mm' }}>
              {/* Company Header */}
              <div className="border-b-2 border-blue-900 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-blue-900">{COMPANY_INFO.name}</h1>
                <p className="text-gray-600">{COMPANY_INFO.address}</p>
                <p className="text-gray-600">TEL: {COMPANY_INFO.tel} | Email: {COMPANY_INFO.email}</p>
              </div>

              {/* Invoice Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-900">INVOICE</h2>
              </div>

              {/* Invoice Info & Customer */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">BILL TO</h3>
                  <p className="font-bold">{customer.name}</p>
                  <p>{customer.address}</p>
                  <p>ATTN: {customer.attn} | TEL: {customer.tel}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-bold">Invoice No.:</span> {invoiceNo}</p>
                  <p><span className="font-bold">Date:</span> {date}</p>
                  <p><span className="font-bold">Payment:</span> COD</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-3 px-2 text-center">#</th>
                    <th className="py-3 px-2 text-left">JAN Code</th>
                    <th className="py-3 px-2 text-left">Description</th>
                    <th className="py-3 px-2 text-center">Qty</th>
                    <th className="py-3 px-2 text-right">Unit Price (HK$)</th>
                    <th className="py-3 px-2 text-right">Amount (HK$)</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-2 text-center">{index + 1}</td>
                      <td className="py-3 px-2">
                        <input type="text" value={item.jan} onChange={(e) => updateItem(item.id, 'jan', e.target.value)} className="w-full border-0 bg-transparent" placeholder="JAN Code" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full border-0 bg-transparent" placeholder="Description" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} className="w-16 border rounded px-2 py-1 text-center" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-24 border rounded px-2 py-1 text-right" />
                      </td>
                      <td className="py-3 px-2 text-right font-bold">{(item.qty * item.price).toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="bg-blue-900 text-white py-3 px-4 flex justify-between font-bold text-lg">
                    <span>TOTAL</span>
                    <span>HK$ {subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 grid grid-cols-2 gap-8">
                <div>
                  <p className="font-bold mb-2">Freight: Collect</p>
                  <p className="font-bold">Country of Origin: JAPAN & CHINA</p>
                  <p className="font-bold mt-2">Payment: COD</p>
                </div>
                <div>
                  <p className="font-bold text-blue-900">BANK INFO:</p>
                  <p>{COMPANY_INFO.bank}</p>
                  <p>{COMPANY_INFO.fps}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-12 grid grid-cols-2 gap-12">
                <div>
                  <p className="font-bold mb-4">Received By:</p>
                  <p className="italic mb-2">For {customer.name}</p>
                  <p className="border-b border-gray-400 mb-1">_______________________________</p>
                  <p className="text-gray-500 text-sm">Client Signature & Company Chop</p>
                </div>
                <div>
                  <p className="font-bold mb-4">Issued By:</p>
                  <p className="italic mb-2">For {COMPANY_INFO.name}</p>
                  <p className="border-b border-gray-400 mb-1">_______________________________</p>
                  <p className="text-gray-500 text-sm">Authorized Signature & Company Chop</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Customers</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">ATTN</th>
                  <th className="py-3 px-4 text-left">Tel</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_CUSTOMERS.map(c => (
                  <tr key={c.id} className="border-b">
                    <td className="py-3 px-4">{c.id}</td>
                    <td className="py-3 px-4 font-bold">{c.name}</td>
                    <td className="py-3 px-4">{c.address}</td>
                    <td className="py-3 px-4">{c.attn}</td>
                    <td className="py-3 px-4">{c.tel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Products</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">JAN Code</th>
                  <th className="py-3 px-4 text-left">Product Name</th>
                  <th className="py-3 px-4 text-right">Unit Price (HK$)</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_PRODUCTS.map(p => (
                  <tr key={p.jan} className="border-b">
                    <td className="py-3 px-4 font-mono">{p.jan}</td>
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4 text-right">${p.price}</td>
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
