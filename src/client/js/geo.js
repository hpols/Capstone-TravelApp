// Based off of: http://www.geonames.org/export/ajax-postalcode-autocomplete.html

// postalcodes is filled by the JSON callback and used by the mouse event handlers of the suggest box
var postalcodes;
const placeInput = document.getElementById("placeInput"); 
const suggestionBox = document.getElementById('suggestBoxElement');
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
	
  /*let country = document.getElementById("myInput").value;
	let countryCode = getCountryCode(countriesFromGeo,country);
	console.log(countryCode)*/

//  if (geonamesPostalCodeCountries.toString().search(country) == -1) {
//     return; // selected country not supported by geonames
//  }
  // display 'loading' in suggest box
  suggestionBox.style.visibility = 'visible';
  suggestionBox.innerHTML = '<small><i>loading ...</i></small>';

  var postalcode = document.getElementById("postalcodeInput").value;

	//example: http://api.geonames.org/postalCodeLookupJSON?postalcode=6600&country=AT&username=demo
  var request = 'http://api.geonames.org/postalCodeLookupJSON?postalcode=' + postalcode + '&country=' + countryCode + '&username=atschpe';
	
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
			//countriesFromGeo.push(country.countryName);
		}			 
	})
		//.then(setDefaultCountry());
}

// AUTOCOMPLETE COUNTRY INPUT

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
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
        if (countriesFromGeo.name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + countriesFromGeo.name.substr(0, val.length) + "</strong>";
          b.innerHTML += countriesFromGeo.name.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += `<input type='hidden' value='${countriesFromGeo.name}' id='${countriesFromGeo.code}'>`;
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
			  selectedCountry = this.getElementsByClassName("input")[0].id; //TODO: get id.
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
		}				 
	});
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
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
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing all the country names in the world:*/
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countriesFromGeo);

export {
	autocomplete,
	setDefaultCountry,
	populateCountrySelector,
	postalCodeLookup,
	suggestBoxMouseDown,
	suggestBoxMouseOut,
	suggestBoxMouseOver,
	closeSuggestBox,
	lat, long
}