import { Repository, In, Between } from 'typeorm';
import { Metric, MetricState } from '../entities/Metric';
import { CreateMetricDto, UpdateMetricDto, MetricFilterDto } from '../dto/MetricDto';

export class MetricRepository {
  private repository: Repository<Metric>;

  constructor(repository: Repository<Metric>) {
    this.repository = repository;
  }

  // Helper method to convert date field from string to number
  private convertDateField(metric: Metric): Metric {
    return {
      ...metric,
      date: metric.date ? Number(metric.date) : undefined
    };
  }

  // Helper method to convert date fields for arrays
  private convertDateFields(metrics: Metric[]): Metric[] {
    return metrics.map(metric => this.convertDateField(metric));
  }

  async findAll(filter?: MetricFilterDto): Promise<Metric[]> {
    try {
      const whereConditions: any = {};

      if (filter?.metrics_config_id) {
        whereConditions.metrics_config_id = filter.metrics_config_id;
      }

      if (filter?.state) {
        whereConditions.state = filter.state;
      }

      if (filter?.date_from || filter?.date_to) {
        whereConditions.date = Between(
          filter.date_from || 0,
          filter.date_to || Number.MAX_SAFE_INTEGER
        );
      }

      const metrics = await this.repository.find({
        where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
        order: { created_at: 'DESC' },
        skip: filter?.offset,
        take: filter?.limit
      });

      return this.convertDateFields(metrics);
    } catch (error) {
      throw new Error(`Failed to fetch metrics: ${error}`);
    }
  }

  async findById(id: number): Promise<Metric | null> {
    try {
      const metric = await this.repository.findOne({ where: { id } });
      
      if (!metric) {
        return null;
      }
      
      return this.convertDateField(metric);
    } catch (error) {
      throw new Error(`Failed to fetch metric with id ${id}: ${error}`);
    }
  }

  async create(metricData: CreateMetricDto): Promise<Metric> {
    try {
      const metric = this.repository.create({
        metrics_config_id: metricData.metrics_config_id,
        name: metricData.name,
        date: metricData.date,
        state: metricData.state as MetricState,
        image_url: metricData.image_url,
        summary_text: metricData.summary_text,
        comment: metricData.comment,
        value: metricData.value,
        criticalityScore: metricData.criticalityScore
      });
      const savedMetric = await this.repository.save(metric);
      return this.convertDateField(savedMetric);
    } catch (error) {
      throw new Error(`Failed to create metric: ${error}`);
    }
  }

  async update(id: number, metricData: UpdateMetricDto): Promise<Metric | null> {
    try {
      const updateData: Partial<Metric> = {};

      if (metricData.metrics_config_id !== undefined) {
        updateData.metrics_config_id = metricData.metrics_config_id;
      }

      if (metricData.name !== undefined) {
        updateData.name = metricData.name;
      }

      if (metricData.date !== undefined) {
        updateData.date = metricData.date;
      }

      if (metricData.state !== undefined) {
        updateData.state = metricData.state as MetricState;
      }

      if (metricData.image_url !== undefined) {
        updateData.image_url = metricData.image_url;
      }

      if (metricData.summary_text !== undefined) {
        updateData.summary_text = metricData.summary_text;
      }

      if (metricData.comment !== undefined) {
        updateData.comment = metricData.comment;
      }

      if (metricData.value !== undefined) {
        updateData.value = metricData.value;
      }

      if (metricData.criticalityScore !== undefined) {
        updateData.criticalityScore = metricData.criticalityScore;
      }

      if (Object.keys(updateData).length === 0) {
        return await this.findById(id);
      }

      await this.repository.update(id, updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update metric with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      throw new Error(`Failed to delete metric with id ${id}: ${error}`);
    }
  }

  async findByConfigIdsAndDate(configIds: number[], date: number): Promise<Metric[]> {
    console.log("configIds", configIds);
    try {
      if (configIds.length === 0) {
        return [];
      }

      const metrics = await this.repository.find({
        where: {
          metrics_config_id: In(configIds),
          date: date
        },
        order: { created_at: 'DESC' }
      });

      return this.convertDateFields(metrics);
    } catch (error) {
      throw new Error(`Failed to fetch metrics for config IDs and date: ${error}`);
    }
  }
} 