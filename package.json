import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useWebSocket from 'react-use-websocket';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const LiveChat = () => {
  // Icons
  const MessageCircleIcon = getIcon('MessageCircle');
  const SendIcon = getIcon('Send');
  const XIcon = getIcon('X');
  const UserIcon = getIcon('User');
  const HeadphonesIcon = getIcon('Headphones');
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [agentName, setAgentName] = useState('Support Agent');
  const [isConnecting, setIsConnecting] = useState(true);
  
  const chatEndRef = useRef(null);
  
  // WebSocket connection
  // In a real app, replace this URL with your actual WebSocket server
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    'wss://echo.websocket.org',
    {
      onOpen: () => {
        console.log('WebSocket Connected');
        setIsConnecting(false);
        
        // Add initial welcome message
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            { 
              sender: 'agent', 
              text: `Hello! I'm ${agentName}. How can I help you today?`,
              timestamp: new Date().toISOString()
            }
          ]);
        }, 1000);
      },
      onError: (event) => {
        console.error('WebSocket error:', event);
        toast.error('Connection error. Please try again later.');
        setIsConnecting(false);
      },
      // Only connect when chat is opened
      shouldReconnect: (closeEvent) => isOpen,
    }
  );
  
  // Handle incoming messages
  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      // In a real app, you'd parse the JSON response from your server
      // For this demo, we'll echo back the message as if from the agent
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          { 
            sender: 'agent', 
            text: `Thank you for your message. Our team will assist you with "${lastMessage.data}"`,
            timestamp: new Date().toISOString()
          }
        ]);
      }, 1000);
    }
  }, [lastMessage]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  const handleToggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [
      ...prev,
      { 
        sender: 'user', 
        text: message,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Send message via WebSocket
    sendMessage(message);
    
    // Clear input
    setMessage('');
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          className={`rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            isOpen ? 'bg-primary-dark' : 'bg-primary'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleChat}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <XIcon className="w-6 h-6 text-white" />
          ) : (
            <MessageCircleIcon className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {/* Chat header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <HeadphonesIcon className="w-5 h-5 mr-2" />
                <div>
                  <h3 className="font-medium">Customer Support</h3>
                  {!isConnecting && (
                    <p className="text-xs opacity-80">Agent: {agentName}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={handleToggleChat}
                className="p-1 rounded-full hover:bg-primary-dark transition-colors"
                aria-label="Close chat"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat body */}
            <div className="flex-1 p-4 overflow-y-auto bg-surface-100 dark:bg-surface-900">
              {isConnecting ? (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <div className="animate-pulse flex space-x-2 mb-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <p className="text-surface-500 dark:text-surface-400 text-sm">Connecting to support...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white dark:bg-surface-700 rounded-bl-none'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-70 block text-right mt-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-200 dark:border-surface-700 flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1 text-sm py-2"
                disabled={isConnecting}
              />
              <button
                type="submit"
                className="ml-2 bg-primary text-white rounded-lg p-2 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!message.trim() || isConnecting}
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;