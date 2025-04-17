import PageMeta from "../../components/common/PageMeta";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics"; // ✅ بضل
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";       // ✅ بضل

export default function Home() {
  return (
    <>
      <PageMeta
        title="CRM Dashboard | TailAdmin"
        description="Customer Relationship Management Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <MonthlyTarget />
        </div>


        <div className="col-span-12">
          <DashboardCalendar />
        </div>
      </div>
    </>
  );
}
