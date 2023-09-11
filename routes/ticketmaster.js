const axios = require('axios');
var express = require('express');
var router = express.Router();
require('dotenv').config();

const ticketmaster_api = process.env.TICKET_MASTER_API;
const googleApiKey = process.env.GOOGLE_API;

router.get('/events', async function (req, res) {
    try {

        //const size = 10;
        const city = 'Brisbane';
        const ticketmaster_url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmaster_api}&city=${city}`

        const ticketMasterResponse = await axios.get(ticketmaster_url);
        const eventData = ticketMasterResponse.data._embedded.events;
        //extract data 
        const eventDetailsList = await Promise.all(eventData.map(async (event) => {
            const address = `${event._embedded.venues[0].address.line1},${event._embedded.venues[0].city.name}`;
            images = event.images[2].url;
            const eventDetails = {
                name: event.name,
                id: event.id,
                address: address,
                link: event.url,
                image: images
            }

            const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${eventDetails.address}&key=${googleApiKey}`;
            const geoResponse = await axios.get(googleMapsUrl);
            const geoLocation = geoResponse.data.results[0];
            const formattedAddress = geoLocation.formatted_address;
            const latitude = geoLocation.geometry.location.lat;
            const longitude = geoLocation.geometry.location.lng;

            eventDetails.formatted_address = formattedAddress;
            eventDetails.geometry = `${latitude},${longitude}`;

            return eventDetails;
        }));
        res.json(eventDetailsList)


    } catch (error) {
        console.error(error);
        res.status(500).send("An error occur");
    }
})

module.exports = router;

