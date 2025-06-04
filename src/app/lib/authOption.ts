import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/app/lib/database'; // Adjust the import path as necessary
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { NextAuthOptions } from 'next-auth';
import 'mongodb';
import { getDB } from '@/app/lib/database'; 
import type { SessionStrategy } from "next-auth";


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing required environment variables for auth");
}

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'dsaVault', // Specify your existing database name here
  }),
    session: {
        strategy: "jwt" as SessionStrategy, 
    },
    callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // You can perform checks here

      // Example: allow sign in only for specific email domain
      const usersLocalCollection=(await getDB()).collection("userslocal");
      const existingUser = await usersLocalCollection.findOne({ email: user.email });
        if (existingUser) {

            return true; // Allow sign in
        } else {
            // Optionally, you can create a new user entry here
            await usersLocalCollection.insertOne({
        email: profile?.email,
        name: profile?.name,         // ✅ Now `name` is available
        picture: account?.picture,   // Optional
        rooms: [],
        questions: [],
        friends:[],
        createdAt: new Date(),
      });
            return true; // Allow sign in for new users
        }

      // Or run DB logic
      // await db.users.upsert({ email: user.email, ... })
    },
  },
};