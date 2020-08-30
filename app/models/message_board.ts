
import { db } from "@/lib/database.ts";

export const messageBoard = db.collection("messageBoard");

export default class Message_board {

    insertLogs() {

    }

    getData() {
        return messageBoard.find();
    }
}
