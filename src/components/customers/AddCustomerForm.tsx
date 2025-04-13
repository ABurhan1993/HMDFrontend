import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import axios from "../utils/axios";
import DatePicker from "../form/date-picker";

interface AddCustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState = {
  customerName: "",
  customerEmail: "",
  customerContact: "",
  customerWhatsapp: "",
  customerAddress: "",
  customerCity: "",
  customerCountry: "",
  customerNationality: "",
  customerNotes: "",
  customerNextMeetingDate: "",
  isVisitedShowroom: false,
  customerTimeSpent: 0,
  wayOfContact: "1",
  contactStatus: "2",
  customerAssignedTo: "",
  initialComment: "",
};

const AddCustomerForm = ({ isOpen, onClose, onSuccess }: AddCustomerFormProps) => {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [userOptions, setUserOptions] = useState([]);

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
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/customer/create", {
        ...formData,
        contactStatus: Number(formData.contactStatus),
        wayOfContact: Number(formData.wayOfContact),
      });

      setFormData({ ...initialFormState });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to add customer.");
    }
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const formattedDate = selectedDates[0].toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, customerNextMeetingDate: formattedDate }));
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">New Customer</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <span className="sr-only">Close modal</span>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

            {/* الاسم والإيميل */}
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" />
              <Input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="Email" />
            </div>

            {/* الهاتف والواتساب */}
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerContact" value={formData.customerContact} onChange={handleChange} placeholder="Phone" />
              <Input name="customerWhatsapp" value={formData.customerWhatsapp} onChange={handleChange} placeholder="WhatsApp" />
            </div>

            {/* العنوان والمدينة */}
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerAddress" value={formData.customerAddress} onChange={handleChange} placeholder="Address" />
              <Input name="customerCity" value={formData.customerCity} onChange={handleChange} placeholder="City" />
            </div>

            {/* الدولة والجنسية */}
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input name="customerCountry" value={formData.customerCountry} onChange={handleChange} placeholder="Country" />
              <Input name="customerNationality" value={formData.customerNationality} onChange={handleChange} placeholder="Nationality" />
            </div>

            {/* التاريخ فقط */}
            <div className="grid md:grid-cols-2 md:gap-6">
              <Select
                options={userOptions}
                placeholder="Assigned To"
                onChange={(value) => setFormData({ ...formData, customerAssignedTo: value })}
                defaultValue={formData.customerAssignedTo}
              />
              <DatePicker
                id="customerNextMeetingDate"
                placeholder="Next Meeting Date"
                onChange={handleDateChange}
              />
            </div>

            {/* وسيلة التواصل + حالة التواصل */}
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
  onChange={(value) => setFormData({ ...formData, wayOfContact: value })}
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
                onChange={(value) => setFormData({ ...formData, contactStatus: value })}
                defaultValue={formData.contactStatus}
              />
            </div>

            {/* زر التبديل + وقت الزيارة */}
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isVisitedShowroom}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isVisitedShowroom: e.target.checked,
                      customerTimeSpent: e.target.checked ? 0 : 0,
                    }))
                  }
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600" />
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
                        setFormData((prev) => ({
                          ...prev,
                          customerTimeSpent: Math.max(0, prev.customerTimeSpent - 1),
                        }))
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
                        setFormData({ ...formData, customerTimeSpent: Number(e.target.value) })
                      }
                      className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      type="button"
                      className="bg-gray-100 dark:bg-gray-700 border border-gray-300 rounded-e-lg p-3 h-11 dark:border-gray-600 hover:bg-gray-200"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          customerTimeSpent: prev.customerTimeSpent + 1,
                        }))
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

            {/* ملاحظات */}
            <TextArea
              placeholder="Notes"
              value={formData.customerNotes}
              onChange={(val) => setFormData({ ...formData, customerNotes: val })}
            />

            {/* زر الإرسال */}
            <Button className="w-full" size="sm">Save Customer</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerForm;