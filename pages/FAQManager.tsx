
import React, { useState } from 'react';
import { Plus, HelpCircle, Edit2, Trash2, Search } from 'lucide-react';
import { getDb, upsertFaq, deleteFaq } from '../services/mockDb';
import { FAQ } from '../types';

export const FAQManager: React.FC = () => {
  const [db, setDb] = useState(getDb());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const filteredFaqs = db.faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFaq: FAQ = {
      id: editingFaq?.id || `f${Date.now()}`,
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
    };
    upsertFaq(newFaq);
    setDb(getDb());
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      deleteFaq(id);
      setDb(getDb());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base (FAQs)</h1>
          <p className="text-slate-500">Train the AI on how to handle common customer questions.</p>
        </div>
        <button 
          onClick={() => { setEditingFaq(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search questions..." 
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start group">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                <HelpCircle size={18} />
                <h3 className="font-bold text-slate-800">{faq.question}</h3>
              </div>
              <p className="text-slate-600 whitespace-pre-wrap">{faq.answer}</p>
            </div>
            <div className="flex space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => { setEditingFaq(faq); setIsModalOpen(true); }}
                className="p-2 text-slate-400 hover:text-blue-600"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(faq.id)}
                className="p-2 text-slate-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No FAQs found. Add some to help your AI agent!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                <input required name="question" defaultValue={editingFaq?.question} placeholder="e.g., Do you deliver to Abuja?" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                <textarea required name="answer" defaultValue={editingFaq?.answer} rows={5} placeholder="Provide a detailed and helpful answer..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
