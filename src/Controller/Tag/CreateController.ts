import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Tag from "../../Model/Tag.js";

export default class CreateController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        if (this.getMethod() === 'POST') {
            await this.processForm();
            return;
        }

        await this.showForm();
    }

    private async showForm(): Promise<void> {
        try {
            this.response.render("tag/form.twig", {
                tag: {},
                error: null
            });
        } catch (error) {
            console.error('Erro ao carregar formulário:', error);
            this.response.status(500).send('Erro ao carregar formulário');
        }
    }

    private async processForm(): Promise<void> {
        try {
            const { nome, cor } = this.getParams();

            if (!nome || nome.trim().length === 0) {
                throw new Error('O nome da tag é obrigatório');
            }

            const tag = new Tag(nome.trim(), cor || '#007bff');
            await tag.save();

            this.response.redirect('/tag');
        } catch (error) {
            console.error('Erro ao criar tag:', error);

            this.response.render("tag/form.twig", {
                tag: this.getParams(),
                error: error instanceof Error ? error.message : 'Erro ao criar tag'
            });
        }
    }
}