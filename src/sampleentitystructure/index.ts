// import {
//     CreditedTo,
//     DifficultyLevel,
//     GameRewardSource,
//     GameRewardSourceTxnType,
//     GameRewardStatus,
//     GameRewardType,
//     MessageStatus,
//     ReferralRewardCategory,
// } from "../../../datacenter/enums";
// import { BbpsBillerCategory, BbpsTxnInstrument } from "../../../dto/bbps/types";
// import { UpiTxnCategory } from "../../../dto/upiTxn/enums";
// import { GenericRewardCategory } from "../../../dto/genericRewards/enums";
// import { NonTransactionGameRewardMetadata } from "../../../datacenter/entities";
// import { TransactionGameRewardMetadataDto } from "../../../dto/gameRewards";

// export type TxnCategory = UpiTxnCategory | BbpsBillerCategory | ReferralRewardCategory | GenericRewardCategory;

// export type SourceInstrument = BbpsTxnInstrument;

// export type CreateGameRewardsDto = Omit<GameRewardsDto, "entityId" | "id" | "createdAt" | "updatedAt">;

// export type GameRewardsDto = {
//     id: string;
//     entityId: string;
//     userId: string;
//     requestId: string;
//     source: GameRewardSource;
//     maxRewardAmount: number;
//     calcRewardAmount?: number;
//     refTxnId?: string;
//     type: GameRewardType;
//     status: GameRewardStatus;
//     gameplayId?: string;
//     rewardEarned?: number;
//     refRewardId?: string;
//     creditedTo?: CreditedTo;
//     createdAt: Date;
//     updatedAt: Date;
//     // lockRefTimestamp?: Date;
//     // bufferedSignals?: Array<{ signal: string; payload?: Partial<GameRewards> }>;
//     metadata?: {
//         sourceInstrument?: SourceInstrument;
//         txnCategory: TxnCategory;
//         platform?: string;
//         isIntroductoryGameReward?: boolean;
//         expiryTimestamp?: string;
//         difficultyLevel?: DifficultyLevel;
//         createdByAdmin?: boolean;
//     };
//     gameRewardSourceMetadata?: {
//         title: string;
//         label?: string;
//         transactionType?: GameRewardSourceTxnType;
//     };
// };

// export type TxnMetadataDto = Pick<
//     //todoo: remove & use TransactionGameRewardMetadataDto
//     TransactionGameRewardMetadataDto,
//     | "counterPartyName"
//     | "counterPartyId"
//     | "counterPartyMcc"
//     | "counterPartyCleanName"
//     | "amountInPaisa"
//     | "transactionType"
//     | "transactionCategory"
//     | "transactionPayType"
// >;

// export type NonTxnMetadataDto = Pick<NonTransactionGameRewardMetadata, "title" | "label">;

// export type GameRewardEventDto = {
//     gameRewardId: string;
//     gameRewardCreatedAt: Date;
//     messageVersion: string;
//     status: MessageStatus;
//     payload: GameRewardsDto & Required<{ isGameplayVisible: boolean }> & { _id?: string };
//     metadata?: Record<string, any>;
//     createdAt?: Date;
//     updatedAt?: Date;
// };

// export type GameRewardBufferedSignalsDto = {
//     id: string;
//     gameRewardKey: string;
//     signal: string;
//     payload?: Partial<GameRewardsDto>;
// };
