"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const NotificationContext = createContext<{
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}>({
  unreadCount: 0,
  setUnreadCount: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
