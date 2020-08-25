import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { db } from "../config/database.ts";
import { multiParser } from 'https://deno.land/x/multiparser@v2.0.1/mod.ts';
import { helpers } from "https://deno.land/x/oak/mod.ts";

const books = new Map();
books.set(1, {
    id: "1",
    title: "The Hound of the Baskerilles",
    author: "Conan Doyle, Arthur",
});

class Index {
    async test(ctx: RouterContext) {
        const users = db.collection("users");
        ctx.response.body = await users.find();
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
        if (ctx.params && ctx.params.id && books.has(+ctx.params.id)) {
            ctx.response.body = books.get(+ctx.params.id);
        } else {
            ctx.response.body = 404;
        }
    }
    error(ctx: any) {
        ctx.throw(500);
    }

    redirect(ctx: any) {
        ctx.response.redirect(`/param`);
    }

    view(ctx: any) {
        ctx.response.body = Deno.readTextFileSync("./public/views/test.html");
    }
}

export default new Index;