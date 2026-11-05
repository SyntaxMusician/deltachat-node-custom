# NOTICE

This file provides attribution and license notices for this repository
(`deltachat-node-custom`), a patched distribution of the Delta Chat Rust core.

## Rust core

The Rust core in this repository (`src/`, `deltachat-ffi/`, `deltachat_derive/`,
`deltachat-jsonrpc/`, `deltachat-rpc-server/`, `deltachat-ratelimit/`,
`deltachat-repl/`, `format-flowed/`) is based on
**deltachat-core-rust v1.121.0**, now hosted at
<https://github.com/chatmail/core> (formerly
<https://github.com/deltachat/deltachat-core-rust>).

It is licensed under the **Mozilla Public License Version 2.0 (MPL-2.0)**,
see the [LICENSE](./LICENSE) file in this repository.

Copyright (c) Delta Chat developers.

## Vendored dependencies under `local-git/`

The following dependencies are vendored under `local-git/` and wired in via
`[patch]` sections in the root `Cargo.toml`:

| Directory | Crate(s) | License (as stated in the vendored `LICENSE` / `Cargo.toml`) | Upstream |
| --- | --- | --- | --- |
| `local-git/quinn/` | `quinn`, `quinn-proto`, `quinn-udp` | MIT OR Apache-2.0 (`LICENSE-MIT`, `LICENSE-APACHE`) | <https://github.com/quinn-rs/quinn> |
| `local-git/rust-email/` | `email` | MIT (`LICENSE`) | <https://github.com/deltachat/rust-email> (fork of <https://github.com/niax/rust-email>) |
| `local-git/encoded-words/` | `encoded-words` | Apache-2.0/MIT (`LICENSE-APACHE`, `LICENSE-MIT`) | <https://github.com/async-email/encoded-words> |
| `local-git/lettre/` | `lettre`, `lettre_email` | MIT (`LICENSE`) | <https://github.com/lettre/lettre> |

## Additional notice (MPL-2.0, Exhibit B style)

This Source Code Form is a modified version of deltachat-core-rust v1.121.0.
The modifications (see the "Custom changes vs upstream v1.121.0" section of
[README.md](./README.md)) are Copyright (c) the contributors of this
repository, and this repository is the source of the modified version.
The unmodified upstream source is available at
<https://github.com/chatmail/core> (tag `v1.121.0`, formerly
<https://github.com/deltachat/deltachat-core-rust>).

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain
one at <https://mozilla.org/MPL/2.0/>.
