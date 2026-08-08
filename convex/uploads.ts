import { action } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const url = await ctx.storage.generateUploadUrl();
    return url;
  },
});
