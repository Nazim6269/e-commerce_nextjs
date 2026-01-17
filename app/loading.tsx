const Loading = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-white/80 fixed inset-0 z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-nazim border-t-transparent rounded-full animate-spin"></div>
                <p className="text-nazim font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
