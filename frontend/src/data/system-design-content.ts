import type { LessonStep } from '@/lib/learn-data';

export const systemDesignLessons: Record<string, {
  steps: LessonStep[];
  commonMistakes?: { mistake: string; explanation: string }[];
  practiceQuestions?: string[];
}> = {

  // ─────────────────────────────────────────────
  // 1. WHAT IS SYSTEM DESIGN
  // ─────────────────────────────────────────────
  'what-is-system-design': {
    steps: [
      {
        title: 'Building a City from Scratch',
        content:
          'Imagine you are the mayor of a brand-new city. You need roads, hospitals, power plants, water supply, schools, and fire stations. You can\'t just build them randomly — you need a *plan*. System design is that plan, but for software.\n\nWhen companies like Google or Netflix build products used by millions, they can\'t just write a single script. They need to decide: Where does the data live? How do users connect? What happens when a server crashes? How do we handle Black Friday traffic?\n\nSystem design is the art of answering these questions *before* writing a single line of code.',
        analogy:
          'A city planner doesn\'t start building houses before deciding where the roads go. Similarly, a system designer doesn\'t start coding before deciding how data flows, where it\'s stored, and how the pieces communicate.',
        keyTakeaway:
          'System design is about making big-picture architectural decisions that determine whether your software survives real-world scale and failures.',
      },
      {
        title: 'Why System Design Matters in Interviews',
        content:
          'At most tech companies, senior-level interviews include a system design round. Why? Because coding skill alone doesn\'t tell them whether you can architect a product that serves millions of users.\n\nInterviewers want to see:\n- **Can you think at scale?** — A solution that works for 100 users might collapse at 10 million.\n- **Can you make trade-offs?** — There\'s never one "correct" answer. Every choice (SQL vs NoSQL, caching vs fresh data) has pros and cons.\n- **Can you communicate?** — You\'ll be drawing diagrams, explaining your reasoning, and responding to "what if" questions.\n- **Do you know the building blocks?** — Load balancers, caches, queues, databases — you need to know what tools exist and when to use them.',
        analogy:
          'It\'s like a cooking show: the judges don\'t just taste the final dish. They watch how you plan, how you handle surprises (the oven broke!), and whether you can explain why you chose those ingredients.',
        keyTakeaway:
          'System design interviews test your ability to think big, communicate clearly, and make informed trade-offs — not memorize one "right" answer.',
      },
      {
        title: 'The 4-Step Framework',
        content:
          'Every system design interview follows a predictable structure. Master this framework and you\'ll never freeze up:\n\n**Step 1: Requirements Gathering (5 min)**\nAsk clarifying questions. "Should the URL shortener support custom aliases?" "How many daily active users?" Don\'t assume — ask.\n\n**Step 2: Back-of-the-Envelope Estimation (5 min)**\nEstimate scale: QPS (queries per second), storage needs, bandwidth. This shows you can think quantitatively.\n\n**Step 3: High-Level Design (15 min)**\nDraw the big boxes: clients, load balancers, servers, databases, caches. Show how data flows from user action to response.\n\n**Step 4: Deep Dive (15 min)**\nThe interviewer picks 1-2 components to zoom into. Be ready to discuss database schema, caching strategy, or failure handling in detail.',
        analogy:
          'Think of it like building a house. Step 1: What does the client want? (3 bedrooms, big kitchen.) Step 2: Budget and timeline. Step 3: Floor plan. Step 4: Electrical wiring and plumbing details.',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'Requirements',
            'Estimation',
            'High-Level Design',
            'Deep Dive',
          ],
          flow: 'linear',
        },
        keyTakeaway:
          'Follow the framework: Requirements -> Estimation -> High-Level Design -> Deep Dive. This structure keeps you organized and impresses interviewers.',
      },
      {
        title: 'Key Vocabulary You\'ll Need',
        content:
          'Before we dive into individual topics, let\'s build your vocabulary:\n\n- **Scalability** — Can the system handle growth? (More users, more data, more traffic)\n- **Availability** — Is the system up when users need it? Measured in "nines": 99.9% = 8.7 hours downtime/year.\n- **Latency** — How fast does the user get a response? Measured in milliseconds.\n- **Throughput** — How many requests can the system handle per second?\n- **Consistency** — Does every user see the same data at the same time?\n- **Partition Tolerance** — Can the system survive network failures between servers?\n- **Redundancy** — Having backup copies so one failure doesn\'t kill everything.\n- **Fault Tolerance** — The system keeps working even when parts fail.\n\nThese terms will come up in every single lesson ahead.',
        analogy:
          'Scalability is like a restaurant that can add tables during rush hour. Availability is keeping the doors open 24/7. Latency is how fast your food arrives. Throughput is how many customers you can serve per hour.',
        visual: 'table',
        visualData: {
          headers: ['Term', 'Question It Answers'],
          rows: [
            ['Scalability', 'Can we handle 10x more users?'],
            ['Availability', 'Is the system always reachable?'],
            ['Latency', 'How fast is each request?'],
            ['Throughput', 'How many requests per second?'],
            ['Consistency', 'Does everyone see the same data?'],
          ],
        },
        keyTakeaway:
          'Master these terms — scalability, availability, latency, throughput, consistency — they are the language of system design.',
      },
      {
        title: 'Back-of-the-Envelope Math',
        content:
          'One skill that separates good candidates from great ones: quick estimation. Here are numbers every engineer should know:\n\n**Traffic:**\n- 1 million daily users with 10 requests each = 10M requests/day\n- 10M / 86,400 seconds = ~116 QPS (queries per second)\n- Peak is usually 2-3x average, so ~300 QPS\n\n**Storage:**\n- 1 tweet = ~300 bytes of text\n- 500M tweets/day x 300 bytes = 150 GB/day = ~55 TB/year\n- Images: 1 photo = ~200KB. 10M uploads/day = 2 TB/day\n\n**Handy Numbers:**\n- 1 day = 86,400 seconds (round to 100K for estimates)\n- 1 month ~ 2.5 million seconds\n- 1 year ~ 30 million seconds\n- 1 server can handle ~10K-50K concurrent connections',
        analogy:
          'It\'s like estimating how much food to buy for a party. You don\'t need exact numbers — you need to know if you need 10 pizzas or 1,000. Getting the order of magnitude right is what matters.',
        code: [
          {
            language: 'plaintext',
            label: 'Quick Estimation Template',
            code: `DAU (Daily Active Users):     1 million
Requests per user per day:    10
Total daily requests:         10,000,000
QPS (average):                10M / 86400 ≈ 116
QPS (peak, 3x):               ~350

Storage per record:           500 bytes
New records per day:          1,000,000
Daily storage:                500 MB
Yearly storage:               ~180 GB

Read:Write ratio:             10:1
Read QPS:                     ~320
Write QPS:                    ~32`,
          },
        ],
        keyTakeaway:
          'Practice back-of-the-envelope math. Know the key numbers (86,400 sec/day, typical QPS ranges) and always estimate before designing.',
      },
      {
        title: 'Your System Design Roadmap',
        content:
          'Here\'s the journey ahead. We\'ll start with building blocks and end with full system designs:\n\n**Foundation (Lessons 2-5):**\nClient-server, load balancing, caching, CDNs — the basic components every system uses.\n\n**Intermediate Tools (Lessons 6-9):**\nMessage queues, database scaling, API design, rate limiting — the tools that make systems robust.\n\n**Advanced Concepts (Lessons 10-11):**\nConsistent hashing, microservices vs monolith — the patterns that come up in complex systems.\n\n**Full Designs (Lessons 12-17):**\nURL shortener, chat app, Instagram, Twitter, Uber, Netflix — complete system design walkthroughs that combine everything.\n\nBy the end, you\'ll be able to walk into any system design interview and confidently sketch out a solution on the whiteboard.',
        analogy:
          'It\'s like learning to cook. First you learn individual techniques (chopping, sauteing, baking). Then you combine them into full recipes. By the end, you can improvise your own dishes.',
        keyTakeaway:
          'System design is learned in layers: individual building blocks first, then combine them into complete architectures.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Jumping straight into the solution without asking questions',
        explanation:
          'Always spend the first 5 minutes clarifying requirements. The interviewer might have specific constraints that change your entire approach.',
      },
      {
        mistake: 'Trying to build a perfect system from day one',
        explanation:
          'Start simple, then iterate. Show you can build an MVP and scale it. No one builds Netflix on day one.',
      },
      {
        mistake: 'Ignoring back-of-the-envelope estimation',
        explanation:
          'Numbers drive decisions. Whether you need 1 server or 100 changes everything about your design.',
      },
      {
        mistake: 'Memorizing solutions instead of understanding trade-offs',
        explanation:
          'Interviewers can tell when you\'re reciting. Understand WHY each choice is made so you can adapt when they throw curveballs.',
      },
    ],
    practiceQuestions: [
      'If a system has 50 million daily users and each makes 20 requests per day, what is the average QPS? What about peak?',
      'Name three trade-offs you might discuss in a system design interview.',
      'What is the difference between availability and fault tolerance?',
      'Walk through the 4-step framework as if you were asked to "Design a parking garage management system."',
      'If you store 1 KB per user and have 100 million users, how much storage do you need?',
    ],
  },

  // ─────────────────────────────────────────────
  // 2. CLIENT-SERVER ARCHITECTURE
  // ─────────────────────────────────────────────
  'client-server-architecture': {
    steps: [
      {
        title: 'The Restaurant Model of the Internet',
        content:
          'Every time you open a website, you\'re participating in a conversation between two parties:\n\n- **The Client** (you, the customer) — Your browser, your phone app, or any device that makes a request.\n- **The Server** (the waiter + kitchen) — A computer somewhere in the world that receives your request, processes it, and sends back a response.\n- **The Database** (the pantry) — Where all the ingredients (data) are stored.\n\nWhen you type "google.com" in your browser:\n1. Your browser (client) sends a request: "Hey, give me the Google homepage."\n2. Google\'s server receives it, fetches the HTML/CSS/JS, and sends it back.\n3. Your browser renders it on screen.\n\nThis request-response cycle is the foundation of *everything* on the internet.',
        analogy:
          'You (client) sit at a restaurant, look at the menu, and tell the waiter (server) what you want. The waiter goes to the kitchen (server logic), the chef checks the pantry (database) for ingredients, cooks the meal, and the waiter brings it back to you.',
        keyTakeaway:
          'The client-server model is a request-response pattern: the client asks, the server answers. Every web application works this way.',
      },
      {
        title: 'HTTP — The Language They Speak',
        content:
          'Clients and servers need a common language. That language is **HTTP** (HyperText Transfer Protocol).\n\nAn HTTP request has:\n- **Method** — What action? GET (read), POST (create), PUT (update), DELETE (remove)\n- **URL** — Where? `https://api.example.com/users/123`\n- **Headers** — Metadata like authentication tokens, content type\n- **Body** — Data you\'re sending (for POST/PUT)\n\nAn HTTP response has:\n- **Status Code** — How\'d it go? 200 (OK), 404 (not found), 500 (server error)\n- **Headers** — Metadata about the response\n- **Body** — The actual data (HTML, JSON, image, etc.)\n\nHTTPS is the same thing but encrypted — the waiter speaks in a secret code so eavesdroppers can\'t understand.',
        analogy:
          'HTTP is like a standardized order form. The method is "I want to order / cancel / modify." The URL is the table number. The body is what dish you want. The status code is the waiter coming back saying "Here you go!" (200) or "Sorry, we\'re out of that" (404).',
        visual: 'table',
        visualData: {
          headers: ['HTTP Method', 'Action', 'Example'],
          rows: [
            ['GET', 'Read data', 'GET /api/users/123'],
            ['POST', 'Create new', 'POST /api/users'],
            ['PUT', 'Update existing', 'PUT /api/users/123'],
            ['DELETE', 'Remove', 'DELETE /api/users/123'],
          ],
        },
        keyTakeaway:
          'HTTP is the protocol for client-server communication. Learn the methods (GET, POST, PUT, DELETE) and status codes (200, 400, 404, 500).',
      },
      {
        title: 'DNS — The Phone Book of the Internet',
        content:
          'When you type "google.com", your computer doesn\'t know where Google\'s server is. It needs an IP address (like 142.250.80.46). **DNS** (Domain Name System) translates human-friendly names into IP addresses.\n\nThe flow:\n1. You type "google.com" in your browser.\n2. Your computer asks a DNS resolver: "What\'s the IP for google.com?"\n3. The resolver checks its cache. If not found, it asks root servers -> TLD servers (.com) -> authoritative servers (Google\'s).\n4. It gets back "142.250.80.46" and your browser connects to that IP.\n\nThis happens in milliseconds, and results are cached so you don\'t look it up every time.',
        analogy:
          'DNS is the phone book of the internet. You know your friend\'s name (google.com) but need their phone number (142.250.80.46) to call them. The DNS resolver looks it up for you.',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'Browser types google.com',
            'DNS Resolver checks cache',
            'Root Server → .com TLD Server',
            'Authoritative Server returns IP',
            'Browser connects to 142.250.80.46',
          ],
          flow: 'linear',
        },
        keyTakeaway:
          'DNS translates domain names to IP addresses. It\'s the first step in every web request and results are cached for speed.',
      },
      {
        title: 'Making an API Call — Putting It Together',
        content:
          'Let\'s see a real client-server interaction. Say you\'re building a to-do app and want to fetch a user\'s tasks.\n\nThe client (your React app) sends a GET request to the server. The server queries the database, formats the data as JSON, and sends it back. The client renders it.',
        code: [
          {
            language: 'javascript',
            label: 'Client — Fetching data with fetch()',
            code: `// Client-side (React component)
async function fetchTasks() {
  const response = await fetch('https://api.myapp.com/tasks', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGci...',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }

  const tasks = await response.json();
  // tasks = [{ id: 1, title: "Buy milk", done: false }, ...]
  return tasks;
}`,
          },
          {
            language: 'javascript',
            label: 'Server — Handling the request (Express.js)',
            code: `// Server-side (Express route)
app.get('/tasks', authenticate, async (req, res) => {
  // 1. Extract user from JWT token
  const userId = req.user.id;

  // 2. Query the database
  const tasks = await db.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  // 3. Send JSON response
  res.status(200).json(tasks.rows);
});`,
          },
        ],
        keyTakeaway:
          'A typical API call: client sends HTTP request with method + URL + headers, server processes it, queries the database, and returns a JSON response.',
      },
      {
        title: 'What Happens When You Type a URL?',
        content:
          'This is a classic interview question. Here is the full journey:\n\n1. **DNS Lookup** — Browser resolves the domain to an IP address.\n2. **TCP Connection** — Browser establishes a connection (three-way handshake: SYN, SYN-ACK, ACK).\n3. **TLS Handshake** — If HTTPS, client and server negotiate encryption keys.\n4. **HTTP Request** — Browser sends GET request for the page.\n5. **Server Processing** — Server receives request, runs application logic, queries DB if needed.\n6. **HTTP Response** — Server sends back HTML, CSS, JS, images.\n7. **Browser Rendering** — Browser parses HTML, builds DOM, applies CSS, executes JS.\n8. **Page Display** — You see the website!\n\nAll of this happens in under a second for most websites. Caching at every layer (DNS, browser, CDN, server) makes repeat visits even faster.',
        analogy:
          'It\'s like calling a pizza place. You look up the number (DNS), dial and they pick up (TCP), you verify it\'s really them (TLS), you place your order (HTTP request), they make it (server processing), deliver it (response), and you eat it (rendering).',
        keyTakeaway:
          'A URL request involves DNS lookup, TCP connection, optional TLS, HTTP request/response, and browser rendering — all in under a second.',
      },
      {
        title: 'Beyond Request-Response: Other Patterns',
        content:
          'The basic request-response model works for most things, but some use cases need different patterns:\n\n**Polling** — Client asks "Any updates?" every few seconds. Simple but wasteful.\n\n**Long Polling** — Client asks, server holds the connection open until there IS an update, then responds. Better than polling.\n\n**WebSockets** — A persistent two-way connection. Either side can send messages anytime. Perfect for chat apps, live games, stock tickers.\n\n**Server-Sent Events (SSE)** — Server pushes updates to the client over a one-way connection. Great for live feeds and notifications.\n\nWe\'ll use WebSockets when we design a chat app later and SSE for real-time feeds.',
        analogy:
          'Polling is texting someone "Are we there yet?" every 5 minutes. Long polling is asking and they reply only when you arrive. WebSockets is an open phone call where either person can speak anytime. SSE is a radio broadcast — the station talks, you listen.',
        visual: 'comparison',
        visualData: {
          items: [
            { label: 'Polling', pros: 'Simple', cons: 'Wasteful, delayed' },
            { label: 'Long Polling', pros: 'Less wasteful', cons: 'Still one-way' },
            { label: 'WebSocket', pros: 'Real-time, bidirectional', cons: 'More complex' },
            { label: 'SSE', pros: 'Simple push', cons: 'One-way only' },
          ],
        },
        keyTakeaway:
          'Beyond basic HTTP, know about WebSockets (bidirectional real-time), long polling (held connections), and SSE (server push). Choose based on your use case.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Confusing HTTP methods (using GET to delete data)',
        explanation:
          'GET should never modify data. Use POST for creation, PUT/PATCH for updates, DELETE for removal. This isn\'t just convention — caches and proxies treat GET as safe.',
      },
      {
        mistake: 'Not understanding that HTTP is stateless',
        explanation:
          'Each HTTP request is independent — the server doesn\'t remember previous requests. That\'s why we need cookies, tokens, or sessions to maintain state.',
      },
      {
        mistake: 'Thinking the client and server must be on different machines',
        explanation:
          'During development, both often run on your laptop. "Client" and "server" are roles, not physical locations.',
      },
      {
        mistake: 'Using WebSockets for everything',
        explanation:
          'WebSockets add complexity. If your data doesn\'t need real-time updates (like a blog), plain HTTP is simpler and sufficient.',
      },
    ],
    practiceQuestions: [
      'Trace the full journey of what happens when you type "amazon.com" into your browser.',
      'What HTTP status code would you return if a user tries to access a resource they don\'t have permission for?',
      'When would you choose WebSockets over regular HTTP polling?',
      'Explain the three-way handshake in TCP. Why is it necessary?',
      'What\'s the difference between PUT and PATCH?',
    ],
  },

  // ─────────────────────────────────────────────
  // 3. LOAD BALANCING
  // ─────────────────────────────────────────────
  'load-balancing': {
    steps: [
      {
        title: 'The Traffic Cop at the Intersection',
        content:
          'Imagine a popular restaurant that gets 1,000 customers per hour but only has one kitchen. Chaos, right? The solution: open multiple kitchens and hire a host at the front door who directs each customer to the kitchen with the shortest line.\n\nThat host is a **load balancer**. In system design, when your single server can\'t handle all the traffic, you add more servers. The load balancer sits in front of them and distributes incoming requests so no single server gets overwhelmed.\n\n**Why load balancing matters:**\n- **Performance** — Distribute work evenly so every request gets a fast response.\n- **Availability** — If one server dies, the load balancer stops sending traffic to it.\n- **Scalability** — Need more capacity? Just add more servers behind the load balancer.',
        analogy:
          'A traffic cop at a busy intersection. Without them, all cars try to go through one road and cause a traffic jam. The cop directs cars down different routes to keep everything flowing smoothly.',
        keyTakeaway:
          'A load balancer distributes incoming traffic across multiple servers to improve performance, availability, and scalability.',
      },
      {
        title: 'Load Balancing Algorithms',
        content:
          'The load balancer needs a strategy to decide which server gets each request. Here are the main algorithms:\n\n**Round Robin**\nThe simplest: send requests to servers in order. Server 1, Server 2, Server 3, Server 1, Server 2... Like dealing cards.\n\n**Weighted Round Robin**\nSame as round robin, but beefy servers get more requests. If Server 1 is twice as powerful, it gets twice as many requests.\n\n**Least Connections**\nSend each request to the server with the fewest active connections. Great when requests take varying amounts of time.\n\n**IP Hash**\nHash the client\'s IP address to determine which server handles the request. The same user always goes to the same server (useful for session stickiness).\n\n**Random**\nPick a server randomly. Surprisingly effective at scale due to the law of large numbers.',
        analogy:
          'Round Robin: a teacher calling on students in order around the room. Least Connections: a teacher calling on whoever has answered the fewest questions today. IP Hash: each student always goes to the same tutor.',
        visual: 'table',
        visualData: {
          headers: ['Algorithm', 'How It Works', 'Best For'],
          rows: [
            ['Round Robin', 'Rotate through servers', 'Equal-capacity servers'],
            ['Weighted RR', 'More traffic to stronger servers', 'Mixed server sizes'],
            ['Least Connections', 'Choose least-busy server', 'Varying request durations'],
            ['IP Hash', 'Same client → same server', 'Session stickiness'],
            ['Random', 'Pick randomly', 'Simple, stateless setups'],
          ],
        },
        keyTakeaway:
          'The main algorithms are Round Robin (simple rotation), Least Connections (least busy), and IP Hash (sticky sessions). Choose based on your needs.',
      },
      {
        title: 'Layer 4 vs Layer 7 Load Balancing',
        content:
          'Load balancers can operate at different network layers:\n\n**Layer 4 (Transport Layer)**\nMakes routing decisions based on IP address and TCP port. It doesn\'t look at the actual content of the request. Fast but dumb.\n\n**Layer 7 (Application Layer)**\nReads the HTTP request — the URL, headers, cookies, body. It can make smart decisions like:\n- Route `/api/*` to backend servers and `/images/*` to a CDN\n- Route requests with a specific cookie to a specific server\n- Reject malicious requests before they hit your servers\n\nLayer 7 is slower (it has to parse HTTP) but much more flexible. Most modern load balancers operate at Layer 7.\n\n**Common Load Balancers:**\n- **Nginx** — Extremely popular, can do both L4 and L7\n- **HAProxy** — High-performance, widely used in production\n- **AWS ALB** — Managed L7 load balancer\n- **AWS NLB** — Managed L4 load balancer',
        analogy:
          'Layer 4 is like a mail carrier who reads only the address on the envelope and delivers it. Layer 7 is like a mail carrier who opens the envelope, reads the contents, and decides which department in the building should get it.',
        keyTakeaway:
          'Layer 4 load balancing is fast but limited (IP/port only). Layer 7 reads HTTP content for smart routing. Use L7 when you need content-based decisions.',
      },
      {
        title: 'Nginx Load Balancer Configuration',
        content:
          'Let\'s see a real Nginx config that load balances across three backend servers. This is the kind of thing you\'d set up in production.',
        code: [
          {
            language: 'nginx',
            label: 'nginx.conf — Round Robin Load Balancing',
            code: `# Define the group of backend servers
upstream backend_servers {
    # Round Robin is the default
    server 10.0.0.1:3000;    # Server 1
    server 10.0.0.2:3000;    # Server 2
    server 10.0.0.3:3000;    # Server 3
}

server {
    listen 80;
    server_name myapp.com;

    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
          },
          {
            language: 'nginx',
            label: 'nginx.conf — Least Connections with Health Checks',
            code: `upstream backend_servers {
    least_conn;  # Use least-connections algorithm

    server 10.0.0.1:3000 weight=3;  # 3x capacity
    server 10.0.0.2:3000 weight=1;
    server 10.0.0.3:3000 weight=1;

    # If a server fails 3 times in 30 seconds,
    # stop sending traffic for 30 seconds
    server 10.0.0.4:3000 max_fails=3 fail_timeout=30s;
}`,
          },
        ],
        keyTakeaway:
          'Nginx makes load balancing straightforward with the upstream block. You can configure algorithms, weights, and health checks in just a few lines.',
      },
      {
        title: 'Health Checks and Failover',
        content:
          'What happens when a server crashes? A good load balancer detects this and stops sending traffic to dead servers.\n\n**Passive Health Checks:**\nThe load balancer notices when a server returns errors or times out. After a threshold (e.g., 3 failures in 30 seconds), it marks the server as "down" and reroutes traffic.\n\n**Active Health Checks:**\nThe load balancer periodically pings each server with a health endpoint (like `GET /health`). If the server doesn\'t respond with 200 OK, it\'s removed from the pool.\n\n**Failover Flow:**\n1. Server 3 stops responding to health checks.\n2. Load balancer marks Server 3 as unhealthy.\n3. All traffic is redirected to Servers 1 and 2.\n4. Server 3 is automatically restored when it starts passing health checks again.\n\nThis is how you achieve **high availability** — users never notice that a server went down.',
        analogy:
          'It\'s like a restaurant manager checking on each kitchen every 10 minutes. If a kitchen is on fire, the manager immediately stops sending orders there and distributes them to the remaining kitchens.',
        keyTakeaway:
          'Health checks (active and passive) let load balancers automatically detect and route around failed servers, providing high availability.',
      },
      {
        title: 'When Do You Need a Load Balancer?',
        content:
          'Not every system needs load balancing on day one. Here\'s when to introduce it:\n\n**You DON\'T need it yet if:**\n- Your app has < 1,000 concurrent users\n- A single server handles the load comfortably\n- You\'re in early development / MVP stage\n\n**You NEED it when:**\n- A single server can\'t handle the traffic (CPU > 70%, response times climbing)\n- You need zero-downtime deployments (rolling updates across servers)\n- You need high availability (if one server dies, others take over)\n- You\'re running in multiple availability zones for disaster recovery\n\n**Load Balancer as a Single Point of Failure?**\nYes — if the load balancer itself goes down, everything is down. Solution: run load balancers in pairs (active-passive or active-active) with a floating IP that shifts between them.',
        analogy:
          'You don\'t hire a traffic cop for a quiet neighborhood street. But when it becomes a highway interchange, you absolutely need one — and you probably need a backup cop too.',
        keyTakeaway:
          'Add load balancing when a single server can\'t handle the load or you need high availability. Run load balancers in pairs to avoid a single point of failure.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Storing session data on individual servers without sticky sessions or centralized storage',
        explanation:
          'If User A\'s session is on Server 1 and the load balancer sends their next request to Server 2, they\'ll appear logged out. Use centralized session storage (Redis) or IP hash.',
      },
      {
        mistake: 'Not configuring health checks',
        explanation:
          'Without health checks, the load balancer happily sends traffic to dead servers. Always configure both passive and active health checks.',
      },
      {
        mistake: 'Using only one load balancer',
        explanation:
          'A single load balancer is a single point of failure. Use a pair with failover or a managed cloud solution (AWS ALB, GCP Load Balancer).',
      },
      {
        mistake: 'Choosing the wrong algorithm for the workload',
        explanation:
          'Round Robin works when all requests are similar. If some requests take 10ms and others 10 seconds, Least Connections is much better.',
      },
    ],
    practiceQuestions: [
      'Your e-commerce site gets 10x traffic on Black Friday. How would you configure your load balancer?',
      'Explain the difference between Layer 4 and Layer 7 load balancing with an example.',
      'A user complains they keep getting logged out randomly. You use round-robin load balancing. What\'s the problem and how do you fix it?',
      'How would you load-balance WebSocket connections differently from HTTP requests?',
    ],
  },

  // ─────────────────────────────────────────────
  // 4. CACHING — SPEED UP EVERYTHING
  // ─────────────────────────────────────────────
  'caching-speed-up-everything': {
    steps: [
      {
        title: 'Your Brain Already Uses Caching',
        content:
          'What\'s 7 x 8? You didn\'t calculate it — you *remembered* it. That\'s caching. Your brain stored the result of a previous computation so you could retrieve it instantly instead of recalculating.\n\nIn system design, caching is the same idea: **store the result of an expensive operation so you can reuse it cheaply.**\n\nWithout caching, every time a user visits your homepage, the server might:\n1. Query the database for trending posts (50ms)\n2. Fetch user recommendations (100ms)\n3. Compute personalized feed (200ms)\nTotal: 350ms per request\n\nWith caching, if the result hasn\'t changed, you serve the stored result in 1-2ms. That\'s 100-200x faster.\n\n**Where caching happens:**\n- **Browser cache** — Images, CSS, JS stored locally\n- **CDN cache** — Static content at edge servers worldwide\n- **Application cache** — Redis/Memcached storing database query results\n- **Database cache** — Query result cache built into the DB',
        analogy:
          'Caching is your brain\'s short-term memory. When someone asks "What\'s the capital of France?" you don\'t Google it every time — you remember "Paris" from the last time you looked it up.',
        keyTakeaway:
          'Caching stores expensive results for cheap retrieval. It can happen at every layer: browser, CDN, application, and database.',
      },
      {
        title: 'Cache Hit, Cache Miss, and TTL',
        content:
          'Three concepts you must know:\n\n**Cache Hit** — The data is in the cache. Return it immediately. Fast!\n\n**Cache Miss** — The data is NOT in the cache. Go to the source (database), get it, store it in the cache for next time, then return it.\n\n**TTL (Time To Live)** — How long a cached item stays valid. After the TTL expires, the next request is a cache miss and the data is refreshed.\n\n**Cache Hit Ratio** — The percentage of requests served from cache. A 95% hit ratio means 95% of requests are blazing fast.\n\nThe goal is to maximize your cache hit ratio while keeping data fresh enough for your use case:\n- Stock prices: TTL = 1 second (must be fresh)\n- User profile: TTL = 5 minutes (changes rarely)\n- Blog post: TTL = 1 hour (almost never changes)\n- Static assets: TTL = 1 year (versioned by filename)',
        analogy:
          'Imagine you keep a sticky note on your desk with your Wi-Fi password (cache). When someone asks, you read the note (cache hit). If the password changed and the note is outdated (cache miss), you walk to the router to check (database lookup), then update your sticky note.',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'Request arrives',
            'Check cache',
            'Cache hit → Return data',
            'Cache miss → Query DB',
            'Store in cache with TTL',
            'Return data',
          ],
          flow: 'branching',
        },
        keyTakeaway:
          'Cache hit = fast, cache miss = slow + populate cache. TTL controls freshness. Aim for a high hit ratio (90%+) while keeping data acceptably fresh.',
      },
      {
        title: 'Cache Invalidation Strategies',
        content:
          'Phil Karlton famously said: "There are only two hard things in Computer Science: cache invalidation and naming things." When the source data changes, how do you update the cache?\n\n**Write-Through Cache**\nEvery write goes to *both* the cache and the database simultaneously. Data is always consistent, but writes are slower (two operations).\n\n**Write-Back (Write-Behind) Cache**\nWrites go to the cache first, and the cache asynchronously writes to the database later. Super fast writes, but risk of data loss if the cache crashes before flushing.\n\n**Write-Around Cache**\nWrites go directly to the database, bypassing the cache. The cache is only populated on reads (cache miss fills cache). Good when writes are rarely re-read immediately.\n\n**Cache-Aside (Lazy Loading)**\nThe most common pattern. The application checks the cache first. On a miss, it queries the database, stores the result in the cache, and returns it. On a write, it updates the database and invalidates (deletes) the cache entry.',
        analogy:
          'Write-Through: You update your sticky note AND the official record at the same time. Write-Back: You update the sticky note now and update the official record later tonight. Write-Around: You update the official record but don\'t bother with the sticky note until someone asks. Cache-Aside: You check the note first, and if it\'s outdated, you go look up the official record and rewrite the note.',
        visual: 'comparison',
        visualData: {
          items: [
            { label: 'Write-Through', pros: 'Always consistent', cons: 'Slower writes' },
            { label: 'Write-Back', pros: 'Fast writes', cons: 'Risk data loss' },
            { label: 'Write-Around', pros: 'No stale cache on write', cons: 'Higher read latency initially' },
            { label: 'Cache-Aside', pros: 'Flexible, popular', cons: 'Possible stale reads' },
          ],
        },
        keyTakeaway:
          'Cache-Aside is the most common pattern: read from cache first, fill on miss, invalidate on write. Know all four strategies and their trade-offs.',
      },
      {
        title: 'Redis — The Swiss Army Knife of Caching',
        content:
          'Redis is an in-memory data store used as a cache, message broker, and more. It\'s blindingly fast because data lives in RAM (not on disk).\n\nRedis supports strings, hashes, lists, sets, sorted sets, and more. Here\'s how you use it as a cache:',
        code: [
          {
            language: 'javascript',
            label: 'Cache-Aside Pattern with Redis (Node.js)',
            code: `import Redis from 'ioredis';
const redis = new Redis();

async function getUserProfile(userId: string) {
  const cacheKey = \`user:\${userId}:profile\`;

  // Step 1: Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache HIT');
    return JSON.parse(cached);
  }

  // Step 2: Cache miss — query database
  console.log('Cache MISS');
  const user = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );

  // Step 3: Store in cache with 5-minute TTL
  await redis.set(
    cacheKey,
    JSON.stringify(user),
    'EX', 300  // Expires in 300 seconds
  );

  return user;
}

// When user updates their profile, invalidate cache
async function updateUserProfile(userId: string, data: any) {
  await db.query(
    'UPDATE users SET name = $1, bio = $2 WHERE id = $3',
    [data.name, data.bio, userId]
  );

  // Invalidate the cached entry
  await redis.del(\`user:\${userId}:profile\`);
}`,
          },
        ],
        keyTakeaway:
          'Redis is the go-to in-memory cache. Use the Cache-Aside pattern: check cache, query DB on miss, store result, invalidate on writes.',
      },
      {
        title: 'Eviction Policies — When the Cache is Full',
        content:
          'RAM is finite. When the cache is full and you need to add a new entry, which old entry do you remove? That\'s the **eviction policy**.\n\n**LRU (Least Recently Used)** — Evict the entry that hasn\'t been accessed in the longest time. The most common and generally best choice.\n\n**LFU (Least Frequently Used)** — Evict the entry accessed the fewest times. Good when some data is accessed in bursts.\n\n**FIFO (First In, First Out)** — Evict the oldest entry. Simple but often suboptimal.\n\n**Random** — Evict a random entry. Surprisingly decent and very simple.\n\n**Redis default:** `noeviction` (returns error when full). In production, you typically set it to `allkeys-lru`.\n\nTo configure Redis eviction:\n```\nmaxmemory 2gb\nmaxmemory-policy allkeys-lru\n```',
        analogy:
          'Your desk can only hold 10 sticky notes. When you need to add an 11th: LRU = throw away the one you haven\'t looked at in the longest time. LFU = throw away the one you\'ve looked at the fewest times ever. FIFO = throw away the oldest one.',
        visual: 'table',
        visualData: {
          headers: ['Policy', 'Evicts', 'Best For'],
          rows: [
            ['LRU', 'Least recently accessed', 'General purpose (most common)'],
            ['LFU', 'Least frequently accessed', 'Data with "hot" items'],
            ['FIFO', 'Oldest entry', 'Time-based data'],
            ['Random', 'Random entry', 'Uniform access patterns'],
          ],
        },
        keyTakeaway:
          'When the cache is full, eviction policies decide what to remove. LRU (Least Recently Used) is the default choice for most applications.',
      },
      {
        title: 'Caching Pitfalls and Best Practices',
        content:
          '**Cache Stampede (Thundering Herd)**\nA popular cache entry expires. Suddenly 1,000 requests all miss the cache at once and slam the database. Solution: use a lock so only one request refreshes the cache, or use "stale-while-revalidate" to serve slightly old data while refreshing.\n\n**Cache Penetration**\nRequests for data that doesn\'t exist in the cache OR the database. Every request hits the database. Solution: cache null results with a short TTL, or use a Bloom filter.\n\n**Cache Warming**\nWhen you deploy fresh servers with empty caches, the first burst of traffic all misses. Solution: pre-populate (warm) the cache with commonly accessed data before going live.\n\n**Best Practices:**\n- Cache data that\'s read frequently and changes infrequently\n- Always set a TTL — don\'t let stale data live forever\n- Monitor your cache hit ratio — below 80% means something\'s wrong\n- Use consistent key naming: `entity:id:field` (e.g., `user:123:profile`)',
        analogy:
          'Cache stampede is like a water cooler rumor — one person says something expired, and suddenly everyone rushes to check at the same time, overwhelming the source.',
        keyTakeaway:
          'Watch out for cache stampedes (use locks), cache penetration (cache nulls), and cold starts (warm the cache). Always monitor your hit ratio.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Caching everything, including data that changes constantly',
        explanation:
          'If data changes every second, caching it with a 5-minute TTL means users see stale data. Only cache data with a favorable read-to-write ratio.',
      },
      {
        mistake: 'Forgetting to invalidate the cache when data changes',
        explanation:
          'If you update a user\'s name in the database but forget to invalidate the cache, users see the old name until TTL expires. Always invalidate or update cache on writes.',
      },
      {
        mistake: 'Not setting a TTL on cache entries',
        explanation:
          'Without TTL, stale data lives in cache forever. Always set an appropriate TTL as a safety net, even if you also invalidate on writes.',
      },
      {
        mistake: 'Using the same TTL for everything',
        explanation:
          'A user\'s profile photo URL and a real-time stock price need very different TTLs. Set TTL based on how frequently the data changes and how stale is acceptable.',
      },
    ],
    practiceQuestions: [
      'Your API returns user profiles. The profile page gets 1,000 views per minute but profiles are updated once per day. Design a caching strategy.',
      'Explain the difference between write-through and cache-aside. When would you choose each?',
      'A popular item\'s cache entry expires and 10,000 requests hit your database simultaneously. What happened and how do you prevent it?',
      'What is the difference between LRU and LFU eviction? Give a scenario where LFU is better.',
      'How would you cache search results when the same query is made by many different users?',
    ],
  },

  // ─────────────────────────────────────────────
  // 5. CDN — CONTENT CLOSER TO USERS
  // ─────────────────────────────────────────────
  'cdn-content-closer-to-users': {
    steps: [
      {
        title: 'Amazon\'s Local Warehouses',
        content:
          'When you order something on Amazon, it doesn\'t ship from one central warehouse in Seattle. Amazon has warehouses (fulfillment centers) all over the country. Your package comes from the nearest one, so it arrives faster.\n\nA **CDN (Content Delivery Network)** does the same thing for your website\'s content. Instead of every user loading images, videos, and scripts from your server in Virginia, a CDN copies that content to servers (called **edge servers**) all over the world. A user in Tokyo gets content from a server in Tokyo. A user in London gets it from London.\n\n**The result?**\n- A user 10,000 miles from your server: ~200ms latency\n- A user served by a nearby edge server: ~20ms latency\n- That\'s 10x faster!',
        analogy:
          'Instead of one pizza shop in the center of a huge city where everyone waits 45 minutes for delivery, you open branches in every neighborhood. Now delivery takes 5 minutes for everyone.',
        keyTakeaway:
          'A CDN distributes your content to edge servers worldwide so users get it from the nearest server. This dramatically reduces latency.',
      },
      {
        title: 'How a CDN Works',
        content:
          'Here is the flow when a user requests an image from your CDN:\n\n**First Request (Cache Miss):**\n1. User in Tokyo requests `https://cdn.myapp.com/logo.png`\n2. The request goes to the nearest CDN edge server (Tokyo edge).\n3. The edge server doesn\'t have it yet. It fetches from your **origin server** (Virginia).\n4. The origin sends the image. The edge server caches it and serves it to the user.\n\n**Subsequent Requests (Cache Hit):**\n1. Another user in Tokyo requests `https://cdn.myapp.com/logo.png`\n2. The Tokyo edge server already has it cached.\n3. Served instantly. Origin server is never contacted.\n\nThe CDN handles cache expiration with TTL headers. When the TTL expires, the next request triggers a fresh fetch from the origin.',
        analogy:
          'The first time someone in your neighborhood orders a rare book, the bookstore imports it from abroad (slow). But the bookstore keeps a copy on the shelf. The next person who wants it gets it immediately.',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'User Request',
            'Nearest Edge Server',
            'Cache Hit? → Serve immediately',
            'Cache Miss → Fetch from Origin',
            'Cache at Edge + Serve',
          ],
          flow: 'branching',
        },
        keyTakeaway:
          'CDN flow: request goes to nearest edge server. On a cache hit, content is served instantly. On a miss, edge fetches from origin, caches it, then serves.',
      },
      {
        title: 'Push CDN vs Pull CDN',
        content:
          '**Pull CDN (most common)**\nContent is pulled from your origin server on demand. The first request is slow (cache miss), but subsequent requests are fast. You don\'t have to manage what\'s on the CDN.\n\n**Push CDN**\nYou manually upload content to the CDN. You control exactly what\'s cached and when. Useful for large, rarely-changing files (video libraries, software downloads).\n\n**When to use each:**\n- Pull: Websites, APIs, dynamic content — most use cases\n- Push: Video streaming (pre-encode and upload), large file downloads\n\n**What to put on a CDN:**\n- Images, videos, audio files\n- CSS, JavaScript bundles\n- Fonts\n- Static HTML pages\n- API responses (with proper cache headers)\n\n**What NOT to put on a CDN:**\n- User-specific data (profiles, dashboards)\n- Real-time data (chat messages, live scores)\n- Sensitive data (financial records, health info)',
        analogy:
          'Pull CDN: A library that borrows popular books from the main library when someone asks. Push CDN: A library where you personally deliver specific books to stock on their shelves.',
        keyTakeaway:
          'Pull CDNs fetch content on demand (easier). Push CDNs require manual upload (more control). Use Pull for most web content, Push for large media files.',
      },
      {
        title: 'Setting Up a CDN',
        content:
          'Major CDN providers: **Cloudflare** (easy + free tier), **AWS CloudFront** (integrates with S3), **Fastly** (highly customizable), **Akamai** (enterprise).\n\nHere\'s how to set up caching headers so CDNs know what to cache:',
        code: [
          {
            language: 'javascript',
            label: 'Express.js — Setting Cache-Control Headers',
            code: `// Static assets: cache for 1 year (use versioned filenames)
app.use('/static', express.static('public', {
  maxAge: '1y',           // Browser + CDN cache for 1 year
  immutable: true,        // File never changes (versioned)
}));

// API responses: cache for 60 seconds
app.get('/api/trending', (req, res) => {
  const trending = getTrendingPosts();

  res.set({
    'Cache-Control': 'public, max-age=60, s-maxage=300',
    // max-age=60: browser caches for 60s
    // s-maxage=300: CDN caches for 300s (overrides max-age for CDN)
    'CDN-Cache-Control': 'max-age=300',
    'Vary': 'Accept-Encoding',
  });

  res.json(trending);
});

// Private data: NEVER cache on CDN
app.get('/api/me', authenticate, (req, res) => {
  res.set('Cache-Control', 'private, no-store');
  res.json(req.user);
});`,
          },
          {
            language: 'text',
            label: 'CloudFront — Quick Setup Steps',
            code: `1. Upload static files to an S3 bucket
2. Create a CloudFront distribution:
   - Origin: your S3 bucket (or your API server)
   - Cache behavior: respect origin Cache-Control headers
   - Price class: choose regions (US+Europe = cheaper)
   - Alternate domain: cdn.myapp.com
3. Point cdn.myapp.com DNS to CloudFront
4. Update your app to load assets from cdn.myapp.com

Result:
  Before: <img src="https://myapp.com/img/logo.png">
  After:  <img src="https://cdn.myapp.com/img/logo.png">`,
          },
        ],
        keyTakeaway:
          'Use Cache-Control headers to tell CDNs what to cache and for how long. Use s-maxage for CDN-specific TTL. Never cache private/user-specific data.',
      },
      {
        title: 'Cache Invalidation on CDNs',
        content:
          'What if you deploy a new version of your website and the CDN is still serving the old CSS? You need to invalidate the cache.\n\n**Strategy 1: Cache Busting with Versioned URLs (Best Practice)**\nInstead of `style.css`, use `style.abc123.css` where `abc123` is a content hash. When the file changes, the hash changes, so it\'s a new URL — no invalidation needed. Build tools like Webpack and Vite do this automatically.\n\n**Strategy 2: Purge / Invalidation API**\nCDNs provide APIs to purge specific URLs or patterns. Useful for emergencies but slow (can take minutes to propagate globally).\n\n**Strategy 3: Short TTLs**\nSet shorter cache durations for content that changes frequently. The trade-off: more origin fetches.\n\nIn practice, use versioned URLs for static assets (CSS, JS, images) and short TTLs + purge for dynamic content (API responses).',
        analogy:
          'Versioned URLs are like printing a new edition of a book with a different ISBN. Bookstores automatically stock the new edition because it has a different identifier. You never have to recall the old copies.',
        keyTakeaway:
          'Use versioned filenames (content hashing) for cache busting — it\'s the most reliable strategy. Reserve purge APIs for emergencies.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Caching user-specific or authenticated content on a CDN',
        explanation:
          'If you cache a page that shows User A\'s data, User B might see User A\'s information. Always use "Cache-Control: private, no-store" for authenticated endpoints.',
      },
      {
        mistake: 'Not using versioned filenames for static assets',
        explanation:
          'Without versioned names, you rely on CDN purge to update content, which is slow and unreliable. Use content hashes in filenames.',
      },
      {
        mistake: 'Setting very long TTLs without a cache-busting strategy',
        explanation:
          'If you cache style.css for 1 year and then change it, users will see the old version for up to a year. Pair long TTLs with versioned filenames.',
      },
    ],
    practiceQuestions: [
      'Your website serves users in 30 countries. Images load slowly for users in Asia (your server is in US-East). How do you fix this?',
      'Explain the difference between push and pull CDNs. Which would you use for a video streaming platform?',
      'You deployed a broken CSS file that\'s now cached on your CDN for 1 year. How do you fix it immediately?',
      'What HTTP header tells a CDN to cache a response for a different duration than the browser?',
    ],
  },

  // ─────────────────────────────────────────────
  // 6. MESSAGE QUEUES
  // ─────────────────────────────────────────────
  'message-queues': {
    steps: [
      {
        title: 'The Post Office Analogy',
        content:
          'Imagine sending a letter. You don\'t stand at the recipient\'s door waiting for them to read it. You drop it at the post office, and the post office delivers it when the recipient is ready. You\'re free to go do other things.\n\nA **message queue** works the same way. Instead of Service A calling Service B directly and waiting for a response (synchronous), Service A drops a message in a queue and moves on (asynchronous). Service B picks up the message whenever it\'s ready.\n\n**Why this is powerful:**\n- **Decoupling** — Service A doesn\'t need to know where Service B is or if it\'s running.\n- **Resilience** — If Service B crashes, messages wait in the queue until it recovers.\n- **Scalability** — You can add more consumers (Service B instances) to process messages faster.\n- **Load Leveling** — The queue absorbs traffic spikes. Even if 10,000 messages arrive in a second, consumers process them at their own pace.',
        analogy:
          'A post office holds your letters until the recipient picks them up. It doesn\'t matter if the recipient is busy, sleeping, or on vacation — the letter waits safely until they\'re ready.',
        keyTakeaway:
          'Message queues enable asynchronous communication between services: the producer sends messages without waiting, the consumer processes them when ready.',
      },
      {
        title: 'Producer-Consumer Pattern',
        content:
          'The core pattern behind message queues is **Producer-Consumer**:\n\n- **Producer** — Creates messages and puts them in the queue.\n- **Queue** — Stores messages in order (usually FIFO — first in, first out).\n- **Consumer** — Reads messages from the queue and processes them.\n\n**Real-world examples:**\n- **E-commerce order processing**: User places order (producer) → message enters queue → order service processes payment and fulfillment (consumer).\n- **Email notifications**: User signs up (producer) → "send welcome email" message → email service sends it (consumer).\n- **Image processing**: User uploads photo (producer) → "resize and create thumbnails" message → image worker processes it (consumer).\n- **Log aggregation**: App servers produce log messages → logging service consumes and indexes them.\n\nThe key insight: the producer doesn\'t care HOW or WHEN the message is processed. It just drops the message and moves on.',
        analogy:
          'A restaurant kitchen uses a ticket system. Waiters (producers) clip order tickets on a rail. Cooks (consumers) grab tickets and prepare dishes. If there\'s a rush, you add more cooks — the rail (queue) holds all the pending orders.',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'Producer (sends message)',
            'Message Queue (stores)',
            'Consumer 1 (processes)',
            'Consumer 2 (processes)',
            'Consumer 3 (processes)',
          ],
          flow: 'fan-out',
        },
        keyTakeaway:
          'Producers create messages, the queue stores them, consumers process them. This decouples the two sides and enables independent scaling.',
      },
      {
        title: 'Point-to-Point vs Pub/Sub',
        content:
          'There are two main messaging patterns:\n\n**Point-to-Point (Queue)**\nEach message is consumed by exactly ONE consumer. When Consumer A picks up a message, Consumer B won\'t see it. Think of it like a work queue — each task is done once.\n\nUse case: Order processing. You want each order processed exactly once.\n\n**Publish/Subscribe (Pub/Sub)**\nEach message is broadcast to ALL subscribers. If three services subscribe, all three receive every message. Think of it like a newspaper — every subscriber gets a copy.\n\nUse case: When a user places an order, you want to notify the inventory service AND the email service AND the analytics service.\n\nMany systems use BOTH patterns. Kafka, for example, uses "consumer groups" — within a group, messages are point-to-point. Across groups, they\'re pub/sub.',
        analogy:
          'Point-to-Point: A single to-do list shared by a team. Whoever grabs a task does it — nobody else does the same task. Pub/Sub: A company-wide email announcement — everyone receives it.',
        visual: 'comparison',
        visualData: {
          items: [
            { label: 'Point-to-Point', pros: 'Each message processed once', cons: 'Only one consumer per message' },
            { label: 'Pub/Sub', pros: 'All subscribers get every message', cons: 'Messages duplicated per subscriber' },
          ],
        },
        keyTakeaway:
          'Point-to-Point: each message goes to one consumer (work queue). Pub/Sub: each message goes to all subscribers (broadcast). Kafka supports both via consumer groups.',
      },
      {
        title: 'RabbitMQ vs Kafka',
        content:
          'The two most popular message queue systems:\n\n**RabbitMQ**\n- Traditional message broker\n- Messages are deleted after being consumed\n- Great for task queues (send email, process payment)\n- Supports complex routing (topic exchanges, headers)\n- Lower throughput (~50K msgs/sec)\n- Push-based: broker pushes messages to consumers\n\n**Apache Kafka**\n- Distributed log / event streaming platform\n- Messages are RETAINED even after consumption (configurable retention)\n- Great for event streaming, log aggregation, real-time analytics\n- Simple topic-based routing\n- Extremely high throughput (~1M msgs/sec)\n- Pull-based: consumers pull messages at their own pace\n\n**When to use which:**\n- RabbitMQ: task queues, complex routing, traditional messaging\n- Kafka: event streaming, high-throughput logging, when you need to replay messages',
        analogy:
          'RabbitMQ is like a post office — letters are delivered and the post office doesn\'t keep copies. Kafka is like a newspaper archive — issues are delivered but also kept on file, so you can go back and re-read old ones.',
        visual: 'table',
        visualData: {
          headers: ['Feature', 'RabbitMQ', 'Kafka'],
          rows: [
            ['Model', 'Message broker', 'Distributed log'],
            ['After consuming', 'Message deleted', 'Message retained'],
            ['Throughput', '~50K/sec', '~1M/sec'],
            ['Delivery', 'Push to consumers', 'Pull by consumers'],
            ['Replay', 'No', 'Yes'],
            ['Best for', 'Task queues', 'Event streaming'],
          ],
        },
        keyTakeaway:
          'RabbitMQ: traditional message broker, great for task queues. Kafka: distributed log, great for high-throughput event streaming with replay capability.',
      },
      {
        title: 'Code Example — Publishing and Consuming',
        content:
          'Let\'s see how to publish and consume messages with both RabbitMQ and a Kafka-style approach.',
        code: [
          {
            language: 'javascript',
            label: 'RabbitMQ — Publish and Consume (Node.js)',
            code: `import amqp from 'amqplib';

// === PRODUCER ===
async function publishOrder(order) {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const queue = 'order_processing';
  await channel.assertQueue(queue, { durable: true });

  // Publish message (persistent so it survives broker restart)
  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(order)),
    { persistent: true }
  );

  console.log(\`Order \${order.id} sent to queue\`);
}

// === CONSUMER ===
async function processOrders() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const queue = 'order_processing';
  await channel.assertQueue(queue, { durable: true });

  // Process one message at a time
  channel.prefetch(1);

  channel.consume(queue, async (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log(\`Processing order \${order.id}...\`);

    await processPayment(order);
    await updateInventory(order);
    await sendConfirmationEmail(order);

    // Acknowledge: message is done, remove from queue
    channel.ack(msg);
  });
}`,
          },
          {
            language: 'javascript',
            label: 'Kafka-style — Publish and Consume (kafkajs)',
            code: `import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['localhost:9092'],
});

// === PRODUCER ===
const producer = kafka.producer();

async function publishEvent(event) {
  await producer.connect();
  await producer.send({
    topic: 'user-events',
    messages: [
      {
        key: event.userId,   // Same user → same partition → ordered
        value: JSON.stringify(event),
      },
    ],
  });
}

// === CONSUMER ===
const consumer = kafka.consumer({ groupId: 'analytics-service' });

async function consumeEvents() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-events' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(\`Event: \${event.type} from user \${event.userId}\`);
      await trackAnalytics(event);
    },
  });
}`,
          },
        ],
        keyTakeaway:
          'Both RabbitMQ and Kafka follow the pattern: connect, publish messages, consume messages, and acknowledge processing. The APIs are similar but the semantics differ.',
      },
      {
        title: 'Delivery Guarantees and Dead Letter Queues',
        content:
          'What if a consumer crashes while processing a message? Message queues offer delivery guarantees:\n\n**At-most-once**: Message is delivered 0 or 1 times. Fast but messages can be lost. (Fire and forget)\n\n**At-least-once**: Message is delivered 1 or more times. No loss, but possible duplicates. (Most common — make consumers idempotent.)\n\n**Exactly-once**: Message is delivered exactly 1 time. Hardest to achieve. Kafka supports this with transactions.\n\n**Dead Letter Queue (DLQ)**\nWhat if a message fails processing 5 times in a row? Instead of retrying forever, move it to a "dead letter queue" for manual inspection. This prevents one bad message from blocking the entire queue.\n\n**Idempotency**\nSince at-least-once delivery means duplicates, your consumers must be idempotent — processing the same message twice produces the same result. Example: use a unique order ID to check "did I already process this?" before proceeding.',
        analogy:
          'At-most-once: Throwing a letter out the window and hoping it lands in the mailbox. At-least-once: Mailing a letter and sending a backup copy just in case. Dead Letter Queue: A pile of undeliverable mail at the post office that needs manual attention.',
        keyTakeaway:
          'Prefer at-least-once delivery with idempotent consumers. Use dead letter queues for messages that repeatedly fail processing.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Not making consumers idempotent',
        explanation:
          'With at-least-once delivery, a consumer might receive the same message twice. If processing it twice charges a customer twice, that\'s a serious bug. Use unique IDs to detect duplicates.',
      },
      {
        mistake: 'Using synchronous calls when a queue would be better',
        explanation:
          'If Service A calls Service B and waits 30 seconds for a response, that\'s wasteful. If the user doesn\'t need an immediate result (email sending, image processing), use a queue.',
      },
      {
        mistake: 'Not monitoring queue depth',
        explanation:
          'If your queue is growing faster than consumers can process, you have a problem. Set up alerts for queue depth and add consumers before the queue overflows.',
      },
      {
        mistake: 'Putting too much data in the message',
        explanation:
          'Messages should be lightweight — include IDs and essential metadata, not entire database records. The consumer can look up full details from the database.',
      },
    ],
    practiceQuestions: [
      'A user uploads a profile photo. You need to create 3 thumbnail sizes and run a content moderation check. Design this with a message queue.',
      'Explain the difference between point-to-point and pub/sub. Give a use case for each.',
      'When would you choose Kafka over RabbitMQ?',
      'What is a dead letter queue and why is it important?',
      'Your order processing consumer occasionally processes the same order twice, causing double charges. How do you fix this?',
    ],
  },

  // ─────────────────────────────────────────────
  // 7. DATABASE SCALING
  // ─────────────────────────────────────────────
  'database-scaling': {
    steps: [
      {
        title: 'The Library Needs More Space',
        content:
          'Imagine a library that started in a small room. As the city grew, the library got more books and more visitors. Eventually, it can\'t fit more shelves and the single librarian can\'t serve everyone fast enough.\n\nDatabases face the same problem. Your startup launches and a single PostgreSQL server is perfect. Then you hit product-market fit: queries slow down, writes start queuing up, and disk space runs out.\n\nYou have two choices:\n\n**Vertical Scaling (Scale Up)** — Get a bigger computer. More RAM, faster CPU, bigger disk. Like expanding the library building.\n\n**Horizontal Scaling (Scale Out)** — Add more computers. Like opening branch libraries across the city.\n\nVertical scaling is simpler but has limits (you can\'t buy a server with 1 TB of RAM). Horizontal scaling is harder but scales infinitely.',
        analogy:
          'Vertical scaling: Renovating your library to add more floors. Horizontal scaling: Opening new library branches across the city. Renovating has a physical limit; branches can keep growing.',
        keyTakeaway:
          'Vertical scaling means a bigger server (simple but limited). Horizontal scaling means more servers (complex but unlimited). Most systems eventually need horizontal scaling.',
      },
      {
        title: 'Read Replicas — Cloning the Librarian',
        content:
          'Most applications read data far more than they write (often 10:1 or even 100:1). So the first scaling strategy is: optimize for reads.\n\n**Read Replicas** are copies of your primary database. Writes go to the primary (leader), which replicates changes to one or more replicas (followers). Reads can go to any replica.\n\n**Flow:**\n1. User updates profile → Write goes to primary DB\n2. Primary replicates the change to 3 replicas\n3. User views a profile → Read goes to the nearest replica\n\n**Benefits:**\n- Spreads read load across multiple servers\n- Primary is only responsible for writes\n- Replicas can be in different regions for lower latency\n\n**Gotcha — Replication Lag:**\nReplication isn\'t instant. There\'s a brief delay (usually milliseconds, sometimes seconds) between a write on the primary and its appearance on replicas. If a user updates their name and immediately views their profile, they might see the old name if the read hits a lagging replica.\n\n**Solution:** For critical reads-after-writes, route them to the primary. For eventual consistency (like a news feed), replicas are fine.',
        code: [
          {
            language: 'javascript',
            label: 'Read/Write Splitting (Node.js)',
            code: `import { Pool } from 'pg';

// Primary for writes
const primary = new Pool({
  host: 'db-primary.myapp.com',
  port: 5432,
  database: 'myapp',
});

// Replicas for reads (round-robin)
const replicas = [
  new Pool({ host: 'db-replica-1.myapp.com', ... }),
  new Pool({ host: 'db-replica-2.myapp.com', ... }),
  new Pool({ host: 'db-replica-3.myapp.com', ... }),
];

let replicaIndex = 0;
function getReadPool() {
  const pool = replicas[replicaIndex];
  replicaIndex = (replicaIndex + 1) % replicas.length;
  return pool;
}

// Write — always goes to primary
async function updateUser(id, name) {
  await primary.query(
    'UPDATE users SET name = $1 WHERE id = $2',
    [name, id]
  );
}

// Read — goes to a replica
async function getUser(id) {
  const pool = getReadPool();
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}`,
          },
        ],
        analogy:
          'The head librarian (primary) is the only one who can add or update book records. But there are assistant librarians (replicas) who each have a copy of the catalog and can help visitors find books.',
        keyTakeaway:
          'Read replicas spread read load across multiple servers. Writes go to the primary, reads go to replicas. Watch out for replication lag on critical reads.',
      },
      {
        title: 'Sharding — Splitting the Library',
        content:
          'Read replicas help with read-heavy workloads. But what about writes? If your primary database can\'t handle the write volume, or your dataset is too large for one machine, you need **sharding**.\n\nSharding splits your data across multiple independent databases (shards). Each shard holds a subset of the data.\n\n**Sharding Strategies:**\n\n**Range-Based Sharding**\nSplit by a range of values. Users A-M on Shard 1, N-Z on Shard 2.\n- Pro: Simple, range queries are easy\n- Con: Uneven distribution (more users named "S" than "X")\n\n**Hash-Based Sharding**\nHash the shard key (e.g., user_id) and mod by the number of shards: `shard = hash(user_id) % num_shards`\n- Pro: Even distribution\n- Con: Range queries are hard, adding shards is painful (re-hashing)\n\n**Directory-Based Sharding**\nA lookup table maps each entity to a shard. Flexible but the lookup table is a single point of failure.\n\n**Choosing a Shard Key:**\nThe shard key determines which shard holds each record. A good shard key:\n- Distributes data evenly\n- Avoids "hot spots" (one shard getting all the traffic)\n- Is used in most queries (so you know which shard to query)',
        analogy:
          'Instead of one giant library, the city builds libraries by neighborhood: North Library, South Library, East Library, West Library. Each holds books relevant to its area. When you need a book, you go to the right branch.',
        visual: 'table',
        visualData: {
          headers: ['Strategy', 'How It Works', 'Pro', 'Con'],
          rows: [
            ['Range', 'Split by value range', 'Range queries easy', 'Uneven distribution'],
            ['Hash', 'hash(key) % shards', 'Even distribution', 'Range queries hard'],
            ['Directory', 'Lookup table', 'Flexible', 'Lookup = bottleneck'],
          ],
        },
        keyTakeaway:
          'Sharding splits data across multiple databases. Hash-based gives even distribution, range-based enables range queries. Choose a shard key that distributes evenly and avoids hot spots.',
      },
      {
        title: 'Connection Pooling',
        content:
          'Each database connection takes resources: memory, CPU, network sockets. PostgreSQL can handle maybe 500 concurrent connections before performance degrades.\n\nIf you have 20 application servers, each with 50 connections, that\'s 1,000 connections — too many for the database.\n\n**Connection Pooling** reuses a fixed number of connections instead of creating new ones per request.\n\n**How it works:**\n1. The pool creates N connections at startup (e.g., 20).\n2. When a request needs the database, it borrows a connection from the pool.\n3. When the request is done, the connection is returned to the pool.\n4. If all connections are in use, the request waits in a queue.\n\n**PgBouncer** is the most popular connection pooler for PostgreSQL. It sits between your app and the database, multiplexing thousands of app connections into a handful of DB connections.',
        code: [
          {
            language: 'javascript',
            label: 'Connection Pooling with pg (Node.js)',
            code: `import { Pool } from 'pg';

const pool = new Pool({
  host: 'db.myapp.com',
  database: 'myapp',
  max: 20,              // Maximum 20 connections in the pool
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail if can't connect in 2s
});

// Borrow connection → query → return connection
async function getUser(id) {
  const client = await pool.connect();  // Borrow from pool
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  } finally {
    client.release();  // Return to pool (DON'T forget this!)
  }
}

// Or use the simpler shorthand (auto-borrows and returns):
async function getUserSimple(id) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
}`,
          },
        ],
        analogy:
          'Without pooling: every customer at a car rental place gets a brand new car manufactured just for them, then it\'s scrapped after. With pooling: a fleet of 20 cars is shared. You pick up an available car, use it, and return it for the next person.',
        keyTakeaway:
          'Connection pooling reuses database connections instead of creating new ones per request. Use it always — it\'s essential for any production database.',
      },
      {
        title: 'Putting It All Together — A Scaling Roadmap',
        content:
          'Here\'s the typical progression for scaling a database:\n\n**Stage 1: Single Server (0-10K users)**\nOne PostgreSQL instance. Simple. Just add proper indexes.\n\n**Stage 2: Vertical Scaling (10K-100K users)**\nUpgrade to a bigger server. More RAM, faster SSD, better CPU.\n\n**Stage 3: Read Replicas (100K-1M users)**\nAdd read replicas. Route reads to replicas, writes to primary. Add connection pooling (PgBouncer).\n\n**Stage 4: Caching Layer (1M-10M users)**\nAdd Redis as a cache layer. Cache hot queries, session data, computed results.\n\n**Stage 5: Sharding (10M+ users)**\nShard the database by user_id or tenant_id. Each shard handles a subset of users.\n\n**Stage 6: Specialized Databases (100M+ users)**\nUse the right tool for the job: PostgreSQL for relational data, Redis for caching, Elasticsearch for search, Cassandra for time-series.\n\nDon\'t over-engineer early. Most startups never get past Stage 3. Scale when you *need* to, not because it sounds cool.',
        analogy:
          'It\'s like growing a restaurant. Start with one location. If it\'s packed, get a bigger space (vertical). Still packed? Open a take-out window for quick orders (read replicas). Still growing? Open multiple locations (sharding).',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'Single Server',
            'Vertical Scaling',
            'Read Replicas + Connection Pooling',
            'Caching (Redis)',
            'Sharding',
            'Polyglot Persistence',
          ],
          flow: 'linear',
        },
        keyTakeaway:
          'Scale progressively: single server → bigger server → read replicas → caching → sharding → specialized databases. Don\'t jump to sharding before you need it.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Sharding too early',
        explanation:
          'Sharding adds enormous complexity: cross-shard queries, distributed transactions, operational burden. Most apps work fine with a single database + read replicas + caching. Shard only when you truly need it.',
      },
      {
        mistake: 'Choosing a bad shard key',
        explanation:
          'If you shard by country and 80% of users are in the US, the US shard is a hot spot. Choose a key that distributes evenly (like user_id with hash-based sharding).',
      },
      {
        mistake: 'Forgetting to release pooled connections',
        explanation:
          'If you borrow a connection and don\'t return it (e.g., due to an unhandled exception), the pool slowly leaks connections until none are available and everything stalls. Always use try/finally.',
      },
      {
        mistake: 'Reading from replicas immediately after writing to primary',
        explanation:
          'Due to replication lag, the replica might not have the latest write. Route critical reads-after-writes to the primary.',
      },
    ],
    practiceQuestions: [
      'Your database has 500 million rows and queries are getting slow. Walk through the scaling steps you\'d take.',
      'Explain the difference between vertical and horizontal database scaling. What are the trade-offs?',
      'You\'re sharding a social media app\'s database. What would you use as a shard key and why?',
      'What is replication lag and how does it affect your application?',
    ],
  },

  // ─────────────────────────────────────────────
  // 8. API DESIGN
  // ─────────────────────────────────────────────
  'api-design': {
    steps: [
      {
        title: 'The Restaurant Menu',
        content:
          'An API (Application Programming Interface) is like a restaurant menu. The menu tells you what dishes are available, what ingredients they contain, and how to order. You don\'t need to know how the kitchen works — you just pick from the menu.\n\nSimilarly, an API defines what operations are available, what data they accept, and what they return. The client doesn\'t need to know the server\'s internal implementation — they just use the API.\n\n**A good API is like a good menu:**\n- **Clear naming** — "Grilled Salmon" is better than "Dish #47"\n- **Organized sections** — Appetizers, Mains, Desserts (not random order)\n- **Consistent format** — Every dish lists price and ingredients the same way\n- **Versioned** — When you change the menu, you don\'t throw away the old one (regulars still expect their favorites)',
        analogy:
          'A restaurant menu is an API. The dishes are endpoints. The descriptions are documentation. The prices are rate limits. The waiter is the HTTP layer that carries your request to the kitchen and brings back the response.',
        keyTakeaway:
          'An API is a contract between client and server. Like a good restaurant menu, it should be clear, consistent, well-organized, and versioned.',
      },
      {
        title: 'REST Principles',
        content:
          'REST (Representational State Transfer) is the most popular API style. It uses standard HTTP methods and organizes everything around **resources**.\n\n**Key REST Principles:**\n\n1. **Resources** — Everything is a noun: users, posts, comments. The URL identifies the resource.\n2. **HTTP Methods** — Verbs that act on resources: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove).\n3. **Stateless** — Each request contains all the information needed. The server doesn\'t remember previous requests.\n4. **Uniform Interface** — Consistent URL patterns, status codes, and response formats.\n\n**Good URL Design:**\n```\nGET    /api/users          → List all users\nGET    /api/users/123       → Get user 123\nPOST   /api/users           → Create a new user\nPUT    /api/users/123       → Replace user 123\nPATCH  /api/users/123       → Update parts of user 123\nDELETE /api/users/123       → Delete user 123\n```\n\n**Bad URL Design:**\n```\nGET  /api/getUser?id=123     ← Verb in URL (redundant with GET)\nPOST /api/deleteUser          ← Wrong method + verb in URL\nGET  /api/user_list            ← Inconsistent naming\n```',
        analogy:
          'Resources are like library books. Each book has a unique call number (URL). You can check it out (GET), donate a new one (POST), replace it (PUT), or remove it (DELETE). The library card system (HTTP) is the same for everyone.',
        keyTakeaway:
          'REST APIs organize around resources (nouns, not verbs). Use HTTP methods for actions, plural nouns in URLs, and keep everything consistent.',
      },
      {
        title: 'Status Codes — Speaking the Same Language',
        content:
          'Status codes tell the client what happened. Don\'t just return 200 for everything.\n\n**2xx — Success:**\n- `200 OK` — Request succeeded (general purpose)\n- `201 Created` — New resource created (after POST)\n- `204 No Content` — Success but nothing to return (after DELETE)\n\n**4xx — Client Error:**\n- `400 Bad Request` — Invalid input (missing field, wrong format)\n- `401 Unauthorized` — Not authenticated (no/invalid token)\n- `403 Forbidden` — Authenticated but lacks permission\n- `404 Not Found` — Resource doesn\'t exist\n- `409 Conflict` — Conflicts with current state (duplicate username)\n- `422 Unprocessable Entity` — Valid format but invalid data (email already taken)\n- `429 Too Many Requests` — Rate limited\n\n**5xx — Server Error:**\n- `500 Internal Server Error` — Bug in the server\n- `502 Bad Gateway` — Upstream service failed\n- `503 Service Unavailable` — Server is down or overloaded',
        analogy:
          'Status codes are like the waiter\'s responses: "Here\'s your food" (200), "We don\'t have that" (404), "You\'re not allowed in the VIP section" (403), "The kitchen is on fire" (500).',
        visual: 'table',
        visualData: {
          headers: ['Code', 'Meaning', 'When to Use'],
          rows: [
            ['200', 'OK', 'Successful GET, PUT, PATCH'],
            ['201', 'Created', 'Successful POST'],
            ['204', 'No Content', 'Successful DELETE'],
            ['400', 'Bad Request', 'Invalid input'],
            ['401', 'Unauthorized', 'Missing/invalid auth'],
            ['403', 'Forbidden', 'No permission'],
            ['404', 'Not Found', 'Resource doesn\'t exist'],
            ['429', 'Too Many Requests', 'Rate limited'],
            ['500', 'Internal Server Error', 'Server bug'],
          ],
        },
        keyTakeaway:
          'Use the right status code for every response. 2xx = success, 4xx = client did something wrong, 5xx = server did something wrong.',
      },
      {
        title: 'Complete CRUD API Example',
        content:
          'Let\'s design a complete API for a task management app. This covers all CRUD operations with proper structure.',
        code: [
          {
            language: 'javascript',
            label: 'Task API — Full CRUD (Express.js)',
            code: `import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
});

const UpdateTaskSchema = CreateTaskSchema.partial();

// LIST — GET /api/v1/tasks?status=pending&page=1&limit=20
router.get('/tasks', authenticate, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const tasks = await taskService.list({
    userId: req.user.id,
    status,
    page: Number(page),
    limit: Math.min(Number(limit), 100), // Cap at 100
  });

  res.json({
    data: tasks.items,
    pagination: {
      page: tasks.page,
      limit: tasks.limit,
      total: tasks.total,
      totalPages: Math.ceil(tasks.total / tasks.limit),
    },
  });
});

// READ — GET /api/v1/tasks/:id
router.get('/tasks/:id', authenticate, async (req, res) => {
  const task = await taskService.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  res.json({ data: task });
});

// CREATE — POST /api/v1/tasks
router.post('/tasks', authenticate, async (req, res) => {
  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues });
  }
  const task = await taskService.create({
    ...parsed.data,
    userId: req.user.id,
  });
  res.status(201).json({ data: task });
});

// UPDATE — PATCH /api/v1/tasks/:id
router.patch('/tasks/:id', authenticate, async (req, res) => {
  const parsed = UpdateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues });
  }
  const task = await taskService.update(req.params.id, req.user.id, parsed.data);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ data: task });
});

// DELETE — DELETE /api/v1/tasks/:id
router.delete('/tasks/:id', authenticate, async (req, res) => {
  const deleted = await taskService.delete(req.params.id, req.user.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});`,
          },
        ],
        keyTakeaway:
          'A well-designed CRUD API uses proper HTTP methods, input validation, pagination, consistent JSON response format, and appropriate status codes.',
      },
      {
        title: 'API Versioning',
        content:
          'APIs evolve. You\'ll add fields, change formats, deprecate endpoints. But existing clients depend on the current API. If you change it, their apps break.\n\n**Solution: Version your API.**\n\n**URL Versioning (most common)**\n```\n/api/v1/users/123\n/api/v2/users/123\n```\nSimple, visible, easy to understand. This is what most companies use.\n\n**Header Versioning**\n```\nGET /api/users/123\nAccept: application/vnd.myapp.v2+json\n```\nClean URLs but harder to test and debug.\n\n**Query Parameter Versioning**\n```\n/api/users/123?version=2\n```\nEasy to switch but clutters the URL.\n\n**Best Practices:**\n- Use URL versioning for simplicity\n- Support the previous version for at least 6-12 months after launching a new one\n- Communicate deprecation schedules clearly\n- Document what changed between versions\n- Don\'t create a new version for every change — only for breaking changes',
        analogy:
          'API versioning is like a restaurant keeping the old menu available while introducing a new one. Regulars can still order their favorites (v1) while new customers get the updated menu (v2).',
        keyTakeaway:
          'Version your APIs with URL versioning (/api/v1/...). Only create new versions for breaking changes. Support old versions for a deprecation period.',
      },
      {
        title: 'Pagination, Filtering, and Error Responses',
        content:
          'Three patterns every API needs:\n\n**Pagination** — Don\'t return 10,000 records in one response.\n```\nGET /api/posts?page=2&limit=20\nGET /api/posts?cursor=eyJpZCI6MTAwfQ  (cursor-based, better for large datasets)\n```\n\n**Filtering and Sorting**\n```\nGET /api/posts?status=published&author=123&sort=-createdAt\n```\nThe `-` prefix means descending. Keep filter names consistent with your data model.\n\n**Error Responses** — Use a consistent format:\n```json\n{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "Invalid input",\n    "details": [\n      { "field": "email", "message": "Must be a valid email address" }\n    ]\n  }\n}\n```\n\nDon\'t just return `{ "error": "Something went wrong" }`. Include:\n- A machine-readable error code\n- A human-readable message\n- Field-level details for validation errors',
        code: [
          {
            language: 'javascript',
            label: 'Cursor-based Pagination',
            code: `// More efficient than page-based for large datasets
router.get('/posts', async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const parsedLimit = Math.min(Number(limit), 100);

  let query = 'SELECT * FROM posts WHERE published = true';
  const params = [];

  if (cursor) {
    // Decode cursor (base64-encoded JSON: {"id": 100, "createdAt": "..."})
    const { id, createdAt } = JSON.parse(
      Buffer.from(cursor, 'base64').toString()
    );
    query += ' AND (created_at, id) < ($1, $2)';
    params.push(createdAt, id);
  }

  query += ' ORDER BY created_at DESC, id DESC LIMIT $' + (params.length + 1);
  params.push(parsedLimit + 1); // Fetch one extra to check if more exist

  const { rows } = await db.query(query, params);
  const hasMore = rows.length > parsedLimit;
  const items = rows.slice(0, parsedLimit);

  const nextCursor = hasMore
    ? Buffer.from(JSON.stringify({
        id: items[items.length - 1].id,
        createdAt: items[items.length - 1].created_at,
      })).toString('base64')
    : null;

  res.json({ data: items, nextCursor });
});`,
          },
        ],
        keyTakeaway:
          'Every API needs pagination (cursor-based for large datasets), filtering/sorting, and consistent error responses with machine-readable codes.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using verbs in URLs (GET /api/getUser, POST /api/createUser)',
        explanation:
          'HTTP methods already express the action. The URL should be the resource (noun). Use GET /api/users, POST /api/users instead.',
      },
      {
        mistake: 'Returning 200 for errors',
        explanation:
          'If a request fails, return the appropriate 4xx or 5xx code. Returning 200 with an error in the body confuses clients, monitoring tools, and CDNs.',
      },
      {
        mistake: 'Not paginating list endpoints',
        explanation:
          'Returning all 100,000 records at once is slow, wastes bandwidth, and can crash clients. Always paginate, even if the dataset seems small — it will grow.',
      },
      {
        mistake: 'Breaking changes without versioning',
        explanation:
          'Removing a field or changing a response format breaks existing clients. Use API versioning for breaking changes and maintain backward compatibility.',
      },
    ],
    practiceQuestions: [
      'Design a REST API for a blog platform with posts, comments, and likes. Include URLs, methods, and response shapes.',
      'What is the difference between PUT and PATCH? When would you use each?',
      'Explain cursor-based pagination vs offset-based pagination. Which is better for large datasets and why?',
      'A client sends a POST request with an invalid email field. What status code do you return and what does the response body look like?',
      'How would you design an API endpoint that returns a user along with their 5 most recent posts?',
    ],
  },

  // ─────────────────────────────────────────────
  // 9. RATE LIMITING
  // ─────────────────────────────────────────────
  'rate-limiting': {
    steps: [
      {
        title: 'The Nightclub Bouncer',
        content:
          'A popular nightclub has a capacity limit. The bouncer at the door counts: if 200 people are inside, nobody else gets in until someone leaves. This prevents overcrowding and keeps everyone safe.\n\n**Rate limiting** does the same for your API. It restricts how many requests a client can make in a given time window. Without it:\n\n- **Abuse**: A malicious user floods your API with 100,000 requests/second, bringing it down for everyone.\n- **Cost**: Each API call might hit your database, cache, or third-party services — unlimited calls mean unlimited costs.\n- **Fairness**: One heavy user shouldn\'t degrade the experience for everyone else.\n\n**Common rate limits:**\n- 100 requests per minute per user (general API)\n- 10 login attempts per 15 minutes per IP (auth)\n- 5 password reset emails per hour (abuse prevention)\n- 1,000 requests per minute per API key (B2B)',
        analogy:
          'The bouncer doesn\'t let everyone rush in at once. "Sorry, you can only enter 100 times per hour. Come back in 5 minutes." This keeps the club (your server) from getting overwhelmed.',
        keyTakeaway:
          'Rate limiting protects your API from abuse, controls costs, and ensures fairness. Every production API needs it.',
      },
      {
        title: 'Rate Limiting Algorithms',
        content:
          'There are several algorithms for implementing rate limits:\n\n**Token Bucket**\nImagine a bucket that holds 10 tokens. Each request costs 1 token. Tokens are added at a fixed rate (e.g., 1 per second). If the bucket is empty, the request is rejected. The bucket can fill up to a max (burst capacity).\n- Allows bursts up to bucket size\n- Simple and widely used (AWS, Stripe)\n\n**Fixed Window**\nCount requests in fixed time windows (e.g., per minute: 0:00-1:00, 1:00-2:00). If you hit 100 in the current window, reject until the next window.\n- Simple to implement\n- Problem: bursts at window boundaries (99 at 0:59, 99 at 1:00 = 198 in 2 seconds)\n\n**Sliding Window Log**\nTrack the timestamp of each request. Count requests in the last N seconds. Precise but memory-intensive.\n\n**Sliding Window Counter**\nCombines fixed window with a weighted overlap. Takes the count from the previous window and the current window, weighted by how far into the current window we are.\n- Good balance of accuracy and efficiency\n- Used by most production systems',
        analogy:
          'Token Bucket: A parking meter that refills with coins over time. When it\'s empty, you can\'t park. Fixed Window: A buffet that resets every hour — eat all you want, but once the hour\'s food is gone, wait for the next batch.',
        visual: 'comparison',
        visualData: {
          items: [
            { label: 'Token Bucket', pros: 'Allows bursts, smooth', cons: 'Slightly complex' },
            { label: 'Fixed Window', pros: 'Simple', cons: 'Burst at boundary' },
            { label: 'Sliding Window Log', pros: 'Most accurate', cons: 'Memory intensive' },
            { label: 'Sliding Window Counter', pros: 'Good balance', cons: 'Approximate' },
          ],
        },
        keyTakeaway:
          'Token Bucket is best for APIs that need burst tolerance. Sliding Window Counter is best for general-purpose rate limiting. Fixed Window is simplest but has edge-case bursts.',
      },
      {
        title: 'Implementing a Rate Limiter',
        content:
          'Here is a practical implementation of a sliding window rate limiter using Redis. This is production-grade and handles distributed systems (multiple servers).',
        code: [
          {
            language: 'javascript',
            label: 'Sliding Window Rate Limiter (Redis + Express)',
            code: `import Redis from 'ioredis';
const redis = new Redis();

interface RateLimitConfig {
  windowMs: number;    // Window size in milliseconds
  maxRequests: number; // Max requests per window
}

async function isRateLimited(
  key: string,
  config: RateLimitConfig
): Promise<{ limited: boolean; remaining: number; resetMs: number }> {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Use a Redis sorted set: score = timestamp, member = unique request ID
  const multi = redis.multi();
  // Remove entries outside the window
  multi.zremrangebyscore(key, 0, windowStart);
  // Count entries in the window
  multi.zcard(key);
  // Add current request
  multi.zadd(key, now.toString(), \`\${now}:\${Math.random()}\`);
  // Set expiry on the key
  multi.pexpire(key, config.windowMs);

  const results = await multi.exec();
  const requestCount = results![1][1] as number;

  const limited = requestCount >= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - requestCount - 1);

  return { limited, remaining, resetMs: config.windowMs };
}

// Express middleware
function rateLimiter(config: RateLimitConfig) {
  return async (req, res, next) => {
    const key = \`rate:\${req.user?.id || req.ip}\`;
    const result = await isRateLimited(key, config);

    // Set standard rate limit headers
    res.set({
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(
        Date.now() + result.resetMs
      ).toISOString(),
    });

    if (result.limited) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(result.resetMs / 1000),
      });
    }

    next();
  };
}

// Usage
app.use('/api', rateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 100,      // 100 requests per minute
}));

// Stricter limit for auth endpoints
app.use('/api/auth/login', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,           // 10 attempts per 15 min
}));`,
          },
        ],
        keyTakeaway:
          'Use Redis sorted sets for distributed rate limiting. Always return rate limit headers (X-RateLimit-Limit, Remaining, Reset) so clients know their status.',
      },
      {
        title: 'Rate Limiting Strategies and Headers',
        content:
          'How do you identify who to rate limit? Several strategies:\n\n**By IP Address**\nSimplest. But users behind a NAT/corporate network share an IP. Also easy to bypass with proxies.\n\n**By User/API Key**\nMore accurate. Each authenticated user or API key gets their own limit. Doesn\'t help with unauthenticated endpoints.\n\n**By Endpoint**\nDifferent limits for different endpoints. Login: 10/min. List posts: 100/min. Send message: 30/min.\n\n**Combined**\nUse IP for unauthenticated requests and user ID for authenticated ones. Apply endpoint-specific limits on top.\n\n**Standard Response Headers:**\n```\nX-RateLimit-Limit: 100          (max requests per window)\nX-RateLimit-Remaining: 42       (requests left)\nX-RateLimit-Reset: 1679589600   (when the window resets)\nRetry-After: 30                  (seconds to wait, on 429)\n```\n\nAlways return these headers. Good API clients use them to self-throttle instead of hitting limits.',
        analogy:
          'Some nightclubs limit by person (VIP card), some by group size, some have different rules for the dance floor vs the bar area. The best clubs combine multiple strategies.',
        keyTakeaway:
          'Rate limit by user/API key when possible, fall back to IP for unauthenticated requests. Use different limits for different endpoints. Always include rate limit headers.',
      },
      {
        title: 'When and Where to Rate Limit',
        content:
          'Rate limiting can happen at several layers:\n\n**API Gateway / Load Balancer**\nBest place for global rate limits. Stops bad traffic before it hits your servers. AWS API Gateway, Nginx, Cloudflare all support this.\n\n**Application Layer**\nFor per-user, per-endpoint limits. More granular control. Use middleware (like the Redis example above).\n\n**Database Layer**\nConnection pooling and query timeouts act as implicit rate limits on database access.\n\n**Important Considerations:**\n- **Distributed Systems**: If you have 5 servers and each allows 100 req/min, a user gets 500/min total unless you use centralized counting (Redis).\n- **Graceful Degradation**: Instead of hard rejection, consider degraded service: return cached/stale data, or queue the request.\n- **Exemptions**: Internal services, health checks, and webhook handlers might need exemptions.\n- **Communication**: When rate limiting kicks in, tell the user when they can retry (Retry-After header).',
        analogy:
          'Rate limiting at the gateway is like a bouncer at the front door. Application-level limiting is like VIP sections inside the club. Both work together for complete protection.',
        keyTakeaway:
          'Rate limit at the gateway for global protection and at the application layer for granular control. Use centralized storage (Redis) for accurate counts across distributed servers.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Only rate limiting by IP address',
        explanation:
          'Many users share IPs (corporate networks, mobile carriers). Rate limiting solely by IP unfairly penalizes legitimate users. Combine with user ID or API key.',
      },
      {
        mistake: 'Not returning rate limit headers',
        explanation:
          'Without headers, clients have no idea they\'re approaching the limit. They can\'t self-throttle and just keep hitting 429s. Always include X-RateLimit-* headers.',
      },
      {
        mistake: 'Per-server rate limits in a distributed system',
        explanation:
          'If each of your 10 servers independently tracks 100 requests/min, a user can actually make 1,000/min by hitting different servers. Use centralized counting with Redis.',
      },
      {
        mistake: 'Applying the same rate limit to all endpoints',
        explanation:
          'A "get user profile" endpoint and a "send money" endpoint need very different limits. Use stricter limits for sensitive operations.',
      },
    ],
    practiceQuestions: [
      'Design a rate limiter for an API that needs to allow 100 requests per minute per user, with burst tolerance of 20.',
      'Explain the difference between token bucket and sliding window. Which would you choose for a payment API?',
      'Your API is distributed across 8 servers. How do you ensure rate limiting is consistent across all servers?',
      'A corporate client with 5,000 employees behind one IP is getting rate limited. How do you handle this?',
    ],
  },

  // ─────────────────────────────────────────────
  // 10. CONSISTENT HASHING
  // ─────────────────────────────────────────────
  'consistent-hashing': {
    steps: [
      {
        title: 'The Problem with Regular Hashing',
        content:
          'Imagine you have 4 cache servers and you decide which server holds each piece of data using: `server = hash(key) % 4`\n\nWith 4 servers:\n- "user:1" → hash = 17 → 17 % 4 = 1 → Server 1\n- "user:2" → hash = 22 → 22 % 4 = 2 → Server 2\n- "user:3" → hash = 33 → 33 % 4 = 1 → Server 1\n\nThis works great! Until... Server 2 crashes. Now you have 3 servers and `% 3` changes EVERYTHING:\n- "user:1" → 17 % 3 = 2 → Server 2 (was Server 1!)\n- "user:2" → 22 % 3 = 1 → Server 1 (was Server 2!)\n- "user:3" → 33 % 3 = 0 → Server 0 (was Server 1!)\n\nAlmost every key maps to a different server. All cached data is in the wrong place. Every request is a cache miss. Your database gets slammed.\n\nWith N servers, adding or removing one server invalidates ~N/(N+1) of all keys. That\'s catastrophic at scale.',
        analogy:
          'Imagine a school assigns students to classrooms by student_id % num_classrooms. If one classroom closes, almost every student gets reassigned to a different room. Total chaos.',
        keyTakeaway:
          'Simple modular hashing (hash % N) breaks when servers are added or removed — almost all keys remap. We need something better.',
      },
      {
        title: 'The Ring (Hash Ring)',
        content:
          'Consistent hashing solves this by imagining a **ring** (circle) with values 0 to 2^32.\n\n**Setup:**\n1. Hash each server name and place it on the ring. Server A might land at position 1000, Server B at position 4000, etc.\n2. When you need to store data, hash the key and find its position on the ring.\n3. Walk clockwise from that position until you hit the first server. That server owns the key.\n\n**What happens when a server is removed?**\nOnly the keys between the removed server and the previous server (counter-clockwise) need to move to the next server clockwise. Everything else stays put!\n\n**What happens when a server is added?**\nThe new server takes responsibility for keys between itself and the previous server. Only those keys move.\n\n**Key insight:** With N servers, adding or removing one only remaps ~1/N of the keys (instead of nearly all of them with modular hashing).',
        analogy:
          'Imagine musical chairs arranged in a circle. Each chair represents a server. When the music stops (you hash a key), the person (data) sits in the nearest chair clockwise. If a chair is removed, only the person in that chair needs to find a new seat — everyone else stays put.',
        visual: 'diagram',
        visualData: {
          type: 'ring',
          label: 'Hash Ring with 4 Servers',
          description:
            'Ring from 0 to 2^32. Server A at ~1000, Server B at ~4000, Server C at ~7000, Server D at ~10000. Keys walk clockwise to find their server.',
        },
        keyTakeaway:
          'Consistent hashing uses a ring where keys walk clockwise to find their server. When a server is added/removed, only ~1/N of keys are remapped.',
      },
      {
        title: 'Virtual Nodes — Solving Uneven Distribution',
        content:
          'With just 4 physical servers on the ring, the distribution can be uneven. Server A might own 50% of the ring while Server D owns only 10%.\n\n**Virtual Nodes (VNodes)** fix this. Instead of placing each server once on the ring, place it multiple times at different positions.\n\nServer A gets: VNode_A_1 at position 500, VNode_A_2 at position 3000, VNode_A_3 at position 8500...\n\nWith 100-200 virtual nodes per server, the load distribution becomes very even.\n\n**Bonus:** When a server is removed, its load is distributed among multiple other servers (because its virtual nodes are spread around the ring), rather than one server absorbing all the load.\n\n**Bonus 2:** Servers with more capacity can have more virtual nodes, naturally taking more traffic.',
        code: [
          {
            language: 'javascript',
            label: 'Consistent Hashing with Virtual Nodes',
            code: `import crypto from 'crypto';

class ConsistentHash {
  private ring: Map<number, string> = new Map();
  private sortedKeys: number[] = [];
  private virtualNodes: number;

  constructor(virtualNodes = 150) {
    this.virtualNodes = virtualNodes;
  }

  private hash(key: string): number {
    const md5 = crypto.createHash('md5').update(key).digest('hex');
    return parseInt(md5.slice(0, 8), 16);
  }

  addServer(server: string) {
    for (let i = 0; i < this.virtualNodes; i++) {
      const virtualKey = \`\${server}:vnode\${i}\`;
      const position = this.hash(virtualKey);
      this.ring.set(position, server);
      this.sortedKeys.push(position);
    }
    this.sortedKeys.sort((a, b) => a - b);
  }

  removeServer(server: string) {
    for (let i = 0; i < this.virtualNodes; i++) {
      const virtualKey = \`\${server}:vnode\${i}\`;
      const position = this.hash(virtualKey);
      this.ring.delete(position);
    }
    this.sortedKeys = this.sortedKeys.filter(k => this.ring.has(k));
  }

  getServer(key: string): string {
    if (this.ring.size === 0) throw new Error('No servers');
    const position = this.hash(key);

    // Walk clockwise: find the first server position >= key position
    for (const serverPos of this.sortedKeys) {
      if (serverPos >= position) {
        return this.ring.get(serverPos)!;
      }
    }
    // Wrap around to the first server
    return this.ring.get(this.sortedKeys[0])!;
  }
}

// Usage
const ch = new ConsistentHash(150);
ch.addServer('cache-server-1');
ch.addServer('cache-server-2');
ch.addServer('cache-server-3');

const server = ch.getServer('user:12345');
console.log(\`Key "user:12345" maps to: \${server}\`);

// Remove a server — only ~1/3 of keys remap
ch.removeServer('cache-server-2');`,
          },
        ],
        keyTakeaway:
          'Virtual nodes spread each server across many positions on the ring, ensuring even load distribution. Use 100-200 virtual nodes per physical server.',
      },
      {
        title: 'Real-World Uses of Consistent Hashing',
        content:
          'Consistent hashing is everywhere in distributed systems:\n\n**Distributed Caching (Memcached, Redis Cluster)**\nDetermine which cache node holds each key. When a node fails, only its keys need to be re-cached.\n\n**Load Balancing**\nSome load balancers use consistent hashing to route requests. The same client always hits the same server (useful for connection-based protocols).\n\n**Distributed Databases (Cassandra, DynamoDB)**\nDetermine which node stores each piece of data. Cassandra\'s "partitioner" is a consistent hash ring.\n\n**CDNs**\nDetermine which edge server caches each piece of content.\n\n**Amazon DynamoDB** uses consistent hashing with virtual nodes to distribute data across storage nodes. When capacity changes, data is smoothly rebalanced.\n\n**Discord** uses consistent hashing to distribute chat messages across their message processing servers.',
        analogy:
          'Consistent hashing is like a well-organized delivery route. When one delivery person calls in sick, only their small section of the route is reassigned — the rest of the team keeps their assignments.',
        keyTakeaway:
          'Consistent hashing is used in caches, databases, load balancers, and CDNs. It enables smooth scaling by minimizing data movement when servers change.',
      },
      {
        title: 'Trade-offs and Alternatives',
        content:
          '**Advantages of Consistent Hashing:**\n- Minimal key remapping when servers change (~K/N keys move)\n- Scales well to many servers\n- Virtual nodes enable weighted distribution\n\n**Disadvantages:**\n- More complex than simple modular hashing\n- Hash function quality matters (poor hashing = uneven distribution)\n- Doesn\'t handle "hot keys" (one key getting massive traffic)\n\n**Alternatives:**\n- **Rendezvous Hashing (HRW)**: For each key, hash it with every server name and pick the highest hash. Also achieves minimal remapping. Simpler to understand but O(N) lookup per key.\n- **Jump Consistent Hashing**: Google\'s algorithm. O(log N) time, zero memory. But doesn\'t support weighted servers or arbitrary server IDs.\n- **Range Partitioning**: Assign key ranges to servers (like sharding). Used by HBase and CockroachDB. Better for range queries.\n\nFor most interview contexts, consistent hashing with virtual nodes is the answer. It\'s the most widely used and asked about.',
        keyTakeaway:
          'Consistent hashing is the go-to for distributed key mapping. Know the ring concept, virtual nodes, and why it\'s better than modular hashing.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using modular hashing (hash % N) for distributed caching',
        explanation:
          'Adding or removing a server remaps almost all keys, causing a cache stampede. Use consistent hashing to minimize remapping.',
      },
      {
        mistake: 'Not using virtual nodes',
        explanation:
          'Without virtual nodes, a small number of servers creates uneven distribution on the ring. One server might handle 3x more traffic than another.',
      },
      {
        mistake: 'Ignoring hot key issues',
        explanation:
          'Consistent hashing distributes keys, not load. If one key gets 50% of all traffic (like a celebrity post), the server holding it is overloaded regardless. Use caching or key splitting for hot keys.',
      },
    ],
    practiceQuestions: [
      'You have 5 cache servers and one fails. Compare what happens with modular hashing vs consistent hashing.',
      'Explain virtual nodes and why they matter for even distribution.',
      'How does Cassandra use consistent hashing for data distribution?',
      'Implement a simple consistent hash ring that supports addServer, removeServer, and getServer.',
      'What is the "hot key" problem and how can consistent hashing be combined with other techniques to handle it?',
    ],
  },

  // ─────────────────────────────────────────────
  // 11. MICROSERVICES VS MONOLITH
  // ─────────────────────────────────────────────
  'microservices-vs-monolith': {
    steps: [
      {
        title: 'Single Restaurant vs Food Court',
        content:
          'Imagine two approaches to feeding a large crowd:\n\n**Monolith = One Big Restaurant**\nOne kitchen handles everything: appetizers, entrees, desserts, drinks. One menu, one team, one building. Simple to manage when you\'re small. But when you need to scale, you can only build a bigger restaurant.\n\n**Microservices = A Food Court**\nEach stall specializes: one does pizza, one does sushi, one does tacos. They operate independently with their own kitchens, staff, and ingredients. The pizza stall can upgrade its oven without affecting the sushi place.\n\nIn software:\n- **Monolith**: One codebase, one database, one deployment. All features live in the same application.\n- **Microservices**: Many small, independent services. Each owns its data and can be deployed, scaled, and maintained separately.',
        analogy:
          'A monolith is like a Swiss Army knife — everything in one tool. Microservices are like a toolbox — specialized tools for each job. The Swiss Army knife is convenient for a hike, but a carpenter needs the toolbox.',
        keyTakeaway:
          'A monolith is a single application with all features together. Microservices split features into independent services. Neither is universally better — it depends on your context.',
      },
      {
        title: 'Monolith — Pros and Cons',
        content:
          '**Advantages of a Monolith:**\n- **Simple to develop** — One codebase, one IDE, run everything locally.\n- **Simple to deploy** — One artifact to build and ship.\n- **Simple to test** — End-to-end tests in one place.\n- **Simple to debug** — Stack traces span the entire application.\n- **No network overhead** — Function calls are in-process (nanoseconds), not network calls (milliseconds).\n- **Data consistency** — One database, easy transactions.\n\n**Disadvantages:**\n- **Scaling is all-or-nothing** — If the search feature needs 10x servers but checkout is fine, you still scale the entire monolith.\n- **Deployment risk** — A bug in one feature can bring down everything.\n- **Technology lock-in** — The whole app must use the same language/framework.\n- **Team coordination** — Large teams stepping on each other\'s toes in the same codebase.\n- **Slow builds** — As the codebase grows, build and test times increase.\n\n**The truth:** Most successful companies started as a monolith. Shopify, GitHub, and Stack Overflow still run monoliths. A well-structured monolith is perfectly fine for most applications.',
        analogy:
          'A monolith is like living in a studio apartment. Everything is right there — kitchen, bedroom, office. Quick and simple. But when you have a family of six, the studio gets cramped.',
        keyTakeaway:
          'Monoliths are simple, fast to develop, and perfect for startups and small teams. Don\'t switch to microservices unless you have a compelling reason.',
      },
      {
        title: 'Microservices — Pros and Cons',
        content:
          '**Advantages of Microservices:**\n- **Independent scaling** — Scale only the services that need it (e.g., scale the image processing service without touching auth).\n- **Independent deployment** — Deploy the payment service without risking the chat feature.\n- **Technology freedom** — Write each service in the best language for the job.\n- **Team autonomy** — Small teams own individual services end-to-end.\n- **Fault isolation** — If the recommendation service crashes, the rest of the app keeps working.\n\n**Disadvantages:**\n- **Distributed system complexity** — Network failures, timeouts, retries, consistency challenges.\n- **Data management** — Each service has its own database. Cross-service queries are hard.\n- **Operational overhead** — You need: service discovery, load balancing per service, distributed tracing, centralized logging, health monitoring.\n- **Testing complexity** — Integration testing across services is much harder.\n- **Latency** — Inter-service network calls add milliseconds to every operation.\n\n**The honest truth:** Microservices solve organizational problems (big teams, many features, independent release cycles), not technical ones. If you\'re a team of 5, microservices will slow you down.',
        analogy:
          'Microservices are like moving into a house with separate rooms. Everyone has privacy and can decorate independently. But now you need hallways (networking), locks on doors (auth between services), and someone to coordinate dinner (orchestration).',
        visual: 'comparison',
        visualData: {
          items: [
            { label: 'Monolith', pros: 'Simple, fast dev, easy debug', cons: 'Scales all-or-nothing, risky deploys' },
            { label: 'Microservices', pros: 'Independent scaling/deploys', cons: 'Complex ops, hard to debug' },
          ],
        },
        keyTakeaway:
          'Microservices shine when you need independent scaling, deployment, and team autonomy. But they add enormous operational complexity. Choose them for organizational reasons, not because they\'re trendy.',
      },
      {
        title: 'Service Communication',
        content:
          'In a microservices architecture, services need to talk to each other. Two main styles:\n\n**Synchronous (Request-Response)**\n- HTTP/REST: Simple, widely understood. `OrderService` calls `PaymentService` via REST API.\n- gRPC: Faster than REST (binary protocol, HTTP/2). Great for internal service-to-service calls.\n\n**Asynchronous (Event-Driven)**\n- Message Queues (RabbitMQ, Kafka): `OrderService` publishes an "OrderPlaced" event. `PaymentService` and `InventoryService` subscribe and react independently.\n- Much more resilient — if a service is down, messages wait in the queue.\n\n**Service Discovery:**\nHow does Service A find Service B? In a dynamic environment (containers, auto-scaling), IP addresses change constantly.\n- **DNS-based**: Services register with a DNS server. (Simple)\n- **Registry-based**: A central registry (Consul, Eureka) tracks all service instances.\n- **Kubernetes**: Built-in service discovery via DNS and service objects.\n\n**API Gateway:**\nA single entry point for external clients. Routes requests to the appropriate internal service. Handles auth, rate limiting, SSL termination.',
        analogy:
          'Synchronous communication is like a phone call — you wait for an answer. Asynchronous is like email — you send it and go about your day, the reply comes later.',
        keyTakeaway:
          'Use synchronous REST/gRPC for real-time responses. Use async message queues for decoupled, resilient communication. An API gateway provides a single entry point.',
      },
      {
        title: 'Docker Compose Example — Microservices in Practice',
        content:
          'Here\'s what a small microservices setup looks like with Docker Compose. Each service is its own container with its own database.',
        code: [
          {
            language: 'yaml',
            label: 'docker-compose.yml — Microservices Stack',
            code: `version: '3.8'

services:
  # API Gateway — single entry point
  api-gateway:
    build: ./gateway
    ports:
      - "8080:8080"
    depends_on:
      - user-service
      - order-service
      - notification-service
    environment:
      - USER_SERVICE_URL=http://user-service:3001
      - ORDER_SERVICE_URL=http://order-service:3002
      - NOTIFICATION_SERVICE_URL=http://notification-service:3003

  # User Service — handles auth, profiles
  user-service:
    build: ./services/user
    ports:
      - "3001:3001"
    depends_on:
      - user-db
    environment:
      - DATABASE_URL=postgres://user-db:5432/users

  user-db:
    image: postgres:16
    environment:
      - POSTGRES_DB=users

  # Order Service — handles orders, payments
  order-service:
    build: ./services/order
    ports:
      - "3002:3002"
    depends_on:
      - order-db
      - rabbitmq
    environment:
      - DATABASE_URL=postgres://order-db:5432/orders
      - RABBITMQ_URL=amqp://rabbitmq:5672

  order-db:
    image: postgres:16
    environment:
      - POSTGRES_DB=orders

  # Notification Service — sends emails, push notifications
  notification-service:
    build: ./services/notification
    ports:
      - "3003:3003"
    depends_on:
      - rabbitmq
    environment:
      - RABBITMQ_URL=amqp://rabbitmq:5672

  # Message Broker
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "15672:15672"  # Management UI`,
          },
        ],
        keyTakeaway:
          'Each microservice has its own codebase, database, and container. They communicate via HTTP or message queues. Docker Compose makes local development possible.',
      },
      {
        title: 'When to Choose Which',
        content:
          '**Start with a Monolith when:**\n- You\'re a startup or small team (< 10 engineers)\n- You\'re building an MVP and need speed\n- You\'re unsure about service boundaries\n- Your domain is not well-understood yet\n\n**Move to Microservices when:**\n- Multiple teams need to deploy independently\n- Different features have vastly different scaling needs\n- Your monolith\'s deploy cycle is too slow (hours, not minutes)\n- You need fault isolation (one feature shouldn\'t crash everything)\n\n**The Modular Monolith Compromise:**\nA well-structured monolith with clear module boundaries. Each module has defined interfaces, its own database schema, and could be extracted into a service later.\n\nThis gives you monolith simplicity now with a clear migration path to microservices later. Many experts recommend this as the best starting point.\n\n**The golden rule:** Don\'t choose microservices because Netflix uses them. Netflix has thousands of engineers. You probably don\'t.',
        analogy:
          'Don\'t buy a 10-bedroom house for a family of 2 just because you might have kids someday. Buy the right-sized house now and renovate (or move) when you outgrow it.',
        keyTakeaway:
          'Start monolith, structure it well (modular monolith), and extract microservices only when you have specific scaling or organizational needs.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Starting with microservices for a new project',
        explanation:
          'You don\'t yet know where the service boundaries should be. You\'ll likely draw them wrong and spend months refactoring. Start monolith, learn your domain, then split.',
      },
      {
        mistake: 'Creating a "distributed monolith"',
        explanation:
          'If all your microservices must be deployed together and can\'t function independently, you have the complexity of microservices with none of the benefits. Services must be truly independent.',
      },
      {
        mistake: 'Sharing databases between microservices',
        explanation:
          'If Service A and Service B read/write the same database table, they\'re coupled. A schema change in one breaks the other. Each service should own its data.',
      },
      {
        mistake: 'Not investing in observability',
        explanation:
          'With microservices, a request touches multiple services. Without distributed tracing, centralized logging, and monitoring, debugging production issues becomes nearly impossible.',
      },
    ],
    practiceQuestions: [
      'Your 5-person startup is building an e-commerce app. Would you use microservices? Why or why not?',
      'What is a "distributed monolith" and why is it the worst of both worlds?',
      'Design the service boundaries for a ride-sharing app (Uber-like). What services would you have?',
      'How would you handle a transaction that spans two microservices (e.g., placing an order deducts inventory AND charges payment)?',
    ],
  },

  // ─────────────────────────────────────────────
  // 12. DESIGN: URL SHORTENER
  // ─────────────────────────────────────────────
  'design-url-shortener': {
    steps: [
      {
        title: 'Step 1: Requirements',
        content:
          'Let\'s design a URL shortening service like bit.ly. First, we clarify requirements.\n\n**Functional Requirements:**\n- Given a long URL, generate a short URL (e.g., `short.ly/abc123`)\n- When users visit the short URL, redirect to the original long URL\n- Optional: custom short aliases (e.g., `short.ly/my-blog`)\n- Optional: link analytics (click count, referrers, geography)\n- Links expire after a configurable duration (default: 5 years)\n\n**Non-Functional Requirements:**\n- Low latency: redirects should be < 50ms\n- High availability: the redirect service must be always up\n- Short URLs should not be guessable (security)\n\n**Capacity Estimation:**\n- 100M new URLs created per month\n- Read:Write ratio = 100:1 (10B redirects per month)\n- Write QPS: 100M / (30 * 86400) ≈ 40 URLs/sec\n- Read QPS: 40 * 100 = 4,000 redirects/sec (peak: 12,000/sec)\n- Storage per URL: ~500 bytes (short code + long URL + metadata)\n- Storage per year: 100M * 12 * 500 bytes ≈ 600 GB/year',
        analogy:
          'Think of it as a coat check: you hand in your long coat (long URL) and get a small ticket (short code). Later, you present the ticket and get your coat back (redirect).',
        keyTakeaway:
          'Always start with requirements and estimation. This URL shortener needs low-latency reads (redirects) and moderate write throughput (~40/sec).',
      },
      {
        title: 'Step 2: API Design',
        content:
          'Define the interface before the internals.',
        code: [
          {
            language: 'text',
            label: 'URL Shortener API',
            code: `POST /api/v1/urls
Body: { "longUrl": "https://example.com/very/long/path", "customAlias": "my-link", "expiresAt": "2027-01-01" }
Response: { "shortUrl": "https://short.ly/abc123", "longUrl": "...", "expiresAt": "..." }
Headers: Authorization: Bearer <token>

GET /{shortCode}
Response: 301 Redirect to the long URL
Headers: Location: https://example.com/very/long/path

GET /api/v1/urls/{shortCode}/stats
Response: { "clicks": 15234, "createdAt": "...", "topCountries": [...], "topReferrers": [...] }

DELETE /api/v1/urls/{shortCode}
Response: 204 No Content`,
          },
        ],
        keyTakeaway:
          'The core API is just two endpoints: POST to create a short URL, and GET /{code} to redirect. Analytics and management are secondary.',
      },
      {
        title: 'Step 3: Data Model',
        content:
          'We need to store the mapping from short code to long URL, plus metadata.\n\n**URLs Table:**\n```\nid:          UUID (primary key)\nshort_code:  VARCHAR(10) UNIQUE INDEX\nlong_url:    TEXT (the original URL)\nuser_id:     UUID (optional, who created it)\ncreated_at:  TIMESTAMP\nexpires_at:  TIMESTAMP\nclick_count: BIGINT (denormalized for speed)\n```\n\n**Analytics Table (if needed):**\n```\nid:          UUID\nshort_code:  VARCHAR(10) INDEX\nclicked_at:  TIMESTAMP\nip_address:  INET\nuser_agent:  TEXT\nreferrer:    TEXT\ncountry:     VARCHAR(2)\n```\n\n**Database Choice:**\n- URLs table: PostgreSQL or DynamoDB (key-value lookup is the main pattern)\n- Analytics: Time-series DB (InfluxDB) or columnar (ClickHouse) for high-volume writes\n- Cache: Redis for hot short codes (most redirects hit a small % of URLs)',
        analogy:
          'The URLs table is the coat check ledger: ticket number → coat description. The analytics table is a log of every time someone picked up their coat.',
        keyTakeaway:
          'The core data model is simple: short_code → long_url mapping. Use Redis cache for hot redirects and a separate store for analytics.',
      },
      {
        title: 'Step 4: Short Code Generation',
        content:
          'The key challenge: how do we generate unique, short, non-predictable codes?\n\n**Approach 1: Base62 Encoding of an Auto-Increment ID**\nUse a global counter (1, 2, 3...) and encode it in base62 (a-z, A-Z, 0-9).\n- ID 1 → "1", ID 62 → "10", ID 1 billion → "15FTGf"\n- 6 characters → 62^6 = 56.8 billion unique codes\n- Pro: Simple, guaranteed unique\n- Con: Sequential = predictable (user can guess next URLs)\n\n**Approach 2: Hash the Long URL (MD5/SHA256) + Truncate**\nHash the URL and take the first 6-7 characters.\n- Pro: Same URL always gets the same short code (deduplication)\n- Con: Collisions! Must handle them (retry with salt)\n\n**Approach 3: Pre-generated Key Service**\nA separate service pre-generates millions of unique random codes and stores them. When a new URL is created, grab one from the pool.\n- Pro: Fast, guaranteed unique, non-predictable\n- Con: Extra infrastructure to manage the key pool\n\nFor interviews, Approach 3 (pre-generated keys) is the most robust answer.',
        code: [
          {
            language: 'javascript',
            label: 'Base62 Encoding',
            code: `const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function encode(num: number): string {
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result || 'a';
}

function decode(str: string): number {
  let result = 0;
  for (const char of str) {
    result = result * 62 + BASE62.indexOf(char);
  }
  return result;
}

// encode(1000000) → "4c92"   (4 chars for 1M)
// encode(1000000000) → "15FTGf" (6 chars for 1B)`,
          },
        ],
        keyTakeaway:
          'Three approaches: base62 auto-increment (simple but predictable), hash+truncate (risk of collisions), pre-generated keys (robust but extra infra). Pre-generated keys are the best interview answer.',
      },
      {
        title: 'Step 5: High-Level Architecture',
        content:
          'Here is the complete system architecture:\n\n**Write Path (Create Short URL):**\n1. Client sends POST with long URL\n2. API server validates input\n3. Check if URL already exists (optional deduplication)\n4. Get a unique short code (from key service or base62 encoding)\n5. Store mapping in database\n6. Return short URL to client\n\n**Read Path (Redirect):**\n1. User visits `short.ly/abc123`\n2. Request hits the load balancer\n3. API server checks Redis cache for `abc123`\n4. Cache hit → return 301 redirect immediately\n5. Cache miss → query database → populate cache → return 301\n6. Log the click event to the analytics pipeline (async, via message queue)\n\n**Components:**\n- **Load Balancer** — Distribute traffic across API servers\n- **API Servers** — Stateless, horizontally scalable\n- **Redis Cache** — Cache hot short codes (90%+ of redirects hit cache)\n- **PostgreSQL/DynamoDB** — Persistent storage for URL mappings\n- **Key Generation Service** — Pre-generate unique short codes\n- **Analytics Pipeline** — Kafka → ClickHouse for click tracking\n- **CDN** — Optional, for redirect caching at edge locations',
        visual: 'diagram',
        visualData: {
          type: 'architecture',
          components: [
            'Client',
            'CDN',
            'Load Balancer',
            'API Servers (stateless)',
            'Redis Cache',
            'Database (PostgreSQL)',
            'Key Generation Service',
            'Kafka → Analytics Store',
          ],
        },
        keyTakeaway:
          'The redirect path must be blazing fast: cache → DB → redirect. Analytics are logged asynchronously via a message queue.',
      },
      {
        title: 'Step 6: Deep Dive — Handling Scale',
        content:
          '**301 vs 302 Redirect:**\n- 301 (Moved Permanently): Browser caches the redirect. Fewer requests to your server, but you lose analytics visibility.\n- 302 (Found): Browser doesn\'t cache. Every visit hits your server. Better for analytics.\n- Recommendation: Use 302 if analytics matter, 301 if you want to minimize server load.\n\n**Database Scaling:**\n- With 100M URLs/month, the database grows by ~600GB/year.\n- Partition by short_code hash for even distribution.\n- Read replicas for the redirect read path.\n\n**Cache Strategy:**\n- Cache the top 20% of URLs (they account for 80% of traffic — Pareto principle).\n- TTL: 24 hours. Popular URLs stay hot; unpopular ones expire.\n- Cache size: If top 20% of daily URLs = 1M entries * 500 bytes = 500MB — easily fits in RAM.\n\n**Handling Expired URLs:**\n- Lazy deletion: check expiry on redirect, return 410 Gone if expired.\n- Background cleanup job: periodically delete expired rows and free cache entries.',
        keyTakeaway:
          'Use 302 redirects for analytics. Cache hot URLs in Redis. Partition the database by short_code. Clean up expired URLs lazily and with background jobs.',
      },
      {
        title: 'Step 7: Bottlenecks and Solutions',
        content:
          '**Bottleneck 1: Key Generation at Scale**\nIf many servers need unique codes simultaneously, a single counter becomes a bottleneck.\nSolution: Pre-generate batches. Each server grabs a batch of 1000 codes and uses them locally. When exhausted, grab another batch.\n\n**Bottleneck 2: Database Writes**\nAt 40 writes/sec, a single PostgreSQL instance is fine. But at 10x scale:\nSolution: Shard by short_code. Or use DynamoDB which auto-scales writes.\n\n**Bottleneck 3: Analytics Pipeline**\nAt 12,000 redirects/sec peak, logging every click synchronously would slow redirects.\nSolution: Publish click events to Kafka asynchronously. A separate consumer writes to ClickHouse in batches.\n\n**Bottleneck 4: Single Point of Failure**\n- Load balancers in pairs\n- Multiple API servers\n- Database with replicas and failover\n- Redis with replication\n\n**Security:**\n- Rate limit URL creation to prevent abuse\n- Scan long URLs for malware/phishing\n- Don\'t allow short codes that look like existing routes',
        keyTakeaway:
          'Key bottlenecks: key generation (batch pre-generation), DB writes (sharding), analytics (async pipeline). Always address single points of failure.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using 301 redirects when you need analytics',
        explanation:
          '301 tells browsers to cache the redirect permanently. Subsequent visits won\'t hit your server, so you lose all click tracking. Use 302 for analytics.',
      },
      {
        mistake: 'Not handling hash collisions',
        explanation:
          'If you use hash truncation for short codes, collisions WILL happen. You need a retry mechanism with salt or a different approach entirely.',
      },
      {
        mistake: 'Synchronous analytics logging on the redirect path',
        explanation:
          'Adding 10ms of analytics logging to every redirect degrades the user experience. Log asynchronously via a message queue.',
      },
    ],
    practiceQuestions: [
      'How would you modify this design to support custom aliases (e.g., short.ly/my-brand)?',
      'If you need to guarantee that the same long URL always produces the same short URL, how would you implement that?',
      'How would you add a "link preview" feature that shows the destination before redirecting?',
      'What happens if the Key Generation Service goes down?',
      'Design the analytics dashboard showing clicks over time, top referrers, and geographic distribution.',
    ],
  },

  // ─────────────────────────────────────────────
  // 13. DESIGN: CHAT APPLICATION
  // ─────────────────────────────────────────────
  'design-chat-application': {
    steps: [
      {
        title: 'Step 1: Requirements',
        content:
          'Let\'s design a real-time chat application like WhatsApp or Slack.\n\n**Functional Requirements:**\n- 1-on-1 messaging between users\n- Group chats (up to 500 members)\n- Online/offline presence indicators\n- Message read receipts (sent, delivered, read)\n- Media sharing (images, files)\n- Message history (persistent storage)\n- Push notifications for offline users\n\n**Non-Functional Requirements:**\n- Real-time delivery (< 100ms for online users)\n- Messages must never be lost (durability)\n- Ordered delivery within a conversation\n- Support 50M daily active users\n- Eventual consistency is acceptable for presence\n\n**Capacity Estimation:**\n- 50M DAU, each sends 40 messages/day = 2B messages/day\n- Message QPS: 2B / 86400 ≈ 23,000 msgs/sec (peak: ~70,000/sec)\n- Average message size: 200 bytes\n- Daily storage: 2B * 200 bytes = 400 GB/day\n- Concurrent WebSocket connections: ~10M (20% of DAU online at any time)',
        analogy:
          'Designing a chat app is like designing a postal system that also does phone calls. Some messages need instant delivery (texts to online users), some need holding (offline users), and you need to track who\'s home (presence).',
        keyTakeaway:
          'A chat app needs real-time delivery (WebSockets), persistent storage (message history), presence tracking, and push notifications — all at massive scale.',
      },
      {
        title: 'Step 2: API Design + WebSocket Protocol',
        content:
          'Chat apps use a combination of REST APIs and WebSocket connections.',
        code: [
          {
            language: 'text',
            label: 'REST API (non-real-time operations)',
            code: `POST   /api/v1/auth/login              → Get auth token
GET    /api/v1/conversations              → List user's conversations
POST   /api/v1/conversations              → Create group chat
GET    /api/v1/conversations/:id/messages → Paginated message history
POST   /api/v1/messages/:id/media         → Upload image/file
GET    /api/v1/users/:id/presence         → Get user presence`,
          },
          {
            language: 'text',
            label: 'WebSocket Events (real-time)',
            code: `// Client → Server
{ "type": "send_message", "conversationId": "abc", "content": "Hello!", "clientMsgId": "uuid-1" }
{ "type": "typing", "conversationId": "abc" }
{ "type": "read_receipt", "conversationId": "abc", "lastReadMsgId": "msg-42" }

// Server → Client
{ "type": "new_message", "from": "user-2", "conversationId": "abc", "content": "Hello!", "msgId": "msg-43", "timestamp": "..." }
{ "type": "msg_delivered", "clientMsgId": "uuid-1", "msgId": "msg-43" }
{ "type": "typing", "conversationId": "abc", "userId": "user-2" }
{ "type": "presence", "userId": "user-2", "status": "online" }
{ "type": "read_receipt", "conversationId": "abc", "userId": "user-2", "lastReadMsgId": "msg-43" }`,
          },
        ],
        keyTakeaway:
          'Use REST for non-real-time operations (login, history, uploads). Use WebSockets for real-time messaging, typing indicators, presence, and receipts.',
      },
      {
        title: 'Step 3: Data Model',
        content:
          '**Users Table:**\n```\nid, username, avatar_url, last_seen, created_at\n```\n\n**Conversations Table:**\n```\nid, type (dm/group), name (for groups), created_at\n```\n\n**Conversation Members Table:**\n```\nconversation_id, user_id, joined_at, last_read_msg_id\n```\n\n**Messages Table:**\n```\nid, conversation_id, sender_id, content, type (text/image/file),\nmedia_url, created_at, status (sent/delivered/read)\n```\n\n**Database Choice:**\n- Conversations & Members: PostgreSQL (relational, joins are needed)\n- Messages: Cassandra or ScyllaDB\n  - Partition key: conversation_id\n  - Clustering key: created_at DESC\n  - This gives ordered messages per conversation with fast writes\n  - Scales horizontally for billions of messages\n- Presence: Redis (key: user_id, value: last_seen timestamp, with TTL)\n- Media: S3 + CDN',
        analogy:
          'The conversations table is like a group chat header. The members table is the participant list. The messages table is the chat log. Cassandra is the endless scroll of message history.',
        keyTakeaway:
          'Use Cassandra for messages (partitioned by conversation_id for ordered history), PostgreSQL for conversations/members, Redis for presence, and S3 for media.',
      },
      {
        title: 'Step 4: High-Level Architecture',
        content:
          '**Connection Layer:**\n- Users connect via WebSocket to a Chat Server\n- Each Chat Server handles ~50K concurrent connections\n- With 10M concurrent users, you need ~200 Chat Servers\n- A connection registry (Redis) maps user_id → which chat server they\'re connected to\n\n**Message Flow (1-on-1):**\n1. User A sends message via WebSocket to Chat Server 1\n2. Chat Server 1 validates, generates message ID, stores in Cassandra\n3. Looks up User B\'s connection in Redis registry\n4. If online: forwards message to Chat Server 3 (where User B is connected) → delivered to User B\n5. If offline: pushes message to Push Notification service (FCM/APNs)\n\n**Message Flow (Group Chat):**\n1. User A sends to group (200 members)\n2. Chat Server stores message in Cassandra once\n3. Looks up all online members\' connections\n4. Fans out the message to each member\'s Chat Server\n5. Offline members get push notifications\n\n**Key Components:**\n- Load Balancer (sticky sessions for WebSocket)\n- Chat Servers (WebSocket handlers)\n- Connection Registry (Redis: user_id → server)\n- Message Store (Cassandra)\n- Push Notification Service\n- Media Upload Service (S3 + CDN)\n- Presence Service (Redis)',
        visual: 'diagram',
        visualData: {
          type: 'architecture',
          components: [
            'Clients',
            'Load Balancer (sticky)',
            'Chat Servers (WebSocket)',
            'Connection Registry (Redis)',
            'Message Store (Cassandra)',
            'Push Notification Service',
            'Media Service (S3 + CDN)',
            'Presence Service (Redis)',
          ],
        },
        keyTakeaway:
          'Messages flow through WebSocket chat servers, get stored in Cassandra, and are routed to recipients via a connection registry. Offline users get push notifications.',
      },
      {
        title: 'Step 5: WebSocket vs Polling Deep Dive',
        content:
          '**Why WebSockets?**\nHTTP is request-response: the client has to ask for new messages. That means:\n- Short polling: Ask every 1 second. 50M users * 1 req/sec = 50M QPS. Wasteful.\n- Long polling: Better, but each connection ties up a server thread.\n- WebSocket: Persistent bidirectional connection. Server pushes messages instantly. ~10KB overhead per connection.\n\n**WebSocket Challenges:**\n- **Sticky sessions**: Once a WebSocket connects to Server A, all messages for that session must go through Server A. Use IP hash or connection-based load balancing.\n- **Connection drops**: Mobile users lose connectivity frequently. Implement heartbeat/ping-pong (every 30 seconds) and reconnection logic.\n- **Memory**: 10M connections * 10KB = 100GB RAM across all servers. Plan capacity.\n\n**Reconnection Protocol:**\n1. Client disconnects (network switch, sleep)\n2. Client reconnects and sends: `{ "type": "sync", "lastMsgId": "msg-42" }`\n3. Server queries Cassandra for all messages after msg-42\n4. Server sends missed messages\n5. Client is back in sync',
        code: [
          {
            language: 'javascript',
            label: 'WebSocket Server (simplified)',
            code: `import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const connections = new Map(); // userId → ws

wss.on('connection', (ws, req) => {
  const userId = authenticateFromToken(req);
  connections.set(userId, ws);
  redis.set(\`presence:\${userId}\`, 'online', 'EX', 60);

  ws.on('message', async (data) => {
    const msg = JSON.parse(data);

    if (msg.type === 'send_message') {
      // 1. Store in database
      const stored = await cassandra.execute(
        'INSERT INTO messages (id, conversation_id, sender_id, content, created_at) VALUES (?, ?, ?, ?, ?)',
        [uuid(), msg.conversationId, userId, msg.content, new Date()]
      );

      // 2. Acknowledge to sender
      ws.send(JSON.stringify({
        type: 'msg_delivered',
        clientMsgId: msg.clientMsgId,
        msgId: stored.id,
      }));

      // 3. Route to recipient(s)
      const members = await getConversationMembers(msg.conversationId);
      for (const memberId of members) {
        if (memberId === userId) continue;
        const recipientWs = connections.get(memberId);
        if (recipientWs) {
          recipientWs.send(JSON.stringify({
            type: 'new_message',
            ...stored,
          }));
        } else {
          await sendPushNotification(memberId, stored);
        }
      }
    }
  });

  ws.on('close', () => {
    connections.delete(userId);
    redis.set(\`presence:\${userId}\`, Date.now().toString());
  });
});`,
          },
        ],
        keyTakeaway:
          'WebSockets provide real-time bidirectional messaging. Handle reconnection with a sync protocol (send last message ID, receive missed messages).',
      },
      {
        title: 'Step 6: Presence and Read Receipts',
        content:
          '**Online Presence:**\nPresence seems simple ("show a green dot") but is tricky at scale with 50M users.\n\n- Each connected client sends a heartbeat every 30 seconds\n- Server updates Redis: `SET presence:{userId} "online" EX 60`\n- If no heartbeat in 60 seconds, the key expires → user appears offline\n- When User A opens a chat with User B, the client queries User B\'s presence\n- Presence changes are pushed via WebSocket to contacts (but only for visible conversations — don\'t push 500 friend updates to everyone)\n\n**Read Receipts:**\n- When User B reads messages up to msg-42, client sends: `{ "type": "read_receipt", "lastReadMsgId": "msg-42" }`\n- Server updates `conversation_members.last_read_msg_id` for User B\n- Server pushes the read receipt to User A (the sender)\n- "Delivered" = the recipient\'s device received the message\n- "Read" = the recipient\'s app opened the conversation and scrolled past the message\n\nThese are eventually consistent — a slight delay is perfectly fine.',
        keyTakeaway:
          'Presence uses Redis TTL keys with heartbeats. Read receipts track the last-read message ID per user per conversation. Both can be eventually consistent.',
      },
      {
        title: 'Step 7: Bottlenecks and Solutions',
        content:
          '**Bottleneck 1: Group Message Fan-Out**\nA 500-person group means each message is delivered 499 times. With active groups, this creates huge fan-out.\nSolution: Use a message queue (Kafka) for group fan-out. The chat server publishes once; a fan-out service distributes to each member\'s chat server.\n\n**Bottleneck 2: Hot Conversations**\nA viral group chat creates a hot partition in Cassandra.\nSolution: Use a write-back cache. Batch messages and write to Cassandra in bulk every 1 second.\n\n**Bottleneck 3: Connection Server Failure**\nIf a chat server crashes, 50K users disconnect simultaneously.\nSolution: Clients auto-reconnect to another server. The sync protocol (send last_msg_id, receive missed messages) ensures no messages are lost.\n\n**Bottleneck 4: Media Uploads**\nUploading large images through chat servers wastes their resources.\nSolution: Pre-signed S3 URLs. Client uploads directly to S3, then sends the media URL as a message.\n\n**End-to-End Encryption:**\nFor privacy, messages can be encrypted client-side so even the server can\'t read them. Each conversation has a shared key negotiated via Diffie-Hellman. Server stores encrypted blobs.',
        keyTakeaway:
          'Key challenges: group fan-out (use Kafka), connection failures (sync protocol), media (direct S3 upload). E2E encryption adds privacy but prevents server-side search.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using short polling for message delivery',
        explanation:
          'Polling every second for 50M users = 50M requests/sec of mostly empty responses. WebSockets reduce this to zero unnecessary requests.',
      },
      {
        mistake: 'Storing all presence changes in the database',
        explanation:
          'Presence changes are extremely frequent and ephemeral. Use Redis with TTL, not a relational database.',
      },
      {
        mistake: 'Sending messages through the chat server instead of pre-signed URLs for media',
        explanation:
          'Large file transfers through your chat servers waste CPU, memory, and bandwidth. Use pre-signed S3 URLs for direct client-to-storage uploads.',
      },
      {
        mistake: 'Not implementing message ordering guarantees',
        explanation:
          'Messages in a conversation must appear in the correct order. Use server-assigned timestamps (not client timestamps) and sequence numbers per conversation.',
      },
    ],
    practiceQuestions: [
      'How would you implement "typing..." indicators without overwhelming the server?',
      'Design the push notification flow for offline users. How do you avoid duplicate notifications?',
      'How would you implement message search across all conversations?',
      'What changes if you need to support 10,000-member group chats (like Discord servers)?',
      'How would you handle message editing and deletion in a distributed system?',
    ],
  },

  // ─────────────────────────────────────────────
  // 14. DESIGN: INSTAGRAM
  // ─────────────────────────────────────────────
  'design-instagram': {
    steps: [
      {
        title: 'Step 1: Requirements',
        content:
          'Let\'s design a photo-sharing platform like Instagram.\n\n**Functional Requirements:**\n- Upload photos with captions\n- Follow other users\n- News feed: see photos from people you follow, ranked by relevance\n- Like and comment on posts\n- Explore/discover page\n- Stories (24-hour ephemeral content)\n\n**Non-Functional Requirements:**\n- High availability (always accessible)\n- Low feed latency (< 200ms)\n- Eventual consistency is acceptable (a new post appearing 1-2 seconds late is fine)\n- Highly read-heavy (100:1 read:write ratio)\n\n**Capacity Estimation:**\n- 500M DAU, 100M new photos/day\n- Average photo: 500KB (after compression)\n- Daily storage: 100M * 500KB = 50 TB/day (!) — image storage is the biggest challenge\n- Feed requests: 500M * 10 feed loads/day = 5B/day → ~58,000 QPS\n- Write QPS: 100M / 86400 ≈ 1,160 uploads/sec',
        analogy:
          'Instagram is like a massive art gallery where anyone can hang their paintings, follow their favorite artists, and the gallery curates a personalized tour (feed) for each visitor.',
        keyTakeaway:
          'Instagram is extremely read-heavy with massive image storage needs (50 TB/day). The feed generation system is the core engineering challenge.',
      },
      {
        title: 'Step 2: API Design',
        content:
          'Key APIs for the platform.',
        code: [
          {
            language: 'text',
            label: 'Instagram API Endpoints',
            code: `POST   /api/v1/posts              → Upload photo (multipart form)
GET    /api/v1/posts/:id          → Get a single post
DELETE /api/v1/posts/:id          → Delete post

GET    /api/v1/feed               → Get personalized news feed (cursor-based)
GET    /api/v1/explore             → Get trending/discover content

POST   /api/v1/users/:id/follow   → Follow a user
DELETE /api/v1/users/:id/follow   → Unfollow
GET    /api/v1/users/:id          → Get user profile + posts
GET    /api/v1/users/:id/followers → Paginated follower list

POST   /api/v1/posts/:id/like     → Like a post
DELETE /api/v1/posts/:id/like     → Unlike
POST   /api/v1/posts/:id/comments → Add comment
GET    /api/v1/posts/:id/comments → List comments (paginated)

POST   /api/v1/stories             → Upload story
GET    /api/v1/stories/feed        → Get stories from followed users`,
          },
        ],
        keyTakeaway:
          'The feed endpoint is the most critical and complex. Everything else is standard CRUD with proper pagination.',
      },
      {
        title: 'Step 3: Data Model and Storage',
        content:
          '**Users Table (PostgreSQL):**\n```\nid, username, bio, avatar_url, follower_count, following_count, created_at\n```\n\n**Follows Table (PostgreSQL):**\n```\nfollower_id, following_id, created_at\nIndex on (follower_id) — "who do I follow?"\nIndex on (following_id) — "who follows me?"\n```\n\n**Posts Table (PostgreSQL or Cassandra):**\n```\nid, user_id, image_url, caption, like_count, comment_count, created_at\n```\n\n**Feed Table (Redis or Cassandra) — Pre-computed feed:**\n```\nuser_id → [post_id_1, post_id_2, ...] (ordered by rank/time)\n```\n\n**Image Storage:**\n- Original photos → S3\n- Multiple resolutions generated (thumbnail, medium, full) via image processing pipeline\n- Served via CDN (CloudFront/Cloudflare)\n- 50 TB/day means you need an efficient storage tier strategy (hot/warm/cold)\n\n**Key numbers:** At 100M photos/day, you\'re adding 50 TB/day. In a year, that\'s 18 PB. Old photos move to cheaper storage tiers (S3 Glacier).',
        analogy:
          'Image storage is like a museum archive. New art (hot) is displayed prominently. Older art (warm) is in accessible storage. Ancient art (cold) is in deep archives — still retrievable but slower.',
        keyTakeaway:
          'Images go to S3 + CDN. The feed is pre-computed and stored in Redis/Cassandra. Storage tiering (hot/warm/cold) manages the 50 TB/day growth.',
      },
      {
        title: 'Step 4: News Feed Generation — Push vs Pull',
        content:
          'The hardest part: generating a personalized feed for 500M users. Two approaches:\n\n**Pull Model (Fan-out on Read):**\nWhen User A opens their feed, the system:\n1. Gets list of people A follows (say 200 users)\n2. Fetches recent posts from each (200 queries)\n3. Merges and ranks them\n4. Returns the top N posts\n\n- Pro: No wasted computation (only computed when requested)\n- Con: Slow! Merging 200 users\' posts on every feed load is expensive. High latency.\n\n**Push Model (Fan-out on Write):**\nWhen User B creates a post, the system:\n1. Gets all of B\'s followers (say 1,000 users)\n2. Pushes the post into each follower\'s pre-computed feed (in Redis)\n3. When User A opens their feed, it\'s already ready — just read from Redis\n\n- Pro: Feed reads are instant (pre-computed)\n- Con: Expensive writes. If a user has 10M followers, creating one post triggers 10M writes.\n\n**Hybrid Approach (What Instagram actually uses):**\n- For regular users (< 10K followers): Push model. Fan-out is manageable.\n- For celebrities (> 10K followers): Pull model. Don\'t fan out to 10M feeds.\n- When loading feed: merge pre-computed feed with recent celebrity posts on the fly.',
        visual: 'comparison',
        visualData: {
          items: [
            { label: 'Pull (Fan-out on Read)', pros: 'No wasted writes', cons: 'Slow reads, high latency' },
            { label: 'Push (Fan-out on Write)', pros: 'Instant reads', cons: 'Expensive writes, celebrity problem' },
            { label: 'Hybrid', pros: 'Best of both', cons: 'More complex' },
          ],
        },
        keyTakeaway:
          'Use push-based feed for normal users and pull-based for celebrities. The hybrid approach balances write cost and read latency.',
      },
      {
        title: 'Step 5: High-Level Architecture',
        content:
          '**Upload Flow:**\n1. Client uploads image to Image Upload Service\n2. Image stored in S3, job published to processing queue\n3. Image Processing Service creates thumbnails (150x150, 640x640, 1080x1080)\n4. CDN URLs generated for each size\n5. Post metadata stored in database\n6. Feed Fan-out Service pushes post_id to followers\' feeds in Redis\n\n**Feed Flow:**\n1. Client requests GET /feed?cursor=xxx\n2. Feed Service reads pre-computed feed from Redis (list of post_ids)\n3. Post Service fetches full post data (batch query)\n4. Merge with celebrity posts (pull on read)\n5. Apply ranking algorithm (chronological + engagement signals)\n6. Return ranked feed page\n\n**Components:**\n- Web Servers (stateless, behind LB)\n- Image Upload Service + S3 + Image Processing Workers\n- CDN (serves all images)\n- Feed Service + Redis (pre-computed feeds)\n- Post Service + PostgreSQL/Cassandra\n- Fan-out Service + Kafka (distributes posts to follower feeds)\n- Notification Service (push notifications for likes, comments, follows)\n- Search Service (Elasticsearch for user/hashtag search)',
        visual: 'diagram',
        visualData: {
          type: 'architecture',
          components: [
            'Clients',
            'CDN',
            'Load Balancer',
            'Web Servers',
            'Image Upload + S3 + Processing Workers',
            'Feed Service + Redis',
            'Post Service + Database',
            'Fan-out Service + Kafka',
            'Search (Elasticsearch)',
          ],
        },
        keyTakeaway:
          'The architecture separates image storage (S3+CDN), feed generation (Redis+Kafka fan-out), and post storage (database). Each can scale independently.',
      },
      {
        title: 'Step 6: Feed Ranking',
        content:
          'A chronological feed is simple but not engaging. Instagram\'s feed is ranked by relevance.\n\n**Ranking Signals:**\n- **Recency** — Newer posts rank higher\n- **Relationship** — Posts from users you interact with often (likes, comments, DMs)\n- **Engagement** — Posts with high like/comment rates\n- **Content type** — Your preference for photos vs videos vs carousels\n- **Time spent** — Did you pause on this user\'s posts before?\n\n**Simple Ranking Formula:**\n```\nscore = (recency_weight * recency_score)\n      + (relationship_weight * relationship_score)\n      + (engagement_weight * engagement_score)\n```\n\n**Implementation:**\n1. Pre-compute relationship scores (offline ML pipeline)\n2. When generating feed, fetch candidate posts (last 7 days from followed users)\n3. Score each post using the ranking formula\n4. Return top N by score\n\nThis is simplified — real Instagram uses deep learning models trained on billions of interactions.',
        keyTakeaway:
          'Feed ranking uses signals like recency, relationship strength, and engagement. Start simple (weighted formula) and evolve to ML models as you grow.',
      },
      {
        title: 'Step 7: Bottlenecks and Solutions',
        content:
          '**Bottleneck 1: Celebrity Post Fan-out**\nA celebrity with 100M followers posts → 100M feed updates. Even at 50K writes/sec, that\'s 30 minutes.\nSolution: Hybrid model. Celebrity posts are pulled on read, not pushed to feeds.\n\n**Bottleneck 2: Image Storage Growth (50 TB/day)**\nSolution: Storage tiering. Recent photos on fast SSD-backed S3. Old photos on S3 Infrequent Access. Very old on Glacier. Deduplication (same photo uploaded twice = store once).\n\n**Bottleneck 3: Hot Posts (viral content)**\nA viral post gets millions of likes/comments. The post row becomes a hot spot.\nSolution: Cache like/comment counts in Redis, batch update the database periodically. Use separate counters service.\n\n**Bottleneck 4: Feed Staleness**\nPre-computed feeds can become stale if the user hasn\'t opened the app in days.\nSolution: Rebuild stale feeds on demand (first load is slower, subsequent loads are fast from cache).\n\n**Additional Considerations:**\n- Content moderation (ML-based image scanning before publishing)\n- Hashtag system (inverted index: hashtag → list of post_ids)\n- Stories (separate storage with 24-hour TTL, served from CDN)',
        keyTakeaway:
          'Celebrity fan-out uses pull model. Storage tiering manages growth. Hot posts use cached counters. Stale feeds are rebuilt on demand.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using pure push model for feed generation',
        explanation:
          'Fan-out on write fails for celebrities. A user with 100M followers would trigger 100M writes per post. Use a hybrid approach.',
      },
      {
        mistake: 'Storing images in the database',
        explanation:
          'Databases are not designed for binary blob storage. Use object storage (S3) for images and store only the URL in the database.',
      },
      {
        mistake: 'Not using a CDN for image delivery',
        explanation:
          'Serving 5B feed loads/day directly from S3 or your servers would be astronomically expensive and slow. CDNs cache images at edge locations.',
      },
    ],
    practiceQuestions: [
      'How would you implement Instagram Stories (24-hour ephemeral content)?',
      'Design the Explore page that shows trending and recommended content.',
      'How would you handle a user who changes their profile picture — all their old posts still show the old picture in cached feeds?',
      'How would you implement hashtag search and trending hashtags?',
      'What changes if you need to support video posts (which are 100x larger than photos)?',
    ],
  },

  // ─────────────────────────────────────────────
  // 15. DESIGN: TWITTER FEED
  // ─────────────────────────────────────────────
  'design-twitter-feed': {
    steps: [
      {
        title: 'Step 1: Requirements',
        content:
          'Let\'s design Twitter\'s timeline/feed system. While similar to Instagram, Twitter has unique challenges due to its text-first, real-time nature.\n\n**Functional Requirements:**\n- Post tweets (280 characters + optional media)\n- Follow users\n- Home timeline: see tweets from people you follow, ranked\n- Retweet and quote tweet\n- Like and reply\n- Search tweets by keyword/hashtag\n- Trending topics\n\n**Non-Functional Requirements:**\n- Feed generation < 300ms\n- Real-time feel (new tweets appear quickly)\n- 200M DAU, 500M tweets/day\n- Read-heavy (timeline views >> tweet creation)\n\n**Capacity Estimation:**\n- 500M tweets/day, average tweet = 300 bytes\n- Write QPS: 500M / 86400 ≈ 5,800 tweets/sec (peak: ~15,000/sec)\n- Timeline reads: 200M users * 20 loads/day = 4B reads/day → 46,000 QPS\n- Storage: 500M * 300 bytes = 150 GB/day for text\n- Average user follows 200 accounts; some follow 5,000',
        analogy:
          'Twitter is like a news wire service. Millions of reporters (users) file stories (tweets). Each subscriber (follower) has a personalized ticker (timeline) that shows the stories they care about, updated in near real-time.',
        keyTakeaway:
          'Twitter\'s core challenge is generating personalized timelines for 200M users from 500M daily tweets. The celebrity problem (accounts with millions of followers) is the key design constraint.',
      },
      {
        title: 'Step 2: API Design',
        content:
          'The timeline API is the most important endpoint.',
        code: [
          {
            language: 'text',
            label: 'Twitter API Endpoints',
            code: `POST   /api/v1/tweets              → Create tweet { "text": "...", "mediaIds": [...] }
GET    /api/v1/tweets/:id          → Get a single tweet with engagement counts
DELETE /api/v1/tweets/:id          → Delete tweet

GET    /api/v1/timeline/home       → Home timeline (cursor-based, ranked)
GET    /api/v1/timeline/user/:id   → User's tweets (chronological)

POST   /api/v1/tweets/:id/retweet  → Retweet
POST   /api/v1/tweets/:id/like     → Like
POST   /api/v1/tweets/:id/reply    → Reply { "text": "..." }

POST   /api/v1/users/:id/follow    → Follow
DELETE /api/v1/users/:id/follow    → Unfollow

GET    /api/v1/search?q=keyword    → Search tweets
GET    /api/v1/trends               → Trending topics`,
          },
        ],
        keyTakeaway:
          'The home timeline endpoint is the most complex. It needs to be fast (< 300ms), personalized, and handle the celebrity fan-out problem.',
      },
      {
        title: 'Step 3: Data Model',
        content:
          '**Tweets Table (hybrid store):**\n```\nid: Snowflake ID (encodes timestamp + worker + sequence)\nuser_id, text, media_urls, reply_to_id, retweet_of_id,\nlike_count, retweet_count, reply_count, created_at\n```\n\n**Timeline Cache (Redis):**\n```\ntimeline:{user_id} → Sorted Set of tweet_ids scored by timestamp\nMax 800 tweets per user (enough for scroll depth)\n```\n\n**Social Graph (PostgreSQL + cache):**\n```\nfollows: follower_id, following_id, created_at\nCached in Redis: followers:{user_id} → Set of follower_ids\n```\n\n**Snowflake IDs:**\nTwitter invented Snowflake for globally unique, time-ordered IDs:\n```\n| 41 bits: timestamp | 10 bits: machine ID | 12 bits: sequence |\n```\n- 41 bits of timestamp = ~69 years of unique milliseconds\n- 10 bits of machine ID = 1024 workers\n- 12 bits of sequence = 4096 IDs per millisecond per worker\n- IDs are sortable by time (no need for a separate created_at index)',
        code: [
          {
            language: 'javascript',
            label: 'Simplified Snowflake ID Generator',
            code: `class SnowflakeGenerator {
  private epoch = 1288834974657n; // Twitter epoch (Nov 2010)
  private workerId: bigint;
  private sequence = 0n;
  private lastTimestamp = -1n;

  constructor(workerId: number) {
    this.workerId = BigInt(workerId);
  }

  nextId(): bigint {
    let timestamp = BigInt(Date.now()) - this.epoch;

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & 0xFFFn; // 12 bits
      if (this.sequence === 0n) {
        // Wait for next millisecond
        while (BigInt(Date.now()) - this.epoch <= this.lastTimestamp) {}
        timestamp = BigInt(Date.now()) - this.epoch;
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;
    return (timestamp << 22n) | (this.workerId << 12n) | this.sequence;
  }
}`,
          },
        ],
        keyTakeaway:
          'Use Snowflake IDs for time-ordered, globally unique tweet IDs. Store pre-computed timelines in Redis sorted sets. Cache the social graph for fast fan-out lookups.',
      },
      {
        title: 'Step 4: Fan-out on Write vs Fan-out on Read',
        content:
          'This is THE key design decision for Twitter.\n\n**Fan-out on Write:**\nWhen User B tweets, push the tweet_id into every follower\'s Redis timeline.\n- User B has 1,000 followers → 1,000 Redis ZADD operations\n- When User A loads timeline → simple ZRANGE from Redis → instant\n- Problem: @BarackObama has 130M followers. One tweet = 130M writes. At 50K writes/sec, that\'s 43 MINUTES.\n\n**Fan-out on Read:**\nWhen User A loads timeline, fetch recent tweets from all 200 people they follow, merge and rank.\n- No precomputation needed\n- But merging 200 tweet streams on every load is slow (~500ms+)\n\n**Twitter\'s Hybrid Solution:**\n1. Regular users (< 5K followers): Fan-out on write. Their tweets are pushed to followers\' timelines.\n2. Celebrities (> 5K followers): Fan-out on read. Their tweets are NOT pushed.\n3. When loading a timeline:\n   - Read pre-computed timeline from Redis (fan-out on write results)\n   - Fetch recent tweets from followed celebrities (fan-out on read)\n   - Merge the two sets\n   - Rank and return\n\nThis reduces the celebrity write problem while keeping reads fast.',
        analogy:
          'Fan-out on write: The newspaper prints and delivers to every subscriber\'s doorstep. Fan-out on read: Subscribers come to the newsstand and pick out the papers they want. Twitter\'s hybrid: Most papers are delivered, but the biggest papers (celebrities) are picked up at the newsstand.',
        keyTakeaway:
          'The hybrid approach is essential: push for normal users (fast reads), pull for celebrities (avoid massive fan-out). Merge both at read time.',
      },
      {
        title: 'Step 5: Timeline Ranking',
        content:
          '**Chronological vs Ranked Timeline:**\nTwitter originally showed tweets in pure chronological order. Now it uses ranking to show "best tweets first."\n\n**Ranking Signals:**\n- **Recency** — How fresh is the tweet?\n- **Engagement** — Likes, retweets, replies, quote tweets\n- **Author relationship** — How often you interact with this person\n- **Content relevance** — Topics you engage with (ML-detected)\n- **Diversity** — Don\'t show 10 tweets in a row from the same person\n- **Media** — Tweets with images/videos may rank differently based on your preference\n\n**Ranking Pipeline:**\n1. **Candidate Generation** — Get ~1,000 candidate tweets (from pre-computed timeline + celebrity tweets)\n2. **Feature Extraction** — For each candidate, compute features (engagement rate, author affinity, recency)\n3. **Scoring** — ML model assigns a relevance score to each candidate\n4. **Re-ranking** — Apply business rules (diversity, deduplication, ad insertion)\n5. **Return top 20** — Send to client with cursor for pagination\n\n**Caching the Ranked Feed:**\nThe ranking result is cached with a short TTL (5 minutes). Within that window, the user sees the same feed. After TTL, a fresh ranking is computed.',
        keyTakeaway:
          'Timeline ranking uses ML models to score candidates by engagement, relationship, recency, and relevance. Cache ranked results for 5 minutes to avoid recomputing on every scroll.',
      },
      {
        title: 'Step 6: Trending Topics and Search',
        content:
          '**Trending Topics:**\nIdentify topics that are spiking in volume right now (not just popular overall).\n\n1. Stream all tweets through a Kafka pipeline\n2. Extract hashtags, keywords, named entities\n3. Count occurrences in sliding windows (last 1 hour, last 15 min)\n4. Calculate "trending score" = (current volume / baseline volume)\n5. Filter out always-popular terms (e.g., "the", "love")\n6. Personalize by location and interests\n\n**Search:**\n- Use Elasticsearch for full-text tweet search\n- Index tweets as they\'re created (async via Kafka → Elasticsearch)\n- Support filters: from:user, since:date, has:media\n- Real-time search: For breaking news, show results within seconds of posting\n\n**Architecture:**\n- Kafka (tweet stream) → Storm/Flink (real-time processing) → Trending Service\n- Kafka → Elasticsearch (search indexing)\n- Both are async and don\'t slow down tweet creation',
        code: [
          {
            language: 'text',
            label: 'Trending Score Calculation',
            code: `For each term/hashtag:
  current_count = count in last 15 minutes
  baseline_count = average count per 15-min window in last 7 days
  trending_score = current_count / max(baseline_count, 1)

  if trending_score > 5.0 and current_count > 100:
    → It's trending!

Example:
  "#WorldCup" baseline: 200 tweets per 15 min
  "#WorldCup" right now: 50,000 tweets in 15 min
  trending_score = 50,000 / 200 = 250 → HIGHLY trending`,
          },
        ],
        keyTakeaway:
          'Trending detection compares current volume to baseline using sliding windows. Search uses Elasticsearch indexed asynchronously via Kafka.',
      },
      {
        title: 'Step 7: Bottlenecks and Solutions',
        content:
          '**Bottleneck 1: Celebrity Tweet Storm**\nMultiple celebrities tweeting simultaneously (e.g., during an event) creates massive fan-out queue.\nSolution: Priority queues. Celebrity tweets go through the pull path (not fan-out), so they don\'t queue at all.\n\n**Bottleneck 2: Timeline Cache Memory**\n200M users * 800 tweets/timeline * 8 bytes/tweet_id = 1.3 TB of Redis.\nSolution: Only cache active users\' timelines. If a user hasn\'t logged in for 30 days, evict their timeline. Rebuild on next login.\n\n**Bottleneck 3: Hot Tweets**\nA viral tweet gets millions of likes. Each like updates the like_count.\nSolution: Use Redis counters for real-time counts. Batch update the database every 30 seconds.\n\n**Bottleneck 4: Tweet Deletions**\nWhen a tweet is deleted, it must be removed from potentially millions of timelines.\nSolution: Lazy deletion. Mark as deleted in the database. When rendering a timeline, filter out deleted tweets. Periodically clean up timelines in the background.\n\n**Availability:**\n- Multiple data centers (US-East, US-West, Europe, Asia)\n- DNS-based routing to nearest data center\n- Async replication between data centers\n- Graceful degradation: if ranking fails, fall back to chronological feed',
        keyTakeaway:
          'Handle celebrity fan-out with the pull model, cache only active timelines, use Redis for hot counters, and delete lazily. Multiple data centers ensure global availability.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using pure fan-out on write without handling the celebrity problem',
        explanation:
          'A single tweet from an account with 100M followers would take tens of minutes to fan out. Use hybrid: pull for celebrities, push for regular users.',
      },
      {
        mistake: 'Storing full tweet objects in the timeline cache',
        explanation:
          'Store only tweet_ids in the timeline cache. Fetch full tweet data separately (it\'s likely cached anyway). This keeps the timeline cache small and fast.',
      },
      {
        mistake: 'Not using Snowflake IDs or similar time-sortable IDs',
        explanation:
          'If tweet IDs aren\'t time-sortable, you need a separate index on created_at for every timeline query. Snowflake IDs make time-based sorting implicit.',
      },
    ],
    practiceQuestions: [
      'How would you implement "retweets" in the timeline? Does a retweet trigger fan-out like a regular tweet?',
      'Design the "Who to Follow" recommendation system.',
      'How would you handle a reply chain (threads)? How deep can replies go?',
      'If Twitter needs to show a "While you were away" section with important tweets from the last 12 hours, how would you generate it?',
      'How would you implement tweet editing (allowing edits within 30 minutes of posting)?',
    ],
  },

  // ─────────────────────────────────────────────
  // 16. DESIGN: UBER
  // ─────────────────────────────────────────────
  'design-uber': {
    steps: [
      {
        title: 'Step 1: Requirements',
        content:
          'Let\'s design a ride-sharing platform like Uber.\n\n**Functional Requirements:**\n- Riders can request a ride from point A to point B\n- Nearby drivers are matched to ride requests\n- Real-time location tracking (rider sees driver approaching)\n- ETA calculation\n- Fare estimation and payment processing\n- Trip history for riders and drivers\n- Driver ratings and reviews\n\n**Non-Functional Requirements:**\n- Low matching latency: rider gets a driver within 30 seconds\n- Real-time location updates: every 3-5 seconds\n- High availability: especially during peak hours\n- Support 20M daily rides across 500 cities\n\n**Capacity Estimation:**\n- 20M rides/day → ~230 rides/sec\n- 2M active drivers sending location every 4 seconds → 500,000 location updates/sec\n- Location data per update: 50 bytes (lat, lng, timestamp, driver_id)\n- Daily location data: 500K * 50 bytes * 86400/4 ≈ 540 GB/day\n- Concurrent active sessions: ~1M (riders + drivers)',
        analogy:
          'Designing Uber is like designing a city-wide taxi dispatch system. You need to know where every cab is in real-time, match passengers to the closest available cab, and guide them to each other.',
        keyTakeaway:
          'Uber\'s key challenges: real-time location processing (500K updates/sec), fast driver matching (< 30 sec), and reliable trip management across millions of concurrent sessions.',
      },
      {
        title: 'Step 2: API Design',
        content:
          'Uber uses a combination of REST APIs and persistent connections for real-time updates.',
        code: [
          {
            language: 'text',
            label: 'Uber API Endpoints',
            code: `// Rider APIs
POST   /api/v1/rides/estimate       → Get fare estimate { "pickup": {...}, "dropoff": {...} }
POST   /api/v1/rides/request        → Request a ride { "pickup": {...}, "dropoff": {...}, "rideType": "uberX" }
GET    /api/v1/rides/:id             → Get ride status + driver location
POST   /api/v1/rides/:id/cancel     → Cancel ride
POST   /api/v1/rides/:id/rate       → Rate driver { "rating": 5, "comment": "..." }
GET    /api/v1/rides/history         → Past rides

// Driver APIs
POST   /api/v1/driver/online        → Go online (available for rides)
POST   /api/v1/driver/offline       → Go offline
POST   /api/v1/driver/location      → Update location { "lat": 37.7749, "lng": -122.4194 }
POST   /api/v1/rides/:id/accept     → Accept ride request
POST   /api/v1/rides/:id/arrive     → Arrived at pickup
POST   /api/v1/rides/:id/start      → Start trip
POST   /api/v1/rides/:id/complete   → Complete trip

// WebSocket / SSE (real-time)
// Rider receives: driver location, ETA updates, ride status changes
// Driver receives: new ride requests, navigation updates`,
          },
        ],
        keyTakeaway:
          'The ride lifecycle is: estimate → request → match → accept → arrive → start → complete → rate. Real-time location uses WebSocket or SSE.',
      },
      {
        title: 'Step 3: Geospatial Indexing — Finding Nearby Drivers',
        content:
          'The core problem: when a rider requests a ride at (37.77, -122.42), find all available drivers within 5 km. With 2M active drivers, scanning all of them is too slow.\n\n**Solution: Geospatial Indexing**\n\n**Approach 1: Geohash**\nDivide the world into grid cells using geohash encoding. A geohash converts (lat, lng) into a string like "9q8yyk". Nearby points share a common prefix.\n- "9q8yyk" and "9q8yym" are neighbors\n- Query: find all drivers with geohash prefix "9q8yy" (a ~1km x 1km cell)\n\n**Approach 2: QuadTree**\nRecursively divide the map into quadrants. Dense areas (cities) get subdivided more; sparse areas (rural) stay as larger cells.\n\n**Approach 3: S2 Geometry (what Uber actually uses)**\nGoogle\'s S2 library maps the Earth\'s surface onto a 1D curve (Hilbert curve), making 2D proximity queries into 1D range queries. Very efficient.\n\n**Implementation with Geohash + Redis:**',
        code: [
          {
            language: 'javascript',
            label: 'Finding Nearby Drivers with Redis GEO',
            code: `import Redis from 'ioredis';
const redis = new Redis();

// Driver sends location update every 4 seconds
async function updateDriverLocation(
  driverId: string,
  lat: number,
  lng: number
) {
  // Redis GEOADD stores location in a sorted set using geohash
  await redis.geoadd('drivers:active', lng, lat, driverId);

  // Also store driver metadata
  await redis.hset(\`driver:\${driverId}\`, {
    lat: lat.toString(),
    lng: lng.toString(),
    updatedAt: Date.now().toString(),
    status: 'available', // available, on_trip, offline
  });
}

// Find drivers within radius of pickup point
async function findNearbyDrivers(
  lat: number,
  lng: number,
  radiusKm: number = 5,
  limit: number = 10
): Promise<string[]> {
  // GEORADIUS returns members within radius, sorted by distance
  const drivers = await redis.georadius(
    'drivers:active',
    lng, lat,
    radiusKm, 'km',
    'ASC',           // Sort by distance (nearest first)
    'COUNT', limit,  // Limit results
    'WITHDIST',      // Include distance
    'WITHCOORD'      // Include coordinates
  );

  // Filter to only available drivers
  const available = [];
  for (const [driverId, distance] of drivers) {
    const status = await redis.hget(\`driver:\${driverId}\`, 'status');
    if (status === 'available') {
      available.push({ driverId, distance: parseFloat(distance) });
    }
  }

  return available;
}`,
          },
        ],
        analogy:
          'Geospatial indexing is like dividing a city into zip codes. When you need a plumber, you don\'t search the entire country — you search your zip code and neighboring ones.',
        keyTakeaway:
          'Use Redis GEO (geohash-based) or S2 Geometry for finding nearby drivers. This turns a 2M driver scan into a localized lookup in milliseconds.',
      },
      {
        title: 'Step 4: Ride Matching Algorithm',
        content:
          'When a rider requests a ride, the matching system:\n\n**Step 1: Find Candidates**\n- Query nearby available drivers within 5km radius\n- If fewer than 3 found, expand to 10km\n\n**Step 2: Rank Candidates**\nScore each driver based on:\n- **Distance** to pickup (lower = better, biggest factor)\n- **ETA** considering real-time traffic (not just straight-line distance)\n- **Driver rating** (higher = better)\n- **Vehicle type match** (rider requested UberX, filter out UberBLACK)\n- **Acceptance rate** (drivers who rarely decline rank higher)\n\n**Step 3: Offer the Ride**\n- Send ride request to the top-ranked driver\n- Driver has 15 seconds to accept\n- If declined or timeout → offer to the next driver\n- If all nearby drivers decline → expand radius and try again\n- After 3 failed rounds → notify rider "No drivers available"\n\n**Step 4: Match Confirmed**\n- Update driver status to "on_trip"\n- Create trip record in database\n- Start sending driver location to rider in real-time\n- Calculate and display ETA',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'Rider Requests Ride',
            'Find Nearby Drivers (5km)',
            'Rank by Distance + ETA + Rating',
            'Offer to Top Driver (15s timeout)',
            'Accepted? → Create Trip',
            'Declined? → Try Next Driver',
            'No Drivers? → Expand Radius',
          ],
          flow: 'branching',
        },
        keyTakeaway:
          'Matching is a ranked candidate selection: find nearby → rank by ETA/distance/rating → offer with timeout → fallback to next. Typically completes in 10-30 seconds.',
      },
      {
        title: 'Step 5: High-Level Architecture',
        content:
          '**Key Services:**\n\n1. **Location Service** — Ingests 500K location updates/sec from drivers. Stores in Redis GEO. This is the highest-throughput component.\n\n2. **Matching Service** — Handles ride requests. Queries Location Service for nearby drivers, runs ranking algorithm, sends offers. Stateful per active request.\n\n3. **Trip Service** — Manages the ride lifecycle (request → match → pickup → trip → complete). Stores trip state in PostgreSQL.\n\n4. **ETA Service** — Calculates estimated time of arrival using road network graph + real-time traffic data. Returns ETA for each candidate driver.\n\n5. **Pricing Service** — Computes fare estimates based on distance, duration, ride type, demand (surge pricing). Fare is locked at request time.\n\n6. **Payment Service** — Charges rider\'s payment method after trip completion. Handles splits, tips, refunds.\n\n7. **Notification Service** — Pushes ride status updates, driver location to riders via WebSocket/push notifications.\n\n**Data Flow:**\n- Driver locations: Driver App → Location Service → Redis GEO\n- Ride request: Rider App → API Gateway → Matching Service → Location Service → ETA Service → Driver App\n- Trip updates: Driver App → Trip Service → Notification Service → Rider App',
        visual: 'diagram',
        visualData: {
          type: 'architecture',
          components: [
            'Rider App / Driver App',
            'API Gateway + Load Balancer',
            'Matching Service',
            'Location Service + Redis GEO',
            'Trip Service + PostgreSQL',
            'ETA Service (road graph)',
            'Pricing Service',
            'Payment Service',
            'Notification Service (WebSocket)',
            'Kafka (event bus)',
          ],
        },
        keyTakeaway:
          'The architecture centers on Location Service (high-throughput), Matching Service (real-time decision-making), and Trip Service (stateful lifecycle management).',
      },
      {
        title: 'Step 6: Surge Pricing',
        content:
          'When demand exceeds supply (rainy night, concert ending, New Year\'s Eve), Uber implements surge pricing.\n\n**How It Works:**\n1. Divide each city into hexagonal zones (~1km each)\n2. For each zone, track: active ride requests and available drivers\n3. Compute supply/demand ratio\n4. If demand > supply by a threshold, apply a multiplier:\n   - Supply/Demand ratio < 0.5 → 1.5x surge\n   - Supply/Demand ratio < 0.3 → 2.0x surge\n   - Supply/Demand ratio < 0.1 → 3.0x surge\n5. Display surge multiplier to rider before they confirm\n6. Higher prices incentivize more drivers to come online\n\n**Implementation:**\n- Real-time stream processing (Kafka + Flink)\n- Aggregate ride requests and driver availability per zone per minute\n- Publish surge multipliers to Pricing Service\n- Cache surge data (5-minute TTL) — surge shouldn\'t fluctuate wildly\n\n**Fairness:**\n- Lock the surge multiplier at request time (don\'t change mid-ride)\n- Show estimated fare before the rider confirms\n- Cap maximum surge multiplier (e.g., 5x)\n- Gradually reduce surge as supply increases',
        keyTakeaway:
          'Surge pricing uses real-time supply/demand ratios per geographic zone. It\'s computed via stream processing and cached for stability.',
      },
      {
        title: 'Step 7: Bottlenecks and Solutions',
        content:
          '**Bottleneck 1: Location Update Throughput (500K/sec)**\nSolution: Location Service is horizontally sharded by city/region. Each shard handles updates for a geographic area. Use Kafka for buffering bursts.\n\n**Bottleneck 2: Stale Driver Locations**\nA driver\'s location from 30 seconds ago is useless.\nSolution: TTL on Redis entries. If a driver hasn\'t sent an update in 30 seconds, remove from the active set. ETA recalculated on every update.\n\n**Bottleneck 3: Race Conditions in Matching**\nTwo riders request at the same time, both get matched to the same driver.\nSolution: Optimistic locking. When offering a ride to a driver, atomically mark them as "reserved" in Redis (SET NX with TTL). If the SET fails, another request got there first.\n\n**Bottleneck 4: ETA Accuracy**\nStraight-line distance is useless in cities with one-way streets and highways.\nSolution: Pre-compute road network graphs (Dijkstra/A* for routing). Overlay real-time traffic data from driver GPS streams. Update every few minutes.\n\n**Bottleneck 5: Payment Failures**\nRide is complete but payment fails.\nSolution: Charge asynchronously. If payment fails, retry with exponential backoff. After 3 failures, flag the rider and use the payment team to resolve.\n\n**Multi-Region:**\n- Each city runs its own Location Service and Matching Service instance\n- Trip data and user data replicated globally\n- A ride in Tokyo never needs to query the NYC location service',
        keyTakeaway:
          'Shard location service by city, use optimistic locking for matching, pre-compute road graphs for ETA, and process payments asynchronously.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using straight-line distance instead of road network distance for matching',
        explanation:
          'A driver 500m away across a river might be 10 minutes away by road. Always use road-network ETA, not Euclidean distance.',
      },
      {
        mistake: 'Not handling the double-matching race condition',
        explanation:
          'Without atomicity, two ride requests can be matched to the same driver simultaneously. Use Redis SET NX or database row locking.',
      },
      {
        mistake: 'Processing location updates synchronously',
        explanation:
          'At 500K updates/sec, synchronous processing creates a bottleneck. Buffer through Kafka and process in batches or parallel consumers.',
      },
      {
        mistake: 'Ignoring driver location staleness',
        explanation:
          'A driver shown on the map but actually 5 blocks away creates a terrible experience. Use TTL to expire stale locations and show "last updated" indicators.',
      },
    ],
    practiceQuestions: [
      'How would you implement ride sharing (UberPool) where multiple riders share a vehicle?',
      'Design the driver earnings dashboard showing daily/weekly earnings, trips, and ratings.',
      'How would you handle the case where a driver goes offline (phone dies) in the middle of a trip?',
      'Uber Eats uses the same platform. What changes in the architecture for food delivery?',
      'How would you implement a scheduled ride feature (book a ride for 6 AM tomorrow)?',
    ],
  },

  // ─────────────────────────────────────────────
  // 17. DESIGN: NETFLIX STREAMING
  // ─────────────────────────────────────────────
  'design-netflix-streaming': {
    steps: [
      {
        title: 'Step 1: Requirements',
        content:
          'Let\'s design a video streaming platform like Netflix.\n\n**Functional Requirements:**\n- Upload and process video content (by content creators/studios)\n- Stream video to users with adaptive quality\n- Browse catalog: search, browse by genre, personalized recommendations\n- Continue watching / watch history\n- Multiple profiles per account\n- Offline downloads (mobile)\n\n**Non-Functional Requirements:**\n- Smooth playback with no buffering (< 1 second start time)\n- Support 200M subscribers, 100M concurrent streamers at peak\n- Global availability\n- Content must be protected (DRM — Digital Rights Management)\n\n**Capacity Estimation:**\n- 100M concurrent streams at peak\n- Average video: 3 Mbps (HD). 4K = 15 Mbps\n- Peak bandwidth: 100M * 3 Mbps = 300 Petabits/sec (!)\n- This is why Netflix is ~15% of all internet traffic\n- Content library: 15,000 titles, each in 10+ resolutions/formats\n- Storage per title: ~100 GB (all versions) → 1.5 PB total\n- New content: 100 titles/week → 10 TB/week',
        analogy:
          'Netflix is like a global movie theater chain that shows any movie on demand, adjusts the picture quality based on your screen and internet speed, and recommends what to watch based on what you\'ve enjoyed before.',
        keyTakeaway:
          'Netflix\'s core challenges: massive bandwidth (300 Pbps peak), video processing at scale, adaptive streaming, and content delivery to every corner of the globe.',
      },
      {
        title: 'Step 2: API Design',
        content:
          'Netflix\'s API serves the browsing experience, not the actual video bytes (that goes through CDN).',
        code: [
          {
            language: 'text',
            label: 'Netflix API Endpoints',
            code: `// Catalog & Browse
GET    /api/v1/catalog?genre=action&page=1  → Browse catalog
GET    /api/v1/search?q=stranger             → Search titles
GET    /api/v1/titles/:id                    → Title detail (metadata, episodes, similar)
GET    /api/v1/recommendations               → Personalized recommendations

// Playback
POST   /api/v1/playback/start               → Get streaming manifest { "titleId": "...", "profileId": "..." }
  Response: { "manifestUrl": "https://cdn.../manifest.mpd", "drmLicense": "..." }
POST   /api/v1/playback/heartbeat           → Report progress { "titleId": "...", "position": 1234 }
POST   /api/v1/playback/stop                → Save position, update watch history

// User & Profile
GET    /api/v1/profiles                      → List profiles for account
GET    /api/v1/profiles/:id/watchlist        → My List
POST   /api/v1/profiles/:id/watchlist/:titleId → Add to My List
GET    /api/v1/profiles/:id/history          → Continue Watching

// Content Ingestion (internal)
POST   /api/v1/content/upload               → Upload raw video file
GET    /api/v1/content/:id/status            → Transcoding job status`,
          },
        ],
        keyTakeaway:
          'The API handles metadata, playback initialization, and user state. Actual video bytes are served by CDN, not the API server.',
      },
      {
        title: 'Step 3: Video Transcoding Pipeline',
        content:
          'When Netflix receives a raw movie file (often 4K, 100+ GB), it must create dozens of versions:\n\n**Why Transcode?**\n- Different devices need different formats (H.264 for older devices, H.265/HEVC for modern, VP9 for Chrome)\n- Different resolutions: 240p, 360p, 480p, 720p, 1080p, 4K\n- Different bitrates within each resolution (for varying internet speeds)\n- Different audio tracks (5.1 surround, stereo, descriptions)\n- Subtitles in 30+ languages\n\n**The Pipeline:**\n1. **Upload**: Studio uploads raw master file to S3\n2. **Chunking**: Split video into 4-second chunks (segments)\n3. **Encoding**: Each chunk is independently encoded into every format/resolution/bitrate combination\n4. **Quality Check**: Automated quality metrics (VMAF score) verify each encoding\n5. **DRM**: Encrypt each chunk with Widevine/FairPlay/PlayReady\n6. **Manifest**: Generate a manifest file listing all available chunks and quality levels\n7. **CDN Distribution**: Push popular content to CDN edge servers globally\n\n**Scale**: One movie generates ~1,000 encoded files. Netflix runs this on thousands of EC2 instances in parallel.\n\nEncoding one 2-hour movie in all formats takes ~30 minutes with massive parallelism (vs 100+ hours on a single machine).',
        analogy:
          'Transcoding is like translating a book into 30 languages, 5 font sizes each, with braille and audiobook versions. Then shipping copies to every bookstore worldwide. The more formats you prepare upfront, the faster anyone can read it.',
        visual: 'flowchart',
        visualData: {
          nodes: [
            'Raw Upload (100GB)',
            'Split into 4-sec chunks',
            'Encode each chunk in 10+ formats',
            'DRM Encryption',
            'Generate Manifest',
            'Push to CDN',
          ],
          flow: 'linear',
        },
        keyTakeaway:
          'The transcoding pipeline splits videos into chunks, encodes each in multiple formats/resolutions/bitrates, encrypts with DRM, and distributes to CDN. Massive parallelism makes this fast.',
      },
      {
        title: 'Step 4: Adaptive Bitrate Streaming (ABR)',
        content:
          'This is the magic that prevents buffering. Instead of streaming one fixed quality, the player dynamically adjusts quality based on your current internet speed.\n\n**How ABR Works:**\n1. Player downloads the manifest file (lists all available quality levels with URLs)\n2. Player starts with a low quality (fast start — < 1 second)\n3. For each 4-second chunk, the player:\n   - Measures current download speed\n   - Checks buffer level (how many seconds are pre-loaded)\n   - Selects the highest quality that can download before the buffer runs out\n4. If speed drops (entered a tunnel), player switches to lower quality seamlessly\n5. If speed increases, player switches to higher quality\n\n**Protocols:**\n- **DASH (Dynamic Adaptive Streaming over HTTP)**: Open standard, used by Netflix on most platforms\n- **HLS (HTTP Live Streaming)**: Apple\'s protocol, used for iOS/Safari\n\nBoth work over regular HTTP/HTTPS — no special streaming servers needed.',
        code: [
          {
            language: 'xml',
            label: 'DASH Manifest (MPD) — Simplified',
            code: `<?xml version="1.0"?>
<MPD type="static" mediaPresentationDuration="PT2H3M">
  <Period>
    <AdaptationSet mimeType="video/mp4">
      <!-- 240p -->
      <Representation id="1" bandwidth="400000"
        width="426" height="240">
        <SegmentList>
          <SegmentURL media="seg_240p_001.mp4"/>
          <SegmentURL media="seg_240p_002.mp4"/>
          <!-- ... one entry per 4-second chunk -->
        </SegmentList>
      </Representation>

      <!-- 720p -->
      <Representation id="2" bandwidth="2500000"
        width="1280" height="720">
        <SegmentList>
          <SegmentURL media="seg_720p_001.mp4"/>
          <SegmentURL media="seg_720p_002.mp4"/>
        </SegmentList>
      </Representation>

      <!-- 1080p -->
      <Representation id="3" bandwidth="5000000"
        width="1920" height="1080">
        <SegmentList>
          <SegmentURL media="seg_1080p_001.mp4"/>
          <SegmentURL media="seg_1080p_002.mp4"/>
        </SegmentList>
      </Representation>
    </AdaptationSet>

    <AdaptationSet mimeType="audio/mp4" lang="en">
      <Representation id="audio_en" bandwidth="128000">
        <SegmentList>
          <SegmentURL media="audio_en_001.mp4"/>
        </SegmentList>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>`,
          },
        ],
        keyTakeaway:
          'ABR streaming splits video into small chunks available at multiple qualities. The player picks the best quality it can sustain for each chunk, adapting to network conditions in real-time.',
      },
      {
        title: 'Step 5: CDN Strategy — Open Connect',
        content:
          'Netflix is so large that traditional CDNs (CloudFront, Akamai) aren\'t enough. Netflix built its own CDN called **Open Connect**.\n\n**How Open Connect Works:**\n1. Netflix installs custom server appliances (OCA — Open Connect Appliances) directly inside ISPs\' data centers worldwide.\n2. Each OCA is a server with 100+ TB of SSD storage, pre-loaded with the content most likely to be watched in that region.\n3. When you press play, you stream from an OCA that\'s literally in your ISP\'s building — possibly just one network hop away.\n\n**Content Placement Algorithm:**\n- **Popular content**: Cached on every OCA worldwide\n- **Regional content**: Cached on OCAs in relevant regions (Bollywood movies on India OCAs)\n- **Long-tail content**: Only on the origin (S3). Fetched on demand if requested.\n- Placement decisions are made nightly based on predicted viewing patterns\n\n**The result:**\n- 95%+ of Netflix traffic is served from OCAs inside ISPs\n- Latency: < 10ms for most users\n- ISPs love it (reduces their backbone traffic)\n- Netflix saves billions on bandwidth costs\n\n**Fallback strategy:**\n- OCA fails → route to another OCA at the same ISP\n- ISP OCAs all fail → route to nearest regional hub\n- Regional hub fails → route to origin (S3)',
        analogy:
          'Instead of shipping DVDs from a central warehouse, Netflix puts mini warehouses inside every neighborhood. When you want a movie, it comes from your own neighborhood — nearly instant.',
        keyTakeaway:
          'Netflix\'s Open Connect places servers inside ISPs worldwide. 95% of traffic is served locally with < 10ms latency. Content placement is predicted nightly based on viewing patterns.',
      },
      {
        title: 'Step 6: Recommendation Engine',
        content:
          'Recommendations are Netflix\'s biggest competitive advantage — 80% of what users watch comes from recommendations.\n\n**How It Works (Simplified):**\n\n**1. Collaborative Filtering**\n"Users who watched X also watched Y."\n- Build a matrix of (user × title) ratings/watch history\n- Find similar users (cosine similarity) and recommend what they liked\n- At Netflix scale: matrix factorization (SVD) decomposes this into manageable dimensions\n\n**2. Content-Based Filtering**\n"You watched 5 sci-fi movies, here are more sci-fi movies."\n- Tag each title with genres, actors, mood, pacing, etc. (Netflix has ~2,000 micro-genres)\n- Match user\'s preference profile to title profiles\n\n**3. Hybrid: Deep Learning Model**\n- Input features: watch history, ratings, time of day, device, browse history, demographics\n- Model: Neural network that predicts probability of watching each title\n- Output: Ranked list of title recommendations\n\n**The Recommendation Pipeline:**\n1. **Offline**: Train ML models on historical data (nightly batch job)\n2. **Nearline**: Update user features in near-real-time (what they just watched)\n3. **Online**: At request time, score candidate titles using the model, rank, and return\n\n**Row-Level Personalization:**\nEven the artwork you see for each title is personalized. If you watch comedies, you see a funny scene from a thriller. If you watch romances, you see the romantic scene from the same thriller.',
        keyTakeaway:
          'Netflix recommendations use collaborative filtering, content-based filtering, and deep learning. Even the artwork is personalized. 80% of watched content comes from recommendations.',
      },
      {
        title: 'Step 7: Architecture and Bottlenecks',
        content:
          '**High-Level Architecture:**\n- **Control Plane** (AWS): API servers, user data, catalog, recommendations, billing\n- **Data Plane** (Open Connect): Video storage and streaming from OCAs worldwide\n- Control plane tells the client WHERE to stream from; data plane actually streams\n\n**Bottleneck 1: Thundering Herd on New Releases**\nMillions of users hit play on a new season at midnight.\nSolution: Pre-position content on all OCAs days before release. Stagger release by time zone.\n\n**Bottleneck 2: Transcoding Queue**\n100 new titles/week, each needing 1,000+ encoded versions.\nSolution: Massively parallel encoding on spot instances. Priority queue: upcoming releases go first.\n\n**Bottleneck 3: Playback Failures**\nAn OCA crashes → thousands of users lose their stream.\nSolution: Client detects failure (buffer running empty) and seamlessly switches to another OCA. The user sees a brief quality dip, nothing more.\n\n**Bottleneck 4: Cold Start in Recommendations**\nNew users have no watch history.\nSolution: Ask new users to pick a few titles they like. Use demographic signals (region, device, signup time) until enough data accumulates.\n\n**Key Metrics Netflix Monitors:**\n- Stream start time (target: < 1 second)\n- Re-buffer rate (target: < 0.1%)\n- Video quality distribution (% of streams at HD+)\n- Recommendation engagement (click-through rate)\n- OCA health (cache hit rate, latency)',
        visual: 'diagram',
        visualData: {
          type: 'architecture',
          components: [
            'Client (Smart TV, Phone, Browser)',
            'API Servers (AWS) — Catalog, Auth, Recs',
            'User DB (PostgreSQL/Cassandra)',
            'Recommendation Engine (ML)',
            'Transcoding Pipeline (Kafka + Workers)',
            'Object Storage (S3) — Master Files',
            'Open Connect CDN (ISP OCAs)',
            'Playback/Manifest Service',
          ],
        },
        keyTakeaway:
          'Netflix separates control plane (AWS: APIs, recommendations, catalog) from data plane (Open Connect: video delivery). This enables independent scaling of the two biggest workloads.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Not using adaptive bitrate streaming',
        explanation:
          'Fixed-quality streaming causes buffering on slow connections and wastes bandwidth on fast ones. ABR is essential for a good user experience.',
      },
      {
        mistake: 'Trying to stream from origin/S3 directly',
        explanation:
          'Streaming from a central location adds latency and costs a fortune in bandwidth. CDN (or Netflix\'s Open Connect) serves content from nearby edge servers.',
      },
      {
        mistake: 'Encoding video in a single resolution/format',
        explanation:
          'Users watch on phones, tablets, TVs, and laptops with varying screen sizes and internet speeds. You need multiple quality levels for ABR to work.',
      },
      {
        mistake: 'Not chunking video before encoding',
        explanation:
          'Without chunking, you can\'t do adaptive streaming (can\'t switch quality mid-stream) and you can\'t parallelize encoding efficiently.',
      },
    ],
    practiceQuestions: [
      'How would you implement the "Continue Watching" feature? What happens if a user watches on their phone and then switches to TV?',
      'Design the offline download feature for mobile. How do you handle DRM for downloaded content?',
      'How would you implement live streaming (like Netflix Live events) on top of this architecture?',
      'Netflix needs to handle content removal (licensing expires). How do you gracefully handle a user trying to watch content that was just removed?',
      'How would you design the "Skip Intro" feature? What data pipeline detects where intros start and end?',
    ],
  },
};
