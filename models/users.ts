
import { db } from "../lib/database.ts";

export const users = db.collection("users");

export class Users {

    getData({ username, password }: { username: string, password: string }) {
        return users.findOne({ username, password });
    }
}