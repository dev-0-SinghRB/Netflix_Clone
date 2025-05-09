// import express from 'express'; esm
// const express = require("express") commonJS syntax
import express from 'express';
import authRoutes from "./routes/auth.route.js"
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/movie.route.js";
import searchRoutes from "./routes/search.route.js";
import dotenv from "dotenv";
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { protectRoute } from './middleware/protectRoute.js';
dotenv.config();

const app = express();
const PORT = ENV_VARS.PORT;


app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

app.listen(5000, () => {
    console.log('Server started at http://localhost:' + PORT);
    connectDB();
})
