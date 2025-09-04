import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Post from "../../Model/Post.js";

export default class PostController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const { id } = this.getParams();
        
        if (id) {
            const post = await Post.findById(parseInt(id));
            this.response.render("post/single.twig", { post });
        } else {
            const posts = await Post.findAll();
            this.response.render("post/post.twig", { posts: posts ?? [] });
        }
    }
}
