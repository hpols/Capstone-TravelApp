// day, hours, minutes, seconds for calculations
const secFactor = 1000;
const minFactor = (secFactor * 60);
const hourFactor = (minFactor * 60);
const dayFactor = (hourFactor * 24);

const counter = document.getElementById('counter');
let travelDate, travelReturn;
let dateInput, returnInput;
let dayValue;

function startCounter() {
	dateInput = document.getElementById('traveldate').value;

	console.log("dateInput: " + dateInput)
	if(dateInput != "" && dateInput != "yyyy-mm-dd") {
		
		travelDate = new Date(dateInput).getTime();
		
		countdown();
	} 
}

function getTravelTime() {
	returnInput = document.getElementById('travelreturn').value;
	countdown(); //update to show amount of days
}

function countdown() {
  	let now = new Date().getTime();// Capture current time
	let timeLeft = travelDate - now; //how much time is left before the travel date?

  	// Time calculations for days, hours, minutes and seconds
	dayValue = Math.floor(timeLeft / dayFactor);

	// Display the result in the element with id="counter"
	counter.innerHTML = `You will be departing in ${dayValue} days`;
	if(!getTravelTime) { //ToDO: doesn't show up
		counter.innerHTML += ` for ${returnInput} glorious days in ${Client.selectedCity}, ${Client.selectedCountry}.`
	} else {
		counter.innerHTML += ` for ${Client.selectedCity}, ${Client.selectedCountry}.`
	}

  // If the count down is finished, remove counter 
  if (timeLeft < 0) {
    clearInterval(countdown());
    counter.innerHTML = '';
  }
}
// JavaScript Document

export {
	startCounter,
	dayValue,
	dateInput,
	getTravelTime
}