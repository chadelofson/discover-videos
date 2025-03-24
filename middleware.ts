import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/utils"
 
export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const token = req ? req.cookies.get("token") : null
    const userId = await verifyToken(token)
    const { pathname } = req.nextUrl
    // check the token
    // if token is valid
    // //|| if page is /login
    if (
        pathname.startsWith("/_next") ||
        pathname.includes("/api/login") ||
        userId ||
        pathname.includes("/static")
        ) {
      return NextResponse.next()
    }

    // if no token 
    // redirect to login
    if (!token && pathname !== "/login") {
        const url = req.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }
}