// Based off of: http://www.geonames.org/export/ajax-postalcode-autocomplete.html 
// && https://www.w3schools.com/howto/howto_js_autocomplete.asp

// postalcodes is filled by the JSON callback and used by the mouse event handlers of the suggest box
let postalcodes;
const placeInput = document.getElementById("placeInput"); 
const suggestionBox = document.getElementById('cityBoxElement');
const countrySelectors = document.getElementById("myInput");

let countriesFromGeo;
let selectedCountry;
let lat, long;

function getCountryCode(countryArray, selected) {
	for(const arrItems of countryArray) {
		 if (arrItems.country == selected) {
			 return arrItems.code;
		 }
	}
}

// Once the user leaves the postal code input field this function is called to retrieve an array of places from geonames.org JSON
// for the given postal code 
function postalCodeLookup() {
  // display 'loading' in suggest box
  suggestionBox.style.visibility = 'visible';
  suggestionBox.innerHTML = '<small><i>loading ...</i></small>';

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
    	
  if (postalcodes.length > 1) {
    // Make suggestion box visible and display the options
    document.getElementById('cityBoxElement').style.visibility = 'visible';
    var cityBoxHTML  = '';
    // iterate over places and build suggest box content
	  let id = 0;
	  for(const postalcode of postalcodes) {
		// for every postalcode record we create a html div with incremental id for later retrieval 
      	// define mouse event handlers to highlight places on mouseover and to select a place on click
		  cityBoxHTML += `<div class='citySuggested' id='pcId${id}' onmousedown='Client.cityBoxMouseDown("${id}")' onmouseover='Client.cityBoxMouseOver("${id}")' onmouseout='Client.cityBoxMouseOut("${id}")'> ${postalcode.countryCode} ${postalcode.postalcode}   ${postalcode.placeName }</div>`;
		 
		  id++
	  }
    // display suggest box
    suggestionBox.innerHTML = cityBoxHTML;
  } else {
    if (postalcodes.length == 1) {
      // The postalcode only refers to one place so directly fill the form 
      placeInput.value = postalcodes[0].placeName;
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
	document.getElementById('latitude').value = lat;
	document.getElementById('longitude').value = long;	
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

// AUTOCOMPLETE COUNTRY INPUT
function autocomplete(autoInput, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  autoInput.addEventListener("input", function(e) {
      var newDiv, childDiv, i, inputValue = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!inputValue) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      newDiv = document.createElement("DIV");
      newDiv.setAttribute("id", this.id + "autocomplete-list");
      newDiv.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(newDiv);
      /*for each item in the array...*/
	  
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
          /*create a DIV element for each matching element:*/
          childDiv = document.createElement("DIV");
          /*make the matching letters bold:*/
          childDiv.innerHTML = "<strong>" + countriesFromGeo.name.substr(0, inputValue.length) + "</strong>";
          childDiv.innerHTML += countriesFromGeo.name.substr(inputValue.length);
          /*insert a input field that will hold the current array item's value:*/
          childDiv.innerHTML += `<input type='hidden' value='${countriesFromGeo.name}' id='${countriesFromGeo.code}'>`;
          /*execute a function when someone clicks on the item value (DIV element):*/
          childDiv.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              autoInput.value = this.getElementsByTagName("input")[0].value;
			  selectedCountry = this.getElementsByTagName("input")[0].id;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          newDiv.appendChild(childDiv);
        }
		}				 
	});
  });
  /*execute a function presses a key on the keyboard:*/
  autoInput.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var autoItems = document.getElementsByClassName("autocomplete-items");
    for (const autoItem of autoItems) {
      if (elmnt != autoItem && elmnt != autoInput) {
        autoItem.parentNode.removeChild(autoItem);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countriesFromGeo);

export {
	autocomplete,
	postalCodeLookup,
	cityBoxMouseDown,
	cityBoxMouseOut,
	cityBoxMouseOver,
	closeCityBox,
	lat, long
}