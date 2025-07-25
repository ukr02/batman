import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export enum PageType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY"
}

@Entity("pages")
@Index(["service_id"])
@Index(["parent_id"])
@Index(["type"])
@Index(["created_at"])
@Index(["updated_at"])
export class Page {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "integer", nullable: false })
    service_id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    type!: string;

    @Column({ type: "integer", nullable: true })
    parent_id?: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    heading?: string;

    @Column({ type: "bigint", nullable: true })
    date?: number;

    @Column({ type: "text", nullable: true })
    opsgenie_summary?: string;

    @Column({ type: "text", nullable: true })
    metric_summary?: string;

    @Column({ type: "text", nullable: true })
    annotations?: string;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;
} 