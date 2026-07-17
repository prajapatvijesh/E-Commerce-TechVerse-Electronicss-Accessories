import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { RootState } from '../store/store';
import { io, Socket } from 'socket.io-client';
import { Send, User as UserIcon } from 'lucide-react';
import { Button } from '@techverse/ui';

export const Chat: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io((import.meta as any).env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });
    setSocket(newSocket);
    
    newSocket.on('receive_message', () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConv] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    return () => {
      newSocket.close();
    };
  }, [queryClient, selectedConv]);

  useEffect(() => {
    if (socket && selectedConv) {
      socket.emit('join_room', selectedConv);
    }
  }, [socket, selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await axios.get('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    refetchInterval: 10000,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', selectedConv],
    queryFn: async () => {
      const res = await axios.get(`/api/chat/conversations/${selectedConv}/messages`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!selectedConv,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await axios.post('/api/chat/messages', { conversationId: selectedConv, text }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setMessage('');
      if (socket) {
        socket.emit('send_message', { roomId: selectedConv, message: data });
      }
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConv] });
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConv) return;
    sendMessageMutation.mutate(message);
  };

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-b-2 border-primary-500 rounded-full"></div></div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 shadow-sm">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-dark-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-bold dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations?.map((conv: any) => {
            const otherUser = conv.participants.find((p: any) => p._id !== user?._id);
            return (
              <div 
                key={conv._id} 
                onClick={() => setSelectedConv(conv._id)}
                className={`p-4 border-b border-gray-100 dark:border-dark-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition ${selectedConv === conv._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 dark:bg-dark-600 p-2 rounded-full">
                    <UserIcon size={20} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-white">{otherUser?.name || 'Unknown User'}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-48">{conv.lastMessage?.text || 'No messages yet'}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {(!conversations || conversations.length === 0) && (
            <div className="p-6 text-center text-gray-500">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages?.map((msg: any) => {
                const isMe = msg.sender._id === user?._id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-5 py-3 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-dark-700 dark:text-white rounded-bl-none'}`}>
                      <p>{msg.text}</p>
                      <span className={`text-[10px] mt-1 block ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-dark-700">
              <form onSubmit={handleSend} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-dark-700 rounded-xl bg-gray-50 dark:bg-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <Button type="submit" variant="primary" className="rounded-xl px-4" disabled={!message.trim()}>
                  <Send size={20} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};
