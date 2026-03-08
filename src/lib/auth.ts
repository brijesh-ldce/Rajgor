import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please provide both email and password.");
        }

        const email = credentials.email.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
          throw new Error("Incorrect email or password.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect email or password.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isApproved: user.isApproved,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isApproved = user.isApproved;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isApproved = token.isApproved as boolean;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
};
