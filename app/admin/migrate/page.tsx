"use client";

export default function MigratePage() {
  const newUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "(not set)";

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 font-sans">
      <h1 className="text-2xl font-bold mb-2">DB Migration</h1>
      <p className="text-sm text-muted-foreground mb-10">
        The data has already been exported. Follow the steps below to import it
        into this deployment.
      </p>

      {/* Current deployment */}
      <section className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-3">Current deployment</h2>
        <code className="block bg-muted rounded px-3 py-2 text-sm break-all">
          {newUrl}
        </code>
      </section>

      {/* Import steps */}
      <section className="border rounded-lg p-6 mb-6 space-y-5">
        <h2 className="font-semibold text-lg">Import from backup</h2>
        <p className="text-sm text-muted-foreground">
          The backup ZIP is at{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            backup/threescore-backup.zip
          </code>{" "}
          and includes all table data plus every stored image.
        </p>

        <div className="space-y-4 text-sm">
          <Step n={1} title="Make sure .env.local points to the new deployment">
            <code className="block bg-muted rounded px-3 py-2 mt-2 text-xs">
              CONVEX_DEPLOYMENT=dev:your-new-deployment{"\n"}
              NEXT_PUBLIC_CONVEX_URL=https://your-new-deployment.convex.cloud
            </code>
          </Step>

          <Step n={2} title="Deploy the functions to the new deployment">
            <code className="block bg-muted rounded px-3 py-2 mt-2 text-xs">
              npx convex dev
            </code>
          </Step>

          <Step n={3} title="Import the backup (tables + images)">
            <code className="block bg-muted rounded px-3 py-2 mt-2 text-xs">
              npx convex import --replace-all backup/threescore-backup.zip
            </code>
            <p className="text-muted-foreground mt-2">
              This restores all table documents and re-uploads every file in the{" "}
              <code className="bg-muted px-1 rounded">_storage/</code> folder
              automatically. Use <code className="bg-muted px-1 rounded">--append</code>{" "}
              instead of <code className="bg-muted px-1 rounded">--replace-all</code> if
              you&apos;ve already added data to the new deployment that you want to keep.
            </p>
          </Step>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        This page is temporary — remove{" "}
        <code className="bg-muted px-1 rounded">app/admin/migrate</code> after
        migration is complete.
      </p>
    </main>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
        {n}
      </span>
      <div className="flex-1 pt-0.5">
        <p className="font-medium mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}
