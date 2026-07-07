import { Collection } from "discord.js";
import { Command } from "./types.ts";

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}