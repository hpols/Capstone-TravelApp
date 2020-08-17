/* Global Variables */


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

//entryholder divs
const longDiv = document.getElementById('long');
const latDiv = document.getElementById('lat');

function formSubmit(event) {
	event.preventDefault()
	
	// get input from form field
	if(document.getElementById('city').value != '' || document.getElementById('country').value != '') { // ensure there is text to process
		let cityInput = document.getElementById('city').value; //TODO: UTF8 formatting
		let countryInput = document.getElementById('country').value;
		
		//send input to server for handling and retrieve result
		getGeoInfo('http://localhost:8001/geoInfo', {
			city: cityInput,
			country: countryInput
		})
		.then(function (res) {
			console.log(res);
			document.getElementById('lat').textContent = res.geonames[0].lat;
			document.getElementById('long').textContent= res.geonames[0].lng;
		})
		} else { // request user to enter text 
		document.getElementById('city').placeholder = 'Please try again.'
	}
}

const getGeoInfo = async (url =' ', data = {} ) => {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers : {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
		try { 
			const inputData = await response.json();
			return inputData;
		} catch (error) {
			console.log('error', error);
		}
}

/* From Project 3
//ASYNC post
const postData = async (url =' ', data = {}) => {
	
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers : {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	
	try {
		const newData = await response.json();
		return newData;
	} catch (error) {
		console.log('error', error);
	}
}
//ASYNC get from API
const retrieveData = async (baseUrl, zip, apiKey) => {
	const request = await fetch(baseUrl + zip + apiKey);
	
	try {
		const receivedData =  await request.json();
		console.log(receivedData);
		return receivedData;
	} catch (error) {
		console.log('error', error);
	}
}

//ASYNC get from Local
const updateUI = async () =>{
	const uiRequest = await fetch('/all');
	
	try {
		const localData = await uiRequest.json();
		console.log(localData);
		dateDiv.textContent = localData.date;
		tempDiv.textContent = localData.temperature;
		contentDiv.textContent = localData.userResponse;
	} catch (error) {
		console.log('error', error);
	}
}

//CHAIN: post & get
function postRetrieve() {
	//get user input
	let zip = document.getElementById('zip').value;
	let feeling = document.getElementById('feelings').value;
	
	retrieveData(baseUrl, zip, apiKey) //get data from api
	.then(function(data) {
		postData ('/add', { //bundle user data and api, and store
			temperature: data.main.temp, 
			date: newDate, 
			userResponse: feeling
		})
	})
	.then(updateUI('/data')) //get locally stored data and update ui
	}

document.getElementById('generate').addEventListener('click', postRetrieve);*/

export {
formSubmit
}
