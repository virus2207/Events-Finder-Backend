const express = require('express');
const externalRoute = require('./routes/route')
const ticketmaster = require('./routes/ticketmaster')
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Hello Express!")
});

app.use('/ticketmaster', ticketmaster);


app.use('/search', externalRoute);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})