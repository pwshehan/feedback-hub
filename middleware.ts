import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: ['/((?!api/reviews/create|auth/signin|_next/static|_next/image|favicon.ico).*)'],
};
