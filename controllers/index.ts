import { RouterContext, helpers } from "oak";
import { multiParser } from 'multiParser';
import { Users } from "../models/users.ts";

class Index {
    async index(ctx: any) {
        ctx.render(`${Deno.cwd()}/views/index.ejs`, { title: "登录" });
    }

    async login(ctx: RouterContext) {
        const value: any = await multiParser(ctx.request.serverRequest);
        console.log(await new Users().getData(value));
    }

    async postData(ctx: RouterContext) {
        try {
            const { type, value } = ctx.request.body();
            ctx.response.body = await (type === "form-data" ? multiParser(ctx.request.serverRequest) : value);

        } catch (e) {
            ctx.response.body = e;
        }
    }

    getParams(ctx: RouterContext) {
        ctx.response.body = helpers.getQuery(ctx, { mergeParams: true });
    }

    inputParams(ctx: RouterContext) {
        const books = new Map();
        books.set(1, {
            id: "1",
            title: "The Hound of the Baskervilles",
            author: "Conan Doyle, Arthur",
        });

        if (ctx.params && ctx.params.id && books.has(+ctx.params.id)) {
            ctx.response.body = books.get(+ctx.params.id);
        } else {
            ctx.response.body = 404;
        }
    }
    error(ctx: RouterContext) {
        ctx.throw(500);
    }

    redirect(ctx: RouterContext) {
        ctx.response.redirect(`/param`);
    }

    view(ctx: RouterContext) {
        // ctx.render("../views/index.ejs", { data: { name: "John" } });
        ctx.response.body = Deno.readTextFileSync("../views/../views/test.html");
    }
}

export default new Index;