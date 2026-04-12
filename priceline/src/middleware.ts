import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/embed(.*)",
    "/api/events(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$)|/)", "/(api|trpc)(.*)"],
};