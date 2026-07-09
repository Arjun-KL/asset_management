# Asset Management System

This project is a web-based Asset Management System developed using Node.js, Express.js, Sequelize, and PostgreSQL. It is designed to help organizations manage their company assets efficiently by maintaining employee records, tracking asset details, assigning assets to employees, processing asset returns, managing scrapped assets, and monitoring available stock. The application provides a simple and user-friendly interface to perform day-to-day asset management activities.

## Getting Started

After cloning the repository, install all the required dependencies using the following command:

```
npm install
```

Next, create the PostgreSQL database and update your database configuration in the project before running the migration.

Run the following command to create all the required tables:

```
npm run migrate:db
```

Once the tables are created successfully, run the seed file to create the default administrator account:

```
npx sequelize-cli db:seed:all
```

If you need to modify the admin Username or Password:
Change the value from .env(Username, Password):

```
npm run reset-admin-password
```

After completing the above steps, start the application using:

```
npm run dev
```

The application will start on:

```
http://localhost:3000
```

## Login Credentials

Use the following credentials to log in to the application after running the seed command.

**Username:** ARJUN K

**Password:** Arjun@3210

## Available Modules

The application includes the following modules:

* Login
* Employee Management
* Asset Management
* Asset Category Management
* Issue Asset
* Return Asset
* Scrap Asset
* Stock Management

You can access these modules using the following URLs after starting the application:

* Login – http://localhost:3000/login
* Employees – http://localhost:3000/employees
* Assets – http://localhost:3000/assets
* Categories – http://localhost:3000/categories
* Issue Asset – http://localhost:3000/issue-asset
* Return Asset – http://localhost:3000/return-asset
* Scrap Asset – http://localhost:3000/scrap-asset
* Stock – http://localhost:3000/stock

## Database

The project uses PostgreSQL as the database and Sequelize as the ORM. If you want to verify the data after running the application, you can execute the following SQL queries:

```
SELECT * FROM employees;
SELECT * FROM assets;
SELECT * FROM asset_categories;
select * from users;
select * from "SequelizeMeta";
```

