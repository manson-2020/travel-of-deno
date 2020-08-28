
import { Application } from "oak";
import { load } from "denv";
import { viewEngine, engineFactory, adapterFactory, } from "view_engine";
import { Session } from "session";
import router from "./lib/router.ts";

const [ejsEngine, oakAdapter] = [engineFactory.getEjsEngine(), adapterFactory.getOakAdapter()];

await load();

const session = new Session({ framework: "oak" });
await session.init();

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }: any) => {
    console.log(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});

app.addEventListener("error", (evt: any) => {
    console.log(evt.error);
});

app.use(session.use()(session));

app.use(viewEngine(oakAdapter, ejsEngine));

app.use(router.allowedMethods());
app.use(router.routes());

await app.listen({ port: 8000 });