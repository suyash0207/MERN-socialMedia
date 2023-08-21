import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {register} from "./controller/auth.js";
import authRouter from "./router/auth.js";
import usersRouter from "./router/users.js";
import postsRouter from "./router/posts.js";
import {createPost} from "./controller/posts.js";
import { verifyToken } from "./middleware/auth.js";
import {users,posts} from "./data/index.js";
import User from "./models/User.js"
import Post from "./models/Post.js"


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });



// ROUTER WITH FILES
//        path           middleware               controller
app.post('/auth/register',upload.single("picture"),register);
app.post('/posts',verifyToken,upload.single("picture"),createPost);

// ROUTERS

app.use('/auth',authRouter);
app.use('/users',usersRouter);
app.use('/posts',postsRouter);

/* MONGOOSE SETUP */
const PORT =3001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log("DB connected"))
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));