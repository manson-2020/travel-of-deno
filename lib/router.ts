
import { Router, Context, send } from "oak";

import index from "controllers/index.ts";
import messageBoard from "controllers/messageBoard.ts";

const router: Router = new Router();

router.use(async (ctx: Context, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "*");
    ctx.response.headers.set("Access-Control-Allow-Headers", "*");

    if (["/views/login", "/views/register", "/views/404"].includes(ctx.request.url.pathname)) {
        await next();
        return;
    }

    if (await ctx.state.session.get("userInfo")) {
        await next();
        return;
    }
    ctx.response.redirect("/api/login");
})

router.get("/views/login", (ctx: Context) => ctx.response.redirect("/views/login"));
router.get("/views/404", (ctx: any) => ctx.render(`${Deno.cwd()}/views/404.ejs`));

router.get("/views/login", index.render);
router.get("/views/register", index.render);

router.post("/api/login", index.login.bind(index));
router.post("/api/register", index.register.bind(index));

router.get("/views/messageBoard", messageBoard.render.bind(messageBoard));

export default router;
