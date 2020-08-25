
import { Router } from "https://deno.land/x/oak/mod.ts";

import index from "../controllers/index.ts";


const router: any = new Router();

type Methods = "post" | "get" | "put" | "delete" | "option" | "head" | "common" | "patch";

interface Routes {
    path: string,
    method: Methods,
    controller: any
}

const routes: Array<Routes> = [
    { path: "/", method: "get", controller: index.test },
]

routes.forEach(async (item): Promise<void> => {
    router[item.method](item.path, item.controller);
});

export default router;