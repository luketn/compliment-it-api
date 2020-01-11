import {APIGatewayProxyEvent} from "aws-lambda";
import {QuoteApiHandler, Quote} from "./handler-quote-api";

describe("Quote API", () => {
    const quoteApiHandler = new QuoteApiHandler();

    it("should be handled on /quote-api", () => {
        expect(quoteApiHandler.canHandleThis({path: "/quote-api"} as APIGatewayProxyEvent)).toEqual(true);
    });
    it("should return an array of data for GET on /quote-api", async () => {
        const response = await quoteApiHandler.handle({httpMethod: "GET", path: "/quote-api"} as APIGatewayProxyEvent);
        expect(response.statusCode).toEqual(200);
        const bodyData: Quote[] = JSON.parse(response.body);
        expect(bodyData.length).toBe(4);
        expect(bodyData[0].id).toBe(0);
        expect(bodyData[0].text).toContain("a mosaic of single sparks");

    });
    it("should return a 405 response for an unexpected method on /quote-api", async () => {
        const response = await quoteApiHandler.handle({httpMethod: "DELETE", path: "/quote-api"} as APIGatewayProxyEvent);
        expect(response.statusCode).toEqual(405);
        const bodyData: string = response.body;
        expect(bodyData).toBe("Unsupported method 'DELETE'.");

    });
});
