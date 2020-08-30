
import { db } from "@/lib/database.ts";
import { Hash, encode } from "checksum";

export const users = db.collection("users");


interface User {
    username: string,
    password: string
}

export class Users {
    verifyIdentity({ username, password }: User) {
        password = new Hash("md5").digest(encode(password)).hex();
        return users.findOne({ username, password });
    }

    async addUser({ username, password }: User) {
        if (await users.findOne({ username })) {
            return false;
        }

        password = new Hash("md5").digest(encode(password)).hex();

        const token = new Hash("md5").digest(encode(username + Date.now())).hex();
        return users.insertOne({ username, password, token });
    }
}