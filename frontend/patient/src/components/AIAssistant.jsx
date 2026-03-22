import React, { useState, useRef, useEffect } from 'react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your HDMS Health Assistant. Please tell me your symptoms, and I will guide you. (Note: I am an AI, please consult a real doctor for heavy medications)." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      // ⚠️ YAHAN AAPKI GOOGLE GEMINI API KEY HAI
      const API_KEY = "AIzaSyBs3dlmQSxOOR5gNNnjdg4h111vgdFXkYg"; 
      
      // 🚀 FIX: Google ka latest 'gemini-2.5-flash' model lagaya hai
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional medical AI assistant. A patient says: "${userMsg}". Give a short, helpful response with basic home remedies or OTC suggestions if applicable, but strictly advise them to consult a doctor for proper diagnosis. Keep it concise.`
            }]
          }]
        })
      });

      const data = await response.json();

      // Agar Google API se koi error aati hai (jaise key expire hona) toh yahan dikhega
      if (data.error) {
        console.error("Google API Error:", data.error);
        setMessages(prev => [...prev, { role: "ai", text: `API Error: ${data.error.message}` }]);
        return;
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);

    } catch (error) {
      console.error("Network Error:", error);
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, network error. Please check your internet or browser console." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full shadow-2xl shadow-teal-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform z-50 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        🤖
      </button>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[400px] h-[550px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
            
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-md">🤖</div>
                <div>
                  <h3 className="font-bold">HDMS AI Assistant</h3>
                  <p className="text-[10px] text-teal-100 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none shadow-md' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your symptoms..."
                  className="flex-1 bg-transparent outline-none px-2 text-sm text-gray-700"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="w-10 h-10 bg-teal-500 hover:bg-teal-600 text-white rounded-xl flex items-center justify-center shadow-md transition-colors disabled:bg-gray-300"
                >
                  ➤
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;