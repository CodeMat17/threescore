import { v } from "convex/values";
import { action } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const getUrl = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await requireAdmin(ctx);
    return await ctx.storage.getUrl(storageId);
  },
});
