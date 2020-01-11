import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export interface HttpEventHandler {
    canHandleThis: (event: APIGatewayProxyEvent) => boolean;
    handle: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
}
