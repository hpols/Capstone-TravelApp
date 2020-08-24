import{retrieveData} from '../geo.js'

describe("Testing data retrieval",() => {
	test("Testing retrieveData() function", async() => {
		const testApi ="http://api.geonames.org/oceanJSON?formatted=true&lat=40.78343&lng=-43.96625&username=atschpe"
		
		const testResult = {
			"ocean": {
				"geonameId": 3411923,
				"name": "North Atlantic Ocean"
			}
		}
		
		expect(retrieveData(testApi)).resolves.toBe(testResult);
	})
});