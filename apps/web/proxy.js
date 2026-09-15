import { NextResponse } from "next/server"

export const proxy = (request) => {
    const session = request.cookies.get("plate_access_token")?.value
    const pathname = request.nextUrl.pathname
    
    if (!session && pathname !== "/login") return NextResponse.redirect(new URL("/login", request.url))
    if (session && pathname === "/login") return NextResponse.redirect(new URL("/", request.url))
    
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/representatives',
        '/cars',
    ],
}