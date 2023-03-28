- No short-term or medium term for realtime or sockets

- Store each person's data inside a separate SQLite file

  - Plan to load some representation of that into a temporary store, e.g. Redis
  - Need to explore storing unstructured data (e.g. JSON) on a column of SQLite
    - GPT: SQLite supports TEXT columns with functions such as json_extract(),
      json_set(), json_array().
    - With the caveat: Note that SQLite does not have native support for working with JSON data, so working with JSON data in SQLite can be slower and less efficient than using a database that has native support for JSON data, such as MongoDB or PostgreSQL.
  - Consider a transaction log for mutations
    - How big would this get?

- Not certain where the authorization happens ... probably on the api server

  - Maybe worth implementing OAuth myself
    - GPT: passport.js can be used to implement your own OAuth provider
  - Probably want to allow for auth using:
    - Google
    - Apple
    - Twitch?
    - Facebook?

- Basic endpoints:

  - All endpoints have the same prefix:
    - /{app}/{api-version}/
    - e.g. /schedule/v1/
  - Not sure if I want to include
    - user id
    - org id (for family plans)
    - e.g. /{app}/{api-version}/{org-id}/{user-id}/ ...
  - For now focus on REST endpoints

    - Maybe GraphQL one day on /graphql endpoint ?

  - MVP urls for schedule app (/schedule/v1/ is the implied prefix):
    - GET ./events?start={unixdatetimestamp}&end={unixdatetimestamp}
      - error on invalide start or end (or combination)
      - paged by default
        - optional {offset}={integer offset} (default 0)
        - optional {limit}={limit} (default XXX)
    - POST ./events
      - JSON body with details of event to create
    - PUT & DELETE with event-id? for update and delete?

- Validation (vs. auth)

  - How to manage permissions?
  - Consider family plans (e.g. Dad creating event for son)
  - User table and UserPerm table?
    - 1-to-many relation of UserPerm to User?
    - Read User+UserPerm into Redis for faster access

- Consider security

  - OSWAP
  - ISO/IEC 27001
  - Rate limit
  - AWS web firewall (WAF)

- Using express.js ?

  - not sure of credible alternatives

- Consider ChatGPT integration sooner than later
  - Consider how to deal with validation for this case
    - e.g. on-behalf-of kind of situations
