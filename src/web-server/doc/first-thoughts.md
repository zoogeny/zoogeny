- Still not sure on the server side and client side frameworks I want to use.

  - Pretty sure that I want to stick with TypeScript for both server and client
  - Frameworks:
    - React / Next.js
    - Vue
    - Sveltekit
  - Pretty sure I want SSR as primary but the nature of the app will require a
    decent amount of client interaction
  - Prefer a solution with 1 bundle per page
    - e.g. no massive single SPA app that includes the universe
    - just the html, js, css, etc. for that single page
    - with concept of "shared" resources in a direction
    - prefer the option to use SSG

- Don't want to deal with the SQLite file on the browser (even if possible)

  - GPT: SQL.js and SQLite Web Assembly are two possible solution in browser
    - caveat: Note that working with SQLite files inside web browsers can be challenging due to security concerns and the limitations of the browser environment. In general, it is recommended to use a server-side database such as MySQL or PostgreSQL for storing and managing data, and to use APIs or libraries to interact with the database from a web page.

- Medium/Long -term considerations:
  - Grid based layout engine
  - Themes (dark/light/high-contrast)
  - Accessibility
  - Animations
  - Component library
