import { Queue as LavalinkQueue } from "lavalink-client";

declare module "lavalink-client" {
    interface Queue {
        loop: "off" | "track" | "queue";
    }
}
