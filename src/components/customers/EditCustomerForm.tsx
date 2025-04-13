import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import axios from "../utils/axios";
import DatePicker from "../form/date-picker";
import type { CustomerData } from "@/types/customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCustomer: CustomerData | null;
}

const EditCustomerForm = ({ isOpen, onClose, onSuccess, editingCustomer }: Props) => {
  const [formData, setFormData] = useState<CustomerData | null>(null);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    }
  }, [editingCustomer]);

  useEffect(() => {
    axios.get("/user/all-users").then((res) => {
      setUserOptions(res.data);
    });
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => (prev ? { ...prev, [name]: updatedValue } : null));
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0 && formData) {
      const formattedDate = selectedDates[0].toISOString().split("T")[0];
      setFormData({ ...formData, customerNextMeetingDate: formattedDate });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await axios.put("/customer/update", {
        ...formData,
        contactStatus: Number(formData.contactStatus),
        wayOfContact: Number(formData.wayOfContact),
      });

      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to update customer.");
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Customer</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" />
              <Input type="email" name="customerEmail" value={formData.customerEmail || ""} onChange={handleChange} placeholder="Email" />
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerContact" value={formData.customerContact} onChange={handleChange} placeholder="Phone" />
              <Input name="customerWhatsapp" value={formData.customerWhatsapp || ""} onChange={handleChange} placeholder="WhatsApp" />
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerAddress" value={formData.customerAddress || ""} onChange={handleChange} placeholder="Address" />
              <Input name="customerCity" value={formData.customerCity || ""} onChange={handleChange} placeholder="City" />
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerCountry" value={formData.customerCountry || ""} onChange={handleChange} placeholder="Country" />
              <Input name="customerNationality" value={formData.customerNationality || ""} onChange={handleChange} placeholder="Nationality" />
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <Select
                options={userOptions}
                placeholder="Assigned To"
                onChange={(value) => setFormData((prev) => prev ? { ...prev, customerAssignedTo: value } : null)}
                defaultValue={formData.customerAssignedTo}
              />
              <DatePicker
              id="customerNextMeetingDate"
              placeholder="Next Meeting Date"
              onChange={handleDateChange}
              defaultDate={formData.customerNextMeetingDate || undefined}/>



            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <Select
                options={[
                  { value: "1", label: "Phone" },
                  { value: "2", label: "WhatsApp" },
                  { value: "3", label: "Email" },
                  { value: "4", label: "Facebook" },
                  { value: "5", label: "Instagram" },
                  { value: "6", label: "Google" },
                  { value: "7", label: "Twitter" },
                  { value: "8", label: "Walk In" },
                  { value: "9", label: "Friend Recommendation" },
                ]}
                placeholder="Way of Contact"
                onChange={(value) => setFormData((prev) => prev ? { ...prev, wayOfContact: value } : null)}
                defaultValue={formData.wayOfContact}
              />
              <Select
                options={[
                  { value: "1", label: "Contacted" },
                  { value: "2", label: "Need to Contact" },
                  { value: "3", label: "Need to Follow Up" },
                  { value: "4", label: "Not Responding" },
                ]}
                placeholder="Contact Status"
                onChange={(value) => setFormData((prev) => prev ? { ...prev, contactStatus: value } : null)}
                defaultValue={formData.contactStatus}
              />
            </div>
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isVisitedShowroom}
                  onChange={(e) =>
                    setFormData((prev) => prev ? {
                      ...prev,
                      isVisitedShowroom: e.target.checked,
                      customerTimeSpent: e.target.checked ? 0 : 0,
                    } : null)
                  }
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600" />
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Visited Showroom?
                </span>
              </label>

              {formData.isVisitedShowroom && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Time Spent (minutes)
                  </label>
                  <div className="relative flex items-center max-w-[8rem]">
                    <button
                      type="button"
                      className="bg-gray-100 dark:bg-gray-700 border border-gray-300 rounded-s-lg p-3 h-11 dark:border-gray-600 hover:bg-gray-200"
                      onClick={() =>
                        setFormData((prev) => prev ? {
                          ...prev,
                          customerTimeSpent: Math.max(0, prev.customerTimeSpent - 1),
                        } : null)
                      }
                    >
                      <svg className="w-3 h-3 text-gray-900 dark:text-white" viewBox="0 0 18 2">
                        <path d="M1 1h16" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      name="customerTimeSpent"
                      value={formData.customerTimeSpent}
                      onChange={(e) =>
                        setFormData((prev) => prev ? { ...prev, customerTimeSpent: Number(e.target.value) } : null)
                      }
                      className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      type="button"
                      className="bg-gray-100 dark:bg-gray-700 border border-gray-300 rounded-e-lg p-3 h-11 dark:border-gray-600 hover:bg-gray-200"
                      onClick={() =>
                        setFormData((prev) => prev ? {
                          ...prev,
                          customerTimeSpent: prev.customerTimeSpent + 1,
                        } : null)
                      }
                    >
                      <svg className="w-3 h-3 text-gray-900 dark:text-white" viewBox="0 0 18 18">
                        <path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <TextArea
              placeholder="Notes"
              value={formData.customerNotes || ""}
              onChange={(val) => setFormData((prev) => prev ? { ...prev, customerNotes: val } : null)}
            />
            <Button className="w-full" size="sm">Update Customer</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerForm;
