import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

const NavIcons = dynamic(() => import("./NavIcons"));

const Navbar = () => {
  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">Buyly</div>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Menu />
        </div>
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-2xl tracking-wide">Buyly</div>
          </Link>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <LanguageSwitcher />
          <ThemeToggle />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
