import { expect } from "chai";
import "mocha";
import * as sinon from "sinon";

import { RevolutClient } from "../../src/revolut-client";

describe("RevolutClient", () => {
    let client: RevolutClient;
    let sandbox: sinon.SinonSandbox;

    afterEach(() => {
        sandbox.restore();
    });
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        client = new RevolutClient();
    });

    describe("#getAccounts()", () => {
        it("should call correct endpoint", async () => {
            // arrange
            const spyOnRequest = sinon.stub(client as any, "request").returns(Promise.resolve([{
                balance: 0,
                created_at: "2017-10-19T13:26:37.604Z",
                currency: "EUR",
                id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                name: "Main",
                public: true,
                state: "active",
                updated_at: "2017-10-19T13:26:37.604Z",
              }]));

            // act
            const accounts = await client.getAccounts();

            // assert
            sinon.assert.calledWith(spyOnRequest, "/api/1.0/accounts");
            expect(accounts).length(1);
            expect(accounts[0]).to.eql({
                balance: 0,
                created_at: "2017-10-19T13:26:37.604Z",
                currency: "EUR",
                id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                name: "Main",
                public: true,
                state: "active",
                updated_at: "2017-10-19T13:26:37.604Z",
            });
        });
    });

    describe("#getTransactions()", () => {
        it("should call correct endpoint", async () => {
            // arrange
            const spyOnRequest = sinon.stub(client as any, "request")
                .resolves([
                    {
                        completed_at: "2018-06-20T10:35:23.877Z",
                        created_at: "2018-06-20T10:35:23.877Z",
                        id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                        legs: [
                          {
                            account_id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                            amount: 1234,
                            currency: "EUR",
                            description: "Payment from Testuser",
                            leg_id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                          },
                        ],
                        reference: "Ausgleich",
                        state: "completed",
                        type: "topup",
                        updated_at: "2018-06-20T10:35:23.877Z",
                      },
                      {
                        completed_at: "2018-06-19T23:00:56.951Z",
                        created_at: "2018-06-19T23:00:56.950Z",
                        id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                        legs: [
                          {
                            account_id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                            amount: -1.23,
                            currency: "EUR",
                            description: "Freelance plan fee",
                            leg_id: "abc6ca51-abcd-abcd-abcd-7b1e38e13c0c",
                          },
                        ],
                        state: "completed",
                        type: "fee",
                        updated_at: "2018-06-19T23:00:56.950Z",
                      },
                ]);

            // act
            const transactions = await client.getTransactions(2);

            // assert
            sinon.assert.calledWith(spyOnRequest, "/api/1.0/transactions?count=2");
            expect(transactions.length).to.eql(2);
        });
    });

});
