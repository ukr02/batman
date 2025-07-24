import { Service } from "../entities/Service";
import { ServiceDto, CreateServiceDto } from "../dto/ServiceDto";

export class ServiceMapper {
    static fromEntityToDto(entity: Service): ServiceDto {
        return {
            id: entity.id,
            service_name: entity.service_name,
            created_at: entity.created_at,
            updated_at: entity.updated_at
        };
    }

    static fromDtoToEntity(dto: CreateServiceDto): Partial<Service> {
        return {
            service_name: dto.service_name
        };
    }
} 