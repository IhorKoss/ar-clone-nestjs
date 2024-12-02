## Description

[AutoRIa clone](https://github.com/IhorKoss/ar-clone-nestjs) - BE OWE examination project.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start:docker:local

# watch mode
$ npm run start:dev
```
Keep in mind that you need to have a running PostgreSQL instance to run the project. Check the `ormconfig.json` file to see the connection settings.
When changes to the database are made, you need to run the following command to apply them:
```bash
$ npm run migration:generate
```
All migrations are stored in the `migrations` folder. They are run automatically when the application starts.

Remember to create a `.env` file in the root of the project. Example given in `.env.example` file.

## Project structure
There are 3 main modules in the project:
- `auth` - module responsible for user authentication and authorization. It provides endpoints for user sign-in/out and token refresh.
- `users` - module responsible for user management. It provides endpoints for user information retrieval, creation, and update. It also provides endpoints for user role management, such as creating a manager and banning a user.
- `ads`- module responsible for ads management. It provides endpoints for ads retrieval, creation, update etc. It also provides endpoints for ads filtering including filtering by user id, filtering by ad status (only for manager role or above). This module also contains an easteregg endpoint that returns a link to YouTube.
- `users` and `ads` modules are protected by the `auth` module. To access them, you need to provide a valid JWT token in the `Authorization` header.
- `users` `and `ads` modules have some endpoints that are available only for manager role or above/only for admin role.
- `manager` can be created by admin only.
- `admin` creation haven`t been done yet. You can create it manually in the database.
  When everything is set up, check the http://localhost:3000/docs for swagger.


## Contact
For any questions, feel free to contact me via email:
```
kos.ig.iv@gmail.com
```
Or text me on [Telegram](https://t.me/bruhc)