const axios = require('axios');
var express = require('express');
var router = express.Router();
require('dotenv').config();

const ticketmaster_api = process.env.TICKET_MASTER_API;
const googleApiKey = process.env.GOOGLE_API;

router.get('/', async function (req, res) {
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
                image: images,
                date: event.dates.start.localDate,
                time: event.dates.start.localTime,
                venue: event._embedded.venues[0].name
            }

            const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${eventDetails.address}&key=${googleApiKey}`;
            const geoResponse = await axios.get(googleMapsUrl);
            const geoLocation = geoResponse.data.results[0];
            const formattedAddress = geoLocation.formatted_address;
            const latitude = geoLocation.geometry.location.lat;
            const longitude = geoLocation.geometry.location.lng;


            eventDetails.formatted_address = formattedAddress;
            eventDetails.geometry = `${latitude},${longitude}`;
            //eventDetails.googleMapLink = `https://maps.googleapis.com/maps/api/directions/json?origin=Brisbane&destination=${eventDetails.geometry}&key=${process.env.GOOGLE_API}`


            return eventDetails;

            //         const htmlResponse = `
            //     <p><strong>Event Name:</strong> ${eventDetails.name}</p>
            //     <p><strong>Event ID:</strong> ${eventDetails.id}</p>
            //     <p><strong>Address:</strong> ${eventDetails.formatted_address}</p>
            //     <!--<p><strong>Google Maps Link:</strong> <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">Open in Google Maps</a></p>-->
            //     <p><strong>Event Image:</strong> <img src="${eventDetails.image}" alt="${eventDetails.name}" width="200"></p>
            //     <p><strong>Event Ticketmaster Link:</strong> <a href="${eventDetails.link}" target="_blank">Buy Tickets</a></p>
            // `;

            //         return htmlResponse;
        }));
        res.json(eventDetailsList);



    } catch (error) {
        console.error(error);
        res.status(500).send("An error occur");
    }
})

router.get('/direction/:start/:geometry', async function (req, res) {
    try {

        const geometry = req.params.geometry;
        const start = req.params.start;
        if (!geometry || !start) {
            return res.status(400).send("Latitude, longitude, and startpoint parameters are required")

        }

        // Use lat, long, and startpoint from the query parameters to construct the Google Maps URL
        const googleMapDirection = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${geometry}&key=${process.env.GOOGLE_API}`);

        // Handle the googleMapDirection response here
        res.json(googleMapDirection.data);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occur");
    }
});

module.exports = router;

