import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

type AnyCtx = QueryCtx | MutationCtx | ActionCtx;

/**
 * The role claim can arrive in one of two shapes depending on how the Clerk
 * `convex` JWT template is written:
 *
 *   "metadata": "{{user.public_metadata}}"   ->  identity.metadata.role
 *   "role": "{{user.public_metadata.role}}"  ->  identity.role
 *
 * Both are accepted so the template can be authored either way.
 */
function readRole(identity: Record<string, unknown>): string | null {
  const metadata = identity.metadata;
  if (metadata && typeof metadata === "object") {
    const role = (metadata as Record<string, unknown>).role;
    if (typeof role === "string") return role;
  }
  if (typeof identity.role === "string") return identity.role;
  return null;
}

/**
 * Throws unless the caller is a signed-in Clerk user carrying the `admin` role.
 *
 * Every write, and every read of non-public data, goes through this. The public
 * site calls Convex unauthenticated, so anything guarded here is unreachable
 * from the marketing frontend by construction.
 */
export async function requireAdmin(ctx: AnyCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Unauthenticated: you must be signed in to do that.");
  }

  const role = readRole(identity as unknown as Record<string, unknown>);
  if (role !== "admin") {
    throw new Error("Forbidden: this action requires the admin role.");
  }

  return identity;
}
