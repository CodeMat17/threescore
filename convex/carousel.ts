import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// Hero Carousel
export const getCarousel = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("heroCarousel").collect();
  },
});

export const addCarousel = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const title = args.title.trim();
    const subtitle = args.subtitle.trim();
    if (!title) throw new Error("Title is required");
    if (!subtitle) throw new Error("Subtitle is required");
    const image = await ctx.storage.getUrl(args.imageId);
    if (!image) throw new Error("Failed to resolve image URL");
    return await ctx.db.insert("heroCarousel", {
      title,
      subtitle,
      imageId: args.imageId,
      image,
    });
  },
});

export const updateCarousel = mutation({
  args: {
    id: v.id("heroCarousel"),
    title: v.string(),
    subtitle: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const title = args.title.trim();
    const subtitle = args.subtitle.trim();
    if (!title) throw new Error("Title is required");
    if (!subtitle) throw new Error("Subtitle is required");
    const image = await ctx.storage.getUrl(args.imageId);
    if (!image) throw new Error("Failed to resolve image URL");
    await ctx.db.patch(args.id, {
      title,
      subtitle,
      imageId: args.imageId,
      image,
    });
    return args.id;
  },
});

export const deleteCarousel = mutation({
  args: { id: v.id("heroCarousel") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const doc: Doc<"heroCarousel"> | null = await ctx.db.get(id);
    if (doc?.imageId) {
      await ctx.storage.delete(doc.imageId as Id<"_storage">);
    }
    await ctx.db.delete(id);
    return true;
  },
});
