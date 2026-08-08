# Generated — do not edit

This directory is a **read-only mirror** of `convex/` in the dashboard repo
(`threescoredb`), which is the single source of truth for the Convex schema and
functions, and the only repo that runs `npx convex deploy`.

Editing anything here will be overwritten by the next `yarn convex:sync`, and
changes made here are never deployed. Change the schema or a function in the
dashboard repo, run `npx convex dev` there to regenerate types, then run
`yarn convex:sync` here.
