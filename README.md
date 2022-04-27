# invekotin

[![REUSE status](https://api.reuse.software/badge/github.com/murtoM/invekotin)](https://api.reuse.software/info/github.com/murtoM/invekotin)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Simple inventory management in Express.js.

## Prerequisites

At the moment Docker is the only tested method of running the application.

Running the application requires:

- Docker
- `docker-compose`
- `make` (optional, handy during development)

And an `.env` file at the repository root directory with following **example**
content:

```
APP_PORT=3000
MONGO_PORT=27017
MONGO_USERNAME=root
MONGO_PWD=password
MONGO_DB_NAME=invekotin-db
MONGO_HOST=invekotin-mongodb
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=invekotin-db
SESSION_SECRET=wNq1533AQRW9PDdn4CXh4zHsxJ00ZQGb
SESSION_SECURE_COOKIES=false
```

You should **not** use these values in production.

## Usage

The application can be launched with `docker-compose`:

```
$ docker-compose up
```

Or optionally with `make`:

```
$ make run
```

For more `make` commands, see the [`Makefile`](Makefile).

When the containers are running, you can access the application at http://localhost:3000 (or at which port you configured in `.env`).

At this point in development you are provided with a test account with
following credentials:

- Username: `root3`
- Password: `password`

## Name

The name of the project is a portmanteau of two Finnish words: *inventaario* and
*vekotin*.

## License

All programming code is licensed under the MIT license. For more detailed
license and copyright information, see the
[dep5](.reuse/dep5).
