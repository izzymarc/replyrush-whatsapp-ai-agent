
import React, { useState } from 'react';
import { Save, Building2, Phone, MapPin, CreditCard, Clock, Sparkles } from 'lucide-react';
import { getDb, updateBusiness } from '../services/mockDb';
import { Business } from '../types';

export const Settings: React.FC = () => {
  const db = getDb();
  const [business, setBusiness] = useState<Business>(db.business);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateBusiness(business);
    setTimeout(() => {
      setIsSaving(false);
      alert('Business profile updated successfully!');
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusiness(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Business Settings</h1>
        <p className="text-slate-500">Configure your business profile and AI behavior.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center space-x-2 text-slate-800">
            <Building2 size={20} className="text-emerald-600" />
            <h2 className="font-bold">Business Profile</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Business Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  name="name"
                  value={business.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  name="whatsapp"
                  value={business.whatsapp}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Business Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea 
                  name="address"
                  value={business.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center space-x-2 text-slate-800">
            <Clock size={20} className="text-emerald-600" />
            <h2 className="font-bold">Operations & Payments</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Working Hours</label>
              <input 
                name="workingHours"
                value={business.workingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Flat Delivery Fee (₦)</label>
              <input 
                name="deliveryFee"
                type="number"
                value={business.deliveryFee}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Bank Details / Payment Instructions</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea 
                  name="bankDetails"
                  value={business.bankDetails}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Behavior */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center space-x-2 text-slate-800">
            <Sparkles size={20} className="text-emerald-600" />
            <h2 className="font-bold">AI Behavior Settings</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Brand Tone & Voice</label>
              <select 
                name="tone"
                value={business.tone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Professional and polite Nigerian tone">Professional & Polite Nigerian</option>
                <option value="Very casual and street-savvy (Lagos vibe)">Street-Savvy (Lagos Vibe)</option>
                <option value="Strictly formal and corporate">Formal & Corporate</option>
                <option value="Cheerful and bubbly">Cheerful & Bubbly</option>
              </select>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start space-x-3">
              <Sparkles className="text-emerald-600 mt-1" size={18} />
              <p className="text-xs text-emerald-800 leading-relaxed">
                The AI agent automatically adopts this tone. It will always be helpful and aim to close sales while respecting the customer.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <Save size={20} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
