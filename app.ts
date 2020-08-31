
import { Application, Context } from "oak";
import { load } from "denv";
import { viewEngine, engineFactory, adapterFactory, } from "view_engine";
import { Session } from "session";
import router from "./lib/router.ts";

const app = new Application();

await load();

const [ejsEngine, oakAdapter] = [engineFactory.getEjsEngine(), adapterFactory.getOakAdapter()];

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

app.use(viewEngine(oakAdapter, ejsEngine));

app.use(router.allowedMethods());
app.use(router.routes());

app.use((ctx: Context) => {
    ctx.response.status = 404;
    ctx.response.redirect("/views/404");
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});

app.addEventListener("error", (evt) => {
    console.log(evt.error);
    const date: Date = new Date();
    const path: string = `${Deno.cwd()}/logs/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.txt`;
    Deno.writeTextFile(path, evt.error + "\n", { append: true });
});

await app.listen({ port: 8000 });