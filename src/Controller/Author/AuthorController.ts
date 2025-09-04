import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Author from "../../Model/Author.js";

export default class AuthorController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const authors = await Author.findAll();
        this.response.render("author/list.twig", { authors: authors ?? [] });
    }
}