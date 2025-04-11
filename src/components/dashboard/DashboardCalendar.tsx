import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface EventItem {
  title: string;
  date: string;
  backgroundColor?: string;
  textColor?: string;
}

const DashboardCalendar = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    // مؤقتاً بيانات وهمية لتجربة التقويم
    setEvents([
      {
        title: "📞 Need to Contact – Ahmad",
        date: "2025-04-14",
        backgroundColor: "#ef4444", // أحمر
        textColor: "#fff",
      },
      {
        title: "✅ Follow-Up Done – Sarah",
        date: "2025-04-14",
        backgroundColor: "#10b981", // أخضر
        textColor: "#fff",
      },
      {
        title: "🟡 Customer Need to Follow Up",
        date: "2025-04-16",
        backgroundColor: "#facc15", // أصفر
        textColor: "#000",
      },
    ]);
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Customer Follow-Up Calendar
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
};

export default DashboardCalendar;
