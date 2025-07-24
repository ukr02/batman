// import { IGameRewardsDb } from "./interfaces";
// import {
//     GameRewardBufferedSignalsMapper,
//     GameRewardEventsMapper,
//     GameRewardMapper,
//     NonTransactionGameRewardMetadataMapper,
//     OverallGameplayStatsMapper,
//     PlayedGameplaySummaryMapper,
//     TransactionGameRewardMetadataMapper,
// } from "../../datacenter/mapper";
// import { RecordMetadata } from "kafkajs";
// import {
//     GameReward,
//     GameRewardBufferedSignal,
//     GameRewardEventMonthly,
//     GameRewardProactiveClawback,
//     IntroGameRewardCount,
//     NonTransactionGameRewardMetadata,
//     PlayedGameplaySummary,
//     TransactionGameRewardMetadata,
//     HistoricGameplayStats,
//     OverallGameplayStats,
//     UserRewardDetail,
// } from "../../datacenter/entities";
// import { Between, Brackets, EntityManager, In, IsNull, MoreThanOrEqual, Repository } from "typeorm";
// import { CreateGameRewardsDto, GameRewardEventDto, GameRewardsDto } from "./types";
// import {
//     CreditedTo,
//     GameRewardSource,
//     GameRewardSourceTxnType,
//     GameRewardsSignal,
//     GameRewardStatus,
//     GameRewardType,
//     MessageStatus,
// } from "../../datacenter/enums";
// import { PaginationOptions } from "../../services/gameRewards/types";
// import { rupeeToPaiseConverter } from "../../utils/currencyConversionHelper";
// import {
//     HistoricGameplayStatsUpdateDto,
//     HistoricGameplayStatsDto,
//     OverallGameplayStatsDto,
//     OverallGameplayStatsCreateDto,
// } from "../../dto/gameplayStats";
// import { PlayedGameplaySummaryDto } from "../../dto/gameRewards";
// import { HistoricGameplayStatsMapper } from "../../datacenter/mapper";

// const DEFAULT_PAGINATION_LIMIT = 1000;

// export class GameRewardsPostgres implements IGameRewardsDb {
//     constructor(
//         private readonly gameRewardsRepository: Repository<GameReward>,
//         private readonly gameRewardEventsMonthlyRepository: Repository<GameRewardEventMonthly>,
//         private readonly userRewardDetailsRepository: Repository<UserRewardDetail>,
//         private readonly gameRewardBufferedSignalsRepository: Repository<GameRewardBufferedSignal>,
//         private readonly gameRewardProactiveClawbackRepository: Repository<GameRewardProactiveClawback>,
//         private readonly introGameRewardCountRepository: Repository<IntroGameRewardCount>,
//         private readonly transactionGameRewardMetadataRepository: Repository<TransactionGameRewardMetadata>,
//         private readonly nonTransactionGameRewardMetadataRepository: Repository<NonTransactionGameRewardMetadata>,
//         private readonly playedGameplaySummaryRepository: Repository<PlayedGameplaySummary>,
//         private readonly userOverallGameplayStatsRepository: Repository<OverallGameplayStats>,
//         private readonly userHistoricGameplayStatsRepository: Repository<HistoricGameplayStats>
//     ) {}

//     async setIntroGameRewardCountByUserId(userId: string, gameRewardsWon: number) {
//         const introGameRewardCount = this.introGameRewardCountRepository.create();
//         introGameRewardCount.userId = userId;
//         introGameRewardCount.count = gameRewardsWon;
//         await this.introGameRewardCountRepository
//             .createQueryBuilder()
//             .insert()
//             .values(introGameRewardCount)
//             .orUpdate(["count"], ["userId"])
//             .execute();
//     }

//     async getIntroductoryGameRewardCountByUserId(userId: string): Promise<number | null> {
//         const introGameRewardCount = await this.introGameRewardCountRepository
//             .createQueryBuilder("introGameRewardCount")
//             .where("introGameRewardCount.userId = :userId", { userId })
//             .getOne();
//         return introGameRewardCount ? introGameRewardCount.count : null;
//     }

//     async findOneById(entityId: string): Promise<GameRewardsDto | null> {
//         const gameReward = await this.gameRewardsRepository.findOneBy({ entityId: entityId });
//         return gameReward ? GameRewardMapper.fromEntityToDto(gameReward) : null;
//     }

//     async findOneByIdAndUserId(entityId: string, userId: string): Promise<GameRewardsDto | null> {
//         const gameReward = await this.gameRewardsRepository.findOneBy({ entityId, userId });
//         return gameReward ? GameRewardMapper.fromEntityToDto(gameReward) : null;
//     }

//     async findOneByGameplayIdAndUserId(gameplayId: string, userId: string): Promise<GameRewardsDto | null> {
//         const gameReward = await this.gameRewardsRepository
//             .createQueryBuilder("gameReward")
//             .where("gameReward.gameplayId = :gameplayId", { gameplayId })
//             .andWhere("gameReward.userId = :userId", { userId })
//             .getOne();
//         return gameReward ? GameRewardMapper.fromEntityToDto(gameReward) : null;
//     }

//     async findOneByUserIdAndRequestIdAndSource(userId: string, requestId: string, source: GameRewardSource) {
//         const gameReward = await this.gameRewardsRepository.findOneBy({ userId, requestId, source });
//         return gameReward ? GameRewardMapper.fromEntityToDto(gameReward) : null;
//     }

//     async findOneByRefTxnId(userId: string, refTxnId: string, source: GameRewardSource) {
//         const gameReward = await this.gameRewardsRepository.findOneBy({ userId, refTxnId, source });
//         return gameReward ? GameRewardMapper.fromEntityToDto(gameReward) : null;
//     }

//     async findOneByGameplayIdAndFilter(gameplayId: string, filter: { userId?: string } = {}) {
//         const queryBuilder = this.gameRewardsRepository
//             .createQueryBuilder("gameReward")
//             .where("gameReward.gameplayId = :gameplayId", { gameplayId });
//         if (filter.userId) {
//             queryBuilder.andWhere("gameReward.userId = :userId", { userId: filter.userId });
//         }
//         const gameReward = await queryBuilder.getOne();
//         return gameReward ? GameRewardMapper.fromEntityToDto(gameReward) : null;
//     }

//     async findAllGameRewardsByUserIdAndRefTxnIds(userId: string, refTxnIds: string[]) {
//         const entities = await this.gameRewardsRepository.find({ where: { userId, refTxnId: In(refTxnIds) } });
//         return entities.map((entity) => GameRewardMapper.fromEntityToDto(entity));
//     }

//     async getGameRewardsByGameplayIds(gameplayIds: string[]) {
//         const entities = await this.gameRewardsRepository.find({ where: { gameplayId: In(gameplayIds) } });
//         return entities.map((entity) => GameRewardMapper.fromEntityToDto(entity));
//     }

//     /**
//      * DRAFT state gameReward creation
//      */
//     async create(gameRewardDto: CreateGameRewardsDto, _isGameplayVisible = false) {
//         return this.createGameReward(GameRewardMapper.fromDtoToEntity(gameRewardDto));
//     }

//     async addGameplayId(entityId: string, gameplayId: string) {
//         const updateResult = await this.gameRewardsRepository
//             .createQueryBuilder()
//             .update()
//             .set({ gameplayId })
//             .where("entityId = :id AND gameplayId IS NULL", { id: entityId })
//             .returning("*")
//             .execute();

//         const updatedGameRewards = updateResult.raw[0] as GameReward;
//         return updatedGameRewards ? GameRewardMapper.fromEntityToDto(updatedGameRewards) : null;
//     }

//     /**
//      * rewardEarned in paise
//      */
//     async recordRewardEarnedAndUpdateRewardStatusAsPendingById(
//         id: string,
//         rewardEarned: number,
//         platform: string,
//         createEvent: boolean,
//         updateEarnings: boolean,
//         isGameplayVisible = false
//     ) {
//         const updateMetadata = {
//             platform,
//         };
//         return this.gameRewardsRepository.manager.transaction(async (manager) => {
//             const updateResult = await manager
//                 .createQueryBuilder()
//                 .update(GameReward)
//                 .set({ rewardEarned, status: GameRewardStatus.PENDING, metadata: () => `metadata || :newField::jsonb` })
//                 .where("entityId = :id AND rewardEarned IS NULL", { id: id })
//                 .andWhere("status = :status", { status: GameRewardStatus.CREATED })
//                 .setParameter("newField", JSON.stringify(updateMetadata))
//                 .returning("*")
//                 .execute();

//             if (!updateResult.affected) {
//                 return null;
//             }

//             const updatedGameReward = updateResult.raw[0] as GameReward;
//             const gameRewardsDto = GameRewardMapper.fromEntityToDto(updatedGameReward);
//             if (updateEarnings && rewardEarned) {
//                 await this.incrementGameRewardEarnings(updatedGameReward.userId, "" + rewardEarned, manager);
//             }
//             if (createEvent) {
//                 await this.createGameRewardEvent({ ...gameRewardsDto, isGameplayVisible }, manager);
//             }
//             return gameRewardsDto;
//         });
//     }

//     async updateRewardStatusAsBonfireCreatedByEntityId(
//         entityId: string,
//         createEvent: boolean,
//         manager?: EntityManager
//     ) {
//         manager = manager ?? this.gameRewardsRepository.manager;

//         const updateResult = await manager
//             .createQueryBuilder()
//             .update(GameReward)
//             .set({ status: GameRewardStatus.BONFIRE_CREATED })
//             .where("entityId = :entityId and status = :status", { entityId, status: GameRewardStatus.PENDING })
//             .returning("*")
//             .execute();

//         if (!updateResult.affected) {
//             return null;
//         }

//         const gameRewardsDto = GameRewardMapper.fromEntityToDto(updateResult.raw[0] as GameReward);
//         if (createEvent) {
//             const isGameplayVisible = false;
//             await this.createGameRewardEvent({ ...gameRewardsDto, isGameplayVisible }, manager);
//         }
//         return gameRewardsDto;
//     }

//     async updateRewardTypeAndMarkPendingIfPpiCashback(entityId: string) {
//         const updateResult = await this.gameRewardsRepository
//             .createQueryBuilder()
//             .update(GameReward)
//             .set({
//                 type: GameRewardType.DSA_CASHBACK,
//                 status: GameRewardStatus.PENDING,
//             })
//             .where({ entityId, type: GameRewardType.PPI_CASHBACK })
//             .returning("*")
//             .execute();

//         return updateResult.affected !== 0 ? GameRewardMapper.fromEntityToDto(updateResult.raw[0] as GameReward) : null;
//     }

//     async updateStatusById(
//         entityId: string,
//         status: GameRewardStatus,
//         createEvent: boolean,
//         isGameplayVisible = false
//     ) {
//         return this.gameRewardsRepository.manager.transaction(async (manager) => {
//             const updateResult = await manager
//                 .createQueryBuilder()
//                 .update(GameReward)
//                 .set({ status })
//                 .where("entityId = :id", { id: entityId })
//                 .returning("*")
//                 .execute();

//             if (!updateResult.affected) {
//                 return null;
//             }

//             const gameRewardsDto = GameRewardMapper.fromEntityToDto(updateResult.raw[0] as GameReward);
//             if (createEvent) {
//                 await this.createGameRewardEvent({ ...gameRewardsDto, isGameplayVisible }, manager);
//             }
//             return gameRewardsDto;
//         });
//     }

//     async updateStatusAndRefTxnIdAndSourceInstrumentByEntityId(
//         entityId: string,
//         status: GameRewardStatus,
//         refTxnId: string,
//         sourceInstrument: string | undefined,
//         createEvent: boolean,
//         isGameplayVisible = false
//     ): Promise<GameRewardsDto | null> {
//         return this.gameRewardsRepository.manager.transaction(async (manager) => {
//             const updateResult = await manager
//                 .createQueryBuilder()
//                 .update(GameReward)
//                 .set({
//                     status,
//                     refTxnId,
//                     ...(sourceInstrument && {
//                         metadata: () => `jsonb_set(metadata, '{sourceInstrument}', '"${sourceInstrument}"', true)`,
//                     }),
//                 })
//                 .where("entityId = :id", { id: entityId })
//                 .returning("*")
//                 .execute();

//             if (!updateResult.affected) return null;
//             const updatedGameReward = updateResult.raw[0] as GameReward;
//             const gameRewardsDto = GameRewardMapper.fromEntityToDto(updatedGameReward);
//             if (createEvent) {
//                 await this.createGameRewardEvent({ ...gameRewardsDto, isGameplayVisible }, manager);
//             }
//             return gameRewardsDto;
//         });
//     }

//     async addRefRewardIdById(entityId: string, userOfferId: string, creditedTo: CreditedTo) {
//         return this.gameRewardsRepository.manager.transaction(async (manager) => {
//             const updateResult = await manager
//                 .createQueryBuilder()
//                 .update(GameReward)
//                 .set({ refRewardId: userOfferId, creditedTo })
//                 .where({ entityId })
//                 .returning("*")
//                 .execute();

//             if (!updateResult.affected) {
//                 return null;
//             }

//             return GameRewardMapper.fromEntityToDto(updateResult.raw[0] as GameReward);
//         });
//     }

//     async addRefRewardIdAndMarkStatusCompletedById(
//         entityId: string,
//         createEvent: boolean,
//         refRewardId?: string,
//         creditedTo?: CreditedTo,
//         isGameplayVisible = false
//     ): Promise<GameRewardsDto | null> {
//         return this.gameRewardsRepository.manager.transaction(async (manager) => {
//             const updateResult = await manager
//                 .createQueryBuilder()
//                 .update(GameReward)
//                 .set({ refRewardId, creditedTo, status: GameRewardStatus.COMPLETED })
//                 .where({ entityId, status: GameRewardStatus.PENDING })
//                 .returning("*")
//                 .execute();

//             if (!updateResult.affected) {
//                 const gameReward = await manager.getRepository(GameReward).findOneBy({ entityId });
//                 return gameReward && gameReward.status === GameRewardStatus.COMPLETED
//                     ? GameRewardMapper.fromEntityToDto(gameReward)
//                     : null;
//             }

//             const gameRewardsDto = GameRewardMapper.fromEntityToDto(updateResult.raw[0] as GameReward);

//             if (createEvent) {
//                 await this.createGameRewardEvent({ ...gameRewardsDto, isGameplayVisible }, manager);
//             }
//             return gameRewardsDto;
//         });
//     }

//     async getEventsByGameRewardIdOrderByCreatedAt(entityId: string): Promise<GameRewardEventDto[]> {
//         const gameReward = await this.gameRewardsRepository.findOneBy({ entityId });
//         if (!gameReward) throw new Error("GameReward not found");

//         const gameRewardEventList = await this.gameRewardEventsMonthlyRepository
//             .createQueryBuilder("gre")
//             .where("gre.gameRewardId = :gameRewardId", { gameRewardId: gameReward.id })
//             .andWhere("gre.gameRewardCreatedAt = :gameRewardCreatedAt", {
//                 gameRewardCreatedAt: gameReward.createdAt,
//             })
//             .orderBy("gre.createdAt", "ASC")
//             .getMany();

//         return gameRewardEventList.map((event) => GameRewardEventsMapper.fromEntityToDto(event));
//     }

//     async updateEventStatus(
//         filter: { messageVersion: string; gameRewardId: string; gameRewardCreatedAt: Date },
//         update: {
//             metadata: RecordMetadata;
//             status: MessageStatus;
//         }
//     ): Promise<GameRewardEventDto | null> {
//         const updateResult = await this.gameRewardEventsMonthlyRepository.update(
//             {
//                 gameRewardId: filter.gameRewardId,
//                 messageVersion: filter.messageVersion,
//                 gameRewardCreatedAt: filter.gameRewardCreatedAt,
//             },
//             {
//                 status: update.status,
//                 metadata: update.metadata,
//             }
//         );

//         const updatedEvent = updateResult?.generatedMaps[0] as GameRewardEventMonthly;
//         if (!updatedEvent) return null;
//         return GameRewardEventsMapper.fromEntityToDto(updatedEvent);
//     }

//     async bufferSignalByKey(gameRewardKey: string, signal: GameRewardsSignal, payload?: Partial<GameRewardsDto>) {
//         const upsertResult = await this.gameRewardBufferedSignalsRepository.upsert(
//             {
//                 gameRewardKey: gameRewardKey,
//                 signal: signal,
//                 payload: payload ?? {},
//             },
//             ["gameRewardKey", "signal"]
//         );

//         return upsertResult.raw[0] as GameRewardBufferedSignal;
//     }

//     async fetchBufferedSignalsByKey(gameRewardKey: string, sort: "ASC" | "DESC" = "ASC") {
//         const bufferedSignals = await this.gameRewardBufferedSignalsRepository.find({
//             where: { gameRewardKey: gameRewardKey, processedAt: IsNull() },
//             order: { id: sort },
//         });

//         return bufferedSignals.map((bufferedSignal) => GameRewardBufferedSignalsMapper.fromEntityToDto(bufferedSignal));
//     }

//     async removeBufferedSignalByKey(gameRewardKey: string, signal: string) {
//         const updateResult = await this.gameRewardBufferedSignalsRepository
//             .createQueryBuilder()
//             .update()
//             .set({ processedAt: () => "CURRENT_TIMESTAMP" })
//             .where("gameRewardKey = :key", { key: gameRewardKey })
//             .andWhere("signal = :signal", { signal })
//             .returning("*")
//             .execute();

//         if ((updateResult.affected ?? 0) > 0) {
//             const updatedGameReward = updateResult.raw[0] as GameRewardBufferedSignal;
//             return GameRewardBufferedSignalsMapper.fromEntityToDto(updatedGameReward);
//         }

//         return null;
//     }

//     async getGameRewardsBySourceAndRefTxnId(source: GameRewardSource, refTxnId: string) {
//         const entities = await this.gameRewardsRepository.find({
//             where: { source, refTxnId },
//         });
//         return entities.map((entity) => GameRewardMapper.fromEntityToDto(entity));
//     }

//     async getGameRewardsByStatusAndUpdatedTimeRange(
//         status: GameRewardStatus,
//         { startTime, endTime }: { startTime: Date; endTime?: Date },
//         { limit }: Pick<PaginationOptions, "limit">
//     ) {
//         const query = this.gameRewardsRepository
//             .createQueryBuilder("gameReward")
//             .where("gameReward.status = :status", { status })
//             .andWhere("gameReward.updatedAt >= :startTime", { startTime });

//         if (endTime) {
//             query.andWhere("gameReward.updatedAt < :endTime", { endTime });
//         }

//         query.orderBy("gameReward.updatedAt", "ASC").take(limit);

//         const gameRewards = await query.getMany();
//         return {
//             gameRewards: gameRewards.map((gameReward) => GameRewardMapper.fromEntityToDto(gameReward)),
//             lastUpdatedAt: gameRewards[gameRewards.length - 1]?.updatedAt,
//         };
//     }

//     async getAllocatedGameRewardsByUserId(userId: string, limit = 10, sortOrder: "ASC" | "DESC" = "ASC") {
//         const entities = await this.gameRewardsRepository.find({
//             where: { userId },
//             take: limit,
//             order: { createdAt: sortOrder },
//         });
//         return entities.map((entity) => GameRewardMapper.fromEntityToDto(entity));
//     }

//     async getGameRewardIdsAndSourcesByUserIdAndFilter(
//         userId: string,
//         startTime: Date,
//         endTime: Date,
//         types: GameRewardType[],
//         statuses: GameRewardStatus[]
//     ): Promise<Pick<GameRewardsDto, "id" | "source" | "metadata">[]> {
//         const gameRewards = await this.gameRewardsRepository
//             .createQueryBuilder("gameReward")
//             .select(["gameReward.id", "gameReward.source", "gameReward.metadata"])
//             .where("gameReward.userId = :userId", { userId })
//             .andWhere("gameReward.type IN (:...types)", { types })
//             .andWhere("gameReward.status IN (:...statuses)", { statuses })
//             .andWhere("gameReward.createdAt >= :startTime", { startTime })
//             .andWhere("gameReward.createdAt < :endTime", { endTime })
//             .getMany();
//         return gameRewards.map((gameReward) => ({
//             id: gameReward.id,
//             source: gameReward.source,
//             metadata: gameReward.metadata,
//         }));
//     }

//     async getGameRewardsCountByUserIdAndFilter(
//         userId: string,
//         {
//             requestIds,
//             statuses,
//             sources,
//             startDate,
//             endDate,
//         }: {
//             requestIds?: string[];
//             statuses?: GameRewardStatus[];
//             sources?: GameRewardSource[];
//             startDate?: Date;
//             endDate?: Date;
//         }
//     ) {
//         const queryBuilder = this.gameRewardsRepository
//             .createQueryBuilder("gameReward")
//             .where("gameReward.userId = :userId", { userId });
//         if (sources?.length) {
//             queryBuilder.andWhere("gameReward.source IN (:...sources)", { sources: sources });
//         }
//         if (requestIds?.length) {
//             queryBuilder.andWhere("gameReward.requestId IN (:...requestIds)", { requestIds: requestIds });
//         }
//         if (statuses?.length) {
//             queryBuilder.andWhere("gameReward.status IN (:...statuses)", { statuses: statuses });
//         }
//         if (startDate) {
//             queryBuilder.andWhere("gameReward.createdAt >= :startDate", { startDate: startDate });
//         }
//         if (endDate) {
//             queryBuilder.andWhere("gameReward.createdAt <= :endDate", { endDate: endDate });
//         }
//         return queryBuilder.getCount();
//     }

//     async getGameRewardsByUserIdAndRequestIdsAndSource(userId: string, requestIds: string[], source: GameRewardSource) {
//         const entities = await this.gameRewardsRepository.find({
//             where: { userId, requestId: In(requestIds), source },
//         });
//         return entities.map((entity) => GameRewardMapper.fromEntityToDto(entity));
//     }

//     async getGameRewardsByUserIdAndFilter(
//         userId: string,
//         filter: {
//             requestIds?: string[];
//             statuses?: GameRewardStatus[];
//             sources?: GameRewardSource[];
//             types?: GameRewardType[];
//             startDate?: Date;
//             endDate?: Date;
//         },
//         paginationOptions?: PaginationOptions
//     ) {
//         const queryBuilder = this.gameRewardsRepository
//             .createQueryBuilder("gameReward")
//             .where("gameReward.userId = :userId", { userId });
//         if (filter.sources?.length) {
//             queryBuilder.andWhere("gameReward.source IN (:...sources)", { sources: filter.sources });
//         }
//         if (filter.requestIds?.length) {
//             queryBuilder.andWhere("gameReward.requestId IN (:...requestIds)", { requestIds: filter.requestIds });
//         }
//         if (filter.statuses?.length) {
//             queryBuilder.andWhere("gameReward.status IN (:...statuses)", { statuses: filter.statuses });
//         }
//         if (filter.types?.length) {
//             queryBuilder.andWhere("gameReward.type IN (:...types)", { types: filter.types });
//         }
//         if (filter.startDate) {
//             queryBuilder.andWhere("gameReward.createdAt >= :startDate", { startDate: filter.startDate });
//         }
//         if (filter.endDate) {
//             queryBuilder.andWhere("gameReward.createdAt <= :endDate", { endDate: filter.endDate });
//         }
//         queryBuilder
//             .orderBy("gameReward.createdAt", "DESC")
//             .skip(paginationOptions?.skip ?? 0)
//             .take(paginationOptions?.limit ?? DEFAULT_PAGINATION_LIMIT);
//         const records = await queryBuilder.getMany();

//         return records.map((record) => GameRewardMapper.fromEntityToDto(record));
//     }

//     async getUnpublishedEventsCursor(startTime: Date, endTime: Date) {
//         return this.gameRewardEventsMonthlyRepository
//             .createQueryBuilder("gameRewardEventMonthly")
//             .where({
//                 status: MessageStatus.PENDING,
//                 createdAt: Between(startTime, endTime),
//             })
//             .getMany();
//     }

//     async createGameRewardEvent(
//         gameRewards: GameRewardsDto & Required<{ isGameplayVisible: boolean }>,
//         manager?: EntityManager
//     ): Promise<GameRewardEventMonthly> {
//         manager = manager ?? this.gameRewardEventsMonthlyRepository.manager;

//         const gameRewardEvent = GameRewardEventsMapper.fromDtoToEntity({
//             gameRewardId: gameRewards.id,
//             gameRewardCreatedAt: gameRewards.createdAt,
//             messageVersion: `${new Date(gameRewards.updatedAt).getTime()}`,
//             status: MessageStatus.PENDING,
//             payload: gameRewards,
//         });
//         return manager.save(gameRewardEvent);
//     }

//     async addPlayedGameRewardSummaryAndUpdateStats(
//         gameReward: GameRewardsDto,
//         winningAmount: number,
//         playedAt: Date,
//         updateOverallGameplayStats: boolean
//     ) {
//         return this.gameRewardsRepository.manager.transaction(async (manager) => {
//             await this.createPlayedGameRewardSummary(gameReward, winningAmount, playedAt, manager);
//             if (updateOverallGameplayStats) {
//                 await this.upsertUserOverallGameplayStats(gameReward, winningAmount, manager);
//             }
//         });
//     }

//     async upsertHistoricGameplayStats(statsDto: HistoricGameplayStatsUpdateDto) {
//         const updateResult = await this.userHistoricGameplayStatsRepository
//             .createQueryBuilder()
//             .update()
//             .set({
//                 winAmountL6D: statsDto.winAmountL6DInPaisa + "",
//                 winCountL6D: statsDto.winCountL6D,
//                 gamesPlayedL6D: statsDto.gamesPlayedL6D,
//             })
//             .where("userId = :userId", { userId: statsDto.userId })
//             .andWhere("productType = :productType", { productType: statsDto.productType })
//             .returning("*")
//             .execute();

//         if (updateResult.affected) {
//             return updateResult.raw[0] as HistoricGameplayStats;
//         }

//         const historicGameplayStats = this.userHistoricGameplayStatsRepository.create();
//         historicGameplayStats.userId = statsDto.userId;
//         historicGameplayStats.productType = statsDto.productType;
//         historicGameplayStats.rewardType = statsDto.rewardType;
//         historicGameplayStats.winAmountL6D = statsDto.winAmountL6DInPaisa + "";
//         historicGameplayStats.winCountL6D = statsDto.winCountL6D;
//         historicGameplayStats.gamesPlayedL6D = statsDto.gamesPlayedL6D;

//         const insertResult = await this.userHistoricGameplayStatsRepository
//             .createQueryBuilder()
//             .insert()
//             .values(historicGameplayStats)
//             .orUpdate(
//                 ["winAmountL6D", "winCountL6D", "gamesPlayedL6D", "updatedAt"],
//                 ["userId", "productType", "rewardType"]
//             )
//             .returning("*")
//             .execute();

//         return insertResult.raw[0] as HistoricGameplayStats;
//     }

//     async insertOverallGameplayStats(statsDto: OverallGameplayStatsCreateDto): Promise<OverallGameplayStats> {
//         const overallGameplayStats = this.userOverallGameplayStatsRepository.create();
//         overallGameplayStats.userId = statsDto.userId;
//         overallGameplayStats.productType = statsDto.productType;
//         overallGameplayStats.rewardType = statsDto.rewardType;
//         overallGameplayStats.totalGamesPlayed = statsDto.totalGamesPlayed;
//         overallGameplayStats.totalWinCount = statsDto.totalWinCount;
//         overallGameplayStats.consecutiveLossCount = statsDto.consecutiveLosses;

//         const insertResult = await this.userOverallGameplayStatsRepository
//             .createQueryBuilder()
//             .insert()
//             .values(overallGameplayStats)
//             .returning("*")
//             .execute();

//         return insertResult.raw[0];
//     }

//     async getPlayedGameplaySummariesInDateRange(
//         userId: string,
//         filters: { startDate: Date; endDate: Date; productType: GameRewardSource; rewardType: GameRewardType }[]
//     ): Promise<PlayedGameplaySummaryDto[]> {
//         if (!filters.length) throw new Error("Empty filter");
//         const qb = new Brackets((qb) => {
//             filters.forEach((filter, index) => {
//                 const condition = `"productType" = :productType${index} AND "rewardType" = :rewardType${index} and "playedAt" >= :startDate${index} and "playedAt" < :endDate${index}`;
//                 const params = {
//                     [`productType${index}`]: filter.productType,
//                     [`rewardType${index}`]: filter.rewardType,
//                     [`startDate${index}`]: filter.startDate,
//                     [`endDate${index}`]: filter.endDate,
//                 };

//                 if (index === 0) {
//                     qb.where(condition, params);
//                 } else {
//                     qb.orWhere(condition, params);
//                 }
//             });
//         });
//         const gameplaySummaries = await this.playedGameplaySummaryRepository
//             .createQueryBuilder()
//             .where('"userId" = :userId', { userId })
//             .andWhere(qb)
//             .getMany();

//         return gameplaySummaries.map((gameplaySummary) => PlayedGameplaySummaryMapper.fromEntityToDto(gameplaySummary));
//     }

//     async getHistoricGameplayStatsByUserIdAndFilters(
//         userId: string,
//         filters: {
//             productType: GameRewardSource;
//             rewardTypes: GameRewardType[];
//         }[]
//     ): Promise<HistoricGameplayStatsDto[]> {
//         if (!filters.length) throw new Error("Empty filter");
//         const qb = new Brackets((qb) => {
//             filters.forEach((filter, index) => {
//                 if (!filter.rewardTypes.length) throw new Error("Empty rewardTypes");
//                 const condition = `"productType" = :productType${index} AND "rewardType" IN (:...rewardTypes${index})`;
//                 const params = {
//                     [`productType${index}`]: filter.productType,
//                     [`rewardTypes${index}`]: filter.rewardTypes,
//                 };

//                 if (index === 0) {
//                     qb.where(condition, params);
//                 } else {
//                     qb.orWhere(condition, params);
//                 }
//             });
//         });

//         const gameplayStatsList = await this.userHistoricGameplayStatsRepository
//             .createQueryBuilder()
//             .where('"userId" = :userId', { userId })
//             .andWhere(qb)
//             .getMany();

//         return gameplayStatsList.map((gameplayStats) => HistoricGameplayStatsMapper.fromEntityToDto(gameplayStats));
//     }

//     async getOverallGameplayStatsByUserIdAndFilters(
//         userId: string,
//         filters: {
//             productType: GameRewardSource;
//             rewardTypes: GameRewardType[];
//         }[]
//     ): Promise<OverallGameplayStatsDto[]> {
//         if (!filters.length) throw new Error("Empty filter");
//         const qb = new Brackets((qb) => {
//             filters.forEach((filter, index) => {
//                 if (!filter.rewardTypes.length) throw new Error("Empty rewardTypes");
//                 const condition = `"productType" = :productType${index} AND "rewardType" IN (:...rewardTypes${index})`;
//                 const params = {
//                     [`productType${index}`]: filter.productType,
//                     [`rewardTypes${index}`]: filter.rewardTypes,
//                 };

//                 if (index === 0) {
//                     qb.where(condition, params);
//                 } else {
//                     qb.orWhere(condition, params);
//                 }
//             });
//         });

//         const gameplayStatsList = await this.userOverallGameplayStatsRepository
//             .createQueryBuilder()
//             .where('"userId" = :userId', { userId })
//             .andWhere(qb)
//             .getMany();

//         return gameplayStatsList.map((gameplayStats) => OverallGameplayStatsMapper.fromEntityToDto(gameplayStats));
//     }

//     private async createPlayedGameRewardSummary(
//         gameReward: GameRewardsDto,
//         winningAmount: number,
//         playedAt: Date,
//         manager?: EntityManager
//     ): Promise<void> {
//         manager = manager ?? this.playedGameplaySummaryRepository.manager;
//         const playedGameplaySummary = manager.create(PlayedGameplaySummary);
//         playedGameplaySummary.userId = gameReward.userId;
//         playedGameplaySummary.gameRewardId = gameReward.id;
//         playedGameplaySummary.playedAt = playedAt;
//         playedGameplaySummary.productType = gameReward.source;
//         playedGameplaySummary.rewardType = gameReward.type;
//         playedGameplaySummary.rewardEarned = rupeeToPaiseConverter(winningAmount) + "";
//         playedGameplaySummary.gameRewardCreatedAt = gameReward.createdAt;
//         await manager.createQueryBuilder().insert().into(PlayedGameplaySummary).values(playedGameplaySummary).execute();
//     }

//     private async upsertUserOverallGameplayStats(
//         gameReward: GameRewardsDto,
//         winningAmount: number,
//         manager?: EntityManager
//     ) {
//         manager = manager ?? this.userOverallGameplayStatsRepository.manager;

//         const isGameWon = winningAmount > 0;
//         const updateResult = await manager
//             .createQueryBuilder()
//             .update(OverallGameplayStats)
//             .set({
//                 totalGamesPlayed: () => '"totalGamesPlayed" + 1',
//                 consecutiveLossCount: () => (isGameWon ? 0 : '"consecutiveLossCount" + 1'),
//                 ...(isGameWon && { totalWinCount: () => '"totalWinCount" + 1' }),
//             })
//             .where("userId = :userId", { userId: gameReward.userId })
//             .andWhere("productType = :productType", { productType: gameReward.source })
//             .returning("*")
//             .execute();

//         if (updateResult.affected) {
//             return updateResult.raw[0] as OverallGameplayStats;
//         }

//         const overallGameplayStats = manager.create(OverallGameplayStats);
//         overallGameplayStats.userId = gameReward.userId;
//         overallGameplayStats.productType = gameReward.source;
//         overallGameplayStats.rewardType = gameReward.type;
//         overallGameplayStats.totalWinCount = isGameWon ? 1 : 0;
//         overallGameplayStats.totalGamesPlayed = 1;
//         overallGameplayStats.consecutiveLossCount = isGameWon ? 0 : 1;

//         await manager
//             .createQueryBuilder()
//             .insert()
//             .into(OverallGameplayStats)
//             .values(overallGameplayStats)
//             .orIgnore() //todoo: use DO UPDATE
//             .execute();
//     }

//     private async createGameReward(gameRewards: GameReward, manager?: EntityManager) {
//         manager = manager ?? this.gameRewardsRepository.manager;
//         const insertResult = await manager
//             .createQueryBuilder()
//             .insert()
//             .into(GameReward)
//             .values(gameRewards)
//             .returning("*")
//             .execute();
//         return GameRewardMapper.fromEntityToDto(insertResult.raw[0] as GameReward);
//     }

//     /**
//      * Reward earned in paise
//      */
//     private async incrementGameRewardEarnings(uuid: string, rewardEarnedInPaisa: string, manager?: EntityManager) {
//         manager = manager ?? this.userRewardDetailsRepository.manager;
//         const result = await manager.increment(
//             UserRewardDetail,
//             { userId: uuid },
//             "gameRewardEarnings",
//             rewardEarnedInPaisa
//         );
//         if (result.affected === 0) {
//             const userRewardDetail = this.userRewardDetailsRepository.create({
//                 userId: uuid,
//                 gameRewardEarnings: rewardEarnedInPaisa,
//             });
//             await manager
//                 .createQueryBuilder(UserRewardDetail, "userRewardDetail")
//                 .insert()
//                 .values(userRewardDetail)
//                 .onConflict(
//                     `("userId") DO UPDATE SET "gameRewardEarnings" = "userRewardDetail"."gameRewardEarnings" + ${rewardEarnedInPaisa}`
//                 )
//                 .execute();
//         }
//     }

//     async bulkUpdateGameRewardByIds(
//         gameRewardIds: string[],
//         userId: string,
//         calcRewardAmount: string,
//         rewardReclaimed: boolean,
//         refCreditTxnId: string
//     ): Promise<void> {
//         await this.gameRewardsRepository.manager.transaction(async (manager) => {
//             await this.bulkUpdateGameRewardAmountByIds(gameRewardIds, userId, calcRewardAmount, manager);
//             await this.bulkUpdateGameRewardClawbackStatusByRewardIds(
//                 gameRewardIds,
//                 rewardReclaimed,
//                 refCreditTxnId,
//                 manager
//             );
//         });
//     }

//     private async bulkUpdateGameRewardAmountByIds(
//         gameRewardIds: string[],
//         userId: string,
//         calcRewardAmount: string,
//         manager?: EntityManager
//     ): Promise<void> {
//         manager = manager ?? this.gameRewardsRepository.manager;
//         await manager
//             .createQueryBuilder()
//             .update(GameReward)
//             .set({ calcRewardAmount })
//             .where("id IN (:...gameRewardIds)", { gameRewardIds })
//             .andWhere("status IN (:...statuses)", { statuses: [GameRewardStatus.CREATED] })
//             .andWhere("userId = :userId", { userId })
//             .execute();
//     }

//     private async bulkUpdateGameRewardClawbackStatusByRewardIds(
//         gameRewardIds: string[],
//         rewardReclaimed: boolean,
//         refCreditTxnId: string,
//         manager?: EntityManager
//     ): Promise<void> {
//         manager = manager ?? this.gameRewardsRepository.manager;
//         await manager
//             .createQueryBuilder()
//             .update(GameRewardProactiveClawback)
//             .set({ isRewardClawedBack: rewardReclaimed, refTxnId: refCreditTxnId })
//             .where("gameRewardId IN (:...gameRewardIds)", { gameRewardIds })
//             .execute();
//     }

//     async getClawbackStatusByGameRewardId(gameRewardId: string): Promise<boolean> {
//         const result = await this.gameRewardProactiveClawbackRepository
//             .createQueryBuilder("clawback")
//             .select("clawback.isRewardClawedBack")
//             .where("clawback.gameRewardId = :gameRewardId", { gameRewardId })
//             .getOne();

//         return !!result?.isRewardClawedBack;
//     }

//     async getTxnGameRewardMetadataByGameRewardId(gameRewardId: string, createdAt: Date) {
//         const gameRewardMetadata = await this.transactionGameRewardMetadataRepository.findOne({
//             where: { gameRewardId, createdAt },
//         });
//         return gameRewardMetadata ? TransactionGameRewardMetadataMapper.fromEntityToDto(gameRewardMetadata) : null;
//     }

//     async getTxnGameRewardMetadataListInBulk(gameRewards: { gameRewardId: string; createdAt: Date }[]) {
//         if (!gameRewards.length) return [];
//         const gameRewardMetadataList = await this.transactionGameRewardMetadataRepository.find({
//             where: gameRewards,
//         });
//         return gameRewardMetadataList.map((gameRewardMetadata) =>
//             TransactionGameRewardMetadataMapper.fromEntityToDto(gameRewardMetadata)
//         );
//     }

//     async getNonTxnGameRewardMetadataListInBulk(gameRewards: { gameRewardId: string; createdAt: Date }[]) {
//         if (!gameRewards.length) return [];
//         const gameRewardMetadataList = await this.nonTransactionGameRewardMetadataRepository.find({
//             where: gameRewards,
//         });
//         return gameRewardMetadataList.map((gameRewardMetadata) =>
//             NonTransactionGameRewardMetadataMapper.fromEntityToDto(gameRewardMetadata)
//         );
//     }

//     async getTxnCounterPartyDetailsByGameRewardIdsAndCreatedAt(
//         gameRewardIds: string[],
//         createdAt: Date,
//         transactionType?: GameRewardSourceTxnType
//     ) {
//         const records = await this.transactionGameRewardMetadataRepository.find({
//             select: ["counterPartyId", "gameRewardId"],
//             where: {
//                 gameRewardId: In(gameRewardIds),
//                 createdAt: MoreThanOrEqual(createdAt),
//                 ...(transactionType && { transactionType }),
//             },
//         });

//         return records.flatMap(({ counterPartyId, gameRewardId, transactionType }) =>
//             counterPartyId ? [{ counterPartyId, gameRewardId, transactionType }] : []
//         );
//     }

//     async addTransactionGameRewardMetadata(transactionDetails: Omit<TransactionGameRewardMetadata, "updatedAt">) {
//         const transactionGameRewardMetadata = this.transactionGameRewardMetadataRepository.create(transactionDetails);

//         const insertResult = await this.transactionGameRewardMetadataRepository
//             .createQueryBuilder("transactionGameRewardMetadata")
//             .insert()
//             .values(transactionGameRewardMetadata)
//             .orIgnore()
//             .returning("*")
//             .execute();

//         return insertResult.raw[0];
//     }

//     async getNonTxnGameRewardMetadataByGameRewardId(gameRewardId: string, createdAt: Date) {
//         const metadata = await this.nonTransactionGameRewardMetadataRepository.findOne({
//             where: { gameRewardId, createdAt },
//         });
//         return metadata ? NonTransactionGameRewardMetadataMapper.fromEntityToDto(metadata) : null;
//     }

//     async addNonTransactionGameRewardMetadata(
//         nonTransactionDetails: Omit<NonTransactionGameRewardMetadata, "updatedAt">
//     ) {
//         const nonTransactionGameRewardMetadata =
//             this.nonTransactionGameRewardMetadataRepository.create(nonTransactionDetails);

//         const insertResult = await this.nonTransactionGameRewardMetadataRepository
//             .createQueryBuilder("nonTransactionGameRewardMetadata")
//             .insert()
//             .values(nonTransactionGameRewardMetadata)
//             .orIgnore()
//             .returning("*")
//             .execute();

//         return insertResult.raw[0];
//     }
// }
