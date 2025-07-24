import { Column, Entity, Index, PrimaryGeneratedColumn, Check } from "typeorm";

@Entity("metrics")
@Index(["metrics_config_id"])
@Index(["date"])
@Index(["state"])
@Index(["criticalityScore"])
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
    @Check("criticalityScore >= 1 AND criticalityScore <= 100")
    criticalityScore?: number;
} 