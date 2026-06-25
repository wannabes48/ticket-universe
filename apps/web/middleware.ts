import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // If the user tries to access a protected route
      const isSellerRoute = req.nextUrl.pathname.startsWith('/api/seller') || req.nextUrl.pathname.startsWith('/sell/list');
      
      if (isSellerRoute) {
        return !!token; // Must be logged in
      }

      return true; // All other routes are public
    },
  },
});

export const config = {
  matcher: [
    "/sell/list/:path*",
    "/api/seller/:path*"
  ],
};
