
import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, MoreHorizontal, Phone } from 'lucide-react';
import { getDb, updateOrderStatus } from '../services/mockDb';
import { OrderStatus } from '../types';

export const Orders: React.FC = () => {
  const [db, setDb] = useState(getDb());
  const [search, setSearch] = useState('');

  const filteredOrders = db.orders.filter(o => 
    o.customerName.toLowerCase().includes(search.toLowerCase()) || 
    o.customerWhatsapp.includes(search)
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
      case OrderStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700';
      case OrderStatus.CANCELLED: return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    setDb(getDb());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500">Track and manage customer orders placed through WhatsApp.</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search customer name or phone..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <Filter size={20} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-slate-400">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{order.customerName}</p>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Phone size={12} className="mr-1" />
                    {order.customerWhatsapp}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-600">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">
                  ₦{order.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="text-xs border rounded p-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                    <option value={OrderStatus.DELIVERED}>Delivered</option>
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="bg-slate-100 p-4 rounded-full mb-4">
               <ShoppingBag size={48} className="text-slate-300" />
             </div>
             <p className="text-slate-400 font-medium">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
