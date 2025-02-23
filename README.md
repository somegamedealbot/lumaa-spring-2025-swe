
# Task Managment App

## Setup

The setup is is made up of 3 components, a docker container running a database, a NestJS backend, and a vite React + Typescript frontend.

### 1. Setting up PostgreSQL DB

1. Make sure to have docker installed.

2. Run `docker compose up -d` in the shell in the project directory to database container.

3. Ensure container is running with `docker container list`.

**Relevant environment variables for PostgreSQLQL**
```
PG_USER=root    # user for PostgreSQL db
PG_HOST=localhost   # PostgresSQL server
PG_PASSWORD=password    # password for user
PG_DB=task-management   # database name
PG_PORT=5432    # PostgreSQL server port
```


### 2. Running NestJS Server

1. Run `cd task-management-backend` to change to NestJS directory

2. `npm install` to install all necessary packages.

3. Make sure PostgreSQL docker container is running.

4. `npm run start` to start nest server on http://localhost:3000/



**Relevant environment variables in directory's `.env`**

```
** includes previous database environment variables


SECRET_KEY=ot74/LXebCVMaPzdZVuBYmlwh7syq9tag78Hx3735eY=     # secret key for creating jwts
NEST_PORT=3000  # port for NestJS
```


### 3. Running React App

1. Back out of the NestJS directory and go into React app `cd task-management-backend`

2. `npm install` to install all necessary packages.

3. `npm run dev` to start React development server on http://localhost:5173/

**Relevant environment variables in directory's `.env`**

```
VITE_API_SERVER=http://localhost:3000   # backend api server address
```

## Testing

For testing, Jest was used to test endpoint functionality. Jest tests are conducted using a in-memory sqlite database instead of the PostgreSQL database. Manual testing was done for the frontend.

### Running Jest tests

1. Run `cd task-management-backend` to change to NestJS directory 

2. Run `npm run test:e2e` to run JestJS tests on auth and tasks endpoints.

## Expected Salary
**Monthly: $4,333 - $5,200 ($25/hr - $30hr)**
