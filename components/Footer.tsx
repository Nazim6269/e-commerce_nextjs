import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <div className="py-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm mt-24">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/">
            <div className="text-2xl tracking-wide">Buyly</div>
          </Link>
          <p>
            North Badda, Tatul Tola Road, Dhaka - 1212, Bangladesh
          </p>
          <span className="font-semibold">nazimdev100220001@gmail.com</span>
          <span className="font-semibold">+880 1518-373269</span>
          <div className="flex gap-6">
            <Link href="https://portfolio-nextjs-one-tau.vercel.app/" target="_blank" className="hover:text-nazim transition-colors">
              <Globe size={20} />
            </Link>
            <Link href="https://www.linkedin.com/in/nazim-uddin-23a93a216/" target="_blank" className="hover:text-nazim transition-colors">
              <Linkedin size={20} />
            </Link>
            <Link href="https://github.com/Nazim6269" target="_blank" className="hover:text-nazim transition-colors">
              <Github size={20} />
            </Link>
          </div>
        </div>
        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">COMPANY</h1>
            <div className="flex flex-col gap-6">
              <Link href="/" className="hover:text-nazim transition-colors">About Us</Link>
              <Link href="/" className="hover:text-nazim transition-colors">Careers</Link>
              <Link href="/" className="hover:text-nazim transition-colors">Affiliates</Link>
              <Link href="/" className="hover:text-nazim transition-colors">Blog</Link>
              <Link href="/" className="hover:text-nazim transition-colors">Contact Us</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">SHOP</h1>
            <div className="flex flex-col gap-6">
              <Link href="/list?cat=new-arrival" className="hover:text-nazim transition-colors">New Arrivals</Link>
              <Link href="/list?cat=accessories" className="hover:text-nazim transition-colors">Accessories</Link>
              <Link href="/list?cat=men" className="hover:text-nazim transition-colors">Men</Link>
              <Link href="/list?cat=women" className="hover:text-nazim transition-colors">Women</Link>
              <Link href="/list" className="hover:text-nazim transition-colors">All Products</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">HELP</h1>
            <div className="flex flex-col gap-6">
              <Link href="/" className="hover:text-nazim transition-colors">Customer Service</Link>
              <Link href="/profile" className="hover:text-nazim transition-colors">My Account</Link>
              <Link href="/" className="hover:text-nazim transition-colors">Find a Store</Link>
              <Link href="/" className="hover:text-nazim transition-colors">Legal & Privacy</Link>
              <Link href="/" className="hover:text-nazim transition-colors">Gift Card</Link>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <h1 className="font-medium text-lg">SUBSCRIBE</h1>
          <p>
            Be the first to get the latest news about trends, promotions, and
            much more!
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="Email address"
              className="p-4 w-3/4"
            />
            <button className="w-1/4 bg-nazim text-white">JOIN</button>
          </div>
          <span className="font-semibold">Secure Payments</span>
          <div className="flex justify-between">
            <Image src="/discover.png" alt="" width={40} height={20} />
            <Image src="/skrill.png" alt="" width={40} height={20} />
            <Image src="/paypal.png" alt="" width={40} height={20} />
            <Image src="/mastercard.png" alt="" width={40} height={20} />
            <Image src="/visa.png" alt="" width={40} height={20} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
        <div className="">© {new Date().getFullYear()} All rights reserved by Nazim </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="">
            <span className="text-gray-500 mr-4">Language</span>
            <span className="font-medium">Bangladesh | Bangla</span>
          </div>
          <div className="">
            <span className="text-gray-500 mr-4">Currency</span>
            <span className="font-medium">TK</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
