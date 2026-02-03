import { auth } from "@/auth";
import Link from "next/link";
import CartIcon from "./CartIcon";
import DashboardIcon from "./DashboardIcon";
import NotificationIcon from "./NotificationIcon";
import ProfileIcon from "./ProfileIcon";
import WhishListIcon from "./WhishListIcon";

const NavIcons = async () => {
  const user = await auth();
  const cartHref = user?.user ? "/cart" : "/signin?callbackUrl=/cart";
  const isAdmin = (user?.user as any)?.role === "admin";
  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {user?.user ? <ProfileIcon /> : <Link href={"/signin"} className="hover:text-nazim transition-colors">Login</Link>}
      {user?.user && <NotificationIcon />}
      <Link href={"/wishlist"}>
        {user?.user && <WhishListIcon />}
      </Link>
      <Link href={cartHref}>
        {user?.user && <CartIcon isLoggedIn={!!user?.user} />}
      </Link>
      {isAdmin && (
        <Link href="/admin">
          <DashboardIcon />
        </Link>
      )}
    </div>
  );
};

export default NavIcons;
