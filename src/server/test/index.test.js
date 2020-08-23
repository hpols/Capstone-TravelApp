const app = require('../index.js') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe("Testing root", ()=> {
	it("gets the weather endpoint", async done => {
	  const res = await request.get('/weather')

	  expect(res.status).toBe(200)
	  expect(res.body.message).toBe('pass!')
	  done()
	})
	it("gets the pix endpoint", async done => {
	  const res = await request.get('/pix')

	  expect(res.status).toBe(200)
	  expect(res.body.message).toBe('pass!')
	  done()
	})
})