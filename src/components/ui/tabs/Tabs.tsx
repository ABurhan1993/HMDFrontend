interface TabsProps {
    tabs: string[];
    active: string;
    onChange: (tab: string) => void;
  }
  
  export default function Tabs({ tabs, active, onChange }: TabsProps) {
    return (
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-2 rounded-lg border ${
              active === tab
                ? "bg-brand-500 text-white"
                : "border-gray-300 text-gray-700 dark:text-white/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }
  