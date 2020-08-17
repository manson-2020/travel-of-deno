

import Controller from "./index.ts";

class Index extends Controller {
    test(context: any): void {
        context.response.body = "asd"
    }
}

export default new Index("index");