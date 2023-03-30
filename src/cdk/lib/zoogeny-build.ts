import { SecretValue } from "aws-cdk-lib";
import { BuildSpec, LinuxBuildImage, Project } from "aws-cdk-lib/aws-codebuild";
import { Artifact, ArtifactPath, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildAction,
  EcsDeployAction,
  GitHubSourceAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { IBaseService } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

export class ZoogenyBuild extends Construct {
  constructor(
    scope: Construct,
    id: string,
    {
      apiService,
      webServerService,
      apiRepo,
      webServerRepo,
    }: {
      apiService: IBaseService;
      webServerService: IBaseService;
      apiRepo: IRepository;
      webServerRepo: IRepository;
    }
  ) {
    super(scope, id);

    // Create a CodeBuild project for building Docker images
    const buildProject = new Project(this, "ZoogenyBuildProject", {
      environment: {
        buildImage: LinuxBuildImage.STANDARD_6_0,
        privileged: true,
      },
      environmentVariables: {
        API_REPOSITORY_URI: { value: apiRepo.repositoryUri },
        WEB_SERVER_REPOSITORY_URI: { value: webServerRepo.repositoryUri },
      },
      buildSpec: BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: [
              "cd src",
              "docker build -t ${API_REPOSITORY_URI}:latest -f api/api.dockerfile .",
              "docker build -t ${WEB_SERVER_REPOSITORY_URI}:latest -f web-server/web-server.dockerfile .",
            ],
          },
          post_build: {
            commands: [
              "cd ..",

              "aws ecr get-login-password | docker login --username AWS --password-stdin ${API_REPOSITORY_URI}",
              "docker push ${API_REPOSITORY_URI}:latest",
              "aws ecr get-login-password | docker login --username AWS --password-stdin ${WEB_SERVER_REPOSITORY_URI}",
              "docker push ${WEB_SERVER_REPOSITORY_URI}:latest",

              `printf '[{"name": "zoogeny-api", "imageUri":"${apiRepo.repositoryUri}:latest"}]' > apiImageDetail.json`,
              `printf '[{"name": "zoogeny-web-server", "imageUri":"${webServerRepo.repositoryUri}:latest"}]' > webServerImageDetail.json`,
            ],
          },
        },
        artifacts: {
          files: ["apiImageDetail.json", "webServerImageDetail.json"],
        },
      }),
    });

    if (!buildProject.role) {
      throw new Error("Build project role is undefined");
    }

    // Grant CodeBuild permissions to access the ECR repository
    apiRepo.grantPullPush(buildProject.role);
    webServerRepo.grantPullPush(buildProject.role);

    // Create a new CodePipeline
    const pipeline = new Pipeline(this, "ZoogenyPipeline", {
      pipelineName: "zoogeny-pipeline",
    });

    // Add a source stage to the pipeline
    const sourceOutput = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: "ZoogenyGitHub",
      output: sourceOutput,
      owner: "zoogeny",
      repo: "zoogeny",
      oauthToken: SecretValue.secretsManager("github-token"),
    });

    pipeline.addStage({
      stageName: "ZoogenySource",
      actions: [sourceAction],
    });

    // Add a build stage to the pipeline
    const buildOutput = new Artifact("BuildOutput");
    const buildAction = new CodeBuildAction({
      actionName: "ZoogenyBuild",
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
    });
    pipeline.addStage({
      stageName: "ZoogenyBuild",
      actions: [buildAction],
    });

    // Add a deploy stage to the pipeline
    const apiDeploy = new EcsDeployAction({
      actionName: "ZoogenyApiDeploy",
      service: apiService,
      imageFile: new ArtifactPath(buildOutput, "apiImageDetail.json"),
    });
    const webServerDeploy = new EcsDeployAction({
      actionName: "ZoogenyWebServerDeploy",
      service: webServerService,
      imageFile: new ArtifactPath(buildOutput, "webServerImageDetail.json"),
    });
    pipeline.addStage({
      stageName: "ZoogenyDeploy",
      actions: [apiDeploy, webServerDeploy],
    });
  }
}
