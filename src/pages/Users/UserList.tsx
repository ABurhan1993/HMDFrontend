import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import UserTable from "@/components/users/UserTable";
import AddUserForm from "@/components/users/AddUserForm";
import ResetPasswordModal from "@/components/users/ResetPasswordModal"; // 🔥 استيراد المودال الجديد
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  roleName: string;
  branchName: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null); // 🔥 يوزر عم نعملو reset
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/User/all-users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-6">
      {/* جدول المستخدمين */}
      <UserTable
        data={paginated}
        onAddClick={() => setShowForm(true)}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onResetPasswordClick={(user) => setResetPasswordUserId(user.id)} // 🔥 مربوطة هون
      />

      {/* مودال الإضافة */}
      <AddUserForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchUsers}
      />

      {/* مودال إعادة تعيين كلمة السر */}
      <ResetPasswordModal
        isOpen={!!resetPasswordUserId}
        onClose={() => setResetPasswordUserId(null)}
        userId={resetPasswordUserId || ""}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default UserList;
