import {APIGatewayProxyEvent} from "aws-lambda";
import {HttpEventHandler} from "./interfaces";
import {unsupportedMethodResponse} from "./apiStaticHelperMethods";

export interface Quote {
    id: number;
    text: string;
}

export class QuoteApiHandler implements HttpEventHandler {
    private quotes: Quote[] = [
        {id: 0, text: "The sun rose higher. Blue waves, green waves swept a quick fan over the beach, circling the spike of sea-holly and leaving shallow pools of light here and there on the sand. A faint black rim was left behind them. The rocks which had been misty and soft hardened and were marked with red clefts. Sharp stripes of shadow lay on the grass, and the dew dancing on the tips of flowers and leaves made the garden like a mosaic of single sparks not yet formed into a whole."},
        {id: 1, text: "There was a star riding through clouds one night, & I said to the star, 'Consume me'."},
        {id: 2, text: "How much better is silence; the coffee cup, the table. How much better to sit by myself like the solitary sea-bird that opens its wings on the stake. Let me sit here for ever with bare things, this coffee cup, this knife, this fork, things in themselves, myself being myself."},
        {id: 3, text: "Alone, I often fall down into nothingness. I must push my foot stealthily lest I should fall off the edge of the world into nothingness. I have to bang my head against some hard door to call myself back to the body."},
    ];

    public canHandleThis(event: APIGatewayProxyEvent) {
        return event.path === "/quote-api";
    }

    public async handle(event: APIGatewayProxyEvent) {
        if (event.httpMethod === "GET") {
            return this.handleGet(event);
        } else {
            return unsupportedMethodResponse(event.httpMethod);
        }
    }

    private handleGet(event: APIGatewayProxyEvent) {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.quotes),
        };
    }
}
