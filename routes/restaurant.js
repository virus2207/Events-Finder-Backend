const axios = require('axios');
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Define your Yelp API credentials as environment variables
const YELP_API = process.env.YELP_API;
router.get('/:lat/:lang', async function (req, res) {
    const latitude = req.params.lat;
    const longitude = req.params.lang;

    try {
        const options = {
            method: 'GET',
            url: `https://api.yelp.com/v3/businesses/search?location=%20&latitude=${latitude}&longitude=${longitude}&term=restaurants%20&radius=1000&categories=&open_now=true&sort_by=rating&limit=10`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${YELP_API}`,
            }
        };

        axios
            .request(options)
            .then(function (response) {

                const responseData = response.data.businesses;
                const restaurantInfo = responseData.map((data) => ({

                    name: data.id,
                    name: data.name,
                    rating: data.rating,
                    distance: data.distance,
                    address: data.location.display_address.join(', '), // Combine address components
                    phone: data.display_phone || 'N/A', // Use 'N/A' if phone is not available              
                    price: data.price || 'N/A', // Use 'N/A' if price is not available
                    image_url: data.image_url || 'N/A', // Use 'N/A' if image URL is not available
                    url: data.url || 'N/A', // Use 'N/A' if URL is not available
                }))
                // res.json(response.data);
                res.json(restaurantInfo)
            })
            .catch(function (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred' });
            })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
