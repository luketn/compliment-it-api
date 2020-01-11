import {APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export interface HttpEventHandler {
    canHandleThis: (event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext) => boolean;
    handle: (event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext) => Promise<APIGatewayProxyResult>;
}

export interface Compliment {
    compliment: string;
}
