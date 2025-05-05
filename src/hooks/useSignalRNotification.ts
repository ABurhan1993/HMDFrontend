import { useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { NotificationItem } from "./useNotifications";

const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL;

export const useSignalRNotification = (
  onNotificationReceived: (notification: NotificationItem) => void
) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !SIGNALR_HUB_URL) return;

    const connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => console.log("✅ SignalR Connected"))
      .catch((err) => console.error("❌ SignalR Connection Error:", err));

    connection.on("ReceiveNotification", (data) => {
      onNotificationReceived(data);
    });

    return () => {
      connection.stop();
    };
  }, [onNotificationReceived]);
};
