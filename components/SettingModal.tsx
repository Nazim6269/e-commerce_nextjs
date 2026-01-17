import { doSignOut } from "@/actions/formAction";
import Link from "next/link";

const SettingModal = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex flex-col absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
      <Link href="/profile" onClick={onClick}>
        Profile
      </Link>
      <form action={doSignOut}>
        <button className=" py-2 rounded-md" onClick={onClick}>
          Sign out
        </button>
      </form>
    </div>
  );
};

export default SettingModal;
