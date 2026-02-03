import { wixClientServer } from "@/lib/wixClientServer";
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://buyly.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/list`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const wixClient = await wixClientServer();
    const products = await wixClient.products
      .queryProducts()
      .limit(100)
      .find();

    productPages = (products.items || []).map((product) => ({
      url: `${BASE_URL}/${product.slug}`,
      lastModified: product.lastUpdated
        ? new Date(product.lastUpdated)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to generate product sitemap:", error);
  }

  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const wixClient = await wixClientServer();
    const collections = await wixClient.collections
      .queryCollections()
      .find();

    categoryPages = (collections.items || []).map((collection) => ({
      url: `${BASE_URL}/list?cat=${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to generate category sitemap:", error);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
