# Show the available developer commands
[private]
default:
    @just --list

# Install the pinned workspace dependencies
bootstrap:
    pnpm install --frozen-lockfile

# Start the styleguide development server
dev:
    pnpm run dev

# Build all libraries and the static styleguide
build:
    pnpm run build

# Run the Vitest suite
test:
    pnpm run test

# Type-check every workspace
typecheck:
    pnpm run typecheck

# Lint the repository
lint:
    pnpm run lint

# Format supported repository files
format:
    pnpm run format

# Run linting, type checks, tests, and builds
check:
    pnpm run check
