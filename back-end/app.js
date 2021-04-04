// import and instantiate express
const express = require("express") // CommonJS import style!
const morgan = require("morgan") // middleware for nice logging of incoming HTTP requests
const axios = require("axios")
const cors = require('cors');

const app = express() // instantiate an Express object

app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

// we will put some server logic here later...

/* Recommendations Page Routes */
app.post("/api/recommendations", (req, res) => {
    
    // now we have the data
    recForm = req.body;

    // if flight data
    if (recForm['topic']==0) {
        // if flight, we use skyscanner api to get flight information
        // will add functionality to choose airports later and budget

        var options = {
            method: 'GET',
            url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/JFK-sky/LHR-sky/' + recForm['date'],
            headers: {
            'x-rapidapi-key': '48b6700027mshf2353e12af2853bp1e9d9fjsn189a7bf51c0b',
            'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
            }
        };
                
        axios.request(options).then(function (response) {
            let results = [];

            resultsJSON = response.data;

            for (const item in resultsJSON['Quotes']) {
                let newResult = new Object();
                newResult.date = resultsJSON['Quotes'][item]["OutboundLeg"].DepartureDate.slice(0,10);
                newResult.from_country = resultsJSON['Places'][0].IataCode;
                newResult.to_country = resultsJSON['Places'][1].IataCode;
                newResult.cost = resultsJSON['Quotes'][item].MinPrice;
                newResult.url = "http://example.org";

                results.push(newResult);
              }

            console.log(results);
            res.json(results);
        }).catch(function (error) {
            console.error(error);
        });
    }
  })

/* Past Trips Page Routes */
// An api endpoint that returns list of past trips
app.get('/api/pasttrips', (req,res) => {

    /*
    Once mongoose is setup, we would retrieve the data of past trips stored by unique user id. However, as we don't
    mongo set up, I just retrieve mock data from mockaroo.
    */
    axios
    .get("https://my.api.mockaroo.com/past-trips.json?key=8f9d78c0")
    .then(pastTrips => {
        
        res.json(pastTrips.data);
        console.log('Retrieved past trips');
        }) // pass data along directly to client
    .catch(err => next(err)) // pass any errors to express
});

/* Create Post Page Routes */
app.post("/api/createpost", (req, res) => {
    
    // now we have the data
    recForm = req.body;

    // now, we would use mongoose to save the post data in a database. But to prove the back-end
    // is working, I output the post data to the console of the server.
    console.log(recForm);
    res.end();
    
});

// export the express app we created to make it available to other modules
module.exports = app