import {APIGatewayProxyEvent} from "aws-lambda";
import {FallbackHandler} from "./handler-fallback";

describe("Fallback handler", () => {
    const fallbackHandler = new FallbackHandler();

    it("should return true to being handleable for all paths", async () => {
        expect(fallbackHandler.canHandleThis()).toEqual(true);
    });
    it("should return a 404 response", async () => {
        const response = await fallbackHandler.handle({path: "/hello"} as APIGatewayProxyEvent);
        expect(response.statusCode).toEqual(404);
        expect(response.body).toContain("hello");
    });
});
