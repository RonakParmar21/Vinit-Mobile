'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Send, Shield, Smartphone } from 'lucide-react';

export default function DemoPage() {
  const [role, setRole] = useState<'Store Staff' | 'Cluster Manager'>('Store Staff');

  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    api: '/api/chat',
    body: { userRole: role },
  });

  return (
    <main className="flex h-screen bg-[#111b21] text-gray-100 font-sans">
      {/* Sidebar Controls */}
      <div className="w-80 border-r border-[#222e35] p-5 flex flex-col justify-between bg-[#111b21]">
        <div>
          <div className="flex items-center gap-2 mb-6 text-emerald-400 font-semibold text-lg">
            <Smartphone className="w-6 h-6" />
            <span>Vinit AI Demo</span>
          </div>

          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-medium">Switch Active Role</p>
          <div className="flex flex-col gap-2 mb-6">
            <button
              onClick={() => setRole('Store Staff')}
              className={`p-3 text-left rounded-lg text-sm transition ${role === 'Store Staff' ? 'bg-[#00a884] text-white font-medium' : 'bg-[#202c33] text-gray-300'}`}
            >
              Store Staff (Adajan Branch)
            </button>
            <button
              onClick={() => setRole('Cluster Manager')}
              className={`p-3 text-left rounded-lg text-sm transition ${role === 'Cluster Manager' ? 'bg-[#00a884] text-white font-medium' : 'bg-[#202c33] text-gray-300'}`}
            >
              Cluster Manager (Surat Region)
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">Quick Prompts</p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setInput("Which store has iPhone 16 Pro in stock?")}
              className="text-left text-xs bg-[#202c33] hover:bg-[#2a3942] p-2.5 rounded text-gray-300 border border-[#2a3942]"
            >
              "Which store has iPhone 16 Pro in stock?"
            </button>
            <button 
              onClick={() => setInput("Show today's Paytm vs ERP settlement discrepancies.")}
              className="text-left text-xs bg-[#202c33] hover:bg-[#2a3942] p-2.5 rounded text-gray-300 border border-[#2a3942]"
            >
              "Show today's Paytm vs ERP settlement discrepancies."
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#202c33] p-3 rounded">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Active Role: <strong className="text-white">{role}</strong></span>
        </div>
      </div>

      {/* Main WhatsApp View */}
      <div className="flex-1 flex flex-col bg-[#0b141a]">
        <header className="p-4 bg-[#202c33] border-b border-[#222e35] flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-white">Vinit Mobile Ops Agent (WhatsApp Bot)</h1>
            <p className="text-xs text-emerald-400">● Online | Connected to ERP Replica</p>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-sm text-gray-500 mt-20">
              Type a prompt or choose a sample question from the left panel to simulate the WhatsApp interaction.
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3.5 rounded-lg text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none shadow'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#202c33] flex items-center gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your WhatsApp message..."
            className="flex-1 bg-[#2a3942] text-sm text-white rounded-lg px-4 py-3 focus:outline-none placeholder-gray-400"
          />
          <button type="submit" className="p-3 bg-[#00a884] hover:bg-[#02906f] rounded-lg text-white">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}