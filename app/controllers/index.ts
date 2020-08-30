import { Context } from "oak";
import { multiParser } from 'multiParser';
import { Users } from "../models/users.ts";

export default new class Index {
    private users = new Users();

    render(ctx: any) {
        ctx.render(`${Deno.cwd()}/app/views/index.ejs`, { isLogin: ctx.request.url.pathname === "/views/login" });
    }

    async login(ctx: Context) {
        const value: any = await multiParser(ctx.request.serverRequest);

        const result = await this.users.verifyIdentity(value)
        if (result) {
            ctx.state.session.set("userInfo", result);
            ctx.response.redirect("/views/messageBoard");
            return
        }

        ctx.response.body = "密码或账号错误";
    }

    async register(ctx: Context) {
        const value: any = await multiParser(ctx.request.serverRequest);
        if (!Object.values(value).every(item => item)) {
            ctx.response.body = "账号或密码不能为空";
            return;
        }
        const result = await this.users.addUser(value);

        if (result) {
            ctx.response.body = "注册成功";
            return;
        }
        ctx.response.body = "注册失败(用户已存在)";
    }
}
