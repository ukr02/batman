import { ServiceRepository } from "../repositories/ServiceRepository";
import { CreateServiceDto, UpdateServiceDto, ServiceFilterDto, ServiceDto } from "../dto/ServiceDto";
import { Service } from "../entities/Service";

export class ServiceService {
    constructor(private serviceRepository: ServiceRepository) {}

    async getAllServices(filter?: ServiceFilterDto): Promise<{ services: ServiceDto[], total: number }> {
        const services = await this.serviceRepository.findAll(filter);
        const total = await this.serviceRepository.count(filter);
        
        return {
            services: services.map(this.mapToDto),
            total
        };
    }

    async getAllServicesForAPI(filter?: ServiceFilterDto): Promise<Array<{ id: number; name: string }>> {
        const result = await this.getAllServices(filter);
        return result.services.map(service => ({
            id: service.id,
            name: service.service_name
        }));
    }

    async getServiceById(id: number): Promise<ServiceDto | null> {
        const service = await this.serviceRepository.findById(id);
        return service ? this.mapToDto(service) : null;
    }

    async getServiceByName(serviceName: string): Promise<ServiceDto | null> {
        const service = await this.serviceRepository.findByServiceName(serviceName);
        return service ? this.mapToDto(service) : null;
    }

    async createService(createServiceDto: CreateServiceDto): Promise<ServiceDto> {
        // Check if service with same name already exists
        const existingService = await this.serviceRepository.findByServiceName(createServiceDto.service_name);
        if (existingService) {
            throw new Error(`Service with name '${createServiceDto.service_name}' already exists`);
        }

        const service = await this.serviceRepository.create(createServiceDto);
        return this.mapToDto(service);
    }

    async updateService(id: number, updateServiceDto: UpdateServiceDto): Promise<ServiceDto | null> {
        // Check if service exists
        const existingService = await this.serviceRepository.findById(id);
        if (!existingService) {
            throw new Error(`Service with id ${id} not found`);
        }

        // If updating service name, check if new name already exists
        if (updateServiceDto.service_name && updateServiceDto.service_name !== existingService.service_name) {
            const serviceWithSameName = await this.serviceRepository.findByServiceName(updateServiceDto.service_name);
            if (serviceWithSameName) {
                throw new Error(`Service with name '${updateServiceDto.service_name}' already exists`);
            }
        }

        const updatedService = await this.serviceRepository.update(id, updateServiceDto);
        return updatedService ? this.mapToDto(updatedService) : null;
    }

    async deleteService(id: number): Promise<boolean> {
        // Check if service exists
        const existingService = await this.serviceRepository.findById(id);
        if (!existingService) {
            throw new Error(`Service with id ${id} not found`);
        }

        return await this.serviceRepository.delete(id);
    }

    private mapToDto(service: Service): ServiceDto {
        return {
            id: service.id,
            service_name: service.service_name,
            created_at: service.created_at,
            updated_at: service.updated_at
        };
    }
} 