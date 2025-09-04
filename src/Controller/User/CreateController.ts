import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import User from "../../Model/User.js";

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
            this.response.render("user/form.twig", {
                user: {},
                error: null
            });
        } catch (error) {
            console.error('Erro ao carregar formulário:', error);
            this.response.status(500).send('Erro ao carregar formulário');
        }
    }

    private async processForm(): Promise<void> {
        try {
            const { nome } = this.getParams();

            if (!nome || nome.trim().length === 0) {
                throw new Error('O nome é obrigatório');
            }

            const user = new User(nome.trim());
            await user.save();

            this.response.redirect('/user');
        } catch (error) {
            console.error('Erro ao criar usuário:', error);

            this.response.render("user/form.twig", {
                user: this.getParams(),
                error: error instanceof Error ? error.message : 'Erro ao criar usuário'
            });
        }
    }
}
