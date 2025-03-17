# Travel App Project

## Description
The Travel App is a web application that allows users to book trips by entering their destination and travel date. The app retrieves location details, weather forecasts, and relevant images using external APIs.

## Features
- User friendly interface.
- Users can enter their destination and departing date into a form.
- Upon submission, the data is sent to the server for processing.
- The server interacts with three APIs to fetch:
  - An image of the entered location.
  - The weather forecast for the selected date.
- The retrieved information is displayed on the UI for the user.

## Installation
-Clone the repository:
  https://github.com/SanaEhab/travelApp.git

-Install dependencies: 
  npm install

-Create a .env file in the root directory and add the required API keys:
  GEONAMES_USERNAME=sanaehab
  PIXABAY_API_KEY=49211657-467e88deb508730bf78393941
  WEATHERBIT_API_KEY=50ba7d602327475594b71414373d533d

## Usage
-Development mode
  to run the app with dev mode:
  npm run build-dev

-Production mode
  to run the app with prod mode:
  npm run build-prod

-Running the server
  start the backend server:
  npm start

-Testing
  This project includes Jest tests for the form and the server.
  To run the tests:
  npm test

## Technologies
-Node.js v20.17.0

-Express.js for backend server

-Webpack for module bundling

-Axios for making API requests

-Jest for testing

-CSS & HTML for the frontend

## API Configuration
POST /api

-Request body:
  {
  "location": "New York",
  "date": "2025-06-15"
  }

-Response:
  {
  "location": { "city": "New York", "country": "USA", "lat": 40.7128, "lng": -74.0060 },
  "weather": { "temp": 22, "description": "Clear sky", "date": "2025-06-15" },
  "image": "https://example.com/image.jpg",
  "countdown": 90
  }