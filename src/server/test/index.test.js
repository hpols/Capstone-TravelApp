const app = require('../index.js') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe("Testing root", ()=> {
	it("gets the pix endpoint", async () => {
		const res = await request.post('/pix')
			.send({city: "Raleigh",
			   country: "USA"});
		expect(res.status).toEqual(200)
	})
})