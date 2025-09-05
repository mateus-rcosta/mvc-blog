import { AbstractController } from "../AbstractController.js";
import Post from "../../Model/Post.js";

export default class PostDeleteController extends AbstractController {
  public async execute(): Promise<void> {
    const { id } = this.getParams();
    const post = new Post();
    post['id'] = parseInt(id, 10);
    await post.delete();
    return this.response.redirect("/post");
  }
}
