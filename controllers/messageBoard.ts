import { helpers, Context } from "oak";
import Message_board from "../models/Message_board.ts";


export default new class MessageBoard {
    private message_board = new Message_board();
    async index(ctx: any) {
        ctx.render(`${Deno.cwd()}/views/messageBoard.ejs`, { title: "留言板", data: await this.message_board.getData() });
    }
    getParams(ctx: Context) {
        ctx.response.body = helpers.getQuery(ctx, { mergeParams: true });
    }
    error(ctx: Context) {
        ctx.throw(500);
    }

}