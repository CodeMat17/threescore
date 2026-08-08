# Convex DB migration

Moved here from `app/admin/migrate/page.tsx`, which was a publicly routable,
unauthenticated page that printed the deployment URL and internal backup paths.
The page itself noted it was temporary and should be removed once the migration
was done — this file keeps the instructions without exposing them on the web.

The backup ZIP at `backup/threescore-backup.zip` includes all table data plus
every stored image.

## 1. Point `.env.local` at the target deployment

```
CONVEX_DEPLOYMENT=dev:your-new-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-new-deployment.convex.cloud
```

## 2. Deploy the functions

```
npx convex dev
```

## 3. Import the backup (tables + images)

```
npx convex import --replace-all backup/threescore-backup.zip
```

This restores all table documents and re-uploads every file in the `_storage/`
folder automatically. Use `--append` instead of `--replace-all` if the target
deployment already has data you want to keep.
