import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("metrics_config")
@Index(["service_id"])
@Index(["promql_name"])
export class MetricsConfig {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    promql_name!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "integer", nullable: false })
    service_id!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    aggregation?: string;
} 