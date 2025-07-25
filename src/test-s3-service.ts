import { S3Service } from './services/S3Service';

async function testS3Service() {
    const s3Service = new S3Service();
    
    try {
        // Test the generateDownloadURL method
        console.log('Testing S3Service...');
        
        const testObjectName = 'metrics-images/metric_cbs_error_rate_1{method="POST", uri="-bsgaccounting-api-v2-transfer-upi"}}_20250725_042600.png';
        const bucketName = 'metrics-bucket';
        
        console.log(`Generating presigned URL for: ${testObjectName}`);
        const presignedUrl = await s3Service.generateDownloadURL(bucketName, testObjectName);
        console.log('Generated presigned URL:', presignedUrl);
        
        // Test the generateMetricImageURL method
        console.log('\nTesting generateMetricImageURL...');
        const metricImageUrl = await s3Service.generateMetricImageURL(testObjectName);
        console.log('Generated metric image URL:', metricImageUrl);
        
        console.log('\nS3Service test completed successfully!');
    } catch (error) {
        console.error('S3Service test failed:', error);
    }
}

// Run the test
testS3Service(); 