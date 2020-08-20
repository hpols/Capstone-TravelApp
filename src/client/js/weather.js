// JavaScript Document
let weatherInfo = document.getElementById('weather-info');

function getWeather() {
	event.preventDefault;
	
	if (Client.dayValue > 16) {
		weatherInfo.innerHTML = "It's too early. The weather Gods haven't decided yet."
	} else {
		
		callWeather('http://localhost:8000/weather', {
			lat: Client.lat,
			long: Client.long
		})
		.then(function(res){
			console.log(res);
			let weatherToDisplay = res.data.filter(function(e){
				return Date.parse(e.valid_date) >= Date.parse(Client.dateInput);
			});
			
			console.log(weatherToDisplay);
			weatherInfo.innerHTML = 'Here is the available weather forecast for your stay';
			for (const weatherData of weatherToDisplay) {
				weatherInfo.innerHTML += `<div><img src="media/weatherbit_icons/${weatherData.weather.icon}.png" 
										alt="${weatherData.weather.description}">
										<p>${weatherData.temp}°C</p>
										<p>${weatherData.valid_date}</p>
										</div>`;
			}
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