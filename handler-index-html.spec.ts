import {APIGatewayProxyEvent} from "aws-lambda";
import {IndexHtmlHandler} from "./handler-index-html";

describe("Index HTML Handler canHandleThis", () => {
    const staticContentHandler = new IndexHtmlHandler();

    it("should return true for '/' or '/index.html' paths", () => {
        expect(staticContentHandler.canHandleThis({path: "/"} as APIGatewayProxyEvent)).toEqual(true);
        expect(staticContentHandler.canHandleThis({path: "/index.html"} as APIGatewayProxyEvent)).toEqual(true);
    });
    it("should return false for other paths", () => {
        expect(staticContentHandler.canHandleThis({path: "/other"} as APIGatewayProxyEvent)).toEqual(false);
        expect(staticContentHandler.canHandleThis({path: "/services/test.json"} as APIGatewayProxyEvent)).toEqual(false);
    });
});

describe("Index HTML Handler handle", () => {
    const staticContentHandler = new IndexHtmlHandler();

    it("should return 200 response with index.html base64 data", async () => {
        const response = await staticContentHandler.handle({path: "/"} as APIGatewayProxyEvent);
        expect(response.statusCode).toEqual(200);
        expect(response.isBase64Encoded).toEqual(false);
        expect(response.headers).toEqual({"Content-Type": "text/html"});

        const text = response.body;
        expect(text).toContain("AWS Lambda App");
    });
});
