//imports
import { autocomplete,
		geoInput,
		countryLookup,
		postalCodeLookup, 
		lat, long, ctry, city,
	   retrieveData} from './js/geo.js'

import { getDates,
		dayValue,
		dateInput, returnInput} from './js/app.js'

import {getWeather} from './js/weather.js'

import {getPix} from './js/pix.js'

import './styles/style.scss'

document.addEventListener('DOMContentLoaded', () => {
	countryLookup();
	document.getElementById('postalcodeInput').addEventListener('onBlur', postalCodeLookup());
	document.getElementById('placeInput').addEventListener('onBlur', geoInput());
	document.getElementById('travelreturn').addEventListener('focusout', getDates());
 });

//exports
export {
	geoInput,
	countryLookup,
	postalCodeLookup, 
	lat, long, ctry, city,
	retrieveData,
	
	getDates,
	dayValue,
	dateInput, returnInput,
	
	getWeather,

	getPix
}