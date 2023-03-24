import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const data = require("./example.json");

//Site ID from database - unique identifier to separate images
const siteId = "lKJ16E5IhH"; // Honkai Star Rail

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      mongoURL: MONGO_URL as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         getData().then(
            (result) => {
               process.exit(0);
            },
            (err) => {
               console.error(err);
               process.exit(-1);
            }
         );
      },
   });
start();

const getData = async () =>
   Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

//Uploads image using the id from the JSON object to locate the file
const seedUploads = async (result: any) => {
   const id = result.id; //This is the id from the JSON object

   const existingImage = await payload.find({
      collection: "images",
      where: {
			id: {
				equals: siteId + "_" + id,
			},
		}
   });
   
   if (existingImage.docs.length > 0) {
      // Check if file exists! Sometimes uploads fail even though a DB entry goes through.
      // Will attempt reupload of image if the image doesn't exist, otherwise skips.
      var fileurl = existingImage.docs?.[0]?.url;
      var imgid = existingImage.docs?.[0]?.id;

            const updateItem = await payload.update({
               collection: "images",
               id: imgid,
               data: {
                  id: imgid,
               },
               filePath: path.resolve(__dirname, `./images/${id}.png`),
            });
            console.log(`${JSON.stringify(updateItem)} Updated!`);

      // if (await URLExists(fileurl)) {
      //    console.log(`Image ${id} already exists! Skipping.`);

      // }
      // else {
      //    console.log(`!!!! => Image ${id} missing; Re-uploading! ${imgid}`);
      //    const updateItem = await payload.create({
      //       collection: "images",
      //       id: imgid,
      //       // data: {
      //       //    id: imgid,
      //       // },
      //       filePath: path.resolve(__dirname, `./images/${id}.png`),
      //    });
      //    console.log(`${JSON.stringify(updateItem)} Updated!`);
      // }
   }
   else {
      const createItem = await payload.create({
         collection: "images",
         data: {
            id: siteId + "_" + id,
         },
         filePath: path.resolve(__dirname, `./images/${id}.png`),
      });
      //Limit speed
      sleep(50);
      console.log(`${JSON.stringify(createItem)} Import completed!`);
   }
};

//Sleep function to limit speed, can remove if not needed
const sleep = (milliseconds: any) => {
   const start = new Date().getTime();
   for (let i = 0; i < 1e7; i += 1) {
      if (new Date().getTime() - start > milliseconds) {
         break;
      }
   }
};

// URL Check function to confirm if image file exists.
function URLExists(url: any) {
   return fetch(url)
   .then((res) => {
      if (res.status == 404) {    
         return false;
      }
      else {
         return true;
      }

   })
   .catch((err) => {
      return false;
   });
}