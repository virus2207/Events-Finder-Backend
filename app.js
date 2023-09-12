const express = require('express');
const externalRoute = require('./routes/route')
const ticketmaster = require('./routes/ticketmaster')
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;
app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
    res.send("Hello Express!")
});

app.use('/events', ticketmaster);


app.use('/search', externalRoute);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})