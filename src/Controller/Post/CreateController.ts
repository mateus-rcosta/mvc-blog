import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Post from "../../Model/Post.js";
import User from "../../Model/User.js";
import Author from "../../Model/Author.js";
import Category from "../../Model/Category.js";
import Tag from "../../Model/Tag.js";

export default class PostCreateController extends AbstractController {
  public async execute(): Promise<void> {
  if (this.getMethod() === "POST") {
    const { titulo, conteudo, userId, authorId, categoryId, published, tags } = this.getParams();

    const post = new Post(
      titulo,
      conteudo,
      parseInt(userId, 10),
      published === "on",
      parseInt(authorId, 10),
      parseInt(categoryId, 10),
    );

    if (tags && Array.isArray(tags)) {
      post.tags = tags.map(id => {
        const t = new Tag();
        t.setId(parseInt(id, 10));
        return t;
      });
    }

    await post.save();
    return this.response.redirect("/post");
  }

  const users = await User.findAll();
  const authors = await Author.findAll();
  const categories = await Category.findAll();
  const tags = await Tag.findAll();

  this.response.render("post/form.twig", { post: {}, users, authors, categories, tags, error: null });
}

}
