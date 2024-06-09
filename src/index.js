import express, { urlencoded } from 'express'
import dotenv from "dotenv";
import cors from 'cors'
import dbconnect from "./confiq/db.js";
import userRouter from './router/userRouter.js'
import postRouter from './router/postRouter.js'
import bodyParser from 'body-parser';
import Yaml from 'yamljs'
import swaggerUI from "swagger-ui-express"


import { errorHandler, notFound } from './middleware/errorMiddleware.js';
 
const yamlFilePath = "./src/api.yaml"
const swaggerJSDocs = Yaml.load(yamlFilePath)


dotenv.config();
dbconnect();

const PORT = 7000



const app = express();
app.use(cors())
app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("hello world");
  });

app.use('/api/users',userRouter)
app.use('/api/posts',postRouter)
app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerJSDocs))


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`SERVER connected successfully in ${PORT}`);
  });
  