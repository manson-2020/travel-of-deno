
import { MongoClient } from "https://deno.land/x/mongo@v0.9.1/mod.ts";
import { Application, Router, isHttpError, Status, send, helpers, Context } from "https://deno.land/x/oak/mod.ts";
import { multiParser } from 'https://deno.land/x/multiparser@v2.0.1/mod.ts';

const client = new MongoClient();

client.connectWithUri("mongodb://localhost:27017");

const db = client.database("test");
const users = db.collection("users");
const user: any = await users.findOne();

const books = new Map();
books.set(1, {
    id: "1",
    title: "The Hound of the Baskerilles",
    author: "Conan Doyle, Arthur",
});

const router = new Router();
router
    .get("/", (context: any) => {
        context.response.body = Deno.readTextFileSync("./public/views/test.html");
    }).get("/user", (context: any) => {
        context.response.redirect(`/params?username=${user.username}&password=${user.password}`);
    }).get("/error", (context: any) => {
        context.throw(500);
    }).get("/book", (context: any) => {
        context.response.body = { user, books: Array.from(books.values()) };
    }).get("/book/:id", (context: any) => {
        if (context.params && context.params.id && books.has(+context.params.id)) {
            context.response.body = books.get(+context.params.id);
        } else {
            context.response.body = 404;
        }
    }).get("/params", (context: any) => {
        context.response.body = helpers.getQuery(context, { mergeParams: true });
    }).post("/", async (context: any) => {
        try {
            const { type, value } = context.request.body();

            context.response.body = await (type === "form-data" ? multiParser(context.request.serverRequest) : value);

        } catch (e) {
            context.response.body = e;
        }
    });

router.get("/test", context => {
    context.response.body = "test"
})

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }: any) => {
    console.log(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});

app.addEventListener("error", (evt: any) => {
    console.log(evt.error);
});


app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context: any, next: any) => {
    context.response.headers.set("Access-Control-Allow-Origin", "*");
    context.response.headers.set("Access-Control-Allow-Methods", "*");

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


