
import { Application, send, isHttpError, Status } from "oak";
// import { viewEngine, engineFactory, adapterFactory, } from "view_engine";

import router from "./lib/router.ts";

// const ejsEngine = engineFactory.getEjsEngine();
// const oakAdapter = adapterFactory.getOakAdapter();

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }: any) => {
    console.log(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});

app.addEventListener("error", (evt: any) => {
    console.log(evt.error);
});

// app.use(viewEngine(oakAdapter, ejsEngine));
app.use(router.routes());
app.use(router.allowedMethods());


app.use(async (context: any, next: any) => {
    context.response.headers.set("Access-Control-Allow-Origin", "*");
    context.response.headers.set("Access-Control-Allow-Methods", "*");
    context.response.headers.set("Access-Control-Allow-Headers", "*");

    await next();
    try {
        await send(context, context.request.url.pathname, { root: Deno.cwd() });
    } catch (err) {
        if (!isHttpError(err)) {
            context.response.body = "Server exception.";
            return;
        }
        switch (err.status) {
            case Status.NotFound:
                context.response.body = "404 Not Found";
                break;
            default:
                context.response.body = err.status;
        }
    }
});


await app.listen({ port: 8000 });