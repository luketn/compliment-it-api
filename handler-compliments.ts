import {MongoClient} from "mongodb";
import {APIGatewayProxyEvent} from "aws-lambda";
import {Compliment, HttpEventHandler} from "./interfaces";

export class ComplimentsHandler implements HttpEventHandler {
    public canHandleThis(event: APIGatewayProxyEvent) {
        return event.path === "/compliments.html";
    }

    public async handle(event: APIGatewayProxyEvent) {
        const url = `${process.env.MONGO_CONNECTION_STRING}`;
        const client = new MongoClient(url);
        await client.connect();
        try {
            const db = client.db("compliments");
            const complimentsCollection = db.collection<Compliment>("compliments");
            const complimentList = await complimentsCollection.find({}).toArray();

            return {
                body: `<html><head><title>Compliment Page</title></head><body>Here's a compliment:<br/>${complimentList[0].compliment}</body></html>`,
                headers: {
                    "Content-Type": "text/html",
                },
                statusCode: 200,
            };
        } finally {
            await client.close();
        }
    }
}
