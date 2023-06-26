# Petes-Plan

## Description
The purpose of the project is to compile many of the resources students use for course planning into a single application that streamlines the process, making it easier and faster to create a degree plan and to modify it as you go.

## Origin
This project was originally created for CS 30700: Software Engineering at Purdue University.

The original version submitted for class can be found [here](https://github.com/SnoringDragon/CS307-Petes-Plan).

The project is now being continued independently as a personal project which I hope to release publicly when it is ready for consumers.

## Running
Install [`node.js`](https://nodejs.org/en/), and optionally [`docker`](https://www.docker.com/)

##  Client
`cd` into the `client` folder

#### Installing and updating packages
To update and install packages, run `npm i`

### Running the client
Run `npm run dev` inside the `client` folder

## Server
`cd` into the `server` folder

Copy the `.env.example` file to a new file called `.env`

#### Installing and updating packages
To update and install packages, run `npm i`

### Running the server
Run `npm run dev` or `node index.js` inside the `server` folder

## Docker
Docker allows you to run a local database and mail server. 
### Running docker
Run `docker compose up` inside the root folder.

You can also specify the `-d` flag to run in the background (`docker compose up -d`)
* To stop the server, run `docker compose down`

### MailHog
MailHog is a fake email server useful for local development. The following ports are used:
* `localhost:1025` is the SMTP mail server for sending emails to
* [`localhost:8025`](http://localhost:8025) is a web interface for viewing the sent emails in your browser

### MongoDB
The local MongoDB instance is exposed on `localhost:27017`. The admin username is `root` and the admin password is `hunter2`

### Mongo Express
Mongo Express is a web interface for browsing the contents of the mongoDB database. It is located at [`localhost:8081`](http://localhost:8081)
