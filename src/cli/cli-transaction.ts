#!/usr/bin/env node

import * as dotenv from "dotenv";
dotenv.config();
import { RevolutClient } from "../revolut-client";
const revolut = new RevolutClient();
import { Command } from "commander";

const program = new Command();
const FORMAT_JSON = "json";
const FORMAT_QIF = "qif";

program
    .command("list [format] [limit]")
    .description("format can be json or qif")
    .action(async (format = FORMAT_JSON, limit?: number) => {
        try {
            await revolut.setApiKey(process.env.API_KEY);
            const transactions = await revolut.getTransactions(limit);
            switch (format) {
                case FORMAT_JSON: {
                    process.stdout.write(JSON.stringify(transactions, null, 4));
                    break;
                }
                case FORMAT_QIF: {
                    const qif = require("qif-writer");
                    const data = transactions.map((row) => ({
                        amount: row.legs[0].amount,
                        date: new Date(row.completed_at).toLocaleDateString("en-US"),
                        memo: row.reference || row.type,
                        payee: row.legs[0].description
                            .replace("Payment from ", "")
                            .replace("To ", ""),
                    }));
                    qif.write(data, { type: "Bank" });
                    break;
                }
                default:
                    throw new Error("Unknown format " + format);
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
        }
    });

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
