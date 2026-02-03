const CategorySkeleton = () => {
  return (
    <div className="px-4 overflow-x-hidden">
      <div className="flex gap-4 md:gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
          >
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="mt-8 w-3/4 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySkeleton;
