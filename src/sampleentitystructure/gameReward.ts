// import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
// import { CreditedTo, DifficultyLevel, GameRewardSource, GameRewardStatus, GameRewardType } from "../enums";
// import type { SourceInstrument, TxnCategory } from "../../dbConnector/gameRewards/types";

// @Entity("game_reward")
// @Unique(["entityId"])
// @Unique(["userId", "source", "requestId"])
// @Index(["userId", "createdAt"])
// @Index(["status", "updatedAt"])
// @Index(["gameplayId"])
// @Index(["refTxnId"])
// export class GameReward {
//     @PrimaryGeneratedColumn({ type: "bigint" })
//     id!: string;

//     @Column({ type: "varchar" })
//     entityId!: string;

//     @Column()
//     userId!: string;

//     @Column()
//     requestId!: string;

//     @Column({ type: "varchar" })
//     source!: GameRewardSource;

//     @Column({ type: "bigint" })
//     maxRewardAmount!: string; //in paise

//     @Column({ type: "bigint", nullable: true })
//     calcRewardAmount?: string; //in paise

//     @Column({ nullable: true })
//     refTxnId?: string;

//     @Column({ type: "varchar" })
//     type!: GameRewardType;

//     @Column({ type: "varchar" })
//     status!: GameRewardStatus;

//     @Column({ nullable: true })
//     gameplayId?: string;

//     @Column({ type: "bigint", nullable: true })
//     rewardEarned?: string; //paise

//     @Column({ nullable: true })
//     refRewardId?: string;

//     @Column({ type: "varchar", nullable: true })
//     creditedTo?: CreditedTo;

//     @CreateDateColumn({ type: "timestamptz" })
//     createdAt!: Date;

//     @UpdateDateColumn({ type: "timestamptz" })
//     updatedAt!: Date;

//     @Column({ type: "jsonb", nullable: true })
//     metadata?: {
//         sourceInstrument?: SourceInstrument;
//         txnCategory: TxnCategory;
//         platform?: string;
//         isIntroductoryGameReward?: boolean;
//         expiryTimestamp?: string;
//         difficultyLevel?: DifficultyLevel;
//         createdByAdmin?: boolean;
//     };
// }
