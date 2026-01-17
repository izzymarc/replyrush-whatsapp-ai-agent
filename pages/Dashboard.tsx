
import React, { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  PackageCheck,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { getDb } from '../services/mockDb';

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} text-white`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center text-emerald-600 text-sm font-medium">
          <ArrowUpRight size={16} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const db = useMemo(() => getDb(), []);

  const data = [
    { name: 'Mon', chats: 12, orders: 4 },
    { name: 'Tue', chats: 19, orders: 7 },
    { name: 'Wed', chats: 15, orders: 5 },
    { name: 'Thu', chats: 22, orders: 9 },
    { name: 'Fri', chats: 30, orders: 12 },
    { name: 'Sat', chats: 25, orders: 10 },
    { name: 'Sun', chats: 14, orders: 3 },
  ];

  const pendingOrders = db.orders.filter(o => o.status === 'pending').length;
  const totalRev = db.orders.reduce((acc, o) => o.status === 'confirmed' || o.status === 'delivered' ? acc + o.totalAmount : acc, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, {db.business.name}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Chats" 
          value={db.conversations.length} 
          icon={Users} 
          color="bg-blue-500" 
          trend="+12%"
        />
        <StatCard 
          label="Pending Orders" 
          value={pendingOrders} 
          icon={Clock} 
          color="bg-amber-500" 
        />
        <StatCard 
          label="Confirmed Sales" 
          value={db.orders.filter(o => o.status !== 'cancelled').length} 
          icon={PackageCheck} 
          color="bg-emerald-500" 
          trend="+5%"
        />
        <StatCard 
          label="Total Revenue" 
          value={`₦${totalRev.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-indigo-500" 
          trend="+8.5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Orders vs Chats</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Conversations</h3>
          <button className="text-emerald-600 font-medium text-sm hover:underline">View all</button>
        </div>
        <div className="divide-y divide-slate-100">
          {db.conversations.slice(0, 5).map((conv) => (
            <div key={conv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                  {conv.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{conv.customerName}</p>
                  <p className="text-sm text-slate-500 truncate max-w-xs">{conv.lastMessage}</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                {new Date(conv.lastSeen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
