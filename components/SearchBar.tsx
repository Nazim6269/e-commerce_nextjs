"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (name) {
      router.push(`/list?name=${name}`);
    }
  };
  return (
    <form
      className="flex items-center justify-between gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-md flex-1"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        name="name"
        placeholder="Search your Products..."
        className="flex-1 bg-transparent outline-none dark:text-white dark:placeholder-gray-400"
      />
      <button className="cursor-pointer">
        <Image src="/search.png" alt="" width={16} height={16} className="dark:invert" />
      </button>
    </form>
  );
};

export default SearchBar;
