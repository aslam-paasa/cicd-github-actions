const request = require("supertest")
const app = require('./index')

describe("Express App", () => {
    it("GET / return Hello World", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Hello World!");
    });

    it("GET /:id return Hello World with ID", async () => {
        const res = await request(app).get("/chai");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Hello World Chai");
    })
})