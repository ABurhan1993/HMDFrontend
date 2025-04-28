import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useUser } from "@/hooks/useUser";

export interface RoleData {
  id: string;
  name: string;
  claims: string[];
}

interface RoleTableProps {
  roles: RoleData[];
  onAddClick: () => void;
  onEditClick: (role: RoleData) => void;
}

export default function RoleTable({ roles, onAddClick, onEditClick }: RoleTableProps) {
  const [search, setSearch] = useState("");
  const user = useUser();

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-4">
        {/* 🔥 فقط إذا معو صلاحية إنشاء */}
        {user?.permissions.includes("Permissions.Roles.Create") && (
          <Button onClick={onAddClick} size="sm">+ New Role</Button>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block p-2 px-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Search roles"
        />
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Role Name</th>
            <th className="px-6 py-3">Permissions</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((role, index) => (
            <tr key={role.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {role.name}
              </td>
              <td className="px-6 py-4">
                {role.claims.length > 0 ? role.claims.join(", ") : "-"}
              </td>
              <td className="px-6 py-4">
                {user?.permissions.includes("Permissions.Roles.Edit") && (
                  <button
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Edit"
                    onClick={() => onEditClick(role)}
                  >
                    ✏️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
