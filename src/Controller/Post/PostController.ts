import { type Request, type Response } from "express";
import { AbstractController } from "../AbstractController.js";
import Post from "../../Model/Post.js";

export default class PostController extends AbstractController {
  public async execute(): Promise<void> {
    const { id } = this.getParams();
    if (id) {
      const post = await Post.findById(parseInt(id, 10));
      this.response.render("post/detail.twig", { post });
    } else {
      const posts = await Post.findAll();
      this.response.render("post/list.twig", { posts });
    }
  }
}
