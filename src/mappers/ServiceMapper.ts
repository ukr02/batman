import { Service } from "../entities/Service";
import { ServiceDto, CreateServiceDto, UpdateServiceDto } from "../dto/ServiceDto";

export class ServiceMapper {
    static fromEntityToDto(entity: Service): ServiceDto {
        return {
            id: entity.id,
            service_name: entity.service_name
        };
    }

    static fromDtoToEntity(dto: CreateServiceDto): Partial<Service> {
        return {
            service_name: dto.service_name
        };
    }

    static fromUpdateDtoToEntity(dto: UpdateServiceDto): Partial<Service> {
        const entity: Partial<Service> = {};
        if (dto.service_name !== undefined) {
            entity.service_name = dto.service_name;
        }
        return entity;
    }
} 