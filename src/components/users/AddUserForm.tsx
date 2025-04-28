import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import axios from "../utils/axios";
import { toast } from 'react-hot-toast';

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
};

const AddUserForm = ({ isOpen, onClose, onSuccess }: AddUserFormProps) => {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (!isOpen) setFormData({ ...initialFormState });
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
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* الاسم الأول والأخير */}
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name"/>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>

            {/* الإيميل والهاتف */}
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
            </div>

            {/* كلمة المرور */}
            <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />

            {/* الدور والفرع */}
            <div className="grid md:grid-cols-2 md:gap-6">
            <Select
  options={roles.map((r: Role) => ({ value: r.id.toString(), label: r.name }))}
  placeholder="Select Role"
  onChange={(value) => setFormData((prev) => ({ ...prev, roleId: value }))}
  defaultValue={formData.roleId}
/>

<Select
  options={branches.map((b: Branch) => ({ value: b.id.toString(), label: b.name }))}
  placeholder="Select Branch"
  onChange={(value) => setFormData((prev) => ({ ...prev, branchId: value }))}
  defaultValue={formData.branchId}
/>
            </div>

            <Button className="w-full" size="sm">Save User</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
