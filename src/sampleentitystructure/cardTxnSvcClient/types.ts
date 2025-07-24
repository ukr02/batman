export enum CardTxnType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT",
}

export enum CardTxnStatus {
    COMPLETED = "COMPLETED",
    REVERSED = "REVERSED",
    REJECTED = "REJECTED",
}

export enum CardTxnChannel {
    POS = "POS",
    ECOM = "ECOM",
}

export type CardTxn = {
    userId: string;
    txnId: string;
    txnAmount: number;
    txnType: CardTxnType;
    txnStatus: CardTxnStatus;
    merchant: {
        merchantId: string;
        merchantName: string;
        merchantCategoryCode: string;
    };
    txnTime: Date;
    txnChannel?: CardTxnChannel;
    refDebitTxnId?: string;
    settlementStatus?: string;
    settlementDate?: Date;
};
