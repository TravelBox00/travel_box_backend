import { S3 } from 'aws-sdk';

// AWS S3 설정
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,   // .env 파일에서 관리
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default s3;
