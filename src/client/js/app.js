// day, hours, minutes, seconds for calculations
const secFactor = 1000;
const minFactor = (secFactor * 60);
const hourFactor = (minFactor * 60);
const dayFactor = (hourFactor * 24);

let dateInput, returnInput;
let dayValue, returnValue;	

document.getElementById('travelreturn').addEventListener('focusout', function(){
	dateInput = document.getElementById('traveldate').value;
	returnInput = document.getElementById('travelreturn').value;
	
	let travelDate, travelReturn;

	console.log("dateInput: " + dateInput)
	if(dateInput != "" && dateInput != "yyyy-mm-dd") {
		travelDate = new Date(dateInput).getTime();
	} 
	if (returnInput != "" && returnInput != "yyyy-mm-dd") {
		travelReturn = new Date(returnInput).getTime();
	}
	
	let now = new Date().getTime();// Capture current time
	let timeLeft = travelDate - now; //how much time is left before the travel date?
	let timeDuration = travelReturn - travelDate;

	// Time calculations for days, hours, minutes and seconds
	dayValue = Math.floor(timeLeft / dayFactor);
	returnValue = Math.floor(timeDuration / dayFactor);

	const counter = document.getElementById('counter');
	counter.innerHTML = ""; //remove entries, incase it has already been called
	counter.innerHTML += `${dayValue} more days then you're off to enjoy your ${returnValue}-day stay.`
	
	Client.getWeather();
})

export {
	dayValue,
	dateInput, returnInput
}