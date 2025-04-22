import { useState } from "react";

interface WorkscopeOption {
    value: string;
    text: string;
  }
  

  interface WorkscopeEntry {
    workscopeId: number;
    inquiryWorkscopeDetailName: string;
  }
  

interface Props {
    label?: string;
    options: WorkscopeOption[];
  value: WorkscopeEntry[];
  onChange: (value: WorkscopeEntry[]) => void;
}

const RepeatableWorkscopeList: React.FC<Props> = ({ options, value, onChange }) => {
  const [selectedWorkscopeId, setSelectedWorkscopeId] = useState("");
  const [detailName, setDetailName] = useState("");

  const handleAdd = () => {
  if (!selectedWorkscopeId || !detailName) return;

  const newEntry = {
    workscopeId: parseInt(selectedWorkscopeId),
    inquiryWorkscopeDetailName: detailName,
  };

  onChange([...value, newEntry]);
  setSelectedWorkscopeId("");
  setDetailName("");
};


  const handleDelete = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Workscope</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={selectedWorkscopeId}
            onChange={(e) => setSelectedWorkscopeId(e.target.value)}
          >
            <option value="">Select</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.text}</option>

            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Detail Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={detailName}
            onChange={(e) => setDetailName(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((entry, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md"
            >
              <p className="text-sm text-gray-800 dark:text-white">
  {options.find((o) => parseInt(o.value) === entry.workscopeId)?.text} - {entry.inquiryWorkscopeDetailName}
</p>

              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepeatableWorkscopeList;
