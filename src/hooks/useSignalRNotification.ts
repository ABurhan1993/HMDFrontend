import { useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { NotificationItem } from "./useNotifications";

export const useSignalRNotification = (
  onNotificationReceived: (notification: NotificationItem) => void
) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl("https://https://www.hmdserver.com/hubs/notification", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection.start().catch((err) => console.error("SignalR Connection Error:", err));

    connection.on("ReceiveNotification", (data) => {
      onNotificationReceived(data);
    });

    return () => {
      connection.stop();
    };
  }, [onNotificationReceived]);
};
