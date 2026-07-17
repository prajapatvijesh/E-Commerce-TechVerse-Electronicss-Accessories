import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hi there! 👋 I am TechVerse AI Assistant. How can I help you find the perfect tech today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateDummyResponse = (query: string): string => {
    const lower = query.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi ')) {
      return 'Hello! What kind of electronics are you looking for?';
    }
    if (lower.includes('return') || lower.includes('refund')) {
      return 'We offer a 7-day hassle-free return policy on all electronics, provided they are in original packaging. You can initiate a return from your Orders dashboard.';
    }
    if (lower.includes('laptop') || lower.includes('macbook')) {
      return 'For laptops, I highly recommend checking out our Apple MacBook Pro or Dell XPS series in the Categories > Laptops section. They are top sellers this month!';
    }
    if (lower.includes('discount') || lower.includes('offer')) {
      return 'You can use the coupon code "TECH20" at checkout for a special 20% discount on your first order!';
    }
    if (lower.includes('contact') || lower.includes('support')) {
      return 'You can reach our 24/7 support team at support@techverse.com or call us at +91-800-123-4567.';
    }
    
    return 'That is a great question! However, I am currently running in a demo mode without a live API key. In a real environment, I would use advanced AI to answer this perfectly!';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateDummyResponse(userMsg.text),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">TechVerse AI</h3>
                <p className="text-xs text-primary-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-96 overflow-y-auto bg-gray-50 dark:bg-dark-950 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 mr-2 flex-shrink-0 mt-auto">
                    <Bot size={14} />
                  </div>
                )}
                
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-dark-700'
                }`}>
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0 mt-auto">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800">
            <form onSubmit={handleSend} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-dark-800 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-primary-600 hover:bg-primary-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
