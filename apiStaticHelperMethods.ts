import {APIGatewayProxyResult} from "aws-lambda";

export const unsupportedMethodResponse = (method: string): APIGatewayProxyResult => {
    return {
        body: `Unsupported method '${method}'.`,
        headers: {
            "Content-Type": "text/plain",
        },
        statusCode: 405,
    };
};
