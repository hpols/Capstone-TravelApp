// Based off of: http://www.geonames.org/export/ajax-postalcode-autocomplete.html

// postalcodes is filled by the JSON callback and used by the mouse event handlers of the suggest box
var postalcodes;
const suggestionBox = document.getElementById('suggestBoxElement');

// this function will be called by our JSON callback
// the parameter receivedData will contain an array with postalcode objects
function getLocation(receivedData) {
	console.log(receivedData)
  if (receivedData == null) {
    return;// There was a problem parsing search results
  }

  // save place array in 'postalcodes' to make it accessible from mouse event handlers
  postalcodes = receivedData.postalcodes;
	console.log(postalcodes)
    	
  if (postalcodes.length > 1) {
    // we got several places for the postalcode
    // make suggest box visible
    document.getElementById('suggestBoxElement').style.visibility = 'visible';
    var suggestBoxHTML  = '';
    // iterate over places and build suggest box content
	  let id = 0;
	  for(const postcode of postcodes) {
		// for every postalcode record we create a html div with incremental id for later retrieval 
      	// define mouse event handlers to highlight places on mouseover and to select a place on click
		  suggestBoxHTML += "<div class='suggestions' id=pcId" + id + " onmousedown='Client.suggestBoxMouseDown(" + id +")' onmouseover='Client.suggestBoxMouseOver(" +  id +")' onmouseout='Client.suggestBoxMouseOut(" + id +")'> " + postalcode.countryCode + ' ' + postalcode.postalcode + '    ' + postalcode.placeName  +'</div>';
		 
		  id++
	  }
    // display suggest box
    suggestionBox.innerHTML = suggestBoxHTML;
  } else {
    if (postalcodes.length == 1) {
      // exactly one place for postalcode
      // directly fill the form, no suggest box required 
      var placeInput = document.getElementById("placeInput");
      placeInput.value = postalcodes[0].placeName;
    }
    closeSuggestBox();
  }
}

function closeSuggestBox() {
	suggestionBox.innerHTML = '';
  	suggestionBox.style.visibility = 'hidden';
}

// remove highlight on mouse out event
function suggestBoxMouseOut(obj) {
  document.getElementById('pcId'+ obj).className = 'suggestions';
}

// the user has selected a place name from the suggest box
function suggestBoxMouseDown(obj) {
  closeSuggestBox();
  var placeInput = document.getElementById("placeInput");
  placeInput.value = postalcodes[obj].placeName;
}

// function to highlight places on mouse over event
function suggestBoxMouseOver(obj) {
  document.getElementById('pcId'+ obj).className = 'suggestionMouseOver';
}


// Once the user leaves the postal code input field this function is called to retrieve an array of places from geonames.org JSON
// for the given postal code 
function postalCodeLookup() {

  var country = document.getElementById("countrySelect").value;

  if (geonamesPostalCodeCountries.toString().search(country) == -1) {
     return; // selected country not supported by geonames
  }
  // display 'loading' in suggest box
  suggestionBox.style.visibility = 'visible';
  suggestionBox.innerHTML = '<small><i>loading ...</i></small>';

  var postalcode = document.getElementById("postalcodeInput").value;

	//example: http://api.geonames.org/postalCodeLookupJSON?postalcode=6600&country=AT&username=demo
  var request = 'http://api.geonames.org/postalCodeLookupJSON?postalcode=' + postalcode + '&country=' + country + '&username=atschpe';
	
	retrieveData(request)
	.then(getLocation(data));
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
  var countrySelect = document.getElementById("countrySelect");
  for (var i=0;i< countrySelect.length;i++) {
    // the javascript geonamesData.js contains the countrycode
    // of the userIp in the variable 'geonamesUserIpCountryCode'
    if (countrySelect[i].value == geonamesUserIpCountryCode) {
      // set the country selectionfield
      countrySelect.selectedIndex = i;
    }
  }
}

export {
	setDefaultCountry,
	postalCodeLookup,
	suggestBoxMouseDown,
	suggestBoxMouseOut,
	suggestBoxMouseOver,
	closeSuggestBox
}