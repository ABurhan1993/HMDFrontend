import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "../utils/axios";

interface EventItem {
  title: string;
  date: string;
  backgroundColor?: string;
  textColor?: string;
}

const DashboardCalendar = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/Customer/calendar-events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    fetchEvents();
  }, []);

  const eventsForSelectedDate = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  return (
    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Customer Follow-Up Calendar
      </h2>

      <div className="calendar-wrapper text-sm text-gray-700 dark:text-gray-200">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          dayMaxEventRows={3}
          eventDisplay="block"
          dateClick={(info) => {
            setSelectedDate(info.dateStr);
          }}
        />
      </div>

      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📅 Events on {selectedDate}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Close ✖
              </button>
            </div>

            {eventsForSelectedDate.length > 0 ? (
              <ul className="space-y-3">
                {eventsForSelectedDate.map((event, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: event.backgroundColor || "#f3f4f6",
                      color: event.textColor || "#000",
                    }}
                  >
                    {event.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                No events found for this date.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;
