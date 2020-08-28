import { Context } from "oak";
import { multiParser } from 'multiParser';
import { Users } from "../models/users.ts";
import { Controller } from "../lib/controller.ts";

export default new class Index extends Controller {
    private users = new Users();

    constructor() {
        super()
    }

    index(ctx: Context) {
        ctx.response.redirect("/login");
    }
    renderLogin(ctx: any) {
        ctx.render(`${Deno.cwd()}/views/index.ejs`, { switched: true });
    }

    renderRegister(ctx: any) {
        ctx.render(`${Deno.cwd()}/views/index.ejs`, { switched: false });
    }

    async login(ctx: Context) {
        const value: any = await multiParser(ctx.request.serverRequest);

        const result = await this.users.verifyIdentity(value)
        if (result) {
            ctx.state.session.set("userInfo", result);
            ctx.response.redirect("/messageBoard");
            return
        }

        ctx.response.body = "密码或账号错误";
    }

    async register(ctx: Context) {
        const value: any = await multiParser(ctx.request.serverRequest);
        const result = await this.users.addUser(value);

        if (result) {

            ctx.response.body = "注册成功";
            return;
        }
        ctx.response.body = "注册失败(用户已存在)";
    }
}
