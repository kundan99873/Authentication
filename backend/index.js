import express from "express"
import bodyParser from "body-parser";
import connect from "./db.js";
import router from "./route/userRoute.js";
 
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))

connect();

app.listen(5000, () => {
    console.log("connected to backend successfully...")
});

app.use("/users", router)