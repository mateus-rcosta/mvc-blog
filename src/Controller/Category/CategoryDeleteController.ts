import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Category from "../../Model/Category.js";

export default class CategoryDeleteController extends AbstractController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async execute(): Promise<void> {
        const { id } = this.getParams();
        if (!id) return this.response.redirect('/category');

        const category = await Category.findById(parseInt(id));
        if (category) await category.delete();

        this.response.redirect('/category');
    }
}
