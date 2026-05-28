import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // If authenticated, connect to the WebSocket server
    if (isAuthenticated && token) {
      const BASE_WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
      // Clean up URL to ensure ws:// or wss:// format
      const wsUrl = `${BASE_WS_URL}/ws?token=${encodeURIComponent(token)}`;

      console.log('Connecting to WebSocket:', BASE_WS_URL);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);

          if (data.type === 'NEW_SWAP_REQUEST') {
            toast.success(`New swap request from ${data.sender_name || 'another user'}!`, {
              duration: 5000,
              icon: '🔔',
            });
            setNotificationCount((prev) => prev + 1);
            
            // Dispatch a custom event so other components can fetch fresh incoming lists if mounted
            window.dispatchEvent(new CustomEvent('ws-new-swap-request', { detail: data }));
          } else if (data.type === 'SWAP_ACCEPTED') {
            toast.success(`Your swap request was ACCEPTED for "${data.event_title || 'your event'}"!`, {
              duration: 5000,
              icon: '✅',
            });
            // Update counts if appropriate and dispatch custom event to refresh lists
            window.dispatchEvent(new CustomEvent('ws-swap-accepted', { detail: data }));
          } else if (data.type === 'SWAP_REJECTED') {
            toast.error(`Your swap request was REJECTED for "${data.event_title || 'your event'}".`, {
              duration: 5000,
              icon: '❌',
            });
            window.dispatchEvent(new CustomEvent('ws-swap-rejected', { detail: data }));
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onopen = () => {
        console.log('WebSocket connected successfully.');
      };

      ws.onerror = (error) => {
        console.warn('WebSocket connection error. This is normal if your backend server is not running yet:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed.');
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } else {
      // Clear socket if unauthenticated
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  }, [isAuthenticated, token]);

  const resetNotificationCount = () => {
    setNotificationCount(0);
  };

  return (
    <WebSocketContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        resetNotificationCount,
        lastMessage,
        sendMessage: (msg) => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
          } else {
            console.warn('WebSocket is not open. Socket message not sent.');
          }
        },
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
