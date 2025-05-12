'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This will be replaced with actual API call
    const fetchMessages = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages([
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            message: 'I need a quote for a custom welding project.',
            date: '2024-02-20',
            read: false
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '(555) 987-6543',
            message: 'Looking for industrial welding services.',
            date: '2024-02-19',
            read: true
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      // This will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // This will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {messages.map((message) => (
                <li key={message.id}>
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full px-4 py-4 hover:bg-gray-50 focus:outline-none ${
                      selectedMessage?.id === message.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          !message.read ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {message.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {message.email}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-500">
                          {new Date(message.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedMessage.name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    {!selectedMessage.read && (
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Received on {new Date(selectedMessage.date).toLocaleDateString()}
                  </p>
                  <div className="mt-4 text-gray-700">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                Select a message to view details
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 