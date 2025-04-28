import { PencilIcon, KeyIcon } from "@heroicons/react/24/outline"; 
import Button from "@/components/ui/button/Button";
import { CustomPagination } from "@/components/ui/Pagination/CustomPagination";
import { useUser } from "@/hooks/useUser";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  roleName: string;
  branchName: string;
}

interface Props {
  data: User[];
  onEditClick?: (user: User) => void;
  onAddClick: () => void;
  onResetPasswordClick?: (user: User) => void;
  search: string;
  setSearch: (val: string) => void;
  currentPage: number;
  setCurrentPage: (val: number) => void;
  totalPages: number;
}

const UserTable = ({
  data,
  onEditClick,
  onAddClick,
  onResetPasswordClick,
  search,
  setSearch,
  currentPage,
  setCurrentPage,
}: Props) => {
  const user = useUser();

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 px-4 pt-4">
        {/* Left: Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-72 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search users"
          />
        </div>

        {/* Right: Add Button */}
        {user?.permissions.includes("Permissions.Users.Create") && (
          <Button onClick={onAddClick}>+ New User</Button>
        )}
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Full Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Branch</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => (
            <tr
              key={u.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {u.fullName}
              </td>
              <td className="px-6 py-4">{u.email}</td>
              <td className="px-6 py-4">{u.phone}</td>
              <td className="px-6 py-4">{u.roleName}</td>
              <td className="px-6 py-4">{u.branchName}</td>
              <td className="px-6 py-4 flex gap-2 items-center">
                {user?.permissions.includes("Permissions.Users.Edit") && (
                  <>
                    <button
                      className="text-yellow-500 hover:text-yellow-600"
                      onClick={() => onEditClick?.(u)}
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>

                    <button
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => onResetPasswordClick?.(u)}
                      title="Reset Password"
                    >
                      <KeyIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <CustomPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={20}
          totalItems={data.length}
        />
      </div>
    </div>
  );
};

export default UserTable;
