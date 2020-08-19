//imports
import { getLocation,
		populateCountrySelector,
		setDefaultCountry, 
		postalCodeLookup, 
		closeSuggestBox,
		suggestBoxMouseDown,
		suggestBoxMouseOut,
		suggestBoxMouseOver,
	   lat, long} from './js/geo.js'
import { startCounter,
	   dayValue,
	   dateInput} from './js/counter.js'
import {getWeather} from './js/weather.js'

import './styles/style.scss'

//exports
export {
	populateCountrySelector,
	setDefaultCountry, 
	postalCodeLookup, 
	closeSuggestBox,
	suggestBoxMouseDown,
	suggestBoxMouseOut,
	suggestBoxMouseOver,
	lat, long,
	
	startCounter,
	dayValue,
	dateInput,
	
	getWeather
}