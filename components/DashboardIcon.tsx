import Image from "next/image";

const DashboardIcon = () => {
  return (
    <div className="flex justify-center items-center gap-1 border border-1 dark:border-gray-600 p-2 rounded-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="relative w-5 h-5 md:w-6 md:h-6">
        <Image src="/lock.png" alt="" fill className="object-contain dark:invert" />
      </div>
      <span className="text-sm md:text-base">Dashboard</span>
    </div>
  );
};

export default DashboardIcon;
