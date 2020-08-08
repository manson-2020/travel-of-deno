
import { MongoClient } from "https://deno.land/x/mongo@v0.9.1/mod.ts";
import { Application, Router, isHttpError, Status, send, helpers } from "https://deno.land/x/oak/mod.ts";

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
    .get("/", (context) => {
        context.response.body = Deno.readTextFileSync("./test.html");
    }).
    get("/params", context => {
        context.response.body = helpers.getQuery(context, { mergeParams: true });
    })
    .get("/user", (context) => {
        context.response.redirect(`/params?username=${user.username}&password=${user.password}`);
    })
    .get("/error", (context) => {
        context.throw(500);
    })
    .get("/book", (context) => {
        context.response.body = { user, books: Array.from(books.values()) };
    })
    .get("/book/:id", (context) => {
        if (context.params && context.params.id && books.has(+context.params.id)) {
            context.response.body = books.get(+context.params.id);
        } else {
            context.response.body = 404;
        }
    });

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});

app.addEventListener("error", (evt) => {
    console.log(evt.error);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context, next) => {
    try {
        await send(context, context.request.url.pathname, {
            root: `${Deno.cwd()}/`,
            index: "index.html",
        });
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





