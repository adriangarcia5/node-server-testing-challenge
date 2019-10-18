const request = require('supertest');
const server = require('./server');
const db = require('./database/dbConfig');


// Testing for GET
describe('GET /', () => {
  // should return http 200 ok
  it('should terutn 200 http status code', () => {

   return request(server)
      .get('/')
      .then( response => {
        expect(response.status).toBe(200)
      });

  });

  // should return JSON
  it('should return JSON', async () => {
    const response = await request(server).get('/');
    
    expect(response.type).toMatch(/json/i)
  })

  // should return an object with an api property with the value 'up'
  it('should return {api: "up"} ', async() => {
    const response = await request(server).get('/')

    expect(response.body).toEqual({api: 'up'});
  })
});

// Testing for post
describe("POST /api/hobbits", () => {
  
  describe("insert a hobbit into the DB", () => {
      // before the test clean out a table
      beforeEach( async () => {
        await db('hobbits')
        .truncate()
      })
    
      it('should insert the hobit object passed in', async () => {
        
        const newHobbit = await request(server).post('/api/hobbits').send({name: "Frodo"});
        expect(newHobbit.body.data.name).toBe('Frodo')
        expect(newHobbit.body.data.id).toBe(1);
        
      })

      it('Test then new hobbit coming back is in json', async () => {
        const newHobbit = await request(server).post('/api/hobbits').send({name: "Sam"});
        expect(newHobbit.type).toMatch(/json/i)
      })

      it("Test the status code of the request when a hobbit is inserted", async () => {
        const newHobbit = await request(server).post('/api/hobbits').send({name: "Frodo"})
        expect(newHobbit.status).toBe(201);
      })
  })

})

// Testing for DELETE
describe('DELTE /api/hobits', () => {

  describe("Delete a Hobbit(s) from the database", () => {
    beforeEach( async () => {
      await db('hobbits')
        .insert([
          {name: "Frodo"},
          {name: "Sam"},
          {name: "Bilbo"}
        ])
    })

    it('returns the number of records affected', async () => {
      const recordsAfffected = await request(server).delete('/api/hobbits').send({id: 1})
      expect(recordsAfffected.body.data).toBe(1)
    })

    it("returns the data in json format", async () => {
      const data = await request(server).delete('/api/hobbits').send({id: 2})
      expect(data.type).toMatch(/json/i);
    })

    it("returns the correct status code when completed successfully", async () => {
      const data = await request(server).delete('/api/hobbits').send({id: 3})
      expect(data.status).toBe(200)
    })
    
  })
})