# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: To start the app in dev mode
- `npm start`: For production mode

## To Upload an Image

> YOu can use for example postman to make this api call

TYPE: `POST`
ENDPOINT: `http://127.0.0.1:3000/ads/`
BODY
```
{
    "name": "name",
    "desc": "desc",
    "file": "selected file"
}
```
