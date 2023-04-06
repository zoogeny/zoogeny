import { Stack, StackProps } from "aws-cdk-lib";
import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";
import { IRepository, Repository } from "aws-cdk-lib/aws-ecr";
import {
  Cluster,
  ContainerImage,
  FargateTaskDefinition,
} from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

import { ZoogenyBuild } from "./zoogeny-build";

const SERVICE_ID_PREFIX = "Zoogeny";
const SERVICE_NAME_PREFIX = SERVICE_ID_PREFIX.toLowerCase();

export class ZoogenyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Load a repository from the AWS environment
    const apiRepo = Repository.fromRepositoryName(
      this,
      "ZoogenyApiRepo",
      "zoogeny-api"
    );
    const webServerRepo = Repository.fromRepositoryName(
      this,
      "ZoogenyWebServerRepo",
      "zoogeny-web-server"
    );

    // Create the ECS cluster
    const cluster = new Cluster(this, `${SERVICE_ID_PREFIX}Cluster`, {
      clusterName: `${SERVICE_NAME_PREFIX}-cluster`,
    });
    const apiService = this.createService(cluster, "ApiService", {
      containerName: "zoogeny-api",
      ecrRepo: apiRepo,
      containerPort: 3001,
    });
    const webServerService = this.createService(cluster, "WebServerService", {
      containerName: "zoogeny-web-server",
      ecrRepo: webServerRepo,
      containerPort: 3000,
    });

    new ZoogenyBuild(this, "ZoogenyBuild", {
      apiService: apiService.service,
      webServerService: webServerService.service,
      apiRepo,
      webServerRepo,
    });

    // Create a S3 bucket for serving static files
    const bucket = new Bucket(this, `${SERVICE_ID_PREFIX}StaticBucket`, {
      bucketName: `${SERVICE_NAME_PREFIX}-static-bucket`,
    });

    // Create a CloudFront distribution for serving the S3 bucket
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

  createService(
    cluster: Cluster,
    serviceName: string,
    {
      ecrRepo,
      containerPort,
      containerName,
    }: { ecrRepo: IRepository; containerPort: number; containerName: string }
  ): ApplicationLoadBalancedFargateService {
    // Create the ECS task definition
    const taskDefinition = new FargateTaskDefinition(
      this,
      `${SERVICE_ID_PREFIX}${serviceName}Task`,
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    // Add container definitions to the task definition
    taskDefinition.addContainer(`${SERVICE_ID_PREFIX}${serviceName}Container`, {
      containerName,
      image: ContainerImage.fromEcrRepository(ecrRepo, "latest"),
      memoryLimitMiB: 512,
      portMappings: [{ containerPort }],
    });

    // Create the ECS service
    return new ApplicationLoadBalancedFargateService(
      this,
      `${SERVICE_ID_PREFIX}${serviceName}`,
      {
        cluster,
        taskDefinition,
        desiredCount: 2,
      }
    );
  }
}
