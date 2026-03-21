import type { LessonStep } from '@/lib/learn-data';

export const backendLessons: Record<
  string,
  {
    steps: LessonStep[];
    commonMistakes?: { mistake: string; explanation: string }[];
    practiceQuestions?: string[];
  }
> = {
  // ───────────────────────────────────────────────
  // 1. What is a Server?
  // ───────────────────────────────────────────────
  'what-is-a-server': {
    steps: [
      {
        title: 'The Client-Server Model',
        content:
          'The web runs on a simple idea: clients ask questions, servers answer them. Your browser is a client. When you type a URL, it sends a request to a server, which sends back the page.',
        analogy:
          'Think of a restaurant. You (the client) sit at a table, look at the menu, and place an order. The waiter (HTTP) carries your order to the kitchen (server), which prepares your food (data) and sends it back.',
        diagram:
          'Request-Response Cycle:\n\n  ┌──────────┐                    ┌──────────┐\n  │  Client  │── HTTP Request ──►│  Server  │\n  │ (Browser)│   GET /api/users  │ (Node.js)│\n  │          │                   │          │\n  │          │◄─ HTTP Response ──│          │\n  │          │   200 OK + JSON   │          │\n  └──────────┘                    └────┬─────┘\n                                       │\n                                       ▼\n                                 ┌──────────┐\n                                 │ Database │\n                                 │(Postgres)│\n                                 └──────────┘',
        flow: [
          { label: 'Client', description: 'Browser sends HTTP request', icon: '💻' },
          { label: 'DNS', description: 'Domain resolved to IP', icon: '📖' },
          { label: 'Server', description: 'Processes the request', icon: '🖥️' },
          { label: 'Database', description: 'Reads or writes data', icon: '🗄️' },
          { label: 'Response', description: 'HTML/JSON sent back', icon: '📨' },
        ],
        keyTakeaway:
          'The web is a conversation: clients send requests, servers process them and send responses. HTTP is the language they speak.',
      },
      {
        title: 'HTTP — The Language of the Web',
        content:
          'HTTP (HyperText Transfer Protocol) defines how messages are formatted and transmitted. Every request has a method, URL, headers, and optionally a body.',
        cards: [
          { title: 'GET', description: 'Read data — no request body', icon: '📖', color: 'blue' },
          { title: 'POST', description: 'Create new resource with body', icon: '➕', color: 'emerald' },
          { title: 'PUT', description: 'Replace entire resource', icon: '🔄', color: 'purple' },
          { title: 'PATCH', description: 'Partial update to resource', icon: '✏️', color: 'amber' },
          { title: 'DELETE', description: 'Remove a resource', icon: '🗑️', color: 'red' },
          { title: 'HEAD', description: 'GET without response body', icon: '📋', color: 'cyan' },
        ],
        code: [
          {
            language: 'bash',
            label: 'Anatomy of an HTTP request',
            code: `# A simple GET request\nGET /api/users HTTP/1.1\nHost: example.com\nAuthorization: Bearer <token>\nAccept: application/json\n\n# A POST request with body\nPOST /api/users HTTP/1.1\nHost: example.com\nContent-Type: application/json\n\n{"name": "Alice", "email": "alice@example.com"}`,
          },
        ],
        table: {
          headers: ['Status Code', 'Meaning', 'Example'],
          rows: [
            ['200', 'OK — success', 'GET /users returned data'],
            ['201', 'Created — resource made', 'POST /users created a user'],
            ['400', 'Bad Request — invalid input', 'Missing required field'],
            ['401', 'Unauthorized — not logged in', 'No or invalid token'],
            ['404', 'Not Found — does not exist', 'GET /users/999'],
            ['500', 'Server Error — bug in code', 'Unhandled exception'],
          ],
        },
        keyTakeaway:
          'HTTP requests have methods (GET, POST, etc.), headers (metadata), and bodies (data). Status codes tell the client what happened.',
      },
      {
        title: 'Building a Raw HTTP Server',
        content:
          'Node.js has a built-in http module that lets you create a server in a few lines. This is the foundation that frameworks like Express build on.',
        diagram:
          'Node.js HTTP Server:\n\n  Incoming Request\n       │\n       ▼\n  ┌─────────────────────┐\n  │  http.createServer  │\n  │  (req, res) => {    │\n  │                     │\n  │  req.method  "GET"  │\n  │  req.url     "/api" │\n  │  req.headers {...}  │\n  │                     │\n  │  res.writeHead(200) │\n  │  res.end(json)      │\n  │  }                  │\n  └─────────────────────┘\n       │\n       ▼\n  Response sent to client',
        code: [
          {
            language: 'javascript',
            label: 'A minimal Node.js HTTP server',
            code: `const http = require("http");\n\nconst server = http.createServer((req, res) => {\n  // req = incoming request (method, url, headers)\n  // res = outgoing response (status, headers, body)\n\n  if (req.method === "GET" && req.url === "/api/hello") {\n    res.writeHead(200, { "Content-Type": "application/json" });\n    res.end(JSON.stringify({ message: "Hello, world!" }));\n  } else {\n    res.writeHead(404);\n    res.end("Not found");\n  }\n});\n\nserver.listen(3000, () => {\n  console.log("Server running on http://localhost:3000");\n});`,
          },
        ],
        keyTakeaway:
          'Node.js provides a low-level http module for creating servers. Every request is a callback with request and response objects.',
      },
      {
        title: 'What a Backend Actually Does',
        content:
          'A backend is more than just serving files. It handles business logic, data storage, authentication, and connects all the pieces together.',
        cards: [
          { title: 'Routing', description: 'Map URLs to handler functions', icon: '🗺️', color: 'blue' },
          { title: 'Validation', description: 'Ensure incoming data is correct', icon: '✅', color: 'emerald' },
          { title: 'Business Logic', description: 'Apply rules (pricing, permissions)', icon: '🧠', color: 'purple' },
          { title: 'Data Storage', description: 'Read/write to databases', icon: '💾', color: 'amber' },
          { title: 'Auth', description: 'Verify who the user is', icon: '🔐', color: 'red' },
          { title: 'Responses', description: 'Format and send data back', icon: '📤', color: 'cyan' },
        ],
        flow: [
          { label: 'Request In', description: 'HTTP arrives at server', icon: '📨' },
          { label: 'Route Match', description: 'Find the right handler', icon: '🗺️' },
          { label: 'Validate', description: 'Check input data', icon: '✅' },
          { label: 'Process', description: 'Business logic + DB', icon: '⚙️' },
          { label: 'Respond', description: 'Send JSON back', icon: '📤' },
        ],
        keyTakeaway:
          'A backend handles routing, validation, business logic, data storage, and authentication — not just serving files.',
      },
    ],
    commonMistakes: [
      { mistake: 'Thinking the frontend and backend must use the same language', explanation: 'They communicate via HTTP, which is language-agnostic. A React frontend can talk to a Python, Go, or Node.js backend.' },
      { mistake: 'Exposing database credentials in the response', explanation: 'The backend is a gatekeeper. It should never expose internal details like connection strings, stack traces, or table names to the client.' },
      { mistake: 'Not handling errors on the server', explanation: 'An unhandled exception crashes the server for all users. Always wrap handlers in try/catch and return proper error responses.' },
    ],
    practiceQuestions: [
      'Explain the client-server model in your own words. What role does HTTP play?',
      'Create a Node.js HTTP server that responds to GET /api/time with the current timestamp.',
      'What is the difference between a 400 and a 500 status code? Give an example of each.',
    ],
  },

  // ───────────────────────────────────────────────
  // 2. Node.js & Express
  // ───────────────────────────────────────────────
  'nodejs-and-express': {
    steps: [
      {
        title: 'Why Node.js?',
        content:
          'Node.js runs JavaScript outside the browser using the V8 engine. Its non-blocking, event-driven architecture makes it great for I/O-heavy tasks like APIs and real-time apps.',
        analogy:
          'Node.js is like a chef who takes orders non-stop without waiting. When a dish needs time in the oven, the chef moves to the next order and comes back when the timer beeps.',
        comparison: {
          leftTitle: 'Traditional (Blocking)',
          rightTitle: 'Node.js (Non-blocking)',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'One thread per request', right: 'Single thread, event loop' },
            { left: 'Waits for DB query to finish', right: 'Starts query, handles next request' },
            { left: 'Scales by adding more threads', right: 'Scales by handling more concurrent I/O' },
            { left: 'Good for CPU-heavy work', right: 'Great for I/O-heavy work (APIs, chat)' },
          ],
        },
        diagram:
          'Node.js Event Loop:\n\n  Incoming Requests\n  ──►──►──►──►──►\n       │\n       ▼\n  ┌─────────────────┐\n  │   Event Queue   │\n  │  [req1][req2].. │\n  └────────┬────────┘\n           │\n           ▼\n  ┌─────────────────┐     ┌───────────────┐\n  │   Event Loop    │────►│  Thread Pool  │\n  │  (single thread)│     │  (I/O: DB,    │\n  │                 │◄────│   file, net)  │\n  └────────┬────────┘     └───────────────┘\n           │\n           ▼\n  Responses sent back\n  ◄──◄──◄──◄──◄──',
        keyTakeaway:
          'Node.js uses a single-threaded event loop with non-blocking I/O, making it efficient for concurrent API requests and real-time applications.',
      },
      {
        title: 'Express.js Setup',
        content:
          'Express is a minimal web framework for Node.js. It adds routing, middleware, and request/response helpers on top of the raw http module.',
        code: [
          {
            language: 'bash',
            label: 'Project setup',
            code: `# Create a new project\nmkdir my-api && cd my-api\nnpm init -y\nnpm install express\nnpm install -D typescript @types/express @types/node tsx\nnpx tsc --init`,
          },
          {
            language: 'typescript',
            label: 'Basic Express server',
            code: `import express from "express";\n\nconst app = express();\n\n// Parse JSON request bodies\napp.use(express.json());\n\n// Define a route\napp.get("/api/hello", (req, res) => {\n  res.json({ message: "Hello from Express!" });\n});\n\n// Start the server\napp.listen(3001, () => {\n  console.log("Server running on http://localhost:3001");\n});`,
          },
        ],
        bullets: [
          '**express()** creates an app instance with routing and middleware.',
          '**express.json()** parses incoming JSON request bodies.',
          '**app.get/post/put/delete** define route handlers.',
          '**app.listen** starts the server on a port.',
        ],
        keyTakeaway:
          'Express simplifies Node.js server creation with clean routing and built-in middleware. A working API takes under 15 lines.',
      },
      {
        title: 'Routing',
        content:
          'Routes match HTTP methods and URL patterns to handler functions. Express supports route parameters, query strings, and route grouping with Router.',
        table: {
          headers: ['Pattern', 'Example URL', 'req.params'],
          rows: [
            ['/users', '/users', '{}'],
            ['/users/:id', '/users/123', '{ id: "123" }'],
            ['/users/:id/posts', '/users/123/posts', '{ id: "123" }'],
            ['/search?q=hello', '/search?q=hello', 'req.query.q = "hello"'],
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'Express routing patterns',
            code: `import { Router } from "express";\n\nconst router = Router();\n\n// GET /api/users — list all users\nrouter.get("/", (req, res) => {\n  res.json(users);\n});\n\n// GET /api/users/:id — get one user\nrouter.get("/:id", (req, res) => {\n  const user = users.find(u => u.id === req.params.id);\n  if (!user) return res.status(404).json({ error: "Not found" });\n  res.json(user);\n});\n\n// POST /api/users — create a user\nrouter.post("/", (req, res) => {\n  const { name, email } = req.body;\n  const user = { id: crypto.randomUUID(), name, email };\n  users.push(user);\n  res.status(201).json(user);\n});\n\n// Mount the router\napp.use("/api/users", router);`,
          },
        ],
        keyTakeaway:
          'Use Express Router to organize routes by resource. Route parameters (:id) capture dynamic URL segments.',
      },
      {
        title: 'Middleware — The Pipeline',
        content:
          'Middleware functions sit between the request and the response. Each can read/modify the request, send a response, or pass control to the next middleware.',
        analogy:
          'Middleware is like airport security checkpoints. Each checkpoint (middleware) inspects your luggage (request), and either lets you pass to the next one or stops you.',
        diagram:
          'Express Middleware Pipeline:\n\n  Request ──►┐\n             │\n  ┌──────────▼──────────┐\n  │   express.json()    │  Parse body\n  └──────────┬──────────┘\n             │\n  ┌──────────▼──────────┐\n  │   cors()            │  Set headers\n  └──────────┬──────────┘\n             │\n  ┌──────────▼──────────┐\n  │   logger()          │  Log request\n  └──────────┬──────────┘\n             │\n  ┌──────────▼──────────┐\n  │   requireAuth()     │  Check JWT\n  └──────────┬──────────┘\n             │\n  ┌──────────▼──────────┐\n  │   Route Handler     │  Process + respond\n  └─────────────────────┘',
        flow: [
          { label: 'Request', description: 'Incoming HTTP request', icon: '📨' },
          { label: 'Logger', description: 'Logs method, URL, time', icon: '📝' },
          { label: 'Auth', description: 'Verifies JWT token', icon: '🔐' },
          { label: 'Validation', description: 'Checks request body', icon: '✅' },
          { label: 'Handler', description: 'Processes and responds', icon: '⚙️' },
        ],
        cards: [
          { title: 'Application-level', description: 'app.use() — runs on every request', icon: '🌐', color: 'blue' },
          { title: 'Router-level', description: 'router.use() — runs on router routes', icon: '🗺️', color: 'purple' },
          { title: 'Error-handling', description: '4 params: (err, req, res, next)', icon: '❌', color: 'red' },
          { title: 'Third-party', description: 'cors, helmet, morgan, etc.', icon: '📦', color: 'emerald' },
        ],
        code: [
          {
            language: 'typescript',
            label: 'Custom middleware',
            code: `// Logging middleware\napp.use((req, res, next) => {\n  console.log(\`\\\${req.method} \\\${req.url}\`);\n  next(); // pass to next middleware\n});\n\n// Auth middleware\nfunction requireAuth(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "No token" });\n\n  try {\n    req.user = jwt.verify(token, SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: "Invalid token" });\n  }\n}\n\n// Use on specific routes\napp.get("/api/profile", requireAuth, (req, res) => {\n  res.json(req.user);\n});`,
          },
        ],
        keyTakeaway:
          'Middleware functions process requests in sequence. Call next() to pass control forward, or send a response to stop the chain.',
      },
      {
        title: 'Error Handling',
        content:
          'Express has a special error-handling middleware with four parameters. It catches errors thrown in route handlers and sends structured error responses.',
        flow: [
          { label: 'Error Thrown', description: 'In route or middleware', icon: '💥' },
          { label: 'next(err)', description: 'Passed to error handler', icon: '➡️' },
          { label: 'Error Middleware', description: '4-param handler catches it', icon: '🛡️' },
          { label: 'Response', description: 'Structured error JSON', icon: '📤' },
        ],
        code: [
          {
            language: 'typescript',
            label: 'Centralized error handling',
            code: `// Async handler wrapper — catches promise rejections\nconst asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\n// Route using asyncHandler\napp.get("/api/users/:id", asyncHandler(async (req, res) => {\n  const user = await db.findUser(req.params.id);\n  if (!user) {\n    const err = new Error("User not found");\n    err.status = 404;\n    throw err; // caught by error handler below\n  }\n  res.json(user);\n}));\n\n// Error handler — MUST have 4 params\napp.use((err, req, res, next) => {\n  const status = err.status || 500;\n  res.status(status).json({\n    error: err.message,\n    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),\n  });\n});`,
          },
        ],
        comparison: {
          leftTitle: 'Without asyncHandler',
          rightTitle: 'With asyncHandler',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Unhandled rejection crashes server', right: 'Errors caught and forwarded' },
            { left: 'Need try/catch in every route', right: 'Clean route code, no try/catch' },
            { left: 'Inconsistent error responses', right: 'Centralized error formatting' },
          ],
        },
        keyTakeaway:
          'Use asyncHandler to catch async errors and a centralized error middleware (4 parameters) to format all error responses consistently.',
      },
    ],
    commonMistakes: [
      { mistake: 'Forgetting express.json() middleware', explanation: 'Without it, req.body is undefined for JSON POST requests. Add app.use(express.json()) before your routes.' },
      { mistake: 'Not calling next() in middleware', explanation: 'If you do not call next() or send a response, the request hangs indefinitely until the client times out.' },
      { mistake: 'Putting the error handler before routes', explanation: 'Express error handlers must be defined AFTER all routes. If placed before, they never catch route errors.' },
      { mistake: 'Sending a response twice', explanation: 'Calling res.json() after res.send() throws "Cannot set headers after they are sent." Always return after sending.' },
    ],
    practiceQuestions: [
      'Explain the Express middleware pipeline. How does a request flow through multiple middleware functions?',
      'Build a REST API with Express that supports GET, POST, PUT, and DELETE for a "notes" resource.',
      'Create a logging middleware that logs the HTTP method, URL, and response time for every request.',
      'What is the difference between app.use() and app.get()? When would you use each?',
    ],
  },

  // ───────────────────────────────────────────────
  // 3. REST API Design
  // ───────────────────────────────────────────────
  'rest-api-design': {
    steps: [
      {
        title: 'What is REST?',
        content:
          'REST (Representational State Transfer) is an architectural style for designing APIs. It uses HTTP methods and URLs to model resources and operations.',
        analogy:
          'REST is like a library system. Each book (resource) has a unique call number (URL). You can check out (GET), donate (POST), replace (PUT), or remove (DELETE) books using standard procedures.',
        bullets: [
          '**Resources** are nouns — /users, /posts, /comments.',
          '**Methods** are verbs — GET (read), POST (create), PUT/PATCH (update), DELETE (remove).',
          '**Stateless** — each request contains all information needed. No session state on the server.',
          '**JSON** is the standard response format for modern APIs.',
        ],
        comparison: {
          leftTitle: 'REST',
          rightTitle: 'GraphQL',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Multiple endpoints per resource', right: 'Single endpoint for everything' },
            { left: 'Server decides response shape', right: 'Client specifies exactly what it needs' },
            { left: 'Simple, well-understood', right: 'Flexible but more complex' },
            { left: 'Over-fetching / under-fetching', right: 'Exact data, no waste' },
            { left: 'Cacheable with HTTP headers', right: 'Needs custom caching' },
          ],
        },
        keyTakeaway:
          'REST models your data as resources (nouns) accessed via HTTP methods (verbs). Each request is self-contained and stateless.',
      },
      {
        title: 'URL Design Best Practices',
        content:
          'Good URLs are predictable and consistent. They use plural nouns for collections and IDs for specific resources.',
        table: {
          headers: ['Method', 'URL', 'Action'],
          rows: [
            ['GET', '/api/users', 'List all users'],
            ['GET', '/api/users/123', 'Get user 123'],
            ['POST', '/api/users', 'Create a new user'],
            ['PATCH', '/api/users/123', 'Update user 123'],
            ['DELETE', '/api/users/123', 'Delete user 123'],
            ['GET', '/api/users/123/posts', 'List posts by user 123'],
          ],
        },
        comparison: {
          leftTitle: 'Bad URLs',
          rightTitle: 'Good URLs',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'GET /getUser?id=123', right: 'GET /api/users/123' },
            { left: 'POST /createPost', right: 'POST /api/posts' },
            { left: 'GET /api/user_list', right: 'GET /api/users' },
            { left: 'DELETE /removeUser/123', right: 'DELETE /api/users/123' },
          ],
        },
        keyTakeaway:
          'Use plural nouns (/users), nest related resources (/users/123/posts), and let HTTP methods convey the action.',
      },
      {
        title: 'Status Codes That Make Sense',
        content:
          'The right status code tells the client exactly what happened without reading the body. Group them by the first digit.',
        cards: [
          { title: '2xx Success', description: '200 OK, 201 Created, 204 No Content', icon: '✅', color: 'emerald' },
          { title: '3xx Redirect', description: '301 Moved, 304 Not Modified', icon: '↪️', color: 'blue' },
          { title: '4xx Client Error', description: '400 Bad Request, 401 Unauthorized, 404 Not Found', icon: '⚠️', color: 'amber' },
          { title: '5xx Server Error', description: '500 Internal Error, 503 Unavailable', icon: '❌', color: 'red' },
        ],
        table: {
          headers: ['Code', 'Name', 'When to Use'],
          rows: [
            ['200', 'OK', 'Successful GET, PUT, PATCH'],
            ['201', 'Created', 'Successful POST that creates a resource'],
            ['204', 'No Content', 'Successful DELETE'],
            ['400', 'Bad Request', 'Validation failed, malformed JSON'],
            ['401', 'Unauthorized', 'Missing or invalid auth token'],
            ['403', 'Forbidden', 'Authenticated but not allowed'],
            ['404', 'Not Found', 'Resource does not exist'],
            ['409', 'Conflict', 'Duplicate email, username taken'],
            ['500', 'Internal Error', 'Unhandled server bug'],
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'Using correct status codes',
            code: `// 201 Created — new resource\napp.post("/api/users", async (req, res) => {\n  const user = await createUser(req.body);\n  res.status(201).json(user);\n});\n\n// 204 No Content — successful delete\napp.delete("/api/users/:id", async (req, res) => {\n  await deleteUser(req.params.id);\n  res.status(204).end();\n});\n\n// 404 Not Found\napp.get("/api/users/:id", async (req, res) => {\n  const user = await findUser(req.params.id);\n  if (!user) return res.status(404).json({ error: "User not found" });\n  res.json(user);\n});`,
          },
        ],
        keyTakeaway:
          'Use specific status codes: 201 for created, 204 for deleted, 404 for not found. Never return 200 for everything.',
      },
      {
        title: 'Pagination, Filtering, and Sorting',
        content:
          'Real APIs return thousands of records. Pagination, filtering, and sorting let clients request exactly the data they need.',
        diagram:
          'Pagination Strategies:\n\n  Offset-Based:             Cursor-Based:\n  ?page=2&limit=10          ?cursor=abc123&limit=10\n\n  Page 1: items 1-10        First: items 1-10\n  Page 2: items 11-20       Next:  cursor=last_id\n  Page 3: items 21-30       Next:  cursor=last_id\n\n  ✓ Simple                  ✓ Consistent with inserts\n  ✗ Skips if rows added     ✓ Better for real-time data\n  ✗ Slow on large offsets   ✗ No "jump to page 5"',
        code: [
          {
            language: 'typescript',
            label: 'Query parameters for pagination',
            code: `// GET /api/posts?page=2&limit=10&sort=-createdAt&status=published\napp.get("/api/posts", async (req, res) => {\n  const page = parseInt(req.query.page as string) || 1;\n  const limit = parseInt(req.query.limit as string) || 20;\n  const offset = (page - 1) * limit;\n  const sort = req.query.sort as string || "-createdAt";\n  const status = req.query.status as string;\n\n  const { rows, total } = await getPosts({ offset, limit, sort, status });\n\n  res.json({\n    data: rows,\n    meta: {\n      page,\n      limit,\n      total,\n      totalPages: Math.ceil(total / limit),\n    },\n  });\n});`,
          },
        ],
        keyTakeaway:
          'Use query parameters for pagination (?page=2&limit=10), filtering (?status=active), and sorting (?sort=-createdAt).',
      },
      {
        title: 'Versioning and Documentation',
        content:
          'APIs evolve. Versioning prevents breaking existing clients when you make changes. Documentation ensures developers can use your API.',
        comparison: {
          leftTitle: 'URL Versioning',
          rightTitle: 'Header Versioning',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: '/api/v1/users', right: 'Accept: application/vnd.api.v1+json' },
            { left: 'Simple, visible in browser', right: 'Cleaner URLs' },
            { left: 'Easy to test with curl', right: 'Requires custom headers' },
            { left: 'Most common approach', right: 'Used by GitHub API' },
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'API versioning with URL prefix',
            code: `// Version in URL — most common approach\napp.use("/api/v1/users", usersV1Router);\napp.use("/api/v2/users", usersV2Router);\n\n// V1 returns basic user\n// V2 returns user with preferences`,
          },
        ],
        bullets: [
          '**Version from day one** — it is hard to add later.',
          '**Deprecation policy** — give clients 6+ months to migrate.',
          '**Document every endpoint** — include request/response examples.',
          '**Use OpenAPI/Swagger** for auto-generated, interactive docs.',
        ],
        keyTakeaway:
          'Version your API from day one using URL prefixes (/api/v1/). Document every endpoint with request/response examples.',
      },
    ],
    commonMistakes: [
      { mistake: 'Using verbs in URLs instead of nouns', explanation: 'REST URLs should be nouns (/users) not verbs (/getUsers). The HTTP method already conveys the action.' },
      { mistake: 'Returning 200 for everything', explanation: 'A 200 with { error: "not found" } is misleading. Use proper status codes so clients can handle responses correctly.' },
      { mistake: 'Not paginating list endpoints', explanation: 'Returning all records at once is slow and memory-intensive. Always paginate with limit/offset or cursor-based pagination.' },
      { mistake: 'Inconsistent response shapes', explanation: 'If one endpoint returns { data: [...] } and another returns a raw array, clients must handle each differently. Standardize your response envelope.' },
    ],
    practiceQuestions: [
      'Design the URL structure for a blog API with posts, comments, and tags.',
      'What status code should you return when: a resource is created, validation fails, the server crashes?',
      'Implement cursor-based pagination instead of offset-based. What are the advantages?',
      'When should you use PATCH vs PUT? Give a practical example.',
    ],
  },

  // ───────────────────────────────────────────────
  // 4. Database Integration
  // ───────────────────────────────────────────────
  'database-integration': {
    steps: [
      {
        title: 'Choosing a Database',
        content:
          'Your choice of database shapes your entire architecture. For most web apps, PostgreSQL is the safe default.',
        analogy:
          'Choosing a database is like choosing a vehicle. A sedan (PostgreSQL) handles most trips. A pickup truck (MongoDB) is great for hauling unstructured loads. A race car (Redis) is the fastest but carries almost nothing.',
        comparison: {
          leftTitle: 'SQL (Relational)',
          rightTitle: 'NoSQL (Document)',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Fixed schema (tables, columns)', right: 'Flexible schema (JSON documents)' },
            { left: 'ACID transactions', right: 'Eventual consistency (usually)' },
            { left: 'JOINs across tables', right: 'Embedded/denormalized data' },
            { left: 'PostgreSQL, MySQL, SQLite', right: 'MongoDB, DynamoDB, Firestore' },
            { left: 'Best for structured, relational data', right: 'Best for flexible, rapidly changing schemas' },
          ],
        },
        table: {
          headers: ['Database', 'Type', 'Best For'],
          rows: [
            ['PostgreSQL', 'Relational (SQL)', 'Most apps — structured data, joins, ACID'],
            ['MySQL', 'Relational (SQL)', 'WordPress, simple CRUD apps'],
            ['MongoDB', 'Document (NoSQL)', 'Flexible schemas, rapid prototyping'],
            ['Redis', 'Key-Value (in-memory)', 'Caching, sessions, real-time data'],
            ['SQLite', 'Embedded Relational', 'Mobile apps, small projects, testing'],
          ],
        },
        keyTakeaway:
          'PostgreSQL is the best default for web applications. Use Redis for caching, MongoDB for flexible documents, and SQLite for embedded use.',
      },
      {
        title: 'SQL Basics for Backend Devs',
        content:
          'SQL is how you talk to relational databases. Four operations cover 90% of backend work: SELECT, INSERT, UPDATE, DELETE.',
        cards: [
          { title: 'SELECT', description: 'Read data from tables', icon: '📖', color: 'blue' },
          { title: 'INSERT', description: 'Add new rows to a table', icon: '➕', color: 'emerald' },
          { title: 'UPDATE', description: 'Modify existing rows', icon: '✏️', color: 'amber' },
          { title: 'DELETE', description: 'Remove rows from a table', icon: '🗑️', color: 'red' },
        ],
        code: [
          {
            language: 'sql',
            label: 'Essential SQL operations',
            code: `-- Create a table\nCREATE TABLE users (\n  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name     VARCHAR(100) NOT NULL,\n  email    VARCHAR(255) UNIQUE NOT NULL,\n  created  TIMESTAMP DEFAULT NOW()\n);\n\n-- Insert a row\nINSERT INTO users (name, email)\nVALUES ('Alice', 'alice@example.com');\n\n-- Query with filter\nSELECT name, email FROM users WHERE created > '2026-01-01';\n\n-- Update a row\nUPDATE users SET name = 'Alice Smith' WHERE id = '...';\n\n-- Delete a row\nDELETE FROM users WHERE id = '...';`,
          },
        ],
        keyTakeaway:
          'Learn SELECT, INSERT, UPDATE, and DELETE — they handle the vast majority of database operations in any backend.',
      },
      {
        title: 'Connecting Express to PostgreSQL',
        content:
          'The pg library connects Node.js to PostgreSQL. Use a connection pool to reuse connections efficiently instead of creating a new one per request.',
        analogy:
          'A connection pool is like phone lines to a call center. Instead of installing a new phone line for each caller, you keep a fixed number of lines open and callers wait briefly for a free one.',
        diagram:
          'Connection Pool:\n\n  Express App\n  ┌──────────────────────────┐\n  │  Request 1 ──► conn #1  │\n  │  Request 2 ──► conn #2  ├──────► PostgreSQL\n  │  Request 3 ──► conn #3  │        Database\n  │  Request 4 ──  (waits)  │\n  │              ──► conn #1│  (conn #1 freed)\n  └──────────────────────────┘\n       Pool (max: 20 connections)',
        code: [
          {
            language: 'typescript',
            label: 'PostgreSQL connection pool',
            code: `import { Pool } from "pg";\n\nconst pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  max: 20, // maximum connections in the pool\n});\n\n// Query helper\nexport async function query(text: string, params?: unknown[]) {\n  const result = await pool.query(text, params);\n  return result.rows;\n}\n\n// Usage in a route\napp.get("/api/users", async (req, res) => {\n  const users = await query("SELECT * FROM users ORDER BY created DESC");\n  res.json(users);\n});\n\n// ALWAYS use parameterized queries to prevent SQL injection\napp.get("/api/users/:id", async (req, res) => {\n  const users = await query("SELECT * FROM users WHERE id = $1", [req.params.id]);\n  if (users.length === 0) return res.status(404).json({ error: "Not found" });\n  res.json(users[0]);\n});`,
          },
        ],
        keyTakeaway:
          'Use a connection pool for efficiency and ALWAYS use parameterized queries ($1, $2) to prevent SQL injection attacks.',
      },
      {
        title: 'JOINs — Connecting Related Data',
        content:
          'Real applications store data across multiple tables. JOINs let you combine related rows in a single query.',
        diagram:
          'JOIN Types:\n\n  Users           Posts\n  ┌─────┐        ┌─────┐\n  │  A  │────────│ P1  │\n  │  B  │────────│ P2  │\n  │  C  │        │ P3  │──── (author_id = A)\n  │  D  │        └─────┘\n  └─────┘\n\n  INNER JOIN: A+P1, A+P3, B+P2  (only matches)\n  LEFT JOIN:  A+P1, A+P3, B+P2, C+null, D+null\n  RIGHT JOIN: A+P1, A+P3, B+P2  (+ orphan posts)',
        code: [
          {
            language: 'sql',
            label: 'Common JOIN patterns',
            code: `-- Users and their posts (INNER JOIN — only users with posts)\nSELECT u.name, p.title, p.created\nFROM users u\nINNER JOIN posts p ON p.author_id = u.id;\n\n-- All users, even those without posts (LEFT JOIN)\nSELECT u.name, COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON p.author_id = u.id\nGROUP BY u.name;\n\n-- Posts with author name and comment count\nSELECT p.title, u.name AS author,\n       COUNT(c.id) AS comments\nFROM posts p\nJOIN users u ON u.id = p.author_id\nLEFT JOIN comments c ON c.post_id = p.id\nGROUP BY p.title, u.name;`,
          },
        ],
        comparison: {
          leftTitle: 'INNER JOIN',
          rightTitle: 'LEFT JOIN',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Only rows with matches in both tables', right: 'All rows from left + matches from right' },
            { left: 'Excludes users without posts', right: 'Includes users with 0 posts (NULL)' },
            { left: 'Smaller result set', right: 'Complete result set' },
            { left: 'Use for required relationships', right: 'Use for optional relationships' },
          ],
        },
        keyTakeaway:
          'INNER JOIN returns only matching rows. LEFT JOIN returns all rows from the left table plus matches from the right. Use JOINs to avoid multiple round trips.',
      },
      {
        title: 'ORMs vs Raw SQL',
        content:
          'ORMs (Object-Relational Mappers) let you interact with the database using JavaScript objects instead of SQL strings. They add convenience at the cost of control.',
        comparison: {
          leftTitle: 'Raw SQL (pg)',
          rightTitle: 'ORM (Prisma)',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Full control over queries', right: 'Auto-generated type-safe queries' },
            { left: 'Must write SQL by hand', right: 'Schema-driven code generation' },
            { left: 'Better for complex queries', right: 'Better for CRUD operations' },
            { left: 'No migration system built in', right: 'Built-in migration management' },
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'Prisma ORM example',
            code: `// schema.prisma defines your models\n// model User {\n//   id    String @id @default(uuid())\n//   name  String\n//   email String @unique\n//   posts Post[]\n// }\n\nimport { PrismaClient } from "@prisma/client";\nconst prisma = new PrismaClient();\n\n// Create a user — type-safe, auto-complete\nconst user = await prisma.user.create({\n  data: { name: "Alice", email: "alice@example.com" },\n});\n\n// Query with relations\nconst users = await prisma.user.findMany({\n  include: { posts: true }, // auto-joins!\n  where: { name: { contains: "Ali" } },\n});`,
          },
        ],
        bullets: [
          '**Start with an ORM** for rapid development and type safety.',
          '**Drop to raw SQL** for complex queries and performance-critical paths.',
          '**Learn both** — ORMs generate SQL, understanding SQL helps debug.',
          '**Migrations** — use ORM migrations or a tool like db-migrate for schema changes.',
        ],
        keyTakeaway:
          'Start with an ORM for rapid development. Drop to raw SQL for complex queries and performance-critical paths.',
      },
    ],
    commonMistakes: [
      { mistake: 'String-concatenating user input into SQL queries', explanation: 'This is a SQL injection vulnerability. Always use parameterized queries ($1, $2) or ORM methods to safely include user input.' },
      { mistake: 'Creating a new database connection per request', explanation: 'Connections are expensive to create. Use a connection pool that reuses a fixed number of connections.' },
      { mistake: 'The N+1 query problem', explanation: 'Fetching a list then querying each item individually causes N+1 queries. Use JOINs or ORM eager loading (include) instead.' },
      { mistake: 'Not adding indexes on frequently queried columns', explanation: 'Without indexes, the database scans every row. Add indexes on columns used in WHERE, JOIN, and ORDER BY clauses.' },
    ],
    practiceQuestions: [
      'What is SQL injection? Write an example of a vulnerable query and its safe, parameterized version.',
      'Explain the N+1 problem and show how to fix it with a JOIN.',
      'When would you choose raw SQL over an ORM? Give two scenarios.',
      'Design a database schema for a blog with users, posts, comments, and tags.',
    ],
  },

  // ───────────────────────────────────────────────
  // 5. Authentication
  // ───────────────────────────────────────────────
  'authentication': {
    steps: [
      {
        title: 'Hashing vs Encryption',
        content:
          'Hashing is one-way: you can turn a password into a hash but never turn the hash back. Encryption is two-way: you can encrypt and decrypt with a key.',
        analogy:
          'Hashing is like a meat grinder. You put a steak in and get ground beef out — you can never un-grind it. Encryption is like a safe — you lock something inside and unlock it with the key.',
        comparison: {
          leftTitle: 'Hashing',
          rightTitle: 'Encryption',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'One-way — cannot reverse', right: 'Two-way — can decrypt with key' },
            { left: 'Used for passwords', right: 'Used for sensitive data in transit' },
            { left: 'bcrypt, argon2, scrypt', right: 'AES, RSA, ChaCha20' },
            { left: 'Same input = same hash (with salt)', right: 'Output changes with different keys' },
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'Password hashing with bcrypt',
            code: `import bcrypt from "bcrypt";\n\n// Hash a password (on signup)\nconst password = "user-password-123";\nconst saltRounds = 12;\nconst hash = await bcrypt.hash(password, saltRounds);\n// Store 'hash' in the database — NEVER store the plain password\n\n// Verify a password (on login)\nconst isMatch = await bcrypt.compare("user-password-123", hash);\n// isMatch === true`,
          },
        ],
        diagram:
          'Password Hashing Flow:\n\n  Signup:\n  "password123" ──► bcrypt.hash() ──► "$2b$12$x8K..." ──► DB\n                    (+ salt + 12 rounds)\n\n  Login:\n  "password123" ──► bcrypt.compare() ──► true/false\n                         ▲\n  "$2b$12$x8K..." ───────┘ (from DB)',
        keyTakeaway:
          'Always hash passwords with bcrypt or argon2 before storing. Never store plain text passwords. Never encrypt passwords — hash them.',
      },
      {
        title: 'JWT — JSON Web Tokens',
        content:
          'A JWT is a signed token the server creates after successful login. The client sends it with every request to prove identity.',
        diagram:
          'JWT Structure:\n┌──────────────────────────────────────────┐\n│ Header     │ Payload     │ Signature    │\n│ {alg, typ} │ {userId,    │ HMAC(        │\n│            │  exp, iat}  │  header +    │\n│            │             │  payload,    │\n│            │             │  SECRET)     │\n└──────────────────────────────────────────┘\n    base64   .   base64    .   base64\n\n  eyJhbGci...  eyJ1c2Vy...  SflKxwRJ...',
        flow: [
          { label: 'Login', description: 'User sends credentials', icon: '🔑' },
          { label: 'Verify', description: 'Server checks password', icon: '✅' },
          { label: 'Sign JWT', description: 'Server creates token', icon: '🔏' },
          { label: 'Store', description: 'Client saves token', icon: '💾' },
          { label: 'Use', description: 'Token sent in headers', icon: '📤' },
        ],
        code: [
          {
            language: 'typescript',
            label: 'JWT authentication flow',
            code: `import jwt from "jsonwebtoken";\n\nconst SECRET = process.env.JWT_SECRET!;\n\n// Create token (on login)\nfunction createToken(userId: string) {\n  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });\n}\n\n// Verify token (middleware)\nfunction requireAuth(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "No token" });\n\n  try {\n    req.user = jwt.verify(token, SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: "Invalid or expired token" });\n  }\n}`,
          },
        ],
        keyTakeaway:
          'JWTs let the server verify identity without database lookups. The signature proves the token was not tampered with.',
      },
      {
        title: 'Session-Based vs Token-Based Auth',
        content:
          'Sessions store state on the server. Tokens store state on the client. Each has trade-offs for scalability, security, and simplicity.',
        comparison: {
          leftTitle: 'Sessions (Cookie)',
          rightTitle: 'Tokens (JWT)',
          leftColor: 'amber',
          rightColor: 'blue',
          items: [
            { left: 'State stored on server (Redis/DB)', right: 'State stored in the token itself' },
            { left: 'Cookie sent automatically', right: 'Token sent in Authorization header' },
            { left: 'Easy to revoke (delete session)', right: 'Hard to revoke (need blocklist)' },
            { left: 'Harder to scale (shared session store)', right: 'Stateless — scales easily' },
            { left: 'Better for server-rendered apps', right: 'Better for SPAs and APIs' },
          ],
        },
        diagram:
          'Session-Based:              Token-Based (JWT):\n\n  Client    Server              Client    Server\n    │         │                   │         │\n    ├─login──►│                   ├─login──►│\n    │         ├─create session    │         ├─create JWT\n    │◄─cookie─┤  (in Redis)      │◄─token──┤  (signed)\n    │         │                   │         │\n    ├─cookie──►│                  ├─Bearer──►│\n    │         ├─lookup session   │         ├─verify signature\n    │◄─data───┤  (from Redis)    │◄─data───┤  (no DB needed)\n    │         │                   │         │',
        keyTakeaway:
          'JWTs are stateless and great for APIs/SPAs. Sessions are easier to revoke and better for server-rendered apps. Many apps use both.',
      },
      {
        title: 'OAuth 2.0 — "Login with Google"',
        content:
          'OAuth lets users log in with an existing account (Google, GitHub) instead of creating a new password. The app never sees the user\'s password.',
        flow: [
          { label: 'User Clicks', description: '"Login with Google"', icon: '👆' },
          { label: 'Redirect', description: 'Sent to Google consent screen', icon: '↪️' },
          { label: 'User Approves', description: 'Grants permission', icon: '✅' },
          { label: 'Callback', description: 'Google sends auth code to your server', icon: '📨' },
          { label: 'Exchange', description: 'Server trades code for access token', icon: '🔄' },
          { label: 'Profile', description: 'Server fetches user info from Google', icon: '👤' },
        ],
        diagram:
          'OAuth 2.0 Authorization Code Flow:\n\n  User        Your App       Google\n   │             │              │\n   ├──click──►   │              │\n   │             ├──redirect───►│\n   │             │              │\n   │◄────────────────consent────┤\n   ├──approve───────────────────►│\n   │             │              │\n   │             │◄──auth code──┤\n   │             │              │\n   │             ├──code + ─────►│\n   │             │  secret       │\n   │             │◄──token──────┤\n   │             │              │\n   │             ├──GET profile─►│\n   │             │◄──user info──┤\n   │◄──logged in─┤              │',
        keyTakeaway:
          'OAuth 2.0 delegates authentication to a trusted provider. Your app gets a token to read user info but never sees the user\'s password.',
      },
      {
        title: 'Protecting Routes',
        content:
          'Authentication (who are you?) and authorization (what can you do?) are different. Middleware handles both by checking tokens and roles.',
        cards: [
          { title: 'Authentication (401)', description: 'Is the user logged in?', icon: '🔑', color: 'blue' },
          { title: 'Authorization (403)', description: 'Does the user have permission?', icon: '🛡️', color: 'purple' },
          { title: 'RBAC', description: 'Role-Based Access Control: admin, user, moderator', icon: '👥', color: 'emerald' },
          { title: 'ABAC', description: 'Attribute-Based: own resources, same group', icon: '📋', color: 'amber' },
        ],
        code: [
          {
            language: 'typescript',
            label: 'Role-based access control',
            code: `// Auth middleware — checks identity\nfunction requireAuth(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "Login required" });\n  try {\n    req.user = jwt.verify(token, SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: "Invalid token" });\n  }\n}\n\n// Authorization middleware — checks permission\nfunction requireRole(...roles: string[]) {\n  return (req, res, next) => {\n    if (!roles.includes(req.user.role)) {\n      return res.status(403).json({ error: "Forbidden" });\n    }\n    next();\n  };\n}\n\n// Usage: only admins can delete users\napp.delete("/api/users/:id",\n  requireAuth,\n  requireRole("admin"),\n  deleteUserHandler\n);`,
          },
        ],
        keyTakeaway:
          'Authentication verifies identity (401 if missing). Authorization verifies permissions (403 if insufficient). Layer both as middleware.',
      },
    ],
    commonMistakes: [
      { mistake: 'Storing passwords in plain text', explanation: 'If the database is breached, every password is exposed. Always hash with bcrypt (12+ rounds) or argon2.' },
      { mistake: 'Using a weak or short JWT secret', explanation: 'A short secret can be brute-forced. Use at least 256 bits of randomness. Store it in environment variables, never in code.' },
      { mistake: 'Not setting token expiration', explanation: 'Tokens without expiration last forever if stolen. Set a reasonable expiresIn (e.g., 7 days) and implement refresh tokens.' },
      { mistake: 'Confusing authentication with authorization', explanation: '401 means "who are you?" (not logged in). 403 means "you are logged in but not allowed." Use the right status codes.' },
    ],
    practiceQuestions: [
      'Explain the difference between hashing and encryption. Why should passwords be hashed, not encrypted?',
      'Walk through the JWT authentication flow from login to accessing a protected endpoint.',
      'Implement a signup endpoint that hashes the password and a login endpoint that returns a JWT.',
      'Describe the OAuth 2.0 authorization code flow. What does each step accomplish?',
    ],
  },

  // ───────────────────────────────────────────────
  // 6. Error Handling & Validation
  // ───────────────────────────────────────────────
  'error-handling-and-validation': {
    steps: [
      {
        title: 'Why Validate Input?',
        content:
          'Never trust data from the client. Users make mistakes, and attackers deliberately send malformed data.',
        analogy:
          'Validation is like a bouncer at a club. The bouncer checks IDs before anyone gets in. Without a bouncer, anyone — including troublemakers — walks right in.',
        comparison: {
          leftTitle: 'Without Validation',
          rightTitle: 'With Validation',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Database errors on bad data', right: 'Clear error messages before DB' },
            { left: 'SQL injection possible', right: 'Input sanitized and typed' },
            { left: 'Null pointer crashes', right: 'Missing fields caught early' },
            { left: 'Inconsistent data stored', right: 'Only valid data persisted' },
          ],
        },
        flow: [
          { label: 'Request In', description: 'Raw user data', icon: '📨' },
          { label: 'Validate', description: 'Check shape, types, ranges', icon: '🔍' },
          { label: 'Pass?', description: 'Valid → continue, Invalid → 400', icon: '✅' },
          { label: 'Process', description: 'Safe to use data now', icon: '⚙️' },
        ],
        keyTakeaway:
          'Validate all incoming data at the API boundary. Never rely on the frontend to validate — attackers bypass it.',
      },
      {
        title: 'Validation with Zod',
        content:
          'Zod is a TypeScript-first validation library. You define a schema, parse the input, and get either typed data or detailed errors.',
        cards: [
          { title: 'z.string()', description: 'Validates strings with .min(), .max(), .email()', icon: '📝', color: 'blue' },
          { title: 'z.number()', description: 'Numbers with .int(), .min(), .max()', icon: '🔢', color: 'purple' },
          { title: 'z.object()', description: 'Object shapes with nested validation', icon: '📦', color: 'emerald' },
          { title: 'z.array()', description: 'Arrays with element validation', icon: '📋', color: 'amber' },
          { title: 'z.enum()', description: 'One of a set of allowed values', icon: '🎯', color: 'cyan' },
          { title: 'z.optional()', description: 'Field is not required', icon: '❓', color: 'red' },
        ],
        code: [
          {
            language: 'typescript',
            label: 'Zod validation schemas',
            code: `import { z } from "zod";\n\n// Define a schema\nconst createUserSchema = z.object({\n  name: z.string().min(2).max(100),\n  email: z.string().email(),\n  age: z.number().int().min(13).max(120).optional(),\n  role: z.enum(["user", "admin"]).default("user"),\n});\n\n// Parse and validate\ntry {\n  const data = createUserSchema.parse(req.body);\n  // data is fully typed: { name: string; email: string; ... }\n  const user = await createUser(data);\n  res.status(201).json(user);\n} catch (err) {\n  if (err instanceof z.ZodError) {\n    res.status(400).json({\n      error: "Validation failed",\n      details: err.errors, // [{path, message}]\n    });\n  }\n}`,
          },
        ],
        keyTakeaway:
          'Zod validates and types input in one step. Define schemas for every endpoint and return structured error messages.',
      },
      {
        title: 'Validation Middleware',
        content:
          'Instead of validating in every route handler, create a reusable middleware that validates against a Zod schema.',
        diagram:
          'Validation Middleware Flow:\n\n  Request Body: { name: "", email: "bad" }\n       │\n       ▼\n  ┌──────────────────────┐\n  │  validate(schema)    │\n  │  schema.safeParse()  │\n  └──────────┬───────────┘\n             │\n      ┌──────┴──────┐\n      ▼             ▼\n   Valid         Invalid\n      │             │\n      ▼             ▼\n   next()      400 + errors\n      │        [{field, message}]\n      ▼\n  Route Handler',
        code: [
          {
            language: 'typescript',
            label: 'Reusable validate middleware',
            code: `import { z, ZodSchema } from "zod";\n\n// Generic validation middleware\nfunction validate(schema: ZodSchema) {\n  return (req, res, next) => {\n    const result = schema.safeParse(req.body);\n    if (!result.success) {\n      return res.status(400).json({\n        error: "Validation failed",\n        details: result.error.errors.map(e => ({\n          field: e.path.join("."),\n          message: e.message,\n        })),\n      });\n    }\n    req.body = result.data; // replace with parsed data\n    next();\n  };\n}\n\n// Usage — clean route handlers\napp.post("/api/users",\n  validate(createUserSchema),\n  async (req, res) => {\n    // req.body is guaranteed valid here\n    const user = await createUser(req.body);\n    res.status(201).json(user);\n  }\n);`,
          },
        ],
        keyTakeaway:
          'Extract validation into middleware so route handlers only deal with valid data. This keeps your code clean and consistent.',
      },
      {
        title: 'Structured Error Responses',
        content:
          'Consistent error responses make life easier for frontend developers. Always include a status code, error message, and optional details.',
        table: {
          headers: ['Status', 'Error Type', 'When'],
          rows: [
            ['400', 'Validation Error', 'Bad input data'],
            ['401', 'Unauthorized', 'Missing/invalid token'],
            ['403', 'Forbidden', 'No permission'],
            ['404', 'Not Found', 'Resource does not exist'],
            ['409', 'Conflict', 'Duplicate entry'],
            ['500', 'Internal Error', 'Unhandled bug'],
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'Custom AppError class',
            code: `class AppError extends Error {\n  constructor(\n    public statusCode: number,\n    message: string,\n    public details?: unknown\n  ) {\n    super(message);\n  }\n\n  static badRequest(msg: string, details?: unknown) {\n    return new AppError(400, msg, details);\n  }\n  static unauthorized(msg = "Unauthorized") {\n    return new AppError(401, msg);\n  }\n  static notFound(msg = "Not found") {\n    return new AppError(404, msg);\n  }\n}\n\n// Usage in routes\nconst user = await findUser(id);\nif (!user) throw AppError.notFound("User not found");\n\n// Global error handler catches it\napp.use((err, req, res, next) => {\n  if (err instanceof AppError) {\n    res.status(err.statusCode).json({\n      error: err.message,\n      details: err.details,\n    });\n  } else {\n    res.status(500).json({ error: "Internal server error" });\n  }\n});`,
          },
        ],
        keyTakeaway:
          'Use a custom AppError class with factory methods. A global error handler catches all errors and formats consistent responses.',
      },
      {
        title: 'Logging Errors',
        content:
          'Console.log is not enough for production. A structured logger like Pino outputs JSON logs that can be searched and alerted on.',
        comparison: {
          leftTitle: 'console.log',
          rightTitle: 'Pino (Structured)',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Unstructured text', right: 'JSON objects — searchable' },
            { left: 'No log levels', right: 'debug, info, warn, error, fatal' },
            { left: 'No context (request ID, user)', right: 'Attach any metadata' },
            { left: 'Hard to filter in production', right: 'Query with tools like Datadog, ELK' },
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'Structured logging with Pino',
            code: `import pino from "pino";\n\nconst logger = pino({\n  level: process.env.LOG_LEVEL || "info",\n  transport: process.env.NODE_ENV === "development"\n    ? { target: "pino-pretty" }\n    : undefined, // JSON in production\n});\n\n// Log in error handler\napp.use((err, req, res, next) => {\n  logger.error({\n    err,\n    method: req.method,\n    url: req.url,\n    userId: req.user?.id,\n  }, "Request failed");\n\n  res.status(err.statusCode || 500).json({\n    error: err.message || "Internal server error",\n  });\n});`,
          },
        ],
        keyTakeaway:
          'Use structured JSON logging in production for searchability. Include request context (method, URL, user ID) with every error log.',
      },
    ],
    commonMistakes: [
      { mistake: 'Validating only on the frontend', explanation: 'Frontend validation improves UX but can be bypassed with curl or browser dev tools. Always validate on the server.' },
      { mistake: 'Leaking stack traces to the client', explanation: 'Stack traces in error responses expose file paths, library versions, and internal logic. Only include them in development mode.' },
      { mistake: 'Using console.log for production logging', explanation: 'console.log outputs unstructured text that is hard to search. Use a structured logger like Pino that outputs JSON.' },
      { mistake: 'Catching errors without re-throwing or logging', explanation: 'Empty catch blocks hide bugs. Always log the error or throw a meaningful AppError.' },
    ],
    practiceQuestions: [
      'Create a Zod schema for a blog post with title (3-200 chars), content (non-empty), and an optional array of tag strings.',
      'Explain why server-side validation is necessary even when the frontend validates input.',
      'Build a validate middleware that can validate req.body, req.params, and req.query.',
      'What information should a production error log include? What should it never include?',
    ],
  },

  // ───────────────────────────────────────────────
  // 7. File Uploads & Storage
  // ───────────────────────────────────────────────
  'file-uploads-and-storage': {
    steps: [
      {
        title: 'How File Uploads Work',
        content:
          'Files are sent as multipart/form-data requests. Unlike JSON, multipart encoding supports binary data like images, PDFs, and videos alongside text fields.',
        analogy:
          'A multipart request is like a package with multiple compartments. One compartment holds a letter (text fields), another holds a photo (file data).',
        flow: [
          { label: 'User Selects File', description: 'File picker in browser', icon: '📂' },
          { label: 'FormData Created', description: 'Binary data + metadata', icon: '📦' },
          { label: 'Upload Request', description: 'multipart/form-data POST', icon: '📤' },
          { label: 'Server Receives', description: 'Multer parses the file', icon: '⚙️' },
          { label: 'File Stored', description: 'Disk, S3, or cloud storage', icon: '💾' },
        ],
        diagram:
          'Multipart Request:\n\n  ┌──────────────────────────────────┐\n  │  Content-Type: multipart/form-  │\n  │  data; boundary=----abc123      │\n  ├──────────────────────────────────┤\n  │  ------abc123                   │\n  │  Content-Disposition: form-data │\n  │  name="username"                │\n  │                                 │\n  │  alice                          │\n  ├──────────────────────────────────┤\n  │  ------abc123                   │\n  │  Content-Disposition: form-data │\n  │  name="avatar"; filename="a.jpg"│\n  │  Content-Type: image/jpeg       │\n  │                                 │\n  │  [binary image data...]         │\n  ├──────────────────────────────────┤\n  │  ------abc123--                 │\n  └──────────────────────────────────┘',
        keyTakeaway:
          'Files are uploaded as multipart/form-data, which supports binary data. Libraries like Multer handle the parsing on the server.',
      },
      {
        title: 'Multer — Handling Uploads in Express',
        content:
          'Multer is Express middleware that parses multipart form data and gives you access to the uploaded file as req.file.',
        bullets: [
          '**multer.diskStorage** saves to local disk with custom filenames.',
          '**multer.memoryStorage** keeps file in memory (for piping to S3).',
          '**limits** sets maximum file size to prevent abuse.',
          '**fileFilter** restricts allowed file types by extension.',
        ],
        code: [
          {
            language: 'typescript',
            label: 'File upload with Multer',
            code: `import multer from "multer";\nimport path from "path";\n\n// Configure storage\nconst storage = multer.diskStorage({\n  destination: "./uploads",\n  filename: (req, file, cb) => {\n    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);\n    cb(null, unique + path.extname(file.originalname));\n  },\n});\n\nconst upload = multer({\n  storage,\n  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max\n  fileFilter: (req, file, cb) => {\n    const allowed = [".jpg", ".jpeg", ".png", ".webp"];\n    const ext = path.extname(file.originalname).toLowerCase();\n    cb(null, allowed.includes(ext));\n  },\n});\n\n// Route — single file upload\napp.post("/api/avatar", requireAuth, upload.single("avatar"), (req, res) => {\n  if (!req.file) return res.status(400).json({ error: "No file" });\n  res.json({ url: \`/uploads/\\\${req.file.filename}\` });\n});`,
          },
        ],
        keyTakeaway:
          'Multer parses file uploads. Always set file size limits and filter by allowed extensions to prevent abuse.',
      },
      {
        title: 'Cloud Storage with S3',
        content:
          'For production, store files in cloud object storage like AWS S3 instead of local disk. It is scalable, durable, and serves files via CDN.',
        comparison: {
          leftTitle: 'Local Disk',
          rightTitle: 'Cloud Storage (S3)',
          leftColor: 'amber',
          rightColor: 'emerald',
          items: [
            { left: 'Lost if server dies', right: '99.999999999% durability' },
            { left: 'Limited by disk size', right: 'Virtually unlimited' },
            { left: 'Only accessible from that server', right: 'Accessible globally via URL' },
            { left: 'Free (comes with server)', right: 'Pay per GB stored + transferred' },
          ],
        },
        code: [
          {
            language: 'typescript',
            label: 'Upload to S3',
            code: `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";\n\nconst s3 = new S3Client({ region: "us-east-1" });\n\nasync function uploadToS3(file: Express.Multer.File) {\n  const key = \`avatars/\\\${Date.now()}-\\\${file.originalname}\`;\n\n  await s3.send(new PutObjectCommand({\n    Bucket: process.env.S3_BUCKET!,\n    Key: key,\n    Body: file.buffer,\n    ContentType: file.mimetype,\n  }));\n\n  return \`https://\\\${process.env.S3_BUCKET}.s3.amazonaws.com/\\\${key}\`;\n}`,
          },
        ],
        keyTakeaway:
          'Use cloud object storage (S3, GCS, R2) in production. Local disk is fine for development but not durable or scalable.',
      },
      {
        title: 'Presigned URLs',
        content:
          'Presigned URLs let the client upload directly to S3 without routing the file through your server. This reduces server load and speeds up uploads.',
        flow: [
          { label: 'Client Requests', description: 'Asks server for upload URL', icon: '📨' },
          { label: 'Server Signs', description: 'Creates presigned S3 URL', icon: '🔏' },
          { label: 'Client Uploads', description: 'PUT directly to S3', icon: '📤' },
          { label: 'Client Confirms', description: 'Sends file key to server', icon: '✅' },
        ],
        diagram:
          'Presigned URL Flow:\n\n  Client          Server           S3\n    │               │               │\n    ├─GET /upload──►│               │\n    │  url           │               │\n    │               ├─sign URL──────►│\n    │               │◄──presigned───┤\n    │◄──url─────────┤               │\n    │               │               │\n    ├─PUT file──────────────────────►│\n    │  (direct to S3)                │\n    │◄──200 OK──────────────────────┤\n    │               │               │\n    ├─POST /confirm─►│              │\n    │  { key }       ├─save to DB   │\n    │◄──201─────────┤               │',
        code: [
          {
            language: 'typescript',
            label: 'Generate presigned upload URL',
            code: `import { getSignedUrl } from "@aws-sdk/s3-request-presigner";\nimport { PutObjectCommand } from "@aws-sdk/client-s3";\n\napp.post("/api/upload-url", requireAuth, async (req, res) => {\n  const key = \`uploads/\\\${req.user.id}/\\\${Date.now()}.jpg\`;\n\n  const url = await getSignedUrl(s3, new PutObjectCommand({\n    Bucket: process.env.S3_BUCKET!,\n    Key: key,\n    ContentType: "image/jpeg",\n  }), { expiresIn: 300 }); // 5 minutes\n\n  res.json({ uploadUrl: url, key });\n});`,
          },
        ],
        keyTakeaway:
          'Presigned URLs let clients upload directly to cloud storage, bypassing your server. They expire after a set time for security.',
      },
    ],
    commonMistakes: [
      { mistake: 'Not limiting file size', explanation: 'Without limits, a user could upload a 10 GB file and crash your server. Always set fileSize limits in Multer.' },
      { mistake: 'Trusting the file extension', explanation: 'A user can rename malware.exe to photo.jpg. Validate the MIME type and consider running virus scans on uploads.' },
      { mistake: 'Storing uploaded files in the project directory', explanation: 'Deployments often wipe the project directory. Use a separate uploads folder or cloud storage.' },
      { mistake: 'Not generating unique filenames', explanation: 'Two users uploading "photo.jpg" would overwrite each other. Always prefix with a timestamp or UUID.' },
    ],
    practiceQuestions: [
      'Explain the difference between multipart/form-data and application/json. When is each used?',
      'Build an avatar upload endpoint with Multer that limits files to 2 MB and only accepts PNG/JPEG.',
      'What are the advantages of presigned URLs over routing file uploads through your server?',
    ],
  },

  // ───────────────────────────────────────────────
  // 8. Deployment
  // ───────────────────────────────────────────────
  'deployment': {
    steps: [
      {
        title: 'Docker — Containerize Your App',
        content:
          'Docker packages your app with its dependencies into a container that runs identically on any machine. No more "it works on my machine" problems.',
        analogy:
          'Docker is like a shipping container. No matter what is inside, every container has the same shape and fits on any truck, ship, or train.',
        diagram:
          'Docker Architecture:\n\n  Your Machine\n  ┌──────────────────────────────────┐\n  │  Docker Engine                   │\n  │  ┌──────────┐  ┌──────────┐     │\n  │  │Container │  │Container │     │\n  │  │  API     │  │   DB     │     │\n  │  │ Node.js  │  │ Postgres │     │\n  │  │ Express  │  │          │     │\n  │  └──────────┘  └──────────┘     │\n  │       ▲              ▲          │\n  │       └──── network ─┘          │\n  └──────────────────────────────────┘\n\n  Same containers run on:\n  - Your laptop (Mac/Win/Linux)\n  - CI/CD pipeline\n  - Production server',
        code: [
          {
            language: 'dockerfile',
            label: 'Multi-stage Dockerfile',
            code: `# Stage 1: Build\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY package.json ./\n\nEXPOSE 3001\nCMD ["node", "dist/index.js"]`,
          },
        ],
        keyTakeaway:
          'Docker containers ensure your app runs identically everywhere. Use multi-stage builds to keep images small.',
      },
      {
        title: 'Docker Compose — Multi-Service Setup',
        content:
          'Real apps need more than one container — your API, database, and Redis all run as separate services. Docker Compose orchestrates them.',
        flow: [
          { label: 'docker compose up', description: 'Start all services', icon: '▶️' },
          { label: 'Build Images', description: 'Create containers', icon: '🏗️' },
          { label: 'Create Network', description: 'Services can talk', icon: '🔗' },
          { label: 'Start Services', description: 'API, DB, Redis running', icon: '✅' },
        ],
        code: [
          {
            language: 'yaml',
            label: 'docker-compose.yml',
            code: `version: "3.8"\nservices:\n  api:\n    build: .\n    ports:\n      - "3001:3001"\n    environment:\n      - DATABASE_URL=postgresql://user:pass@db:5432/myapp\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      - db\n      - redis\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: myapp\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\n  redis:\n    image: redis:7-alpine\n\nvolumes:\n  pgdata:`,
          },
        ],
        keyTakeaway:
          'Docker Compose defines your entire stack (API + DB + Redis) in one file. Run everything with docker compose up.',
      },
      {
        title: 'Environment Variables & Secrets',
        content:
          'Configuration that changes between environments (dev, staging, prod) belongs in environment variables, not in code.',
        bullets: [
          '**.env file** — local development only, git-ignored.',
          '**Platform env vars** — set in Vercel, Railway, or AWS console for production.',
          '**Secrets manager** — AWS Secrets Manager or Vault for sensitive values like API keys.',
          '**Never commit secrets** — use .env.example with placeholder values.',
        ],
        comparison: {
          leftTitle: 'Hardcoded Config',
          rightTitle: 'Environment Variables',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Secrets visible in source code', right: 'Secrets in env vars, not in code' },
            { left: 'Different code per environment', right: 'Same code, different config' },
            { left: 'Must rebuild to change values', right: 'Change without rebuild' },
            { left: 'Accidentally committed to git', right: '.env is git-ignored' },
          ],
        },
        code: [
          {
            language: 'bash',
            label: '.env.example (committed to git)',
            code: `# Database\nDATABASE_URL=postgresql://user:password@localhost:5432/myapp\n\n# Auth\nJWT_SECRET=replace-with-256-bit-random-string\n\n# External services\nS3_BUCKET=my-bucket\nSMTP_HOST=smtp.example.com`,
          },
        ],
        keyTakeaway:
          'Store configuration in environment variables. Commit .env.example with placeholders, never .env with real secrets.',
      },
      {
        title: 'Process Management with PM2',
        content:
          'PM2 keeps your Node.js app running in production. It restarts on crashes, runs in cluster mode for multi-core CPUs, and provides monitoring.',
        cards: [
          { title: 'Auto-Restart', description: 'Restarts app on crash automatically', icon: '🔄', color: 'emerald' },
          { title: 'Cluster Mode', description: 'Use all CPU cores with -i max', icon: '🖥️', color: 'blue' },
          { title: 'Log Management', description: 'View, rotate, and persist logs', icon: '📋', color: 'purple' },
          { title: 'Monitoring', description: 'pm2 monit for real-time stats', icon: '📊', color: 'amber' },
        ],
        code: [
          {
            language: 'bash',
            label: 'PM2 commands',
            code: `# Install PM2 globally\nnpm install -g pm2\n\n# Start your app\npm2 start dist/index.js --name my-api\n\n# Cluster mode — use all CPU cores\npm2 start dist/index.js -i max --name my-api\n\n# Monitor\npm2 monit\n\n# View logs\npm2 logs my-api\n\n# Restart / Stop\npm2 restart my-api\npm2 stop my-api\n\n# Persist across server reboot\npm2 save\npm2 startup`,
          },
        ],
        keyTakeaway:
          'PM2 keeps your app alive in production with auto-restart, cluster mode, and log management.',
      },
      {
        title: 'Deployment Platforms',
        content:
          'You have many options for deploying backend apps — from managed platforms to bare VPS.',
        table: {
          headers: ['Platform', 'Type', 'Best For', 'Cost'],
          rows: [
            ['Railway', 'PaaS', 'Quick deploys, databases included', 'Free tier + pay per use'],
            ['Render', 'PaaS', 'Similar to Heroku, good free tier', 'Free tier + $7/mo'],
            ['AWS EC2', 'IaaS', 'Full control, production scale', 'Pay per hour'],
            ['DigitalOcean', 'VPS', 'Simple cloud servers', '$4-12/mo'],
            ['Fly.io', 'PaaS', 'Edge deployment, low latency', 'Free tier + usage'],
          ],
        },
        flow: [
          { label: 'Push Code', description: 'Git push to main', icon: '📤' },
          { label: 'CI Runs', description: 'Tests and linting', icon: '🧪' },
          { label: 'Build', description: 'Docker image created', icon: '🏗️' },
          { label: 'Deploy', description: 'New container replaces old', icon: '🚀' },
          { label: 'Health Check', description: 'Verify app is responding', icon: '💚' },
        ],
        diagram:
          'Deployment Pipeline:\n\n  Developer   GitHub     CI/CD       Production\n     │          │          │             │\n     ├─push────►│          │             │\n     │          ├─trigger──►│            │\n     │          │          ├─lint        │\n     │          │          ├─test        │\n     │          │          ├─build       │\n     │          │          │             │\n     │          │          ├─deploy─────►│\n     │          │          │             ├─health check\n     │          │          │◄──green─────┤\n     │◄─────────────notify─┤             │\n     │          │          │             │',
        keyTakeaway:
          'Use managed platforms (Railway, Render) for simplicity or VPS (EC2, DigitalOcean) for control. Always deploy behind a CI/CD pipeline.',
      },
    ],
    commonMistakes: [
      { mistake: 'Running Node.js directly in production without a process manager', explanation: 'If your app crashes, nobody restarts it. Use PM2, Docker with restart policies, or a managed platform.' },
      { mistake: 'Hardcoding configuration values', explanation: 'Values like database URLs and API keys change per environment. Use environment variables so the same code works everywhere.' },
      { mistake: 'Not using a .dockerignore file', explanation: 'Without it, Docker copies node_modules, .git, and .env into the image, making it large and insecure.' },
      { mistake: 'Deploying without health checks', explanation: 'Without a /health endpoint, your platform cannot verify the app is actually running. Always implement one.' },
    ],
    practiceQuestions: [
      'Write a Dockerfile for a Node.js Express API using multi-stage builds.',
      'What is the purpose of Docker Compose? How does it differ from a single Dockerfile?',
      'Explain the difference between PaaS (Railway) and IaaS (EC2). When would you use each?',
      'Set up a docker-compose.yml that runs your API, PostgreSQL, and Redis together.',
      'What should a /health endpoint check and return?',
    ],
  },
};
