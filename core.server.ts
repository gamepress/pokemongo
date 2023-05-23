import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import payload from "payload";
import { createRequestHandler } from "@remix-run/express";
import invariant from "tiny-invariant";
import nodemailerSendgrid from "nodemailer-sendgrid";
import coreBuildConfig from "./app/db/payload.config";
import { initRedis } from "@aengz/payload-redis-cache";

require("dotenv").config();

const BUILD_DIR = path.join(process.cwd(), "build");

const cors = require("cors");

const corsOptions = {
   origin: [
      "https://mana.wiki",
      "https://starrail-static.mana.wiki",
      "https://static.mana.wiki",
      "http://localhost:3000",
   ],
};

function purgeRequireCache() {
   // purge require cache on requests for "server side HMR" this won't let
   // you have in-memory objects between requests in development,
   // alternatively you can set up nodemon/pm2-dev to restart the server on
   // file changes, but then you'll have to reconnect to databases/etc on each
   // change. We prefer the DX of this, so we've included it for you by default
   for (const key in require.cache) {
      if (key.startsWith(BUILD_DIR)) {
         delete require.cache[key];
      }
   }
}
if (process.env.NODE_ENV == "production")
   initRedis({
      redisUrl: process.env.REDIS_URI ?? "",
   });

//Start core site (remix + payload instance)

async function startCore() {
   const app = express();

   app.use(cors(corsOptions));

   // Redirect all traffic at root to HQ UI
   app.get("/", function (_, res) {
      res.redirect("/hq");
   });

   invariant(process.env.PAYLOADCMS_SECRET, "PAYLOADCMS_SECRET is required");
   invariant(process.env.MONGO_URL, "MONGO_URL is required");

   // Initialize Payload
   await payload.init({
      config: coreBuildConfig,
      secret: process.env.PAYLOADCMS_SECRET,
      mongoURL: process.env.MONGO_URL,
      express: app,
      onInit: () => {
         payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
      ...(process.env.SENDGRID_API_KEY
         ? {
              email: {
                 transportOptions: nodemailerSendgrid({
                    apiKey: process.env.SENDGRID_API_KEY,
                 }),
                 fromName: "No Reply - Mana Wiki",
                 fromAddress: "dev@mana.wiki",
              },
           }
         : {
              email: {
                 fromName: "Admin",
                 fromAddress: "admin@example.com",
                 logMockCredentials: true, // Optional
              },
           }),
   });

   app.use(compression());

   // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
   app.disable("x-powered-by");

   // Remix fingerprints its assets so we can cache forever.
   app.use(
      "/build",
      express.static("public/build", { immutable: true, maxAge: "1y" })
   );

   // Everything else (like favicon.ico) is cached for an hour. You may want to be
   // more aggressive with this caching.
   app.use(express.static("public", { maxAge: "1h" }));

   app.use(morgan("tiny"));
   app.use(payload.authenticate);

   app.all(
      "*",
      process.env.NODE_ENV === "development"
         ? (req, res, next) => {
              purgeRequireCache();

              return createRequestHandler({
                 build: require(BUILD_DIR),
                 mode: process.env.NODE_ENV,
                 getLoadContext(req, res) {
                    return {
                       // @ts-expect-error
                       payload: req.payload,
                       // @ts-expect-error
                       user: req?.user,
                       res,
                    };
                 },
              })(req, res, next);
           }
         : createRequestHandler({
              build: require(BUILD_DIR),
              mode: process.env.NODE_ENV,
              getLoadContext(req, res) {
                 return {
                    // @ts-expect-error
                    payload: req.payload,
                    // @ts-expect-error
                    user: req?.user,
                    res,
                 };
              },
           })
   );
   const port = process.env.PORT || 3000;

   app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
   });
}

startCore();