// Setup empty JS object to act as endpoint for all routes

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

app.get('/', (req, res) => res.sendFile(path.resolve('src/client/views/index.html')))

//GET Route:
app.get('/all', sendData);
function sendData(req, res){
	res.send(projectData);
} 

//POST new data:
const newData = [];
app.post('/data', addData);
function addData(req, res){
	newData.push(req.body);
}

// https://api.weatherbit.io/v2.0/forecast/daily?&lat=38.123&lon=-78.543&key=API_KEY
app.post('/weather', (req, res) => {
	const request = await fetch (`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.body.lat}&lon=${req.body.long}&key=${process.env.WEATHER_API}`);
	try {
			const receivedData = await request.json();
			res.send(receivedData);
		} catch (error) {
			console.log('weather error: ', error);
		}
})

//https://pixabay.com/api/?key=API_KEY&q=Boston&image_type=photo
app.post('/pix', (req, res) => {
	
	const request = await fetch (`https://pixabay.com/api/?key=${process.env.PIX_API}&q=${req.body.city}+${req.body.country}&image_type=photo`);
	try {
		const receivedData = await request.json();
		res.send(receivedData);
	} catch (error) {
		console.log('pix error: ', error);
	}
})

module.exports = app; //for testing