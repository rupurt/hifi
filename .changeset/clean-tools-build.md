---
'@hifi/kinetic': patch
---

Make Core an explicit Kinetic peer contract, build its workspace development dependency before preparing Kinetic from a Git-hosted monorepo path, and serialize package smoke builds so declaration cleanup cannot race consumers.
