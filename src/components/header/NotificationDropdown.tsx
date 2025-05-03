import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { useNotifications, NotificationItem } from "@/hooks/useNotifications";
import { useSignalRNotification } from "@/hooks/useSignalRNotification";
import toast from "react-hot-toast";


export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const { notifications, refresh } = useNotifications();

  useSignalRNotification((notification: NotificationItem) => {
    setNotifying(true);
    refresh();
    new Audio("/notification.mp3").play();
  
    toast(`${notification.title} - ${notification.message}`, {
      duration: 3000,
      position: "top-right",
    });
  }); 

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${!notifying ? "hidden" : "flex"}`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 1.5c-.4 0-.75.35-.75.75v.58C6.08 3.2 3.63 5.9 3.63 9.17v5.29H3.33a.75.75 0 100 1.5h13.34a.75.75 0 000-1.5h-.3V9.17c0-3.27-2.46-5.97-5.62-6.34v-.58c0-.4-.35-.75-.75-.75zM5.13 9.17c0-2.69 2.19-4.88 4.87-4.88s4.88 2.19 4.88 4.88v5.29H5.13V9.17zM8 17.71c0 .41.34.75.75.75h2.5a.75.75 0 000-1.5h-2.5A.75.75 0 008 17.7z" />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notification</h5>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <li className="text-center text-gray-500 text-sm py-2">No notifications</li>
          ) : (
            notifications.map((n: NotificationItem) => (
              <DropdownItem
                key={n.id}
                onItemClick={closeDropdown}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              >
                <span className="block">
                  <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">{n.title}</span>
                    <span> - {n.message}</span>
                  </span>
                  <span className="text-xs text-gray-400">{new Date(n.createdDate).toLocaleString()}</span>
                </span>
              </DropdownItem>
            ))
          )}
        </ul>
        <Link to="/notifications" className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}