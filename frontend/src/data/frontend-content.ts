import type { LessonStep, QuizQuestion } from '@/lib/learn-data';

export const frontendLessons: Record<
  string,
  {
    steps: LessonStep[];
    commonMistakes?: { mistake: string; explanation: string }[];
    practiceQuestions?: string[];
    quiz?: QuizQuestion[];
  }
> = {
  // ───────────────────────────────────────────────
  // 1. HTML Fundamentals
  // ───────────────────────────────────────────────
  'html-fundamentals': {
    steps: [
      {
        title: 'What is HTML?',
        content:
          'HTML (HyperText Markup Language) is the skeleton of every web page. Browsers read HTML to build a tree of elements called the DOM, then paint pixels on screen.',
        analogy:
          'Think of a web page as a human body. HTML is the skeleton that provides structure, CSS is the clothing and appearance, and JavaScript is the muscles that create movement.',
        diagram:
          '              document\n              │\n              html\n             ╱    ╲\n          head    body\n          │       ╱  ╲\n        title   header  main\n                │       ╱  ╲\n               nav  article  aside\n               │       │\n              a, a    h1, p',
        flow: [
          { label: 'Write HTML', description: 'Create .html file with tags', icon: '📝' },
          { label: 'Browser Parses', description: 'Reads HTML top to bottom', icon: '🔍' },
          { label: 'Builds DOM Tree', description: 'Converts tags to nodes', icon: '🌳' },
          { label: 'Renders Pixels', description: 'Paints the page on screen', icon: '🖥️' },
        ],
        keyTakeaway:
          'HTML defines the structure and content of a web page — the browser converts it into a DOM tree and renders it visually.',
      },
      {
        title: 'Semantic HTML',
        content:
          'Semantic elements describe their meaning to both the browser and the developer. Using the right element improves accessibility, SEO, and code readability.',
        comparison: {
          leftTitle: 'Div Soup',
          rightTitle: 'Semantic HTML',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: '<div class="header">', right: '<header>' },
            { left: '<div class="nav">', right: '<nav>' },
            { left: '<div class="main">', right: '<main>' },
            { left: '<div class="article">', right: '<article>' },
            { left: '<div class="footer">', right: '<footer>' },
          ],
        },
        cards: [
          { title: '<header>', description: 'Introductory content or navigation links', icon: '🏠', color: 'blue' },
          { title: '<nav>', description: 'Major navigation block', icon: '🧭', color: 'purple' },
          { title: '<main>', description: 'Dominant content of the page', icon: '📄', color: 'emerald' },
          { title: '<article>', description: 'Self-contained content', icon: '📰', color: 'amber' },
          { title: '<section>', description: 'Thematic grouping of content', icon: '📦', color: 'cyan' },
          { title: '<aside>', description: 'Tangentially related content', icon: '📌', color: 'red' },
        ],
        code: [
          {
            language: 'html',
            label: 'Semantic page structure',
            code: `<header>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>My First Post</h1>\n    <p>Hello, world!</p>\n  </article>\n</main>\n<footer>\n  <p>&copy; 2026 My Site</p>\n</footer>`,
          },
        ],
        keyTakeaway:
          'Semantic tags like <header>, <nav>, <main>, and <article> replace meaningless <div> elements and improve accessibility and SEO.',
      },
      {
        title: 'Inline vs Block Elements',
        content:
          'HTML elements are either block-level (take full width) or inline (only take the space they need). This distinction controls how elements flow on the page.',
        comparison: {
          leftTitle: 'Block Elements',
          rightTitle: 'Inline Elements',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Takes full width of parent', right: 'Only takes needed width' },
            { left: 'Starts on a new line', right: 'Sits next to other inline elements' },
            { left: 'div, p, h1-h6, section, ul', right: 'span, a, strong, em, img, input' },
            { left: 'Can contain block + inline', right: 'Can only contain inline + text' },
            { left: 'Width/height can be set', right: 'Width/height ignored (except img)' },
          ],
        },
        diagram:
          'Block elements:\n┌──────────────────────────────────┐\n│ <div>  Takes full width          │\n└──────────────────────────────────┘\n┌──────────────────────────────────┐\n│ <p>    New line each time        │\n└──────────────────────────────────┘\n\nInline elements:\n┌──────┐┌────┐┌──────────┐\n│<span>││<a> ││<strong>  │  ← side by side\n└──────┘└────┘└──────────┘',
        keyTakeaway:
          'Block elements stack vertically and take full width. Inline elements flow horizontally and only take the space they need.',
      },
      {
        title: 'Forms and Inputs',
        content:
          'Forms are how users send data back to a server. Every form needs an action (where to send) and a method (how to send).',
        analogy:
          'A form is like a paper form at a doctor\'s office. Each input field is a blank to fill in, and hitting submit is handing the clipboard back to the receptionist.',
        code: [
          {
            language: 'html',
            label: 'A simple signup form',
            code: `<form action="/signup" method="POST">\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required />\n\n  <label for="password">Password</label>\n  <input type="password" id="password" name="password"\n         minlength="8" required />\n\n  <button type="submit">Sign Up</button>\n</form>`,
          },
        ],
        table: {
          headers: ['Input Type', 'Purpose', 'Example'],
          rows: [
            ['text', 'Single-line text', 'Name, city'],
            ['email', 'Email with validation', 'user@example.com'],
            ['password', 'Hidden text', 'Login password'],
            ['number', 'Numeric value', 'Age, quantity'],
            ['checkbox', 'Boolean toggle', 'Accept terms'],
            ['select', 'Dropdown list', 'Country picker'],
          ],
        },
        keyTakeaway:
          'Forms collect user input with typed fields, labels for accessibility, and built-in validation attributes like required and minlength.',
      },
      {
        title: 'Accessibility Essentials',
        content:
          'One in five people has a disability. Accessible HTML ensures everyone can use your site, including people using screen readers or keyboard-only navigation.',
        bullets: [
          '**Alt text** on images describes what the image shows for screen readers.',
          '**Labels** on form inputs let assistive tech announce what each field is for.',
          '**Heading hierarchy** (h1 > h2 > h3) creates a navigable document outline.',
          '**ARIA roles** supplement native semantics when HTML alone isn\'t enough.',
        ],
        cards: [
          { title: 'Visual', description: 'Alt text, color contrast, text sizing', icon: '👁️', color: 'blue' },
          { title: 'Motor', description: 'Keyboard navigation, large click targets', icon: '🖐️', color: 'purple' },
          { title: 'Auditory', description: 'Captions, transcripts for media', icon: '👂', color: 'emerald' },
          { title: 'Cognitive', description: 'Clear language, consistent layout', icon: '🧠', color: 'amber' },
        ],
        code: [
          {
            language: 'html',
            label: 'Accessible image and button',
            code: `<!-- Descriptive alt text -->\n<img src="chart.png"\n     alt="Bar chart showing sales growth from $10K to $50K in 2025" />\n\n<!-- Accessible button with icon -->\n<button aria-label="Close modal">\n  <span aria-hidden="true">&times;</span>\n</button>`,
          },
        ],
        keyTakeaway:
          'Use alt text, proper labels, heading hierarchy, and ARIA attributes to make your pages usable by everyone.',
      },
      {
        title: 'Building a Complete Page',
        content:
          'Every HTML document follows the same boilerplate structure. The DOCTYPE tells the browser to use modern standards, the head holds metadata, and the body holds visible content.',
        diagram:
          '<!DOCTYPE html>\n┌─ <html lang="en"> ────────────────┐\n│                                    │\n│  ┌─ <head> ────────────────────┐   │\n│  │  meta charset               │   │\n│  │  meta viewport              │   │\n│  │  <title>                    │   │\n│  │  <link> stylesheets         │   │\n│  └─────────────────────────────┘   │\n│                                    │\n│  ┌─ <body> ────────────────────┐   │\n│  │  <header> + <nav>           │   │\n│  │  <main>                     │   │\n│  │    <article> / <section>    │   │\n│  │  <footer>                   │   │\n│  │  <script> at bottom         │   │\n│  └─────────────────────────────┘   │\n│                                    │\n└────────────────────────────────────┘',
        code: [
          {
            language: 'html',
            label: 'Complete HTML boilerplate',
            code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport"\n        content="width=device-width, initial-scale=1.0" />\n  <title>My Portfolio</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <header>\n    <h1>Jane Doe — Developer</h1>\n    <nav>\n      <a href="#projects">Projects</a>\n      <a href="#contact">Contact</a>\n    </nav>\n  </header>\n  <main>\n    <section id="projects">\n      <h2>Projects</h2>\n      <article><!-- project card --></article>\n    </section>\n  </main>\n  <footer>Built with HTML &amp; CSS</footer>\n</body>\n</html>`,
          },
        ],
        keyTakeaway:
          'Always start with DOCTYPE, use the lang attribute, include the viewport meta tag for mobile, and structure content with semantic elements.',
      },
    ],
    commonMistakes: [
      { mistake: 'Using only <div> and <span> for everything', explanation: 'Semantic elements like <nav>, <main>, and <article> improve accessibility and SEO. Screen readers rely on them to navigate.' },
      { mistake: 'Skipping the viewport meta tag', explanation: 'Without it, mobile browsers render pages at desktop width and zoom out, making text tiny and unusable.' },
      { mistake: 'Forgetting alt text on images', explanation: 'Screen readers announce images as "image" with no context. Alt text describes the image for users who cannot see it.' },
      { mistake: 'Nesting block elements inside inline elements', explanation: 'Placing a <div> inside a <span> or <a> (in older HTML) produces unexpected layout behavior. Always check nesting rules.' },
    ],
    practiceQuestions: [
      'What is the difference between <section> and <div>? When would you use each?',
      'Write an HTML form with email, password, and a submit button that validates input before sending.',
      'Explain why the viewport meta tag is important for mobile devices.',
      'How does a screen reader interpret a page that uses only <div> elements vs one with semantic HTML?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which HTML tag is used for the largest heading?',
        options: ['<heading>', '<h6>', '<h1>', '<head>'],
        answer: '<h1>',
        explanation: 'HTML headings range from <h1> (largest) to <h6> (smallest). <h1> is used for the main heading of a page.',
      },
      {
        type: 'mcq',
        question: 'Which of these is a semantic HTML element?',
        options: ['<div>', '<span>', '<article>', '<b>'],
        answer: '<article>',
        explanation: '<article> is a semantic element that describes self-contained content. <div> and <span> are generic containers with no semantic meaning.',
      },
      {
        type: 'short-answer',
        question: 'What attribute should you always add to an <img> tag for accessibility?',
        answer: 'alt',
        explanation: 'The alt attribute provides alternative text that screen readers announce and that displays when the image cannot load.',
      },
      {
        type: 'mcq',
        question: 'Which element is a block-level element?',
        options: ['<span>', '<a>', '<strong>', '<div>'],
        answer: '<div>',
        explanation: 'Block-level elements like <div>, <p>, and <h1> take the full width of their parent and start on a new line. <span>, <a>, and <strong> are inline.',
      },
      {
        type: 'short-answer',
        question: 'What HTML attribute on a form input prevents the form from being submitted when the field is empty?',
        answer: 'required',
        explanation: 'The required attribute tells the browser to validate that the field has a value before allowing form submission.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 2. CSS Basics
  // ───────────────────────────────────────────────
  'css-basics': {
    steps: [
      {
        title: 'How CSS Works',
        content:
          'CSS (Cascading Style Sheets) controls the visual appearance of HTML. The browser combines the DOM tree with CSS rules to produce a render tree.',
        analogy:
          'If HTML is the skeleton of a house (walls, doors, windows), CSS is the interior design — paint colors, furniture placement, and decorations.',
        flow: [
          { label: 'Parse HTML', description: 'Build DOM tree', icon: '🌳' },
          { label: 'Parse CSS', description: 'Build CSSOM', icon: '🎨' },
          { label: 'Combine', description: 'DOM + CSSOM = Render Tree', icon: '🔗' },
          { label: 'Layout', description: 'Calculate sizes and positions', icon: '📐' },
          { label: 'Paint', description: 'Draw pixels on screen', icon: '🖌️' },
        ],
        diagram:
          '  HTML File          CSS File\n     │                  │\n     ▼                  ▼\n  DOM Tree          CSSOM Tree\n     │                  │\n     └────── + ─────────┘\n             │\n             ▼\n        Render Tree\n             │\n             ▼\n      Layout (Reflow)\n             │\n             ▼\n       Paint (Pixels)',
        keyTakeaway:
          'CSS rules are matched to DOM nodes to build a render tree, which the browser uses to calculate layout and paint pixels.',
      },
      {
        title: 'Selectors and Specificity',
        content:
          'Selectors target which elements to style. When multiple rules target the same element, specificity determines which wins.',
        analogy:
          'CSS specificity is like a court system. An inline style is the Supreme Court (highest authority), an ID is the Appeals Court, a class is a District Court, and an element selector is a Local Court.',
        table: {
          headers: ['Selector', 'Example', 'Specificity'],
          rows: [
            ['Element', 'p, h1, div', '0-0-1'],
            ['Class', '.card, .active', '0-1-0'],
            ['ID', '#header', '1-0-0'],
            ['Inline', 'style="..."', '1-0-0-0'],
            ['!important', 'color: red !important', 'Overrides all'],
          ],
        },
        diagram:
          'Specificity Hierarchy (low → high):\n\n  *           Element      Class        ID          Inline\n  (0-0-0)    (0-0-1)     (0-1-0)     (1-0-0)     (1-0-0-0)\n  ─────────────────────────────────────────────────────────►\n   weakest                                         strongest',
        code: [
          {
            language: 'css',
            label: 'Specificity in action',
            code: `/* Specificity: 0-0-1 */\np { color: black; }\n\n/* Specificity: 0-1-0 — wins over element */\n.highlight { color: blue; }\n\n/* Specificity: 1-0-0 — wins over class */\n#title { color: red; }\n\n/* A paragraph with class="highlight" id="title"\n   will be RED because ID beats class beats element */`,
          },
        ],
        keyTakeaway:
          'Specificity goes: inline > ID > class > element. Avoid !important — it makes debugging nightmarish.',
      },
      {
        title: 'The Box Model',
        content:
          'Every element is a rectangular box with four layers: content, padding, border, and margin. Understanding the box model is essential for controlling layout.',
        diagram:
          '┌───────────── Margin ──────────────┐\n│  ┌────────── Border ──────────┐   │\n│  │  ┌─────── Padding ──────┐  │   │\n│  │  │                      │  │   │\n│  │  │      Content         │  │   │\n│  │  │    (width x height)  │  │   │\n│  │  │                      │  │   │\n│  │  └──────────────────────┘  │   │\n│  └────────────────────────────┘   │\n└───────────────────────────────────┘',
        cards: [
          { title: 'Content', description: 'The actual text, image, or child elements', icon: '📝', color: 'emerald' },
          { title: 'Padding', description: 'Space between content and border', icon: '⬜', color: 'blue' },
          { title: 'Border', description: 'Visible edge around the element', icon: '🔲', color: 'purple' },
          { title: 'Margin', description: 'Space between this element and others', icon: '↔️', color: 'amber' },
        ],
        code: [
          {
            language: 'css',
            label: 'Box model with box-sizing',
            code: `/* Without box-sizing: width = content only\n   Total = 300 + 20*2 + 2*2 = 344px */\n.card {\n  width: 300px;\n  padding: 20px;\n  border: 2px solid gray;\n}\n\n/* With box-sizing: width INCLUDES padding + border\n   Total = 300px exactly */\n.card {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 2px solid gray;\n}`,
          },
        ],
        keyTakeaway:
          'Always use box-sizing: border-box so that width and height include padding and border — it makes sizing predictable.',
      },
      {
        title: 'Flexbox — One-Dimensional Layout',
        content:
          'Flexbox arranges items in a single row or column. It handles alignment, spacing, and wrapping without manual calculations.',
        analogy:
          'Flexbox is like arranging books on a shelf. You decide the direction (horizontal or vertical), how to space them out, and whether they wrap to a new row when the shelf is full.',
        code: [
          {
            language: 'css',
            label: 'Common flexbox patterns',
            code: `/* Horizontal navigation */\n.nav {\n  display: flex;\n  justify-content: space-between; /* spread items */\n  align-items: center;            /* vertically center */\n  gap: 1rem;                      /* space between items */\n}\n\n/* Card grid that wraps */\n.grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.grid .card {\n  flex: 1 1 300px; /* grow, shrink, min-width */\n}`,
          },
        ],
        cards: [
          { title: 'justify-content', description: 'Controls spacing along the main axis', icon: '↔️', color: 'blue' },
          { title: 'align-items', description: 'Aligns items on the cross axis', icon: '↕️', color: 'purple' },
          { title: 'flex-wrap', description: 'Allows items to wrap to new lines', icon: '↩️', color: 'emerald' },
          { title: 'gap', description: 'Adds space between flex items', icon: '⬜', color: 'amber' },
          { title: 'flex-direction', description: 'Sets main axis: row or column', icon: '🔄', color: 'cyan' },
          { title: 'flex-grow', description: 'How much an item expands to fill space', icon: '📏', color: 'red' },
        ],
        keyTakeaway:
          'Flexbox handles one-dimensional layouts. Use justify-content for main axis and align-items for cross axis alignment.',
      },
      {
        title: 'CSS Grid — Two-Dimensional Layout',
        content:
          'Grid handles rows AND columns simultaneously. It excels at complex page layouts where flexbox would require nested containers.',
        comparison: {
          leftTitle: 'Flexbox',
          rightTitle: 'CSS Grid',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'One-dimensional (row or column)', right: 'Two-dimensional (rows and columns)' },
            { left: 'Content drives layout size', right: 'Layout drives content placement' },
            { left: 'Best for components (nav, cards)', right: 'Best for page layouts' },
            { left: 'Items flow naturally', right: 'Items are placed in explicit cells' },
          ],
        },
        diagram:
          'CSS Grid Layout:\n┌─────────────────────────────────────┐\n│           header (grid-area)        │\n├──────────┬──────────────────────────┤\n│          │                          │\n│ sidebar  │        main              │\n│          │                          │\n│          │                          │\n├──────────┴──────────────────────────┤\n│           footer (grid-area)        │\n└─────────────────────────────────────┘',
        code: [
          {
            language: 'css',
            label: 'Dashboard layout with grid',
            code: `.dashboard {\n  display: grid;\n  grid-template-columns: 250px 1fr;       /* sidebar + main */\n  grid-template-rows: 60px 1fr 40px;      /* header + body + footer */\n  grid-template-areas:\n    "header  header"\n    "sidebar main"\n    "footer  footer";\n  min-height: 100vh;\n}\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.footer  { grid-area: footer; }`,
          },
        ],
        keyTakeaway:
          'Use CSS Grid for two-dimensional page layouts and Flexbox for one-dimensional component layouts — they complement each other.',
      },
    ],
    commonMistakes: [
      { mistake: 'Not using box-sizing: border-box globally', explanation: 'The default content-box makes width calculations confusing because padding and border are added on top. Set *, *::before, *::after { box-sizing: border-box; }.' },
      { mistake: 'Using !important as a first resort', explanation: '!important breaks the natural cascade and makes future overrides nearly impossible. Fix specificity issues instead.' },
      { mistake: 'Setting fixed heights on containers', explanation: 'Content length varies. Use min-height instead of height to avoid overflow issues.' },
      { mistake: 'Using px for font sizes', explanation: 'Pixels override user zoom settings. Use rem for scalable, accessible typography.' },
    ],
    practiceQuestions: [
      'Explain the difference between margin and padding. When would you use each?',
      'Create a navigation bar with a logo on the left and links on the right using Flexbox.',
      'Build a responsive 3-column layout that collapses to 1 column on mobile using CSS Grid.',
      'What is specificity? How would you resolve two conflicting CSS rules targeting the same element?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What does box-sizing: border-box do?',
        options: [
          'Makes the element invisible',
          'Includes padding and border in the element\'s total width and height',
          'Removes the border from the element',
          'Adds a default margin to the element',
        ],
        answer: 'Includes padding and border in the element\'s total width and height',
        explanation: 'With border-box, the width and height properties include content, padding, and border. Without it (content-box), padding and border are added on top of the specified width.',
      },
      {
        type: 'short-answer',
        question: 'What CSS property is used to change the text color of an element?',
        answer: 'color',
        explanation: 'The CSS color property sets the foreground color of text content and text decorations.',
      },
      {
        type: 'mcq',
        question: 'Which selector has the highest specificity?',
        options: ['p', '.card', '#header', '*'],
        answer: '#header',
        explanation: 'ID selectors (#header) have a specificity of 1-0-0, which is higher than class selectors (0-1-0), element selectors (0-0-1), and the universal selector (0-0-0).',
      },
      {
        type: 'mcq',
        question: 'Which CSS property distributes space between flex items along the main axis?',
        options: ['align-items', 'flex-wrap', 'justify-content', 'flex-direction'],
        answer: 'justify-content',
        explanation: 'justify-content controls spacing along the main axis (horizontal by default). align-items controls alignment on the cross axis.',
      },
      {
        type: 'short-answer',
        question: 'What CSS display value creates a two-dimensional layout with rows and columns?',
        answer: 'grid',
        explanation: 'display: grid enables CSS Grid, which handles rows and columns simultaneously. Flexbox (display: flex) is one-dimensional.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 3. JavaScript Essentials
  // ───────────────────────────────────────────────
  'javascript-essentials': {
    steps: [
      {
        title: 'Variables and Types',
        content:
          'JavaScript has three ways to declare variables: let for things that change, const for things that don\'t, and var (legacy — avoid it).',
        analogy:
          'Variables are labeled boxes. const is a sealed box — you can look inside but never swap the contents. let is a box with a lid you can open and replace things.',
        comparison: {
          leftTitle: 'const',
          rightTitle: 'let',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Cannot be reassigned', right: 'Can be reassigned' },
            { left: 'Block scoped', right: 'Block scoped' },
            { left: 'Use by default', right: 'Use when value changes' },
            { left: 'Object properties can still change', right: 'Entire value can change' },
          ],
        },
        code: [
          {
            language: 'javascript',
            label: 'Variable declarations and types',
            code: `const name = "Alice";     // string — never reassigned\nlet score = 0;            // number — will change\nlet isActive = true;      // boolean\nlet items = [1, 2, 3];    // array (object)\nlet user = { age: 25 };   // object\n\n// typeof tells you the type\nconsole.log(typeof name);     // "string"\nconsole.log(typeof score);    // "number"\nconsole.log(typeof items);    // "object" (arrays are objects!)`,
          },
        ],
        table: {
          headers: ['Type', 'Examples', 'Falsy?'],
          rows: [
            ['string', '"hello", \'world\', ``', 'Empty string "" is falsy'],
            ['number', '42, 3.14, NaN, Infinity', '0 and NaN are falsy'],
            ['boolean', 'true, false', 'false is falsy'],
            ['null', 'null', 'Always falsy'],
            ['undefined', 'undefined', 'Always falsy'],
            ['object', '{}, [], new Date()', 'Never falsy (even empty)'],
          ],
        },
        keyTakeaway:
          'Use const by default and let only when you need to reassign. Avoid var — it has confusing scoping rules.',
      },
      {
        title: 'Functions and Scope',
        content:
          'Functions are reusable blocks of code. Arrow functions are the modern syntax. Scope determines where variables are visible.',
        code: [
          {
            language: 'javascript',
            label: 'Function syntax and scope',
            code: `// Function declaration — hoisted\nfunction greet(name) {\n  return "Hello, " + name;\n}\n\n// Arrow function — concise, no own 'this'\nconst add = (a, b) => a + b;\n\n// Scope example\nconst x = "global";\nfunction demo() {\n  const y = "local";\n  console.log(x); // "global" — visible\n  console.log(y); // "local"  — visible\n}\nconsole.log(y); // ReferenceError — y is not defined here`,
          },
        ],
        diagram:
          'Global Scope\n├── x = "global"\n├── greet()\n└── demo()\n    └── Local Scope\n        └── y = "local"\n            └── Inner Function\n                └── z = "inner"\n\n  Inner can see: z, y, x  ✓\n  Local can see: y, x     ✓\n  Global can see: x only  ✓',
        comparison: {
          leftTitle: 'Function Declaration',
          rightTitle: 'Arrow Function',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Hoisted — can call before definition', right: 'Not hoisted — must define first' },
            { left: 'Has its own "this" binding', right: 'Inherits "this" from parent scope' },
            { left: 'function name() { }', right: 'const name = () => { }' },
            { left: 'Good for methods and constructors', right: 'Good for callbacks and short functions' },
          ],
        },
        keyTakeaway:
          'Functions create their own scope. Inner scopes can see outer variables, but outer scopes cannot see inner variables.',
      },
      {
        title: 'Working with the DOM',
        content:
          'The DOM (Document Object Model) is the browser\'s in-memory representation of your HTML. JavaScript can read and modify it to create dynamic pages.',
        analogy:
          'The DOM is like a puppet show. HTML builds the puppets, CSS dresses them, and JavaScript pulls the strings to make them move.',
        diagram:
          'DOM Tree for a simple page:\n\n     document\n        │\n       html\n      ╱    ╲\n   head     body\n    │      ╱  │  ╲\n  title  h1  div  p\n              │\n             ul\n           ╱  │  ╲\n         li  li   li\n\nJavaScript can:\n  • Read any node\n  • Modify text/attributes\n  • Add/remove nodes\n  • Listen for events',
        code: [
          {
            language: 'javascript',
            label: 'Common DOM operations',
            code: `// Select elements\nconst title = document.querySelector("h1");\nconst buttons = document.querySelectorAll(".btn");\n\n// Read and modify\ntitle.textContent = "Updated!";\ntitle.style.color = "blue";\ntitle.classList.add("active");\n\n// Create and append\nconst card = document.createElement("div");\ncard.className = "card";\ncard.innerHTML = "<h2>New Card</h2>";\ndocument.querySelector(".grid").appendChild(card);`,
          },
        ],
        keyTakeaway:
          'querySelector and querySelectorAll find elements, then you can change their text, styles, classes, and even add new elements dynamically.',
      },
      {
        title: 'Event Handling',
        content:
          'Events are things that happen in the browser — clicks, key presses, form submissions, scrolls. You attach listener functions that run when an event fires.',
        flow: [
          { label: 'User Action', description: 'Click, type, scroll', icon: '👆' },
          { label: 'Event Created', description: 'Browser creates event object', icon: '📦' },
          { label: 'Capture Phase', description: 'Event travels down DOM tree', icon: '⬇️' },
          { label: 'Target Phase', description: 'Reaches the clicked element', icon: '🎯' },
          { label: 'Bubble Phase', description: 'Event travels back up', icon: '⬆️' },
        ],
        code: [
          {
            language: 'javascript',
            label: 'Event listeners',
            code: `const button = document.querySelector("#submit");\n\n// Listen for clicks\nbutton.addEventListener("click", (event) => {\n  event.preventDefault(); // stop form submission\n  console.log("Button clicked!");\n});\n\n// Listen for keyboard input\nconst input = document.querySelector("#search");\ninput.addEventListener("input", (e) => {\n  console.log("Typed:", e.target.value);\n});\n\n// Event delegation — handle clicks on dynamic children\ndocument.querySelector(".list").addEventListener("click", (e) => {\n  if (e.target.matches(".delete-btn")) {\n    e.target.closest("li").remove();\n  }\n});`,
          },
        ],
        bullets: [
          '**addEventListener** attaches a handler to an element for a specific event type.',
          '**event.preventDefault()** stops the browser\'s default action (like form submission or link navigation).',
          '**Event delegation** attaches one listener to a parent instead of many listeners to children — more efficient for dynamic lists.',
        ],
        keyTakeaway:
          'Use addEventListener to react to user interactions. Event delegation on a parent element is the best pattern for dynamic content.',
      },
      {
        title: 'ES6+ Modern Features',
        content:
          'Modern JavaScript added powerful syntax that makes code shorter and more readable. These features are used everywhere in React and modern frameworks.',
        cards: [
          { title: 'Destructuring', description: 'Unpack values from objects and arrays', icon: '📦', color: 'blue' },
          { title: 'Template Literals', description: 'Embed expressions in strings with backticks', icon: '📝', color: 'purple' },
          { title: 'Spread / Rest', description: 'Copy, merge, and collect values', icon: '🔄', color: 'emerald' },
          { title: 'Optional Chaining', description: 'Safe property access with ?.', icon: '🔗', color: 'amber' },
          { title: 'Array Methods', description: 'map, filter, reduce, find', icon: '📊', color: 'cyan' },
          { title: 'Nullish Coalescing', description: 'Default values with ?? operator', icon: '❓', color: 'red' },
        ],
        code: [
          {
            language: 'javascript',
            label: 'Essential ES6+ features',
            code: `// Destructuring — unpack values\nconst { name, age } = user;\nconst [first, ...rest] = items;\n\n// Template literals — embed expressions\nconst msg = \`Hello, \\\${name}! You are \\\${age}.\`;\n\n// Spread operator — copy and merge\nconst updated = { ...user, age: 26 };\nconst all = [...items, 4, 5];\n\n// Optional chaining — safe property access\nconst city = user?.address?.city ?? "Unknown";\n\n// Array methods — functional style\nconst adults = users\n  .filter(u => u.age >= 18)\n  .map(u => u.name)\n  .sort();`,
          },
        ],
        keyTakeaway:
          'Master destructuring, template literals, spread, optional chaining, and array methods — they are the foundation of modern JavaScript.',
      },
    ],
    commonMistakes: [
      { mistake: 'Using == instead of ===', explanation: '== performs type coercion (e.g., "1" == 1 is true). Always use === for strict equality to avoid subtle bugs.' },
      { mistake: 'Mutating state directly', explanation: 'Modifying objects or arrays in place causes bugs in React and makes debugging hard. Use spread or array methods to create new copies.' },
      { mistake: 'Forgetting that const does not mean immutable', explanation: 'const prevents reassignment, but object properties and array elements can still be changed. Use Object.freeze() for true immutability.' },
      { mistake: 'Not handling null/undefined before accessing properties', explanation: 'Accessing a property on null or undefined throws a TypeError. Use optional chaining (?.) or null checks.' },
    ],
    practiceQuestions: [
      'What is the difference between let, const, and var? Give a scenario where each is appropriate.',
      'Write a function that takes an array of numbers and returns only the even ones using filter().',
      'Explain event delegation and why it is more efficient than adding listeners to every child element.',
      'Use destructuring and spread to merge two objects, with the second object overriding shared keys.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which keyword should you use by default to declare a variable in modern JavaScript?',
        options: ['var', 'let', 'const', 'function'],
        answer: 'const',
        explanation: 'const is preferred by default because it prevents reassignment, making code more predictable. Use let only when the value needs to change.',
      },
      {
        type: 'short-answer',
        question: 'What method would you use to select the first element matching a CSS selector in the DOM?',
        answer: 'querySelector',
        explanation: 'document.querySelector() returns the first element that matches the given CSS selector. querySelectorAll() returns all matches.',
      },
      {
        type: 'mcq',
        question: 'What does event.preventDefault() do?',
        options: [
          'Removes the event listener',
          'Stops the event from bubbling up',
          'Prevents the browser\'s default action for the event',
          'Deletes the target element',
        ],
        answer: 'Prevents the browser\'s default action for the event',
        explanation: 'preventDefault() stops the browser\'s built-in behavior, like navigating on a link click or submitting a form. stopPropagation() is what stops bubbling.',
      },
      {
        type: 'mcq',
        question: 'What does typeof [] return in JavaScript?',
        options: ['"array"', '"object"', '"list"', '"undefined"'],
        answer: '"object"',
        explanation: 'In JavaScript, arrays are a special kind of object. typeof [] returns "object". Use Array.isArray() to check if a value is an array.',
      },
      {
        type: 'short-answer',
        question: 'What ES6 syntax allows you to embed expressions inside a string using backticks?',
        answer: 'template literals',
        explanation: 'Template literals use backticks (`) and ${expression} syntax to embed JavaScript expressions directly in strings.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 4. Responsive Design
  // ───────────────────────────────────────────────
  'responsive-design': {
    steps: [
      {
        title: 'Why Responsive Design Matters',
        content:
          'Over 60% of web traffic comes from mobile devices. A site that only works on desktop loses most of its audience.',
        analogy:
          'Responsive design is like water. Pour it in a glass, it becomes the glass. Pour it in a bottle, it becomes the bottle. Your layout should flow to fit any container.',
        cards: [
          { title: 'Mobile', description: '< 640px — phones', icon: '📱', color: 'blue' },
          { title: 'Tablet', description: '640px–1024px — tablets', icon: '📋', color: 'purple' },
          { title: 'Desktop', description: '> 1024px — laptops/monitors', icon: '🖥️', color: 'emerald' },
        ],
        diagram:
          'Same content, different layouts:\n\n  Mobile         Tablet           Desktop\n ┌──────┐    ┌───────────┐    ┌──────────────────┐\n │ Nav  │    │  Nav      │    │ Logo   Nav Links  │\n ├──────┤    ├─────┬─────┤    ├──────┬───────────┤\n │      │    │     │     │    │      │           │\n │ Card │    │Card │Card │    │ Side │  Content  │\n │      │    │     │     │    │ bar  │           │\n ├──────┤    ├─────┴─────┤    │      │           │\n │ Card │    │  Footer   │    ├──────┴───────────┤\n ├──────┤    └───────────┘    │     Footer       │\n │Footer│                     └──────────────────┘\n └──────┘',
        keyTakeaway:
          'Responsive design ensures your site looks good on every device — from phones to ultra-wide monitors.',
      },
      {
        title: 'Mobile-First Approach',
        content:
          'Start by designing for the smallest screen, then add complexity for larger ones. This forces you to prioritize content and keep things simple.',
        comparison: {
          leftTitle: 'Desktop-First',
          rightTitle: 'Mobile-First',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Start big, squeeze down', right: 'Start small, expand up' },
            { left: 'Override with max-width queries', right: 'Enhance with min-width queries' },
            { left: 'Mobile is an afterthought', right: 'Mobile is the default' },
            { left: 'Loads desktop CSS on mobile', right: 'Loads only what mobile needs' },
          ],
        },
        flow: [
          { label: 'Base CSS', description: 'Mobile styles (no queries)', icon: '📱' },
          { label: 'min-width: 640px', description: 'Tablet enhancements', icon: '📋' },
          { label: 'min-width: 1024px', description: 'Desktop layout', icon: '💻' },
          { label: 'min-width: 1280px', description: 'Wide screen tweaks', icon: '🖥️' },
        ],
        code: [
          {
            language: 'css',
            label: 'Mobile-first media queries',
            code: `/* Base styles — mobile (default) */\n.grid {\n  display: grid;\n  grid-template-columns: 1fr;  /* single column */\n  gap: 1rem;\n}\n\n/* Tablet and up */\n@media (min-width: 640px) {\n  .grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n/* Desktop and up */\n@media (min-width: 1024px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
          },
        ],
        keyTakeaway:
          'Mobile-first means your base CSS targets phones, and media queries with min-width progressively enhance for larger screens.',
      },
      {
        title: 'Media Queries Deep Dive',
        content:
          'Media queries let you apply CSS conditionally based on screen width, height, orientation, or even user preferences like dark mode.',
        code: [
          {
            language: 'css',
            label: 'Useful media queries',
            code: `/* Width breakpoint */\n@media (min-width: 768px) {\n  .sidebar { display: block; }\n}\n\n/* Dark mode preference */\n@media (prefers-color-scheme: dark) {\n  body { background: #1a1a1a; color: #fff; }\n}\n\n/* Reduced motion preference */\n@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important; }\n}\n\n/* Print styles */\n@media print {\n  .no-print { display: none; }\n}`,
          },
        ],
        table: {
          headers: ['Breakpoint', 'Width', 'Typical Device'],
          rows: [
            ['sm', '640px', 'Large phones'],
            ['md', '768px', 'Tablets'],
            ['lg', '1024px', 'Laptops'],
            ['xl', '1280px', 'Desktops'],
            ['2xl', '1536px', 'Large monitors'],
          ],
        },
        cards: [
          { title: 'Width Queries', description: 'min-width / max-width for responsive layouts', icon: '↔️', color: 'blue' },
          { title: 'Color Scheme', description: 'prefers-color-scheme for dark/light mode', icon: '🌙', color: 'purple' },
          { title: 'Reduced Motion', description: 'prefers-reduced-motion for accessibility', icon: '♿', color: 'emerald' },
          { title: 'Print', description: '@media print for printer-friendly pages', icon: '🖨️', color: 'amber' },
        ],
        keyTakeaway:
          'Media queries adapt layout by screen size, user preference (dark mode, reduced motion), and medium (print). Use common breakpoints consistently.',
      },
      {
        title: 'Fluid Typography and Spacing',
        content:
          'Instead of jumping between fixed sizes at breakpoints, fluid values scale smoothly. The clamp() function sets a minimum, preferred, and maximum value.',
        diagram:
          'clamp(MIN, PREFERRED, MAX)\n\n  Font Size\n  ▲\n  │              ┌──────── MAX (2.5rem)\n  │             ╱\n  │           ╱   ← scales with viewport\n  │         ╱\n  │ ───────┘      MIN (1rem)\n  │\n  └──────────────────────────► Viewport Width\n  320px                         1440px',
        code: [
          {
            language: 'css',
            label: 'Fluid sizing with clamp()',
            code: `/* Font scales smoothly from 1rem to 2.5rem */\nh1 {\n  font-size: clamp(1rem, 4vw, 2.5rem);\n}\n\n/* Container has fluid padding */\n.container {\n  padding: clamp(1rem, 3vw, 3rem);\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n/* Responsive units overview */\n/* rem — relative to root font size (scalable) */\n/* vw — 1% of viewport width (fluid) */\n/* % — relative to parent element */`,
          },
        ],
        bullets: [
          '**rem** — relative to root font size, scales with user preference.',
          '**vw/vh** — percentage of viewport, great for fluid layouts.',
          '**clamp()** — sets min, preferred, and max in one declaration.',
          '**em** — relative to parent font size, good for component-level spacing.',
        ],
        keyTakeaway:
          'Use clamp() for fluid sizing that scales smoothly between a minimum and maximum. Prefer rem and vw over px for responsive values.',
      },
      {
        title: 'Responsive Images and Media',
        content:
          'Images are often the largest files on a page. Serving the right size for each device saves bandwidth and speeds up loading.',
        comparison: {
          leftTitle: 'Fixed Images',
          rightTitle: 'Responsive Images',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Same large file for all devices', right: 'Different sizes per screen' },
            { left: 'Slow on mobile connections', right: 'Fast loading everywhere' },
            { left: 'Wasted bandwidth', right: 'Optimal bandwidth usage' },
            { left: 'May overflow container', right: 'Always fits container' },
          ],
        },
        code: [
          {
            language: 'html',
            label: 'Responsive images',
            code: `<!-- Basic responsive image -->\n<img src="photo.jpg" alt="Landscape"\n     style="max-width: 100%; height: auto;" />\n\n<!-- Serve different sizes for different screens -->\n<img srcset="photo-400.jpg 400w,\n             photo-800.jpg 800w,\n             photo-1200.jpg 1200w"\n     sizes="(max-width: 640px) 100vw,\n            (max-width: 1024px) 50vw,\n            33vw"\n     src="photo-800.jpg"\n     alt="Landscape" />`,
          },
        ],
        keyTakeaway:
          'Use max-width: 100% for basic responsiveness and srcset with sizes for optimized image delivery across devices.',
      },
    ],
    commonMistakes: [
      { mistake: 'Using px for everything instead of relative units', explanation: 'Pixels do not scale with user preferences or screen sizes. Use rem for text, em for component spacing, and vw/vh for viewport-relative sizing.' },
      { mistake: 'Forgetting the viewport meta tag', explanation: 'Without <meta name="viewport" content="width=device-width, initial-scale=1.0">, mobile browsers render pages at desktop width.' },
      { mistake: 'Targeting specific devices instead of content-based breakpoints', explanation: 'Device sizes change yearly. Set breakpoints where your layout breaks, not where a specific phone screen ends.' },
      { mistake: 'Not testing on real devices', explanation: 'Browser DevTools emulation misses touch targets, real scroll behavior, and performance issues. Test on actual phones.' },
    ],
    practiceQuestions: [
      'What is the difference between min-width and max-width media queries? Which is mobile-first?',
      'Write CSS that creates a 3-column layout on desktop, 2 columns on tablet, and 1 column on mobile.',
      'Explain how srcset and sizes attributes work together for responsive images.',
      'Use clamp() to create a heading that scales from 1.5rem on mobile to 3rem on desktop.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which media query approach is considered mobile-first?',
        options: ['max-width', 'min-width', 'exact-width', 'device-width'],
        answer: 'min-width',
        explanation: 'Mobile-first uses min-width media queries because the base styles target mobile, and min-width progressively adds styles for larger screens.',
      },
      {
        type: 'short-answer',
        question: 'What CSS function sets a minimum, preferred, and maximum value for fluid sizing?',
        answer: 'clamp()',
        explanation: 'clamp(MIN, PREFERRED, MAX) smoothly scales a value between a minimum and maximum. For example, clamp(1rem, 4vw, 2.5rem) for fluid font sizing.',
      },
      {
        type: 'mcq',
        question: 'What CSS unit is relative to the root element\'s font size?',
        options: ['px', 'em', 'rem', 'vw'],
        answer: 'rem',
        explanation: 'rem stands for "root em" and is relative to the root (<html>) font size. em is relative to the parent element\'s font size, and px is an absolute unit.',
      },
      {
        type: 'mcq',
        question: 'What HTML attribute serves different image sizes based on screen width?',
        options: ['alt', 'src', 'srcset', 'loading'],
        answer: 'srcset',
        explanation: 'The srcset attribute provides a list of image sources with their widths, allowing the browser to choose the most appropriate size for the current viewport.',
      },
      {
        type: 'short-answer',
        question: 'What meta tag must be included for responsive design to work on mobile browsers?',
        answer: 'viewport',
        explanation: 'The <meta name="viewport" content="width=device-width, initial-scale=1.0"> tag tells mobile browsers to use the device width instead of rendering at desktop width.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 5. React Basics
  // ───────────────────────────────────────────────
  'react-basics': {
    steps: [
      {
        title: 'Why React?',
        content:
          'React lets you build UIs from small, reusable pieces called components. Instead of manipulating the DOM directly, you describe what the UI should look like and React updates it efficiently.',
        analogy:
          'React components are like LEGO bricks. Each brick is self-contained with its own shape and color. You snap them together to build complex structures, and you can swap out individual bricks without rebuilding the whole thing.',
        comparison: {
          leftTitle: 'Vanilla JS',
          rightTitle: 'React',
          leftColor: 'amber',
          rightColor: 'blue',
          items: [
            { left: 'Manually update DOM nodes', right: 'Declare UI, React updates for you' },
            { left: 'State scattered across the DOM', right: 'State lives in component variables' },
            { left: 'Hard to reuse UI pieces', right: 'Components are reusable by design' },
            { left: 'Page reloads for navigation', right: 'Client-side routing, no reloads' },
          ],
        },
        flow: [
          { label: 'Define Component', description: 'Write a function returning JSX', icon: '📝' },
          { label: 'Pass Props', description: 'Configure with data', icon: '📦' },
          { label: 'Manage State', description: 'Track interactive data', icon: '🔄' },
          { label: 'React Renders', description: 'Virtual DOM diffed & patched', icon: '⚡' },
        ],
        keyTakeaway:
          'React\'s component model lets you build complex UIs from simple, reusable pieces with declarative state management.',
      },
      {
        title: 'JSX — HTML in JavaScript',
        content:
          'JSX is a syntax extension that lets you write HTML-like code inside JavaScript. The build tool converts it to function calls that create DOM elements.',
        diagram:
          'JSX Compilation:\n\n  <div className="card">      React.createElement(\n    <h1>Hello</h1>        →     "div",\n  </div>                        { className: "card" },\n                                React.createElement("h1", null, "Hello")\n                              )',
        code: [
          {
            language: 'tsx',
            label: 'JSX basics',
            code: `// JSX looks like HTML but lives in JavaScript\nfunction Welcome() {\n  const name = "Alice";\n  const isLoggedIn = true;\n\n  return (\n    <div className="card">\n      <h1>Hello, {name}!</h1>         {/* expressions in braces */}\n      {isLoggedIn && <p>Welcome back</p>}  {/* conditional */}\n      <ul>\n        {["React", "Vue", "Svelte"].map(fw => (\n          <li key={fw}>{fw}</li>        /* lists need keys */\n        ))}\n      </ul>\n    </div>\n  );\n}`,
          },
        ],
        bullets: [
          '**className** instead of class (class is a reserved word in JS).',
          '**{expression}** — curly braces embed any JavaScript expression.',
          '**key** attribute is required on list items so React can track changes efficiently.',
          '**Self-closing tags** — <img />, <input />, <br /> must be closed.',
        ],
        keyTakeaway:
          'JSX lets you write HTML-like syntax in JavaScript. Use curly braces for dynamic expressions and always provide key props for lists.',
      },
      {
        title: 'Components and Props',
        content:
          'Components are functions that return JSX. Props are the arguments you pass to customize them — like function parameters for your UI.',
        analogy:
          'A component is like a cookie cutter. It defines the shape. Props are the dough — they determine the flavor and color of each cookie you make with that cutter.',
        diagram:
          'Component Tree:\n\n         <App />\n        ╱      ╲\n   <Header />  <Main />\n      │        ╱    ╲\n   <Nav />  <Feed /> <Sidebar />\n             │\n        <PostCard />\n        <PostCard />\n        <PostCard />\n\n  Props flow DOWN (parent → child)\n  Events flow UP (child → parent)',
        code: [
          {
            language: 'tsx',
            label: 'Creating and using components',
            code: `// A reusable component with props\nfunction UserCard({ name, role, avatar }: {\n  name: string;\n  role: string;\n  avatar: string;\n}) {\n  return (\n    <div className="card">\n      <img src={avatar} alt={name} />\n      <h2>{name}</h2>\n      <p>{role}</p>\n    </div>\n  );\n}\n\n// Using the component\nfunction Team() {\n  return (\n    <div>\n      <UserCard name="Alice" role="Engineer" avatar="/alice.jpg" />\n      <UserCard name="Bob" role="Designer" avatar="/bob.jpg" />\n    </div>\n  );\n}`,
          },
        ],
        keyTakeaway:
          'Components are reusable UI functions. Props flow one way (parent to child) and make components configurable.',
      },
      {
        title: 'State — Making Things Interactive',
        content:
          'State is data that changes over time within a component. When state updates, React re-renders the component with the new values.',
        flow: [
          { label: 'User Clicks', description: 'Event triggers handler', icon: '👆' },
          { label: 'setState Called', description: 'New state value queued', icon: '📝' },
          { label: 'Re-render', description: 'Component function runs again', icon: '🔄' },
          { label: 'DOM Updated', description: 'React patches only what changed', icon: '✅' },
        ],
        code: [
          {
            language: 'tsx',
            label: 'useState basics',
            code: `import { useState } from "react";\n\nfunction Counter() {\n  // Declare state: [currentValue, updaterFunction]\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n      <button onClick={() => setCount(0)}>\n        Reset\n      </button>\n    </div>\n  );\n}`,
          },
        ],
        comparison: {
          leftTitle: 'Props',
          rightTitle: 'State',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Passed from parent', right: 'Owned by the component' },
            { left: 'Read-only (immutable)', right: 'Can be updated with setter' },
            { left: 'Like function arguments', right: 'Like local variables with memory' },
            { left: 'Changes come from outside', right: 'Changes come from inside' },
          ],
        },
        keyTakeaway:
          'useState gives components memory. Calling the setter triggers a re-render with the new value — React handles the DOM updates.',
      },
      {
        title: 'Conditional Rendering and Lists',
        content:
          'React renders different UI based on state using standard JavaScript — ternaries, && operators, and map for lists.',
        bullets: [
          '**Ternary** (condition ? A : B) — show one of two elements.',
          '**&& operator** (condition && element) — show or hide an element.',
          '**.map()** — render a list of elements from an array.',
          '**key prop** — unique identifier for each list item, required for efficient updates.',
        ],
        code: [
          {
            language: 'tsx',
            label: 'Conditionals and lists',
            code: `function TodoApp() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: "Learn React", done: true },\n    { id: 2, text: "Build a project", done: false },\n  ]);\n\n  return (\n    <div>\n      <h1>Todos ({todos.filter(t => !t.done).length} left)</h1>\n\n      {todos.length === 0\n        ? <p>No todos yet!</p>           /* ternary */\n        : (\n          <ul>\n            {todos.map(todo => (           /* list rendering */\n              <li key={todo.id}\n                  style={{\n                    textDecoration: todo.done\n                      ? "line-through" : "none"\n                  }}>\n                {todo.text}\n              </li>\n            ))}\n          </ul>\n        )}\n    </div>\n  );\n}`,
          },
        ],
        table: {
          headers: ['Pattern', 'Syntax', 'Use Case'],
          rows: [
            ['Ternary', 'cond ? <A /> : <B />', 'Show one of two options'],
            ['Logical AND', 'cond && <A />', 'Show or hide a single element'],
            ['Early return', 'if (loading) return <Spinner />', 'Guard clauses at top of component'],
            ['Map', 'arr.map(item => <Li />)', 'Render dynamic lists'],
          ],
        },
        keyTakeaway:
          'Use ternary operators for if/else, && for conditional display, and .map() with key props for lists.',
      },
    ],
    commonMistakes: [
      { mistake: 'Mutating state directly instead of using the setter', explanation: 'React does not detect direct mutations. Always call setX() with a new value. For objects/arrays, spread to create a copy.' },
      { mistake: 'Missing key prop on list items', explanation: 'Without unique keys, React cannot efficiently track which items changed, moved, or were removed, causing bugs and poor performance.' },
      { mistake: 'Calling the state setter in the render body (outside event handlers)', explanation: 'This causes an infinite re-render loop. State updates should happen in event handlers, useEffect, or callbacks.' },
      { mistake: 'Using index as key for dynamic lists', explanation: 'If items are reordered, added, or removed, index keys cause React to re-render the wrong items. Use unique IDs instead.' },
    ],
    practiceQuestions: [
      'What is JSX and how does it differ from HTML? Name three differences.',
      'Build a toggle component that switches between "ON" and "OFF" when clicked, using useState.',
      'Explain why keys are important when rendering lists in React.',
      'What is the difference between props and state? When would you use each?',
      'Create a UserCard component that accepts name, email, and avatar props and renders a card.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'In JSX, which attribute is used instead of "class" for CSS classes?',
        options: ['cssClass', 'class', 'className', 'classList'],
        answer: 'className',
        explanation: 'Since "class" is a reserved keyword in JavaScript, JSX uses "className" to assign CSS classes to elements.',
      },
      {
        type: 'mcq',
        question: 'What is required when rendering a list of elements in React?',
        options: ['An id attribute', 'A key prop', 'A ref attribute', 'A name prop'],
        answer: 'A key prop',
        explanation: 'React uses the key prop to track which list items changed, were added, or removed. Keys must be unique among siblings for efficient DOM updates.',
      },
      {
        type: 'short-answer',
        question: 'What React hook is used to add state to a functional component?',
        answer: 'useState',
        explanation: 'useState returns a pair: the current state value and a setter function. Calling the setter triggers a re-render with the new value.',
      },
      {
        type: 'mcq',
        question: 'How do props flow in a React component tree?',
        options: [
          'From child to parent',
          'From parent to child',
          'In both directions',
          'Between siblings',
        ],
        answer: 'From parent to child',
        explanation: 'React has a one-way data flow. Props are passed from parent components down to child components. Events (callbacks) flow up from child to parent.',
      },
      {
        type: 'short-answer',
        question: 'What syntax do you use to embed a JavaScript expression inside JSX?',
        answer: 'curly braces',
        explanation: 'Curly braces {} in JSX let you embed any JavaScript expression, such as variables, function calls, or ternary operators.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 6. React State & Effects
  // ───────────────────────────────────────────────
  'react-state-and-effects': {
    steps: [
      {
        title: 'useState Deep Dive',
        content:
          'useState can hold any value — numbers, strings, booleans, arrays, and objects. When updating objects or arrays, always create a new reference.',
        comparison: {
          leftTitle: 'Wrong (Mutation)',
          rightTitle: 'Right (New Reference)',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'user.age = 26', right: 'setUser({ ...user, age: 26 })' },
            { left: 'items.push("banana")', right: 'setItems([...items, "banana"])' },
            { left: 'items[0] = "new"', right: 'setItems(items.map(...)' },
            { left: 'delete user.name', right: 'setUser(omit(user, "name"))' },
          ],
        },
        code: [
          {
            language: 'tsx',
            label: 'State with objects and arrays',
            code: `const [user, setUser] = useState({ name: "Alice", age: 25 });\n\n// WRONG — mutating directly (React won't re-render)\nuser.age = 26;\n\n// RIGHT — spread to create a new object\nsetUser({ ...user, age: 26 });\n\n// Arrays — adding an item\nconst [items, setItems] = useState(["apple"]);\nsetItems([...items, "banana"]); // new array\n\n// Arrays — removing an item\nsetItems(items.filter(item => item !== "apple"));\n\n// Arrays — updating an item\nsetItems(items.map(item =>\n  item === "apple" ? "green apple" : item\n));`,
          },
        ],
        keyTakeaway:
          'Never mutate state directly. Use spread for objects and map/filter for arrays to create new references that trigger re-renders.',
      },
      {
        title: 'useEffect — Side Effects',
        content:
          'Side effects are operations that reach outside the component — fetching data, setting timers, or subscribing to events. useEffect runs after the component renders.',
        analogy:
          'useEffect is like a post-it note that says "after you finish painting the wall, go buy more supplies." The painting (render) happens first, then the side effect runs.',
        flow: [
          { label: 'Component Renders', description: 'JSX is computed', icon: '🎨' },
          { label: 'DOM Updated', description: 'Browser paints', icon: '🖥️' },
          { label: 'Effect Runs', description: 'Side effect executes', icon: '⚡' },
          { label: 'Cleanup', description: 'Previous effect cleaned up', icon: '🧹' },
        ],
        code: [
          {
            language: 'tsx',
            label: 'useEffect patterns',
            code: `import { useState, useEffect } from "react";\n\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n\n  // Runs ONCE on mount (empty dependency array)\n  useEffect(() => {\n    const id = setInterval(() => {\n      setSeconds(s => s + 1); // updater function\n    }, 1000);\n\n    // Cleanup — runs on unmount\n    return () => clearInterval(id);\n  }, []); // [] = run only once\n\n  return <p>Seconds: {seconds}</p>;\n}`,
          },
        ],
        keyTakeaway:
          'useEffect runs after render. The dependency array controls when it re-runs, and the cleanup function prevents memory leaks.',
      },
      {
        title: 'Dependency Array Rules',
        content:
          'The dependency array tells React when to re-run the effect. Getting it wrong is the #1 source of useEffect bugs.',
        table: {
          headers: ['Dependency Array', 'When Effect Runs', 'Use Case'],
          rows: [
            ['No array', 'After every render', 'Rare — logging, debugging'],
            ['[]', 'Only on mount', 'Fetch initial data, setup subscriptions'],
            ['[a, b]', 'When a or b changes', 'Fetch when ID changes, sync with state'],
          ],
        },
        diagram:
          'Effect Lifecycle:\n\n  Mount          State Change       Unmount\n    │                │                 │\n    ▼                ▼                 ▼\n  Render  ──►  Render (new)  ──►   Cleanup\n    │                │\n    ▼                ▼\n  Effect         Cleanup old\n  runs           Effect runs\n                     │\n                     ▼\n                 New effect\n                   runs',
        code: [
          {
            language: 'tsx',
            label: 'Fetching data when an ID changes',
            code: `function UserProfile({ userId }: { userId: string }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    setLoading(true);\n    fetch(\`/api/users/\\\${userId}\`)\n      .then(res => res.json())\n      .then(data => {\n        setUser(data);\n        setLoading(false);\n      });\n  }, [userId]); // re-fetch when userId changes\n\n  if (loading) return <p>Loading...</p>;\n  return <h1>{user?.name}</h1>;\n}`,
          },
        ],
        keyTakeaway:
          'Always include every variable your effect reads in the dependency array. An empty array means "run once on mount."',
      },
      {
        title: 'Component Lifecycle with Hooks',
        content:
          'Class components had lifecycle methods. Hooks replace all of them with useEffect.',
        comparison: {
          leftTitle: 'Class Lifecycle',
          rightTitle: 'Hooks Equivalent',
          leftColor: 'amber',
          rightColor: 'blue',
          items: [
            { left: 'componentDidMount', right: 'useEffect(() => {}, [])' },
            { left: 'componentDidUpdate', right: 'useEffect(() => {}, [dep])' },
            { left: 'componentWillUnmount', right: 'useEffect cleanup return' },
            { left: 'shouldComponentUpdate', right: 'React.memo()' },
          ],
        },
        cards: [
          { title: 'useState', description: 'Local component state', icon: '📦', color: 'blue' },
          { title: 'useEffect', description: 'Side effects after render', icon: '⚡', color: 'purple' },
          { title: 'useRef', description: 'Mutable value without re-render', icon: '📌', color: 'emerald' },
          { title: 'useMemo', description: 'Cache expensive computations', icon: '🧮', color: 'amber' },
          { title: 'useCallback', description: 'Cache function references', icon: '🔗', color: 'cyan' },
          { title: 'useContext', description: 'Read context without prop drilling', icon: '🌐', color: 'red' },
        ],
        keyTakeaway:
          'useEffect with different dependency arrays replaces all class lifecycle methods. The cleanup function handles unmount logic.',
      },
      {
        title: 'useRef and Custom Hooks',
        content:
          'useRef holds a mutable value that persists across renders without causing re-renders. Custom hooks let you extract and reuse stateful logic.',
        bullets: [
          '**useRef for DOM access** — get a reference to a real DOM element.',
          '**useRef for values** — store a mutable value that survives re-renders.',
          '**Custom hooks** — functions starting with "use" that compose built-in hooks.',
          '**Naming convention** — always prefix with "use" so React enforces hook rules.',
        ],
        code: [
          {
            language: 'tsx',
            label: 'useRef and custom hooks',
            code: `// useRef — access DOM element\nfunction FocusInput() {\n  const inputRef = useRef<HTMLInputElement>(null);\n\n  return (\n    <>\n      <input ref={inputRef} />\n      <button onClick={() => inputRef.current?.focus()}>\n        Focus\n      </button>\n    </>\n  );\n}\n\n// Custom hook — reusable logic\nfunction useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue] as const;\n}`,
          },
        ],
        keyTakeaway:
          'useRef gives you a persistent mutable box. Custom hooks (use-prefixed functions) let you reuse stateful logic across components.',
      },
    ],
    commonMistakes: [
      { mistake: 'Missing dependencies in the useEffect array', explanation: 'If your effect reads a variable but it is not in the dependency array, the effect uses stale values. The ESLint exhaustive-deps rule catches this.' },
      { mistake: 'Forgetting the cleanup function in useEffect', explanation: 'Subscriptions, timers, and event listeners that are not cleaned up cause memory leaks. Always return a cleanup function.' },
      { mistake: 'Creating infinite loops with useEffect', explanation: 'If the effect updates a state variable that is in its own dependency array, it triggers itself infinitely. Restructure the logic or use a ref.' },
      { mistake: 'Using useRef when useState is needed', explanation: 'useRef does not trigger re-renders. If the UI should update when the value changes, use useState instead.' },
    ],
    practiceQuestions: [
      'Explain the difference between useEffect with no dependency array, an empty array, and an array with values.',
      'Write a custom hook called useWindowSize that tracks the browser window width and height.',
      'Why does updating an object in state require spreading instead of direct mutation?',
      'Build a component that fetches data from an API on mount, shows a loading spinner, and handles errors.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'When does a useEffect with an empty dependency array ([]) run?',
        options: [
          'After every render',
          'Only on the first render (mount)',
          'Never',
          'Only when state changes',
        ],
        answer: 'Only on the first render (mount)',
        explanation: 'An empty dependency array tells React to run the effect only once after the initial render (mount), equivalent to componentDidMount in class components.',
      },
      {
        type: 'mcq',
        question: 'What is the correct way to add an item to a state array in React?',
        options: [
          'items.push(newItem)',
          'setItems([...items, newItem])',
          'items[items.length] = newItem',
          'setItems(items.concat) without calling it',
        ],
        answer: 'setItems([...items, newItem])',
        explanation: 'You must create a new array reference for React to detect the change. Spread syntax creates a new array with all existing items plus the new one.',
      },
      {
        type: 'short-answer',
        question: 'What function do you return from useEffect to clean up subscriptions or timers?',
        answer: 'cleanup function',
        explanation: 'Returning a function from useEffect acts as cleanup. React calls it before the component unmounts and before re-running the effect, preventing memory leaks.',
      },
      {
        type: 'mcq',
        question: 'Which hook holds a mutable value that does NOT cause re-renders when changed?',
        options: ['useState', 'useEffect', 'useRef', 'useCallback'],
        answer: 'useRef',
        explanation: 'useRef returns a mutable ref object whose .current property can be changed without triggering a re-render. It is commonly used for DOM references and persistent values.',
      },
      {
        type: 'short-answer',
        question: 'What naming convention must custom hooks follow in React?',
        answer: 'start with use',
        explanation: 'Custom hooks must be prefixed with "use" (e.g., useWindowSize, useLocalStorage). This convention lets React enforce the Rules of Hooks via linting.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 7. API Integration
  // ───────────────────────────────────────────────
  'api-integration': {
    steps: [
      {
        title: 'What is an API?',
        content:
          'An API (Application Programming Interface) is a contract between your frontend and a server. You send an HTTP request and get a structured response back.',
        analogy:
          'An API is like a restaurant menu. The menu lists what you can order (endpoints), what information the kitchen needs (request body), and what you will get back (response).',
        flow: [
          { label: 'Frontend', description: 'Sends HTTP request', icon: '📤' },
          { label: 'Internet', description: 'Routes to server', icon: '🌐' },
          { label: 'Server', description: 'Processes request', icon: '⚙️' },
          { label: 'Database', description: 'Reads/writes data', icon: '🗄️' },
          { label: 'Response', description: 'JSON sent back', icon: '📥' },
        ],
        diagram:
          'HTTP Request/Response Cycle:\n\n  Browser (Client)              Server\n  ┌─────────────┐              ┌─────────────┐\n  │             │── Request ──►│             │\n  │  fetch()    │  GET /api/   │  Express    │\n  │  axios()    │  + Headers   │  Handler    │\n  │             │  + Body      │             │\n  │             │◄─ Response ──│             │\n  │  .then()    │  Status Code │  res.json() │\n  │  await      │  + JSON Body │             │\n  └─────────────┘              └─────────────┘',
        keyTakeaway:
          'APIs are the bridge between frontend and backend. You communicate through HTTP requests and receive structured JSON responses.',
      },
      {
        title: 'Fetch and Async/Await',
        content:
          'The fetch API is built into every browser. Combined with async/await, it makes HTTP calls clean and readable.',
        code: [
          {
            language: 'typescript',
            label: 'Fetching data with async/await',
            code: `// GET request — fetch data\nasync function getUsers(): Promise<User[]> {\n  const response = await fetch("/api/users");\n\n  if (!response.ok) {\n    throw new Error(\`HTTP \\\${response.status}\`);\n  }\n\n  return response.json(); // parse JSON body\n}\n\n// POST request — send data\nasync function createUser(data: { name: string; email: string }) {\n  const response = await fetch("/api/users", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(data),\n  });\n\n  if (!response.ok) {\n    const error = await response.json();\n    throw new Error(error.message);\n  }\n\n  return response.json();\n}`,
          },
        ],
        comparison: {
          leftTitle: 'Promises (.then)',
          rightTitle: 'Async/Await',
          leftColor: 'amber',
          rightColor: 'emerald',
          items: [
            { left: 'fetch().then(r => r.json())', right: 'const r = await fetch(); await r.json()' },
            { left: 'Chain .then() for sequence', right: 'Write line-by-line like sync code' },
            { left: '.catch() for errors', right: 'try/catch for errors' },
            { left: 'Can get messy with nesting', right: 'Flat, readable code' },
          ],
        },
        keyTakeaway:
          'Use fetch with async/await for clean HTTP calls. Always check response.ok and parse the JSON body.',
      },
      {
        title: 'Loading, Error, and Empty States',
        content:
          'Every API call has three phases: loading, success, and error. A good UI handles all three with clear visual feedback.',
        cards: [
          { title: 'Loading', description: 'Show spinner or skeleton while waiting', icon: '⏳', color: 'blue' },
          { title: 'Error', description: 'Show message with retry button', icon: '❌', color: 'red' },
          { title: 'Empty', description: 'Show helpful message when no data exists', icon: '📭', color: 'amber' },
          { title: 'Success', description: 'Render the actual data', icon: '✅', color: 'emerald' },
        ],
        code: [
          {
            language: 'tsx',
            label: 'Complete data fetching pattern',
            code: `function UserList() {\n  const [users, setUsers] = useState<User[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    fetch("/api/users")\n      .then(res => {\n        if (!res.ok) throw new Error("Failed to fetch");\n        return res.json();\n      })\n      .then(data => setUsers(data))\n      .catch(err => setError(err.message))\n      .finally(() => setLoading(false));\n  }, []);\n\n  if (loading) return <Spinner />;\n  if (error) return <ErrorBanner message={error} />;\n  if (users.length === 0) return <EmptyState />;\n\n  return (\n    <ul>\n      {users.map(u => <li key={u.id}>{u.name}</li>)}\n    </ul>\n  );\n}`,
          },
        ],
        flow: [
          { label: 'Mount', description: 'Component renders', icon: '🎬' },
          { label: 'Loading', description: 'Show spinner, fetch starts', icon: '⏳' },
          { label: 'Response', description: 'Data or error arrives', icon: '📨' },
          { label: 'Render', description: 'Show data, error, or empty', icon: '✅' },
        ],
        keyTakeaway:
          'Always handle loading, error, and empty states. Users should never see a blank screen or unhandled error.',
      },
      {
        title: 'HTTP Methods and Status Codes',
        content:
          'REST APIs use HTTP methods to indicate the action and status codes to communicate the result.',
        table: {
          headers: ['Method', 'Purpose', 'Example'],
          rows: [
            ['GET', 'Read data', 'GET /api/users'],
            ['POST', 'Create data', 'POST /api/users'],
            ['PUT', 'Replace data', 'PUT /api/users/123'],
            ['PATCH', 'Partial update', 'PATCH /api/users/123'],
            ['DELETE', 'Remove data', 'DELETE /api/users/123'],
          ],
        },
        cards: [
          { title: '2xx Success', description: '200 OK, 201 Created, 204 No Content', icon: '✅', color: 'emerald' },
          { title: '3xx Redirect', description: '301 Moved, 304 Not Modified', icon: '↪️', color: 'blue' },
          { title: '4xx Client Error', description: '400 Bad Request, 401 Unauthorized, 404 Not Found', icon: '⚠️', color: 'amber' },
          { title: '5xx Server Error', description: '500 Internal Error, 503 Unavailable', icon: '❌', color: 'red' },
        ],
        code: [
          {
            language: 'typescript',
            label: 'CRUD operations',
            code: `// Full CRUD example\nconst API = "/api/todos";\n\n// Create\nawait fetch(API, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ text: "Buy milk" }),\n});\n\n// Read\nconst todos = await fetch(API).then(r => r.json());\n\n// Update\nawait fetch(\`\\\${API}/1\`, {\n  method: "PATCH",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ done: true }),\n});\n\n// Delete\nawait fetch(\`\\\${API}/1\`, { method: "DELETE" });`,
          },
        ],
        keyTakeaway:
          'Use the right HTTP method for each operation: GET to read, POST to create, PATCH to update, DELETE to remove.',
      },
      {
        title: 'Authentication Headers',
        content:
          'Most APIs require authentication. The common pattern is sending a JWT token in the Authorization header with every request.',
        diagram:
          'Auth Flow:\n\n  1. Login\n  Client ──POST /login──► Server\n         { email, pass }    │\n                            ▼\n                        Verify password\n                            │\n  Client ◄── JWT Token ─────┘\n    │\n    ▼\n  Store in localStorage\n\n  2. Authenticated Request\n  Client ──GET /api/data──► Server\n         Authorization:       │\n         Bearer <token>       ▼\n                          Verify JWT\n                              │\n  Client ◄── JSON data ───────┘',
        code: [
          {
            language: 'typescript',
            label: 'Authenticated API calls',
            code: `// Helper that adds auth header automatically\nasync function apiFetch(url: string, options: RequestInit = {}) {\n  const token = localStorage.getItem("token");\n\n  const response = await fetch(url, {\n    ...options,\n    headers: {\n      "Content-Type": "application/json",\n      ...(token && { Authorization: \`Bearer \\\${token}\` }),\n      ...options.headers,\n    },\n  });\n\n  // Handle expired token\n  if (response.status === 401) {\n    localStorage.removeItem("token");\n    window.location.href = "/login";\n    throw new Error("Session expired");\n  }\n\n  return response;\n}`,
          },
        ],
        keyTakeaway:
          'Wrap fetch in a helper that automatically attaches the auth token and handles 401 (unauthorized) responses globally.',
      },
    ],
    commonMistakes: [
      { mistake: 'Not checking response.ok before parsing', explanation: 'fetch does not throw on 4xx/5xx errors. A 404 response is still a "successful" fetch. Always check response.ok or response.status.' },
      { mistake: 'Storing sensitive tokens in localStorage', explanation: 'localStorage is vulnerable to XSS attacks. For high-security apps, use httpOnly cookies. For SPAs, localStorage is a common trade-off but sanitize all inputs.' },
      { mistake: 'Firing API calls without cleanup in useEffect', explanation: 'If the component unmounts before the fetch completes, calling setState on an unmounted component causes a warning. Use an AbortController.' },
      { mistake: 'Not handling the empty state', explanation: 'An empty array from the API is not an error, but showing nothing confuses users. Always show a helpful empty state message.' },
    ],
    practiceQuestions: [
      'Write a custom hook useFetch(url) that returns { data, loading, error } and refetches when the URL changes.',
      'Explain the difference between PUT and PATCH. When would you use each?',
      'How would you handle token refresh when a 401 response is returned?',
      'Build a search component that calls an API as the user types, with debouncing to avoid too many requests.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which HTTP method is used to create a new resource?',
        options: ['GET', 'POST', 'DELETE', 'PATCH'],
        answer: 'POST',
        explanation: 'POST is used to create new resources on the server. GET reads data, PATCH partially updates, and DELETE removes resources.',
      },
      {
        type: 'short-answer',
        question: 'What property on the fetch Response object should you check to determine if the request was successful?',
        answer: 'ok',
        explanation: 'response.ok is true when the HTTP status is in the 200-299 range. Unlike other libraries, fetch does not throw on 4xx or 5xx status codes.',
      },
      {
        type: 'mcq',
        question: 'What HTTP status code indicates the resource was not found?',
        options: ['200', '301', '404', '500'],
        answer: '404',
        explanation: '404 means the server could not find the requested resource. 200 is success, 301 is a redirect, and 500 is an internal server error.',
      },
      {
        type: 'mcq',
        question: 'Where is a JWT token typically sent in authenticated API requests?',
        options: [
          'In the URL query string',
          'In the Authorization header as a Bearer token',
          'In the request body',
          'In a cookie only',
        ],
        answer: 'In the Authorization header as a Bearer token',
        explanation: 'The standard approach is to send the JWT in the Authorization header with the format "Bearer <token>". This keeps the token out of URLs and request bodies.',
      },
      {
        type: 'short-answer',
        question: 'What HTTP method performs a partial update on an existing resource?',
        answer: 'PATCH',
        explanation: 'PATCH applies a partial modification to a resource. PUT replaces the entire resource, while PATCH only updates the specified fields.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 8. Build & Deploy
  // ───────────────────────────────────────────────
  'build-and-deploy': {
    steps: [
      {
        title: 'What Happens at Build Time',
        content:
          'A build tool transforms your development code into optimized files browsers can understand. It bundles modules, compiles TypeScript/JSX, minifies code, and tree-shakes unused exports.',
        analogy:
          'Building is like packaging a product for shipping. You take raw materials (source code), assemble them (bundle), shrink-wrap them (minify), and remove packing peanuts (tree-shake).',
        flow: [
          { label: 'Source Code', description: 'JSX, TS, CSS modules', icon: '📝' },
          { label: 'Compile', description: 'TypeScript → JavaScript, JSX → JS', icon: '⚙️' },
          { label: 'Bundle', description: 'Combine into fewer files', icon: '📦' },
          { label: 'Minify', description: 'Remove whitespace, shorten names', icon: '🗜️' },
          { label: 'Tree-shake', description: 'Remove unused code', icon: '🌿' },
          { label: 'Output', description: 'Optimized static files', icon: '✅' },
        ],
        diagram:
          'Build Pipeline:\n\n  src/\n  ├── App.tsx        ──┐\n  ├── Header.tsx       │   Compile    Bundle     Minify\n  ├── utils.ts         ├──────►──────►──────►──── dist/\n  ├── styles.css       │                          ├── index.html\n  └── unused.ts  ✕     │   (tree-shaken out)      ├── app.a1b2.js (42KB)\n                       │                          └── app.c3d4.css (8KB)\n                       │\n  node_modules/  ──────┘\n  (only used parts included)',
        keyTakeaway:
          'The build process compiles, bundles, minifies, and tree-shakes your code into optimized files ready for production.',
      },
      {
        title: 'Vite — The Modern Build Tool',
        content:
          'Vite is the fastest build tool for modern web apps. It uses native ES modules for development and Rollup for production builds.',
        comparison: {
          leftTitle: 'Webpack',
          rightTitle: 'Vite',
          leftColor: 'amber',
          rightColor: 'emerald',
          items: [
            { left: 'Bundles everything before serving', right: 'Serves files individually via ESM' },
            { left: 'Slow cold start (seconds)', right: 'Instant cold start' },
            { left: 'Complex configuration', right: 'Zero-config for most projects' },
            { left: 'Mature plugin ecosystem', right: 'Growing plugin ecosystem' },
          ],
        },
        code: [
          {
            language: 'bash',
            label: 'Create a Vite project',
            code: `# Create a new React + TypeScript project\nnpm create vite@latest my-app -- --template react-ts\ncd my-app\nnpm install\n\n# Development — instant hot module replacement\nnpm run dev\n\n# Production build — optimized output\nnpm run build\n\n# Preview the production build locally\nnpm run preview`,
          },
        ],
        cards: [
          { title: 'HMR', description: 'Hot Module Replacement — instant updates in dev', icon: '⚡', color: 'emerald' },
          { title: 'ESM', description: 'Native ES Modules for fast dev serving', icon: '📦', color: 'blue' },
          { title: 'Rollup', description: 'Efficient production bundling', icon: '🏗️', color: 'purple' },
          { title: 'TypeScript', description: 'Built-in TS support, zero config', icon: '🔷', color: 'cyan' },
        ],
        keyTakeaway:
          'Vite provides instant dev server startup and fast builds. It is the recommended build tool for new React projects.',
      },
      {
        title: 'Environment Variables',
        content:
          'Environment variables let you configure your app differently for development, staging, and production without changing code.',
        code: [
          {
            language: 'bash',
            label: '.env files',
            code: `# .env.local — local development (git-ignored)\nVITE_API_URL=http://localhost:3001\nVITE_APP_NAME=MyApp\n\n# .env.production — production values\nVITE_API_URL=https://api.myapp.com\nVITE_APP_NAME=MyApp`,
          },
          {
            language: 'typescript',
            label: 'Using env vars in code',
            code: `// Vite exposes env vars prefixed with VITE_\nconst apiUrl = import.meta.env.VITE_API_URL;\n\nfetch(\`\\\${apiUrl}/api/users\`);`,
          },
        ],
        bullets: [
          '**Never commit secrets** — .env.local should be in .gitignore.',
          '**Prefix matters** — Vite only exposes variables starting with VITE_. Next.js uses NEXT_PUBLIC_.',
          '**Build-time replacement** — env vars are baked into the bundle at build time, not read at runtime.',
        ],
        table: {
          headers: ['Framework', 'Prefix', 'Access'],
          rows: [
            ['Vite', 'VITE_', 'import.meta.env.VITE_X'],
            ['Next.js', 'NEXT_PUBLIC_', 'process.env.NEXT_PUBLIC_X'],
            ['Create React App', 'REACT_APP_', 'process.env.REACT_APP_X'],
          ],
        },
        keyTakeaway:
          'Use .env files for configuration. Only prefix-exposed variables are included in the bundle — never put secrets in frontend env vars.',
      },
      {
        title: 'Deploying to Vercel',
        content:
          'Vercel is the easiest way to deploy a frontend app. Connect your GitHub repo and it automatically builds and deploys on every push.',
        flow: [
          { label: 'Push to GitHub', description: 'Commit and push code', icon: '📤' },
          { label: 'Vercel Detects', description: 'Webhook triggers build', icon: '🔔' },
          { label: 'Build Runs', description: 'npm run build in the cloud', icon: '🏗️' },
          { label: 'Deploy', description: 'Static files served on CDN', icon: '🌍' },
          { label: 'Live URL', description: 'your-app.vercel.app', icon: '✅' },
        ],
        code: [
          {
            language: 'bash',
            label: 'Deploy with Vercel CLI',
            code: `# Install Vercel CLI\nnpm i -g vercel\n\n# Deploy from project root\nvercel\n\n# Deploy to production\nvercel --prod\n\n# Set environment variables\nvercel env add VITE_API_URL`,
          },
        ],
        comparison: {
          leftTitle: 'Self-Hosted',
          rightTitle: 'Vercel / Netlify',
          leftColor: 'amber',
          rightColor: 'emerald',
          items: [
            { left: 'Manual server setup', right: 'Zero-config deployment' },
            { left: 'You manage SSL, CDN, scaling', right: 'Built-in SSL, CDN, auto-scaling' },
            { left: 'Full control', right: 'Less control, more convenience' },
            { left: 'No vendor lock-in', right: 'Platform-specific features' },
          ],
        },
        keyTakeaway:
          'Vercel and Netlify offer zero-config deployment. Connect your repo and every push automatically builds and deploys.',
      },
      {
        title: 'Performance Optimization',
        content:
          'A fast site means better user experience and higher SEO rankings. Focus on the three Core Web Vitals that Google measures.',
        table: {
          headers: ['Metric', 'What It Measures', 'Target'],
          rows: [
            ['LCP', 'Largest Contentful Paint — loading speed', '< 2.5 seconds'],
            ['FID', 'First Input Delay — interactivity', '< 100 ms'],
            ['CLS', 'Cumulative Layout Shift — visual stability', '< 0.1'],
          ],
        },
        cards: [
          { title: 'Code Splitting', description: 'React.lazy() loads pages on demand', icon: '✂️', color: 'blue' },
          { title: 'Image Optimization', description: 'WebP/AVIF formats, lazy loading', icon: '🖼️', color: 'purple' },
          { title: 'Caching', description: 'Cache-Control headers for static assets', icon: '💾', color: 'emerald' },
          { title: 'Bundle Analysis', description: 'Find large deps with visualizer', icon: '📊', color: 'amber' },
        ],
        code: [
          {
            language: 'tsx',
            label: 'Lazy loading a route',
            code: `import { lazy, Suspense } from "react";\n\n// Load the component only when needed\nconst Dashboard = lazy(() => import("./pages/Dashboard"));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Dashboard />\n    </Suspense>\n  );\n}`,
          },
        ],
        keyTakeaway:
          'Optimize for Core Web Vitals with code splitting, image optimization, and proper caching. Use Lighthouse to measure.',
      },
    ],
    commonMistakes: [
      { mistake: 'Committing .env files with secrets to version control', explanation: 'Anyone with repo access can see your API keys. Add .env.local to .gitignore and use platform env vars for production.' },
      { mistake: 'Not code-splitting large pages', explanation: 'Shipping one giant bundle means users download code for pages they never visit. Use React.lazy() for route-based splitting.' },
      { mistake: 'Ignoring build warnings', explanation: 'TypeScript errors, unused imports, and large bundle warnings often indicate real problems. Fix them before deploying.' },
      { mistake: 'Forgetting to set environment variables in production', explanation: 'Your app works locally because of .env.local, but the production build has no env vars unless you set them in Vercel/Netlify.' },
    ],
    practiceQuestions: [
      'Explain the difference between development and production builds. What optimizations does a production build apply?',
      'How do environment variables work in Vite? Why must they be prefixed with VITE_?',
      'Set up a Vite project with React and TypeScript, then deploy it to Vercel.',
      'What is tree-shaking and how does it reduce bundle size?',
      'Use React.lazy and Suspense to lazy-load a page component.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What does tree-shaking do during the build process?',
        options: [
          'Compiles TypeScript to JavaScript',
          'Removes unused code from the final bundle',
          'Minifies variable names',
          'Splits code into multiple files',
        ],
        answer: 'Removes unused code from the final bundle',
        explanation: 'Tree-shaking analyzes import/export statements and eliminates code that is never used, reducing the final bundle size.',
      },
      {
        type: 'short-answer',
        question: 'What prefix must environment variables have in Vite to be exposed to the frontend?',
        answer: 'VITE_',
        explanation: 'Vite only exposes environment variables prefixed with VITE_ to the client-side bundle. This prevents accidentally leaking server-side secrets.',
      },
      {
        type: 'mcq',
        question: 'Which React API is used to lazy-load a component?',
        options: ['React.memo()', 'React.lazy()', 'React.createRef()', 'React.forwardRef()'],
        answer: 'React.lazy()',
        explanation: 'React.lazy() accepts a function that calls a dynamic import() and returns a component. It must be wrapped in a <Suspense> component with a fallback.',
      },
      {
        type: 'mcq',
        question: 'Which Core Web Vital measures how quickly the largest visible element loads?',
        options: ['FID', 'CLS', 'LCP', 'TTFB'],
        answer: 'LCP',
        explanation: 'LCP (Largest Contentful Paint) measures when the largest content element becomes visible. Google recommends keeping it under 2.5 seconds.',
      },
      {
        type: 'short-answer',
        question: 'What build tool uses native ES modules for instant dev server startup and Rollup for production builds?',
        answer: 'Vite',
        explanation: 'Vite leverages native ES modules during development for instant cold starts and uses Rollup under the hood for optimized production bundling.',
      },
    ],
  },
};
