//imports
import { autocomplete,
		postalCodeLookup, 
		closeCityBox,
		cityBoxMouseDown,
		cityBoxMouseOut,
		cityBoxMouseOver,
	   lat, long} from './js/geo.js'
import { startCounter,
	   dayValue,
	   dateInput} from './js/counter.js'
import {getWeather} from './js/weather.js'

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
	
	startCounter,
	dayValue,
	dateInput,
	
	getWeather
}