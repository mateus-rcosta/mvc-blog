import { type Request, type Response } from "express";
import { AbstractController } from "./AbstractController.js";

export default class IndexController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public execute(): void {
        this.response.render("index.twig", {
            titulo: "Meu Blog",
            conteudo: "Seja bem-vindo ao meu blog! Aqui você encontrará artigos interessantes sobre diversos temas.",
        });
    }
}
