
import { Router } from "oak";

import index from "controllers/index.ts";

const router: any = new Router();

router.get("/", index.test);


export default router;