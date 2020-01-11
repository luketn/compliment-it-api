import {APIGatewayProxyEvent} from "aws-lambda";
import {HttpEventHandler} from "./interfaces";

export class FallbackHandler implements HttpEventHandler {
    public canHandleThis() {
        return true;
    }

    public async handle(event: APIGatewayProxyEvent) {
        return {
            body: `No handler found for event on path ${event.path}!`,
            headers: {
                "Content-Type": "text/plain",
            },
            statusCode: 404,
        };
    }
}
