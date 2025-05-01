import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";

interface EditUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser: UserFormData | null;
}

interface Role {
  id: string;
  name: string;
}

interface Branch {
  id: number;
  name: string;
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

const EditUserForm = ({ isOpen, onClose, onSuccess, editingUser }: EditUserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "",
    branchId: "",
    isNotificationEnabled: false,
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get("/Role/all").then((res) => setRoles(res.data));
    axios.get("/Branch/all").then((res) => setBranches(res.data));
  }, []);

  useEffect(() => {
    if (editingUser) {
      setFormData({ ...editingUser });
    }
  }, [editingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UserFormData) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    //if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.roleId) errors.roleId = "Role is required";
    if (!formData.branchId) errors.branchId = "Branch is required";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await axios.put(`/user/${formData.id}`, formData);
      toast.success("User updated successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to update user.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit User</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm w-8 h-8"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 md:gap-6">
              <div>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                {submitted && formErrors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                {submitted && formErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>
              <div>
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                {/* {submitted && formErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                )} */}
              </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div>
                <Select
                  options={roles.map((r) => ({ value: r.id.toString(), label: r.name }))}
                  placeholder="Select Role"
                  onChange={(value) =>
                    setFormData((prev: UserFormData) => ({ ...prev, roleId: value }))
                  }
                  defaultValue={formData.roleId}
                />
                {submitted && formErrors.roleId && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.roleId}</p>
                )}
              </div>
              <div>
                <Select
                  options={branches.map((b) => ({ value: b.id.toString(), label: b.name }))}
                  placeholder="Select Branch"
                  onChange={(value) =>
                    setFormData((prev: UserFormData) => ({ ...prev, branchId: value }))
                  }
                  defaultValue={formData.branchId}
                />
                {submitted && formErrors.branchId && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.branchId}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-gray-100 dark:bg-gray-700">
              <label htmlFor="notifToggle" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Enable Notifications
              </label>
              <button
                type="button"
                id="notifToggle"
                role="switch"
                aria-checked={formData.isNotificationEnabled}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isNotificationEnabled: !prev.isNotificationEnabled,
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  formData.isNotificationEnabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isNotificationEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <Button className="w-full" size="sm">Update User</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
