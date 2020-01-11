import {APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {addOriginResponseHeader, http} from "./handler";

describe("Handler", () => {
    it("should return a positive response for index.html on root", async () => {
        const response = await http({path: "/index.html"} as APIGatewayProxyEvent);
        expect(response.statusCode).toBe(200);
    });
    it("should return a positive response for index.html on subpath", async () => {
        const response = await http({path: "/aws-lambda-app/index.html"} as APIGatewayProxyEvent);
        expect(response.statusCode).toBe(200);
    });
    it("should return a 404 for an unknown path", async () => {
        const response = await http({path: "/unknown-path"} as APIGatewayProxyEvent);
        expect(response.statusCode).toBe(404);
    });
    it("should add CORS response", async () => {
        const response = await http({
            path: "/index.html",
            headers: {origin: "xyz"},
            body: null,
            httpMethod: "GET",
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {} as APIGatewayEventRequestContext,
            resource: "",
            stageVariables: {},
        } as APIGatewayProxyEvent);
        expect(response.statusCode).toBe(200);
        expect(response.headers).toEqual({
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "xyz",
        });
    });
    it("should not add CORS response when there are no headers in event", async () => {
        const response = {} as APIGatewayProxyResult;
        await addOriginResponseHeader({} as APIGatewayProxyEvent, response);
        expect(response.headers).not.toEqual({
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "xyz",
        });
    });
    it("should add CORS response when there is an origin header in event but not in response", async () => {
        const response = {} as APIGatewayProxyResult;
        await addOriginResponseHeader({
            path: "/index.html",
            headers: {origin: "xyz"},
            body: null,
            httpMethod: "GET",
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {} as APIGatewayEventRequestContext,
            resource: "",
            stageVariables: {},
        } as APIGatewayProxyEvent, response);
        expect(response.headers).toEqual({
            "Access-Control-Allow-Origin": "xyz",
        });
    });
    it("should not add CORS response when there is no origin header in event but not in response", async () => {
        const response = {} as APIGatewayProxyResult;
        await addOriginResponseHeader({
            path: "/index.html",
            headers: {},
            body: null,
            httpMethod: "GET",
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {} as APIGatewayEventRequestContext,
            resource: "",
            stageVariables: {},
        } as APIGatewayProxyEvent, response);
        expect(response.headers).toBeUndefined();
    });
});
