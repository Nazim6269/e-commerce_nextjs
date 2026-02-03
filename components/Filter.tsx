"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
  categories: { name: string; slug: string }[];
}

const Filter = ({ categories }: FilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams.toString());

    if (name === "type") {
      if (value === "Type") {
        params.delete("type");
      } else {
        params.set("type", value);
      }
    } else if (name === "min" || name === "max") {
      const priceValue = parseFloat(value);
      if (isNaN(priceValue) || value.trim() === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
    } else if (name === "cat") {
      if (value === "Category") {
        params.delete("cat");
      } else {
        params.set("cat", value);
      }
    } else if (name === "sort") {
      if (value === "Sort By") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-6 flex-wrap">
        <select
          name="type"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] dark:bg-gray-800 dark:text-white outline-none"
          onChange={handleFilterChange}
          value={searchParams.get("type") || "Type"}
        >
          <option>Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>
        <input
          type="number"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400 dark:ring-gray-600 outline-none bg-transparent dark:text-white"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("min") || ""}
        />
        <input
          type="number"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400 dark:ring-gray-600 outline-none bg-transparent dark:text-white"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("max") || ""}
        />

        <select
          name="cat"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] dark:bg-gray-800 dark:text-white outline-none"
          onChange={handleFilterChange}
          value={searchParams.get("cat") || "Category"}
        >
          <option>Category</option>
          {categories?.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={clearFilters}
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-nazim text-white hover:bg-pink-600 transition-all shadow-sm"
        >
          Clear Filters
        </button>
      </div>
      <div className="">
        <select
          name="sort"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-white dark:bg-gray-800 dark:text-white ring-1 ring-gray-400 dark:ring-gray-600 outline-none"
          onChange={handleFilterChange}
          value={searchParams.get("sort") || "Sort By"}
        >
          <option>Sort By</option>
          <option value="asc-price">Price (low to high)</option>
          <option value="desc-price">Price (high to low)</option>
          <option value="asc-lastUpdated">Newest</option>
          <option value="desc-lastUpdated">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
