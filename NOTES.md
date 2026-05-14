# Documentation

Tutorial: [Build a Custom URL Shortener Service By Traversy Media](https://www.youtube.com/watch?v=Z57566JBaZQ)

## MongoDB 
* Cluster = [URL Shortener](https://cloud.mongodb.com/v2/62aee5ff0bc0f723c8a76b3b#/metrics/replicaSet/668167d2defbaf5345e59069/explorer/test/urls/find)
* Authentication:
    * User = arbel
    * Password = OiCQqCcw8X2ODILV

## Server boot sequence:
    1. `server/index.js` starts Express.
    2. Calls `connectDB()`.
    3. `connectDB()` reads `mongoURI` from `config.get('mongoURI')`, which comes from `server/config/default.json`.
    4. If Mongo connects → logs `MongoDB Connected....`
    5. Server listens on hardcoded port 5000.

## Project Setup:
preReq:
    1. Create cluster
get started:
    1. config:
        1.1 `npm init -y` to create `package.json` - dependencies and packages we install
        1.2 `npm i express config mongoose shortid valid-url`:
            * express - The framework we are using to create the routes.
            * config - package that allows global variables.
            * mongoose - abstraction for the DataBase.
            * shortid - Generate the URL code.
            * valid-url - validate url that sent to the api.
        1.3 `npm i -D nodemon`:
            * `-D` - dev dependency.
            * `nodemon` - monitor the application to avoid the developer from reloading after every change (Replace react render)
        1.4 start script:
            `package.json` -> `scripts` -> `test` change to: `"start": "node index", "dev": "nodemon index"`
    2. create index.js - express server

## Running Commands
1. `server > npm run dev`- nodemon run on express server
2. `client > npm start` - React



# IMPORTANT
DON'T FORGET TO EDIT : `"mongoURI": ""`
IN DIR: `server\config\default.json`
CHANGE TO: `"mongoURI": "mongodb+srv://arbel:OiCQqCcw8X2ODILV@url.15qzvru.mongodb.net/?retryWrites=true&w=majority&appName=URL"`



# Connect FRONT to BACK
[How to Create a Express/Node + React Project | Node Backend + React Frontend](https://www.youtube.com/watch?v=w3vs4a03y3I)


**frontend**
[REACT](http://localhost:3000/) - to RUN: `npm start`
[EXPRESS](http://localhost:5000/api/url) - to RUN: `npm run dev`

[mongoURI]("mongodb+srv://arbel:OiCQqCcw8X2ODILV@url.15qzvru.mongodb.net/?retryWrites=true&w=majority&appName=URL")