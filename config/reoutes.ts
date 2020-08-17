
import { Router } from "https://deno.land/x/oak/mod.ts";

import Index from "../controllers/test.ts";

const router = new Router();

interface Route {
    route: string
    method: string,
    handle: object
}


const routes: Array<Route> = [
    { route: "/", method: "post", handle: Index.test }
]

routes.forEach((item: Route): void => {
    router[item.method](item.route)
})

