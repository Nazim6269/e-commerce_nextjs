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
      <NotificationIcon />
      <Link href={cartHref}>
        <CartIcon />
      </Link>
      <DashboardIcon />
    </div>
  );
};

export default NavIcons;
