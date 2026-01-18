
import React, { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  PackageCheck,
  ArrowUpRight,
  Activity
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
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={20} className={color.replace('bg-', 'text-').replace('-600', '-500')} />
      </div>
      {trend && (
        <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} className="mr-0.5" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const db = useMemo(() => getDb(), []);

  const stats = useMemo(() => {
    const totalChats = db.conversations.length;
    const pendingOrders = db.orders.filter(o => o.status === 'pending').length;
    const successfulOrders = db.orders.filter(o => o.status !== 'cancelled').length;
    const totalRevenue = db.orders
      .filter(o => o.status === 'confirmed' || o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { totalChats, pendingOrders, successfulOrders, totalRevenue };
  }, [db]);

  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      chats: Math.floor(Math.random() * 25) + 5,
      orders: Math.floor(Math.random() * 8)
    }));
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Business intelligence for {db.business.name}</p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm border border-indigo-100">
          <Activity size={16} className="animate-pulse" />
          <span>Agent Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Outreach" value={stats.totalChats} icon={Users} color="bg-indigo-600" trend="+18%" />
        <StatCard label="In Pipeline" value={stats.pendingOrders} icon={Clock} color="bg-amber-600" />
        <StatCard label="Completed Deals" value={stats.successfulOrders} icon={PackageCheck} color="bg-blue-600" trend="+4%" />
        <StatCard label="Gross Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} color="bg-violet-600" trend="+12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Engagement Trends</h3>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg p-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold'}} />
                <Line type="monotone" dataKey="chats" stroke="#4F46E5" strokeWidth={4} dot={{r: 5, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col justify-between text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-10 -mt-10 blur-3xl"></div>
          <div>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Growth Tip</p>
            <h3 className="text-xl font-bold mt-4 leading-tight">Scale your responses by adding more FAQs.</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">Businesses with 20+ FAQs see a 35% higher conversion rate on WhatsApp.</p>
          </div>
          <button className="bg-white text-slate-900 w-full py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors mt-8">
            Manage Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
};
