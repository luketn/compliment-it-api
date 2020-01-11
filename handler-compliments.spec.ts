import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";
import {ComplimentsHandler} from "./handler-compliments";

describe("Compliments API", () => {
    const handler = new ComplimentsHandler();

    it("should be handled on /compliments.html", () => {
        expect(handler.canHandleThis({path: "/compliments.html"} as APIGatewayProxyEvent)).toEqual(true);
    });
    it("should return an HTML compliment for GET on /compliments.html", async () => {
        const response = await handler.handle({httpMethod: "GET", path: "/compliments.html"} as APIGatewayProxyEvent, {} as APIGatewayEventRequestContext);
        expect(response.statusCode).toEqual(200);
        const bodyData: string = response.body;
        expect(bodyData).toContain("gorgeous");

    });
    it("should return an HTML compliment for GET on /compliments.html (again) using cached DB", async () => {
        const response = await handler.handle({httpMethod: "GET", path: "/compliments.html"} as APIGatewayProxyEvent, {} as APIGatewayEventRequestContext);
        expect(response.statusCode).toEqual(200);
        const bodyData: string = response.body;
        expect(bodyData).toContain("gorgeous");

    });
});
