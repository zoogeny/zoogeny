# Zoogeny

This repo contains WIP versions of the Zoogeny app and related books.

The current structure is:

    Zoogeny
        - books
            - A Story for My Self
            - A Story for A Community
            - Commentaries
        - apps
            - What I Want
                - server
                - client
            - Scheduler
                - server
                - client
            - Newsletter
                - server
                - client
            - Audio shorts
                - server
                - client       

TODO:

- build scripts, docker files and servers for the apps
- build program to convert markdown into ePub
    - the output of Kindle Create is not very good
- combined clients for web and mobile
    - consider a component framework to make life easier
        - or build your own - let's try to keep dependencies to a minimum
