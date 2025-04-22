import React from "react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import RepeatableWorkscopeList from "../RepeatableWorkscopeList";

interface StepWorkscopeProps {
  data: any;
  onChange: (newData: any) => void;
  userOptions: { value: string; label: string }[];
  workscopeOptions: { value: number; label: string }[];
}

const StepWorkscope = ({
  data,
  onChange,
  userOptions,
  workscopeOptions,
}: StepWorkscopeProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    onChange({ ...data, [name]: newValue });
  };

  return (
    <div className="space-y-6">
      {/* ✅ Workscope with details */}
      <RepeatableWorkscopeList
  label="Work Scope"
  options={workscopeOptions.map((opt) => ({
    value: String(opt.value),  // أو نخليه number حسب احتياجك
    text: opt.label,
  }))}
  value={data.workscopes || []}
  onChange={(newList) => onChange({ ...data, workscopes: newList })}
/>

      {/* ✅ Existing Inquiry */}
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          name="isExistingInquiry"
          checked={data.isExistingInquiry || false}
          onChange={handleChange}
        />
        Existing Inquiry
      </label>

      {/* ✅ Measurement Schedule */}
      <DatePicker
        id="measurementScheduleDate"
        placeholder="Measurement Schedule Date"
        onChange={(dates: Date[]) => {
          const selected = dates[0]?.toISOString();
          onChange({ ...data, measurementScheduleDate: selected });
        }}
        defaultDate={data.measurementScheduleDate || undefined}
      />

      {/* ✅ Measurement Provided By Customer */}
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          name="isMeasurementProvidedByCustomer"
          checked={data.isMeasurementProvidedByCustomer || false}
          onChange={handleChange}
        />
        Measurement Provided By Customer?
      </label>

      {/* ✅ Measurement Assigned To */}
      <Select
        options={userOptions}
        placeholder="Measurement Assigned To"
        defaultValue={data.measurementAssignedTo || ""}
        onChange={(value: string) =>
          onChange({ ...data, measurementAssignedTo: value })
        }
      />

      {/* ✅ Design Provided By Customer */}
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          name="isDesignProvidedByCustomer"
          checked={data.isDesignProvidedByCustomer || false}
          onChange={handleChange}
        />
        Design Provided By Customer?
      </label>

      {/* ✅ Inquiry Description */}
      <TextArea
        placeholder="Inquiry Description"
        value={data.inquiryDescription || ""}
        onChange={(val) => onChange({ ...data, inquiryDescription: val })}
      />
    </div>
  );
};

export default StepWorkscope;
