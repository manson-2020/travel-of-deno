
import { Router } from "oak";

import index from "controllers/index.ts";

const router: any = new Router();

router.get("/", index.index);

router.post("/user/login", index.login);


export default router;