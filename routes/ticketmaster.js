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
        const eventData = ticketMasterResponse.data._embedded.events[0];
        //extract data 

        const eventDetails = {
            name: eventData.name,
            id: eventData.id,
            address: `${eventData._embedded.venues[0].address.line1},${eventData._embedded.venues[0].city.name}`,
            link: eventData.url,
        }

        // use the address from eventdetails to fectch geocode

        const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(eventDetails.address)}&key=${googleApiKey}`;
        const geoResponse = await axios.get(googleMapsUrl);
        const geoLocation = geoResponse.data.results[0];
        const formattedAddress = geoLocation.formatted_address;
        const latitude = geoLocation.geometry.location.lat;
        const longitude = geoLocation.geometry.location.lng;

        eventDetails.formatted_address = formattedAddress;
        eventDetails.geometry = `${latitude},${longitude}`;

        const htmlResponse = `
              <p><strong>Event Name:</strong> ${eventDetails.name}</p>
              <p><strong>Event ID:</strong> ${eventDetails.id}</p>
              <p><strong>Address:</strong> ${eventDetails.formatted_address}</p>
              <p><strong>Link:</strong> <a href="${eventDetails.link}">${eventDetails.link}</a></p>
              <p><strong>Geolocation:</strong> ${eventDetails.geometry}</p>
               `;

        res.send(htmlResponse);
        //return res.json(response.data); // return the whole data 
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occur");
    }
})

module.exports = router;

