import {MongoClient, Db} from "mongodb";
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";
import {Compliment, HttpEventHandler} from "./interfaces";

let cachedDb: Db | null = null;

export class ComplimentsHandler implements HttpEventHandler {
    public canHandleThis(event: APIGatewayProxyEvent) {
        return event.path === "/compliments.html";
    }

    public async handle(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext) {
        // Set this flag on the context as specified in MongoDB best practices for caching in Lambda:
        // https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/
        (context as any).callbackWaitsForEmptyEventLoop = false;

        const url = `${process.env.MONGO_CONNECTION_STRING}`;
        const db = await this.connectToDatabase(url);
        const complimentsCollection = db.collection<Compliment>("compliments");
        const complimentList = await complimentsCollection.find({}).toArray();

        return {
            body: `<html><head><title>Compliment Page</title></head><body>Here's a compliment:<br/>${complimentList[0].compliment}</body></html>`,
            headers: {
                "Content-Type": "text/html",
            },
            statusCode: 200,
        };
    }

    private async connectToDatabase(uri: string): Promise<Db>  {
        if (cachedDb) {
            return cachedDb;
        }

        const client = await MongoClient.connect(uri);
        const db = client.db("compliments");
        cachedDb = db;
        return db;
    }
}
