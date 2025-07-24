import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("metrics")
@Index(["metrics_config_id"])
@Index(["date"])
@Index(["state"])
@Index(["criticalityScore"])
@Index(["created_at"])
@Index(["updated_at"])
export class Metric {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "integer", nullable: false })
    metrics_config_id!: number;

    @Column({ type: "varchar", length: 100, nullable: true })
    name?: string;

    @Column({ type: "bigint", nullable: true })
    date?: number;

    @Column({ type: "varchar", length: 10, nullable: true })
    state?: string;

    @Column({ type: "text", nullable: true })
    image_url?: string;

    @Column({ type: "text", nullable: true })
    summary_text?: string;

    @Column({ type: "text", nullable: true })
    comment?: string;

    @Column({ type: "float", nullable: true })
    value?: number;

    @Column({ type: "integer", nullable: true })
    criticalityScore?: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;
} 