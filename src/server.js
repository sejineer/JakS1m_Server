import express from "express";
import morgan from "morgan";

const app = express();
const logger = morgan("start");

app.use(logger);


export default app;
