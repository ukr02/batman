import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { AggregationType } from "../dto/MetricsConfigDto";

@Entity("metrics_config")
@Index(["service_id"])
@Index(["promql_name"])
@Index(["created_at"])
@Index(["updated_at"])
export class MetricsConfig {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false, name: "promql" })
    promql_name!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "integer", nullable: false })
    service_id!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    aggregation?: AggregationType;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;
} 