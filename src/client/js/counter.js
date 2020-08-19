// day, hours, minutes, seconds for calculations
const secFactor = 1000;
const minFactor = (secFactor * 60);
const hourFactor = (minFactor * 60);
const dayFactor = (hourFactor * 24);

const counter = document.getElementById('counter');
let travelDate = '';

function startCounter() {
	let dateInput = document.getElementById('traveldate').value;

	console.log("dateinput: " + dateInput)
	if(dateInput != "" && dateInput != "yyyy-mm-dd") {
		
		travelDate = new Date(dateInput).getTime();
		console.log("travelDate: " + travelDate)
		
		counter.style.visibility = 'visible';
		countdown();
	} 
}

function countdown() {
	setInterval(function(){
  	var now = new Date().getTime();// Capture current time
	var timeLeft = travelDate - now; //how much time is left before the travel date?

  	// Time calculations for days, hours, minutes and seconds
	var dayValue = Math.floor(timeLeft / dayFactor);
	var hourValue = Math.floor((timeLeft % dayFactor) / hourFactor);
	var minuteValue = Math.floor((timeLeft % hourFactor) / minFactor);
  	var secondValue = Math.floor((timeLeft % minFactor) / secFactor);

  // Display the result in the element with id="counter"
  counter.innerHTML = dayValue + "d " + hourValue + "h "
  + minuteValue + "m " + secondValue + "s ";

  // If the count down is finished, remove counter 
  if (timeLeft < 0) {
    clearInterval(countdown());
    counter.innerHTML = '';
  }
	}, 1000);
}
// JavaScript Document

export {
startCounter
}