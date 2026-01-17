import Link from "next/link";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-pink-50 p-8 rounded-full mb-8">
                <FileQuestion size={100} className="text-nazim" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 tracking-tighter">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
                Oops! Page Not Found
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="bg-nazim text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    Return Home
                </Link>
                <Link
                    href="/list"
                    className="bg-white text-gray-700 px-8 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-all shadow-md active:scale-95"
                >
                    Explore Shop
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
