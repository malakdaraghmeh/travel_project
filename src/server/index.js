require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

// Ensure API keys are available
if (!process.env.GEONAMES_USERNAME || !process.env.WEATHERBIT_API_KEY || !process.env.PIXABAY_API_KEY) {
    console.error("Missing API keys. Check your .env file!");
    process.exit(1); // Stop the server if API keys are missing
}

app.get('/', function (req, res) {
    res.send(`This is server side, Server is running on port ${PORT}`);
});


// API endpoint for trip data
app.post('/api', async (req, res) => {
    const { location, date } = req.body;

    if (!location || !date) {
        return res.status(400).json({ message: "Location and date are required" });
    }

    try {
        //Get location coordinates from GeoNames
        const geoResponse = await axios.get(`http://api.geonames.org/searchJSON`, {
            params: {
                q: location,
                maxRows: 1,
                username: process.env.GEONAMES_USERNAME
            }
        });

        if (!geoResponse.data.geonames.length) {
            return res.status(404).json({ message: "Location not found." });
        }

        const { lat, lng, countryName } = geoResponse.data.geonames[0];

        //Get weather forecast from Weatherbit
        const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
            params: {
                lat,
                lon: lng,
                key: process.env.WEATHERBIT_API_KEY
            }
        });

        if (!weatherResponse.data.data || !weatherResponse.data.data.length) {
            return res.status(404).json({ message: "Weather data not found." });
        }

        const weatherData = weatherResponse.data.data[0];

        //Get image from Pixabay
        const imageResponse = await axios.get(`https://pixabay.com/api/`, {
            params: {
                key: process.env.PIXABAY_API_KEY,
                q: location,
                image_type: "photo"
            }
        });

        const imageUrl = imageResponse.data.hits.length > 0 ? imageResponse.data.hits[0].webformatURL : null;

        //Calculate countdown days
        const tripDate = new Date(date);
        const today = new Date();
        const daysLeft = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));

        // Send response
        res.json({
            location: { city: location, country: countryName, lat, lng },
            weather: { temp: weatherData.temp, description: weatherData.weather.description, date: weatherData.valid_date },
            image: imageUrl,
            countdown: daysLeft
        });

    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ message: "Error fetching data from APIs" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
