# Changesets

Every consumer-facing change should include a changeset:

```sh
pnpm changeset
```

The six `@hifi/*` packages are versioned as a fixed group. `pnpm version-packages` consumes pending changesets and updates the lockfile; `pnpm release` runs the complete downstream package check before publishing.
