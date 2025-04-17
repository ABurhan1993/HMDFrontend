import {
  UserGroupIcon,
  PhoneIcon,
  ClockIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useMemo } from "react";
import type { CustomerData } from "@/types/customer";

interface StatsCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatsCard = ({ label, count, icon, onClick }: StatsCardProps) => (
    <div
      onClick={onClick}
      className="cursor-pointer transition hover:scale-[1.02]"
    >
      <div className="flex flex-col justify-between items-center text-center bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-4 h-[160px] w-full max-w-[160px] mx-auto overflow-hidden">
        {/* الأيقونة */}
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10">{icon}</div>
        </div>
  
        {/* الفاصل */}
        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />
  
        {/* النصوص */}
        <div className="flex flex-col items-center justify-end flex-grow">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-tight mb-1">
            {label}
          </div>
          <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white leading-tight">
            {count}
          </div>
        </div>
      </div>
    </div>
  );
  

interface CustomerStatsCardsProps {
  customers: CustomerData[];
  onFilter: (type: string) => void;
}

const CustomerStatsCards = ({ customers, onFilter }: CustomerStatsCardsProps) => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = customers.length;
    let contacted = 0;
    let needToContact = 0;
    let needToFollowUp = 0;
    let notResponding = 0;
    let needToContactToday = 0;
    let needToFollowUpToday = 0;
    let needToContactDelayed = 0;
    let needToFollowUpDelayed = 0;

    for (const c of customers) {
      const status = c.contactStatusName;
      const meetingDate = c.customerNextMeetingDate
        ? new Date(c.customerNextMeetingDate)
        : null;
      const isToday = meetingDate && meetingDate.toDateString() === today.toDateString();
      const isDelayed = meetingDate && meetingDate < today;

      switch (status) {
        case "Contacted":
          contacted++;
          break;
        case "NeedToContact":
          if (isToday) needToContactToday++;
          else if (isDelayed) needToContactDelayed++;
          else needToContact++;
          break;
        case "NeedToFollowUp":
          if (isToday) needToFollowUpToday++;
          else if (isDelayed) needToFollowUpDelayed++;
          else needToFollowUp++;
          break;
        case "NotResponding":
          notResponding++;
          break;
      }
    }

    return {
      total,
      contacted,
      needToContact,
      needToFollowUp,
      notResponding,
      needToContactToday,
      needToFollowUpToday,
      needToContactDelayed,
      needToFollowUpDelayed,
    };
  }, [customers]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 xl:gap-6 p-4 sm:p-6">
      {[
        { label: "All Customers", count: stats.total, icon: <UserGroupIcon className="w-6 h-6 text-gray-800 dark:text-white" />, filter: "all" },
        { label: "Contacted", count: stats.contacted, icon: <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />, filter: "Contacted" },
        { label: "Need to Contact", count: stats.needToContact, icon: <PhoneIcon className="w-6 h-6 text-gray-800 dark:text-white" />, filter: "NeedToContact" },
        { label: "Need Follow Up", count: stats.needToFollowUp, icon: <ClockIcon className="w-6 h-6 text-gray-800 dark:text-white" />, filter: "NeedToFollowUp" },
        { label: "Not Responding", count: stats.notResponding, icon: <EyeSlashIcon className="w-6 h-6 text-gray-800 dark:text-white" />, filter: "NotResponding" },
        { label: "Need to Contact Today", count: stats.needToContactToday, icon: <CalendarDaysIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />, filter: "NeedToContactToday" },
        { label: "Need to Follow Up Today", count: stats.needToFollowUpToday, icon: <CalendarDaysIcon className="w-6 h-6 text-orange-400 dark:text-orange-300" />, filter: "NeedToFollowUpToday" },
        { label: "Need to Contact (Delayed)", count: stats.needToContactDelayed, icon: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />, filter: "NeedToContactDelayed" },
        { label: "Need to Follow Up (Delayed)", count: stats.needToFollowUpDelayed, icon: <ExclamationTriangleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />, filter: "NeedToFollowUpDelayed" },
      ].map((item, index) => (
        <div key={index} className="w-full h-full max-w-[160px] mx-auto">
          <StatsCard
            label={item.label}
            count={item.count}
            icon={item.icon}
            onClick={() => onFilter(item.filter)}
          />
        </div>
      ))}
    </div>
  );
};

export default CustomerStatsCards;
