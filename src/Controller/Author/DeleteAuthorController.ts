import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Author from "../../Model/Author.js";

export default class DeleteAuthorController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        try {
            const { id } = this.getParams();
            if (!id) throw new Error("ID do autor não fornecido");

            const author = await Author.findById(parseInt(id, 10));
            if (!author) throw new Error("Autor não encontrado");

            const success = await author.delete();
            if (!success) throw new Error("Falha ao deletar autor");

            this.response.redirect("/author");
        } catch (error) {
            console.error("Erro ao deletar autor:", error);
            this.response.status(500).send(error instanceof Error ? error.message : "Erro desconhecido");
        }
    }
}