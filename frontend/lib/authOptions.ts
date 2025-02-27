import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { AuthOptions, DefaultSession, DefaultUser } from "next-auth";
import api from "@/services/api";

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
            const { data } = await api.post(
              `/auth/login`,
              credentials
            );
  
            if (data && data.access_token) {
              const decodedToken = jwtDecode<{ sub: string, username: string }>(data.access_token);
              return {
                id: decodedToken.sub,
                username: decodedToken.username,
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
