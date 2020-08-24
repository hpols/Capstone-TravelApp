// Based off of: http://www.geonames.org/export/ajax-postalcode-autocomplete.html 
// && https://www.w3schools.com/howto/howto_js_autocomplete.asp

// postalcodes is filled by the JSON callback and used by the mouse event handlers of the suggest box
let postalcodes;
const placeInput = document.getElementById("placeInput"); 
const countryInput = document.getElementById("countryInput");

let lat, long, ctry, city; //to export data to other js files etc.


// –––– HELPER FUNCTIONS –––– //

function setLongLat(postalcodeData) {
	lat = postalcodeData.lat; //populate the variables so the data can be retrieved
	long = postalcodeData.lng;	
}

//see: https://stackoverflow.com/a/32205204/7601437
function getDataId(inputId, datalistId) {
	let val = document.getElementById(inputId).value;
    let opts = document.getElementById(datalistId).childNodes;
    for (const opt of opts) {
      if (opt.value === val) {
		  return opt.getAttribute("data-id");
          break;
      }
    }
}

//ASYNC get from API
const retrieveData = async (url= ' ') => {
	const request = await fetch(url);
	try {
		const receivedData =  await request.json();
		return receivedData;
	} catch (error) {
		console.log('error', error);
	}
}

// –––– MAIN FUNCTIONS –––– //
function countryLookup() {
	retrieveData('http://api.geonames.org/countryInfoJSON?username=atschpe')
	.then(receivedData => {
		if(receivedData == null) {
			return; //there was a problem
		}
		let countryList = document.getElementById("countries");
		let countryLookupList = receivedData.geonames.map(item => {
			countryList.innerHTML += `<option value ="${item.countryName}" data-id="${item.countryCode}"></option>`;
		})
	})
}

// On leaving the postal code input field this function retrieves an array of places from geonames.org JSON
// for the given postal code 
function postalCodeLookup() {
	let postalcode = document.getElementById("postalcodeInput").value;
	let selectedCountry = getDataId('countryInput', 'countries');
	ctry = countryInput.value;

	//example: http://api.geonames.org/postalCodeLookupJSON?postalcode=6600&country=AT&username=demo
	let request = `http://api.geonames.org/postalCodeLookupJSON?postalcode=${postalcode}&country=${selectedCountry}&username=atschpe`;

	retrieveData(request)
	.then(receivedData => {
		if (receivedData == null) {
			return;// There was a problem parsing search results
		}
		postalcodes = receivedData.postalcodes;// save array of 'postalcodes'
		
		let placeList = document.getElementById("places");
		if (postalcodes.length > 1) {
			let postalCodeList = postalcodes.map((item, index) => {
				placeList.innerHTML += `<option value="${item.placeName}" data-id="${index}"></option>`;
			})
		} else {
			if (postalcodes.length == 1) {
				placeInput.value = postalcodes[0].placeName;// The postalcode only refers to one place pop it into the input 
				city = placeInput.value;
				setLongLat(postalcodes[0]);
				Client.getPix();
			} 
	  	}
	});
}

function geoInput() {
	setLongLat(postalcodes[getDataId('placeInput', 'places')]);
	city = placeInput.value;
	ctry = countryInput.value;
	Client.getPix();
}

export {
	geoInput,
	countryLookup,
	postalCodeLookup,
	lat, long, ctry, city,
	retrieveData
}