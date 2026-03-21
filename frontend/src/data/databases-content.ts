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
          'Imagine you run a small business. At first you keep customer info on sticky notes. When you have 5 customers, that works. When you have 5,000, you need a filing cabinet with labeled drawers, folders, and an index card system so you can find anything in seconds.\n\nA database is that filing cabinet for software. It is a structured system for storing, organizing, and retrieving data efficiently. Every app you use — Instagram, your bank, even your thermostat — has a database behind it.',
        analogy:
          'Sticky notes = storing data in random text files. A filing cabinet with labeled folders = a database. The label system is the schema, and the act of flipping to the right folder is a query.',
        keyTakeaway:
          'A database is an organized, queryable store of data — not just a pile of files.',
      },
      {
        title: 'Why Not Just Use Files?',
        content:
          "You could store everything in plain text or JSON files, right? Here is why that breaks down:\n\n1. **Concurrent access** — Two users editing the same file at the same time can corrupt it. Databases handle thousands of simultaneous readers and writers safely.\n\n2. **Querying** — Finding all orders over $100 in a JSON file means reading the whole file and looping through it. A database can answer that in milliseconds using indexes.\n\n3. **Integrity** — Files don't enforce rules. A database can guarantee that every order references a real customer (foreign keys) and that prices are never negative (constraints).\n\n4. **Crash recovery** — If your app dies mid-write to a file, the file can be left half-written. Databases use transactions and write-ahead logs to recover cleanly.",
        analogy:
          'Using flat files for app data is like running a hospital where patient records are kept in a shared Google Doc. It works for two patients, but is a disaster at scale.',
        keyTakeaway:
          'Files lack concurrency control, fast querying, integrity constraints, and crash recovery — databases solve all four.',
      },
      {
        title: 'Relational Databases (SQL)',
        content:
          'The most popular type. Data is stored in tables (rows and columns), and tables are connected by relationships. You interact with them using SQL (Structured Query Language).\n\nThink of a spreadsheet where each sheet is a table, each row is a record, and each column is a field. The difference? A database enforces types, relationships, and constraints that a spreadsheet never will.\n\nExamples: PostgreSQL, MySQL, SQLite, Oracle, SQL Server.',
        code: [
          {
            language: 'sql',
            label: 'A simple relational table',
            code: `CREATE TABLE customers (\n  id       SERIAL PRIMARY KEY,\n  name     VARCHAR(100) NOT NULL,\n  email    VARCHAR(255) UNIQUE NOT NULL,\n  country  VARCHAR(50)\n);\n\nINSERT INTO customers (name, email, country)\nVALUES ('Alice', 'alice@example.com', 'US');`,
          },
        ],
        keyTakeaway:
          'Relational databases store data in structured tables linked by keys and are queried with SQL.',
      },
      {
        title: 'Document Databases (NoSQL)',
        content:
          "Instead of rows in tables, document databases store data as flexible JSON-like documents. Each document can have a different shape, making them great for data that doesn't fit neatly into rows and columns.\n\nImagine instead of a rigid spreadsheet, you have a folder of index cards where each card can have whatever fields it needs. One card might have a \"phone\" field, another might not.\n\nExamples: MongoDB, CouchDB, Amazon DocumentDB.",
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
          'Beyond relational and document stores, there are other specialized types:\n\n**Key-Value stores** — Think of a giant dictionary or hash map. You give it a key, it gives you a value. Blazing fast for simple lookups. Examples: Redis, DynamoDB, etcd.\n\n**Column-family stores** — Instead of storing data row-by-row, they store it column-by-column. Great for analytics where you read one column across millions of rows. Examples: Cassandra, HBase.\n\n**Graph databases** — Store data as nodes and edges (relationships). Perfect for social networks, recommendation engines, and fraud detection. Examples: Neo4j, Amazon Neptune.',
        analogy:
          'Key-value = a coat-check counter (give ticket, get coat). Column store = a library organized by subject across buildings. Graph DB = a social map where every person and friendship is a first-class citizen.',
        keyTakeaway:
          'Different workloads call for different database types — there is no one-size-fits-all.',
      },
      {
        title: 'How to Pick the Right Database',
        content:
          "Here is a quick decision framework:\n\n- **Structured data with relationships?** Go relational (PostgreSQL, MySQL).\n- **Flexible or nested data?** Document store (MongoDB).\n- **Ultra-fast simple lookups or caching?** Key-value (Redis).\n- **Massive analytics workloads?** Column store (Cassandra, ClickHouse).\n- **Highly connected data (social graphs)?** Graph DB (Neo4j).\n\nIn practice, most applications start with a relational database because it's the most versatile. You add specialized databases when you hit specific performance or modeling needs.\n\nMany production systems use multiple databases — for example, PostgreSQL for core data, Redis for caching, and Elasticsearch for search. This is called polyglot persistence.",
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
          "Imagine you walk into a restaurant with a huge menu. You don't want to eat everything — you want specific dishes. SQL lets you \"order\" exactly the data you need from a database.\n\n**SELECT** = \"I'd like these items\" (which columns).\n**FROM** = \"from this section of the menu\" (which table).\n**WHERE** = \"but only the vegetarian ones\" (filter).\n**ORDER BY** = \"sorted by price, cheapest first\" (sorting).\n\nSQL stands for Structured Query Language. It is the universal language for talking to relational databases — whether you are using PostgreSQL, MySQL, SQLite, or SQL Server, the core syntax is the same.",
        analogy:
          'SELECT name, price FROM menu WHERE category = \'vegetarian\' ORDER BY price ASC is like telling the waiter: "Show me the names and prices of vegetarian dishes, cheapest first."',
        keyTakeaway:
          'SQL is a declarative language — you describe WHAT data you want, not HOW to get it.',
      },
      {
        title: 'Our Sample Table: employees',
        content:
          "Let's set up a table we will use throughout this lesson. Picture a company with an employees table. Every row is one person, and every column is a piece of information about them.",
        code: [
          {
            language: 'sql',
            label: 'Create and populate the employees table',
            code: `CREATE TABLE employees (\n  id         SERIAL PRIMARY KEY,\n  name       VARCHAR(100) NOT NULL,\n  department VARCHAR(50),\n  salary     NUMERIC(10, 2),\n  hire_date  DATE,\n  is_active  BOOLEAN DEFAULT true\n);\n\nINSERT INTO employees (name, department, salary, hire_date) VALUES\n  ('Alice',   'Engineering', 95000, '2020-03-15'),\n  ('Bob',     'Marketing',   72000, '2019-07-01'),\n  ('Charlie', 'Engineering', 110000, '2018-01-20'),\n  ('Diana',   'Sales',       68000, '2021-11-03'),\n  ('Eve',     'Engineering', 105000, '2020-06-10'),\n  ('Frank',   'Marketing',   78000, '2017-09-25'),\n  ('Grace',   'Sales',       71000, '2022-02-14');`,
          },
        ],
        keyTakeaway:
          'Always have a clear mental picture of the table you are querying — know the column names and types.',
      },
      {
        title: 'SELECT — Picking Your Columns',
        content:
          'The SELECT clause tells the database which columns you want in your result. You can pick specific columns or use * for all columns.\n\nThink of it as choosing which columns of a spreadsheet to display. You rarely need every column, so selecting only what you need makes results cleaner and queries faster.',
        code: [
          {
            language: 'sql',
            label: 'Basic SELECT examples',
            code: `-- Get all columns for all employees\nSELECT * FROM employees;\n\n-- Get only names and salaries\nSELECT name, salary FROM employees;\n\n-- Get unique departments (no duplicates)\nSELECT DISTINCT department FROM employees;\n\n-- Rename a column in the output with AS\nSELECT name, salary AS annual_pay FROM employees;`,
          },
        ],
        keyTakeaway:
          'SELECT * is fine for exploring, but in production code always list the specific columns you need.',
      },
      {
        title: 'WHERE — Filtering Rows',
        content:
          "WHERE is your filter. It keeps only the rows that satisfy a condition. You can combine conditions with AND, OR, and NOT.\n\nThink of WHERE as a bouncer at a club — only rows that meet the criteria get through.",
        code: [
          {
            language: 'sql',
            label: 'WHERE clause examples',
            code: `-- Employees in Engineering\nSELECT name, salary FROM employees\nWHERE department = 'Engineering';\n\n-- Salary above 80k\nSELECT name, salary FROM employees\nWHERE salary > 80000;\n\n-- Combine conditions with AND\nSELECT name FROM employees\nWHERE department = 'Engineering' AND salary > 100000;\n\n-- Use OR for either condition\nSELECT name FROM employees\nWHERE department = 'Sales' OR department = 'Marketing';\n\n-- IN is shorthand for multiple OR\nSELECT name FROM employees\nWHERE department IN ('Sales', 'Marketing');\n\n-- Pattern matching with LIKE\nSELECT name FROM employees\nWHERE name LIKE 'A%';  -- names starting with A\n\n-- NULL checks (use IS NULL, not = NULL)\nSELECT name FROM employees\nWHERE department IS NOT NULL;`,
          },
        ],
        analogy:
          'WHERE is like telling a librarian: "I only want books published after 2020 that are under 300 pages." The librarian (database engine) filters the shelves for you.',
        keyTakeaway:
          'Use = for exact matches, LIKE for patterns, IN for lists, IS NULL for null checks, and AND/OR to combine.',
      },
      {
        title: 'ORDER BY — Sorting Your Results',
        content:
          "ORDER BY controls the sort order of your results. By default it sorts ascending (ASC). Add DESC for descending. You can sort by multiple columns — the second column breaks ties in the first.",
        code: [
          {
            language: 'sql',
            label: 'ORDER BY examples',
            code: `-- Sort by salary, highest first\nSELECT name, salary FROM employees\nORDER BY salary DESC;\n\n-- Sort by department alphabetically, then salary within each dept\nSELECT name, department, salary FROM employees\nORDER BY department ASC, salary DESC;\n\n-- Combine with WHERE\nSELECT name, salary FROM employees\nWHERE department = 'Engineering'\nORDER BY salary DESC;`,
          },
        ],
        keyTakeaway:
          'ORDER BY goes after WHERE. Use ASC (default) or DESC, and chain multiple columns for tie-breaking.',
      },
      {
        title: 'LIMIT and OFFSET — Pagination',
        content:
          'When you have thousands of results, you rarely want them all at once. LIMIT restricts how many rows you get back, and OFFSET skips a number of rows — together they give you pagination.\n\nThis is how every "Page 1, Page 2, Page 3..." feature works under the hood.',
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
          "Sometimes you don't want individual rows — you want a summary. Aggregate functions collapse many rows into a single value. GROUP BY lets you get one summary per group (like per department).\n\nThink of it as asking a teacher: \"What is the class average?\" instead of \"What did each student score?\"",
        code: [
          {
            language: 'sql',
            label: 'Aggregation examples',
            code: `-- How many employees total?\nSELECT COUNT(*) FROM employees;\n\n-- Average salary\nSELECT AVG(salary) AS avg_salary FROM employees;\n\n-- Average salary PER department\nSELECT department, AVG(salary) AS avg_salary, COUNT(*) AS headcount\nFROM employees\nGROUP BY department;\n\n-- Only departments with avg salary > 80k\nSELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 80000;`,
          },
        ],
        analogy:
          'COUNT is like counting heads in a room. AVG is the average test score. GROUP BY is splitting the room by team first, then counting each team separately.',
        keyTakeaway:
          'Use GROUP BY with aggregate functions for per-group summaries. Use HAVING (not WHERE) to filter groups.',
      },
      {
        title: 'Putting It All Together',
        content:
          "Let's write a real-world query that uses everything we have learned. Suppose your manager asks: \"Show me the top 3 departments by average salary, but only include departments with at least 2 employees, and sort from highest to lowest.\"",
        code: [
          {
            language: 'sql',
            label: 'Full query combining all concepts',
            code: `SELECT\n  department,\n  COUNT(*) AS headcount,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MIN(salary) AS lowest,\n  MAX(salary) AS highest\nFROM employees\nWHERE is_active = true\nGROUP BY department\nHAVING COUNT(*) >= 2\nORDER BY avg_salary DESC\nLIMIT 3;`,
          },
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
          "Imagine a spreadsheet where every order includes the customer's full address, phone number, and email — repeated on every single row. If Alice places 50 orders, her address appears 50 times. If she moves, you have to update all 50 rows.\n\nRelational databases solve this by splitting data into separate tables. Customers go in one table, orders go in another, and they are connected by a customer_id. This eliminates redundancy and keeps data consistent.\n\nBut now you have a problem: the data you need is spread across tables. JOINs bring it back together.",
        analogy:
          'Think of two phone contact lists. One has names and phone numbers, the other has names and email addresses. A JOIN is like merging them into one list by matching on the name.',
        keyTakeaway:
          'JOINs combine rows from two or more tables based on a related column (usually a foreign key).',
      },
      {
        title: 'Our Sample Tables',
        content:
          "Let's set up two tables we will use for all our JOIN examples.",
        code: [
          {
            language: 'sql',
            label: 'Create customers and orders tables',
            code: `CREATE TABLE customers (\n  id      SERIAL PRIMARY KEY,\n  name    VARCHAR(100),\n  city    VARCHAR(50)\n);\n\nCREATE TABLE orders (\n  id          SERIAL PRIMARY KEY,\n  customer_id INT REFERENCES customers(id),\n  product     VARCHAR(100),\n  amount      NUMERIC(10, 2),\n  order_date  DATE\n);\n\nINSERT INTO customers (id, name, city) VALUES\n  (1, 'Alice', 'New York'),\n  (2, 'Bob',   'Chicago'),\n  (3, 'Charlie', 'Seattle'),\n  (4, 'Diana', 'Austin');    -- Diana has no orders\n\nINSERT INTO orders (id, customer_id, product, amount, order_date) VALUES\n  (101, 1, 'Laptop',    999.99, '2024-01-15'),\n  (102, 1, 'Mouse',      29.99, '2024-01-15'),\n  (103, 2, 'Keyboard',   79.99, '2024-02-03'),\n  (104, 3, 'Monitor',   349.99, '2024-02-20'),\n  (105, NULL, 'USB Cable', 9.99, '2024-03-01');  -- orphan order`,
          },
        ],
        keyTakeaway:
          'Notice Diana (customer 4) has no orders, and order 105 has no customer. These edge cases make JOINs interesting.',
      },
      {
        title: 'INNER JOIN — Only the Matches',
        content:
          'An INNER JOIN returns only rows where there is a match in BOTH tables. If a customer has no orders, they are excluded. If an order has no matching customer, it is excluded too.\n\nThis is the most common JOIN and often just written as JOIN (without the word INNER).',
        code: [
          {
            language: 'sql',
            label: 'INNER JOIN example',
            code: `SELECT c.name, o.product, o.amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;\n\n-- Result:\n-- Alice   | Laptop   | 999.99\n-- Alice   | Mouse    |  29.99\n-- Bob     | Keyboard |  79.99\n-- Charlie | Monitor  | 349.99\n-- (Diana is excluded — no orders)\n-- (USB Cable is excluded — no customer)`,
          },
        ],
        analogy:
          'INNER JOIN is like a Venn diagram — you only get the overlap. Think of two friend groups at a party: INNER JOIN returns only the people who are in BOTH groups.',
        keyTakeaway:
          'INNER JOIN = give me only the rows that have a match on both sides.',
      },
      {
        title: 'LEFT JOIN — All From the Left, Matches From the Right',
        content:
          'A LEFT JOIN returns ALL rows from the left table (customers), even if there is no match in the right table (orders). When there is no match, the right-side columns are filled with NULL.\n\nThis is incredibly useful when you want to find records that DON\'T have a match — like customers who have never placed an order.',
        code: [
          {
            language: 'sql',
            label: 'LEFT JOIN example',
            code: `SELECT c.name, o.product, o.amount\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;\n\n-- Result:\n-- Alice   | Laptop   | 999.99\n-- Alice   | Mouse    |  29.99\n-- Bob     | Keyboard |  79.99\n-- Charlie | Monitor  | 349.99\n-- Diana   | NULL     | NULL     <-- included!\n\n-- Find customers with NO orders:\nSELECT c.name\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;\n-- Result: Diana`,
          },
        ],
        analogy:
          'LEFT JOIN is like taking a class roster (left table) and matching it against submitted homework (right table). Every student appears — those who did not submit get a blank next to their name.',
        keyTakeaway:
          'LEFT JOIN keeps all rows from the left table. NULLs appear where there is no match on the right.',
      },
      {
        title: 'RIGHT JOIN and FULL OUTER JOIN',
        content:
          '**RIGHT JOIN** is the mirror of LEFT JOIN — it keeps all rows from the right table and fills NULLs for non-matching left rows. In practice, most developers just swap the table order and use LEFT JOIN instead.\n\n**FULL OUTER JOIN** keeps ALL rows from BOTH tables. If there is no match on either side, NULLs fill in the gaps. This is useful when you need a complete picture of both sides.',
        code: [
          {
            language: 'sql',
            label: 'RIGHT JOIN and FULL OUTER JOIN',
            code: `-- RIGHT JOIN: all orders, even if no matching customer\nSELECT c.name, o.product, o.amount\nFROM customers c\nRIGHT JOIN orders o ON c.id = o.customer_id;\n-- Result includes USB Cable with NULL customer name\n\n-- FULL OUTER JOIN: everything from both sides\nSELECT c.name, o.product, o.amount\nFROM customers c\nFULL OUTER JOIN orders o ON c.id = o.customer_id;\n-- Result:\n-- Alice   | Laptop   | 999.99\n-- Alice   | Mouse    |  29.99\n-- Bob     | Keyboard |  79.99\n-- Charlie | Monitor  | 349.99\n-- Diana   | NULL     | NULL       <-- customer with no order\n-- NULL    | USB Cable|   9.99     <-- order with no customer`,
          },
        ],
        keyTakeaway:
          'RIGHT JOIN = mirror of LEFT JOIN. FULL OUTER JOIN = keep everything from both tables, NULLs where no match.',
      },
      {
        title: 'CROSS JOIN and Self JOIN',
        content:
          '**CROSS JOIN** produces the Cartesian product — every row from table A paired with every row from table B. If A has 4 rows and B has 5, you get 20 rows. Rarely used directly but important to understand because an accidental cross join is a common performance disaster.\n\n**Self JOIN** is when a table is joined to itself. This is useful for hierarchical data like employees and their managers, where both are rows in the same table.',
        code: [
          {
            language: 'sql',
            label: 'CROSS JOIN and Self JOIN',
            code: `-- CROSS JOIN: every customer paired with every product\nSELECT c.name, o.product\nFROM customers c\nCROSS JOIN orders o;\n-- 4 customers x 5 orders = 20 rows\n\n-- Self JOIN: employees and their managers\nCREATE TABLE staff (\n  id         INT PRIMARY KEY,\n  name       VARCHAR(100),\n  manager_id INT REFERENCES staff(id)\n);\n\nINSERT INTO staff VALUES\n  (1, 'CEO', NULL),\n  (2, 'VP Engineering', 1),\n  (3, 'Senior Dev', 2);\n\nSELECT s.name AS employee, m.name AS manager\nFROM staff s\nLEFT JOIN staff m ON s.manager_id = m.id;`,
          },
        ],
        keyTakeaway:
          'CROSS JOIN = every combination (rarely desired). Self JOIN = a table joined to itself (great for hierarchies).',
      },
      {
        title: 'Joining Multiple Tables',
        content:
          "Real applications often join three, four, or more tables in a single query. Each JOIN adds one more table to the result. The key is chaining the ON conditions so each table connects to something already in the query.\n\nLet's add a products table to see this in action.",
        code: [
          {
            language: 'sql',
            label: 'Three-table JOIN',
            code: `CREATE TABLE products (\n  id       SERIAL PRIMARY KEY,\n  name     VARCHAR(100),\n  category VARCHAR(50)\n);\n\nINSERT INTO products (name, category) VALUES\n  ('Laptop', 'Electronics'),\n  ('Mouse', 'Accessories'),\n  ('Keyboard', 'Accessories'),\n  ('Monitor', 'Electronics');\n\n-- Join customers -> orders -> products\nSELECT\n  c.name AS customer,\n  o.amount,\n  p.name AS product,\n  p.category\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nJOIN products p ON o.product = p.name\nWHERE p.category = 'Electronics'\nORDER BY o.amount DESC;`,
          },
        ],
        keyTakeaway:
          'You can chain as many JOINs as needed. Each subsequent JOIN connects to a column already present in the query.',
      },
      {
        title: 'JOIN Performance Tips',
        content:
          "JOINs are powerful but can be slow if used carelessly. Here are the most important performance tips:\n\n1. **Always JOIN on indexed columns.** The columns in your ON clause should have indexes. Foreign key columns are indexed by default in many databases.\n\n2. **Select only the columns you need.** Don't SELECT * from a 5-table JOIN — that pulls every column from every table.\n\n3. **Be careful with FULL OUTER JOINs.** They are harder for the optimizer to handle than INNER or LEFT JOINs.\n\n4. **Watch for accidental CROSS JOINs.** If you forget the ON clause, some databases will treat it as a cross join and produce millions of rows.\n\n5. **Use EXPLAIN to see the query plan.** It shows you whether indexes are being used and where the database is doing full table scans.",
        keyTakeaway:
          'Index your JOIN columns, select only needed columns, and use EXPLAIN to verify the database is not doing unnecessary work.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the ON clause and accidentally creating a CROSS JOIN',
        explanation:
          'If you write "FROM a, b" without a WHERE condition linking them, you get a Cartesian product. With 10,000 rows in each table, that is 100 million rows.',
      },
      {
        mistake: 'Using the wrong JOIN type and silently dropping rows',
        explanation:
          'An INNER JOIN drops customers with no orders. If your report says "100 customers" but you have 120, you probably needed a LEFT JOIN.',
      },
      {
        mistake: 'Not using table aliases',
        explanation:
          'When multiple tables have a column called "id" or "name", queries become ambiguous. Always use short aliases (c for customers, o for orders) and prefix columns.',
      },
      {
        mistake: 'Joining on non-indexed columns',
        explanation:
          'Without an index on the JOIN column, the database must scan the entire table for every row. This turns a fast query into a minutes-long crawl.',
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
          'Imagine you have a 1,000-page textbook and you need to find every mention of "photosynthesis." Without an index, you read every single page — that is a full table scan. With the index at the back of the book, you look up "photosynthesis," find "pages 42, 187, 301," and jump directly there.\n\nA database index works the same way. It is a separate data structure that maps column values to the rows that contain them. When you search by an indexed column, the database jumps straight to the matching rows instead of scanning every row in the table.',
        analogy:
          'No index = reading every page of a book to find a topic. Index = flipping to the back, finding the page number, and jumping there. The index takes extra pages (space), but saves enormous time.',
        keyTakeaway:
          'An index trades storage space for query speed — it lets the database find rows without scanning the entire table.',
      },
      {
        title: 'How B-Tree Indexes Work (Simplified)',
        content:
          "Most databases use a data structure called a B-tree (balanced tree) for indexes. Here is the simplified version:\n\nImagine you are looking for the name \"Maria\" in a phone book. You don't start at page 1. You open to the middle, see \"J\", know \"M\" is to the right, open to 3/4 of the way, see \"N\", go slightly left — and within 3-4 jumps you find \"M\" names. That is a B-tree search.\n\nA B-tree keeps values sorted in a tree structure. Each node contains multiple values and pointers to child nodes. To find a value, you start at the root and follow pointers down — each level cuts the search space dramatically. For a table with 1 million rows, a B-tree index can find any row in about 20 comparisons.",
        analogy:
          "A B-tree is like a well-organized library. The root node is the building directory (Floor 1: A-M, Floor 2: N-Z). Each floor has section signs, each section has shelf labels. You narrow down at every level until you're at the exact book.",
        keyTakeaway:
          'B-trees keep data sorted in a balanced tree. Finding any value takes O(log n) comparisons — around 20 steps for a million rows.',
      },
      {
        title: 'Creating and Using Indexes',
        content:
          "Creating an index is simple. The database does the heavy lifting of building and maintaining the B-tree. Let's see the most common patterns.",
        code: [
          {
            language: 'sql',
            label: 'Creating indexes',
            code: `-- Single-column index\nCREATE INDEX idx_employees_department\n  ON employees(department);\n\n-- Composite index (multiple columns)\nCREATE INDEX idx_employees_dept_salary\n  ON employees(department, salary);\n\n-- Unique index (also enforces uniqueness)\nCREATE UNIQUE INDEX idx_employees_email\n  ON employees(email);\n\n-- Partial index (only indexes some rows)\nCREATE INDEX idx_active_employees\n  ON employees(name)\n  WHERE is_active = true;\n\n-- Check existing indexes on a table (PostgreSQL)\nSELECT indexname, indexdef\nFROM pg_indexes\nWHERE tablename = 'employees';`,
          },
        ],
        keyTakeaway:
          'CREATE INDEX on columns you frequently search, filter, or join on. Composite indexes cover multi-column queries.',
      },
      {
        title: 'When Indexes Help',
        content:
          "Indexes dramatically speed up these operations:\n\n1. **WHERE clauses** — Filtering rows by an indexed column is fast.\n2. **JOIN conditions** — Matching rows between tables uses the index.\n3. **ORDER BY** — If the index matches the sort order, no separate sort step is needed.\n4. **Aggregate queries** — MIN and MAX on an indexed column are nearly instant.\n\nLet's see the difference with a concrete example. On a table with 10 million rows:\n\n- WITHOUT index on email: `SELECT * FROM users WHERE email = 'alice@example.com'` scans all 10 million rows. Takes ~3 seconds.\n- WITH index on email: Same query does a B-tree lookup. Takes ~0.001 seconds.\n\nThat is a 3,000x speedup from one CREATE INDEX statement.",
        keyTakeaway:
          'Index columns that appear in WHERE, JOIN ON, and ORDER BY clauses — those are the hot paths your queries use.',
      },
      {
        title: 'When Indexes Hurt',
        content:
          "Indexes are not free. They have real costs:\n\n1. **Storage space** — Each index is a separate data structure on disk. A table with 5 indexes uses significantly more disk than the table alone.\n\n2. **Slower writes** — Every INSERT, UPDATE, or DELETE must also update every index on that table. If you have 10 indexes, each insert does 10 extra write operations.\n\n3. **Low-selectivity columns** — An index on a boolean column (true/false) is nearly useless. The database would have to visit half the rows anyway — a full scan might be faster.\n\n4. **Small tables** — If the table has 100 rows, a full scan is instant. An index adds complexity for no benefit.\n\nThe rule of thumb: add indexes to support your most important queries, but don't sprinkle them everywhere blindly.",
        analogy:
          'Each index is like maintaining a separate sorted list of your contacts — one by name, one by city, one by birthday. Having 2-3 lists is helpful. Having 20 lists means every time you add a new contact, you are updating 20 lists.',
        keyTakeaway:
          'Indexes speed up reads but slow down writes. Add them strategically for your most critical query patterns.',
      },
      {
        title: 'Composite Index Column Order Matters',
        content:
          'When creating a composite index on multiple columns, the order matters enormously. A composite index on (department, salary) can be used for:\n\n- Queries filtering on department only\n- Queries filtering on department AND salary\n- Queries filtering on department and sorting by salary\n\nBut it CANNOT efficiently help with:\n- Queries filtering on salary only (without department)\n\nThis is the "leftmost prefix" rule. The index is like a phone book sorted by last name, then first name. You can look up all "Smiths" (first column). You can look up "Smith, Alice" (both columns). But you cannot efficiently find all "Alices" across all last names.',
        code: [
          {
            language: 'sql',
            label: 'Composite index usage',
            code: `CREATE INDEX idx_dept_salary ON employees(department, salary);\n\n-- Uses the index (filters on leftmost column)\nSELECT * FROM employees WHERE department = 'Engineering';\n\n-- Uses the index (filters on both columns)\nSELECT * FROM employees\nWHERE department = 'Engineering' AND salary > 100000;\n\n-- Does NOT efficiently use this index (skips leftmost column)\nSELECT * FROM employees WHERE salary > 100000;\n-- For this query, you would need a separate index on salary.`,
          },
        ],
        keyTakeaway:
          'Put the most-filtered column first in a composite index. The "leftmost prefix" rule determines which queries can use it.',
      },
      {
        title: 'Types of Indexes Beyond B-Tree',
        content:
          "B-tree is the default, but databases offer specialized index types for different use cases:\n\n**Hash index** — Perfect for exact equality lookups (WHERE email = 'x'). Faster than B-tree for = comparisons but cannot handle range queries (>, <, BETWEEN).\n\n**GIN (Generalized Inverted Index)** — For full-text search, arrays, and JSONB columns. If you search inside JSON documents, this is your index.\n\n**GiST (Generalized Search Tree)** — For geometric data, ranges, and nearest-neighbor searches. Used in PostGIS for geographic queries.\n\n**BRIN (Block Range Index)** — Ultra-compact index for data that is naturally sorted on disk (like timestamps in a log table). Uses minimal space.",
        code: [
          {
            language: 'sql',
            label: 'Specialized index types (PostgreSQL)',
            code: `-- Hash index for exact lookups\nCREATE INDEX idx_email_hash ON users USING hash(email);\n\n-- GIN index for full-text search\nCREATE INDEX idx_search ON articles USING gin(to_tsvector('english', body));\n\n-- GIN index for JSONB queries\nCREATE INDEX idx_metadata ON products USING gin(metadata);\n\n-- BRIN index for time-series data\nCREATE INDEX idx_created ON events USING brin(created_at);`,
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
          'Each index slows down writes and uses disk space. Only index columns that appear in frequent WHERE, JOIN, and ORDER BY clauses. Profile your actual queries first.',
      },
      {
        mistake: 'Wrong column order in composite indexes',
        explanation:
          'An index on (A, B) helps queries filtering on A or A+B, but not B alone. Put the most selective and most frequently filtered column first.',
      },
      {
        mistake: 'Indexing low-cardinality columns like booleans',
        explanation:
          'An index on a column with only two values (true/false) is rarely useful. The database has to visit half the rows either way. Consider a partial index instead.',
      },
      {
        mistake: 'Never checking if indexes are actually being used',
        explanation:
          'Use EXPLAIN ANALYZE to verify the database is using your index. Sometimes the query planner decides a full scan is faster — your index might be wasted.',
      },
    ],
    practiceQuestions: [
      'Explain in plain English how a B-tree index speeds up a WHERE clause lookup.',
      'You have a query: SELECT * FROM orders WHERE customer_id = 5 AND status = \'shipped\' ORDER BY created_at DESC. What composite index would you create?',
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
          'Imagine you work at a university and keep all student course data in one giant spreadsheet:\n\n| student_id | student_name | course_code | course_name | instructor | grade |\n| 1 | Alice | CS101 | Intro to CS | Dr. Smith | A |\n| 1 | Alice | MATH201 | Calculus II | Dr. Jones | B+ |\n| 2 | Bob | CS101 | Intro to CS | Dr. Smith | B |\n\nNotice the problems? "Alice" is repeated twice. "CS101" and "Intro to CS" and "Dr. Smith" are repeated. If Dr. Smith changes his name, you have to update every row that mentions him. If you misspell "Intro to CS" in one row, your data is inconsistent.\n\nNormalization is the process of reorganizing this messy spreadsheet into clean, separate tables that eliminate redundancy.',
        analogy:
          'An unnormalized table is like a class roster where every row includes the full school address, the principal\'s name, and the building number. Normalization says: "Put the school info in its own table, and just reference it by school_id."',
        keyTakeaway:
          'Normalization eliminates data redundancy by splitting one big table into several smaller, related tables.',
      },
      {
        title: 'Why Normalization Matters',
        content:
          "Redundant data causes three specific problems:\n\n**Update anomaly** — If the course name \"Intro to CS\" changes to \"Computer Science Fundamentals,\" you have to update it in every row that references it. Miss one and your data is inconsistent.\n\n**Insert anomaly** — You want to add a new course, but no student has enrolled yet. In the flat spreadsheet, you can't insert a course without a student — every row needs a student_id.\n\n**Delete anomaly** — If Alice drops all her courses, and she was the only student in MATH201, deleting her rows also deletes the fact that MATH201 exists.\n\nNormalization solves all three by ensuring each piece of information lives in exactly one place.",
        keyTakeaway:
          'Without normalization, you get update, insert, and delete anomalies — bugs caused by data living in multiple places.',
      },
      {
        title: 'First Normal Form (1NF) — No Repeating Groups',
        content:
          '1NF is the foundation. A table is in 1NF if:\n\n1. Every column contains only atomic (single) values — no lists or sets.\n2. Each row is unique (has a primary key).\n3. There are no repeating groups of columns.\n\nHere is a violation and its fix:',
        code: [
          {
            language: 'sql',
            label: 'Fixing a 1NF violation',
            code: `-- VIOLATION: courses stored as a comma-separated list\n-- | student_id | name  | courses              |\n-- | 1          | Alice | CS101, MATH201       |\n-- | 2          | Bob   | CS101                |\n\n-- FIX: one row per student-course combination\nCREATE TABLE student_courses (\n  student_id   INT,\n  student_name VARCHAR(100),\n  course_code  VARCHAR(20),\n  PRIMARY KEY (student_id, course_code)\n);\n\nINSERT INTO student_courses VALUES\n  (1, 'Alice', 'CS101'),\n  (1, 'Alice', 'MATH201'),\n  (2, 'Bob',   'CS101');`,
          },
        ],
        analogy:
          "1NF says: Don't stuff a list into a single cell. It's like saying every box in your filing cabinet should contain exactly one document, not a stack of unrelated papers.",
        keyTakeaway:
          '1NF: every cell holds a single value, every row is unique. No comma-separated lists in columns.',
      },
      {
        title: 'Second Normal Form (2NF) — Remove Partial Dependencies',
        content:
          'A table is in 2NF if it is in 1NF AND every non-key column depends on the ENTIRE primary key, not just part of it. This only matters when you have a composite primary key.\n\nIn our student_courses table, the composite key is (student_id, course_code). The student_name depends only on student_id — not on the full key. That is a partial dependency and violates 2NF.\n\nThe fix: move student_name to its own table.',
        code: [
          {
            language: 'sql',
            label: 'Decomposing to 2NF',
            code: `-- Before (1NF but not 2NF):\n-- student_courses(student_id, course_code, student_name, grade)\n-- student_name depends only on student_id (partial dependency)\n\n-- After (2NF):\nCREATE TABLE students (\n  student_id   INT PRIMARY KEY,\n  student_name VARCHAR(100)\n);\n\nCREATE TABLE enrollments (\n  student_id  INT REFERENCES students(student_id),\n  course_code VARCHAR(20),\n  grade       CHAR(2),\n  PRIMARY KEY (student_id, course_code)\n);`,
          },
        ],
        keyTakeaway:
          '2NF: every non-key column must depend on the WHOLE primary key. Split out columns that depend on only part of the key.',
      },
      {
        title: 'Third Normal Form (3NF) — Remove Transitive Dependencies',
        content:
          'A table is in 3NF if it is in 2NF AND no non-key column depends on another non-key column. This is called a transitive dependency.\n\nExample: In an enrollments table, suppose you also store course_name and instructor. The instructor depends on the course_code, not on the enrollment. Course_code determines course_name, and course_code determines instructor. These are transitive dependencies.\n\nThe fix: create a courses table.',
        code: [
          {
            language: 'sql',
            label: 'Decomposing to 3NF',
            code: `-- Before (2NF but not 3NF):\n-- enrollments(student_id, course_code, grade, course_name, instructor)\n-- course_name and instructor depend on course_code, not the PK\n\n-- After (3NF): three clean tables\nCREATE TABLE students (\n  student_id   INT PRIMARY KEY,\n  student_name VARCHAR(100)\n);\n\nCREATE TABLE courses (\n  course_code VARCHAR(20) PRIMARY KEY,\n  course_name VARCHAR(100),\n  instructor  VARCHAR(100)\n);\n\nCREATE TABLE enrollments (\n  student_id  INT REFERENCES students(student_id),\n  course_code VARCHAR(20) REFERENCES courses(course_code),\n  grade       CHAR(2),\n  PRIMARY KEY (student_id, course_code)\n);`,
          },
        ],
        analogy:
          '3NF says: if column A determines column B, and B determines column C, then C should be in B\'s table, not A\'s. It\'s like saying the instructor\'s phone number belongs in the instructor\'s file, not repeated in every course listing.',
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
            code: `-- STARTING POINT: One messy table\n-- flat_data(student_id, student_name, student_email,\n--           course_code, course_name, instructor, grade)\n\n-- Step 1 (1NF): Already in 1NF (no multi-valued columns)\n\n-- Step 2 (2NF): student_name and student_email depend only\n-- on student_id -> extract to students table\n\n-- Step 3 (3NF): course_name and instructor depend on\n-- course_code (not on the enrollment PK) -> extract to courses\n\n-- FINAL SCHEMA:\nCREATE TABLE students (\n  student_id    INT PRIMARY KEY,\n  student_name  VARCHAR(100),\n  student_email VARCHAR(255) UNIQUE\n);\n\nCREATE TABLE courses (\n  course_code VARCHAR(20) PRIMARY KEY,\n  course_name VARCHAR(100),\n  instructor  VARCHAR(100)\n);\n\nCREATE TABLE enrollments (\n  student_id  INT REFERENCES students(student_id),\n  course_code VARCHAR(20) REFERENCES courses(course_code),\n  grade       CHAR(2),\n  PRIMARY KEY (student_id, course_code)\n);\n\n-- Query to get the original flat view back:\nSELECT s.student_name, c.course_name, c.instructor, e.grade\nFROM enrollments e\nJOIN students s ON e.student_id = s.student_id\nJOIN courses c ON e.course_code = c.course_code;`,
          },
        ],
        keyTakeaway:
          'After normalization, each table stores one concept. JOINs reconstruct the original view when needed.',
      },
      {
        title: 'When to Denormalize',
        content:
          "Normalization is not always the answer. In some cases, you intentionally denormalize — adding redundancy back — for performance.\n\n**Read-heavy systems**: If you constantly join 5 tables together and the data rarely changes, storing a pre-joined \"view\" can be faster.\n\n**Analytics/reporting**: Data warehouses often use denormalized star schemas because analysts query billions of rows and JOINs are expensive at that scale.\n\n**Caching layers**: Storing a user's display name alongside their posts (instead of always joining to the users table) reduces query complexity.\n\nThe principle: **normalize by default, denormalize with intention**. Know the rules before you break them.",
        analogy:
          "Normalization is like organizing your closet perfectly — everything in its place. Denormalization is like keeping a jacket by the front door because you use it every day, even though it 'belongs' in the closet.",
        keyTakeaway:
          'Normalize by default. Denormalize strategically for read-heavy performance — but understand the trade-offs.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Storing comma-separated values in a column',
        explanation:
          'This violates 1NF and makes querying, updating, and validating individual values extremely difficult. Use a separate table with one row per value.',
      },
      {
        mistake: 'Over-normalizing to the point of needing 10-table JOINs',
        explanation:
          'Normalization is a guideline, not a religion. If you need to join 10 tables for a simple query, consider strategic denormalization.',
      },
      {
        mistake: 'Confusing 2NF and 3NF',
        explanation:
          '2NF addresses partial dependencies (non-key depends on PART of composite key). 3NF addresses transitive dependencies (non-key depends on another non-key). Both are about removing inappropriate dependencies.',
      },
    ],
    practiceQuestions: [
      'Given a table orders(order_id, customer_name, customer_email, product_name, product_price, quantity), identify the normalization violations and decompose into 3NF.',
      'What are the three types of anomalies that normalization prevents? Give an example of each.',
      'Explain the difference between 2NF and 3NF in your own words.',
      'When would you intentionally denormalize a schema? Give a concrete scenario.',
      'Is a table with a single-column primary key automatically in 2NF? Why or why not?',
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
          "Imagine you are transferring $500 from your checking account to your savings account. This requires two steps:\n\n1. Subtract $500 from checking.\n2. Add $500 to savings.\n\nWhat happens if the system crashes after step 1 but before step 2? Your $500 just vanished into thin air. Or what if two transfers happen simultaneously and they both read the same balance before either writes?\n\nA transaction groups multiple operations into a single all-or-nothing unit. Either ALL the steps complete successfully, or NONE of them take effect. The database will never leave you in a half-done state.",
        analogy:
          'A transaction is like a handshake deal where both parties must follow through. If either side backs out, the whole deal is canceled and everything goes back to how it was before.',
        keyTakeaway:
          'A transaction groups multiple operations into one atomic unit — all succeed together or all fail together.',
      },
      {
        title: 'Atomicity — All or Nothing',
        content:
          'The "A" in ACID. Atomicity guarantees that a transaction is treated as a single, indivisible operation. If any part fails, the entire transaction is rolled back and the database returns to its previous state.\n\nThis is what prevents the "lost $500" scenario. If the system crashes after debiting your checking but before crediting your savings, atomicity ensures the debit is also reversed.',
        code: [
          {
            language: 'sql',
            label: 'Atomicity in action',
            code: `BEGIN;\n\n-- Step 1: Debit checking\nUPDATE accounts SET balance = balance - 500\nWHERE id = 1 AND account_type = 'checking';\n\n-- Step 2: Credit savings\nUPDATE accounts SET balance = balance + 500\nWHERE id = 1 AND account_type = 'savings';\n\n-- If everything worked:\nCOMMIT;\n\n-- If something went wrong:\n-- ROLLBACK;  (undoes both steps)`,
          },
        ],
        analogy:
          'Atomicity is like an elevator — it takes you all the way to your floor or brings you back to where you started. It never leaves you stuck between floors.',
        keyTakeaway:
          'Atomicity: if any step in a transaction fails, ALL steps are undone. The database never shows a half-complete state.',
      },
      {
        title: 'Consistency — Rules Always Hold',
        content:
          "The \"C\" in ACID. Consistency means that a transaction moves the database from one valid state to another valid state. It never violates the database's own rules (constraints, foreign keys, triggers, etc.).\n\nFor example, if there is a constraint that account balances cannot go negative, and a transfer would make your checking account -$100, the entire transaction is rejected. The database stays in a valid state.\n\nConsistency is enforced by:\n- CHECK constraints (balance >= 0)\n- NOT NULL constraints\n- UNIQUE constraints\n- Foreign key constraints\n- Triggers that validate data",
        code: [
          {
            language: 'sql',
            label: 'Consistency enforcement',
            code: `-- This constraint prevents negative balances\nALTER TABLE accounts\n  ADD CONSTRAINT positive_balance CHECK (balance >= 0);\n\n-- This transaction will FAIL if Alice has less than $500\nBEGIN;\nUPDATE accounts SET balance = balance - 500\nWHERE id = 1 AND account_type = 'checking';\n-- If balance goes below 0, the CHECK constraint fires\n-- and the entire transaction is rolled back.\nCOMMIT;`,
          },
        ],
        keyTakeaway:
          'Consistency: the database moves from one valid state to another. Constraints and rules are never violated.',
      },
      {
        title: 'Isolation — Transactions Do Not Interfere',
        content:
          "The \"I\" in ACID. Isolation ensures that concurrent transactions do not interfere with each other. Even if 100 transactions are running simultaneously, each one behaves as if it were the only one.\n\nWithout isolation, you get problems like:\n\n**Dirty read** — Transaction A reads data that Transaction B has modified but not yet committed. If B rolls back, A just read phantom data.\n\n**Non-repeatable read** — Transaction A reads a row, then Transaction B modifies it and commits. When A reads it again, the value has changed.\n\n**Phantom read** — Transaction A runs a query and gets 10 rows. Transaction B inserts a new row. When A runs the same query again, it gets 11 rows.\n\nDatabases provide different isolation levels (which we'll cover in the next lesson) to control how strictly these problems are prevented.",
        analogy:
          'Isolation is like exam proctoring. Each student (transaction) works independently. Strict isolation = opaque dividers between desks. Relaxed isolation = you can glance at your neighbor, but there is a risk of copying wrong answers.',
        keyTakeaway:
          'Isolation: concurrent transactions cannot see each other\'s uncommitted changes. The strictness varies by isolation level.',
      },
      {
        title: 'Durability — Saved Means Saved',
        content:
          "The \"D\" in ACID. Durability guarantees that once a transaction is committed, the data is permanently saved — even if the server crashes, loses power, or catches fire one second later.\n\nDatabases achieve this by writing committed data to disk (not just memory) before confirming the commit. Specifically, they use a Write-Ahead Log (WAL): before changing any data, the database first writes the change to a log file on disk. If the system crashes, it replays the log on startup to recover.\n\nThis is why databases are more reliable than just writing to a file — the WAL mechanism ensures crash recovery.",
        analogy:
          'Durability is like sending a certified letter. Once you get the receipt (COMMIT confirmed), the letter is guaranteed delivered. Even if the post office burns down, there is a record.',
        keyTakeaway:
          'Durability: once COMMIT returns success, the data survives any subsequent crash. The Write-Ahead Log (WAL) makes this possible.',
      },
      {
        title: 'Writing Transactions in Practice',
        content:
          "Let's see the full pattern of using transactions in application code, including error handling.",
        code: [
          {
            language: 'sql',
            label: 'Full transaction pattern in SQL',
            code: `-- Transfer $200 from account 1 to account 2\nBEGIN;\n\n-- Check sufficient funds\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\n-- FOR UPDATE locks the row so no one else can change it\n\n-- Debit sender\nUPDATE accounts SET balance = balance - 200 WHERE id = 1;\n\n-- Credit receiver\nUPDATE accounts SET balance = balance + 200 WHERE id = 2;\n\n-- Log the transfer\nINSERT INTO transfers (from_id, to_id, amount, created_at)\nVALUES (1, 2, 200, NOW());\n\nCOMMIT;`,
          },
          {
            language: 'javascript',
            label: 'Transaction in Node.js (pg library)',
            code: `const client = await pool.connect();\ntry {\n  await client.query('BEGIN');\n\n  await client.query(\n    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',\n    [200, fromAccountId]\n  );\n\n  await client.query(\n    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',\n    [200, toAccountId]\n  );\n\n  await client.query(\n    'INSERT INTO transfers (from_id, to_id, amount) VALUES ($1, $2, $3)',\n    [fromAccountId, toAccountId, 200]\n  );\n\n  await client.query('COMMIT');\n} catch (err) {\n  await client.query('ROLLBACK');\n  throw err;\n} finally {\n  client.release();\n}`,
          },
        ],
        keyTakeaway:
          'Always wrap multi-step operations in BEGIN/COMMIT with a ROLLBACK in the error handler.',
      },
      {
        title: 'SAVEPOINT — Partial Rollbacks',
        content:
          "Sometimes you want to undo part of a transaction without throwing away all of it. SAVEPOINT creates a checkpoint you can roll back to.\n\nThis is useful in complex business logic where one step might fail but you want to continue with the rest.",
        code: [
          {
            language: 'sql',
            label: 'Using SAVEPOINTs',
            code: `BEGIN;\n\nINSERT INTO orders (customer_id, total) VALUES (1, 100.00);\nSAVEPOINT after_order;\n\n-- Try to apply a discount coupon\nUPDATE coupons SET used = true WHERE code = 'SAVE20';\n-- If coupon does not exist, rollback just this part\nROLLBACK TO SAVEPOINT after_order;\n\n-- The order insert is still intact!\nCOMMIT;`,
          },
        ],
        keyTakeaway:
          'SAVEPOINT creates a named checkpoint inside a transaction. You can roll back to it without losing earlier work.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Not using transactions for multi-step operations',
        explanation:
          'If you run two UPDATEs without a transaction and the second one fails, the first is already committed. Your data is now inconsistent. Always wrap related changes in BEGIN/COMMIT.',
      },
      {
        mistake: 'Holding transactions open for too long',
        explanation:
          'Long-running transactions hold locks that block other users. Keep transactions as short as possible — do your computation outside the transaction, then do the writes quickly inside it.',
      },
      {
        mistake: 'Assuming autocommit is off',
        explanation:
          'Most databases and drivers default to autocommit mode, where each statement is its own transaction. If you need atomicity across multiple statements, you must explicitly BEGIN a transaction.',
      },
      {
        mistake: 'Forgetting to ROLLBACK on error',
        explanation:
          'If an error occurs inside a transaction and you do not ROLLBACK, the connection may be left in a broken state. Always use try/catch/finally with ROLLBACK in the catch block.',
      },
    ],
    practiceQuestions: [
      'Explain each letter of ACID with your own real-world analogy.',
      'What would happen if a database guaranteed Atomicity but not Durability?',
      'Write a SQL transaction that transfers funds between two accounts, including a check for sufficient balance.',
      'What is the Write-Ahead Log (WAL) and why is it essential for durability?',
      'Describe a scenario where a SAVEPOINT would be more useful than a full ROLLBACK.',
    ],
  },

  // ───────────────────────────────────────────────
  // 7. Isolation Levels
  // ───────────────────────────────────────────────
  'isolation-levels': {
    steps: [
      {
        title: 'The Movie Theater Analogy',
        content:
          'Imagine a movie theater where people are buying and swapping seats. Different "isolation levels" control how much you can see of other people\'s seat-picking activity:\n\n- **Read Uncommitted**: You can see someone hovering over a seat even before they confirm it. They might move — so what you saw could be wrong.\n- **Read Committed**: You only see seats that people have actually sat down in (committed). But if you look twice, someone might have moved between your glances.\n- **Repeatable Read**: Once you look at a seat, its status is frozen for you. No one can appear to move while you are watching.\n- **Serializable**: It is as if you are the only person in the theater. Everything is perfectly consistent, but it is slow because everyone has to take turns.\n\nHigher isolation = more consistency, less performance. Lower isolation = more speed, more risk of weird anomalies.',
        analogy:
          'Isolation levels are like privacy settings on a shared document. Read Uncommitted = anyone can see your unsaved drafts. Serializable = nobody sees anything until you hit publish.',
        keyTakeaway:
          'Isolation levels control the trade-off between data consistency and concurrent performance.',
      },
      {
        title: 'The Three Anomalies',
        content:
          "Before diving into each level, let's clearly define the three problems (anomalies) that isolation levels prevent:\n\n**Dirty Read** — Reading data from a transaction that has not committed yet. If that transaction rolls back, you just read data that never actually existed.\n\n**Non-Repeatable Read** — You read a row, another transaction modifies and commits it, and when you read it again within the same transaction, the value is different.\n\n**Phantom Read** — You run a query (e.g., \"all orders > $100\") and get 10 rows. Another transaction inserts a new matching row. You run the same query again and get 11 rows. A \"phantom\" row appeared.\n\nEach isolation level prevents a different set of these anomalies.",
        keyTakeaway:
          'Dirty reads see uncommitted data, non-repeatable reads see changed data, phantom reads see newly inserted data.',
      },
      {
        title: 'Read Uncommitted — The Wild West',
        content:
          "The lowest isolation level. Transactions can read data that other transactions have modified but not yet committed.\n\nThis means you might see data that never actually becomes permanent — if the writing transaction rolls back, you just made a decision based on ghost data.\n\n**Allows:** dirty reads, non-repeatable reads, phantom reads.\n\n**Use case:** Almost never. Some analytics systems use it when approximate results are acceptable and speed is critical. Most databases don't even implement this level differently from Read Committed.",
        code: [
          {
            language: 'sql',
            label: 'Read Uncommitted example',
            code: `-- Session A:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\nSELECT balance FROM accounts WHERE id = 1;  -- sees $1000\n\n-- Session B (not yet committed):\nBEGIN;\nUPDATE accounts SET balance = 500 WHERE id = 1;\n-- B has NOT committed\n\n-- Session A:\nSELECT balance FROM accounts WHERE id = 1;  -- sees $500!\n-- This is a DIRTY READ — B might roll back\n\n-- Session B:\nROLLBACK;  -- B undoes the change\n\n-- Session A just used $500 in its logic, but the real balance is $1000`,
          },
        ],
        keyTakeaway:
          'Read Uncommitted allows dirty reads — you can see other transactions\' uncommitted changes. Avoid in almost all cases.',
      },
      {
        title: 'Read Committed — The Default for Most Databases',
        content:
          'Read Committed guarantees that you only see data from transactions that have committed. No dirty reads.\n\nHowever, if you read a row twice within the same transaction, it might have changed between reads because another transaction committed in between.\n\nThis is the default isolation level in PostgreSQL, Oracle, and SQL Server.\n\n**Allows:** non-repeatable reads, phantom reads.\n**Prevents:** dirty reads.',
        code: [
          {
            language: 'sql',
            label: 'Read Committed example',
            code: `-- Session A:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSELECT balance FROM accounts WHERE id = 1;  -- sees $1000\n\n-- Session B:\nBEGIN;\nUPDATE accounts SET balance = 800 WHERE id = 1;\nCOMMIT;  -- B commits the change\n\n-- Session A:\nSELECT balance FROM accounts WHERE id = 1;  -- sees $800!\n-- Different value in the same transaction — NON-REPEATABLE READ\nCOMMIT;`,
          },
        ],
        keyTakeaway:
          'Read Committed is the safest common default. No dirty reads, but the same query can return different results within one transaction.',
      },
      {
        title: 'Repeatable Read — Frozen Snapshots',
        content:
          'Repeatable Read guarantees that if you read a row, reading it again in the same transaction returns the same value — even if another transaction committed a change in between.\n\nThe database achieves this by taking a snapshot of the data at the start of the transaction. All reads within the transaction see this snapshot.\n\nThis is the default isolation level in MySQL/InnoDB.\n\n**Allows:** phantom reads (in some implementations).\n**Prevents:** dirty reads, non-repeatable reads.',
        code: [
          {
            language: 'sql',
            label: 'Repeatable Read example',
            code: `-- Session A:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT balance FROM accounts WHERE id = 1;  -- sees $1000\n\n-- Session B:\nBEGIN;\nUPDATE accounts SET balance = 800 WHERE id = 1;\nCOMMIT;\n\n-- Session A:\nSELECT balance FROM accounts WHERE id = 1;  -- STILL sees $1000!\n-- The snapshot protects us from seeing B's change\nCOMMIT;\n\n-- After A commits, a new transaction would see $800`,
          },
        ],
        analogy:
          'Repeatable Read is like taking a photograph of a whiteboard at the start of a meeting. Even if someone erases and rewrites things during the meeting, your photo shows the original content.',
        keyTakeaway:
          'Repeatable Read uses snapshot isolation — your transaction sees the data as it was when the transaction started.',
      },
      {
        title: 'Serializable — Perfect but Slow',
        content:
          "Serializable is the highest isolation level. It guarantees that concurrent transactions produce the same result as if they had run one at a time, in some serial order.\n\nThis prevents ALL anomalies — dirty reads, non-repeatable reads, and phantom reads. But it comes with a significant performance cost because the database must lock more aggressively or abort transactions that would conflict.\n\n**Prevents:** all anomalies.\n**Cost:** reduced concurrency, potential for serialization failures that require retry logic.",
        code: [
          {
            language: 'sql',
            label: 'Serializable example',
            code: `-- Session A:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nSELECT COUNT(*) FROM orders WHERE status = 'pending';  -- 5\n\n-- Session B:\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nINSERT INTO orders (status) VALUES ('pending');\nCOMMIT;\n\n-- Session A:\nSELECT COUNT(*) FROM orders WHERE status = 'pending';  -- still 5!\n-- No phantom read. When A tries to COMMIT, the database\n-- may abort it with a serialization error if there is a conflict.\nCOMMIT;  -- might fail with: "could not serialize access"`,
          },
          {
            language: 'python',
            label: 'Retry logic for serializable transactions',
            code: `import psycopg2\n\ndef run_serializable(conn, operation):\n    max_retries = 3\n    for attempt in range(max_retries):\n        try:\n            with conn.cursor() as cur:\n                cur.execute("BEGIN ISOLATION LEVEL SERIALIZABLE")\n                operation(cur)\n                conn.commit()\n                return  # success\n        except psycopg2.errors.SerializationFailure:\n            conn.rollback()\n            if attempt == max_retries - 1:\n                raise\n            # retry the transaction`,
          },
        ],
        keyTakeaway:
          'Serializable prevents all anomalies but can cause transaction aborts. Always implement retry logic when using it.',
      },
      {
        title: 'Summary — Which Level to Use?',
        content:
          "Here is a quick comparison of all four levels:\n\n| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |\n|---|---|---|---|---|\n| Read Uncommitted | Possible | Possible | Possible | Fastest |\n| Read Committed | Prevented | Possible | Possible | Fast |\n| Repeatable Read | Prevented | Prevented | Possible* | Moderate |\n| Serializable | Prevented | Prevented | Prevented | Slowest |\n\n*PostgreSQL's Repeatable Read actually prevents phantom reads too (it uses true snapshot isolation).\n\n**Rules of thumb:**\n- **Read Committed** (the default) is fine for most applications.\n- Use **Repeatable Read** when you need consistent reads within a transaction (like generating a report).\n- Use **Serializable** only when absolute correctness is required (financial calculations, inventory decrements).\n- Almost never use **Read Uncommitted**.",
        keyTakeaway:
          'Start with Read Committed. Upgrade to Repeatable Read or Serializable only when your application requires stronger guarantees.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Assuming the default isolation level is the same everywhere',
        explanation:
          'PostgreSQL and Oracle default to Read Committed. MySQL/InnoDB defaults to Repeatable Read. Always check your database\'s default.',
      },
      {
        mistake: 'Using Serializable without retry logic',
        explanation:
          'Serializable isolation can abort transactions with serialization errors. Your application must catch these and retry the transaction, or users will see random failures.',
      },
      {
        mistake: 'Not understanding which anomalies your application can tolerate',
        explanation:
          'If your app can tolerate slightly stale reads (e.g., a social media feed), Read Committed is fine. If it cannot tolerate inconsistent reads (e.g., bank balance), you need at least Repeatable Read.',
      },
    ],
    practiceQuestions: [
      'Explain the difference between a dirty read, a non-repeatable read, and a phantom read.',
      'Your e-commerce app sometimes shows an item as "in stock" but then fails at checkout because another user bought the last one. Which isolation level would prevent this?',
      'Why does Serializable isolation require retry logic in application code?',
      'What isolation level does your preferred database default to? Is that sufficient for most applications?',
    ],
  },

  // ───────────────────────────────────────────────
  // 8. Query Optimization
  // ───────────────────────────────────────────────
  'query-optimization': {
    steps: [
      {
        title: 'Why Your Query is Slow — The GPS Analogy',
        content:
          "When you ask your GPS for directions, it does not blindly drive every possible route. It evaluates options and picks the fastest path. Your database does the same thing with a query planner.\n\nWhen you write a SQL query, you are describing WHAT data you want, not HOW to get it. The database's query planner decides the strategy — which indexes to use, in what order to join tables, whether to sort in memory or use an index.\n\nQuery optimization is the art of helping the planner make good decisions. Sometimes it makes bad ones, and you need to understand why.",
        analogy:
          'You are the passenger (writing SQL). The query planner is the GPS. EXPLAIN is like the GPS showing you the turn-by-turn route before you start driving. If the route looks bad, you adjust your query (or add an index) to give the GPS better roads.',
        keyTakeaway:
          'The query planner turns your SQL into an execution plan. Optimization means helping it choose the best plan.',
      },
      {
        title: 'Reading EXPLAIN Output',
        content:
          'EXPLAIN shows you the execution plan the database will use for your query. EXPLAIN ANALYZE actually runs the query and shows real timing data.\n\nThe key things to look for:\n- **Seq Scan** = full table scan (reading every row). Usually slow on large tables.\n- **Index Scan** = using an index. Much faster.\n- **Nested Loop / Hash Join / Merge Join** = the strategy for joining tables.\n- **Sort** = an in-memory sort (check if it could use an index instead).\n- **Cost** = estimated expense (lower is better).\n- **Rows** = estimated number of rows at each step.',
        code: [
          {
            language: 'sql',
            label: 'Using EXPLAIN and EXPLAIN ANALYZE',
            code: `-- See the plan WITHOUT running the query\nEXPLAIN\nSELECT * FROM employees WHERE department = 'Engineering';\n\n-- Example output:\n-- Seq Scan on employees  (cost=0.00..12.50 rows=3 width=120)\n--   Filter: (department = 'Engineering')\n-- ^^^^ This is a full table scan! We need an index.\n\n-- Run the query and see actual timing\nEXPLAIN ANALYZE\nSELECT * FROM employees WHERE department = 'Engineering';\n\n-- Example output:\n-- Seq Scan on employees  (cost=0.00..12.50 rows=3 width=120)\n--                        (actual time=0.015..0.018 rows=3 loops=1)\n--   Filter: (department = 'Engineering')\n--   Rows Removed by Filter: 4\n-- Planning Time: 0.082 ms\n-- Execution Time: 0.035 ms\n\n-- After adding an index:\nCREATE INDEX idx_dept ON employees(department);\n\nEXPLAIN ANALYZE\nSELECT * FROM employees WHERE department = 'Engineering';\n-- Index Scan using idx_dept on employees\n--   (cost=0.14..8.16 rows=3 width=120)\n--   (actual time=0.006..0.008 rows=3 loops=1)`,
          },
        ],
        keyTakeaway:
          'EXPLAIN shows the plan. EXPLAIN ANALYZE shows actual execution times. Look for Seq Scans on large tables — they often need indexes.',
      },
      {
        title: 'The Top Query Performance Killers',
        content:
          "Here are the most common reasons queries are slow, in order of frequency:\n\n1. **Missing indexes** — The number one cause. A WHERE clause on an unindexed column forces a full table scan.\n\n2. **SELECT *** — Fetching every column when you only need 2 wastes I/O and memory, and prevents index-only scans.\n\n3. **N+1 query problem** — Your code runs 1 query to get a list, then N individual queries for each item's details. Use JOINs or batch queries instead.\n\n4. **Joining on non-indexed columns** — A JOIN without an index on the join column turns every join into a nested loop with a full scan.\n\n5. **Functions on indexed columns in WHERE** — WHERE YEAR(created_at) = 2024 cannot use an index on created_at. Rewrite as WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'.\n\n6. **Missing LIMIT** — Returning 1 million rows when the UI shows 20.",
        keyTakeaway:
          'Most slow queries are caused by missing indexes, SELECT *, or the N+1 problem. These are easy to fix once identified.',
      },
      {
        title: 'Optimization: Avoid SELECT *',
        content:
          "This is one of the simplest and most impactful optimizations. Let's see why.",
        code: [
          {
            language: 'sql',
            label: 'SELECT * vs specific columns',
            code: `-- BAD: fetches all columns, including large text/blob columns\nSELECT * FROM articles WHERE author_id = 5;\n-- Even if you only display the title, the DB reads\n-- the entire body (potentially megabytes per row)\n\n-- GOOD: fetch only what you need\nSELECT id, title, created_at FROM articles WHERE author_id = 5;\n\n-- EVEN BETTER: if there is an index on (author_id, title, created_at),\n-- the DB can answer entirely from the index without touching the table.\n-- This is called an INDEX-ONLY SCAN — extremely fast.\nCREATE INDEX idx_articles_author_covering\n  ON articles(author_id) INCLUDE (title, created_at);`,
          },
        ],
        keyTakeaway:
          'Selecting specific columns reduces I/O and enables index-only scans. Never use SELECT * in production code.',
      },
      {
        title: 'Optimization: Fix the N+1 Problem',
        content:
          'The N+1 problem is the most common performance bug in web applications. It happens when your code executes one query to fetch a list, then executes one query per item in that list.',
        code: [
          {
            language: 'javascript',
            label: 'N+1 problem and its fix',
            code: `// BAD: N+1 queries\nconst orders = await db.query('SELECT * FROM orders LIMIT 100');\nfor (const order of orders) {\n  // This runs 100 separate queries!\n  const customer = await db.query(\n    'SELECT name FROM customers WHERE id = $1',\n    [order.customer_id]\n  );\n  order.customerName = customer.rows[0].name;\n}\n// Total: 101 queries (1 + 100)\n\n// GOOD: Single query with JOIN\nconst results = await db.query(\`\n  SELECT o.*, c.name AS customer_name\n  FROM orders o\n  JOIN customers c ON o.customer_id = c.id\n  LIMIT 100\n\`);\n// Total: 1 query`,
          },
        ],
        analogy:
          'N+1 is like calling a pizza shop 10 times to order 10 pizzas one at a time, instead of calling once and ordering all 10.',
        keyTakeaway:
          'Replace N+1 queries with JOINs or batch queries (WHERE id IN (...)). One query beats a hundred.',
      },
      {
        title: 'Optimization: Smart Indexing and Join Order',
        content:
          "The database's query planner usually picks good join orders, but sometimes it gets it wrong — especially when table statistics are outdated. Here are strategies to help.",
        code: [
          {
            language: 'sql',
            label: 'Index and join optimizations',
            code: `-- Update statistics so the planner makes good decisions\nANALYZE employees;\nANALYZE orders;\n\n-- Covering index: include all columns needed by the query\nCREATE INDEX idx_orders_covering\n  ON orders(customer_id) INCLUDE (product, amount);\n\n-- The planner can now answer this query using only the index:\nSELECT product, amount FROM orders WHERE customer_id = 5;\n\n-- Avoid functions on indexed columns\n-- BAD: cannot use index on created_at\nSELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = 2024;\n\n-- GOOD: range scan uses the index\nSELECT * FROM orders\nWHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';\n\n-- Use EXISTS instead of IN for large subqueries\n-- BAD (can be slow with large subquery result):\nSELECT * FROM customers\nWHERE id IN (SELECT customer_id FROM orders WHERE amount > 1000);\n\n-- GOOD (stops at first match per customer):\nSELECT * FROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.id AND o.amount > 1000\n);`,
          },
        ],
        keyTakeaway:
          'Run ANALYZE to update statistics, use covering indexes, avoid functions on indexed columns, and prefer EXISTS over IN for subqueries.',
      },
      {
        title: 'Optimization: Pagination Done Right',
        content:
          'OFFSET-based pagination (LIMIT 20 OFFSET 10000) is common but slow. The database has to read and discard 10,000 rows before returning 20. Cursor-based (keyset) pagination is much faster.',
        code: [
          {
            language: 'sql',
            label: 'Cursor-based pagination',
            code: `-- SLOW: offset pagination (scans and skips rows)\nSELECT * FROM orders\nORDER BY id\nLIMIT 20 OFFSET 10000;  -- skips 10,000 rows every time\n\n-- FAST: cursor-based pagination (jumps via index)\n-- First page:\nSELECT * FROM orders ORDER BY id LIMIT 20;\n-- Returns IDs 1-20. Client remembers last_id = 20.\n\n-- Next page:\nSELECT * FROM orders\nWHERE id > 20  -- index seek, no scanning\nORDER BY id\nLIMIT 20;`,
          },
        ],
        keyTakeaway:
          'Replace OFFSET with cursor-based pagination (WHERE id > last_seen_id) for consistent fast performance regardless of page number.',
      },
      {
        title: 'Putting It All Together: An Optimization Checklist',
        content:
          "When a query is slow, work through this checklist:\n\n1. Run EXPLAIN ANALYZE — identify the bottleneck (Seq Scan? Sort? Nested Loop?).\n2. Check for missing indexes on WHERE, JOIN, and ORDER BY columns.\n3. Replace SELECT * with specific columns.\n4. Check for N+1 queries in application code.\n5. Ensure statistics are up to date (ANALYZE).\n6. Look for functions on indexed columns (rewrite to range conditions).\n7. Consider covering indexes for frequently-run queries.\n8. Switch from OFFSET to cursor-based pagination.\n9. Review if the query can be simplified (unnecessary subqueries, redundant JOINs).\n10. For really complex queries, consider materialized views to pre-compute results.",
        keyTakeaway:
          'Query optimization is systematic: EXPLAIN first, then fix the biggest bottleneck, repeat.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Optimizing without measuring first',
        explanation:
          'Always run EXPLAIN ANALYZE before changing anything. Your assumption about what is slow might be wrong. Data-driven optimization beats guessing.',
      },
      {
        mistake: 'Adding indexes without considering write performance',
        explanation:
          'Every index slows down INSERT, UPDATE, and DELETE operations. On write-heavy tables, adding too many indexes can make writes the new bottleneck.',
      },
      {
        mistake: 'Using OFFSET for deep pagination',
        explanation:
          'OFFSET 100000 LIMIT 20 forces the database to read and discard 100,000 rows. Use cursor-based pagination (WHERE id > last_id) instead.',
      },
      {
        mistake: 'Applying functions to indexed columns in WHERE clauses',
        explanation:
          'WHERE LOWER(email) = \'alice@example.com\' cannot use a normal index on email. Either create a functional index on LOWER(email) or store emails in lowercase.',
      },
    ],
    practiceQuestions: [
      'You run EXPLAIN ANALYZE and see a Seq Scan on a 10-million-row table. What is likely the problem and how do you fix it?',
      'What is the N+1 query problem? Show an example in code and its fix.',
      'Explain why WHERE YEAR(created_at) = 2024 is slower than WHERE created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\'.',
      'What is cursor-based pagination and why is it faster than OFFSET-based pagination?',
      'Design a covering index for this query: SELECT title, author FROM books WHERE category = \'fiction\' ORDER BY published_date DESC.',
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
          "Imagine a city library that has grown so popular it can't fit all its books in one building. The solution? Open multiple branches:\n\n- Branch A holds books with authors A-M.\n- Branch B holds books with authors N-Z.\n\nNow each branch handles half the traffic and stores half the books. If one branch is busy, the other is still fast. If one branch floods, the other still works.\n\nSharding is exactly this concept applied to databases. Instead of one server holding all the data, you split (shard) the data across multiple servers. Each server holds a subset of the total data and handles queries for only its subset.",
        analogy:
          'One giant library = one database server. Multiple library branches, each holding a portion of books = a sharded database. The catalog system that tells you which branch has your book = the shard routing logic.',
        keyTakeaway:
          'Sharding splits a database across multiple servers so that each handles only a portion of the data and traffic.',
      },
      {
        title: 'Why Shard? Vertical Scaling Has Limits',
        content:
          "When your single database server gets slow, you have two options:\n\n**Vertical scaling (scale up)**: Buy a bigger server with more CPU, RAM, and disk. This works up to a point, but the biggest server in the world still has limits — and it gets exponentially expensive.\n\n**Horizontal scaling (scale out)**: Add more servers and split the data across them. This is sharding. There is no upper limit — you can keep adding servers.\n\nSharding becomes necessary when:\n- Your table has billions of rows and queries are slow despite indexes.\n- You are hitting I/O or CPU limits on a single machine.\n- You need geographic distribution (data in the US stays on US servers, EU data on EU servers).\n- You need fault isolation (one shard going down doesn't take down everything).",
        keyTakeaway:
          'Shard when a single server cannot handle the load. Vertical scaling has limits; horizontal scaling (sharding) does not.',
      },
      {
        title: 'Horizontal vs Vertical Sharding',
        content:
          "There are two ways to split data:\n\n**Horizontal sharding (most common)**: Split ROWS across servers. All servers have the same table schema, but each holds a different subset of rows. Example: Server A has users 1-1,000,000, Server B has users 1,000,001-2,000,000.\n\n**Vertical sharding**: Split COLUMNS (tables) across servers. Each server holds different tables. Example: The users table lives on Server A, the orders table on Server B, the analytics data on Server C.\n\nVertical sharding is simpler but limited — eventually your biggest table still won't fit on one server. Horizontal sharding is more complex but truly scalable.",
        analogy:
          'Horizontal sharding = a department store where each floor sells the same types of items but for different customer groups (Floor 1: customers A-M, Floor 2: customers N-Z). Vertical sharding = different stores in a mall (one for clothes, one for electronics, one for food).',
        keyTakeaway:
          'Horizontal sharding splits rows across servers. Vertical sharding splits tables across servers. Horizontal is more scalable.',
      },
      {
        title: 'Shard Keys — How to Decide Where Data Goes',
        content:
          "The shard key is the column that determines which shard holds a given row. Choosing the right shard key is the most important decision in sharding.\n\nA good shard key:\n- Distributes data evenly across shards (no \"hot\" shards).\n- Groups related data on the same shard (queries don't need to cross shards).\n- Is commonly used in queries (so routing is simple).\n\nCommon choices:\n- **user_id** — All of a user's data on one shard. Great for user-centric apps.\n- **geographic region** — US data on US shard, EU data on EU shard. Good for compliance.\n- **tenant_id** — In multi-tenant SaaS, each tenant's data on one shard.",
        keyTakeaway:
          'The shard key determines data placement. Choose one that distributes evenly and keeps related queries on the same shard.',
      },
      {
        title: 'Hash Sharding vs Range Sharding',
        content:
          "Once you have picked a shard key, you need a strategy for mapping key values to shards.\n\n**Hash sharding**: Apply a hash function to the shard key and use modulo to pick the shard. Hash(user_id) % num_shards = shard_number. This distributes data very evenly but makes range queries impossible (you can't ask for \"all users with ID 100-200\" efficiently).\n\n**Range sharding**: Divide the key space into ranges. Shard 1 holds IDs 1-1M, Shard 2 holds 1M-2M, etc. This supports range queries beautifully but can create hot spots if new data clusters at one end (all new users go to the highest shard).",
        code: [
          {
            language: 'python',
            label: 'Hash sharding example',
            code: `import hashlib\n\ndef get_shard(user_id: int, num_shards: int) -> int:\n    """Determine which shard holds this user's data."""\n    hash_val = int(hashlib.md5(str(user_id).encode()).hexdigest(), 16)\n    return hash_val % num_shards\n\n# With 4 shards:\nprint(get_shard(12345, 4))  # -> 2\nprint(get_shard(12346, 4))  # -> 0  (different shard)\nprint(get_shard(12347, 4))  # -> 3  (different shard)\n# Data is spread evenly across shards`,
          },
        ],
        keyTakeaway:
          'Hash sharding distributes evenly but kills range queries. Range sharding supports ranges but can create hot spots.',
      },
      {
        title: 'The Challenges of Sharding',
        content:
          "Sharding solves the scale problem but introduces significant complexity:\n\n**Cross-shard queries**: If you need data from multiple shards (e.g., \"total revenue across all users\"), the query must fan out to every shard, run independently, and merge results. This is much slower than a single-server query.\n\n**Cross-shard transactions**: ACID transactions across shards require distributed transaction protocols (like 2-phase commit), which are slow and complex.\n\n**Resharding**: When you add more servers, you need to redistribute data. With hash sharding, changing num_shards means almost every row moves. Consistent hashing reduces this problem.\n\n**Operational complexity**: You now have N databases to back up, monitor, upgrade, and debug instead of 1.\n\n**Referential integrity**: Foreign keys cannot span shards. You lose the database's ability to enforce relationships across shards.",
        analogy:
          'Sharding is like splitting a puzzle across multiple tables. Each table can work on its piece fast, but seeing the full picture requires walking to every table and combining what you see.',
        keyTakeaway:
          'Sharding adds complexity: cross-shard queries, distributed transactions, resharding, and operational overhead. Only shard when you must.',
      },
      {
        title: 'Sharding in Practice',
        content:
          "Let's see how popular systems handle sharding:",
        code: [
          {
            language: 'sql',
            label: 'PostgreSQL with Citus extension (sharding example)',
            code: `-- Citus turns PostgreSQL into a distributed database\n-- Create a distributed table sharded by customer_id\nSELECT create_distributed_table('orders', 'customer_id');\n\n-- Queries that include customer_id are routed to one shard\nSELECT * FROM orders WHERE customer_id = 42;\n-- -> only hits the shard containing customer 42\n\n-- Queries without customer_id fan out to all shards\nSELECT COUNT(*) FROM orders WHERE amount > 100;\n-- -> runs on all shards, results are combined`,
          },
          {
            language: 'javascript',
            label: 'Application-level sharding in Node.js',
            code: `const shards = [\n  new Pool({ host: 'shard0.db.internal', database: 'myapp' }),\n  new Pool({ host: 'shard1.db.internal', database: 'myapp' }),\n  new Pool({ host: 'shard2.db.internal', database: 'myapp' }),\n  new Pool({ host: 'shard3.db.internal', database: 'myapp' }),\n];\n\nfunction getShard(userId: number): Pool {\n  const shardIndex = userId % shards.length;\n  return shards[shardIndex];\n}\n\nasync function getUser(userId: number) {\n  const shard = getShard(userId);\n  const result = await shard.query(\n    'SELECT * FROM users WHERE id = $1',\n    [userId]\n  );\n  return result.rows[0];\n}`,
          },
        ],
        keyTakeaway:
          'Sharding can be done at the database level (Citus, Vitess) or at the application level. Database-level is easier to manage.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Sharding too early',
        explanation:
          'Sharding adds enormous complexity. Most applications never need it. Exhaust vertical scaling, read replicas, caching, and query optimization first.',
      },
      {
        mistake: 'Choosing a bad shard key',
        explanation:
          'A shard key with low cardinality (like country) creates uneven shards. A shard key not used in queries forces cross-shard lookups. The most common queries should include the shard key.',
      },
      {
        mistake: 'Not planning for resharding',
        explanation:
          'If you start with 4 shards and grow to need 8, moving data is painful. Use consistent hashing from the start to minimize data movement during resharding.',
      },
    ],
    practiceQuestions: [
      'Explain the difference between horizontal and vertical sharding with an example.',
      'You are building a multi-tenant SaaS app. What would you choose as the shard key and why?',
      'What are the trade-offs between hash sharding and range sharding?',
      'Why are cross-shard JOINs problematic? How would you work around them?',
      'At what point should you consider sharding your database?',
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
          "Imagine you have a single copy of an important document. If you lose it — fire, flood, coffee spill — it is gone forever. The obvious solution: make copies and store them in different locations.\n\nDatabase replication applies this same principle. Instead of running one database server, you run multiple servers that contain copies of the same data. This gives you:\n\n**Availability**: If one server goes down, another can take over immediately.\n**Read performance**: Read queries can be spread across replicas instead of hammering one server.\n**Geographic proximity**: Put replicas near your users — US users read from a US server, EU users from an EU server.\n**Backup**: Replicas serve as live backups, always up to date.",
        analogy:
          'Replication is like having backup keys for your house stored at a friend\'s place, your office, and your parents\' house. If you lose one, you can always get in.',
        keyTakeaway:
          'Replication maintains copies of your data on multiple servers for availability, performance, and safety.',
      },
      {
        title: 'Leader-Follower (Master-Slave) Replication',
        content:
          "The most common replication setup. One server is the leader (master) and one or more servers are followers (replicas).\n\n**Writes** go only to the leader. The leader then sends the changes to all followers.\n**Reads** can go to any server — the leader or any follower.\n\nThis is simple and works great when your workload is mostly reads (which is true for most web applications — reading a social media feed happens 100x more than posting).\n\nThe downside: the leader is a single point of failure for writes. If it goes down, no writes can happen until a follower is promoted to be the new leader.",
        code: [
          {
            language: 'sql',
            label: 'PostgreSQL streaming replication setup (conceptual)',
            code: `-- On the leader (primary), postgresql.conf:\n-- wal_level = replica\n-- max_wal_senders = 3\n\n-- On each follower (standby), create standby.signal file\n-- and set in postgresql.conf:\n-- primary_conninfo = 'host=leader-ip port=5432 user=replicator'\n\n-- Application routing:\n-- Writes -> leader connection pool\n-- Reads  -> follower connection pool (round-robin)`,
          },
          {
            language: 'javascript',
            label: 'Read/write splitting in Node.js',
            code: `const leaderPool = new Pool({ host: 'db-leader.internal' });\nconst followerPool = new Pool({ host: 'db-follower.internal' });\n\nasync function writeQuery(sql: string, params: any[]) {\n  return leaderPool.query(sql, params);  // writes go to leader\n}\n\nasync function readQuery(sql: string, params: any[]) {\n  return followerPool.query(sql, params);  // reads go to follower\n}`,
          },
        ],
        keyTakeaway:
          'Leader-follower: all writes go to the leader, reads are distributed across followers. Simple and effective for read-heavy workloads.',
      },
      {
        title: 'Synchronous vs Asynchronous Replication',
        content:
          "When the leader sends changes to followers, should it wait for confirmation or fire-and-forget?\n\n**Synchronous replication**: The leader waits for at least one follower to confirm it received and wrote the change before telling the client \"success.\" This guarantees no data loss if the leader dies — the follower has the latest data. But it is slower because every write waits for a network round-trip.\n\n**Asynchronous replication**: The leader confirms the write immediately and sends changes to followers in the background. This is faster but introduces replication lag — the followers might be seconds behind the leader. If the leader dies before sending the change, that data is lost.\n\nMost production systems use **semi-synchronous**: one follower is synchronous (for safety), the rest are asynchronous (for speed).",
        analogy:
          'Synchronous = sending a certified letter (you wait for the receipt). Asynchronous = dropping a letter in the mailbox (fast, but no guarantee it arrived). Semi-synchronous = sending one certified letter to your most important contact and regular mail to the rest.',
        keyTakeaway:
          'Synchronous replication guarantees no data loss but is slower. Asynchronous is faster but risks losing recent writes during failover.',
      },
      {
        title: 'Replication Lag and Its Consequences',
        content:
          "With asynchronous replication, followers are always slightly behind the leader. This delay is called replication lag. Usually it is milliseconds, but under heavy load it can grow to seconds or even minutes.\n\nReplication lag causes a frustrating user experience:\n\n**Read-after-write inconsistency**: A user posts a comment (write goes to leader), then immediately refreshes the page (read goes to follower). The follower does not have the comment yet — the user thinks it was lost.\n\n**Solutions:**\n1. After a write, read from the leader for a few seconds before switching back to the follower.\n2. Include a timestamp with each write and only read from followers that are caught up to that timestamp.\n3. Use synchronous replication for critical data.",
        code: [
          {
            language: 'javascript',
            label: 'Read-after-write consistency pattern',
            code: `async function createComment(userId: number, text: string) {\n  // Write to leader\n  await leaderPool.query(\n    'INSERT INTO comments (user_id, text) VALUES ($1, $2)',\n    [userId, text]\n  );\n  // Store the write timestamp for this user\n  await redis.set(\`last-write:\${userId}\`, Date.now(), 'EX', 10);\n}\n\nasync function getComments(userId: number, postId: number) {\n  const lastWrite = await redis.get(\`last-write:\${userId}\`);\n  // If user wrote recently, read from leader to guarantee consistency\n  const pool = (lastWrite && Date.now() - Number(lastWrite) < 5000)\n    ? leaderPool\n    : followerPool;\n  return pool.query(\n    'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at',\n    [postId]\n  );\n}`,
          },
        ],
        keyTakeaway:
          'Replication lag can cause users to not see their own recent writes. Use read-after-write consistency patterns to solve this.',
      },
      {
        title: 'Multi-Leader (Master-Master) Replication',
        content:
          "In multi-leader replication, two or more servers accept writes. Each leader replicates its changes to the other leaders.\n\nThis is useful for:\n- **Multi-datacenter deployments**: Each datacenter has a local leader for low-latency writes.\n- **Offline-capable apps**: The local device acts as a leader, syncing when connectivity returns (think Google Docs).\n\nThe big problem: **write conflicts**. If two leaders modify the same row at the same time, whose version wins? Conflict resolution strategies include:\n- Last-write-wins (using timestamps) — simple but can lose data.\n- Application-level resolution — let the app decide (like merge conflicts in Git).\n- CRDTs (Conflict-free Replicated Data Types) — data structures designed to merge automatically.",
        analogy:
          'Multi-leader is like two people editing the same Google Doc simultaneously. Most of the time it works, but occasionally they edit the same sentence and the system has to figure out which version to keep.',
        keyTakeaway:
          'Multi-leader allows writes at multiple locations but introduces write conflicts that require a resolution strategy.',
      },
      {
        title: 'Failover — What Happens When the Leader Dies?',
        content:
          "When the leader server crashes, a follower must be promoted to become the new leader. This process is called failover.\n\n**Automatic failover** steps:\n1. **Detection**: A monitoring system detects the leader is unresponsive (usually via missed heartbeats).\n2. **Election**: The followers agree on which one becomes the new leader (typically the one with the most up-to-date data).\n3. **Reconfiguration**: The application is pointed to the new leader. Other followers start replicating from the new leader.\n\n**Dangers of failover:**\n- If using async replication, the new leader might be missing recent writes. Those writes are lost.\n- Split-brain: both the old leader (which recovered) and the new leader accept writes. Data diverges.\n- Failover can take 10-60 seconds, during which writes are blocked.\n\nManaged databases (like AWS RDS, Google Cloud SQL) handle failover automatically.",
        keyTakeaway:
          'Failover promotes a follower to leader when the leader fails. It can cause brief downtime and potentially lose recent async writes.',
      },
      {
        title: 'Replication in Practice',
        content:
          "Here is how you might think about replication for a real application:\n\n**Small app (< 1,000 users)**: Single server is fine. Use automated backups.\n\n**Medium app (1K-100K users)**: One leader + one or two async followers. Followers handle read traffic. Managed database service handles failover.\n\n**Large app (100K+ users)**: One leader + multiple followers across availability zones. Semi-synchronous replication. Read-after-write consistency for user-facing data.\n\n**Global app**: Multi-leader across regions (or use a globally distributed database like CockroachDB or Spanner). Local reads and writes for low latency.",
        keyTakeaway:
          'Start simple (single server with backups), add leader-follower replication as you grow, and go multi-leader only for global or offline use cases.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Treating replication as a backup strategy',
        explanation:
          'Replication protects against server failure, not data corruption. If you accidentally DELETE all rows, that delete replicates to all followers instantly. You still need point-in-time recovery backups.',
      },
      {
        mistake: 'Not accounting for replication lag in application code',
        explanation:
          'If a user writes data and immediately reads it from a follower, they may not see their own write. Always implement read-after-write consistency for user-facing operations.',
      },
      {
        mistake: 'Using multi-leader replication without a conflict resolution strategy',
        explanation:
          'If two leaders modify the same row, you must have a clear strategy for which write wins. Without one, data silently diverges.',
      },
    ],
    practiceQuestions: [
      'Explain the difference between synchronous and asynchronous replication. When would you use each?',
      'What is replication lag, and how does it affect the user experience? How would you mitigate it?',
      'Describe the steps of automatic failover when a leader database server goes down.',
      'Why is replication not a substitute for backups? Give a scenario where replication alone fails.',
      'Your app has users in the US and Europe. What replication topology would you recommend?',
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
          "Imagine you own a chain of restaurants across different cities, and they all share the same menu.\n\n**Consistency**: Every restaurant always has the exact same menu. When you add a new dish in New York, it instantly appears on the menu in Los Angeles.\n\n**Availability**: Every restaurant is always open and serving food. No matter which location a customer walks into, they get served.\n\n**Partition Tolerance**: Even if the phone lines between restaurants go down (a network partition), each restaurant keeps operating.\n\nThe CAP theorem says: if the phone lines go down (partition), you must choose between consistency (stop serving until menus can sync) and availability (keep serving, even if menus might be different).\n\nYou cannot have all three simultaneously during a network failure.",
        analogy:
          'CAP is like the project management triangle (fast, cheap, good — pick two). During a network partition, you pick either consistency or availability.',
        keyTakeaway:
          'The CAP theorem states that during a network partition, a distributed system must choose between consistency and availability.',
      },
      {
        title: 'What is a Network Partition?',
        content:
          "A network partition happens when nodes in a distributed system cannot communicate with each other. The network splits into two or more groups that can communicate internally but not with each other.\n\nThis is not theoretical — it happens in production all the time:\n- A network cable gets cut.\n- A cloud availability zone has an outage.\n- A misconfigured firewall blocks traffic.\n- A switch fails.\n\nThe \"P\" in CAP is not optional. In any distributed system, network partitions WILL happen. So the real choice is between C and A during that partition.",
        analogy:
          'A network partition is like two office buildings losing their phone connection. People inside each building can still talk, but the buildings cannot talk to each other.',
        keyTakeaway:
          'Network partitions are inevitable in distributed systems. The practical choice is: do you sacrifice consistency or availability when one happens?',
      },
      {
        title: 'CP Systems — Consistency over Availability',
        content:
          "A CP system guarantees that every read returns the most recent write, even during a partition. The trade-off is that some requests may be rejected (system becomes unavailable) during a partition, because the system cannot confirm the data is consistent.\n\n**Examples:**\n- **Traditional relational databases** (PostgreSQL, MySQL with synchronous replication): During a partition, the minority side refuses reads/writes to maintain consistency.\n- **etcd / ZooKeeper**: Used for distributed coordination. They choose consistency because stale data could cause split-brain scenarios.\n- **HBase**: Strongly consistent reads and writes.\n\n**When to choose CP**: Financial systems (account balances must be exact), inventory systems (cannot oversell), distributed locks (must be authoritative).",
        keyTakeaway:
          'CP systems guarantee correct data but may become unavailable during partitions. Choose for financial and inventory systems.',
      },
      {
        title: 'AP Systems — Availability over Consistency',
        content:
          'An AP system stays available during a partition — every request gets a response. The trade-off is that different nodes may return different (stale or conflicting) data until the partition heals.\n\n**Examples:**\n- **Cassandra**: Always accepts writes, even during partitions. Consistency is eventually achieved when nodes sync up.\n- **DynamoDB**: Offers both modes but defaults to eventually consistent reads.\n- **CouchDB**: Designed for offline-first apps where availability is paramount.\n- **DNS**: The internet\'s address book is highly available but updates propagate slowly.\n\n**When to choose AP**: Social media feeds (slightly stale is fine), shopping carts (better to accept potentially stale data than to be down), IoT sensor data (availability matters more than perfect accuracy).',
        keyTakeaway:
          'AP systems stay available during partitions but may return stale data. Choose when uptime matters more than perfect accuracy.',
      },
      {
        title: 'Eventual Consistency — The AP Compromise',
        content:
          "AP systems typically offer eventual consistency: if no new updates are made, all replicas will eventually converge to the same value.\n\n\"Eventually\" usually means milliseconds to seconds. In practice, the data is consistent the vast majority of the time. It is only during and immediately after a partition that inconsistencies appear.\n\nThink of it like this: when you post a photo on social media, some of your friends might see it 2 seconds before others. That is eventual consistency. It is annoying but not catastrophic.\n\nHowever, for a bank balance, eventual consistency is terrifying — you could withdraw money twice from different ATMs before the system catches up.",
        analogy:
          'Eventual consistency is like gossip. Tell one person, and eventually everyone in the group knows. It takes time, and for a brief window, some people know different things. For social news, that is fine. For medical records, it is not.',
        keyTakeaway:
          'Eventual consistency means all replicas converge over time. Acceptable for social media and caches; dangerous for financial data.',
      },
      {
        title: 'CAP in Practice — It is a Spectrum',
        content:
          "The original CAP theorem is a bit simplistic. In practice:\n\n1. **You can tune consistency per operation.** Cassandra lets you choose consistency levels per query. A read can be eventually consistent (fast) or strongly consistent (slower, reads from multiple replicas).\n\n2. **Partitions are rare.** Most of the time, you get both C and A. You only sacrifice one during the brief period of a partition.\n\n3. **PACELC extends CAP.** The PACELC theorem says: during a Partition, choose A or C. Else (normal operation), choose Latency or Consistency. Even without partitions, there is a trade-off between response time and consistency.\n\n4. **Modern databases blur the lines.** Google Spanner claims to be CA using GPS-synchronized clocks. CockroachDB provides strong consistency with high availability. The lines are getting fuzzier as technology improves.",
        keyTakeaway:
          'CAP is a useful mental model, not a strict binary. Modern databases let you tune consistency vs availability on a per-query basis.',
      },
      {
        title: 'Choosing the Right Trade-off for Your System',
        content:
          "Here is a decision framework:\n\n**Choose CP (consistency) when:**\n- Incorrect data is worse than downtime.\n- Financial transactions, inventory counts, user authentication.\n- You need strong consistency guarantees.\n\n**Choose AP (availability) when:**\n- Downtime is worse than slightly stale data.\n- Social media feeds, product catalogs, analytics dashboards.\n- You can tolerate eventual consistency.\n\n**Real-world architectures often mix both:**\n- User account data: CP (never show wrong balance).\n- Social feed: AP (a few seconds of staleness is fine).\n- Shopping cart: AP (better to let the user shop than show an error).\n- Inventory check at checkout: CP (must be accurate to prevent overselling).",
        keyTakeaway:
          'Most systems use a mix of CP and AP strategies depending on the data type. Match the consistency model to the business requirement.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Thinking CAP means you must always sacrifice one of C, A, or P',
        explanation:
          'You only sacrifice C or A during a network partition. During normal operation, most systems provide both consistency and availability.',
      },
      {
        mistake: 'Treating CAP as the only distributed systems concern',
        explanation:
          'CAP is about behavior during partitions. You also need to think about latency, throughput, durability, and operational complexity.',
      },
      {
        mistake: 'Assuming eventual consistency means "inconsistent"',
        explanation:
          'Eventual consistency means replicas converge quickly — usually within milliseconds. Data is consistent 99.9% of the time. The window of inconsistency is brief.',
      },
    ],
    practiceQuestions: [
      'Explain the CAP theorem in your own words using a real-world analogy.',
      'You are building an e-commerce checkout system. Would you choose CP or AP for the inventory check? Why?',
      'What is the difference between strong consistency and eventual consistency?',
      'Give an example of a system that chooses availability over consistency. Why is that the right trade-off?',
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
          "Imagine you are organizing a company's records. You have two options:\n\n**Filing cabinet (SQL)**: Every document goes into a specific folder, in a specific drawer, with a specific label. Adding a document requires it to match the folder's format. Searching is fast because everything is organized. But reorganizing the cabinet (changing the schema) is a major project.\n\n**Big box storage (NoSQL)**: Throw documents into labeled boxes. Each box can contain different types of documents. Adding new types is easy — just toss them in. But finding something specific might mean digging through the box, and there are no enforced rules about what goes where.\n\nNeither is universally better. The right choice depends on your data and how you use it.",
        analogy:
          'SQL = a meticulously organized filing cabinet with enforced rules. NoSQL = flexible storage bins where each bin can hold anything.',
        keyTakeaway:
          'SQL enforces structure and relationships. NoSQL offers flexibility and scale. Choose based on your data and access patterns.',
      },
      {
        title: 'SQL Databases — Structured and Relational',
        content:
          "SQL databases (also called relational databases) store data in tables with predefined schemas. Every row follows the same structure. Tables are linked by foreign keys.\n\n**Strengths:**\n- ACID transactions — strong consistency guarantees.\n- Complex queries — JOINs across multiple tables, aggregations, subqueries.\n- Data integrity — foreign keys, constraints, and types enforce correctness.\n- Mature ecosystem — decades of tooling, optimization, and community knowledge.\n\n**Weaknesses:**\n- Schema changes are expensive on large tables (ALTER TABLE can lock the table).\n- Horizontal scaling is hard (sharding relational databases is complex).\n- Not ideal for unstructured or rapidly changing data shapes.\n\n**Popular choices:** PostgreSQL (most feature-rich), MySQL (most widely deployed), SQLite (embedded), SQL Server, Oracle.",
        code: [
          {
            language: 'sql',
            label: 'SQL database example — structured e-commerce data',
            code: `-- Rigid schema, relationships enforced\nCREATE TABLE products (\n  id          SERIAL PRIMARY KEY,\n  name        VARCHAR(200) NOT NULL,\n  price       DECIMAL(10,2) NOT NULL CHECK (price > 0),\n  category_id INT REFERENCES categories(id)\n);\n\n-- Complex query with JOINs\nSELECT c.name AS category, COUNT(*) AS product_count,\n       AVG(p.price) AS avg_price\nFROM products p\nJOIN categories c ON p.category_id = c.id\nGROUP BY c.name\nORDER BY avg_price DESC;`,
          },
        ],
        keyTakeaway:
          'SQL databases excel at structured data with relationships, complex queries, and strong consistency.',
      },
      {
        title: 'NoSQL Databases — Flexible and Scalable',
        content:
          "NoSQL (Not Only SQL) is an umbrella term for databases that do not use the traditional relational model. There are several types:\n\n**Document stores** (MongoDB, CouchDB): Store JSON-like documents. Each document can have a different shape. Great for content management, user profiles, catalogs.\n\n**Key-value stores** (Redis, DynamoDB): Store data as key-value pairs. Blazing fast for simple lookups. Great for caching, sessions, configuration.\n\n**Column-family stores** (Cassandra, HBase): Organize data by columns rather than rows. Great for time-series, analytics, write-heavy workloads.\n\n**Graph databases** (Neo4j, Neptune): Store nodes and edges. Great for social networks, recommendations, fraud detection.",
        code: [
          {
            language: 'javascript',
            label: 'MongoDB document store example — flexible e-commerce data',
            code: `// Flexible schema — each product can have different attributes\ndb.products.insertMany([\n  {\n    name: "MacBook Pro",\n    price: 2499,\n    category: "Electronics",\n    specs: {\n      cpu: "M3 Pro",\n      ram: "18GB",\n      storage: "512GB SSD"\n    },\n    reviews: [\n      { user: "alice", rating: 5, text: "Amazing laptop" }\n    ]\n  },\n  {\n    name: "Running Shoes",\n    price: 129,\n    category: "Footwear",\n    sizes: [7, 8, 9, 10, 11],  // different shape entirely!\n    color: "blue",\n    material: "mesh"\n  }\n]);\n\n// Query nested data easily\ndb.products.find({ "specs.ram": "18GB" });`,
          },
        ],
        keyTakeaway:
          'NoSQL databases trade structure and consistency for flexibility, horizontal scalability, and varied data models.',
      },
      {
        title: 'PostgreSQL vs MongoDB — Head to Head',
        content:
          "Let's compare the two most popular representatives directly:\n\n| Feature | PostgreSQL | MongoDB |\n|---|---|---|\n| Data model | Tables with rows | Collections with documents |\n| Schema | Fixed (ALTER TABLE to change) | Flexible (any shape per doc) |\n| Query language | SQL | MQL (MongoDB Query Language) |\n| JOINs | Native, powerful | $lookup (limited, slower) |\n| Transactions | Full ACID | Multi-document ACID (since 4.0) |\n| Scaling | Vertical (sharding is hard) | Horizontal (built-in sharding) |\n| Best for | Complex queries, relationships | Flexible schemas, rapid iteration |\n\nInteresting twist: PostgreSQL has excellent JSONB support, letting you store and query JSON documents inside a relational database. This blurs the line significantly — you can get document-like flexibility while keeping SQL power.",
        code: [
          {
            language: 'sql',
            label: 'PostgreSQL JSONB — the best of both worlds',
            code: `-- Store flexible JSON data in PostgreSQL\nCREATE TABLE products (\n  id     SERIAL PRIMARY KEY,\n  name   VARCHAR(200) NOT NULL,\n  price  DECIMAL(10,2) NOT NULL,\n  attrs  JSONB  -- flexible attributes!\n);\n\nINSERT INTO products (name, price, attrs) VALUES\n  ('MacBook', 2499, '{"cpu": "M3", "ram": "18GB"}'),\n  ('Shoes',   129,  '{"sizes": [7,8,9], "color": "blue"}');\n\n-- Query JSON fields\nSELECT name FROM products\nWHERE attrs->>'cpu' = 'M3';\n\n-- Index JSON fields for fast lookups\nCREATE INDEX idx_attrs ON products USING gin(attrs);`,
          },
        ],
        keyTakeaway:
          'PostgreSQL with JSONB often gives you SQL power plus document flexibility, reducing the need for a separate NoSQL database.',
      },
      {
        title: 'When to Choose SQL',
        content:
          "Choose a relational (SQL) database when:\n\n1. **Your data has clear relationships.** Users have orders, orders have items, items belong to categories. Relational databases model this naturally with foreign keys and JOINs.\n\n2. **You need ACID transactions.** Banking, e-commerce checkout, inventory management — anywhere data correctness is critical.\n\n3. **You run complex analytical queries.** SQL excels at aggregations, window functions, CTEs, and multi-table JOINs.\n\n4. **Your schema is relatively stable.** If you know your data shape upfront and it won't change drastically, a fixed schema prevents bugs.\n\n5. **You need strong consistency.** Every read should return the latest write.\n\nMost web applications should start with PostgreSQL. It handles 90% of use cases and has excellent performance, ecosystem, and flexibility.",
        keyTakeaway:
          'Choose SQL for structured, relational data with strong consistency requirements. PostgreSQL is the safe default.',
      },
      {
        title: 'When to Choose NoSQL',
        content:
          "Choose NoSQL when:\n\n1. **Your data shape varies significantly.** User-generated content, product catalogs with wildly different attributes, IoT sensor data. Document stores handle this naturally.\n\n2. **You need massive horizontal scale.** If you need to write millions of records per second across hundreds of servers, Cassandra or DynamoDB scale better than relational databases.\n\n3. **You need ultra-low latency for simple lookups.** Redis gives you sub-millisecond reads for caching, session storage, and real-time features.\n\n4. **Your data is graph-shaped.** Social networks, recommendation engines, and fraud detection are natural fits for graph databases.\n\n5. **You are iterating rapidly on a prototype.** Document stores let you change the data shape without ALTER TABLE migrations.",
        keyTakeaway:
          'Choose NoSQL for flexible schemas, massive write scale, ultra-fast caching, or graph-shaped data.',
      },
      {
        title: 'The Polyglot Persistence Pattern',
        content:
          "Most mature applications use MULTIPLE databases, each for what it does best. This is called polyglot persistence.\n\nA typical modern stack might look like:\n\n- **PostgreSQL** — Core business data (users, orders, payments). Structured, relational, ACID.\n- **Redis** — Caching, sessions, real-time leaderboards. Ultra-fast key-value.\n- **Elasticsearch** — Full-text search across products or articles. Specialized search engine.\n- **S3** — File storage (images, videos, documents). Object storage.\n- **ClickHouse** — Analytics and reporting. Column-oriented for fast aggregations.\n\nDon't pick one database and force everything into it. Use the right tool for each job.",
        code: [
          {
            language: 'javascript',
            label: 'Polyglot persistence in a Node.js app',
            code: `// Different stores for different data\nimport { Pool } from 'pg';           // Core data\nimport Redis from 'ioredis';          // Caching\nimport { Client } from '@elastic/elasticsearch'; // Search\n\nconst pg = new Pool({ connectionString: DATABASE_URL });\nconst redis = new Redis(REDIS_URL);\nconst elastic = new Client({ node: ELASTICSEARCH_URL });\n\nasync function getProduct(id: string) {\n  // Check cache first (Redis)\n  const cached = await redis.get(\`product:\${id}\`);\n  if (cached) return JSON.parse(cached);\n\n  // Cache miss: query PostgreSQL\n  const { rows } = await pg.query(\n    'SELECT * FROM products WHERE id = $1', [id]\n  );\n  const product = rows[0];\n\n  // Store in cache for next time\n  await redis.set(\`product:\${id}\`, JSON.stringify(product), 'EX', 300);\n  return product;\n}\n\nasync function searchProducts(query: string) {\n  // Full-text search via Elasticsearch\n  return elastic.search({\n    index: 'products',\n    body: { query: { match: { name: query } } }\n  });\n}`,
          },
        ],
        keyTakeaway:
          'Use polyglot persistence: SQL for core data, Redis for caching, specialized stores for search, analytics, and files.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Choosing NoSQL because "it scales better" without understanding the trade-offs',
        explanation:
          'NoSQL trades consistency, transactions, and query power for flexibility and scale. If you need JOINs and ACID, NoSQL will make your life harder, not easier.',
      },
      {
        mistake: 'Using MongoDB as if it were a relational database',
        explanation:
          'If you find yourself doing lots of $lookup (MongoDB\'s JOIN equivalent) and wishing for foreign keys, you probably need a relational database.',
      },
      {
        mistake: 'Starting with multiple databases in a brand-new project',
        explanation:
          'Start with one database (usually PostgreSQL). Add specialized stores only when a concrete need arises. Premature polyglot persistence adds operational complexity for no benefit.',
      },
      {
        mistake: 'Ignoring PostgreSQL JSONB',
        explanation:
          'PostgreSQL JSONB gives you document-store flexibility inside a relational database. Before adding MongoDB, check if JSONB columns solve your problem.',
      },
    ],
    practiceQuestions: [
      'You are building a social media platform. Would you use SQL, NoSQL, or both? Justify for each data type (user profiles, posts, friendships, notifications).',
      'Explain three scenarios where a document database is a better fit than a relational database.',
      'What is polyglot persistence? Give an example architecture.',
      'Your team chose MongoDB for an e-commerce platform but is struggling with multi-document transactions and data consistency. What went wrong?',
      'How does PostgreSQL JSONB blur the line between SQL and NoSQL?',
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
          "Database design patterns are proven solutions to common problems. Just like software design patterns (Singleton, Observer, etc.), database patterns save you from reinventing the wheel and help you avoid pitfalls that others have already discovered.\n\nIn this lesson, we will cover the patterns you are most likely to encounter in real-world applications and system design interviews:\n\n1. **Star Schema** — The foundation of data warehousing.\n2. **Snowflake Schema** — Star schema's normalized cousin.\n3. **Soft Deletes** — Deleting without actually deleting.\n4. **Event Sourcing** — Storing events instead of current state.\n5. **CQRS** — Separating reads from writes.\n6. **Polymorphic Associations** — One table referencing many types.\n\nEach pattern has clear use cases and trade-offs.",
        keyTakeaway:
          'Database design patterns are reusable solutions to common data modeling problems. Learn them to make better architectural decisions.',
      },
      {
        title: 'Star Schema — The Data Warehouse Standard',
        content:
          'The star schema is the most common pattern for analytical databases (data warehouses). It has a central fact table surrounded by dimension tables, forming a star shape.\n\nThe **fact table** holds measurable events (sales, clicks, transactions) with numbers you want to aggregate. The **dimension tables** hold descriptive attributes (product details, customer info, dates) that you want to filter and group by.\n\nThis design is optimized for fast analytical queries — aggregating millions of facts by various dimensions.',
        code: [
          {
            language: 'sql',
            label: 'Star schema for a retail data warehouse',
            code: `-- Dimension tables (descriptive attributes)\nCREATE TABLE dim_product (\n  product_key  SERIAL PRIMARY KEY,\n  name         VARCHAR(200),\n  category     VARCHAR(100),\n  brand        VARCHAR(100)\n);\n\nCREATE TABLE dim_customer (\n  customer_key SERIAL PRIMARY KEY,\n  name         VARCHAR(100),\n  city         VARCHAR(100),\n  segment      VARCHAR(50)  -- 'Consumer', 'Business', etc.\n);\n\nCREATE TABLE dim_date (\n  date_key     INT PRIMARY KEY,  -- 20240315\n  full_date    DATE,\n  year         INT,\n  quarter      INT,\n  month        INT,\n  day_of_week  VARCHAR(10)\n);\n\n-- Fact table (measurable events)\nCREATE TABLE fact_sales (\n  sale_id      SERIAL PRIMARY KEY,\n  product_key  INT REFERENCES dim_product(product_key),\n  customer_key INT REFERENCES dim_customer(customer_key),\n  date_key     INT REFERENCES dim_date(date_key),\n  quantity     INT,\n  unit_price   DECIMAL(10,2),\n  total_amount DECIMAL(10,2)\n);\n\n-- Analytical query: sales by category and quarter\nSELECT\n  dp.category,\n  dd.year, dd.quarter,\n  SUM(fs.total_amount) AS revenue,\n  COUNT(*) AS num_sales\nFROM fact_sales fs\nJOIN dim_product dp ON fs.product_key = dp.product_key\nJOIN dim_date dd ON fs.date_key = dd.date_key\nGROUP BY dp.category, dd.year, dd.quarter\nORDER BY dd.year, dd.quarter;`,
          },
        ],
        analogy:
          'A star schema is like a newspaper article. The fact table is the core story (who, when, how much). The dimension tables are the background details (who is this person, what is this product, what day was it).',
        keyTakeaway:
          'Star schema: central fact table (events/measures) surrounded by dimension tables (descriptive attributes). Optimized for analytics.',
      },
      {
        title: 'Snowflake Schema — Normalized Star',
        content:
          "A snowflake schema is like a star schema, but the dimension tables are further normalized. Instead of one flat dim_product table, you might split it into dim_product, dim_category, and dim_brand.\n\nThis reduces redundancy in dimension tables but makes queries more complex (more JOINs) and can be slower for analytics.\n\n**Star vs Snowflake:**\n- Star: dimension tables are denormalized. Simpler queries, faster reads, some data redundancy.\n- Snowflake: dimension tables are normalized. Less redundancy, more JOINs, slower queries.\n\nIn practice, star schema is preferred for most data warehouses because query speed matters more than a little dimension table redundancy.",
        code: [
          {
            language: 'sql',
            label: 'Snowflake schema — normalized dimensions',
            code: `-- Snowflake: dimension tables are further normalized\nCREATE TABLE dim_brand (\n  brand_key SERIAL PRIMARY KEY,\n  brand_name VARCHAR(100)\n);\n\nCREATE TABLE dim_category (\n  category_key SERIAL PRIMARY KEY,\n  category_name VARCHAR(100)\n);\n\nCREATE TABLE dim_product (\n  product_key  SERIAL PRIMARY KEY,\n  name         VARCHAR(200),\n  category_key INT REFERENCES dim_category(category_key),\n  brand_key    INT REFERENCES dim_brand(brand_key)\n);\n\n-- Query now requires extra JOINs\nSELECT dc.category_name, SUM(fs.total_amount)\nFROM fact_sales fs\nJOIN dim_product dp ON fs.product_key = dp.product_key\nJOIN dim_category dc ON dp.category_key = dc.category_key\nGROUP BY dc.category_name;`,
          },
        ],
        keyTakeaway:
          'Snowflake schema normalizes dimension tables. Use star schema for speed, snowflake when dimension data is large and frequently updated.',
      },
      {
        title: 'Soft Deletes — Never Actually Delete',
        content:
          "Instead of running DELETE to remove a row, you add a deleted_at timestamp column and set it when the record is \"deleted.\" The row stays in the database but is filtered out of normal queries.\n\n**Why soft deletes?**\n- **Audit trail**: You can always see what was deleted and when.\n- **Undo**: Users can restore accidentally deleted items.\n- **Referential integrity**: Other tables that reference this row won't have broken foreign keys.\n- **Legal requirements**: Some industries require you to retain records for years.\n\n**The trade-off:** Your queries must always include WHERE deleted_at IS NULL, which is easy to forget. Use a database view or application-level default scope to avoid this.",
        code: [
          {
            language: 'sql',
            label: 'Soft delete pattern',
            code: `-- Add soft delete column\nALTER TABLE posts ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;\n\n-- "Delete" a post (soft delete)\nUPDATE posts SET deleted_at = NOW() WHERE id = 42;\n\n-- Normal query: only show non-deleted posts\nSELECT * FROM posts WHERE deleted_at IS NULL;\n\n-- Create a view for convenience\nCREATE VIEW active_posts AS\n  SELECT * FROM posts WHERE deleted_at IS NULL;\n\n-- Now queries are clean\nSELECT * FROM active_posts;\n\n-- Restore a deleted post\nUPDATE posts SET deleted_at = NULL WHERE id = 42;\n\n-- Actually delete (for GDPR compliance, cleanup, etc.)\nDELETE FROM posts WHERE deleted_at < NOW() - INTERVAL '90 days';\n\n-- Partial index for performance (only index non-deleted rows)\nCREATE INDEX idx_active_posts ON posts(created_at)\n  WHERE deleted_at IS NULL;`,
          },
        ],
        keyTakeaway:
          'Soft deletes set a deleted_at timestamp instead of removing the row. Great for audit trails and undo, but remember to filter in all queries.',
      },
      {
        title: 'Event Sourcing — Store Events, Not State',
        content:
          "Traditional databases store the current state: \"Alice's balance is $750.\" Event sourcing stores the sequence of events that led to that state: \"Alice deposited $1000, then withdrew $200, then was charged $50.\"\n\nThe current state is derived by replaying all events. This gives you:\n\n**Complete audit trail**: Every change is recorded as an immutable event. You can answer \"what happened at 3pm last Tuesday?\" trivially.\n\n**Time travel**: Rebuild the state at any point in time by replaying events up to that moment.\n\n**Debugging**: When something goes wrong, you can replay events to see exactly how the system reached a bad state.\n\n**Event-driven architecture**: Other systems can subscribe to events and react (send an email when an order is placed).",
        code: [
          {
            language: 'sql',
            label: 'Event sourcing for a bank account',
            code: `-- Events table (append-only, never updated or deleted)\nCREATE TABLE account_events (\n  event_id    SERIAL PRIMARY KEY,\n  account_id  UUID NOT NULL,\n  event_type  VARCHAR(50) NOT NULL,  -- 'deposit', 'withdrawal', 'fee'\n  amount      DECIMAL(10,2) NOT NULL,\n  metadata    JSONB,\n  created_at  TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Record events (never UPDATE or DELETE)\nINSERT INTO account_events (account_id, event_type, amount)\nVALUES\n  ('acct-1', 'deposit',    1000.00),\n  ('acct-1', 'withdrawal',  200.00),\n  ('acct-1', 'fee',          50.00);\n\n-- Derive current balance by replaying events\nSELECT account_id,\n  SUM(CASE\n    WHEN event_type = 'deposit' THEN amount\n    WHEN event_type IN ('withdrawal', 'fee') THEN -amount\n    ELSE 0\n  END) AS current_balance\nFROM account_events\nWHERE account_id = 'acct-1'\nGROUP BY account_id;\n-- Result: $750\n\n-- Time travel: balance at a specific point\nSELECT SUM(CASE\n    WHEN event_type = 'deposit' THEN amount\n    ELSE -amount\n  END) AS balance_at_time\nFROM account_events\nWHERE account_id = 'acct-1'\n  AND created_at <= '2024-01-15 12:00:00';`,
          },
        ],
        analogy:
          'Traditional DB = a whiteboard with the current scoreboard. Event sourcing = a play-by-play log of every goal. You can always recalculate the scoreboard from the log, and you know exactly who scored when.',
        keyTakeaway:
          'Event sourcing stores immutable events instead of mutable state. Replay events to derive current state. Great for audit trails and time travel.',
      },
      {
        title: 'CQRS — Separating Reads and Writes',
        content:
          'CQRS (Command Query Responsibility Segregation) uses separate models for reading and writing data. The write model handles commands (create, update, delete) and the read model handles queries.\n\nWhy separate them? Because reads and writes have fundamentally different requirements:\n\n- **Writes** need validation, business rules, and consistency. They are complex but infrequent.\n- **Reads** need speed and flexibility. They are simple but happen 10-100x more than writes.\n\nWith CQRS, you can optimize each side independently. The write side can use a normalized relational schema. The read side can use denormalized views, materialized tables, or even a different database entirely.',
        code: [
          {
            language: 'sql',
            label: 'CQRS with materialized view',
            code: `-- WRITE side: normalized tables\nCREATE TABLE orders (\n  id          SERIAL PRIMARY KEY,\n  customer_id INT REFERENCES customers(id),\n  status      VARCHAR(20),\n  created_at  TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE order_items (\n  id       SERIAL PRIMARY KEY,\n  order_id INT REFERENCES orders(id),\n  product_id INT,\n  quantity INT,\n  price    DECIMAL(10,2)\n);\n\n-- READ side: denormalized materialized view for fast queries\nCREATE MATERIALIZED VIEW order_summaries AS\nSELECT\n  o.id AS order_id,\n  c.name AS customer_name,\n  c.email AS customer_email,\n  o.status,\n  o.created_at,\n  COUNT(oi.id) AS item_count,\n  SUM(oi.quantity * oi.price) AS total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, c.name, c.email, o.status, o.created_at;\n\n-- Refresh the read model periodically\nREFRESH MATERIALIZED VIEW CONCURRENTLY order_summaries;\n\n-- Reads are now a simple scan of the pre-computed view\nSELECT * FROM order_summaries\nWHERE customer_name = 'Alice'\nORDER BY created_at DESC;`,
          },
        ],
        keyTakeaway:
          'CQRS separates read and write models for independent optimization. Writes use normalized schemas; reads use denormalized views.',
      },
      {
        title: 'Polymorphic Associations — One Table, Many Types',
        content:
          'Sometimes one table needs to reference rows from several different tables. For example, a comments table where comments can be on posts, photos, or videos.\n\nThe polymorphic pattern stores both the referenced ID and the type of thing it references.',
        code: [
          {
            language: 'sql',
            label: 'Polymorphic associations pattern',
            code: `-- Approach 1: Polymorphic columns (simple but no FK constraint)\nCREATE TABLE comments (\n  id             SERIAL PRIMARY KEY,\n  body           TEXT NOT NULL,\n  commentable_type VARCHAR(50) NOT NULL,  -- 'post', 'photo', 'video'\n  commentable_id   INT NOT NULL,\n  created_at     TIMESTAMPTZ DEFAULT NOW()\n);\n\nINSERT INTO comments (body, commentable_type, commentable_id)\nVALUES ('Great post!', 'post', 42);\n\nINSERT INTO comments (body, commentable_type, commentable_id)\nVALUES ('Nice photo!', 'photo', 17);\n\n-- Query comments for a specific post\nSELECT * FROM comments\nWHERE commentable_type = 'post' AND commentable_id = 42;\n\n-- Index for fast lookups\nCREATE INDEX idx_commentable ON comments(commentable_type, commentable_id);\n\n-- Approach 2: Separate FK columns (enforces integrity but has NULLs)\nCREATE TABLE comments_v2 (\n  id       SERIAL PRIMARY KEY,\n  body     TEXT NOT NULL,\n  post_id  INT REFERENCES posts(id),\n  photo_id INT REFERENCES photos(id),\n  video_id INT REFERENCES videos(id),\n  -- Ensure exactly one FK is set\n  CONSTRAINT one_parent CHECK (\n    (post_id IS NOT NULL)::int +\n    (photo_id IS NOT NULL)::int +\n    (video_id IS NOT NULL)::int = 1\n  )\n);`,
          },
        ],
        analogy:
          'Polymorphic association is like a comment card at a hotel. The same card can be about the room, the restaurant, or the pool. You write what you are commenting on (the type) and the specific one (the ID).',
        keyTakeaway:
          'Polymorphic associations let one table reference multiple other tables. Use type+id columns or separate nullable FKs with a CHECK constraint.',
      },
      {
        title: 'Choosing the Right Pattern',
        content:
          "Here is a cheat sheet for when to use each pattern:\n\n**Star/Snowflake Schema** — Building a data warehouse or analytics dashboard. Star for speed, snowflake for normalized dimensions.\n\n**Soft Deletes** — Any user-facing application where undo, audit trails, or legal retention is needed. Most SaaS apps use this.\n\n**Event Sourcing** — Financial systems, audit-heavy domains, systems where you need to reconstruct past states. Often combined with CQRS.\n\n**CQRS** — Applications where read and write patterns are very different (e.g., complex write validations but simple read queries). Often overkill for simple CRUD apps.\n\n**Polymorphic Associations** — Content systems where multiple entity types share a common feature (comments, tags, likes, attachments).\n\nRemember: patterns are tools, not rules. Use them when they solve a real problem you have, not just because they sound sophisticated.",
        keyTakeaway:
          'Match the pattern to the problem. Star schema for analytics, soft deletes for audit trails, event sourcing for financial systems, CQRS for complex read/write separation.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using event sourcing for simple CRUD applications',
        explanation:
          'Event sourcing adds significant complexity (event replay, eventual consistency, event versioning). For a simple blog or todo app, it is massive overkill.',
      },
      {
        mistake: 'Forgetting to filter soft-deleted records in queries',
        explanation:
          'Every query that reads "active" data must include WHERE deleted_at IS NULL. Use views or ORM default scopes to avoid accidentally showing deleted data.',
      },
      {
        mistake: 'Using polymorphic associations without an index on (type, id)',
        explanation:
          'Without a composite index on (commentable_type, commentable_id), every query to find comments for a specific entity does a full table scan.',
      },
      {
        mistake: 'Implementing CQRS with a single database and no read model',
        explanation:
          'The point of CQRS is to have an optimized read model. If you still run complex JOINs for reads, you have the complexity of CQRS without the benefits.',
      },
    ],
    practiceQuestions: [
      'Design a star schema for an e-learning platform that tracks course completions, quiz scores, and time spent.',
      'You are building a document management system where users need to restore deleted files. Which pattern would you use and how would you implement it?',
      'Explain event sourcing to a non-technical stakeholder. Why would a bank use it?',
      'When is CQRS overkill? When is it essential?',
      'Your application has a "likes" feature where users can like posts, comments, and photos. Design the database schema using polymorphic associations.',
    ],
  },
};
