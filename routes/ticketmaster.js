const axios = require('axios');
var express = require('express');
var router = express.Router();
const googleApiKey = 'AIzaSyBLgpY3NiI5Pb7UBIiQba--daLSWqjJxJg'

router.get('/events', function (req, res) {
    const apiKey = 'tMc8mNOferHfTMgA7851XFFXicq4ZARO';
    //const size = 10;
    const city = 'Brisbane';
    const startDate = '2023-09-10T00:00:00Z'
    const endDate = '2023-09-10';
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}&startDateTime=${startDate}`


    // const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=${size}&city=${city}`

    axios.get(url)
        .then((response) => {

            //extract data 

            // const eventDetails = {
            //     name: response.data._embedded.events[4].name,
            //     id: response.data._embedded.events[0].id,
            //     address: `${response.data._embedded.events[0]._embedded.venues[0].address.line1},${response.data._embedded.events[0]._embedded.venues[0].city.name}`,
            //     link: response.data._embedded.events[0].url,
            // }

            //use the address from eventdetails to fectch geocode 

            // const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(eventDetails.address)}&key=${googleApiKey}`;
            // axios.get(googleMapsUrl)
            //     .then(function (getGeoLocation) {
            //         const formattedAddress = getGeoLocation.data.results[0].formatted_address;
            //         const latitude = getGeoLocation.data.results[0].geometry.location.lat;
            //         const longtitude = getGeoLocation.data.results[0].geometry.location.lng;
            //         eventDetails.formatted_address = formattedAddress;
            //         eventDetails.geometry = `${latitude},${longtitude}`;

            //         const htmlResponse = `
            //   <p><strong>Event Name:</strong> ${eventDetails.name}</p>
            //   <p><strong>Event ID:</strong> ${eventDetails.id}</p>
            //   <p><strong>Address:</strong> ${eventDetails.formatted_address}</p>
            //   <p><strong>Link:</strong> <a href="${eventDetails.link}">${eventDetails.link}</a></p>
            //   <p><strong>Geolocation:</strong> ${eventDetails.geometry}</p>
            //    `;

            return res.json(response.data);
        })
        .catch((error) => {
            console.error(error)
        })
})
//})

module.exports = router;

