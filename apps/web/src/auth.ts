import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }) as Provider,
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});
