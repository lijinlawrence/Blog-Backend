import express, { urlencoded } from 'express'
import dotenv from "dotenv";
import cors from 'cors'
import dbconnect from "./confiq/db.js";
import userRouter from './router/userRouter.js'
import postRouter from './router/postRouter.js'
import bodyParser from 'body-parser';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';

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


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`SERVER connected successfully in ${PORT}`);
  });
  