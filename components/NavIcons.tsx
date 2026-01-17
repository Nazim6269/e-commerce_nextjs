import { auth } from "@/auth";
import Link from "next/link";
import CartIcon from "./CartIcon";
import DashboardIcon from "./DashboardIcon";
import NotificationIcon from "./NotificationIcon";
import ProfileIcon from "./ProfileIcon";

const NavIcons = async () => {
  const user = await auth();
  const cartHref = user?.user ? "/cart" : "/signin?callbackUrl=/cart";
  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {user?.user ? <ProfileIcon /> : <Link href={"/signin"}>Login</Link>}
      {user?.user && <NotificationIcon />}
      <Link href={"/wishlist"}>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer w-5 h-5 md:w-6 md:h-6"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
      </Link>
      <Link href={cartHref}>
        {user?.user && <CartIcon isLoggedIn={!!user?.user} />}
      </Link>
      {user?.user && <DashboardIcon />}
    </div>
  );
};

export default NavIcons;
