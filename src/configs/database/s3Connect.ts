/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-extraneous-dependencies */
import {
  S3Client,
  PutBucketLifecycleConfigurationCommand,
<<<<<<< HEAD
  // eslint-disable-next-line import/no-duplicates
=======
>>>>>>> dev
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { ExpirationStatus } from '@aws-sdk/client-s3'; // 이 부분은 필요에 따라 import 할 수 있습니다.

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function setBucketLifecyclePolicy(prefix: string) {
  const lifecyclePolicy = {
    Bucket: process.env.AWS_BUCKET, // Assume the bucket name is stored in environment variables
    LifecycleConfiguration: {
      Rules: [
        {
          ID: `Expire${prefix}After7Days`,
          Filter: {
            Prefix: prefix,
          },
          Status: 'Enabled' as ExpirationStatus, // 여기에 타입 캐스팅을 추가
          Expiration: {
            Days: 7,
          },
        },
      ],
    },
  };

  try {
    const command = new PutBucketLifecycleConfigurationCommand(lifecyclePolicy);
    const response = await s3.send(command);
    console.log(
      'Lifecycle policy set successfully for prefix:',
      prefix,
      response
    );
  } catch (error) {
    console.error('Failed to set lifecycle policy for', prefix, ':', error);
  }
}

// setBucketLifecyclePolicy("tokens/");
export default s3;
