import Image from "next/image";

const NotificationIcon = () => {
  return (
    <div className="relative w-5 h-5 md:w-6 md:h-6 cursor-pointer">
      <Image
        src="/notification.png"
        alt=""
        fill
        className="object-contain"
      />
    </div>
  );
};

export default NotificationIcon;
