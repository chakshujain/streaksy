import type { LessonStep } from '@/lib/learn-data';

export const databaseLessons: Record<
  string,
  {
    steps: LessonStep[];
    commonMistakes?: { mistake: string; explanation: string }[];
    practiceQuestions?: string[];
  }
> = {
  // ───────────────────────────────────────────────
  // 1. What is a Database?
  // ───────────────────────────────────────────────
  'what-is-a-database': {
    steps: [
      {
        title: 'The Filing Cabinet in Your Office',
        content:
          'Imagine you run a small business. At first you keep customer info on sticky notes. When you have 5 customers, that works. When you have 5,000, you need a filing cabinet with labeled drawers, folders, and an index card system.',
        analogy:
          'Sticky notes = storing data in random text files. A filing cabinet with labeled folders = a database. The label system is the schema, and flipping to the right folder is a query.',
        cards: [
          { title: 'Store', description: 'Persist data safely on disk', icon: '💾', color: 'blue' },
          { title: 'Organize', description: 'Structure data with schemas and relationships', icon: '📂', color: 'emerald' },
          { title: 'Query', description: 'Retrieve exactly the data you need, fast', icon: '🔍', color: 'purple' },
          { title: 'Protect', description: 'Enforce rules, handle crashes, control access', icon: '🛡️', color: 'amber' },
        ],
        keyTakeaway:
          'A database is an organized, queryable store of data — not just a pile of files.',
      },
      {
        title: 'Why Not Just Use Files?',
        content:
          'You could store everything in plain text or JSON files, right? Here is why that breaks down at scale.',
        bullets: [
          '**Concurrent access** — Two users editing the same file corrupt it. Databases handle thousands of simultaneous readers/writers safely.',
          '**Querying** — Finding all orders over $100 in a JSON file means reading the whole file. A database answers in milliseconds using indexes.',
          '**Integrity** — Files don\'t enforce rules. Databases guarantee every order references a real customer (foreign keys) and prices are never negative (constraints).',
          '**Crash recovery** — Half-written files corrupt data. Databases use transactions and write-ahead logs to recover cleanly.',
        ],
        comparison: {
          leftTitle: 'Plain Files',
          rightTitle: 'Database',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'No concurrency control', right: 'Handles thousands of concurrent users' },
            { left: 'Full scan to find anything', right: 'Index lookups in milliseconds' },
            { left: 'No data validation', right: 'Constraints, types, foreign keys' },
            { left: 'Half-written on crash', right: 'Transaction rollback + WAL recovery' },
          ],
        },
        analogy:
          'Using flat files for app data is like running a hospital where patient records are kept in a shared Google Doc. It works for two patients, but is a disaster at scale.',
        keyTakeaway:
          'Files lack concurrency control, fast querying, integrity constraints, and crash recovery — databases solve all four.',
      },
      {
        title: 'Relational Databases (SQL)',
        content:
          'The most popular type. Data is stored in tables (rows and columns) connected by relationships. You interact with them using SQL (Structured Query Language). Think of a spreadsheet where each sheet is a table, each row is a record, and each column is a field.',
        code: [
          {
            language: 'sql',
            label: 'A simple relational table',
            code: `CREATE TABLE customers (\n  id       SERIAL PRIMARY KEY,\n  name     VARCHAR(100) NOT NULL,\n  email    VARCHAR(255) UNIQUE NOT NULL,\n  country  VARCHAR(50)\n);\n\nINSERT INTO customers (name, email, country)\nVALUES ('Alice', 'alice@example.com', 'US');`,
          },
        ],
        table: {
          headers: ['Database', 'Best For', 'License'],
          rows: [
            ['PostgreSQL', 'Most feature-rich, JSONB support', 'Open source'],
            ['MySQL', 'Most widely deployed worldwide', 'Open source'],
            ['SQLite', 'Embedded / mobile / small apps', 'Public domain'],
            ['SQL Server', 'Enterprise / .NET ecosystem', 'Commercial'],
          ],
        },
        keyTakeaway:
          'Relational databases store data in structured tables linked by keys and are queried with SQL.',
      },
      {
        title: 'Document Databases (NoSQL)',
        content:
          'Instead of rows in tables, document databases store data as flexible JSON-like documents. Each document can have a different shape, making them great for data that doesn\'t fit neatly into rows and columns.',
        analogy:
          'Instead of a rigid spreadsheet, you have a folder of index cards where each card can have whatever fields it needs. One card might have a "phone" field, another might not.',
        code: [
          {
            language: 'javascript',
            label: 'A MongoDB document',
            code: `// In MongoDB, data looks like JSON\ndb.customers.insertOne({\n  name: "Alice",\n  email: "alice@example.com",\n  country: "US",\n  preferences: {\n    theme: "dark",\n    notifications: true\n  },\n  tags: ["premium", "early-adopter"]\n});`,
          },
        ],
        keyTakeaway:
          'Document databases trade rigid schemas for flexibility — each record can have its own structure.',
      },
      {
        title: 'Key-Value, Column, and Graph Databases',
        content:
          'Beyond relational and document stores, there are other specialized types. Each is optimized for a specific access pattern.',
        cards: [
          { title: 'Key-Value Stores', description: 'Giant hash map. Give key, get value. Blazing fast simple lookups. Redis, DynamoDB, etcd.', icon: '🔑', color: 'blue' },
          { title: 'Column-Family', description: 'Data stored column-by-column. Great for analytics across millions of rows. Cassandra, HBase.', icon: '📊', color: 'purple' },
          { title: 'Graph Databases', description: 'Nodes and edges (relationships). Perfect for social networks and recommendations. Neo4j, Neptune.', icon: '🕸️', color: 'emerald' },
          { title: 'Time-Series', description: 'Optimized for timestamped data. IoT sensors, metrics, monitoring. InfluxDB, TimescaleDB.', icon: '⏱️', color: 'amber' },
        ],
        analogy:
          'Key-value = a coat-check counter (give ticket, get coat). Column store = a library organized by subject across buildings. Graph DB = a social map where every person and friendship is a first-class citizen.',
        keyTakeaway:
          'Different workloads call for different database types — there is no one-size-fits-all.',
      },
      {
        title: 'How to Pick the Right Database',
        content:
          'Here is a quick decision framework. In practice, most applications start with a relational database because it is the most versatile.',
        flow: [
          { label: 'Structured + Relations?', description: 'PostgreSQL / MySQL', icon: '📋' },
          { label: 'Flexible / Nested?', description: 'MongoDB', icon: '📄' },
          { label: 'Fast Lookups / Cache?', description: 'Redis', icon: '⚡' },
          { label: 'Analytics?', description: 'Cassandra / ClickHouse', icon: '📊' },
          { label: 'Graph Data?', description: 'Neo4j', icon: '🕸️' },
        ],
        bullets: [
          'Many production systems use **multiple databases** — PostgreSQL for core data, Redis for caching, Elasticsearch for search.',
          'This is called **polyglot persistence** — using the right tool for each job.',
        ],
        keyTakeaway:
          'Start with a relational database. Add specialized stores when a specific use case demands it.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using a database when a simple file would suffice',
        explanation:
          'If you just need to read a config file at startup, a JSON or YAML file is fine. Databases shine when you need concurrent access, querying, or data integrity.',
      },
      {
        mistake: 'Choosing NoSQL because it sounds modern',
        explanation:
          'Relational databases handle the vast majority of use cases. Pick NoSQL only when you have a concrete reason — flexible schemas, massive horizontal scale, or graph-like queries.',
      },
      {
        mistake: 'Ignoring data modeling entirely',
        explanation:
          'Throwing data into a database without thinking about table structure, types, and relationships leads to painful migrations later. Invest time upfront in your schema.',
      },
    ],
    practiceQuestions: [
      'Name three problems that arise when using plain text files instead of a database for a multi-user web app.',
      'You are building a social network. Which type(s) of database would you consider and why?',
      'Explain the difference between a relational database and a document database in your own words.',
      'What is polyglot persistence, and when would you use it?',
    ],
  },

  // ───────────────────────────────────────────────
  // 2. SQL Basics: SELECT, WHERE, ORDER BY
  // ───────────────────────────────────────────────
  'sql-basics-select-where-order-by': {
    steps: [
      {
        title: 'SQL is Ordering From a Menu',
        content:
          'SQL stands for Structured Query Language. It is the universal language for talking to relational databases — PostgreSQL, MySQL, SQLite, or SQL Server all use the same core syntax.',
        analogy:
          'SELECT name, price FROM menu WHERE category = \'vegetarian\' ORDER BY price ASC is like telling the waiter: "Show me the names and prices of vegetarian dishes, cheapest first."',
        cards: [
          { title: 'SELECT', description: '"I\'d like these items" — which columns', icon: '✅', color: 'emerald' },
          { title: 'FROM', description: '"From this section of the menu" — which table', icon: '📋', color: 'blue' },
          { title: 'WHERE', description: '"But only the vegetarian ones" — filter rows', icon: '🔍', color: 'purple' },
          { title: 'ORDER BY', description: '"Sorted by price, cheapest first" — sorting', icon: '↕️', color: 'amber' },
        ],
        keyTakeaway:
          'SQL is a declarative language — you describe WHAT data you want, not HOW to get it.',
      },
      {
        title: 'Our Sample Table: employees',
        content:
          'Let us set up a table we will use throughout this lesson. Every row is one person, and every column is a piece of information about them.',
        code: [
          {
            language: 'sql',
            label: 'Create and populate the employees table',
            code: `CREATE TABLE employees (\n  id         SERIAL PRIMARY KEY,\n  name       VARCHAR(100) NOT NULL,\n  department VARCHAR(50),\n  salary     NUMERIC(10, 2),\n  hire_date  DATE,\n  is_active  BOOLEAN DEFAULT true\n);\n\nINSERT INTO employees (name, department, salary, hire_date) VALUES\n  ('Alice',   'Engineering', 95000, '2020-03-15'),\n  ('Bob',     'Marketing',   72000, '2019-07-01'),\n  ('Charlie', 'Engineering', 110000, '2018-01-20'),\n  ('Diana',   'Sales',       68000, '2021-11-03'),\n  ('Eve',     'Engineering', 105000, '2020-06-10'),\n  ('Frank',   'Marketing',   78000, '2017-09-25'),\n  ('Grace',   'Sales',       71000, '2022-02-14');`,
          },
        ],
        table: {
          headers: ['id', 'name', 'department', 'salary', 'hire_date'],
          rows: [
            ['1', 'Alice', 'Engineering', '95,000', '2020-03-15'],
            ['2', 'Bob', 'Marketing', '72,000', '2019-07-01'],
            ['3', 'Charlie', 'Engineering', '110,000', '2018-01-20'],
            ['4', 'Diana', 'Sales', '68,000', '2021-11-03'],
            ['5', 'Eve', 'Engineering', '105,000', '2020-06-10'],
            ['6', 'Frank', 'Marketing', '78,000', '2017-09-25'],
            ['7', 'Grace', 'Sales', '71,000', '2022-02-14'],
          ],
        },
        keyTakeaway:
          'Always have a clear mental picture of the table you are querying — know the column names and types.',
      },
      {
        title: 'SELECT — Picking Your Columns',
        content:
          'The SELECT clause tells the database which columns you want in your result. You rarely need every column, so selecting only what you need makes results cleaner and queries faster.',
        code: [
          {
            language: 'sql',
            label: 'Basic SELECT examples',
            code: `-- Get all columns for all employees\nSELECT * FROM employees;\n\n-- Get only names and salaries\nSELECT name, salary FROM employees;\n\n-- Get unique departments (no duplicates)\nSELECT DISTINCT department FROM employees;\n\n-- Rename a column in the output with AS\nSELECT name, salary AS annual_pay FROM employees;`,
          },
        ],
        analogy:
          'SELECT is like choosing which columns of a spreadsheet to display. You never need to print every column when you only care about names and salaries.',
        diagram: `users table:
┌────┬──────────┬─────────────────┬─────┐
│ id │ name     │ email           │ age │
├────┼──────────┼─────────────────┼─────┤
│ 1  │ Alice    │ alice@mail.com  │ 25  │
│ 2  │ Bob      │ bob@mail.com    │ 30  │
│ 3  │ Charlie  │ charlie@mail.com│ 22  │
└────┴──────────┴─────────────────┴─────┘
  ▲       ▲
  SELECT id, name → only these columns returned`,
        keyTakeaway:
          'SELECT * is fine for exploring, but in production code always list the specific columns you need.',
      },
      {
        title: 'WHERE — Filtering Rows',
        content:
          'WHERE is your filter. It keeps only the rows that satisfy a condition. You can combine conditions with AND, OR, and NOT.',
        code: [
          {
            language: 'sql',
            label: 'WHERE clause examples',
            code: `-- Employees in Engineering\nSELECT name, salary FROM employees\nWHERE department = 'Engineering';\n\n-- Salary above 80k\nSELECT name, salary FROM employees\nWHERE salary > 80000;\n\n-- Combine conditions with AND\nSELECT name FROM employees\nWHERE department = 'Engineering' AND salary > 100000;\n\n-- IN is shorthand for multiple OR\nSELECT name FROM employees\nWHERE department IN ('Sales', 'Marketing');\n\n-- Pattern matching with LIKE\nSELECT name FROM employees\nWHERE name LIKE 'A%';  -- names starting with A\n\n-- NULL checks (use IS NULL, not = NULL)\nSELECT name FROM employees\nWHERE department IS NOT NULL;`,
          },
        ],
        table: {
          headers: ['Operator', 'Meaning', 'Example'],
          rows: [
            ['=', 'Exact match', "department = 'Sales'"],
            ['>, <, >=, <=', 'Comparison', 'salary > 80000'],
            ['IN', 'Match any in list', "dept IN ('A','B')"],
            ['LIKE', 'Pattern match', "name LIKE 'A%'"],
            ['IS NULL', 'Check for null', 'email IS NULL'],
            ['BETWEEN', 'Range inclusive', 'salary BETWEEN 70000 AND 90000'],
          ],
        },
        analogy:
          'WHERE is like a bouncer at a club — only rows that meet the criteria get through.',
        keyTakeaway:
          'Use = for exact matches, LIKE for patterns, IN for lists, IS NULL for null checks, and AND/OR to combine.',
      },
      {
        title: 'ORDER BY — Sorting Your Results',
        content:
          'ORDER BY controls the sort order of your results. By default it sorts ascending (ASC). Add DESC for descending. You can sort by multiple columns — the second column breaks ties in the first.',
        code: [
          {
            language: 'sql',
            label: 'ORDER BY examples',
            code: `-- Sort by salary, highest first\nSELECT name, salary FROM employees\nORDER BY salary DESC;\n\n-- Sort by department alphabetically, then salary within each dept\nSELECT name, department, salary FROM employees\nORDER BY department ASC, salary DESC;\n\n-- Combine with WHERE\nSELECT name, salary FROM employees\nWHERE department = 'Engineering'\nORDER BY salary DESC;`,
          },
        ],
        comparison: {
          leftTitle: 'ASC (Default)',
          rightTitle: 'DESC',
          items: [
            { left: 'Alice (22)', right: 'Charlie (35)' },
            { left: 'Bob (25)', right: 'Bob (25)' },
            { left: 'Charlie (35)', right: 'Alice (22)' },
            { left: 'Smallest → Largest', right: 'Largest → Smallest' },
            { left: 'A → Z for text', right: 'Z → A for text' },
            { left: 'Oldest → Newest for dates', right: 'Newest → Oldest for dates' },
          ],
        },
        keyTakeaway:
          'ORDER BY goes after WHERE. Use ASC (default) or DESC, and chain multiple columns for tie-breaking.',
      },
      {
        title: 'LIMIT and OFFSET — Pagination',
        content:
          'When you have thousands of results, you rarely want them all at once. LIMIT restricts how many rows you get back, and OFFSET skips a number of rows — together they give you pagination.',
        analogy:
          'This is how every "Page 1, Page 2, Page 3..." feature works under the hood.',
        code: [
          {
            language: 'sql',
            label: 'Pagination examples',
            code: `-- Top 3 highest-paid employees\nSELECT name, salary FROM employees\nORDER BY salary DESC\nLIMIT 3;\n\n-- Page 2 of results (items 4-6)\nSELECT name, salary FROM employees\nORDER BY salary DESC\nLIMIT 3 OFFSET 3;\n\n-- Just peek at one row to see the table structure\nSELECT * FROM employees LIMIT 1;`,
          },
        ],
        keyTakeaway:
          'LIMIT controls how many rows to return; OFFSET controls how many to skip. Always pair with ORDER BY for consistent pagination.',
      },
      {
        title: 'Aggregate Functions — COUNT, SUM, AVG, MIN, MAX',
        content:
          'Sometimes you don\'t want individual rows — you want a summary. Aggregate functions collapse many rows into a single value. GROUP BY lets you get one summary per group.',
        code: [
          {
            language: 'sql',
            label: 'Aggregation examples',
            code: `-- How many employees total?\nSELECT COUNT(*) FROM employees;\n\n-- Average salary\nSELECT AVG(salary) AS avg_salary FROM employees;\n\n-- Average salary PER department\nSELECT department, AVG(salary) AS avg_salary, COUNT(*) AS headcount\nFROM employees\nGROUP BY department;\n\n-- Only departments with avg salary > 80k\nSELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 80000;`,
          },
        ],
        cards: [
          { title: 'COUNT', description: 'Counts the number of rows. COUNT(*) includes NULLs, COUNT(col) skips NULLs.', icon: '#️⃣', color: 'blue' },
          { title: 'SUM', description: 'Adds up all values in a numeric column. Returns NULL if all values are NULL.', icon: '➕', color: 'emerald' },
          { title: 'AVG', description: 'Calculates the arithmetic mean. Ignores NULL values in the calculation.', icon: '📊', color: 'purple' },
          { title: 'MIN', description: 'Returns the smallest value. Works on numbers, strings, and dates.', icon: '⬇️', color: 'amber' },
          { title: 'MAX', description: 'Returns the largest value. Works on numbers, strings, and dates.', icon: '⬆️', color: 'red' },
        ],
        analogy:
          'COUNT is like counting heads in a room. AVG is the average test score. GROUP BY is splitting the room by team first, then counting each team separately.',
        keyTakeaway:
          'Use GROUP BY with aggregate functions for per-group summaries. Use HAVING (not WHERE) to filter groups.',
      },
      {
        title: 'Putting It All Together',
        content:
          'Let us write a real-world query combining everything. Your manager asks: "Show me the top 3 departments by average salary, but only include departments with at least 2 employees."',
        code: [
          {
            language: 'sql',
            label: 'Full query combining all concepts',
            code: `SELECT\n  department,\n  COUNT(*) AS headcount,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MIN(salary) AS lowest,\n  MAX(salary) AS highest\nFROM employees\nWHERE is_active = true\nGROUP BY department\nHAVING COUNT(*) >= 2\nORDER BY avg_salary DESC\nLIMIT 3;`,
          },
        ],
        flow: [
          { label: 'FROM', description: 'Pick the table', icon: '📋' },
          { label: 'WHERE', description: 'Filter individual rows', icon: '🔍' },
          { label: 'GROUP BY', description: 'Form groups', icon: '📦' },
          { label: 'HAVING', description: 'Filter groups', icon: '⚖️' },
          { label: 'SELECT', description: 'Pick columns', icon: '✅' },
          { label: 'ORDER BY', description: 'Sort results', icon: '↕️' },
          { label: 'LIMIT', description: 'Cap output', icon: '✂️' },
        ],
        keyTakeaway:
          'The SQL execution order is: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT. Understanding this order prevents most beginner mistakes.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using WHERE to filter aggregated results',
        explanation:
          'WHERE filters individual rows before grouping. To filter after aggregation (e.g., "departments with avg salary > 80k"), use HAVING.',
      },
      {
        mistake: 'Comparing to NULL with = instead of IS',
        explanation:
          'NULL is not a value — it is the absence of a value. "salary = NULL" is always false. Use "salary IS NULL" or "salary IS NOT NULL".',
      },
      {
        mistake: 'Using SELECT * in production queries',
        explanation:
          'SELECT * fetches every column, even ones you do not need. This wastes bandwidth, prevents index-only scans, and breaks your app if a column is added or renamed.',
      },
      {
        mistake: 'Forgetting ORDER BY with LIMIT',
        explanation:
          'Without ORDER BY, the database can return rows in any order. "LIMIT 10" without ORDER BY gives you 10 random rows — not the top 10 of anything.',
      },
    ],
    practiceQuestions: [
      'Write a query to find all employees hired in 2020 or later, sorted by hire date.',
      'What is the difference between WHERE and HAVING? Give an example of each.',
      'Write a query that returns the department with the highest total salary spend.',
      'Explain why SELECT * is discouraged in production code.',
      'Write a pagination query to get employees 11-20 sorted by name alphabetically.',
    ],
  },

  // ───────────────────────────────────────────────
  // 3. JOINs — Connecting Tables
  // ───────────────────────────────────────────────
  'joins-connecting-tables': {
    steps: [
      {
        title: 'Why Do We Split Data Into Multiple Tables?',
        content:
          'Imagine a spreadsheet where every order includes the customer\'s full address, phone number, and email — repeated on every row. If Alice places 50 orders, her address appears 50 times. If she moves, you update all 50 rows.',
        bullets: [
          'Relational databases solve this by **splitting data into separate tables**.',
          'Customers go in one table, orders in another, connected by customer_id.',
          'JOINs bring the data back together when you need it.',
        ],
        analogy:
          'Think of two phone contact lists. One has names and phone numbers, the other has names and emails. A JOIN merges them into one list by matching on the name.',
        diagram: `┌──────────────┐     ┌──────────────────┐\n│  customers   │     │     orders       │\n├──────────────┤     ├──────────────────┤\n│ id (PK)      │◄────│ customer_id (FK) │\n│ name         │     │ id (PK)          │\n│ city         │     │ product          │\n│ email        │     │ amount           │\n└──────────────┘     └──────────────────┘`,
        keyTakeaway:
          'JOINs combine rows from two or more tables based on a related column (usually a foreign key).',
      },
      {
        title: 'Our Sample Tables',
        content:
          'Let us set up two tables we will use for all our JOIN examples.',
        code: [
          {
            language: 'sql',
            label: 'Create customers and orders tables',
            code: `CREATE TABLE customers (\n  id      SERIAL PRIMARY KEY,\n  name    VARCHAR(100),\n  city    VARCHAR(50)\n);\n\nCREATE TABLE orders (\n  id          SERIAL PRIMARY KEY,\n  customer_id INT REFERENCES customers(id),\n  product     VARCHAR(100),\n  amount      NUMERIC(10, 2),\n  order_date  DATE\n);\n\nINSERT INTO customers (id, name, city) VALUES\n  (1, 'Alice', 'New York'),\n  (2, 'Bob',   'Chicago'),\n  (3, 'Charlie', 'Seattle'),\n  (4, 'Diana', 'Austin');    -- Diana has no orders\n\nINSERT INTO orders (id, customer_id, product, amount, order_date) VALUES\n  (101, 1, 'Laptop',    999.99, '2024-01-15'),\n  (102, 1, 'Mouse',      29.99, '2024-01-15'),\n  (103, 2, 'Keyboard',   79.99, '2024-02-03'),\n  (104, 3, 'Monitor',   349.99, '2024-02-20'),\n  (105, NULL, 'USB Cable', 9.99, '2024-03-01');  -- orphan order`,
          },
        ],
        diagram: `customers                          orders
┌────┬─────────┬──────────┐        ┌─────┬─────────────┬──────────┬────────┐
│ id │ name    │ city     │        │ id  │ customer_id │ product  │ amount │
├────┼─────────┼──────────┤        ├─────┼─────────────┼──────────┼────────┤
│ 1  │ Alice   │ New York │◄───────│ 101 │ 1           │ Laptop   │ 999.99 │
│    │         │          │◄───────│ 102 │ 1           │ Mouse    │  29.99 │
│ 2  │ Bob     │ Chicago  │◄───────│ 103 │ 2           │ Keyboard │  79.99 │
│ 3  │ Charlie │ Seattle  │◄───────│ 104 │ 3           │ Monitor  │ 349.99 │
│ 4  │ Diana   │ Austin   │  ╳    │ 105 │ NULL        │ USB Cable│   9.99 │
└────┴─────────┴──────────┘        └─────┴─────────────┴──────────┴────────┘
         ▲                                    │
         └────── Foreign Key (customer_id) ───┘`,
        keyTakeaway:
          'Notice Diana (customer 4) has no orders, and order 105 has no customer. These edge cases make JOINs interesting.',
      },
      {
        title: 'INNER JOIN — Only the Matches',
        content:
          'An INNER JOIN returns only rows where there is a match in BOTH tables. No match = excluded.',
        code: [
          {
            language: 'sql',
            label: 'INNER JOIN example',
            code: `SELECT c.name, o.product, o.amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;\n\n-- Result:\n-- Alice   | Laptop   | 999.99\n-- Alice   | Mouse    |  29.99\n-- Bob     | Keyboard |  79.99\n-- Charlie | Monitor  | 349.99\n-- (Diana excluded — no orders)\n-- (USB Cable excluded — no customer)`,
          },
        ],
        diagram: `  ┌─────────┐   ┌─────────┐\n  │customers│   │ orders  │\n  │  ┌──────┼───┼──┐      │\n  │  │INNER │   │  │      │\n  │  │ JOIN │   │  │      │\n  │  └──────┼───┼──┘      │\n  └─────────┘   └─────────┘\n  Only the overlapping rows`,
        analogy:
          'INNER JOIN is like a Venn diagram — you only get the overlap. Two friend groups at a party: INNER JOIN returns only people in BOTH groups.',
        keyTakeaway:
          'INNER JOIN = give me only the rows that have a match on both sides.',
      },
      {
        title: 'LEFT JOIN — All From the Left, Matches From the Right',
        content:
          'A LEFT JOIN returns ALL rows from the left table, even if there is no match in the right table. When there is no match, right-side columns are NULL.',
        code: [
          {
            language: 'sql',
            label: 'LEFT JOIN example',
            code: `SELECT c.name, o.product, o.amount\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;\n\n-- Result includes Diana with NULLs:\n-- Diana   | NULL     | NULL\n\n-- Find customers with NO orders:\nSELECT c.name\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;\n-- Result: Diana`,
          },
        ],
        diagram: `  ┌─────────────────────────────────┐
  │  LEFT JOIN                      │
  │  ┌───────────┐   ┌───────────┐  │
  │  │███████████│   │           │  │
  │  │███████████│   │           │  │
  │  │███ALL█████├───┤ matching  │  │
  │  │███LEFT████│   │  right    │  │
  │  │███████████│   │           │  │
  │  │███████████│   │           │  │
  │  └───────────┘   └───────────┘  │
  │  All left rows kept             │
  │  NULLs where no right match     │
  └─────────────────────────────────┘`,
        analogy:
          'LEFT JOIN is like a class roster matched against submitted homework. Every student appears — those who did not submit get a blank next to their name.',
        keyTakeaway:
          'LEFT JOIN keeps all rows from the left table. NULLs appear where there is no match on the right.',
      },
      {
        title: 'RIGHT JOIN and FULL OUTER JOIN',
        content:
          'RIGHT JOIN is the mirror of LEFT JOIN. FULL OUTER JOIN keeps ALL rows from BOTH tables.',
        code: [
          {
            language: 'sql',
            label: 'RIGHT JOIN and FULL OUTER JOIN',
            code: `-- RIGHT JOIN: all orders, even if no matching customer\nSELECT c.name, o.product, o.amount\nFROM customers c\nRIGHT JOIN orders o ON c.id = o.customer_id;\n-- Includes USB Cable with NULL customer\n\n-- FULL OUTER JOIN: everything from both sides\nSELECT c.name, o.product, o.amount\nFROM customers c\nFULL OUTER JOIN orders o ON c.id = o.customer_id;\n-- Diana -> NULLs on right, USB Cable -> NULL on left`,
          },
        ],
        comparison: {
          leftTitle: 'JOIN Type',
          rightTitle: 'What It Returns',
          items: [
            { left: 'INNER JOIN', right: 'Only matching rows from both sides' },
            { left: 'LEFT JOIN', right: 'All left rows + matching right (NULLs if no match)' },
            { left: 'RIGHT JOIN', right: 'All right rows + matching left (NULLs if no match)' },
            { left: 'FULL OUTER JOIN', right: 'All rows from both sides (NULLs where no match)' },
            { left: 'CROSS JOIN', right: 'Every row paired with every other row (Cartesian product)' },
          ],
        },
        keyTakeaway:
          'RIGHT JOIN = mirror of LEFT JOIN. FULL OUTER JOIN = keep everything from both tables, NULLs where no match.',
      },
      {
        title: 'CROSS JOIN and Self JOIN',
        content:
          'CROSS JOIN produces the Cartesian product — every row from A paired with every row from B. Self JOIN is when a table joins to itself, useful for hierarchical data.',
        code: [
          {
            language: 'sql',
            label: 'CROSS JOIN and Self JOIN',
            code: `-- CROSS JOIN: 4 customers x 5 orders = 20 rows\nSELECT c.name, o.product\nFROM customers c CROSS JOIN orders o;\n\n-- Self JOIN: employees and their managers\nCREATE TABLE staff (\n  id INT PRIMARY KEY, name VARCHAR(100),\n  manager_id INT REFERENCES staff(id)\n);\nINSERT INTO staff VALUES\n  (1, 'CEO', NULL), (2, 'VP Eng', 1), (3, 'Sr Dev', 2);\n\nSELECT s.name AS employee, m.name AS manager\nFROM staff s LEFT JOIN staff m ON s.manager_id = m.id;`,
          },
        ],
        analogy:
          'CROSS JOIN is like pairing every shirt with every pair of pants — the total outfits = shirts x pants. Self JOIN is like an employee looking up their own boss in the same company directory.',
        keyTakeaway:
          'CROSS JOIN = every combination (rarely desired). Self JOIN = a table joined to itself (great for hierarchies).',
      },
      {
        title: 'Joining Multiple Tables',
        content:
          'Real applications often join three, four, or more tables. Each JOIN adds one more table to the result, chaining on ON conditions.',
        code: [
          {
            language: 'sql',
            label: 'Three-table JOIN',
            code: `CREATE TABLE products (\n  id SERIAL PRIMARY KEY, name VARCHAR(100), category VARCHAR(50)\n);\n\n-- Join customers -> orders -> products\nSELECT c.name AS customer, o.amount,\n  p.name AS product, p.category\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nJOIN products p ON o.product = p.name\nWHERE p.category = 'Electronics'\nORDER BY o.amount DESC;`,
          },
        ],
        flow: [
          { label: 'customers', description: 'Start with base table', icon: '👤' },
          { label: 'JOIN orders', description: 'ON c.id = o.customer_id', icon: '📦' },
          { label: 'JOIN products', description: 'ON o.product = p.name', icon: '🏷️' },
          { label: 'Result', description: 'Combined 3-table output', icon: '✅' },
        ],
        keyTakeaway:
          'You can chain as many JOINs as needed. Each subsequent JOIN connects to a column already present in the query.',
      },
      {
        title: 'JOIN Performance Tips',
        content:
          'JOINs are powerful but can be slow if used carelessly.',
        bullets: [
          '**Always JOIN on indexed columns.** FK columns should have indexes.',
          '**Select only the columns you need.** Don\'t SELECT * from a 5-table JOIN.',
          '**Be careful with FULL OUTER JOINs.** Harder for the optimizer than INNER/LEFT.',
          '**Watch for accidental CROSS JOINs.** Missing ON clause = millions of rows.',
          '**Use EXPLAIN** to see the query plan and verify indexes are used.',
        ],
        cards: [
          { title: 'Index Foreign Keys', description: 'Always create indexes on FK columns used in JOIN conditions. Without them, the DB does a full table scan for every match.', icon: '🔑', color: 'emerald' },
          { title: 'Avoid SELECT *', description: 'Select only the columns you need. Fewer columns = less I/O, smaller result sets, and potential index-only scans.', icon: '🎯', color: 'blue' },
          { title: 'Use EXPLAIN', description: 'Run EXPLAIN ANALYZE before your query to see the execution plan. Look for Seq Scans on large tables — they signal missing indexes.', icon: '📋', color: 'purple' },
          { title: 'Limit JOINs', description: 'Each JOIN multiplies complexity. If you are joining 5+ tables, consider denormalizing or breaking into separate queries.', icon: '⚠️', color: 'amber' },
        ],
        keyTakeaway:
          'Index your JOIN columns, select only needed columns, and use EXPLAIN to verify the database is not doing unnecessary work.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the ON clause and accidentally creating a CROSS JOIN',
        explanation:
          'If you write "FROM a, b" without a WHERE condition, you get a Cartesian product. 10K rows each = 100 million rows.',
      },
      {
        mistake: 'Using the wrong JOIN type and silently dropping rows',
        explanation:
          'An INNER JOIN drops customers with no orders. If your report says 100 customers but you have 120, you probably need a LEFT JOIN.',
      },
      {
        mistake: 'Not using table aliases',
        explanation:
          'When multiple tables have a column called "id" or "name", queries become ambiguous. Always use short aliases.',
      },
      {
        mistake: 'Joining on non-indexed columns',
        explanation:
          'Without an index on the JOIN column, the database scans the entire table for every row. Fast query becomes minutes-long.',
      },
    ],
    practiceQuestions: [
      'Write a query to show all customers and their orders, including customers who have never ordered.',
      'What is the difference between INNER JOIN and LEFT JOIN? When would you use each?',
      'Write a query to find all orders that have no matching customer (orphan orders).',
      'Explain what a Cartesian product is and how an accidental CROSS JOIN can cause one.',
      'You have three tables: students, enrollments, and courses. Write a query to list each student with the courses they are enrolled in.',
    ],
  },

  // ───────────────────────────────────────────────
  // 4. Indexing — Making Queries Fast
  // ───────────────────────────────────────────────
  'indexing-making-queries-fast': {
    steps: [
      {
        title: 'The Book Index Analogy',
        content:
          'Imagine a 1,000-page textbook. Without an index, you read every page to find "photosynthesis." With the index, you look up the page numbers and jump directly there.',
        analogy:
          'No index = reading every page of a book. Index = flipping to the back, finding the page number, and jumping there. The index takes extra pages (space) but saves enormous time.',
        comparison: {
          leftTitle: 'Without Index',
          rightTitle: 'With Index',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Scan all 10M rows', right: 'B-tree lookup in ~20 steps' },
            { left: '~3 seconds', right: '~0.001 seconds' },
            { left: 'O(n) linear scan', right: 'O(log n) tree traversal' },
            { left: 'No extra storage', right: 'Extra disk space for index' },
          ],
        },
        keyTakeaway:
          'An index trades storage space for query speed — it lets the database find rows without scanning the entire table.',
      },
      {
        title: 'How B-Tree Indexes Work',
        content:
          'Most databases use B-trees for indexes. A B-tree keeps values sorted in a balanced tree structure. Each level cuts the search space dramatically. For 1 million rows, a B-tree finds any value in about 20 comparisons.',
        analogy:
          'A B-tree is like a well-organized library. The root node is the building directory (Floor 1: A-M, Floor 2: N-Z). Each floor has sections, each section has shelves. You narrow down at every level.',
        diagram: `           ┌──────────────┐\n           │  Root: [M]   │\n           └──┬───────┬───┘\n         ┌────┘       └────┐\n    ┌────┴─────┐    ┌──────┴────┐\n    │ [D] [H]  │    │ [R] [V]   │\n    └┬──┬──┬───┘    └┬──┬──┬───┘\n     │  │  │         │  │  │\n   ┌─┘ ┌┘ ┌┘       ┌─┘ ┌┘ ┌┘\n   ▼   ▼   ▼       ▼   ▼   ▼\n  A-C D-G H-L     M-Q R-U V-Z\n  (leaf nodes point to actual rows)`,
        keyTakeaway:
          'B-trees keep data sorted in a balanced tree. Finding any value takes O(log n) — about 20 steps for a million rows.',
      },
      {
        title: 'Creating and Using Indexes',
        content:
          'Creating an index is simple. The database does the heavy lifting of building and maintaining the B-tree.',
        code: [
          {
            language: 'sql',
            label: 'Creating indexes',
            code: `-- Single-column index\nCREATE INDEX idx_employees_department\n  ON employees(department);\n\n-- Composite index (multiple columns)\nCREATE INDEX idx_employees_dept_salary\n  ON employees(department, salary);\n\n-- Unique index (also enforces uniqueness)\nCREATE UNIQUE INDEX idx_employees_email\n  ON employees(email);\n\n-- Partial index (only indexes some rows)\nCREATE INDEX idx_active_employees\n  ON employees(name)\n  WHERE is_active = true;\n\n-- Check existing indexes (PostgreSQL)\nSELECT indexname, indexdef\nFROM pg_indexes WHERE tablename = 'employees';`,
          },
        ],
        keyTakeaway:
          'CREATE INDEX on columns you frequently search, filter, or join on. Composite indexes cover multi-column queries.',
      },
      {
        title: 'When Indexes Help vs Hurt',
        content:
          'Indexes are not free. They have real costs that you must weigh against the benefits.',
        comparison: {
          leftTitle: 'Indexes Help',
          rightTitle: 'Indexes Hurt',
          leftColor: 'emerald',
          rightColor: 'red',
          items: [
            { left: 'WHERE clause filters', right: 'Every INSERT updates all indexes' },
            { left: 'JOIN conditions', right: 'Every UPDATE/DELETE updates indexes' },
            { left: 'ORDER BY sorting', right: 'Extra disk storage per index' },
            { left: 'MIN/MAX aggregations', right: 'Low-cardinality columns (boolean)' },
            { left: 'Large tables (millions of rows)', right: 'Small tables (< 1000 rows)' },
          ],
        },
        analogy:
          'Each index is like maintaining a separate sorted list of contacts — by name, by city, by birthday. 2-3 lists are helpful. 20 lists means every new contact requires 20 updates.',
        keyTakeaway:
          'Indexes speed up reads but slow down writes. Add them strategically for your most critical query patterns.',
      },
      {
        title: 'Composite Index Column Order Matters',
        content:
          'A composite index on (department, salary) follows the "leftmost prefix" rule. It can help queries that filter on department, or department + salary, but NOT salary alone.',
        code: [
          {
            language: 'sql',
            label: 'Composite index usage',
            code: `CREATE INDEX idx_dept_salary ON employees(department, salary);\n\n-- Uses the index (leftmost column)\nSELECT * FROM employees WHERE department = 'Engineering';\n\n-- Uses the index (both columns)\nSELECT * FROM employees\nWHERE department = 'Engineering' AND salary > 100000;\n\n-- Does NOT use this index (skips leftmost)\nSELECT * FROM employees WHERE salary > 100000;\n-- Need a separate index on salary for this.`,
          },
        ],
        analogy:
          'A phone book is sorted by last name, then first name. You can find all "Smiths" or "Smith, Alice" easily. But finding all "Alices" across all last names requires scanning the whole book.',
        keyTakeaway:
          'Put the most-filtered column first in a composite index. The "leftmost prefix" rule determines which queries can use it.',
      },
      {
        title: 'Types of Indexes Beyond B-Tree',
        content:
          'B-tree is the default, but databases offer specialized index types for different use cases.',
        cards: [
          { title: 'Hash Index', description: 'Perfect for exact equality (=). Cannot handle range queries (>, <).', icon: '#️⃣', color: 'blue' },
          { title: 'GIN Index', description: 'Full-text search, arrays, JSONB. Search inside documents.', icon: '📝', color: 'emerald' },
          { title: 'GiST Index', description: 'Geometric data, ranges, nearest-neighbor. PostGIS uses this.', icon: '🗺️', color: 'purple' },
          { title: 'BRIN Index', description: 'Ultra-compact for naturally sorted data (timestamps in logs).', icon: '📅', color: 'amber' },
        ],
        code: [
          {
            language: 'sql',
            label: 'Specialized index types (PostgreSQL)',
            code: `-- Hash index for exact lookups\nCREATE INDEX idx_email_hash ON users USING hash(email);\n\n-- GIN index for full-text search\nCREATE INDEX idx_search ON articles\n  USING gin(to_tsvector('english', body));\n\n-- GIN index for JSONB queries\nCREATE INDEX idx_metadata ON products USING gin(metadata);\n\n-- BRIN index for time-series data\nCREATE INDEX idx_created ON events USING brin(created_at);`,
          },
        ],
        keyTakeaway:
          'B-tree is the default. Use Hash for equality, GIN for text/JSON search, and BRIN for sorted time-series data.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Creating indexes on every column "just in case"',
        explanation:
          'Each index slows writes and uses disk space. Only index columns that appear in frequent WHERE, JOIN, and ORDER BY clauses.',
      },
      {
        mistake: 'Wrong column order in composite indexes',
        explanation:
          'An index on (A, B) helps queries filtering on A or A+B, but not B alone. Put the most selective column first.',
      },
      {
        mistake: 'Indexing low-cardinality columns like booleans',
        explanation:
          'An index on true/false is rarely useful — half the rows match either way. Consider a partial index instead.',
      },
      {
        mistake: 'Never checking if indexes are actually being used',
        explanation:
          'Use EXPLAIN ANALYZE to verify the database is using your index. The planner may decide a full scan is faster.',
      },
    ],
    practiceQuestions: [
      'Explain how a B-tree index speeds up a WHERE clause lookup.',
      'You have: SELECT * FROM orders WHERE customer_id = 5 AND status = \'shipped\' ORDER BY created_at DESC. What composite index would you create?',
      'Why does an index on a boolean column provide little benefit?',
      'What is a partial index, and when would you use one?',
    ],
  },

  // ───────────────────────────────────────────────
  // 5. Normalization — Organizing Data
  // ───────────────────────────────────────────────
  'normalization-organizing-data': {
    steps: [
      {
        title: 'The Messy Spreadsheet Problem',
        content:
          'Imagine a university keeping all student data in one giant spreadsheet. "Alice" is repeated for every course. "CS101" and "Dr. Smith" appear in every row of that course. If Dr. Smith changes name, you update dozens of rows.',
        analogy:
          'An unnormalized table is like a class roster where every row includes the full school address and principal name. Normalization says: put school info in its own table, reference it by school_id.',
        diagram: `BEFORE (unnormalized):\n┌────┬───────┬────────┬───────────┬──────────┬───────┐\n│ ID │ Name  │ Course │ CourseName│Instructor│ Grade │\n├────┼───────┼────────┼───────────┼──────────┼───────┤\n│ 1  │ Alice │ CS101  │ Intro CS  │ Dr.Smith │  A    │\n│ 1  │ Alice │ MATH201│ Calc II   │ Dr.Jones │  B+   │\n│ 2  │ Bob   │ CS101  │ Intro CS  │ Dr.Smith │  B    │\n└────┴───────┴────────┴───────────┴──────────┴───────┘\n        ↑ Alice repeated    ↑ CS101+Dr.Smith repeated`,
        keyTakeaway:
          'Normalization eliminates data redundancy by splitting one big table into several smaller, related tables.',
      },
      {
        title: 'Why Normalization Matters',
        content:
          'Redundant data causes three specific problems known as anomalies.',
        cards: [
          { title: 'Update Anomaly', description: 'Course name changes? Update every row referencing it. Miss one = inconsistent data.', icon: '✏️', color: 'red' },
          { title: 'Insert Anomaly', description: 'New course with no students yet? Cannot insert without a student row.', icon: '➕', color: 'red' },
          { title: 'Delete Anomaly', description: 'Delete last student in a course? The course info disappears too.', icon: '🗑️', color: 'red' },
          { title: 'Normalization Fix', description: 'Each fact stored exactly once. No anomalies possible.', icon: '✅', color: 'emerald' },
        ],
        keyTakeaway:
          'Without normalization, you get update, insert, and delete anomalies — bugs caused by data living in multiple places.',
      },
      {
        title: 'First Normal Form (1NF) — No Repeating Groups',
        content:
          '1NF requires every column to contain atomic (single) values, each row is unique, and no repeating groups of columns.',
        code: [
          {
            language: 'sql',
            label: 'Fixing a 1NF violation',
            code: `-- VIOLATION: comma-separated list in a column\n-- | student_id | name  | courses              |\n-- | 1          | Alice | CS101, MATH201       |\n\n-- FIX: one row per student-course pair\nCREATE TABLE student_courses (\n  student_id   INT,\n  student_name VARCHAR(100),\n  course_code  VARCHAR(20),\n  PRIMARY KEY (student_id, course_code)\n);`,
          },
        ],
        comparison: {
          leftTitle: 'Before 1NF',
          rightTitle: 'After 1NF',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'courses = "CS101, MATH201"', right: 'One row: student_id=1, course=CS101' },
            { left: 'Multiple values in one cell', right: 'One value per cell' },
            { left: 'Cannot query individual courses', right: 'Easy to filter by course_code' },
            { left: 'Cannot count courses per student', right: 'COUNT(course_code) works perfectly' },
            { left: 'Adding a course means string manipulation', right: 'Adding a course = INSERT a new row' },
          ],
        },
        analogy:
          '1NF says: don\'t stuff a list into a single cell. Every box in the filing cabinet should hold exactly one document.',
        keyTakeaway:
          '1NF: every cell holds a single value, every row is unique. No comma-separated lists in columns.',
      },
      {
        title: 'Second Normal Form (2NF) — Remove Partial Dependencies',
        content:
          '2NF requires 1NF AND every non-key column depends on the ENTIRE primary key, not just part. Only matters with composite keys.',
        code: [
          {
            language: 'sql',
            label: 'Decomposing to 2NF',
            code: `-- Before: student_name depends only on student_id\n-- (partial dependency on composite PK)\n\n-- After (2NF):\nCREATE TABLE students (\n  student_id   INT PRIMARY KEY,\n  student_name VARCHAR(100)\n);\n\nCREATE TABLE enrollments (\n  student_id  INT REFERENCES students(student_id),\n  course_code VARCHAR(20),\n  grade       CHAR(2),\n  PRIMARY KEY (student_id, course_code)\n);`,
          },
        ],
        flow: [
          { label: 'Identify PKs', description: 'Find all columns in the composite primary key', icon: '🔑' },
          { label: 'Find Partial Dependencies', description: 'Check if any non-key column depends on only part of the PK', icon: '🔍' },
          { label: 'Extract to New Table', description: 'Move partially-dependent columns into their own table', icon: '✂️' },
          { label: 'Link with FK', description: 'Connect the new table back using a foreign key relationship', icon: '🔗' },
        ],
        keyTakeaway:
          '2NF: every non-key column must depend on the WHOLE primary key. Split out columns that depend on only part of the key.',
      },
      {
        title: 'Third Normal Form (3NF) — Remove Transitive Dependencies',
        content:
          '3NF requires 2NF AND no non-key column depends on another non-key column. If course_code determines instructor, instructor belongs in the courses table.',
        code: [
          {
            language: 'sql',
            label: 'Decomposing to 3NF',
            code: `-- Three clean tables:\nCREATE TABLE students (\n  student_id INT PRIMARY KEY, student_name VARCHAR(100)\n);\nCREATE TABLE courses (\n  course_code VARCHAR(20) PRIMARY KEY,\n  course_name VARCHAR(100), instructor VARCHAR(100)\n);\nCREATE TABLE enrollments (\n  student_id  INT REFERENCES students(student_id),\n  course_code VARCHAR(20) REFERENCES courses(course_code),\n  grade CHAR(2),\n  PRIMARY KEY (student_id, course_code)\n);`,
          },
        ],
        analogy:
          '3NF: if A determines B and B determines C, then C belongs in B\'s table. The instructor\'s phone number belongs in the instructor file, not in every course listing.',
        flow: [
          { label: 'Unnormalized', description: 'One messy table', icon: '😵' },
          { label: '1NF', description: 'Atomic values, no lists', icon: '1️⃣' },
          { label: '2NF', description: 'No partial dependencies', icon: '2️⃣' },
          { label: '3NF', description: 'No transitive dependencies', icon: '3️⃣' },
        ],
        keyTakeaway:
          '3NF: no non-key column should depend on another non-key column. Each fact is stored in exactly one place.',
      },
      {
        title: 'The Full Decomposition — Step by Step',
        content:
          'Let us walk through the entire journey from one messy table to a clean 3NF schema.',
        code: [
          {
            language: 'sql',
            label: 'Complete normalization example',
            code: `-- FINAL 3NF SCHEMA:\nCREATE TABLE students (\n  student_id    INT PRIMARY KEY,\n  student_name  VARCHAR(100),\n  student_email VARCHAR(255) UNIQUE\n);\n\nCREATE TABLE courses (\n  course_code VARCHAR(20) PRIMARY KEY,\n  course_name VARCHAR(100),\n  instructor  VARCHAR(100)\n);\n\nCREATE TABLE enrollments (\n  student_id  INT REFERENCES students(student_id),\n  course_code VARCHAR(20) REFERENCES courses(course_code),\n  grade       CHAR(2),\n  PRIMARY KEY (student_id, course_code)\n);\n\n-- Reconstruct the original flat view with JOINs:\nSELECT s.student_name, c.course_name, c.instructor, e.grade\nFROM enrollments e\nJOIN students s ON e.student_id = s.student_id\nJOIN courses c ON e.course_code = c.course_code;`,
          },
        ],
        diagram: `┌──────────┐     ┌──────────────┐     ┌──────────┐\n│ students │     │ enrollments  │     │ courses  │\n├──────────┤     ├──────────────┤     ├──────────┤\n│ id (PK)  │◄───│ student_id   │     │ code(PK) │\n│ name     │    │ course_code  │────►│ name     │\n│ email    │    │ grade        │     │ instruct │\n└──────────┘    └──────────────┘     └──────────┘`,
        keyTakeaway:
          'After normalization, each table stores one concept. JOINs reconstruct the original view when needed.',
      },
      {
        title: 'When to Denormalize',
        content:
          'Normalization is not always the answer. Sometimes you intentionally add redundancy back for performance.',
        comparison: {
          leftTitle: 'Normalize',
          rightTitle: 'Denormalize',
          items: [
            { left: 'Write-heavy apps (fewer update anomalies)', right: 'Read-heavy apps (fewer JOINs)' },
            { left: 'OLTP systems (transactions)', right: 'OLAP / data warehouses (analytics)' },
            { left: 'Data integrity is critical', right: 'Query speed is critical' },
            { left: 'Schema changes are frequent', right: 'Schema is stable, reads dominate' },
          ],
        },
        analogy:
          'Normalization is like organizing your closet perfectly — everything in its place. Denormalization is like keeping a jacket by the front door because you use it every day.',
        keyTakeaway:
          'Normalize by default. Denormalize strategically for read-heavy performance — but understand the trade-offs.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Storing comma-separated values in a column',
        explanation:
          'This violates 1NF and makes querying, updating, and validating individual values extremely difficult.',
      },
      {
        mistake: 'Over-normalizing to the point of needing 10-table JOINs',
        explanation:
          'Normalization is a guideline, not a religion. If you need to join 10 tables for a simple query, consider strategic denormalization.',
      },
      {
        mistake: 'Confusing 2NF and 3NF',
        explanation:
          '2NF addresses partial dependencies (non-key depends on PART of composite key). 3NF addresses transitive dependencies (non-key depends on another non-key).',
      },
    ],
    practiceQuestions: [
      'Given orders(order_id, customer_name, customer_email, product_name, product_price, quantity), decompose into 3NF.',
      'What are the three types of anomalies that normalization prevents?',
      'Explain the difference between 2NF and 3NF in your own words.',
      'When would you intentionally denormalize a schema?',
      'Is a table with a single-column primary key automatically in 2NF?',
    ],
  },

  // ───────────────────────────────────────────────
  // 6. Transactions & ACID Properties
  // ───────────────────────────────────────────────
  'transactions-acid-properties': {
    steps: [
      {
        title: 'The Bank Transfer Problem',
        content:
          'Transferring $500 from checking to savings requires two steps: subtract from checking, add to savings. What if the system crashes between steps? Your $500 vanishes.',
        analogy:
          'A transaction is like a handshake deal — both parties must follow through. If either side backs out, the whole deal is canceled.',
        flow: [
          { label: 'BEGIN', description: 'Start transaction', icon: '🚦' },
          { label: 'Debit $500', description: 'Subtract from checking', icon: '➖' },
          { label: 'Credit $500', description: 'Add to savings', icon: '➕' },
          { label: 'COMMIT', description: 'All succeed together', icon: '✅' },
        ],
        keyTakeaway:
          'A transaction groups multiple operations into one atomic unit — all succeed together or all fail together.',
      },
      {
        title: 'The Four ACID Properties',
        content:
          'ACID is the guarantee that makes databases reliable. Each letter represents a critical property.',
        cards: [
          { title: 'Atomicity', description: 'All or nothing. If any step fails, everything rolls back. No half-done states.', icon: '⚛️', color: 'blue' },
          { title: 'Consistency', description: 'Rules always hold. Constraints, foreign keys, and checks are never violated.', icon: '✅', color: 'emerald' },
          { title: 'Isolation', description: 'Concurrent transactions don\'t interfere. Each behaves as if it\'s the only one.', icon: '🔒', color: 'purple' },
          { title: 'Durability', description: 'Saved means saved. Once COMMIT returns, data survives any crash.', icon: '💾', color: 'amber' },
        ],
        keyTakeaway:
          'ACID guarantees: Atomicity (all-or-nothing), Consistency (rules hold), Isolation (no interference), Durability (permanent once committed).',
      },
      {
        title: 'Atomicity — All or Nothing',
        content:
          'If any part of a transaction fails, the entire thing rolls back. This prevents the "lost $500" scenario — if credit fails, the debit is also reversed.',
        code: [
          {
            language: 'sql',
            label: 'Atomicity in action',
            code: `BEGIN;\n\n-- Step 1: Debit checking\nUPDATE accounts SET balance = balance - 500\nWHERE id = 1 AND account_type = 'checking';\n\n-- Step 2: Credit savings\nUPDATE accounts SET balance = balance + 500\nWHERE id = 1 AND account_type = 'savings';\n\nCOMMIT;   -- both succeed\n-- or ROLLBACK;  -- both undone`,
          },
        ],
        diagram: `Transaction: Transfer $500
┌──────────────────────────────────────────────┐
│  BEGIN                                       │
│    │                                         │
│    ▼                                         │
│  Debit checking  (-$500)                     │
│    │                                         │
│    ▼                                         │
│  Credit savings  (+$500)                     │
│    │                                         │
│    ├── Success ──► COMMIT   ✅               │
│    │               Both changes saved        │
│    │                                         │
│    └── Failure ──► ROLLBACK ❌               │
│                    Both changes undone        │
│                    DB unchanged               │
└──────────────────────────────────────────────┘`,
        analogy:
          'Atomicity is like an elevator — it takes you all the way to your floor or brings you back to where you started. Never stuck between floors.',
        keyTakeaway:
          'Atomicity: if any step in a transaction fails, ALL steps are undone. The database never shows a half-complete state.',
      },
      {
        title: 'Consistency — Rules Always Hold',
        content:
          'Consistency means a transaction moves the database from one valid state to another. It never violates constraints, foreign keys, or triggers.',
        code: [
          {
            language: 'sql',
            label: 'Consistency enforcement',
            code: `-- Constraint prevents negative balances\nALTER TABLE accounts\n  ADD CONSTRAINT positive_balance CHECK (balance >= 0);\n\n-- This transaction FAILS if balance goes below 0\nBEGIN;\nUPDATE accounts SET balance = balance - 500\nWHERE id = 1 AND account_type = 'checking';\n-- CHECK constraint fires -> entire transaction rolled back\nCOMMIT;`,
          },
        ],
        keyTakeaway:
          'Consistency: the database moves from one valid state to another. Constraints and rules are never violated.',
      },
      {
        title: 'Isolation — Transactions Do Not Interfere',
        content:
          'Even if 100 transactions run simultaneously, each behaves as if it were the only one. Without isolation, you get dirty reads, non-repeatable reads, and phantom reads.',
        table: {
          headers: ['Problem', 'What Happens', 'Example'],
          rows: [
            ['Dirty Read', 'Read uncommitted data that may roll back', 'See $500 balance that was never committed'],
            ['Non-Repeatable Read', 'Same query returns different results', 'Balance changes between two reads in same txn'],
            ['Phantom Read', 'New rows appear between identical queries', 'Count goes from 10 to 11 mid-transaction'],
          ],
        },
        analogy:
          'Isolation is like exam proctoring. Strict = opaque dividers. Relaxed = you can glance at neighbors but risk copying wrong answers.',
        keyTakeaway:
          'Isolation: concurrent transactions cannot see each other\'s uncommitted changes. Strictness varies by isolation level.',
      },
      {
        title: 'Durability — Saved Means Saved',
        content:
          'Once a transaction is committed, the data is permanently saved — even if the server crashes one second later. Databases achieve this with the Write-Ahead Log (WAL).',
        flow: [
          { label: 'Write to WAL', description: 'Log change to disk first', icon: '📝' },
          { label: 'Update data', description: 'Modify actual data pages', icon: '💾' },
          { label: 'COMMIT', description: 'Confirm to client', icon: '✅' },
          { label: 'Crash?', description: 'Replay WAL on restart', icon: '🔄' },
        ],
        analogy:
          'Durability is like a certified letter. Once you get the receipt (COMMIT confirmed), delivery is guaranteed even if the post office burns down.',
        keyTakeaway:
          'Durability: once COMMIT returns, data survives any crash. The Write-Ahead Log (WAL) makes this possible.',
      },
      {
        title: 'Writing Transactions in Practice',
        content:
          'Here is the full pattern including error handling in both SQL and application code.',
        code: [
          {
            language: 'sql',
            label: 'Full transaction pattern in SQL',
            code: `BEGIN;\n\n-- Lock the row to prevent concurrent changes\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\n\nUPDATE accounts SET balance = balance - 200 WHERE id = 1;\nUPDATE accounts SET balance = balance + 200 WHERE id = 2;\n\n-- Log the transfer\nINSERT INTO transfers (from_id, to_id, amount, created_at)\nVALUES (1, 2, 200, NOW());\n\nCOMMIT;`,
          },
          {
            language: 'javascript',
            label: 'Transaction in Node.js (pg library)',
            code: `const client = await pool.connect();\ntry {\n  await client.query('BEGIN');\n  await client.query(\n    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',\n    [200, fromAccountId]\n  );\n  await client.query(\n    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',\n    [200, toAccountId]\n  );\n  await client.query('COMMIT');\n} catch (err) {\n  await client.query('ROLLBACK');\n  throw err;\n} finally {\n  client.release();\n}`,
          },
        ],
        keyTakeaway:
          'Always wrap multi-step operations in BEGIN/COMMIT with a ROLLBACK in the error handler.',
      },
      {
        title: 'SAVEPOINT — Partial Rollbacks',
        content:
          'Sometimes you want to undo part of a transaction without discarding all of it. SAVEPOINT creates a checkpoint you can roll back to.',
        code: [
          {
            language: 'sql',
            label: 'Using SAVEPOINTs',
            code: `BEGIN;\n\nINSERT INTO orders (customer_id, total) VALUES (1, 100.00);\nSAVEPOINT after_order;\n\n-- Try to apply a discount coupon\nUPDATE coupons SET used = true WHERE code = 'SAVE20';\n-- If coupon doesn't exist, rollback just this part\nROLLBACK TO SAVEPOINT after_order;\n\n-- The order insert is still intact!\nCOMMIT;`,
          },
        ],
        analogy:
          'SAVEPOINT is like saving your game before a boss fight. If you lose, you reload the save — you don\'t restart the entire game.',
        keyTakeaway:
          'SAVEPOINT creates a named checkpoint inside a transaction. Roll back to it without losing earlier work.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Not using transactions for multi-step operations',
        explanation:
          'Two UPDATEs without a transaction: if the second fails, the first is already committed. Data is now inconsistent.',
      },
      {
        mistake: 'Holding transactions open for too long',
        explanation:
          'Long transactions hold locks that block other users. Do computation outside the transaction, writes inside.',
      },
      {
        mistake: 'Assuming autocommit is off',
        explanation:
          'Most databases default to autocommit where each statement is its own transaction. Explicitly BEGIN for multi-statement atomicity.',
      },
      {
        mistake: 'Forgetting to ROLLBACK on error',
        explanation:
          'An error without ROLLBACK leaves the connection in a broken state. Always use try/catch/finally.',
      },
    ],
    practiceQuestions: [
      'Explain each letter of ACID with your own analogy.',
      'What would happen if a database guaranteed Atomicity but not Durability?',
      'Write a SQL transaction that transfers funds with a check for sufficient balance.',
      'What is the Write-Ahead Log (WAL) and why is it essential?',
      'Describe a scenario where SAVEPOINT is more useful than a full ROLLBACK.',
    ],
  },

  // ───────────────────────────────────────────────
  // 7. Isolation Levels
  // ───────────────────────────────────────────────
  'isolation-levels': {
    steps: [
      {
        title: 'The Privacy Settings Analogy',
        content:
          'Isolation levels control how much one transaction can see of another\'s in-progress work. Think of them as privacy settings on a shared document.',
        analogy:
          'Read Uncommitted = anyone sees your unsaved drafts. Read Committed = see only published versions. Repeatable Read = take a snapshot at the start. Serializable = nobody sees anything until you hit publish.',
        cards: [
          { title: 'Read Uncommitted', description: 'See uncommitted changes. Fast but risky. Almost never used.', icon: '👁️', color: 'red' },
          { title: 'Read Committed', description: 'See only committed data. Default for PostgreSQL. Good enough for most apps.', icon: '📖', color: 'blue' },
          { title: 'Repeatable Read', description: 'Snapshot at transaction start. Default for MySQL. Consistent reads.', icon: '📸', color: 'purple' },
          { title: 'Serializable', description: 'Perfect isolation — as if running one at a time. Slowest but safest.', icon: '🔒', color: 'emerald' },
        ],
        keyTakeaway:
          'Isolation levels control the trade-off between data consistency and concurrent performance.',
      },
      {
        title: 'The Three Anomalies',
        content:
          'Each isolation level prevents a different set of anomalies.',
        table: {
          headers: ['Level', 'Dirty Read', 'Non-Repeatable', 'Phantom', 'Performance'],
          rows: [
            ['Read Uncommitted', 'Possible', 'Possible', 'Possible', 'Fastest'],
            ['Read Committed', 'Prevented', 'Possible', 'Possible', 'Fast'],
            ['Repeatable Read', 'Prevented', 'Prevented', 'Possible*', 'Moderate'],
            ['Serializable', 'Prevented', 'Prevented', 'Prevented', 'Slowest'],
          ],
        },
        bullets: [
          '**Dirty Read** — Reading uncommitted data that may roll back.',
          '**Non-Repeatable Read** — Same row returns different values in the same transaction.',
          '**Phantom Read** — New rows appear between identical queries.',
          '*PostgreSQL\'s Repeatable Read actually prevents phantom reads too (true snapshot isolation).',
        ],
        keyTakeaway:
          'Dirty reads see uncommitted data, non-repeatable reads see changed data, phantom reads see newly inserted data.',
      },
      {
        title: 'Read Uncommitted — The Wild West',
        content:
          'The lowest level. You can read data another transaction modified but hasn\'t committed. If they roll back, you made decisions on ghost data. Almost never used in practice.',
        code: [
          {
            language: 'sql',
            label: 'Dirty read example',
            code: `-- Session A:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\nSELECT balance FROM accounts WHERE id = 1;  -- $1000\n\n-- Session B (NOT committed):\nBEGIN;\nUPDATE accounts SET balance = 500 WHERE id = 1;\n\n-- Session A sees $500 (DIRTY READ!)\nSELECT balance FROM accounts WHERE id = 1;  -- $500\n\n-- Session B rolls back:\nROLLBACK;  -- real balance is still $1000`,
          },
        ],
        diagram: `Dirty Read Scenario:
┌─ Transaction A ─────────┐  ┌─ Transaction B ─────────┐
│                          │  │                          │
│  BEGIN                   │  │  BEGIN                   │
│  READ balance → $1000    │  │                          │
│                          │  │  UPDATE balance = $500   │
│  READ balance → $500 ⚠️  │  │  (not committed yet!)    │
│  (dirty read!)           │  │                          │
│                          │  │  ROLLBACK ❌              │
│  Acted on $500...        │  │  balance is still $1000  │
│  but real balance=$1000! │  │                          │
└──────────────────────────┘  └──────────────────────────┘`,
        keyTakeaway:
          'Read Uncommitted allows dirty reads — avoid in almost all cases.',
      },
      {
        title: 'Read Committed — The Safe Default',
        content:
          'You only see committed data. No dirty reads. But the same query can return different results within one transaction if another transaction commits in between.',
        code: [
          {
            language: 'sql',
            label: 'Non-repeatable read example',
            code: `-- Session A:\nBEGIN;\nSELECT balance FROM accounts WHERE id = 1;  -- $1000\n\n-- Session B commits a change:\nUPDATE accounts SET balance = 800 WHERE id = 1;\nCOMMIT;\n\n-- Session A reads again:\nSELECT balance FROM accounts WHERE id = 1;  -- $800!\n-- Different value in same transaction`,
          },
        ],
        comparison: {
          leftTitle: 'Read Uncommitted',
          rightTitle: 'Read Committed',
          items: [
            { left: 'Sees uncommitted changes', right: 'Only sees committed data' },
            { left: 'Dirty reads possible', right: 'No dirty reads' },
            { left: 'Fastest but dangerous', right: 'Safe default for most apps' },
            { left: 'Almost never used', right: 'Default in PostgreSQL and Oracle' },
            { left: 'May act on data that rolls back', right: 'Data is guaranteed to persist' },
            { left: 'Non-repeatable reads possible', right: 'Non-repeatable reads still possible' },
          ],
        },
        analogy:
          'Read Committed is like checking a stock price. Each check shows the latest price, but it may have changed since you last looked.',
        keyTakeaway:
          'Read Committed is the safest common default. No dirty reads, but queries can return different results within one transaction.',
      },
      {
        title: 'Repeatable Read — Frozen Snapshots',
        content:
          'The database takes a snapshot at the start of your transaction. All reads see this snapshot, even if other transactions commit changes.',
        code: [
          {
            language: 'sql',
            label: 'Repeatable Read example',
            code: `-- Session A:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT balance FROM accounts WHERE id = 1;  -- $1000\n\n-- Session B commits:\nUPDATE accounts SET balance = 800 WHERE id = 1;\nCOMMIT;\n\n-- Session A:\nSELECT balance FROM accounts WHERE id = 1;  -- STILL $1000!\n-- Snapshot protects us\nCOMMIT;`,
          },
        ],
        analogy:
          'Repeatable Read is like taking a photograph of a whiteboard at the start of a meeting. Even if someone rewrites it during the meeting, your photo shows the original.',
        keyTakeaway:
          'Repeatable Read uses snapshot isolation — your transaction sees data as it was when the transaction started.',
      },
      {
        title: 'Serializable — Perfect but Slow',
        content:
          'The highest level. Guarantees that concurrent transactions produce the same result as running one at a time. Prevents ALL anomalies but can cause transaction aborts.',
        code: [
          {
            language: 'sql',
            label: 'Serializable example',
            code: `-- Session A:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nSELECT COUNT(*) FROM orders WHERE status = 'pending'; -- 5\n\n-- Session B:\nINSERT INTO orders (status) VALUES ('pending');\nCOMMIT;\n\n-- Session A still sees 5 (no phantom)\nSELECT COUNT(*) FROM orders WHERE status = 'pending'; -- 5\nCOMMIT;  -- may fail: "could not serialize access"`,
          },
          {
            language: 'python',
            label: 'Retry logic for serializable transactions',
            code: `import psycopg2\n\ndef run_serializable(conn, operation):\n    for attempt in range(3):\n        try:\n            with conn.cursor() as cur:\n                cur.execute("BEGIN ISOLATION LEVEL SERIALIZABLE")\n                operation(cur)\n                conn.commit()\n                return\n        except psycopg2.errors.SerializationFailure:\n            conn.rollback()\n            if attempt == 2:\n                raise`,
          },
        ],
        table: {
          headers: ['Level', 'Dirty Read', 'Non-Repeatable', 'Phantom', 'Performance'],
          rows: [
            ['Read Uncommitted', 'Possible', 'Possible', 'Possible', '★★★★★ Fastest'],
            ['Read Committed', 'Prevented', 'Possible', 'Possible', '★★★★☆ Fast'],
            ['Repeatable Read', 'Prevented', 'Prevented', 'Possible*', '★★★☆☆ Moderate'],
            ['Serializable', 'Prevented', 'Prevented', 'Prevented', '★★☆☆☆ Slowest'],
          ],
        },
        keyTakeaway:
          'Serializable prevents all anomalies but can cause transaction aborts. Always implement retry logic.',
      },
      {
        title: 'Which Level to Use?',
        content:
          'Most applications are fine with Read Committed. Upgrade only when needed.',
        comparison: {
          leftTitle: 'Use Case',
          rightTitle: 'Recommended Level',
          items: [
            { left: 'Social media feeds, dashboards', right: 'Read Committed (default)' },
            { left: 'Report generation, consistent reads', right: 'Repeatable Read' },
            { left: 'Financial calculations, inventory', right: 'Serializable (with retries)' },
            { left: 'Approximate analytics', right: 'Read Uncommitted (rare)' },
          ],
        },
        bullets: [
          'PostgreSQL and Oracle default to **Read Committed**.',
          'MySQL/InnoDB defaults to **Repeatable Read**.',
          'Always check your database\'s default.',
        ],
        keyTakeaway:
          'Start with Read Committed. Upgrade to Repeatable Read or Serializable only when your application requires stronger guarantees.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Assuming the default isolation level is the same everywhere',
        explanation:
          'PostgreSQL defaults to Read Committed. MySQL defaults to Repeatable Read. Always check.',
      },
      {
        mistake: 'Using Serializable without retry logic',
        explanation:
          'Serializable can abort transactions with serialization errors. Your app must catch and retry.',
      },
      {
        mistake: 'Not understanding which anomalies your app can tolerate',
        explanation:
          'Social feeds tolerate stale reads (Read Committed). Bank balances cannot (Repeatable Read or Serializable).',
      },
    ],
    practiceQuestions: [
      'Explain the difference between a dirty read, a non-repeatable read, and a phantom read.',
      'Your e-commerce app shows items "in stock" but checkout fails. Which isolation level fixes this?',
      'Why does Serializable require retry logic?',
      'What isolation level does your preferred database default to?',
    ],
  },

  // ───────────────────────────────────────────────
  // 8. Query Optimization
  // ───────────────────────────────────────────────
  'query-optimization': {
    steps: [
      {
        title: 'Why Your Query is Slow',
        content:
          'When you write SQL, you describe WHAT data you want, not HOW to get it. The query planner decides the strategy — which indexes to use, join order, sort method.',
        analogy:
          'You are the passenger (writing SQL). The query planner is the GPS. EXPLAIN is like the GPS showing you the route before you drive. If the route looks bad, adjust your query or add an index.',
        flow: [
          { label: 'You write SQL', description: 'Declare what you want', icon: '✍️' },
          { label: 'Query Planner', description: 'Chooses execution strategy', icon: '🧠' },
          { label: 'Execution', description: 'Runs the chosen plan', icon: '⚡' },
          { label: 'Results', description: 'Data returned to you', icon: '📊' },
        ],
        keyTakeaway:
          'The query planner turns your SQL into an execution plan. Optimization means helping it choose the best plan.',
      },
      {
        title: 'Reading EXPLAIN Output',
        content:
          'EXPLAIN shows the execution plan. EXPLAIN ANALYZE runs the query and shows real timing.',
        code: [
          {
            language: 'sql',
            label: 'Using EXPLAIN and EXPLAIN ANALYZE',
            code: `-- See the plan WITHOUT running\nEXPLAIN\nSELECT * FROM employees WHERE department = 'Engineering';\n-- Seq Scan = full table scan (bad on big tables)\n\n-- Run and see actual timing\nEXPLAIN ANALYZE\nSELECT * FROM employees WHERE department = 'Engineering';\n\n-- After adding an index:\nCREATE INDEX idx_dept ON employees(department);\n\nEXPLAIN ANALYZE\nSELECT * FROM employees WHERE department = 'Engineering';\n-- Index Scan using idx_dept (much faster!)`,
          },
        ],
        table: {
          headers: ['What You See', 'What It Means', 'Fix'],
          rows: [
            ['Seq Scan', 'Full table scan (reading every row)', 'Add an index'],
            ['Index Scan', 'Using an index (fast)', 'Already good'],
            ['Nested Loop', 'For each row in A, scan all of B', 'Index the join column'],
            ['Sort', 'In-memory sorting', 'Add index matching ORDER BY'],
            ['High cost/time', 'Expensive step in the plan', 'Focus optimization here'],
          ],
        },
        keyTakeaway:
          'EXPLAIN shows the plan. EXPLAIN ANALYZE shows actual times. Look for Seq Scans on large tables — they need indexes.',
      },
      {
        title: 'The Top Performance Killers',
        content:
          'Here are the most common reasons queries are slow, in order of frequency.',
        cards: [
          { title: 'Missing Indexes', description: '#1 cause. WHERE on unindexed column = full table scan.', icon: '🔍', color: 'red' },
          { title: 'SELECT *', description: 'Fetches every column. Wastes I/O, prevents index-only scans.', icon: '❌', color: 'red' },
          { title: 'N+1 Problem', description: '1 query for list + N queries for details. Use JOINs instead.', icon: '🔁', color: 'red' },
          { title: 'Functions on Indexes', description: 'WHERE YEAR(date) = 2024 cannot use index. Use range instead.', icon: '⚠️', color: 'amber' },
        ],
        keyTakeaway:
          'Most slow queries are caused by missing indexes, SELECT *, or the N+1 problem. These are easy to fix.',
      },
      {
        title: 'Fix the N+1 Problem',
        content:
          'The N+1 problem is the most common performance bug in web applications. One query for a list, then N separate queries for each item.',
        code: [
          {
            language: 'javascript',
            label: 'N+1 problem and its fix',
            code: `// BAD: N+1 queries (101 total!)\nconst orders = await db.query('SELECT * FROM orders LIMIT 100');\nfor (const order of orders) {\n  const customer = await db.query(\n    'SELECT name FROM customers WHERE id = $1',\n    [order.customer_id]\n  );\n}\n\n// GOOD: Single query with JOIN (1 total)\nconst results = await db.query(\`\n  SELECT o.*, c.name AS customer_name\n  FROM orders o\n  JOIN customers c ON o.customer_id = c.id\n  LIMIT 100\n\`);`,
          },
        ],
        diagram: `N+1 Pattern (BAD):                Single JOIN (GOOD):
┌──────────────────────┐            ┌──────────────────────┐
│ Query 1: Get orders  │            │ Query 1:             │
│ SELECT * FROM orders │            │ SELECT o.*, c.name   │
│ → 100 rows           │            │ FROM orders o        │
├──────────────────────┤            │ JOIN customers c     │
│ Query 2: customer #1 │            │ ON o.customer_id=c.id│
│ Query 3: customer #2 │            │ → 100 rows, done! ✅  │
│ Query 4: customer #3 │            └──────────────────────┘
│ ...                  │
│ Query 101: cust #100 │            Total: 1 query
├──────────────────────┤
│ Total: 101 queries ❌ │
└──────────────────────┘`,
        analogy:
          'N+1 is like calling a pizza shop 10 times to order 10 pizzas one at a time, instead of calling once and ordering all 10.',
        keyTakeaway:
          'Replace N+1 queries with JOINs or batch queries (WHERE id IN (...)). One query beats a hundred.',
      },
      {
        title: 'Smart Indexing and Functions',
        content:
          'Avoid applying functions to indexed columns in WHERE clauses — the database cannot use the index.',
        code: [
          {
            language: 'sql',
            label: 'Index-friendly queries',
            code: `-- BAD: function prevents index use\nSELECT * FROM orders\nWHERE EXTRACT(YEAR FROM created_at) = 2024;\n\n-- GOOD: range scan uses the index\nSELECT * FROM orders\nWHERE created_at >= '2024-01-01'\n  AND created_at < '2025-01-01';\n\n-- Covering index: answer query from index alone\nCREATE INDEX idx_orders_covering\n  ON orders(customer_id) INCLUDE (product, amount);\n\n-- Use EXISTS instead of IN for large subqueries\nSELECT * FROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.id AND o.amount > 1000\n);`,
          },
        ],
        keyTakeaway:
          'Run ANALYZE to update statistics, use covering indexes, avoid functions on indexed columns, prefer EXISTS over IN.',
      },
      {
        title: 'Pagination Done Right',
        content:
          'OFFSET pagination is slow for deep pages. The database reads and discards thousands of rows. Cursor-based pagination is much faster.',
        comparison: {
          leftTitle: 'OFFSET (Slow)',
          rightTitle: 'Cursor-Based (Fast)',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'LIMIT 20 OFFSET 10000', right: 'WHERE id > last_id LIMIT 20' },
            { left: 'Scans and discards 10K rows', right: 'Index seek, no scanning' },
            { left: 'Slower on deeper pages', right: 'Same speed on any page' },
            { left: 'Simple implementation', right: 'Slightly more complex client code' },
          ],
        },
        code: [
          {
            language: 'sql',
            label: 'Cursor-based pagination',
            code: `-- First page:\nSELECT * FROM orders ORDER BY id LIMIT 20;\n-- Client remembers last_id = 20\n\n-- Next page (index seek, no scanning):\nSELECT * FROM orders\nWHERE id > 20 ORDER BY id LIMIT 20;`,
          },
        ],
        keyTakeaway:
          'Replace OFFSET with cursor-based pagination (WHERE id > last_seen_id) for consistent fast performance.',
      },
      {
        title: 'Optimization Checklist',
        content:
          'When a query is slow, work through this checklist systematically.',
        flow: [
          { label: 'EXPLAIN ANALYZE', description: 'Identify the bottleneck', icon: '🔍' },
          { label: 'Check indexes', description: 'WHERE/JOIN/ORDER BY columns', icon: '📇' },
          { label: 'Fix SELECT *', description: 'List specific columns', icon: '✂️' },
          { label: 'Find N+1', description: 'Replace with JOINs', icon: '🔗' },
          { label: 'ANALYZE tables', description: 'Update statistics', icon: '📊' },
          { label: 'Cursor pagination', description: 'Replace OFFSET', icon: '📄' },
        ],
        keyTakeaway:
          'Query optimization is systematic: EXPLAIN first, fix the biggest bottleneck, repeat.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Optimizing without measuring first',
        explanation:
          'Always run EXPLAIN ANALYZE before changing anything. Your assumption about what is slow might be wrong.',
      },
      {
        mistake: 'Adding indexes without considering write performance',
        explanation:
          'Every index slows down INSERT/UPDATE/DELETE. On write-heavy tables, too many indexes make writes the bottleneck.',
      },
      {
        mistake: 'Using OFFSET for deep pagination',
        explanation:
          'OFFSET 100000 LIMIT 20 reads and discards 100K rows. Use cursor-based pagination.',
      },
      {
        mistake: 'Applying functions to indexed columns in WHERE',
        explanation:
          'WHERE LOWER(email) = \'alice@example.com\' cannot use a normal index. Create a functional index or store lowercase.',
      },
    ],
    practiceQuestions: [
      'You see a Seq Scan on a 10M-row table. What is the problem and how do you fix it?',
      'What is the N+1 problem? Show an example and its fix.',
      'Why is WHERE YEAR(created_at) = 2024 slower than a range condition?',
      'What is cursor-based pagination and why is it faster?',
      'Design a covering index for: SELECT title, author FROM books WHERE category = \'fiction\' ORDER BY published_date DESC.',
    ],
  },

  // ───────────────────────────────────────────────
  // 9. Sharding — Splitting Data Across Servers
  // ───────────────────────────────────────────────
  'sharding-splitting-data-across-servers': {
    steps: [
      {
        title: 'The Library Branches Analogy',
        content:
          'A city library too popular for one building opens branches: Branch A holds authors A-M, Branch B holds N-Z. Each handles half the traffic and stores half the books.',
        analogy:
          'One giant library = one database server. Multiple branches each holding a portion = a sharded database. The catalog that tells you which branch = shard routing logic.',
        diagram: `┌─────────────────────────────────────────────┐\n│              Application Layer              │\n│         ┌──────────────────────┐            │\n│         │   Shard Router       │            │\n│         │  hash(user_id) % N   │            │\n│         └──┬──────┬──────┬────┘            │\n│            │      │      │                  │\n│      ┌─────┘  ┌───┘  ┌───┘                 │\n│      ▼        ▼      ▼                     │\n│  ┌────────┐┌────────┐┌────────┐            │\n│  │Shard 0 ││Shard 1 ││Shard 2 │            │\n│  │Users   ││Users   ││Users   │            │\n│  │0-999K  ││1M-1.9M ││2M-2.9M │            │\n│  └────────┘└────────┘└────────┘            │\n└─────────────────────────────────────────────┘`,
        keyTakeaway:
          'Sharding splits a database across multiple servers so each handles only a portion of the data and traffic.',
      },
      {
        title: 'Why Shard? Vertical Scaling Has Limits',
        content:
          'When your single server gets slow, you can scale up (bigger machine) or scale out (more machines). Scaling up has a ceiling. Scaling out (sharding) does not.',
        comparison: {
          leftTitle: 'Vertical (Scale Up)',
          rightTitle: 'Horizontal (Shard)',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Buy bigger server', right: 'Add more servers' },
            { left: 'Has an upper limit', right: 'No upper limit' },
            { left: 'Simple — no code changes', right: 'Complex — routing, cross-shard queries' },
            { left: 'Exponentially expensive', right: 'Linear cost scaling' },
            { left: 'Single point of failure', right: 'Fault isolation per shard' },
          ],
        },
        keyTakeaway:
          'Shard when a single server cannot handle the load. Vertical scaling has limits; horizontal scaling does not.',
      },
      {
        title: 'Horizontal vs Vertical Sharding',
        content:
          'There are two ways to split data. Horizontal splits rows. Vertical splits tables.',
        comparison: {
          leftTitle: 'Horizontal Sharding',
          rightTitle: 'Vertical Sharding',
          items: [
            { left: 'Split ROWS across servers', right: 'Split TABLES across servers' },
            { left: 'Same schema on all shards', right: 'Different tables on each server' },
            { left: 'Truly scalable', right: 'Limited by largest table' },
            { left: 'Example: users 1-1M on S1, 1M-2M on S2', right: 'Example: users on S1, orders on S2' },
          ],
        },
        analogy:
          'Horizontal = a department store where each floor serves different customer groups. Vertical = different stores in a mall (clothes, electronics, food).',
        keyTakeaway:
          'Horizontal sharding splits rows. Vertical sharding splits tables. Horizontal is more scalable.',
      },
      {
        title: 'Shard Keys — Where Does Data Go?',
        content:
          'The shard key is the column that determines which shard holds a given row. Choosing the right one is the most critical decision.',
        bullets: [
          'A good shard key **distributes data evenly** (no hot shards).',
          'It **groups related data** on the same shard (queries stay local).',
          'It is **commonly used in queries** (simple routing).',
        ],
        cards: [
          { title: 'user_id', description: 'All of a user\'s data on one shard. Great for user-centric apps.', icon: '👤', color: 'blue' },
          { title: 'geographic region', description: 'US data on US shard, EU on EU. Good for compliance.', icon: '🌍', color: 'emerald' },
          { title: 'tenant_id', description: 'Multi-tenant SaaS: each tenant on one shard.', icon: '🏢', color: 'purple' },
          { title: 'hash(id)', description: 'Even distribution via hashing. Kills range queries though.', icon: '#️⃣', color: 'amber' },
        ],
        keyTakeaway:
          'The shard key determines data placement. Choose one that distributes evenly and keeps related queries on the same shard.',
      },
      {
        title: 'Hash Sharding vs Range Sharding',
        content:
          'Two strategies for mapping key values to shards. Each has distinct trade-offs.',
        comparison: {
          leftTitle: 'Hash Sharding',
          rightTitle: 'Range Sharding',
          items: [
            { left: 'hash(key) % N = shard', right: 'Key ranges: 1-1M on S1, 1M-2M on S2' },
            { left: 'Even distribution', right: 'Can create hot spots' },
            { left: 'Range queries impossible', right: 'Range queries efficient' },
            { left: 'Adding shards = major reshuffle', right: 'Adding shards = split one range' },
          ],
        },
        code: [
          {
            language: 'python',
            label: 'Hash sharding example',
            code: `import hashlib\n\ndef get_shard(user_id: int, num_shards: int) -> int:\n    """Determine which shard holds this user's data."""\n    hash_val = int(hashlib.md5(\n        str(user_id).encode()\n    ).hexdigest(), 16)\n    return hash_val % num_shards\n\n# With 4 shards:\nprint(get_shard(12345, 4))  # -> 2\nprint(get_shard(12346, 4))  # -> 0  (different shard)\nprint(get_shard(12347, 4))  # -> 3  (spread evenly)`,
          },
        ],
        keyTakeaway:
          'Hash sharding distributes evenly but kills range queries. Range sharding supports ranges but can create hot spots.',
      },
      {
        title: 'The Challenges of Sharding',
        content:
          'Sharding solves scale but introduces significant complexity.',
        bullets: [
          '**Cross-shard queries** — Must fan out to every shard and merge results. Much slower.',
          '**Cross-shard transactions** — Require distributed protocols (2-phase commit). Slow and complex.',
          '**Resharding** — Adding servers means redistributing data. Consistent hashing helps.',
          '**Operational overhead** — N databases to back up, monitor, upgrade, and debug.',
          '**No foreign keys** across shards. Referential integrity must be enforced in application code.',
        ],
        cards: [
          { title: 'Cross-Shard Queries', description: 'Queries spanning multiple shards must fan out to every shard and merge results. Much slower than single-shard queries.', icon: '🔀', color: 'red' },
          { title: 'Hotspots', description: 'Uneven data distribution causes some shards to be overloaded while others sit idle. Poor shard key choice is the usual cause.', icon: '🔥', color: 'amber' },
          { title: 'Rebalancing', description: 'Adding or removing shards requires redistributing data. Consistent hashing helps but migration is still disruptive.', icon: '⚖️', color: 'purple' },
          { title: 'Referential Integrity', description: 'Foreign keys cannot span shards. Your application code must enforce data integrity across shard boundaries.', icon: '🔗', color: 'blue' },
        ],
        analogy:
          'Sharding is like splitting a puzzle across multiple tables. Each table works fast, but seeing the full picture requires walking to every table.',
        keyTakeaway:
          'Sharding adds complexity: cross-shard queries, distributed transactions, resharding. Only shard when you must.',
      },
      {
        title: 'Sharding in Practice',
        content:
          'Sharding can be done at the database level (Citus, Vitess) or in application code.',
        code: [
          {
            language: 'sql',
            label: 'PostgreSQL with Citus extension',
            code: `-- Citus turns PostgreSQL into a distributed database\nSELECT create_distributed_table('orders', 'customer_id');\n\n-- Queries with customer_id route to one shard\nSELECT * FROM orders WHERE customer_id = 42;\n\n-- Queries without it fan out to all shards\nSELECT COUNT(*) FROM orders WHERE amount > 100;`,
          },
          {
            language: 'javascript',
            label: 'Application-level sharding in Node.js',
            code: `const shards = [\n  new Pool({ host: 'shard0.db.internal' }),\n  new Pool({ host: 'shard1.db.internal' }),\n  new Pool({ host: 'shard2.db.internal' }),\n];\n\nfunction getShard(userId: number): Pool {\n  return shards[userId % shards.length];\n}\n\nasync function getUser(userId: number) {\n  const shard = getShard(userId);\n  const { rows } = await shard.query(\n    'SELECT * FROM users WHERE id = $1', [userId]\n  );\n  return rows[0];\n}`,
          },
        ],
        keyTakeaway:
          'Sharding can be database-level (Citus, Vitess) or application-level. Database-level is easier to manage.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Sharding too early',
        explanation:
          'Sharding adds enormous complexity. Exhaust vertical scaling, read replicas, caching, and query optimization first.',
      },
      {
        mistake: 'Choosing a bad shard key',
        explanation:
          'Low cardinality (like country) creates uneven shards. A key not used in queries forces cross-shard lookups.',
      },
      {
        mistake: 'Not planning for resharding',
        explanation:
          'Growing from 4 to 8 shards is painful. Use consistent hashing from the start.',
      },
    ],
    practiceQuestions: [
      'Explain horizontal vs vertical sharding with an example.',
      'You are building a multi-tenant SaaS app. What shard key and why?',
      'Trade-offs between hash sharding and range sharding?',
      'Why are cross-shard JOINs problematic?',
      'At what point should you consider sharding?',
    ],
  },

  // ───────────────────────────────────────────────
  // 10. Replication — Copies for Safety
  // ───────────────────────────────────────────────
  'replication-copies-for-safety': {
    steps: [
      {
        title: 'Why Keep Copies?',
        content:
          'A single copy of an important document can be lost to fire, flood, or coffee. Database replication maintains copies on multiple servers.',
        cards: [
          { title: 'Availability', description: 'If one server dies, another takes over immediately.', icon: '🟢', color: 'emerald' },
          { title: 'Read Performance', description: 'Spread read queries across replicas instead of hammering one server.', icon: '⚡', color: 'blue' },
          { title: 'Geographic Proximity', description: 'US users read from US server, EU from EU server.', icon: '🌍', color: 'purple' },
          { title: 'Live Backup', description: 'Replicas are always up-to-date backups of your data.', icon: '💾', color: 'amber' },
        ],
        analogy:
          'Replication is like having backup keys for your house at a friend\'s place, your office, and your parents\' house.',
        keyTakeaway:
          'Replication maintains copies of your data on multiple servers for availability, performance, and safety.',
      },
      {
        title: 'Leader-Follower Replication',
        content:
          'The most common setup. One server is the leader (master). Writes go only to the leader. The leader sends changes to followers. Reads can go to any server.',
        diagram: `┌──────────────┐\n│   Leader     │  ◄── All WRITES go here\n│  (Primary)   │\n└──┬──────┬────┘\n   │      │        Replication stream\n   ▼      ▼\n┌──────┐ ┌──────┐\n│Follow│ │Follow│  ◄── READS distributed here\n│  #1  │ │  #2  │\n└──────┘ └──────┘`,
        code: [
          {
            language: 'javascript',
            label: 'Read/write splitting in Node.js',
            code: `const leaderPool = new Pool({ host: 'db-leader.internal' });\nconst followerPool = new Pool({ host: 'db-follower.internal' });\n\nasync function writeQuery(sql: string, params: any[]) {\n  return leaderPool.query(sql, params);  // writes to leader\n}\n\nasync function readQuery(sql: string, params: any[]) {\n  return followerPool.query(sql, params); // reads from follower\n}`,
          },
        ],
        keyTakeaway:
          'Leader-follower: all writes to the leader, reads distributed across followers. Simple and effective for read-heavy workloads.',
      },
      {
        title: 'Synchronous vs Asynchronous Replication',
        content:
          'Should the leader wait for followers to confirm receipt of changes?',
        comparison: {
          leftTitle: 'Synchronous',
          rightTitle: 'Asynchronous',
          items: [
            { left: 'Leader waits for follower confirmation', right: 'Leader confirms immediately' },
            { left: 'No data loss on leader failure', right: 'May lose recent writes on failure' },
            { left: 'Slower writes (network round-trip)', right: 'Faster writes' },
            { left: 'Good for critical data', right: 'Good for high throughput' },
          ],
        },
        analogy:
          'Synchronous = certified letter (wait for receipt). Asynchronous = dropping in mailbox (fast, no guarantee). Semi-synchronous = one certified, rest regular.',
        keyTakeaway:
          'Synchronous guarantees no data loss but is slower. Asynchronous is faster but risks losing recent writes during failover.',
      },
      {
        title: 'Replication Lag and Read-After-Write',
        content:
          'With async replication, followers lag behind the leader. A user posts a comment, refreshes, and doesn\'t see it because the read hit a lagging follower.',
        flow: [
          { label: 'User writes', description: 'Goes to leader', icon: '✍️' },
          { label: 'User reads', description: 'Goes to follower', icon: '👁️' },
          { label: 'Follower behind!', description: 'Data not there yet', icon: '⏳' },
          { label: 'User confused', description: '"Where is my comment?"', icon: '😕' },
        ],
        code: [
          {
            language: 'javascript',
            label: 'Read-after-write consistency pattern',
            code: `async function createComment(userId: number, text: string) {\n  await leaderPool.query(\n    'INSERT INTO comments (user_id, text) VALUES ($1, $2)',\n    [userId, text]\n  );\n  // Remember this user just wrote something\n  await redis.set(\`last-write:\${userId}\`, Date.now(), 'EX', 10);\n}\n\nasync function getComments(userId: number, postId: number) {\n  const lastWrite = await redis.get(\`last-write:\${userId}\`);\n  // If user wrote recently, read from leader\n  const pool = (lastWrite && Date.now() - Number(lastWrite) < 5000)\n    ? leaderPool\n    : followerPool;\n  return pool.query(\n    'SELECT * FROM comments WHERE post_id = $1', [postId]\n  );\n}`,
          },
        ],
        keyTakeaway:
          'Replication lag can cause users to not see their own writes. Use read-after-write consistency patterns.',
      },
      {
        title: 'Multi-Leader Replication',
        content:
          'Two or more servers accept writes. Each replicates to the others. Useful for multi-datacenter or offline-first apps. The big problem: write conflicts.',
        bullets: [
          '**Last-write-wins** — Simple but can lose data.',
          '**Application-level resolution** — Like merge conflicts in Git.',
          '**CRDTs** — Data structures designed to merge automatically.',
        ],
        analogy:
          'Multi-leader is like two people editing the same Google Doc. Usually works, but occasionally they edit the same sentence and the system must choose.',
        keyTakeaway:
          'Multi-leader allows writes at multiple locations but introduces write conflicts that require a resolution strategy.',
      },
      {
        title: 'Failover — When the Leader Dies',
        content:
          'When the leader crashes, a follower must be promoted. This is failover.',
        flow: [
          { label: 'Detection', description: 'Missed heartbeats detected', icon: '💔' },
          { label: 'Election', description: 'Most up-to-date follower chosen', icon: '🗳️' },
          { label: 'Promotion', description: 'Follower becomes new leader', icon: '👑' },
          { label: 'Reconfiguration', description: 'App points to new leader', icon: '🔄' },
        ],
        bullets: [
          '**Data loss risk** — async follower may be missing recent writes.',
          '**Split-brain** — old leader recovers and both accept writes. Data diverges.',
          '**Downtime** — Failover takes 10-60 seconds. Writes blocked during this time.',
          'Managed databases (AWS RDS, Cloud SQL) handle this automatically.',
        ],
        keyTakeaway:
          'Failover promotes a follower to leader. It can cause brief downtime and potentially lose recent async writes.',
      },
      {
        title: 'Replication Strategy by Scale',
        content:
          'Match your replication setup to your application size.',
        table: {
          headers: ['Scale', 'Strategy', 'Details'],
          rows: [
            ['< 1K users', 'Single server', 'Automated backups only'],
            ['1K-100K users', 'Leader + 1-2 followers', 'Managed DB, async replication'],
            ['100K+ users', 'Leader + multi-AZ followers', 'Semi-sync, read-after-write consistency'],
            ['Global app', 'Multi-leader or Spanner', 'Local reads/writes per region'],
          ],
        },
        keyTakeaway:
          'Start simple (single server), add leader-follower as you grow, go multi-leader only for global or offline use cases.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Treating replication as a backup strategy',
        explanation:
          'If you DELETE all rows, that replicates to all followers. You still need point-in-time recovery backups.',
      },
      {
        mistake: 'Not accounting for replication lag',
        explanation:
          'A user writes data and reads from a lagging follower — they don\'t see their own write. Implement read-after-write consistency.',
      },
      {
        mistake: 'Multi-leader without a conflict resolution strategy',
        explanation:
          'If two leaders modify the same row, you need a clear strategy for which write wins.',
      },
    ],
    practiceQuestions: [
      'Difference between synchronous and asynchronous replication?',
      'What is replication lag and how do you mitigate it?',
      'Describe the steps of automatic failover.',
      'Why is replication not a substitute for backups?',
      'Your app has users in the US and Europe. What replication topology?',
    ],
  },

  // ───────────────────────────────────────────────
  // 11. CAP Theorem
  // ───────────────────────────────────────────────
  'cap-theorem': {
    steps: [
      {
        title: 'The Restaurant Chain Analogy',
        content:
          'You own restaurants across cities sharing the same menu. Consistency = same menu everywhere. Availability = every location always open. Partition Tolerance = keeps working even if phone lines between locations go down.',
        analogy:
          'CAP is like the project management triangle (fast, cheap, good — pick two). During a network partition, pick either consistency or availability.',
        diagram: `         Consistency (C)\n              /\\\n             /  \\\n            /    \\\n           / CP  \\\n          /______\\\n         /   CA   \\\n        /____||____\\\n       Availability   Partition\n           (A)      Tolerance (P)\n\n  During a partition: choose C or A\n  (P is mandatory in distributed systems)`,
        keyTakeaway:
          'The CAP theorem: during a network partition, a distributed system must choose between consistency and availability.',
      },
      {
        title: 'What is a Network Partition?',
        content:
          'A network partition happens when nodes cannot communicate. This is not theoretical — it happens in production regularly.',
        bullets: [
          'A network cable gets cut or a switch fails.',
          'A cloud availability zone has an outage.',
          'A misconfigured firewall blocks traffic.',
          'The "P" in CAP is NOT optional. Partitions WILL happen.',
        ],
        analogy:
          'A network partition is like two office buildings losing their phone connection. People inside each building can still talk, but the buildings cannot communicate.',
        keyTakeaway:
          'Network partitions are inevitable. The practical choice is: sacrifice consistency or availability when one happens?',
      },
      {
        title: 'CP vs AP Systems',
        content:
          'During a partition, you must choose: correct data (CP) or always available (AP).',
        comparison: {
          leftTitle: 'CP (Consistency)',
          rightTitle: 'AP (Availability)',
          items: [
            { left: 'Every read returns latest write', right: 'Every request gets a response' },
            { left: 'May reject requests during partition', right: 'May return stale data' },
            { left: 'PostgreSQL, etcd, ZooKeeper, HBase', right: 'Cassandra, DynamoDB, CouchDB, DNS' },
            { left: 'Banks, inventory, distributed locks', right: 'Social feeds, shopping carts, IoT' },
          ],
        },
        keyTakeaway:
          'CP guarantees correct data but may be unavailable. AP stays available but may return stale data.',
      },
      {
        title: 'Eventual Consistency',
        content:
          'AP systems offer eventual consistency: if no new updates are made, all replicas eventually converge. "Eventually" usually means milliseconds to seconds.',
        analogy:
          'Eventual consistency is like gossip. Tell one person, eventually everyone knows. For a brief window, some people know different things. Fine for social news. Terrifying for bank balances.',
        cards: [
          { title: 'Acceptable For', description: 'Social feeds, product catalogs, analytics, caches', icon: '✅', color: 'emerald' },
          { title: 'Dangerous For', description: 'Bank balances, inventory counts, medical records', icon: '⚠️', color: 'red' },
        ],
        keyTakeaway:
          'Eventual consistency means replicas converge over time. Acceptable for social media; dangerous for financial data.',
      },
      {
        title: 'CAP in Practice — A Spectrum',
        content:
          'The original CAP theorem is simplistic. In practice, modern databases offer nuanced trade-offs.',
        bullets: [
          '**Tunable per operation** — Cassandra lets you choose consistency level per query.',
          '**Partitions are rare** — Most of the time you get both C and A.',
          '**PACELC extends CAP** — During Partition: A or C. Else: Latency or Consistency.',
          '**Modern DBs blur lines** — Google Spanner claims CA using GPS clocks. CockroachDB provides strong C with high A.',
        ],
        keyTakeaway:
          'CAP is a useful mental model, not a strict binary. Modern databases let you tune consistency vs availability per query.',
      },
      {
        title: 'Choosing the Right Trade-off',
        content:
          'Most real architectures mix CP and AP strategies depending on the data type.',
        table: {
          headers: ['Data Type', 'Strategy', 'Why'],
          rows: [
            ['User account/balance', 'CP', 'Never show wrong balance'],
            ['Social feed', 'AP', 'Few seconds of staleness is fine'],
            ['Shopping cart', 'AP', 'Better to shop than see an error'],
            ['Inventory at checkout', 'CP', 'Must be accurate to prevent overselling'],
            ['Analytics dashboard', 'AP', 'Approximate data is acceptable'],
          ],
        },
        keyTakeaway:
          'Most systems use a mix of CP and AP strategies. Match the consistency model to the business requirement.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Thinking CAP means you must always sacrifice one of C, A, or P',
        explanation:
          'You only sacrifice C or A during a network partition. Normal operation provides both.',
      },
      {
        mistake: 'Treating CAP as the only distributed systems concern',
        explanation:
          'You also need to think about latency, throughput, durability, and operational complexity.',
      },
      {
        mistake: 'Assuming eventual consistency means "inconsistent"',
        explanation:
          'Replicas converge quickly — usually within milliseconds. The inconsistency window is brief.',
      },
    ],
    practiceQuestions: [
      'Explain the CAP theorem with a real-world analogy.',
      'For an e-commerce checkout inventory check: CP or AP? Why?',
      'Difference between strong consistency and eventual consistency?',
      'Give an example of a system that chooses availability over consistency.',
    ],
  },

  // ───────────────────────────────────────────────
  // 12. SQL vs NoSQL — When to Use Which
  // ───────────────────────────────────────────────
  'sql-vs-nosql': {
    steps: [
      {
        title: 'Filing Cabinet vs Big Box Storage',
        content:
          'SQL = a meticulously organized filing cabinet with enforced rules. NoSQL = flexible storage bins where each bin can hold anything. Neither is universally better.',
        analogy:
          'SQL databases are like a strict librarian who insists every book has a catalog card. NoSQL is like a creative studio where you pin things wherever they make sense.',
        comparison: {
          leftTitle: 'SQL (Relational)',
          rightTitle: 'NoSQL (Non-Relational)',
          items: [
            { left: 'Fixed schema (tables, rows, columns)', right: 'Flexible schema (documents, key-value, etc.)' },
            { left: 'ACID transactions', right: 'Eventual consistency (usually)' },
            { left: 'Complex JOINs and queries', right: 'Simple lookups, denormalized data' },
            { left: 'Vertical scaling (harder to shard)', right: 'Horizontal scaling (built-in sharding)' },
            { left: 'Mature ecosystem, decades of tooling', right: 'Modern, purpose-built for specific workloads' },
          ],
        },
        keyTakeaway:
          'SQL enforces structure and relationships. NoSQL offers flexibility and scale. Choose based on your data and access patterns.',
      },
      {
        title: 'SQL Databases — Structured and Relational',
        content:
          'SQL databases store data in tables with predefined schemas. Tables are linked by foreign keys. They excel at complex queries, ACID transactions, and data integrity.',
        code: [
          {
            language: 'sql',
            label: 'SQL: structured e-commerce data',
            code: `-- Rigid schema, relationships enforced\nCREATE TABLE products (\n  id          SERIAL PRIMARY KEY,\n  name        VARCHAR(200) NOT NULL,\n  price       DECIMAL(10,2) NOT NULL CHECK (price > 0),\n  category_id INT REFERENCES categories(id)\n);\n\n-- Complex query with JOINs\nSELECT c.name AS category, COUNT(*) AS count,\n       AVG(p.price) AS avg_price\nFROM products p\nJOIN categories c ON p.category_id = c.id\nGROUP BY c.name ORDER BY avg_price DESC;`,
          },
        ],
        cards: [
          { title: 'PostgreSQL', description: 'Most feature-rich. JSONB support. Best all-rounder.', icon: '🐘', color: 'blue' },
          { title: 'MySQL', description: 'Most widely deployed. Great community.', icon: '🐬', color: 'emerald' },
          { title: 'SQLite', description: 'Embedded, zero-config. Great for mobile/small apps.', icon: '📦', color: 'purple' },
          { title: 'SQL Server', description: 'Enterprise. .NET ecosystem integration.', icon: '🏢', color: 'amber' },
        ],
        keyTakeaway:
          'SQL databases excel at structured data with relationships, complex queries, and strong consistency.',
      },
      {
        title: 'NoSQL Databases — Flexible and Scalable',
        content:
          'NoSQL is an umbrella term for databases that do not use the traditional relational model. Several types exist for different use cases.',
        code: [
          {
            language: 'javascript',
            label: 'MongoDB: flexible e-commerce data',
            code: `// Each product can have different attributes\ndb.products.insertMany([\n  {\n    name: "MacBook Pro", price: 2499,\n    category: "Electronics",\n    specs: { cpu: "M3 Pro", ram: "18GB" },\n    reviews: [{ user: "alice", rating: 5 }]\n  },\n  {\n    name: "Running Shoes", price: 129,\n    category: "Footwear",\n    sizes: [7, 8, 9, 10, 11],  // different shape!\n    color: "blue"\n  }\n]);`,
          },
        ],
        cards: [
          { title: 'Document (MongoDB)', description: 'JSON-like docs. Flexible schemas. Content, profiles, catalogs.', icon: '📄', color: 'emerald' },
          { title: 'Key-Value (Redis)', description: 'Blazing fast lookups. Caching, sessions, config.', icon: '🔑', color: 'blue' },
          { title: 'Column-Family (Cassandra)', description: 'Write-heavy, time-series, analytics at massive scale.', icon: '📊', color: 'purple' },
          { title: 'Graph (Neo4j)', description: 'Nodes + edges. Social networks, recommendations, fraud.', icon: '🕸️', color: 'amber' },
        ],
        keyTakeaway:
          'NoSQL trades structure and consistency for flexibility, horizontal scalability, and varied data models.',
      },
      {
        title: 'PostgreSQL vs MongoDB — Head to Head',
        content:
          'The two most popular representatives compared directly.',
        table: {
          headers: ['Feature', 'PostgreSQL', 'MongoDB'],
          rows: [
            ['Data model', 'Tables with rows', 'Collections with documents'],
            ['Schema', 'Fixed (ALTER TABLE)', 'Flexible (any shape)'],
            ['Query language', 'SQL', 'MQL (MongoDB Query Language)'],
            ['JOINs', 'Native, powerful', '$lookup (limited, slower)'],
            ['Transactions', 'Full ACID', 'Multi-doc ACID (since 4.0)'],
            ['Scaling', 'Vertical (sharding hard)', 'Horizontal (built-in)'],
          ],
        },
        code: [
          {
            language: 'sql',
            label: 'PostgreSQL JSONB — best of both worlds',
            code: `-- Store flexible JSON inside a relational DB!\nCREATE TABLE products (\n  id    SERIAL PRIMARY KEY,\n  name  VARCHAR(200) NOT NULL,\n  price DECIMAL(10,2) NOT NULL,\n  attrs JSONB  -- flexible attributes\n);\n\nINSERT INTO products (name, price, attrs) VALUES\n  ('MacBook', 2499, '{"cpu": "M3", "ram": "18GB"}');\n\n-- Query JSON fields\nSELECT name FROM products WHERE attrs->>'cpu' = 'M3';\n\n-- Index JSON for fast lookups\nCREATE INDEX idx_attrs ON products USING gin(attrs);`,
          },
        ],
        keyTakeaway:
          'PostgreSQL with JSONB often gives SQL power plus document flexibility, reducing the need for a separate NoSQL database.',
      },
      {
        title: 'When to Choose SQL',
        content:
          'Choose relational databases when your data has clear relationships and you need strong consistency.',
        bullets: [
          '**Clear relationships** — Users have orders, orders have items. Foreign keys model this naturally.',
          '**ACID transactions** — Banking, checkout, inventory management.',
          '**Complex analytical queries** — Aggregations, window functions, CTEs, multi-table JOINs.',
          '**Stable schema** — You know the data shape upfront.',
          '**Strong consistency** — Every read returns the latest write.',
        ],
        keyTakeaway:
          'Choose SQL for structured, relational data with strong consistency requirements. PostgreSQL is the safe default.',
      },
      {
        title: 'When to Choose NoSQL',
        content:
          'Choose NoSQL when flexibility, scale, or specialized access patterns outweigh SQL\'s advantages.',
        bullets: [
          '**Varying data shapes** — User-generated content, catalogs with wildly different attributes.',
          '**Massive horizontal scale** — Millions of writes/sec across hundreds of servers.',
          '**Ultra-low latency lookups** — Redis for caching, sessions, real-time features.',
          '**Graph-shaped data** — Social networks, recommendations, fraud detection.',
          '**Rapid prototyping** — Change data shape without ALTER TABLE migrations.',
        ],
        keyTakeaway:
          'Choose NoSQL for flexible schemas, massive write scale, ultra-fast caching, or graph-shaped data.',
      },
      {
        title: 'Polyglot Persistence',
        content:
          'Most mature applications use MULTIPLE databases, each for what it does best.',
        flow: [
          { label: 'PostgreSQL', description: 'Core data: users, orders, payments', icon: '🐘' },
          { label: 'Redis', description: 'Caching, sessions, leaderboards', icon: '⚡' },
          { label: 'Elasticsearch', description: 'Full-text search', icon: '🔍' },
          { label: 'S3', description: 'File storage (images, videos)', icon: '📁' },
          { label: 'ClickHouse', description: 'Analytics and reporting', icon: '📊' },
        ],
        code: [
          {
            language: 'javascript',
            label: 'Polyglot persistence in Node.js',
            code: `import { Pool } from 'pg';           // Core data\nimport Redis from 'ioredis';          // Caching\nimport { Client } from '@elastic/elasticsearch';\n\nasync function getProduct(id: string) {\n  // Check cache first\n  const cached = await redis.get(\`product:\${id}\`);\n  if (cached) return JSON.parse(cached);\n\n  // Cache miss: query PostgreSQL\n  const { rows } = await pg.query(\n    'SELECT * FROM products WHERE id = $1', [id]\n  );\n  // Store in cache for next time\n  await redis.set(\`product:\${id}\`,\n    JSON.stringify(rows[0]), 'EX', 300);\n  return rows[0];\n}`,
          },
        ],
        keyTakeaway:
          'Use polyglot persistence: SQL for core data, Redis for caching, specialized stores for search, analytics, and files.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Choosing NoSQL because "it scales better" without understanding trade-offs',
        explanation:
          'NoSQL trades consistency, transactions, and query power for flexibility and scale. If you need JOINs and ACID, NoSQL makes your life harder.',
      },
      {
        mistake: 'Using MongoDB as if it were relational',
        explanation:
          'If you do lots of $lookup and wish for foreign keys, you probably need a relational database.',
      },
      {
        mistake: 'Starting with multiple databases in a new project',
        explanation:
          'Start with one database (usually PostgreSQL). Add specialized stores when a concrete need arises.',
      },
      {
        mistake: 'Ignoring PostgreSQL JSONB',
        explanation:
          'JSONB gives document-store flexibility inside a relational database. Check if it solves your problem before adding MongoDB.',
      },
    ],
    practiceQuestions: [
      'Building a social platform. SQL, NoSQL, or both? Justify for each data type.',
      'Three scenarios where a document database is a better fit than relational.',
      'What is polyglot persistence? Give an example architecture.',
      'Your team chose MongoDB for e-commerce but struggles with transactions. What went wrong?',
      'How does PostgreSQL JSONB blur the SQL/NoSQL line?',
    ],
  },

  // ───────────────────────────────────────────────
  // 13. Database Design Patterns
  // ───────────────────────────────────────────────
  'database-design-patterns': {
    steps: [
      {
        title: 'Why Patterns Matter',
        content:
          'Database design patterns are proven solutions to common problems, just like software design patterns. They save you from reinventing the wheel.',
        cards: [
          { title: 'Star Schema', description: 'Foundation of data warehousing. Central facts + dimension tables.', icon: '⭐', color: 'amber' },
          { title: 'Soft Deletes', description: 'Delete without deleting. Set deleted_at timestamp instead.', icon: '🗑️', color: 'blue' },
          { title: 'Event Sourcing', description: 'Store events, not state. Replay to derive current state.', icon: '📜', color: 'purple' },
          { title: 'CQRS', description: 'Separate read and write models for independent optimization.', icon: '↔️', color: 'emerald' },
        ],
        keyTakeaway:
          'Database design patterns are reusable solutions to common data modeling problems.',
      },
      {
        title: 'Star Schema — The Data Warehouse Standard',
        content:
          'A central fact table (events/measures) surrounded by dimension tables (descriptive attributes). Optimized for fast analytical queries.',
        diagram: `         ┌──────────┐\n         │dim_date  │\n         └────┬─────┘\n              │\n┌──────────┐  │  ┌────────────┐\n│dim_product├──┼──┤ fact_sales │\n└──────────┘  │  └──┬─────────┘\n              │     │\n         ┌────┴─────┤\n         │dim_cust  │\n         └──────────┘\n\n  Fact = measurable events (sales, clicks)\n  Dimensions = descriptive (product, date, customer)`,
        code: [
          {
            language: 'sql',
            label: 'Star schema for retail',
            code: `-- Dimension tables\nCREATE TABLE dim_product (\n  product_key SERIAL PRIMARY KEY,\n  name VARCHAR(200), category VARCHAR(100), brand VARCHAR(100)\n);\n\nCREATE TABLE dim_date (\n  date_key INT PRIMARY KEY,\n  full_date DATE, year INT, quarter INT, month INT\n);\n\n-- Fact table\nCREATE TABLE fact_sales (\n  sale_id SERIAL PRIMARY KEY,\n  product_key INT REFERENCES dim_product,\n  date_key INT REFERENCES dim_date,\n  quantity INT, total_amount DECIMAL(10,2)\n);\n\n-- Analytical query: sales by category and quarter\nSELECT dp.category, dd.year, dd.quarter,\n  SUM(fs.total_amount) AS revenue\nFROM fact_sales fs\nJOIN dim_product dp ON fs.product_key = dp.product_key\nJOIN dim_date dd ON fs.date_key = dd.date_key\nGROUP BY dp.category, dd.year, dd.quarter;`,
          },
        ],
        analogy:
          'Star schema is like a newspaper article. The fact table is the core story (who, when, how much). Dimension tables are the background details.',
        keyTakeaway:
          'Star schema: central fact table surrounded by dimension tables. Optimized for analytics.',
      },
      {
        title: 'Soft Deletes — Never Actually Delete',
        content:
          'Instead of DELETE, set a deleted_at timestamp. The row stays in the database but is filtered out of normal queries.',
        bullets: [
          '**Audit trail** — Always see what was deleted and when.',
          '**Undo** — Users can restore accidentally deleted items.',
          '**Referential integrity** — Other tables referencing this row won\'t break.',
          '**Legal requirements** — Some industries require retaining records for years.',
        ],
        code: [
          {
            language: 'sql',
            label: 'Soft delete pattern',
            code: `ALTER TABLE posts ADD COLUMN deleted_at TIMESTAMPTZ;\n\n-- "Delete" a post\nUPDATE posts SET deleted_at = NOW() WHERE id = 42;\n\n-- Normal queries only show non-deleted\nCREATE VIEW active_posts AS\n  SELECT * FROM posts WHERE deleted_at IS NULL;\n\n-- Restore a deleted post\nUPDATE posts SET deleted_at = NULL WHERE id = 42;\n\n-- Partial index for performance\nCREATE INDEX idx_active_posts ON posts(created_at)\n  WHERE deleted_at IS NULL;`,
          },
        ],
        keyTakeaway:
          'Soft deletes set deleted_at instead of removing the row. Great for audit trails and undo.',
      },
      {
        title: 'Event Sourcing — Store Events, Not State',
        content:
          'Traditional databases store current state: "Balance is $750." Event sourcing stores the sequence of events that led to that state. The current state is derived by replaying events.',
        flow: [
          { label: 'Deposit $1000', description: 'Event 1', icon: '➕' },
          { label: 'Withdraw $200', description: 'Event 2', icon: '➖' },
          { label: 'Fee $50', description: 'Event 3', icon: '💰' },
          { label: 'Balance: $750', description: 'Derived state', icon: '📊' },
        ],
        code: [
          {
            language: 'sql',
            label: 'Event sourcing for a bank account',
            code: `-- Events table (append-only, never update/delete)\nCREATE TABLE account_events (\n  event_id   SERIAL PRIMARY KEY,\n  account_id UUID NOT NULL,\n  event_type VARCHAR(50) NOT NULL,\n  amount     DECIMAL(10,2) NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Derive current balance by replaying events\nSELECT account_id,\n  SUM(CASE\n    WHEN event_type = 'deposit' THEN amount\n    ELSE -amount\n  END) AS current_balance\nFROM account_events\nWHERE account_id = 'acct-1'\nGROUP BY account_id;`,
          },
        ],
        analogy:
          'Traditional DB = a whiteboard scoreboard. Event sourcing = a play-by-play log. You can always recalculate the score from the log.',
        keyTakeaway:
          'Event sourcing stores immutable events. Replay to derive current state. Great for audit trails and time travel.',
      },
      {
        title: 'CQRS — Separating Reads and Writes',
        content:
          'Reads and writes have different requirements. Writes need validation and consistency. Reads need speed. CQRS optimizes each independently.',
        comparison: {
          leftTitle: 'Write Side',
          rightTitle: 'Read Side',
          items: [
            { left: 'Normalized relational schema', right: 'Denormalized materialized views' },
            { left: 'Validation, business rules', right: 'Speed, flexibility' },
            { left: 'Complex but infrequent', right: 'Simple but 10-100x more frequent' },
            { left: 'Strong consistency', right: 'Can tolerate slight staleness' },
          ],
        },
        code: [
          {
            language: 'sql',
            label: 'CQRS with materialized view',
            code: `-- WRITE side: normalized\nCREATE TABLE orders (id SERIAL PRIMARY KEY, customer_id INT, status VARCHAR(20));\nCREATE TABLE order_items (id SERIAL PRIMARY KEY, order_id INT, quantity INT, price DECIMAL);\n\n-- READ side: denormalized materialized view\nCREATE MATERIALIZED VIEW order_summaries AS\nSELECT o.id, c.name, o.status,\n  COUNT(oi.id) AS items, SUM(oi.quantity * oi.price) AS total\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, c.name, o.status;\n\n-- Reads are now a simple scan\nSELECT * FROM order_summaries WHERE name = 'Alice';`,
          },
        ],
        keyTakeaway:
          'CQRS separates read and write models. Writes use normalized schemas; reads use denormalized views.',
      },
      {
        title: 'Polymorphic Associations',
        content:
          'When one table needs to reference rows from several different tables — like comments on posts, photos, and videos.',
        code: [
          {
            language: 'sql',
            label: 'Polymorphic associations pattern',
            code: `-- Approach 1: type + id columns (simple)\nCREATE TABLE comments (\n  id SERIAL PRIMARY KEY,\n  body TEXT NOT NULL,\n  commentable_type VARCHAR(50) NOT NULL,\n  commentable_id INT NOT NULL\n);\nCREATE INDEX idx_commentable\n  ON comments(commentable_type, commentable_id);\n\n-- Approach 2: separate FK columns (enforces integrity)\nCREATE TABLE comments_v2 (\n  id SERIAL PRIMARY KEY, body TEXT NOT NULL,\n  post_id INT REFERENCES posts(id),\n  photo_id INT REFERENCES photos(id),\n  CONSTRAINT one_parent CHECK (\n    (post_id IS NOT NULL)::int +\n    (photo_id IS NOT NULL)::int = 1\n  )\n);`,
          },
        ],
        analogy:
          'Polymorphic association is like a hotel comment card. The same card can be about the room, restaurant, or pool. Write what you\'re commenting on (type) and which one (ID).',
        keyTakeaway:
          'Polymorphic associations let one table reference multiple other tables using type+id columns.',
      },
      {
        title: 'Choosing the Right Pattern',
        content:
          'Match the pattern to the problem. Use them when they solve a real problem, not just because they sound sophisticated.',
        table: {
          headers: ['Pattern', 'Best For', 'Avoid When'],
          rows: [
            ['Star Schema', 'Data warehouses, analytics dashboards', 'Simple CRUD apps'],
            ['Soft Deletes', 'Audit trails, undo, legal retention', 'Storage is extremely constrained'],
            ['Event Sourcing', 'Financial systems, audit-heavy domains', 'Simple CRUD, adds complexity'],
            ['CQRS', 'Very different read/write patterns', 'Simple apps (overkill)'],
            ['Polymorphic', 'Comments, tags, likes across entity types', 'Need strict FK enforcement'],
          ],
        },
        keyTakeaway:
          'Match the pattern to the problem. Star schema for analytics, soft deletes for audit trails, event sourcing for financial systems.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using event sourcing for simple CRUD applications',
        explanation:
          'Event sourcing adds significant complexity. For a simple blog or todo app, it is massive overkill.',
      },
      {
        mistake: 'Forgetting to filter soft-deleted records',
        explanation:
          'Every query must include WHERE deleted_at IS NULL. Use views or ORM default scopes.',
      },
      {
        mistake: 'Polymorphic associations without an index on (type, id)',
        explanation:
          'Without a composite index, every query to find comments for a specific entity does a full table scan.',
      },
      {
        mistake: 'CQRS with a single database and no read model',
        explanation:
          'The point of CQRS is an optimized read model. Without it, you have complexity with no benefit.',
      },
    ],
    practiceQuestions: [
      'Design a star schema for an e-learning platform tracking course completions.',
      'You need users to restore deleted files. Which pattern and how?',
      'Explain event sourcing to a non-technical stakeholder.',
      'When is CQRS overkill? When is it essential?',
      'Design a "likes" feature for posts, comments, and photos using polymorphic associations.',
    ],
  },
};
