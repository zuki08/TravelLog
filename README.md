# Table of Contents
- [Project Description](#Project-Description)
    - [How it works](#Overview)
- [How to run (Getting Started)](#Getting-Started-with-Create-React-App)
# Project Description

This project is a travel log application that keeps track of your travels. Or it can be used to plan your travels.

## Overview

Built using Svelte, MongoDB, ExpressJS, NodeJS, and Docker.

Svelte for the frontend, which renders the UI, which is styled with the combination of TailWindCSS and raw CSS styling.
MongoDB to store the trips and their itineraries. Hosted on MongoDB Atlas via AWS.
ExpressJS as the backend that handles requests from the Svelte frontend, one express app also serves as communication with the database.
NodeJS is the underlying runtime that Svelte and ExpressJS use.
Docker is to containerize the application using the Microservice Architecture where each of the express apps and the client is a service/container running in the client.

Client can edit their trips and itineraries. This will send post requests through the event-bus, which notifies every service and based on event type of the request, certain services will take action. The server will update database with an location appended event.

# Note: You should create .env files for the applications to work. Please follow the instructions inside the .env.example files of each folder if they exist. 
Thank you.

# Getting Started with Create React App

To run the application. Make sure you have Node and Docker installed.

- Clone the repo
- Go to project directory where the repo is on local machine in terminal
- Boot up Docker
- In terminal run `docker compose up`

Go to [http://localhost:54214](http://localhost:54214)!
