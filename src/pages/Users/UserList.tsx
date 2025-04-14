import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import UserTable from "@/components/users/UserTable";
import AddUserForm from "@/components/users/AddUserForm";

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
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/User/all-users");
      setUsers(res.data);
    } catch {
      alert("Failed to fetch users");
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
      />

      {/* مودال الإضافة */}
      <AddUserForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default UserList;
