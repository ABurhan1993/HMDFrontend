import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import { CalenderIcon } from "@/icons"; // عدّل المسار حسب مكان الأيقونات

interface Props {
  id: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

const DateTimePicker = ({ id, value, onChange, placeholder }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const picker = flatpickr(inputRef.current!, {
      enableTime: true,
      time_24hr: true,
      dateFormat: "Y-m-d\\TH:i:00", // هذا التنسيق يلي الباك بيحبه
      allowInput: true,
      closeOnSelect: false,
      defaultDate: value?.endsWith("Z") ? value.slice(0, -1) : value,
      onValueUpdate: (_, str) => {
        // str هي القيمة النصية تماماً مثل ما شايفها المستخدم
        if (onChange) onChange(str);
      }
    });
  
    return () => picker.destroy();
  }, [value, onChange]);
  
  

  return (
    <div className="relative">
      <input
        id={id}
        ref={inputRef}
        defaultValue={value}
        placeholder={placeholder || "YYYY-MM-DD HH:MM"}
        className="h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <CalenderIcon className="size-5" />
      </span>
    </div>
  );
};

export default DateTimePicker;
