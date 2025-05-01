import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import axios from "../utils/axios";
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface AddUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Role {
  id: string;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  roleId: "",
  branchId: "",
  isNotificationEnabled: false,
};

const AddUserForm = ({ isOpen, onClose, onSuccess }: AddUserFormProps) => {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    axios.get("/Role/all").then((res) => setRoles(res.data));
    axios.get("/Branch/all").then((res) => setBranches(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    //if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 8 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long and contain both letters and numbers.";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post("/User/create", formData);
      setFormData({ ...initialFormState });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to create user.");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({ ...initialFormState });
      setSubmitted(false);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">New User</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 md:gap-6">
              <div>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                {submitted && errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                {submitted && errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div>
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                {/* {submitted && errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>} */}
              </div>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {submitted && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}


            <div className="grid md:grid-cols-2 md:gap-6">
              <div>
                <Select
                  options={roles.map((r: Role) => ({ value: r.id.toString(), label: r.name }))}
                  placeholder="Select Role"
                  onChange={(value) => setFormData((prev) => ({ ...prev, roleId: value }))}
                  defaultValue={formData.roleId}
                />
                {submitted && !formData.roleId && (
                  <p className="text-red-500 text-xs mt-1">Role is required.</p>
                )}
              </div>
              <div>
                <Select
                  options={branches.map((b: Branch) => ({ value: b.id.toString(), label: b.name }))}
                  placeholder="Select Branch"
                  onChange={(value) => setFormData((prev) => ({ ...prev, branchId: value }))}
                  defaultValue={formData.branchId}
                />
                {submitted && !formData.branchId && (
                  <p className="text-red-500 text-xs mt-1">Branch is required.</p>
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${formData.isNotificationEnabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isNotificationEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            <Button className="w-full" size="sm">Save User</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
