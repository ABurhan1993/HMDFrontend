import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  createdDate: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notification/my");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, refresh: fetchNotifications };
};