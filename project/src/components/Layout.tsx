// import { ReactNode } from 'react';
// import Sidebar from './Sidebar';

// interface LayoutProps {
//   children: ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   return (
//     <div className="flex h-screen">
//       <Sidebar />
//       <main className="flex-1 overflow-auto bg-gray-100 p-8">{children}</main>
//     </div>
//   );
// }

import { ReactNode, useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { MessageSquare, X, Send, Trash2 } from 'lucide-react';
import { getAIChatResponse } from '../utils/api'; // Import your API helper

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  // 1. Add chat history state
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearChat = () => {
    if(window.confirm("Are you sure you want to clear the conversation?"))
    {
      setChatHistory([]);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isChatOpen]);

  // 2. Add the send message function
  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: message };
    setChatHistory(prev => [...prev, userMsg]);
    const currentMsg = message;
    setMessage("");
    setLoading(true);

    try {
      const res = await getAIChatResponse(currentMsg);
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-100 p-8 relative">
        {children}

        {/* --- AI CHATBOT UI --- */}
        <div className="fixed bottom-6 right-6 z-50">
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all transform hover:scale-110"
            >
              <MessageSquare className="h-6 w-6" />
            </button>
          ) : (
            <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5">
              <div className="bg-indigo-600 p-4 rounded-t-2xl flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Sales AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearChat} className="text-white hover:text-indigo-200">
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => setIsChatOpen(false)}><X className="h-5 w-5" /></button>
                </div>
              </div>

              {/* 3. Updated Message Area to show chatHistory */}
              <div className="flex-1 p-4 overflow-y-auto text-sm flex flex-col gap-3">
                <div className="bg-gray-100 p-2 rounded-lg self-start max-w-[80%] text-gray-600">
                  Hello! How can I help you with your sales data today?
                </div>
                
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg max-w-[80%] ${
                      chat.role === 'user' 
                        ? 'bg-indigo-100 text-indigo-900 self-end' 
                        : 'bg-gray-100 text-gray-600 self-start'
                    }`}
                  >
                    {chat.text}
                  </div>
                ))}
                {loading && <div className="text-xs text-gray-400 italic">Thinking...</div>}

                <div ref={messagesEndRef} />
              </div>

              {/* 4. Connected input and button */}
              <div className="p-3 border-t flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about revenue..."
                  className="flex-1 text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}