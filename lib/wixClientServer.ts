import { wixClientId } from "@/secret";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { cookies } from "next/headers";

export const wixClientServer = async () => {
  let refreshToken;

  try {
    const cookieStore = await cookies();
    refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}");
  } catch (error) {
    console.log(error);
  }

  if (!wixClientId) {
    console.error("NEXT_PUBLIC_WIX_CLIENT_ID is not defined");
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
    },
    auth: OAuthStrategy({
      clientId: wixClientId || "",
      tokens: {
        refreshToken,
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });

  return wixClient;
};
