const NotificationSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
