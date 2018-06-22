#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
    .version("0.0.1")
    .command("transaction <action>", "list transactions, format can be json or qif")
    .command("account <action>", "list accounts")
    ;

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

module.exports = {};
