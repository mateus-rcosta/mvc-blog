import express, { type Request, type Response } from "express";
import IndexController from "./Controller/IndexController.js";
import PostController from "./Controller/Post/PostController.js";
import CategoryController from "./Controller/Category/CategoryController.js";
import TagController from "./Controller/Tag/TagController.js";
import { default as PostCreateController } from "./Controller/Post/CreateController.js";
import { default as UserCreateController } from "./Controller/User/CreateController.js";
import { default as CategoryCreateController } from "./Controller/Category/CreateController.js";
import { default as TagCreateController } from "./Controller/Tag/CreateController.js";
import Database from "./Model/Database.js";
import path from "path";
import PostsController from "./Controller/Post/PostsController.js";
import UserController from "./Controller/User/UserController.js";
import { fileURLToPath } from "url";

const app = express();
app.set("view engine", "twig");
app.set("twig options", {
    allow_async: true
});

app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.resolve(__dirname, "View"));

// Conectar ao banco de dados
await Database.connect();

// Rotas
app.get("/", async (req: Request, res: Response) => {
    const indexController = new IndexController(req, res);
    return indexController.execute();
});

// Post
app.get("/post/create", (req: Request, res: Response) => {
    const postController = new PostCreateController(req, res);
    return postController.execute();
});

app.post("/post/create", (req: Request, res: Response) => {
    const postController = new PostCreateController(req, res);
    return postController.execute();
});

app.get(["/post", "/post/:id"], (req: Request, res: Response) => {
    const postController = new PostController(req, res);
    return postController.execute();
});

app.get("/posts", async (req: Request, res: Response) => {
    const postsController = new PostsController(req, res);
    return postsController.execute();
});

// Category
app.get("/category/create", (req: Request, res: Response) => {
    const categoryController = new CategoryCreateController(req, res);
    return categoryController.execute();
});

app.post("/category/create", (req: Request, res: Response) => {
    const categoryController = new CategoryCreateController(req, res);
    return categoryController.execute();
});

app.get(["/category", "/category/:id"], async (req: Request, res: Response) => {
    const categoryController = new CategoryController(req, res);
    return categoryController.execute();
});

// Tag
app.get("/tag/create", (req: Request, res: Response) => {
    const tagController = new TagCreateController(req, res);
    return tagController.execute();
});

app.post("/tag/create", (req: Request, res: Response) => {
    const tagController = new TagCreateController(req, res);
    return tagController.execute();
});


app.get(["/tag", "/tag/:id"], async (req: Request, res: Response) => {
    const tagController = new TagController(req, res);
    return tagController.execute();
});

// User
app.get("/user", async (req: Request, res: Response) => {
    const userController = new UserController(req, res);
    return userController.execute();
});

app.get("/user/create", (req: Request, res: Response) => {
    const createController = new UserCreateController(req, res);
    return createController.execute();
});

app.post("/user/create", (req: Request, res: Response) => {
    const createController = new UserCreateController(req, res);
    return createController.execute();
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
