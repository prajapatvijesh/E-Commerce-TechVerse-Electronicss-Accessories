import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { RootState } from '../store/store';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@techverse/ui';
import { toggleChat } from '../store/slices/chatSlice';
import { useDispatch } from 'react-redux';

export const ChatWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isOpen, receiverId, receiverName } = useSelector((state: RootState) => state.chat);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For MVP, if they open chat we start a conversation with the super admin
  const { data: conversation } = useQuery({
    queryKey: ['conversation', receiverId],
    queryFn: async () => {
      const res = await axios.post('/api/chat/conversations', { receiverId }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    enabled: isOpen && !!user && !!receiverId,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', conversation?._id],
    queryFn: async () => {
      const res = await axios.get(`/api/chat/conversations/${conversation._id}/messages`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!conversation,
  });

  useEffect(() => {
    if (isOpen && user) {
      const newSocket = io((import.meta as any).env.VITE_API_URL || 'http://localhost:5000', {
        withCredentials: true,
      });
      setSocket(newSocket);
      
      newSocket.on('receive_message', () => {
        queryClient.invalidateQueries({ queryKey: ['messages', conversation?._id] });
      });

      return () => {
        newSocket.close();
      };
    }
  }, [isOpen, user, queryClient, conversation?._id]);

  useEffect(() => {
    if (socket && conversation) {
      socket.emit('join_room', conversation._id);
    }
  }, [socket, conversation]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await axios.post('/api/chat/messages', { conversationId: conversation._id, text }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setMessage('');
      if (socket) {
        socket.emit('send_message', { roomId: conversation._id, message: data });
      }
      queryClient.invalidateQueries({ queryKey: ['messages', conversation?._id] });
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversation) return;
    sendMessageMutation.mutate(message);
  };

  if (!user) return null;

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 p-4 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700 transition-transform hover:scale-105 z-50 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">{receiverName}</h3>
              <p className="text-xs text-primary-100">Typically replies in a few minutes</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-dark-900">
            {messages?.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                Send a message to start chatting!
              </div>
            )}
            {messages?.map((msg: any) => {
              const isMe = msg.sender._id === user._id;
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white dark:bg-dark-700 dark:text-white border border-gray-100 dark:border-dark-600 rounded-bl-none shadow-sm'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
            <form onSubmit={handleSend} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-dark-600 rounded-xl bg-gray-50 dark:bg-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
              <Button type="submit" variant="primary" className="rounded-xl px-3" disabled={!message.trim()}>
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
