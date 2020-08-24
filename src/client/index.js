//imports
import { autocomplete,
		geoInput,
		countryLookup,
		postalCodeLookup, 
		lat, long, ctry, city} from './js/geo.js'

import { updateTravelInfo,
	   dayValue,
	   dateInput, returnInput} from './js/app.js'

import {getWeather} from './js/weather.js'

import {getPix} from './js/pix.js'

import './styles/style.scss'

//exports
export {
	geoInput,
	countryLookup,
	postalCodeLookup, 
	lat, long, ctry, city,
	
	updateTravelInfo,
	dayValue,
	dateInput, returnInput,
	
	getWeather,

	getPix
}