import { BotFrameworkAdapter } from "botbuilder";
import * as restify from "restify";
import { EmotionDetection } from "@botbuildercommunity/middleware-watson-nlu";
import { config } from "dotenv";
import { topEmotion, topEmotionResult } from "./util";

config();

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

adapter.use(new EmotionDetection(process.env.WATSON_API_KEY, process.env.WATSON_ENDPOINT));

server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === "message") {
            await context.sendActivity(`You said "${context.activity.text} with an emotion score of [joy] at ${context.turnState.get("emotionDetection").joy}"`);
        }
    });
});
