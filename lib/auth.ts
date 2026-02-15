import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

// Ensure environment variables are set
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

if (!NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set. Please add NEXTAUTH_SECRET to your .env.local file.');
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      verified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    verified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    verified: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (user.suspended) {
          throw new Error('Your account has been suspended');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role,
          verified: user.verified,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.verified = user.verified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.verified = token.verified;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};
