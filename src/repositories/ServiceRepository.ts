import { Repository, Like } from 'typeorm';
import { Service } from '../entities/Service';
import { CreateServiceDto, UpdateServiceDto, ServiceFilterDto } from '../dto/ServiceDto';

export class ServiceRepository {
    private repository: Repository<Service>;

    constructor(repository: Repository<Service>) {
        this.repository = repository;
    }

    async findAll(filter?: ServiceFilterDto): Promise<Service[]> {
        try {
            const whereConditions: any = {};
            
            if (filter?.service_name) {
                whereConditions.service_name = Like(`%${filter.service_name}%`);
            }

            return await this.repository.find({
                where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
                order: { created_at: 'DESC' },
                skip: filter?.offset,
                take: filter?.limit
            });
        } catch (error) {
            throw new Error(`Failed to fetch services: ${error}`);
        }
    }

    async findById(id: number): Promise<Service | null> {
        try {
            return await this.repository.findOne({ where: { id } });
        } catch (error) {
            throw new Error(`Failed to fetch service with id ${id}: ${error}`);
        }
    }

    async findByServiceName(serviceName: string): Promise<Service | null> {
        try {
            return await this.repository.findOne({ where: { service_name: serviceName } });
        } catch (error) {
            throw new Error(`Failed to fetch service with name ${serviceName}: ${error}`);
        }
    }

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        try {
            const service = this.repository.create({
                service_name: createServiceDto.service_name
            });
            return await this.repository.save(service);
        } catch (error) {
            if (error instanceof Error && error.message.includes('duplicate key')) {
                throw new Error(`Service with name '${createServiceDto.service_name}' already exists`);
            }
            throw new Error(`Failed to create service: ${error}`);
        }
    }

    async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service | null> {
        try {
            const updateData: Partial<Service> = {};
            
            if (updateServiceDto.service_name !== undefined) {
                updateData.service_name = updateServiceDto.service_name;
            }

            if (Object.keys(updateData).length === 0) {
                return await this.findById(id);
            }

            await this.repository.update(id, updateData);
            return await this.findById(id);
        } catch (error) {
            if (error instanceof Error && error.message.includes('duplicate key')) {
                throw new Error(`Service with name '${updateServiceDto.service_name}' already exists`);
            }
            throw new Error(`Failed to update service with id ${id}: ${error}`);
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const result = await this.repository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            throw new Error(`Failed to delete service with id ${id}: ${error}`);
        }
    }

    async count(filter?: ServiceFilterDto): Promise<number> {
        try {
            const whereConditions: any = {};
            
            if (filter?.service_name) {
                whereConditions.service_name = Like(`%${filter.service_name}%`);
            }

            return await this.repository.count({
                where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined
            });
        } catch (error) {
            throw new Error(`Failed to count services: ${error}`);
        }
    }
} 