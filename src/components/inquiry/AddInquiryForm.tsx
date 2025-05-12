import { useState, useEffect } from "react";
import StepCustomer from "@/components/inquiry/Steps/StepCustomer";
import StepBuilding from "./Steps/StepBuilding";
import StepWorkscope from "@/components/inquiry/Steps/StepWorkscope";
import Button from "../ui/button/Button";
import axios from "@/components/utils/axios";
import { UserIcon, HomeIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { UserDto } from "@/types/UserDto";
import { toast } from 'react-hot-toast';

const steps = [
  { title: "Customer Information", icon: <UserIcon className="w-5 h-5 inline-block mr-1" /> },
  { title: "Building Details", icon: <HomeIcon className="w-5 h-5 inline-block mr-1" /> },
  { title: "Inquiry Details", icon: <ClipboardIcon className="w-5 h-5 inline-block mr-1" /> },
];

const initialFormState = {
  customerId: undefined,
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
  buildingAddress: "",
  buildingTypeOfUnit: null,
  buildingCondition: null,
  buildingFloor: "",
  buildingReconstruction: false,
  isOccupied: false,
  buildingMakaniMap: "",
  buildingLatitude: "",
  buildingLongitude: "",
  workscopes: [],
  isMeasurementProvidedByCustomer: false,
  isDesignProvidedByCustomer: false,
  measurementScheduleDate: null,
  measurementAssignedTo: "",
  inquiryDescription: "",
  inquiryName: ""
};

const AddInquiryForm = ({ isOpen, onClose, onSuccess }: any) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ ...initialFormState });
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [workscopeOptions, setWorkscopeOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    axios.get("/user/by-branch").then((res) => setUsers(res.data));
    axios.get("/workscope/all").then((res) => {
      const mapped = res.data.map((w: any) => ({
        value: w.workScopeId,
        label: w.workScopeName,
      }));
      setWorkscopeOptions(mapped);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ ...initialFormState });
      setStep(0);
    }
  }, [isOpen]);

  const validateStep = () => {
    switch (step) {
      case 0:
        return (
          formData.customerName.trim() &&
          formData.customerContact.trim().length === 10
        );
      case 1:
        return (
          formData.buildingAddress.trim() !== "" &&
          formData.buildingTypeOfUnit != null &&
          formData.buildingCondition != null
        );
      case 2:
        return Array.isArray(formData.workscopes) && formData.workscopes.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error("Please complete the required fields before continuing.");
      return;
    }
    if (step < steps.length - 1) setStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post("/inquiry/create", formData);
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepCustomer data={formData} setData={setFormData} users={users} />;
      case 1:
        return <StepBuilding data={formData} onChange={setFormData} />;
      case 2:
        return (
          <StepWorkscope
            data={formData}
            onChange={setFormData}
            userOptions={users.map((u) => ({ value: u.id, label: u.fullName }))}
            workscopeOptions={workscopeOptions}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50">
      <div className="relative p-4 w-full max-w-3xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {steps[step].icon}
              {steps[step].title}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">{renderStep()}</div>

          <div className="flex justify-between p-4 border-t dark:border-gray-600">
            <div>{step > 0 && <Button onClick={handleBack} size="sm">Back</Button>}</div>
            <Button onClick={handleNext} size="sm" disabled={submitting}>
              {step === steps.length - 1 ? "Submit Inquiry" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInquiryForm;
