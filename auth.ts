import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import client from "./lib/db";
import { findUserFromDB } from "./lib/dbQuery";
import {
  githubId,
  githubSecret,
  googleClientId,
  googleSecret,
  nextAuthSecret,
} from "./secret";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "string", placeholder: "Test" },
        email: {
          label: "email",
          type: "string",
          placeholder: "test@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
        },
        confirmPassword: { label: "password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        if (credentials === null) return null;
        if (!credentials.email || !credentials.password) return null;

        try {
          const user = await findUserFromDB(credentials.email);
          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isMatch) {
              return {
                id: (user._id as any).toString(),
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
              };
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (error) {
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any)._id?.toString() || (user as any).id;
        // Fetch role from DB directly — the adapter strips custom fields
        const dbUser = await findUserFromDB(token.email!);
        token.role = dbUser?.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: nextAuthSecret,
});
