import { Stack, StackProps } from "aws-cdk-lib";
import {
  Cluster,
  FargateTaskDefinition,
  ContainerImage,
} from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

const SERVICE_ID_PREFIX = "Zoogeny";
const SERVICE_NAME_PREFIX = SERVICE_ID_PREFIX.toLowerCase();

export class ZoogenyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the ECS cluster
    const cluster = new Cluster(this, `${SERVICE_ID_PREFIX}Cluster`, {
      clusterName: `${SERVICE_NAME_PREFIX}-cluster`,
    });

    // Create the ECS task definition
    const taskDefinition = new FargateTaskDefinition(
      this,
      `${SERVICE_ID_PREFIX}WebServiceTask`,
      {
        cpu: 512,
        memoryLimitMiB: 1024,
      }
    );

    // Add container definitions to the task definition
    taskDefinition.addContainer(`${SERVICE_ID_PREFIX}WebServiceContainer`, {
      image: ContainerImage.fromRegistry("nginx"),
      memoryLimitMiB: 512,
      portMappings: [{ containerPort: 80 }],
    });

    // Create the ECS service
    new ApplicationLoadBalancedFargateService(
      this,
      `${SERVICE_ID_PREFIX}WebService`,
      {
        cluster,
        taskDefinition,
        desiredCount: 2,
      }
    );

    // Create the S3 bucket
    const bucket = new Bucket(this, `${SERVICE_ID_PREFIX}StaticBucket`, {
      bucketName: `${SERVICE_NAME_PREFIX}-static-bucket`,
    });

    // Create the CloudFront distribution
    new CloudFrontWebDistribution(this, `${SERVICE_ID_PREFIX}Distribution`, {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });
  }
}
