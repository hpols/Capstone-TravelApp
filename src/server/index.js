// Setup empty JS object to act as endpoint for all routes
projectData = {};

const dotenv = require('dotenv');
dotenv.config();
const fetch = require('node-fetch');
const path = require('path')

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

const bodyParser = require('body-parser');
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8001;
const server = app.listen(port, listening);

function listening() {
	console.log('server is running');
	console.log(`running on localhost: ${port}`);
}

console.log(__dirname)

app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

//GET Route:
app.get('/all', sendData);
function sendData(req, res){
	res.send(projectData);
} 

//POST Route receiving: temperature – date – user response
app.post('/add', callback);
function callback(req, res){
	projectData = {
		temperature: req.body.temperature,
		date: req.body.date,
		userResponse: req.body.userResponse
	}
	res.send(projectData);
}

//POST new data:
const newData = [];
app.post('/data', addData);
function addData(req, res){
	newData.push(req.body);
}

//example query: http://api.geonames.org/searchJSON?q=london&country=GB&maxRows=1&username=atschpe
const baseUrl = 'http://api.geonames.org/searchJSON?q=';
const countryHolder = '&countryName=';
const searchLimiter = '&maxRows=1'; //only get fist entry
const usr = '&username=atschpe';
app.post('/geoInfo', async function(req, res){
	const request = await fetch (baseUrl + encodeURIComponent(req.body.city) + countryHolder + encodeURIComponent(req.body.country) + searchLimiter + usr)
	try {
			const receivedData = await request.json();
			res.send(receivedData);
		} catch (error) {
			console.log('error', error);
			//TODO: send something back to flag the error
		}
})