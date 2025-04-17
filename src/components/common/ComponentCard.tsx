interface ComponentCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  contentAlign?: "top" | "center"; // ← الجديد
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  contentAlign = "center", // ← القيمة الافتراضية
}) => {
  // نحدد الكلاسات حسب الاتجاه المطلوب
  // const contentAlignmentClass =
  //   contentAlign === "top"
  //     ? "items-start justify-start"
  //     : "items-center justify-center";

  return (
    <div
  className={`flex flex-col aspect-[1/1] min-h-[140px] sm:min-h-[120px] max-h-[160px] p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
>
      <div className="text-center text-sm sm:text-base font-medium text-gray-800 dark:text-white leading-tight break-words">
        {title}
      </div>

      {desc && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">{desc}</p>
      )}

<div className={`flex-1 flex justify-center ${contentAlign === "top" ? "items-start" : "items-center"}`}>
{children}</div>
    </div>
  );
};

export default ComponentCard;
