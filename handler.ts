"use strict";

import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {FallbackHandler} from "./handler-fallback";
import {QuoteApiHandler} from "./handler-quote-api";
import {IndexHtmlHandler} from "./handler-index-html";
import {HttpEventHandler} from "./interfaces";
import {ComplimentsHandler} from "./handler-compliments";

const fallbackHandler = new FallbackHandler();
const handlers: HttpEventHandler[] = [
    new IndexHtmlHandler(),
    new QuoteApiHandler(),
    new ComplimentsHandler(),
];

export const http = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // normalise the path no matter whether the request is on the API Gateway URL or the api.compliment.it/compliment-it-api URL
    if (event.path.startsWith("/compliment-it-api")) {
        event.path = event.path.substr("/compliment-it-api".length);
    }

    let result: APIGatewayProxyResult | undefined;
    for (const handler of handlers) {
        if (handler.canHandleThis(event)) {
            result = await handler.handle(event);
            break;
        }
    }

    if (!result) {
        result = await fallbackHandler.handle(event);
    }

    addOriginResponseHeader(event, result);

    return result;
};

export const addOriginResponseHeader = (event: APIGatewayProxyEvent, result: APIGatewayProxyResult) => {
    if (event.headers) {
        const origin = event.headers.origin;
        if (origin) {
            if (!result.headers) {
                result.headers = {};
            }
            result.headers["Access-Control-Allow-Origin"] = origin;
        }
    }
};
