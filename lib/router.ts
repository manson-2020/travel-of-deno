
import { Router, Context } from "oak";

import index from "@/app/controllers/index.ts";
import messageBoard from "@/app/controllers/messageBoard.ts";

const router: Router = new Router();

router.use(async ({ request, response, state }: Context, next) => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "*");
    response.headers.set("Access-Control-Allow-Headers", "*");

    const ignoreRoutes: Array<string> = ["/views/login", "/views/register", "/api/login", "/api/register", "/views/404"]
    if (await state.session.get("userInfo") || ignoreRoutes.includes(request.url.pathname)) {
        await next();
        return;
    }

    response.redirect("/views/login");
})
router.get("/", async ({ response, state }: Context) => {
    response.redirect(`/views/${(await state.session.get("userInfo")) ? "messageBoard" : "login"}`);
})
router.get("/views/login", index.render);
router.get("/views/404", (ctx: any) => ctx.render(`${Deno.cwd()}/app/views/404.ejs`));
router.get("/views/register", index.render);
router.get("/views/messageBoard", messageBoard.render.bind(messageBoard));

router.post("/api/login", index.login.bind(index));
router.post("/api/register", index.register.bind(index));


export default router;
