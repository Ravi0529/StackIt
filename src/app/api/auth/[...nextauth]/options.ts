import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { randomBytes } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials: any) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });

          if (!user) {
            throw new Error("Incorrect email or password");
          }

          if (
            user &&
            (await bcrypt.compare(credentials?.password, user.password))
          ) {
            return user;
          }
          throw new Error("Incorrect email or password");
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Unknown error occurred during authorization.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) {
          throw new Error(
            "No email associated with this Google account. Please make your email public or use another sign-in method."
          );
        }
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
        if (!existingUser) {
          let username = user.name
            ? user.name.replace(/\s+/g, "").toLowerCase()
            : user.email?.split("@")[0] || "user";
          let uniqueUsername = username;
          let count = 1;
          while (
            await prisma.user.findUnique({
              where: { username: uniqueUsername },
            })
          ) {
            uniqueUsername = `${username}${count}`;
            count++;
          }
          const randomPassword = randomBytes(16).toString("hex");
          await prisma.user.create({
            data: {
              username: uniqueUsername,
              email: user.email,
              password: randomPassword,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      if (!token.username && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email as string,
          },
        });
        if (dbUser) {
          token.username = dbUser.username;
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { username?: string }).username =
          token.username as string;
        (session.user as { email?: string }).email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
