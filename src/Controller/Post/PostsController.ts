import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Post from "../../Model/Post.js";

export default class PostsController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const posts = await Post.findAll();
        this.response.render(
            "posts/list.twig",
            { posts: posts ?? [] }
        );
    }
}
