import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
  }
  interface Session {
    user: {
      id?: string;
      email?: string;
      username?: string;
      image?: string | null;
    };
  }
}
