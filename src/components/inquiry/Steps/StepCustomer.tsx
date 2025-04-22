import { useEffect } from "react";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import axios from "@/components/utils/axios";
import type { UserDto } from "@/types/UserDto";

interface Props {
  data: any;
  setData: (val: any) => void;
  users?: UserDto[];
}

const StepCustomer = ({ data, setData, users = [] }: Props) => {
  const handleDateChange = (dates: Date[]) => {
    if (dates.length > 0) {
      const formatted = dates[0].toISOString().split("T")[0];
      setData((prev: any) => ({ ...prev, customerNextMeetingDate: formatted }));
    }
  };

  useEffect(() => {
    const fetchCustomerByPhone = async () => {
      try {
        const res = await axios.get(`/customer/by-phone?phone=${data.customerContact}`);
        const c = res.data;

        setData((prev: any) => ({
          ...prev,
          customerId: c.customerId,
          customerName: c.customerName,
          customerEmail: c.customerEmail,
          customerWhatsapp: c.customerWhatsapp,
          customerAddress: c.customerAddress,
          customerCity: c.customerCity,
          customerCountry: c.customerCountry,
          customerNationality: c.customerNationality,
          customerNotes: c.customerNotes,
          contactStatus: String(c.contactStatus),
          customerAssignedTo: c.customerAssignedTo || "",
          customerNextMeetingDate: c.customerNextMeetingDate?.split("T")[0] || "",
          wayOfContact: String(c.wayOfContact),
          isVisitedShowroom: c.isVisitedShowroom,
          customerTimeSpent: c.customerTimeSpent || 0,
        }));
      } catch (err) {
        // ignore
      }
    };

    if (data.customerContact.startsWith("971") && data.customerContact.length === 12) {
      fetchCustomerByPhone();
    }
  }, [data.customerContact]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="customerContact"
          value={data.customerContact}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerContact: e.target.value }))}
          placeholder="Customer Number e.g. 971555555555"
          required
        />
        <Input
          name="customerName"
          value={data.customerName}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerName: e.target.value }))}
          placeholder="Customer Name"
          required
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="customerEmail"
          value={data.customerEmail}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerEmail: e.target.value }))}
          placeholder="Email"
        />
        <Input
          name="customerWhatsapp"
          value={data.customerWhatsapp}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerWhatsapp: e.target.value }))}
          placeholder="WhatsApp"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="customerAddress"
          value={data.customerAddress}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerAddress: e.target.value }))}
          placeholder="Address"
        />
        <Input
          name="customerCity"
          value={data.customerCity}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerCity: e.target.value }))}
          placeholder="City"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="customerCountry"
          value={data.customerCountry}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerCountry: e.target.value }))}
          placeholder="Country"
        />
        <Input
          name="customerNationality"
          value={data.customerNationality}
          onChange={(e) => setData((prev: any) => ({ ...prev, customerNationality: e.target.value }))}
          placeholder="Nationality"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Select
          options={users.map((u) => ({ value: u.id, label: u.fullName }))}
          placeholder="Assigned To"
          onChange={(value) => setData((prev: any) => ({ ...prev, customerAssignedTo: value }))}
          value={data.customerAssignedTo}
        />
        <DatePicker
          id="customerNextMeetingDate"
          placeholder="Next Meeting Date"
          onChange={handleDateChange}
          defaultDate={data.customerNextMeetingDate || undefined}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
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
          onChange={(value) => setData((prev: any) => ({ ...prev, wayOfContact: value }))}
          value={data.wayOfContact}
        />
        <Select
          options={[
            { value: "1", label: "Contacted" },
            { value: "2", label: "Need to Contact" },
            { value: "3", label: "Need to Follow Up" },
            { value: "4", label: "Not Responding" },
          ]}
          placeholder="Contact Status"
          onChange={(value) => setData((prev: any) => ({ ...prev, contactStatus: value }))}
          value={data.contactStatus}
        />
      </div>
      <TextArea
        placeholder="Notes"
        value={data.customerNotes}
        onChange={(val) => setData((prev: any) => ({ ...prev, customerNotes: val }))}
      />
    </div>
  );
};

export default StepCustomer;
