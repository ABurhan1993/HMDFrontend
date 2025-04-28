import { useState } from "react";
import Button from "@/components/ui/button/Button";
import axios from "@/components/utils/axios";
import { toast } from 'react-hot-toast';

interface Props {
  availablePermissions: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRoleForm({ availablePermissions, onClose, onSuccess }: Props) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required.");
      return;
    }
  
    try {
      setLoading(true);
      await axios.post("/role/create", {
        roleName,
        claims: selectedPermissions,
      });
      onSuccess(); // 🔥 تحدث القائمة
      onClose();   // 🔥 سكر المودال
    } catch (error) {
      console.error(error);
      toast.error("Failed to create role.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Add New Role</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter role name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</label>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {availablePermissions.map((permission) => (
              <label key={permission} className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2">{permission}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} size="sm" variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} size="sm" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
