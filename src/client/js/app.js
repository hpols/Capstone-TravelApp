// day, hours, minutes, seconds for calculations
const secFactor = 1000;
const minFactor = (secFactor * 60);
const hourFactor = (minFactor * 60);
const dayFactor = (hourFactor * 24);

const counter = document.getElementById('counter');
let travelDate, travelReturn;
let dateInput, returnInput;
let dayValue, returnValue;
let travelReady = false;
let returnReady = false;

let dateEntered, returnEntered, cityEntered, ctryEntered;

function updateTravelInfo() {
	dateInput = document.getElementById('traveldate').value;
	returnInput = document.getElementById('travelreturn').value;

	console.log("dateInput: " + dateInput)
	if(dateInput != "" && dateInput != "yyyy-mm-dd") {
		travelDate = new Date(dateInput).getTime();
		travelReady = true;
	} 
	if (returnInput != "" && returnInput != "yyyy-mm-dd") {
		travelReturn = new Date(returnInput).getTime();
		returnReady = true;
	}
	
	let now = new Date().getTime();// Capture current time
	let timeLeft = travelDate - now; //how much time is left before the travel date?
	let timeDuration = travelReturn - travelDate;

	// Time calculations for days, hours, minutes and seconds
	dayValue = Math.floor(timeLeft / dayFactor);
	returnValue = Math.floor(timeDuration / dayFactor);

	counter.innerHTML += `${dayValue} more days then you're off to enjoy your ${returnValue}-day stay.`
	
	Client.getWeather();
}		

export {
	updateTravelInfo,
	dayValue,
	dateInput, returnInput
}