import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("action_items")
@Index(["metric_id"])
export class ActionItem {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    jira_link?: string;

    @Column({ type: "integer", nullable: false })
    metric_id!: number;
} 