const axios = require('axios');
var express = require('express');
var router = express.Router();
require('dotenv').config();

const ticketmaster_api = process.env.TICKET_MASTER_API;
const googleApiKey = process.env.GOOGLE_API;



const TICKET_MASTER_API = process.env.TICKET_MASTER_API?.trim();
const GOOGLE_API_KEY = process.env.GOOGLE_API?.trim();

const TICKET_MASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const GOOGLE_GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_DIRECTIONS_BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

const NO_RESULTS_MESSAGE = "No events found for the city";
const NO_ADDRESS_RESULTS_MESSAGE = "No results found for the given address";
const MISSING_PARAMETERS_MESSAGE = "Latitude, longitude, and startpoint parameters are required";
const ERROR_MESSAGE = "An error occurred";

// Reusable error handler
function handleError(res, message, status = 500) {
    console.error(message);
    res.status(status).send(message);
}

router.get('/:city', async function (req, res) {
    try {


        //const size = 10;
        const city = req.params.city;
        const ticketmaster_url = `${TICKET_MASTER_BASE_URL}?apikey=${ticketmaster_api}&city=${city}`

        const ticketMasterResponse = await axios.get(ticketmaster_url);
        if (ticketMasterResponse.data.page.totalElements === 0) {
            return res.status(404).json({ message: NO_RESULTS_MESSAGE });
        }

        const eventData = ticketMasterResponse.data._embedded.events;
        //extract data 
        const eventDetailsList = await Promise.all(eventData.map(async (event) => {

            if (!event._embedded.venues || event._embedded.venues.length === 0) {
                // Venue information is missing for this event, handle this case as needed
                return null;
            }
            const address = event._embedded.venues[0].address ? event._embedded.venues[0].address.line1 : '';
            const city = event._embedded.venues[0].city ? event._embedded.venues[0].city.name : '';
            images = event.images[2].url;
            const eventDetails = {
                name: event.name,
                id: event.id,
                address: address + city,
                link: event.url,
                image: images,
                date: event.dates.start.localDate,
                time: event.dates.start.localTime,
                venue: event._embedded.venues[0].name
            }

            const googleMapsUrl = `${GOOGLE_GEOCODE_BASE_URL}?address=${eventDetails.address}&key=${googleApiKey}`;
            const geoResponse = await axios.get(googleMapsUrl);

            if (geoResponse.data.results.length === 0) {
                // Handle the case where no results are found 
                console.error(NO_ADDRESS_RESULTS_MESSAGE);
                return null;
            }
            const geoLocation = geoResponse.data.results[0];
            const formattedAddress = geoLocation.formatted_address;
            const latitude = geoLocation.geometry.location.lat;
            const longitude = geoLocation.geometry.location.lng;

            eventDetails.formatted_address = formattedAddress;
            eventDetails.latitude = latitude;
            eventDetails.longitude = longitude;
            eventDetails.geometry = `${latitude},${longitude}`;
            return eventDetails;
        }));

        const filteredEventDetailsList = eventDetailsList.filter(event => event !== null);

        res.json(filteredEventDetailsList);

    } catch (error) {
        handleError(res, ERROR_MESSAGE)
    }
})

router.get('/direction/:start/:geometry', async function (req, res) {
    try {
        const geometry = req.params.geometry;
        const start = req.params.start;
        if (!geometry || !start) {
            return res.status(400).send(MISSING_PARAMETERS_MESSAGE)
        }

        // Use lat, long, and startpoint from the query parameters to construct the Google Maps URL
        const googleMapDirection = await axios.get(`${GOOGLE_DIRECTIONS_BASE_URL}?origin=${start}&destination=${geometry}&key=${process.env.GOOGLE_API}`);

        // Handle the googleMapDirection response here
        res.json(googleMapDirection.data);
    } catch (error) {
        handleError(res, ERROR_MESSAGE);
    }
});



module.exports = router;

