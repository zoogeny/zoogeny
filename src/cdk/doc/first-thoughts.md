
* Basic System Architecture:
    * 2 services
        * `web-server`: the web application that serves the SSR HTML
            * https://app.zoogeny.com/
        * `api`: the api server
            * https://api.zoogeny.com/
        * both run inside containers on AWS ECS using Fargate
    * 2 object stores
        * `sqlite-db`: a structured store for the sqlite databases
        * `static`: a dump for static files to be served through CDN
    * 1 cdn
        * `cdn`: expose the `static` object store to the web
    * 1 Postgres DB
        * `postgres`: hold app data (e.g. user table)
    * 1 queue
        * `batch-queue`: for batch processing
    * 1 redis
        * `cache`: for basic caching

* Consider tear-down & rebuild for resources
    * Often times changes to low-level resources requires a total rebuild 
        * e.g. most alterations to the VPC
    * Consider these as disposable if possible, everything from the VPC up
    * That requires supporting two prod infra simultaneously and 
      then doing some kind of DNS swap while both are running
      then tearing down the old infra once the new one is validated

* MVP:
    * 2 services on Fargate
    * 1 S3 bucket for static site
    * 1 CDN for static site
    * Simple Hello, World flow:
        * api and web-service are TS applications running in docker container
        * web-service exposed to Internet
        * HTTP request comes in
        * web-service makes call to api to get "Hello, World"
        * web-service writes out HTML response
        * cdn exposed to Internet
        * cdn returns resource referenced in web-service HTML

