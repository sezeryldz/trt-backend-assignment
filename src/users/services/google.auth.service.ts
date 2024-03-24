import debug from "debug";
import axios from "axios";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const log: debug.IDebugger = debug("app:prisma-service");
const prisma = new PrismaClient();

class GoogleAuthService {
  oAuthLink() {
    const loginLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
    return loginLink;
  }

  async oAuthCallback(code) {
    try {
      // Exchange authorization code for access token
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const { access_token, id_token } = data;

      // Use access_token or id_token to fetch user profile
      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const accessToken = jwt.sign(
        {
          // 1 Hour expiration time for the token
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            email: profile.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      return {
        message: "Logged in with google succesfully.",
        email: profile.email,
        accessToken: accessToken,
      };
    } catch (error) {
      console.error("Error:", error.message);
      return {
        message: "Error exchanging code for token.",
      };
    }
  }
}

export default new GoogleAuthService();
