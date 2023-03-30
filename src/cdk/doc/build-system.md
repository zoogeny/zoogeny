- I push code to github
- I create a PR from the dev branch to master
  - a build action determines if the code passes lint/prettier/tests
- I merge the change into master
- CodeBuild starts a build which creates the docker images

  - pull the code from github
  - build the docker images
  - push the docker images to ECR

- Staging starts a build

  - pull the image from ECR
  - Update staging ECS tasks for the services with the new build

- Prod
  - manual trigger
  - pull the latest image from ECR
    -- Update production ECS tasks for the services with the new build
