// Based off of: http://www.geonames.org/export/ajax-postalcode-autocomplete.html 
// && https://www.w3schools.com/howto/howto_js_autocomplete.asp

// postalcodes is filled by the JSON callback and used by the mouse event handlers of the suggest box
let postalcodes;
const placeInput = document.getElementById("placeInput"); 
const suggestionBox = document.getElementById('cityBoxElement');
const countrySelectors = document.getElementById("myInput");

let countriesFromGeo;
let selectedCountry;
let lat, long, ctry, city; //to export data to other js files etc.
let inFocus; //for selectors

function getCountryCode(countryArray, selected) {
	for(const arrItems of countryArray) {
		 if (arrItems.country == selected) {
			 return arrItems.code;
		 }
	}
}

// On leaving the postal code input field this function retrieves an array of places from geonames.org JSON
// for the given postal code 
function postalCodeLookup() {
  /*display 'loading' in suggest box
  suggestionBox.style.visibility = 'visible';
  suggestionBox.innerHTML = '<small><i>loading ...</i></small>';*/

  var postalcode = document.getElementById("postalcodeInput").value;

	//example: http://api.geonames.org/postalCodeLookupJSON?postalcode=6600&country=AT&username=demo
  var request = 'http://api.geonames.org/postalCodeLookupJSON?postalcode=' + postalcode + '&country=' + selectedCountry + '&username=atschpe';
	
	retrieveData(request)
	.then(function(receivedData) {
  if (receivedData == null) {
    return;// There was a problem parsing search results
  }

  // save place array in 'postalcodes' to make it accessible from mouse event handlers
  postalcodes = receivedData.postalcodes;
    	let citySelBox, citySelItem;
		if (!postalcodes) { 
			  return false; //something went wrong
		  }
  if (postalcodes.length > 1) {
      inFocus = -1;
      citySelBox = document.createElement("DIV"); // create a DIV to hold the possible values
      citySelBox.setAttribute("id", citySelBox.id + "city-list");
      citySelBox.setAttribute("class", "autocomplete-items");
      placeInput.parentNode.appendChild(citySelBox); //apend DIV to the city container
	  
    /*Make suggestion box visible and display the options
    document.getElementById('cityBoxElement').style.visibility = 'visible';
    var cityBoxHTML  = '';*/
	  
    // iterate over places and build suggest box content
	  let id = 0;
	  for(const postalcode of postalcodes) {
		  citySelItem = document.createElement("DIV"); //one div for each possible match
			//bold matching letters of option and provide hidden carrier with all needed info incase it is selected
          citySelItem.innerHTML = `${postalcode.countryCode} ${postalcode.postalcode}   ${postalcode.placeName }<input type='hidden' value='${postalcode.placeName }' id='${postalcode.countryCode}'>`;
          citySelItem.addEventListener("click", function(e) { //user has selected an item
              // get needed data to display & store
              placeInputInput.value = this.getElementsByTagName("input")[0].value;
			  city = placeInput.value;
			  selectedCountry = this.getElementsByTagName("input")[0].id;
              closeAllLists(); //cose list(s)
          });
          citySelBox.appendChild(citySelItem);
		  
		/*  
		// for every postalcode record we create a html div with incremental id for later retrieval 
      	// define mouse event handlers to highlight places on mouseover and to select a place on click
		cityBoxHTML += `<div class='citySuggested' id='pcId${id}' onmousedown='Client.cityBoxMouseDown("${id}")' onmouseover='Client.cityBoxMouseOver("${id}")' onmouseout='Client.cityBoxMouseOut("${id}")'> ${postalcode.countryCode} ${postalcode.postalcode}   ${postalcode.placeName }</div>`;
		id++*/
	  }

    /*display suggest box
    suggestionBox.innerHTML = cityBoxHTML;*/
  } else {
    if (postalcodes.length == 1) {
      // The postalcode only refers to one place so directly fill the form 
      placeInput.value = postalcodes[0].placeName;
		city = placeInput.value;
		setLongLat(postalcodes[0]);
    }
      closeCityBox();
	  
  }
	});
}

function closeCityBox() {
	suggestionBox.innerHTML = '';
  	suggestionBox.style.visibility = 'hidden';
}

function setLongLat(postalcodeData) {
	lat = postalcodeData.lat; //populate the variables so the data can be retrieved
	long = postalcodeData.lng;	
}

// remove highlight on mouse out event
function cityBoxMouseOut(obj) {
	if (obj != "") {
		document.getElementById('pcId'+ obj).className = 'suggestions';
	}
}

// the user has selected a place name from the suggest box
function cityBoxMouseDown(obj) {
  closeCityBox();
  placeInput.value = postalcodes[obj].placeName;
	city = placeInput.value;
  setLongLat(postalcodes[obj]);
}

// function to highlight places on mouse over event
function cityBoxMouseOver(obj) {
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

// AUTOCOMPLETE COUNTRY INPUT taking in the textfield and an array of possible values for the autocomplete
function autocomplete(autoInput, arr) {
  autoInput.addEventListener("input", function(e) { //when user starts writing in the input field
      let selBox, selItem, inputValue = this.value;
      closeAllLists(); //work from a clean slate (no lists open to begin with)
		  if (!inputValue) { 
			  return false;
		  }
      inFocus = -1;
      selBox = document.createElement("DIV"); // create a DIV to hold the possible values
      selBox.setAttribute("id", this.id + "autocomplete-list");
      selBox.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(selBox); //apend DIV to the autocomplete container
	  
	retrieveData('http://api.geonames.org/countryInfoJSON?username=atschpe')	
	.then(function (countries){
		if(countries == null) {
			return; //something went wrong
		}
		for (const country of countries.geonames) {
			/*check if the item starts with the same letters as the text field value:*/
			countriesFromGeo = {
				code : country.countryCode,
				name : country.countryName}
        if (countriesFromGeo.name.substr(0, inputValue.length).toUpperCase() == inputValue.toUpperCase()) {
          selItem = document.createElement("DIV"); //one div for each possible match
			//bold matching letters of option and provide hidden carrier with all needed info incase it is selected
          selItem.innerHTML = `<strong>${countriesFromGeo.name.substr(0, inputValue.length)}</strong>${countriesFromGeo.name.substr(inputValue.length)}<input type='hidden' value='${countriesFromGeo.name}' id='${countriesFromGeo.code}'>`;
          selItem.addEventListener("click", function(e) { //user has selected an item
              // get needed data to display & store
              autoInput.value = this.getElementsByTagName("input")[0].value;
			  ctry = autoInput.value;
			  selectedCountry = this.getElementsByTagName("input")[0].id;
              closeAllLists(); //cose list(s)
          });
          selBox.appendChild(selItem);
        }
		}				 
	});
  });
  // handle keyboard events
  autoInput.addEventListener("keydown", function(ev) {
      var autoList = document.getElementById(this.id + "autocomplete-list");
      if (autoList) autoList = autoList.getElementsByTagName("div");
      if (ev.keyCode == 40) {//Arrow Down
        inFocus++; //increase by a step
        addActive(autoList);//activate current item
      } else if (ev.keyCode == 38) { //Arrow Up
        inFocus--; //decrease by a step
        addActive(autoList);//activate current item
      } else if (ev.keyCode == 13) {//Enter Key
        ev.preventDefault();
        if (inFocus > -1) {
          if (autoList) autoList[inFocus].click();//simulate click on active item
        }
      }
  });
  
  function closeAllLists(el) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var autoItems = document.getElementsByClassName("autocomplete-items");
    for (const autoItem of autoItems) {
      if (el != autoItem && el != autoInput) {
        autoItem.parentNode.removeChild(autoItem);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

//Autocomplete function is triggered when typing in country field. Pass in countries array as possible autocomplete values
autocomplete(countrySelectors, countriesFromGeo);

export {
	autocomplete,
	postalCodeLookup,
	cityBoxMouseDown,
	cityBoxMouseOut,
	cityBoxMouseOver,
	closeCityBox,
	lat, long, ctry, city
}