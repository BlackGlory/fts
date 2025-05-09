# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.4](https://github.com/BlackGlory/fts/compare/v0.5.3...v0.5.4) (2025-05-08)


### Bug Fixes

* abort signal support ([1fd30fe](https://github.com/BlackGlory/fts/commit/1fd30feeb45f4bc8d35cf723c027d18d91fb6dee))

### [0.5.3](https://github.com/BlackGlory/fts/compare/v0.5.2...v0.5.3) (2023-03-29)

### [0.5.2](https://github.com/BlackGlory/fts/compare/v0.5.1...v0.5.2) (2023-02-06)

### [0.5.1](https://github.com/BlackGlory/fts/compare/v0.5.0...v0.5.1) (2023-02-06)

## [0.5.0](https://github.com/BlackGlory/fts/compare/v0.4.1...v0.5.0) (2023-02-06)


### ⚠ BREAKING CHANGES

* - HTTP => WebSocket.
- The APIs have been redesigned.
- Renamed `FTS_POSTGRES_NAME to `FTS_POSTGRES_DATABASE`.
- Upgrade to PostgreSQL 15.
* - Removed JSON schema validation.
- Removed access control.

* redesign APIs ([093b0cc](https://github.com/BlackGlory/fts/commit/093b0cc63831835ef223451d8cb1dbc43f67667c))
* remove JSON schema validation, access control ([08bd6ca](https://github.com/BlackGlory/fts/commit/08bd6caef85e7c326bed9bbed0ab0b70ccfd6cb2))

### [0.4.1](https://github.com/BlackGlory/fts/compare/v0.4.0...v0.4.1) (2023-02-01)

## [0.4.0](https://github.com/BlackGlory/fts/compare/v0.3.4...v0.4.0) (2023-01-31)


### ⚠ BREAKING CHANGES

* - The `Accept-Version` header is semver now.
- Removed `/metrics`.
- Removed HTTP2 support.

* upgrade dependencies ([e138cf4](https://github.com/BlackGlory/fts/commit/e138cf4eeb0ba5c54c5ab651650d85bd8e999424))

### [0.3.4](https://github.com/BlackGlory/fts/compare/v0.3.3...v0.3.4) (2022-09-07)

### [0.3.3](https://github.com/BlackGlory/fts/compare/v0.3.2...v0.3.3) (2022-08-11)

### [0.3.2](https://github.com/BlackGlory/fts/compare/v0.3.1...v0.3.2) (2022-07-24)

### [0.3.1](https://github.com/BlackGlory/fts/compare/v0.3.0...v0.3.1) (2022-03-01)

## [0.3.0](https://github.com/BlackGlory/fts/compare/v0.2.6...v0.3.0) (2022-02-16)


### ⚠ BREAKING CHANGES

* requires manual data migration.

* upgrade @blackglory/pg-migrations ([d7f99b6](https://github.com/BlackGlory/fts/commit/d7f99b6ac2f3c73b47dcad08e8127e944fcdf5c5))

### [0.2.6](https://github.com/BlackGlory/fts/compare/v0.2.5...v0.2.6) (2022-01-16)


### Features

* add accept-version support ([e10c115](https://github.com/BlackGlory/fts/commit/e10c115c04ff26aaf7e84095e896190cfa99f5bc))
* add cache-control header ([0903d63](https://github.com/BlackGlory/fts/commit/0903d6366caec4725b70bf604dfd4daf151ead8b))


### Bug Fixes

* **docker:** build ([f16be18](https://github.com/BlackGlory/fts/commit/f16be1883cf16875c332386e2a104c93589beaaf))
* **docker:** healthcheck ([11bb425](https://github.com/BlackGlory/fts/commit/11bb425a688fb4e135e4bfb1f2da86b807c8a1c5))

### [0.2.5](https://github.com/BlackGlory/fts/compare/v0.2.4...v0.2.5) (2021-10-14)

### [0.2.4](https://github.com/BlackGlory/fts/compare/v0.2.3...v0.2.4) (2021-07-13)

### [0.2.3](https://github.com/BlackGlory/fts/compare/v0.2.2...v0.2.3) (2021-07-12)

### [0.2.2](https://github.com/BlackGlory/fts/compare/v0.2.1...v0.2.2) (2021-07-03)

### [0.2.1](https://github.com/BlackGlory/fts/compare/v0.2.0...v0.2.1) (2021-06-21)


### Features

* add /health ([14c80a6](https://github.com/BlackGlory/fts/commit/14c80a671c54800182364ca0e9062433fa37a6c9))
* order by relevance ([686b59b](https://github.com/BlackGlory/fts/commit/686b59b10a699a48804f73230d9a849edac3f68f))


### Bug Fixes

* docker build ([d7205b8](https://github.com/BlackGlory/fts/commit/d7205b8bf06d7a2e676eccba22cbe3581089b7e9))

## [0.2.0](https://github.com/BlackGlory/fts/compare/v0.1.0...v0.2.0) (2021-05-17)


### ⚠ BREAKING CHANGES

* rewrite

### Features

* add offset parameter to query ([b445f01](https://github.com/BlackGlory/fts/commit/b445f0162acd46a9cccda8d767bb24cfbd9d5fd5))
* enable fastupdate ([08f354a](https://github.com/BlackGlory/fts/commit/08f354ac9af94314d4e30664564f7d8db26c7eb6))
* rewrite ([f9ca63c](https://github.com/BlackGlory/fts/commit/f9ca63c40920a4cf73e36924b8d0f81111b8bc84))


### Bug Fixes

* queryInBuckets ([9cede9f](https://github.com/BlackGlory/fts/commit/9cede9f2e63a0a23fc4ddb2a867b29b24c374e9a))

## 0.1.0 (2021-05-12)


### Features

* add stats ([5000b6d](https://github.com/BlackGlory/fts/commit/5000b6dc9e796c9efce6dd5852a0774c9c4773da))
* init ([0b71515](https://github.com/BlackGlory/fts/commit/0b715158eb02dfd82ac5afad05c04813e36b6ade))


### Bug Fixes

* set ([0253410](https://github.com/BlackGlory/fts/commit/0253410f295a01d9c1149fe498c66bd7585785ec))
