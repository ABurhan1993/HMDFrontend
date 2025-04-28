import { useState, useEffect } from "react";
import RoleTable from "@/components/roles/RoleTable";
import AddRoleForm from "@/components/roles/AddRoleForm";
import axios from "@/components/utils/axios";
import EditRoleForm from "@/components/roles/EditRoleForm";
import { toast } from 'react-hot-toast';
import { useUser } from "@/hooks/useUser";

export interface RoleData {
  id: string;
  name: string;
  claims: string[];
}

export default function RoleList() {
  const user = useUser();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const fetchRoles = async () => {
    if (!user?.permissions.includes("Permissions.Roles.View")) {
      toast.error("You don't have permission to view roles.");
      return;
    }
    try {
      const response = await axios.get("/role/all");
      setRoles(response.data);
    } catch {
      toast.error("Failed to fetch roles");
    }
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get("/permission/all");
        setPermissions(response.data);
      } catch (error) {
        console.error("Failed to load permissions", error);
      }
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [user]);

  if (!user?.permissions.includes("Permissions.Roles.View")) {
    return (
      <div className="p-4 text-center text-red-500 font-semibold">
        You don't have permission to view this page.
      </div>
    );
  }

  return (
    <div>
      <RoleTable
        roles={roles}
        onAddClick={() => setIsAddModalOpen(true)}
        onEditClick={(role) => {
          setEditingRole(role);
          setIsEditModalOpen(true);
        }}
      />

      {isAddModalOpen && (
        <AddRoleForm
          availablePermissions={permissions}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchRoles}
        />
      )}

      {isEditModalOpen && editingRole && (
        <EditRoleForm
          editingRole={editingRole}
          availablePermissions={permissions}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={fetchRoles}
        />
      )}
    </div>
  );
}
