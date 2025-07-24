import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("services")
@Index(["service_name"])
@Index(["created_at"])
@Index(["updated_at"])
export class Service {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    service_name!: string;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;
} 