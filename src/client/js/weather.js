// JavaScript Document
let weatherInfo = document.getElementById('weather-info');

function getWeather() {
	event.preventDefault;
	
	if (Client.dayValue > 16) {
		weatherInfo.innerHTML = "It's too early. The weather Gods haven't decided yet."
	} else {
		weatherInfo.innerHTML = "The weather Gods are cooking up your forecast."
		console.log("Your latitude: "+ Client.lat + ", and your longitude: " + Client.long)
		callWeather('http://localhost:8000/weather', {
			lat: Client.lat,
			long: Client.long
		})
		.then(function(res){
			console.log(res);
			/*let neededData;
			for(entry of res){
				if (entry.data.valid_date == Client.travelDate){
					neededData = entry;
				}	
			}
			document.weatherInfo.textContent = neededData.weather.description;*/
		})
	}
}

const callWeather = async (url = ' ', data = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	try {
		const weatherData = await response.json();
		return weatherData;
	} catch (error) {
		console.log('error', error);
	}
}

export {
getWeather
}