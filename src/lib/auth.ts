import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { logAction } from "./audit";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "c97efeaf4061c24b771c97663c4fafd8",
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // Inject user data into JWT on sign-in
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role?: string }).role;
        token.company_id = (user as { company_id?: string }).company_id;
        token.avatar_url = (user as { avatar_url?: string }).avatar_url;
      }
      return token;
    },
    // Expose token data in the session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { company_id?: string }).company_id = token.company_id as string;
        (session.user as { avatar_url?: string }).avatar_url = token.avatar_url as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: { equals: email, mode: "insensitive" },
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              company_id: true,
              avatar_url: true,
              password: true,
              is_active: true,
            },
          });

          if (!user || !user.is_active) return null;

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;

          // Log successful login (non-blocking)
          logAction({
            company_id: user.company_id,
            user_id: user.id,
            action: "LOGIN",
            resource: "User",
            resource_id: user.id,
          });

          // Return user WITHOUT password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            company_id: user.company_id,
            avatar_url: user.avatar_url,
          };
        } catch (err) {
          console.error("[NextAuth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
};
