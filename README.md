# deltachat-node-custom

`deltachat-node-custom` is a patched distribution of the
[deltachat-core-rust](https://github.com/chatmail/core) v1.121.0 sources with
npm packaging metadata, maintained for a custom deltachat-desktop build. It
contains the Rust core of Delta Chat (an email-based messaging library) plus
the historical `package.json` of the old `deltachat-node` npm package, with a
small number of local patches applied on top of upstream v1.121.0.

## What is included

- **Rust core sources** — the `deltachat` crate in `src/` plus the workspace
  members listed in the root `Cargo.toml`:
  - `deltachat-ffi` — C FFI bindings (builds a `cdylib`/`staticlib` named
    `deltachat`, i.e. the C library `libdeltachat`)
  - `deltachat_derive` — derive macros
  - `deltachat-jsonrpc` — JSON-RPC API crate (own crate, with a TypeScript
    client in `deltachat-jsonrpc/typescript/`)
  - `deltachat-rpc-server` — JSON-RPC server binary
  - `deltachat-ratelimit` — rate limiting helper crate
  - `deltachat-repl` — command-line REPL for testing a `Context`
  - `format-flowed` — `format=flowed` (RFC 3676) text formatting crate
- **`test-data/`** — test fixtures (autoconfig files, images, keys, sample
  messages, webxdc apps)
- **Vendored dependencies** in `local-git/` (`quinn`, `rust-email`,
  `encoded-words`, `lettre`), wired in via `[patch]` sections in the root
  `Cargo.toml`; see [NOTICE.md](./NOTICE.md) for their licenses and upstream URLs
- **`package.json` / `.npmignore` / `.npmrc`** — npm packaging metadata kept
  from the historical `deltachat-node` package (see "Packaging" below)

### What is NOT included (compared to upstream deltachat-core-rust)

This repository does **not** contain the following parts of the upstream
repository:

- `node/` — the Node.js/JavaScript bindings (the reason the old README and
  `package.json` scripts referenced them; they do not exist here)
- `python/` — the Python bindings
- `scripts/` — helper scripts (e.g. `rebuild-core.js`)
- `.github/` — CI workflows
- `contrib/` — contributor tooling
- documentation files such as `spec.md`, `standards.md`, `webxdc.md`

## Custom changes vs upstream v1.121.0

Two features are patched in relative to upstream tag `v1.121.0`:

### a) Fetch ALL existing inbox messages on first login

- `Config::FetchExistingMsgs` defaults to `"1"`
  (`#[strum(props(default = "1"))]` in `src/config.rs`), so existing messages
  are fetched on the first `start_io()` after configuring.
- `DC_FETCH_EXISTING_MSGS_COUNT` is raised from `100` to `999999`
  (`src/constants.rs`), i.e. effectively all existing inbox messages are
  fetched instead of only the newest 100.

### b) Per-chat end-to-end encryption toggle

- New `Param::ChatDisableE2ee = b'z'` (`src/param.rs`): when set on a chat,
  end-to-end encryption is disabled for that chat even if enabled globally.
- `ChatId::set_e2ee_disabled()` / `ChatId::is_e2ee_disabled()`
  (`src/chat.rs`): set/query the toggle on a chat.
- `MimeFactory` honors the toggle (`src/mimefactory.rs`):
  - when the toggle is set, `should_force_plaintext()` returns `true` and the
    outgoing message is forced to plaintext;
  - when the toggle is not set, the chat "prefers e2ee": the message is
    encrypted whenever **all** recipients have a known key (even keys learned
    only via Autocrypt-Gossip, i.e. without a `prefer-encrypt=mutual`
    preference; a peer that explicitly sent `prefer-encrypt=reset` is still
    left unencrypted). If any recipient key is missing, it falls back to the
    usual opportunistic encryption so sending never fails.
- The `param` module is public (`pub mod param;` in `src/lib.rs`).

## Build

Build and test from the repository root (a Cargo workspace):

```sh
cargo build
cargo test
```

Requirements:

- Rust 1.65+ (`rust-version = "1.65"` in the root `Cargo.toml`)
- The default `vendored` feature builds the bundled sqlcipher and OpenSSL
  sources (`rusqlite/bundled-sqlcipher-vendored-openssl`,
  `reqwest/native-tls-vendored`, `async-native-tls/vendored`), so a **C
  compiler** and **perl** are needed.

`deltachat-ffi` produces the C library (`crate-type = ["cdylib", "staticlib"]`,
library name `deltachat`); `deltachat-jsonrpc` is its own crate in the
workspace.

## Packaging

The `package.json` in the repository root is kept from the historical
`deltachat-node` npm package: name `deltachat-node`, version `1.121.788`,
license `GPL-3.0-or-later`. However, the JavaScript bindings (`node/`) that
this package originally shipped are **not** part of this repository — only the
Rust sources and the packaging metadata are present.

## License

- The Rust core is licensed under **MPL-2.0** — see [LICENSE](./LICENSE).
- The npm packaging metadata (`package.json`) is **GPL-3.0-or-later**.
- See [NOTICE.md](./NOTICE.md) for full attribution, including the vendored
  dependencies under `local-git/`.

## Provenance

This distribution is based on [chatmail/core](https://github.com/chatmail/core)
(formerly `deltachat/deltachat-core-rust`) **tag `v1.121.0`**. Upstream has
since moved on to the 2.x line; this repository tracks the 1.121 line with the
custom patches described above.
