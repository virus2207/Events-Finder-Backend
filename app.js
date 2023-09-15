const express = require('express');
const externalRoute = require('./routes/route')
const ticketmaster = require('./routes/ticketmaster')
const restaurantRoute = require('./routes/restaurant')
const axios = require('axios');
require('dotenv').config();
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;
app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
    res.send("Hello Express!")
});

app.get('/map', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API; // Get your API key from environment variables
        const response = await axios.get(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`);
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/events', ticketmaster);


app.use('/search', externalRoute);

app.use('/restaurant', restaurantRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})