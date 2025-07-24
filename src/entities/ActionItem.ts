import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("action_items")
@Index(["metric_id"])
@Index(["created_at"])
@Index(["updated_at"])
export class ActionItem {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    jira_link?: string;

    @Column({ type: "integer", nullable: false })
    metric_id!: number;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;
} 