import ComponentCard from "@/components/common/ComponentCard";
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
    className="cursor-pointer transition hover:scale-[1.02] h-full"
  >
    <ComponentCard title={label} className="text-center h-full">
      <div className="flex flex-col items-center justify-center gap-2 min-h-[80px]">
        <div className="w-10 h-10 text-primary">{icon}</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {count}
        </div>
      </div>
    </ComponentCard>
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
      const isToday =
        meetingDate &&
        meetingDate.toDateString() === today.toDateString();
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
      <StatsCard
  label="All Customers"
  count={stats.total}
  icon={<UserGroupIcon className="w-8 h-8 text-gray-800 dark:text-white" />}
  onClick={() => onFilter("all")}
/>
<StatsCard
  label="Contacted"
  count={stats.contacted}
  icon={<CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />}
  onClick={() => onFilter("Contacted")}
/>
<StatsCard
  label="Need to Contact"
  count={stats.needToContact}
  icon={<PhoneIcon className="w-8 h-8 text-gray-800 dark:text-white" />}
  onClick={() => onFilter("NeedToContact")}
/>
<StatsCard
  label="Need Follow Up"
  count={stats.needToFollowUp}
  icon={<ClockIcon className="w-8 h-8 text-gray-800 dark:text-white" />}
  onClick={() => onFilter("NeedToFollowUp")}
/>
<StatsCard
  label="Not Responding"
  count={stats.notResponding}
  icon={<EyeSlashIcon className="w-8 h-8 text-gray-800 dark:text-white" />}
  onClick={() => onFilter("NotResponding")}
/>
<StatsCard
  label="Need to Contact Today"
  count={stats.needToContactToday}
  icon={<CalendarDaysIcon className="w-8 h-8 text-gray-800 dark:text-white" />}
  onClick={() => onFilter("NeedToContactToday")}
/>
<StatsCard
  label="Need to Follow Up Today"
  count={stats.needToFollowUpToday}
  icon={<CalendarDaysIcon className="w-8 h-8 text-orange-400 dark:text-orange-300" />}
  onClick={() => onFilter("NeedToFollowUpToday")}
/>
<StatsCard
  label="Need to Contact (Delayed)"
  count={stats.needToContactDelayed}
  icon={<ExclamationTriangleIcon className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />}
  onClick={() => onFilter("NeedToContactDelayed")}
/>
<StatsCard
  label="Need to Follow Up (Delayed)"
  count={stats.needToFollowUpDelayed}
  icon={<ExclamationTriangleIcon className="w-8 h-8 text-red-500 dark:text-red-400" />}
  onClick={() => onFilter("NeedToFollowUpDelayed")}
/>

    </div>
  );
};

export default CustomerStatsCards;
