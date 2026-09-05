# **NESTJS GRPC SAMPLE**

## Description

Implementation of NestJS with the gRPC protocol (supports a hybrid REST + gRPC
application). A single Nest application exposes:

- A REST API (`/user`, `/user/:id`) served over HTTP.
- A `UsersService` gRPC server (see [`src/user/user.proto`](src/user/user.proto)),
  which the REST controller itself calls as a gRPC client to resolve users.

Built on **NestJS v12**, running as CommonJS on Node.js while consuming Nest's
ESM-only packages via Node's native `require(esm)` support.

## Requirements

- Node.js **>= 24.9** (needed for Jest to load Nest's ESM packages during
  tests — see [Running tests](#running-tests)).

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# Development
$ npm run start

# Watch Mode
$ npm run start:dev

# Production Mode
$ npm run build
$ npm run start:prod
```

Once running, try the hybrid REST + gRPC flow:

```bash
$ curl http://localhost:3000/user
$ curl http://localhost:3000/user/1
```

Both routes are served over HTTP but resolved by calling the gRPC
`UsersService` under the hood.

## Running tests

```bash
# unit tests
$ npm run test

# e2e tests (boots the real hybrid app and exercises it over HTTP + gRPC)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Nest's `@nestjs/*` packages ship as ESM. Jest loads them via Node's
`require(esm)` support, which needs both the `--experimental-vm-modules` flag
(already wired into the `test*` scripts via `NODE_OPTIONS`) and Node **24.9+**.

## Linting & formatting

```bash
$ npm run lint
$ npm run format
```

Linting uses [oxlint](https://oxc.rs/docs/guide/usage/linter.html), the
lint tool shipped by the current NestJS CommonJS/Jest project scaffold.
