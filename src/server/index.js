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
const port = 8000;
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

// https://api.weatherbit.io/v2.0/forecast/daily&lat=47.891024843906955&lon=7.6554107666015625&key=058d2a3f87d2492c84a485f55f8b7e22
// https://api.weatherbit.io/v2.0/forecast/daily?&lat=38.123&lon=-78.543&key=API_KEY
const baseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const latHolder = '&lat=';
const longHolder = '&lon=';
const keyHolder = '&key=';

app.post('/weather', async function(req, res){
	const request = await fetch (baseUrl + latHolder + req.body.lat + longHolder + req.body.long + keyHolder + process.env.WEATHER_API)
	try {
			const receivedData = await request.json();
			console.log(baseUrl + latHolder + req.body.lat + longHolder + req.body.long + keyHolder + process.env.WEATHER_API + '/' + receivedData);
			res.send(receivedData);
		} catch (error) {
			console.log('error', error);
			//TODO: send something back to flag the error
		}
})