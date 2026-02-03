const ProductCardSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="flex gap-x-8 gap-y-16 justify-between flex-wrap animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
        >
          <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="flex justify-between">
            <div className="w-28 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-24 h-9 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
