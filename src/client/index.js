//imports
import { autocomplete,
		postalCodeLookup, 
		closeCityBox,
		cityBoxMouseDown,
		cityBoxMouseOut,
		cityBoxMouseOver,
		lat, long,
		ctry, city} from './js/geo.js'
import { startCounter,
	   dayValue,
	   dateInput} from './js/counter.js'
import {getWeather} from './js/weather.js'
import {getPix} from './js/pix.js'

import './styles/style.scss'

//exports
export {
	autocomplete, 
	postalCodeLookup, 
	closeCityBox,
	cityBoxMouseDown,
	cityBoxMouseOut,
	cityBoxMouseOver,
	lat, long,
	ctry, city,
	
	startCounter,
	dayValue,
	dateInput,
	
	getWeather,

	getPix
}