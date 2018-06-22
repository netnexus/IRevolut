#!/usr/bin/env node

import * as dotenv from "dotenv";
dotenv.config();
import { RevolutClient } from "../revolut-client";
const revolut = new RevolutClient();
import { Command } from "commander";

const program = new Command();

program
    .command("list")
    .description("list all accounts")
    .action(async () => {
        try {
            await revolut.setApiKey(process.env.API_KEY);
            const accounts = await revolut.getAccounts();
            process.stdout.write(JSON.stringify(accounts, null, 4));
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
        }
    });

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
