import { CardTxn } from "./types";
import { BaseAxiosClient } from "../baseAxiosClient";

export class CardTxnSvcClient extends BaseAxiosClient {
    public getCardTxnByTxnId = async (txnID: string) =>
        this.request<CardTxn>(
            {
                url: `/transaction/${txnID}`,
                method: "GET",
            },
            "getCardTxnByTxnId"
        );
}
