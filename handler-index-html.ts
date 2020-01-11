import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import * as fs from "fs";
import {HttpEventHandler} from "./interfaces";

/**
 * Serve index.html on the root / or /index.html.
 */
export class IndexHtmlHandler implements HttpEventHandler {
    private indexHtml: string = "";

    public canHandleThis(event: APIGatewayProxyEvent) {
        return event.path === "/" || event.path === "/index.html";
    }

    public async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        if (!this.indexHtml) {
            this.indexHtml = fs.readFileSync("./index.html", {encoding: "utf8"});
        }
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            isBase64Encoded: false,
            body: this.indexHtml,
        };
    }
}
