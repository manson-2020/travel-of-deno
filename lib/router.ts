
import { Router, Context, send, isHttpError, Status } from "oak";

import index from "controllers/index.ts";
import messageBoard from "controllers/messageBoard.ts";

const router: Router = new Router();

router.use(async (ctx: Context, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "*");
    ctx.response.headers.set("Access-Control-Allow-Headers", "*");

    try {
        await send(ctx, ctx.request.url.pathname, { root: Deno.cwd() });
    } catch (err) {
        if (!isHttpError(err)) {
            ctx.response.body = "Server exception.";
            return;
        }
        switch (err.status) {
            case Status.NotFound:
                ctx.response.body = "404 Not Found";
                break;
            default:
                ctx.response.body = err.status;
        }
    }
    next();
})

router.get("/", index.index);

router.get("/login", index.renderLogin);
router.get("/register", index.renderRegister);

router.post("/login", index.login.bind(index));
router.post("/register", index.register.bind(index));

router.get("/messageBoard", messageBoard.index.bind(messageBoard));


export default router;
