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
  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {user?.user ? <ProfileIcon /> : <Link href={"/signin"}>Login</Link>}
      {user?.user && <NotificationIcon />}
      <Link href={"/wishlist"}>
        {user?.user && <WhishListIcon />}
      </Link>
      <Link href={cartHref}>
        {user?.user && <CartIcon isLoggedIn={!!user?.user} />}
      </Link>
      {user?.user && <DashboardIcon />}
    </div>
  );
};

export default NavIcons;
