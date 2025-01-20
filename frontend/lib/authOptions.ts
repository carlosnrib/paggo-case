
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import NextAuth, { AuthOptions, DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultUser & {
      id: string;
      username: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}


export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const { data } = await axios.post(
              `${process.env.API_URL}/auth/login`,
              credentials
            );
  
            if (data) {
              return {
                id: data.id,
                username: data.username,
              };
            }
  
            return null;
          } catch (error) {
            console.error("Login error:", error);
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user = {
            ...session.user,
            id: token.id,
            username: token.username,
          };
        }
        return session;
      },
    },
};
  