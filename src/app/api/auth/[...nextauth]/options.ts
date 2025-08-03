import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error("Incorrect email or password");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect email or password");
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error(error);
          throw new Error("Login failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) {
          throw new Error("Google account must have a public email.");
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const baseUsername = user.name
            ? user.name.replace(/\s+/g, "").toLowerCase()
            : user.email.split("@")[0];
          let uniqueUsername = baseUsername;
          let count = 1;
          while (
            await prisma.user.findUnique({
              where: { username: uniqueUsername },
            })
          ) {
            uniqueUsername = `${baseUsername}${count++}`;
          }

          const randomPassword = randomBytes(16).toString("hex");

          await prisma.user.create({
            data: {
              email: user.email,
              username: uniqueUsername,
              password: randomPassword,
              image: user.image ?? null,
              role: "USER",
            },
          });
        } else {
          if (user.image && existingUser.image !== user.image) {
            await prisma.user.update({
              where: { email: user.email },
              data: { image: user.image },
            });
          }
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }

      if (!token.username && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            id: true,
            username: true,
            image: true,
            role: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.image = dbUser.image;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
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
