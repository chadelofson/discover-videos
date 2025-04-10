import { magicAdmin } from '@/lib/magic-server'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from "jsonwebtoken";
import { createNewUser, isNewUser } from '@/db/hasura';
import { setTokenCookie } from '@/lib/cookie';
 
type ResponseData = {
  done: boolean;
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
      try {
        const auth = req.headers
        const didToken = auth ? auth.authorization?.substring(7) : ""
        const metadata = await magicAdmin.users.getMetadataByToken(String(didToken))
        // create jwt
        const token = jwt.sign(
          {
            ...metadata,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
            "https://hasura.io/jwt/claims": {
              "x-hasura-allowed-roles": ["user", "admin"],
              "x-hasura-default-role": "user",
              "x-hasura-user-id": `${metadata.issuer}`,
            },
          },
          process.env.JWT_SECRET
        );

        
        const isNewUserQuery = await isNewUser(token, String(metadata.issuer))
        isNewUserQuery && (await createNewUser(token, metadata))
        setTokenCookie(token, res);
        res.json({ done: true })
        
      } catch (error) {
        console.error("Something went wrong logging in", error)
        res.status(500).json({ done: false })
      }

  } else {
      res.status(200).json({ done: false })
  }
}