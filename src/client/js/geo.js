// Based off of: http://www.geonames.org/export/ajax-postalcode-autocomplete.html

// postalcodes is filled by the JSON callback and used by the mouse event handlers of the suggest box
var postalcodes;
const placeInput = document.getElementById("placeInput"); 
const suggestionBox = document.getElementById('suggestBoxElement');
const countrySelectors = document.getElementById("countrySelect");

let lat, long;

// Once the user leaves the postal code input field this function is called to retrieve an array of places from geonames.org JSON
// for the given postal code 
function postalCodeLookup() {

  var country = document.getElementById("countrySelect").value;

//  if (geonamesPostalCodeCountries.toString().search(country) == -1) {
//     return; // selected country not supported by geonames
//  }
  // display 'loading' in suggest box
  suggestionBox.style.visibility = 'visible';
  suggestionBox.innerHTML = '<small><i>loading ...</i></small>';

  var postalcode = document.getElementById("postalcodeInput").value;

	//example: http://api.geonames.org/postalCodeLookupJSON?postalcode=6600&country=AT&username=demo
  var request = 'http://api.geonames.org/postalCodeLookupJSON?postalcode=' + postalcode + '&country=' + country + '&username=atschpe';
	
	retrieveData(request)
	.then(function(receivedData) {
  if (receivedData == null) {
    return;// There was a problem parsing search results
  }

  // save place array in 'postalcodes' to make it accessible from mouse event handlers
  postalcodes = receivedData.postalcodes;
    	
  if (postalcodes.length > 1) {
    // Make suggestion box visible and display the options
    document.getElementById('suggestBoxElement').style.visibility = 'visible';
    var suggestBoxHTML  = '';
    // iterate over places and build suggest box content
	  let id = 0;
	  for(const postalcode of postalcodes) {
		// for every postalcode record we create a html div with incremental id for later retrieval 
      	// define mouse event handlers to highlight places on mouseover and to select a place on click
		  suggestBoxHTML += `<div class='suggestions' id='pcId${id}' onmousedown='Client.suggestBoxMouseDown("${id}")' onmouseover='Client.suggestBoxMouseOver("${id}")' onmouseout='Client.suggestBoxMouseOut("${id}")'> ${postalcode.countryCode} ${postalcode.postalcode}   ${postalcode.placeName }</div>`;
		 
		  id++
	  }
    // display suggest box
    suggestionBox.innerHTML = suggestBoxHTML;
  } else {
    if (postalcodes.length == 1) {
      // The postalcode only refers to one place so directly fill the form 
      placeInput.value = postalcodes[0].placeName;
		setLongLat(postalcodes);
    }
      closeSuggestBox();
	  
  }
	});
}

function closeSuggestBox() {
	suggestionBox.innerHTML = '';
  	suggestionBox.style.visibility = 'hidden';
}

function setLongLat(postalcodeData) {
	lat = postalcodeData[0].lat; //populate the variables so the data can be retrieved
	long = postalcodeData[0].lng;
	document.getElementById('latitude').value = lat;
	document.getElementById('longitude').value = long;	
}

// remove highlight on mouse out event
function suggestBoxMouseOut(obj) {
	if (obj != "") {
		document.getElementById('pcId'+ obj).className = 'suggestions';
	}
}

// the user has selected a place name from the suggest box
function suggestBoxMouseDown(obj) {
  closeSuggestBox();
  placeInput.value = postalcodes[obj].placeName;
}

// function to highlight places on mouse over event
function suggestBoxMouseOver(obj) {
  document.getElementById('pcId'+ obj).className = 'suggestionMouseOver';
}

//ASYNC get from API
const retrieveData = async (url= ' ') => {
	const request = await fetch(url);
	
	try {
		const receivedData =  await request.json();
		console.log(receivedData);
		return receivedData;
	} catch (error) {
		console.log('error', error);
	}
}

// set the country of the user's ip (included in geonamesData.js) as selected country 
// in the country select box of the address form
function setDefaultCountry() {
  for (const countrySelector of countrySelectors) {
    // the javascript geonamesData.js contains the countrycode
    // of the userIp in the variable 'geonamesUserIpCountryCode'
    if (countrySelector.value == geonamesUserIpCountryCode) {
      // set the country selectionfield
      countrySelectors.selectedIndex = i;
    }
  }
}

function populateCountrySelector() {
	console.log("polpulate Selector called")
	retrieveData('http://api.geonames.org/countryInfoJSON?username=atschpe')	
	.then(function (countries){
		if(countries == null) {
			return; //something went wrong
		}
		console.log(countries)
		for (const country of countries.geonames) {
			//example: <option value="AE"> United Arab Emirates</option>
			countrySelectors.innerHTML += `<option value="${country.countryCode}"> ${country.countryName}</option>`;
		}
					 
	}).then(setDefaultCountry());
}

export {
	setDefaultCountry,
	populateCountrySelector,
	postalCodeLookup,
	suggestBoxMouseDown,
	suggestBoxMouseOut,
	suggestBoxMouseOver,
	closeSuggestBox,
	lat, long
}