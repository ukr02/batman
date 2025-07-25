import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'minioadmin',
                secretAccessKey: 'minioadmin'
            },
            forcePathStyle: true,
            endpoint: 'http://192.168.70.240:9000'  // Update this to your MinIO server URL if different
        });
    }

    /**
     * Generate a presigned download URL for an S3 object
     */
    async generateDownloadURL(bucketName: string, objectName: string): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: objectName
            });

            const presignedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn: 3600 // URL expires in 1 hour (3600 seconds)
            });

            console.log('Generated download URL:', presignedUrl);
            return presignedUrl;
        } catch (error) {
            console.error('Error generating download URL:', error);
            throw error;
        }
    }

    /**
     * Generate presigned URL for a metric image
     * This method assumes the image_url contains the object key in the format:
     * 'metrics-images/metric_name_timestamp.png'
     */
    async generateMetricImageURL(imageUrl: string): Promise<string> {
        try {
            // If imageUrl is already a full URL or doesn't contain the expected format, return as is
            if (!imageUrl || imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
                return imageUrl;
            }

            // Extract bucket name and object key from the image URL
            // Assuming the format is: 'metrics-images/metric_name_timestamp.png'
            const bucketName = 'metrics-bucket';
            const objectName = imageUrl;

            const presignedUrl = await this.generateDownloadURL("hackathon-rm-rf", objectName);
            console.log("bucketName", bucketName);
            console.log("objectName", objectName);
            console.log("presignedUrl", presignedUrl);
            return presignedUrl;
        } catch (error) {
            console.error('Error generating metric image URL:', error);
            // Return original URL if presigned URL generation fails
            return imageUrl;
        }
    }
} 