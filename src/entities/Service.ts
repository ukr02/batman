import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("services")
@Index(["service_name"])
export class Service {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    service_name!: string;
} 