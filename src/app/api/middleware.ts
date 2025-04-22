// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/ges-workbench/login", // your custom login page
  },
});

export const config = {
  matcher: ["/dashboard", "/settings", "/reports"], // protect these routes
};
