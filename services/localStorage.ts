import { CartItemMinimal } from "@/components/Add";

class LocalStorage<T> {
  setProduct(value: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(value));
    // Let client components (e.g. navbar cart badge) react immediately
    window.dispatchEvent(new Event("cart_updated"));
  }

  getProduct(): CartItemMinimal[] | null {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem("cart");
    return item ? (JSON.parse(item) as CartItemMinimal[]) : null;
  }
}

export const cartStorage = new LocalStorage();
