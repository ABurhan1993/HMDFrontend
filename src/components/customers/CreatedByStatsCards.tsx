import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import type { CustomerCountByUser } from "@/types/customer";

interface Props {
  onFilter: (userId: string) => void;
}

const CreatedByStatsCards = ({ onFilter }: Props) => {
  const [data, setData] = useState<CustomerCountByUser[]>([]);

  useEffect(() => {
    axios.get("/customer/created-by").then(res => setData(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">ِAccount By:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* كرت "All" */}
        <div
          onClick={() => onFilter("")}
          className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-4 rounded-xl shadow hover:scale-105 transition-all h-[100px] flex flex-col justify-center items-center"
        >
          <div className="text-2xl font-bold">
            {data.reduce((acc, item) => acc + item.count, 0)} {/* ← عدد كل الزبائن */}
          </div>
          <div className="text-sm text-center">All Users</div>
        </div>

        {/* باقي الكروت */}
        {data.map((item) => (
          <div
            key={item.userId}
            onClick={() => onFilter(item.userId)}
            className="cursor-pointer bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 p-4 rounded-xl shadow hover:scale-105 transition-all h-[100px] flex flex-col justify-center items-center"
          >
            <div className="text-2xl font-bold">{item.count}</div>
            <div className="text-sm text-center">{item.userName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatedByStatsCards;
