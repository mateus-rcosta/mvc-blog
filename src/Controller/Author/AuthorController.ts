import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Author from "../../Model/Author.js";

export default class AuthorController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const { id } = this.getParams();

        if (id) {
            const author = await new Author().load(parseInt(id));
            this.response.render("author/detail.twig", { author });
        } else {
            const authors = await Author.findAll();
            this.response.render("author/list.twig", { authors });
        }
    }
}
