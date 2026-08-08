/**
 * Tells the Convex deployment which JWTs to trust.
 *
 * `CLERK_JWT_ISSUER_DOMAIN` is a Convex *deployment* environment variable (set
 * it in the Convex dashboard, not in .env.local). It is the "Issuer" URL shown
 * on the Clerk JWT template named `convex`, e.g. https://xxx.clerk.accounts.dev
 *
 * The `convex` JWT template must also expose the user's role so that
 * `requireAdmin` in ./lib/auth.ts can read it. Add these claims to the template:
 *
 *   {
 *     "metadata": "{{user.public_metadata}}"
 *   }
 */
const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
