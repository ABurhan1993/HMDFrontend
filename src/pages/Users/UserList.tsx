import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import UserTable from "@/components/users/UserTable";
import AddUserForm from "@/components/users/AddUserForm";
import ResetPasswordModal from "@/components/users/ResetPasswordModal";
import EditUserForm from "@/components/users/EditUserForm";
import UserClaimsModal from "@/components/users/UserClaimModal";
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  roleName: string;
  branchName: string;
}

interface UserFormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  branchId: string;
  isNotificationEnabled: boolean;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [claimsModalOpen, setClaimsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const perPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/User/all-users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/user/${userToDelete.id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
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
      <UserTable
        data={paginated}
        onAddClick={() => setShowForm(true)}
        onEditClick={async (user) => {
          try {
            const res = await axios.get(`/user/${user.id}`);
            setSelectedUser(res.data);
            setIsEditOpen(true);
          } catch (err) {
            toast.error("Failed to load user details.");
          }
        }}
        onDeleteClick={handleDeleteUser}
        onPermissionsClick={(user) => {
          setSelectedUserId(user.id);
          setClaimsModalOpen(true);
        }}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onResetPasswordClick={(user) => setResetPasswordUserId(user.id)}
      />

      <AddUserForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchUsers}
      />

      <ResetPasswordModal
        isOpen={!!resetPasswordUserId}
        onClose={() => setResetPasswordUserId(null)}
        userId={resetPasswordUserId || ""}
        onSuccess={fetchUsers}
      />

      <EditUserForm
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={fetchUsers}
        editingUser={selectedUser}
      />

      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-4 text-center">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="text-white bg-red-600 hover:bg-red-800 px-5 py-2 rounded-lg text-sm"
                onClick={confirmDelete}
              >
                Yes, I'm sure
              </button>
              <button
                className="px-5 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUserId && (
        <UserClaimsModal
          isOpen={claimsModalOpen}
          onClose={() => setClaimsModalOpen(false)}
          userId={selectedUserId}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserList;
