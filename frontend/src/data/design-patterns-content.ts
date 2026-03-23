import type { LessonStep } from '@/lib/learn-data';

export const designPatternsLessons: Record<string, {
  steps: LessonStep[];
  commonMistakes?: { mistake: string; explanation: string }[];
  practiceQuestions?: string[];
}> = {
  /* ──────────────────────────────────────────────
     1. WHAT ARE DESIGN PATTERNS?
     ────────────────────────────────────────────── */
  'what-are-design-patterns': {
    steps: [
      {
        title: 'Why Do We Need Design Patterns?',
        content:
          'Every experienced developer eventually faces the same recurring problems — how to create objects flexibly, how to structure communication between components, how to add behavior without modifying existing code. **Design patterns** are proven, reusable solutions to these common problems.',
        analogy:
          'Think of design patterns like architectural blueprints for houses. You would not reinvent plumbing from scratch every time you build a house — you use proven designs. Similarly, design patterns are battle-tested solutions that thousands of developers have refined over decades.',
        cards: [
          { title: 'Reusability', description: 'Apply proven solutions instead of reinventing the wheel for every new project.', icon: '♻️', color: 'emerald' },
          { title: 'Communication', description: 'Shared vocabulary lets developers discuss designs quickly and precisely.', icon: '💬', color: 'blue' },
          { title: 'Best Practices', description: 'Patterns encode decades of collective experience from expert developers.', icon: '✅', color: 'amber' },
          { title: 'Maintainability', description: 'Well-structured code is easier to read, extend, and debug over time.', icon: '🔧', color: 'purple' },
        ],
        keyTakeaway:
          'Design patterns are reusable solutions to recurring software design problems.',
      },
      {
        title: 'The Gang of Four (GoF)',
        content:
          'In 1994, four authors — Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides — published *Design Patterns: Elements of Reusable Object-Oriented Software*. This book cataloged 23 patterns and became one of the most influential programming books ever written. The authors are known as the **Gang of Four (GoF)**.',
        bullets: [
          'Published in 1994, still relevant 30+ years later',
          'Cataloged 23 classic patterns in three categories',
          'Used C++ and Smalltalk examples, but concepts apply to any OOP language',
          'Established a shared vocabulary for software developers worldwide',
        ],
        keyTakeaway:
          'The Gang of Four book defined 23 design patterns that remain the foundation of software design.',
      },
      {
        title: 'Three Categories of Patterns',
        content:
          'The 23 GoF patterns are organized into three categories based on their purpose. Each category solves a different class of design problems.',
        cards: [
          { title: 'Creational', description: 'Control how objects are created. Singleton, Factory, Abstract Factory, Builder, Prototype.', icon: '🏭', color: 'blue' },
          { title: 'Structural', description: 'Control how objects are composed. Adapter, Decorator, Facade, Proxy, Composite, Bridge, Flyweight.', icon: '🏗️', color: 'emerald' },
          { title: 'Behavioral', description: 'Control how objects communicate. Observer, Strategy, Command, State, Template Method, Iterator, and more.', icon: '🔄', color: 'purple' },
        ],
        keyTakeaway:
          'Creational patterns handle object creation, structural patterns handle composition, and behavioral patterns handle communication.',
      },
      {
        title: 'Anatomy of a Design Pattern',
        content:
          'Every design pattern has four essential elements that make it a complete solution.',
        flow: [
          { label: 'Name', description: 'A shared vocabulary term (e.g., "Observer")' },
          { label: 'Problem', description: 'The recurring design issue it addresses' },
          { label: 'Solution', description: 'The class/object structure and relationships' },
          { label: 'Consequences', description: 'Trade-offs, pros, and cons of using the pattern' },
        ],
        keyTakeaway:
          'A pattern is defined by its name, the problem it solves, the solution structure, and the trade-offs involved.',
      },
      {
        title: 'When to Use (and Not Use) Patterns',
        content:
          'Patterns are powerful tools, but overusing them leads to unnecessarily complex code. Apply a pattern only when you have a clear, recurring problem that the pattern solves.',
        comparison: {
          leftTitle: 'Use Patterns When',
          rightTitle: 'Avoid Patterns When',
          leftColor: 'emerald',
          rightColor: 'red',
          items: [
            { left: 'You face a known recurring problem', right: 'The problem is simple and unique' },
            { left: 'The codebase needs to scale', right: 'You are writing a quick script or prototype' },
            { left: 'Multiple developers work on the code', right: 'Adding a pattern makes code harder to read' },
            { left: 'You need flexibility for future changes', right: 'YAGNI — You Aren\'t Gonna Need It' },
          ],
        },
        keyTakeaway:
          'Apply patterns to solve real problems, not to show off. Simplicity beats cleverness.',
      },
      {
        title: 'Patterns We Will Cover',
        content:
          'In this course, we cover the most commonly used and interview-relevant design patterns. Each lesson includes real-world analogies, class diagrams, and code in TypeScript and Python.',
        table: {
          headers: ['Pattern', 'Category', 'Key Idea'],
          rows: [
            ['Singleton', 'Creational', 'Exactly one instance'],
            ['Factory Method', 'Creational', 'Delegate object creation to subclasses'],
            ['Abstract Factory', 'Creational', 'Families of related objects'],
            ['Builder', 'Creational', 'Step-by-step construction'],
            ['Observer', 'Behavioral', 'Event-driven notifications'],
            ['Strategy', 'Behavioral', 'Swappable algorithms'],
            ['Decorator', 'Structural', 'Add behavior dynamically'],
            ['Adapter', 'Structural', 'Bridge incompatible interfaces'],
            ['Command', 'Behavioral', 'Encapsulate actions as objects'],
            ['Template Method', 'Behavioral', 'Define skeleton, defer steps'],
            ['State', 'Behavioral', 'Behavior changes with state'],
            ['Facade', 'Structural', 'Simple interface for complex system'],
          ],
        },
        keyTakeaway:
          'We cover 12 essential patterns across all three categories — the most interview-relevant ones.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using patterns everywhere "just in case"',
        explanation:
          'Over-engineering with patterns adds complexity without benefit. Apply a pattern only when you have a clear problem it solves.',
      },
      {
        mistake: 'Memorizing pattern names without understanding the problem',
        explanation:
          'Knowing the name "Observer" is useless if you cannot explain when and why to use it. Focus on the problem each pattern solves.',
      },
      {
        mistake: 'Thinking patterns are language-specific',
        explanation:
          'Patterns are language-agnostic concepts. The implementation syntax changes, but the design idea applies to any OOP language.',
      },
    ],
    practiceQuestions: [
      'Name the three categories of design patterns and give one example from each.',
      'What are the four elements that define a design pattern?',
      'Explain why the Gang of Four book is still relevant today.',
      'When should you avoid using a design pattern?',
      'What is the difference between a design pattern and an algorithm?',
    ],
  },

  /* ──────────────────────────────────────────────
     2. SINGLETON PATTERN
     ────────────────────────────────────────────── */
  'singleton-pattern': {
    steps: [
      {
        title: 'The Problem: Only One Instance Allowed',
        content:
          'Some objects should exist exactly once in your entire application — a database connection pool, a configuration manager, a logging service. Creating multiple instances would waste resources or cause inconsistencies.',
        analogy:
          'Think of a country\'s president. There is exactly one president at any time. You cannot have two presidents giving conflicting orders. A Singleton is the "president" of its class — one and only one instance.',
        keyTakeaway:
          'Singleton ensures a class has exactly one instance and provides global access to it.',
      },
      {
        title: 'How It Works',
        content:
          'The Singleton pattern uses three key techniques to enforce single-instance behavior.',
        flow: [
          { label: 'Private Constructor', description: 'Prevent direct instantiation with new' },
          { label: 'Static Instance', description: 'Store the single instance as a class variable' },
          { label: 'Public Accessor', description: 'Provide a getInstance() method to get the instance' },
        ],
        keyTakeaway:
          'Private constructor + static instance + public accessor = Singleton.',
      },
      {
        title: 'Implementation',
        content:
          'Here is the classic Singleton in TypeScript and Python. Notice how the constructor is effectively blocked from external callers.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `class DatabaseConnection {
  // Static variable holds the single instance
  private static instance: DatabaseConnection | null = null;

  private connectionString: string;

  // Private constructor — cannot call "new" from outside
  private constructor(connectionString: string) {
    this.connectionString = connectionString;
    console.log('Connecting to database...');
  }

  // Public static method — the only way to get the instance
  static getInstance(connectionString: string = 'default'): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(connectionString);
    }
    return DatabaseConnection.instance;
  }

  query(sql: string): string {
    return \`Executing "\${sql}" on \${this.connectionString}\`;
  }
}

// Usage
const db1 = DatabaseConnection.getInstance('postgres://localhost/mydb');
const db2 = DatabaseConnection.getInstance(); // returns same instance
console.log(db1 === db2); // true — same object`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class DatabaseConnection:
    _instance = None  # class variable holds the single instance

    def __new__(cls, connection_string="default"):
        """Override __new__ to control instance creation."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.connection_string = connection_string
            print("Connecting to database...")
        return cls._instance

    def query(self, sql: str) -> str:
        return f'Executing "{sql}" on {self.connection_string}'

# Usage
db1 = DatabaseConnection("postgres://localhost/mydb")
db2 = DatabaseConnection()  # returns same instance
print(db1 is db2)  # True — same object`,
          },
        ],
        diagram: `┌─────────────────────────┐
│     Singleton           │
├─────────────────────────┤
│ - instance: Singleton   │
├─────────────────────────┤
│ - constructor()         │
│ + getInstance(): Self   │
│ + doWork(): void        │
└─────────────────────────┘`,
        keyTakeaway:
          'The constructor is private (or overridden). A static method creates the instance on first call and returns it on subsequent calls.',
      },
      {
        title: 'Thread Safety',
        content:
          'In multithreaded environments, two threads could simultaneously check that the instance is null and both create one. Solutions include eager initialization or double-checked locking.',
        comparison: {
          leftTitle: 'Lazy (Not Thread-Safe)',
          rightTitle: 'Eager (Thread-Safe)',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Instance created on first access', right: 'Instance created at class load time' },
            { left: 'Race condition possible', right: 'No race condition' },
            { left: 'Saves memory if never used', right: 'Uses memory even if never accessed' },
            { left: 'Needs locking for thread safety', right: 'Inherently thread-safe' },
          ],
        },
        keyTakeaway:
          'In multithreaded code, use eager initialization or double-checked locking to avoid creating duplicate instances.',
      },
      {
        title: 'Real-World Use Cases',
        content:
          'Singletons appear everywhere in real software systems.',
        cards: [
          { title: 'Logger', description: 'One logging service writing to a single file or stream.', icon: '📝', color: 'blue' },
          { title: 'Config Manager', description: 'Application configuration loaded once and shared globally.', icon: '⚙️', color: 'amber' },
          { title: 'Connection Pool', description: 'Database connection pool managing a fixed number of connections.', icon: '🗄️', color: 'emerald' },
          { title: 'Cache', description: 'In-memory cache shared across the entire application.', icon: '💨', color: 'purple' },
        ],
        keyTakeaway:
          'Loggers, config managers, connection pools, and caches are classic Singleton use cases.',
      },
      {
        title: 'Pros and Cons',
        content:
          'Singleton is one of the most debated patterns. Know the trade-offs.',
        comparison: {
          leftTitle: 'Pros',
          rightTitle: 'Cons',
          leftColor: 'emerald',
          rightColor: 'red',
          items: [
            { left: 'Guarantees single instance', right: 'Introduces global state' },
            { left: 'Lazy initialization saves memory', right: 'Hard to unit test (tight coupling)' },
            { left: 'Easy global access', right: 'Violates Single Responsibility Principle' },
            { left: 'Controlled access to shared resource', right: 'Can hide dependencies' },
          ],
        },
        keyTakeaway:
          'Use Singleton sparingly — it is useful for shared resources but can make testing and maintenance harder.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using Singleton as a global variable replacement',
        explanation:
          'Singleton should control instance creation, not serve as a dump for global state. If you just need shared data, consider dependency injection.',
      },
      {
        mistake: 'Forgetting thread safety in multithreaded environments',
        explanation:
          'Without synchronization, multiple threads can create separate instances, defeating the purpose of Singleton.',
      },
      {
        mistake: 'Making everything a Singleton',
        explanation:
          'Only classes that truly need exactly one instance should be Singletons. Overuse leads to tightly coupled, untestable code.',
      },
    ],
    practiceQuestions: [
      'Implement a thread-safe Singleton Logger class.',
      'What happens if you serialize and deserialize a Singleton? How do you prevent it?',
      'Why is Singleton considered an anti-pattern by some developers?',
      'How would you unit test a class that depends on a Singleton?',
      'Compare Singleton with static classes — when would you prefer one over the other?',
    ],
  },

  /* ──────────────────────────────────────────────
     3. FACTORY METHOD PATTERN
     ────────────────────────────────────────────── */
  'factory-method-pattern': {
    steps: [
      {
        title: 'The Problem: Hardcoded Object Creation',
        content:
          'When your code uses `new ConcreteClass()` directly, it creates a tight coupling. If you need a different class later, you must change every place that creates it. The Factory Method pattern solves this by delegating creation to subclasses.',
        analogy:
          'Imagine a restaurant kitchen. The menu says "burger" but does not specify which chef makes it. The kitchen (factory) decides. If you hire a new chef with a different recipe, the menu (client code) does not change.',
        keyTakeaway:
          'Factory Method defines an interface for creating objects but lets subclasses decide which class to instantiate.',
      },
      {
        title: 'Structure',
        content:
          'The pattern has four participants that work together.',
        flow: [
          { label: 'Product', description: 'Interface that all created objects implement' },
          { label: 'ConcreteProduct', description: 'Specific implementation of the product' },
          { label: 'Creator', description: 'Declares the factory method (returns Product)' },
          { label: 'ConcreteCreator', description: 'Overrides factory method to return a ConcreteProduct' },
        ],
        diagram: `┌─────────────┐         ┌─────────────┐
│   Creator   │         │   Product   │
│─────────────│         │  (interface)│
│ factoryMethod()───────▶             │
└──────┬──────┘         └──────┬──────┘
       │                       │
       ▼                       ▼
┌──────────────┐       ┌──────────────┐
│ConcreteCreator│       │ConcreteProduct│
│──────────────│       │──────────────│
│factoryMethod()│──────▶│              │
└──────────────┘       └──────────────┘`,
        keyTakeaway:
          'Creator declares a factory method; ConcreteCreator overrides it to instantiate a specific product.',
      },
      {
        title: 'Implementation',
        content:
          'Here is a notification system where the factory method decides which type of notification to create.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Product interface
interface Notification {
  send(message: string): void;
}

// Concrete Products
class EmailNotification implements Notification {
  send(message: string) {
    console.log(\`Email: \${message}\`);
  }
}

class SMSNotification implements Notification {
  send(message: string) {
    console.log(\`SMS: \${message}\`);
  }
}

class PushNotification implements Notification {
  send(message: string) {
    console.log(\`Push: \${message}\`);
  }
}

// Creator (abstract)
abstract class NotificationService {
  // Factory Method — subclasses decide what to create
  abstract createNotification(): Notification;

  // Template logic that uses the factory method
  notify(message: string) {
    const notification = this.createNotification();
    notification.send(message);
  }
}

// Concrete Creators
class EmailService extends NotificationService {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

class SMSService extends NotificationService {
  createNotification(): Notification {
    return new SMSNotification();
  }
}

// Usage — client code works with the abstract Creator
const service: NotificationService = new EmailService();
service.notify("Your order shipped!"); // Email: Your order shipped!`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

# Product interface
class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...

# Concrete Products
class EmailNotification(Notification):
    def send(self, message: str):
        print(f"Email: {message}")

class SMSNotification(Notification):
    def send(self, message: str):
        print(f"SMS: {message}")

# Creator (abstract)
class NotificationService(ABC):
    @abstractmethod
    def create_notification(self) -> Notification: ...

    def notify(self, message: str):
        notification = self.create_notification()
        notification.send(message)

# Concrete Creators
class EmailService(NotificationService):
    def create_notification(self) -> Notification:
        return EmailNotification()

class SMSService(NotificationService):
    def create_notification(self) -> Notification:
        return SMSNotification()

# Usage
service: NotificationService = EmailService()
service.notify("Your order shipped!")  # Email: Your order shipped!`,
          },
        ],
        diagram: `┌───────────────┐       ┌───────────────┐
│   Creator     │       │   Product     │
│  (abstract)   │       │  (interface)  │
├───────────────┤       ├───────────────┤
│ + create()    │──────►│ + use()       │
└───────┬───────┘       └───────┬───────┘
        │                       │
   ┌────┴────┐             ┌────┴────┐
   │ CreatorA │             │ProductA │
   │ CreatorB │             │ProductB │
   └─────────┘             └─────────┘`,
        keyTakeaway:
          'The client works with the Creator interface. Swapping implementations requires zero changes to client code.',
      },
      {
        title: 'When to Use Factory Method',
        content:
          'Factory Method shines when you need to decouple object creation from usage.',
        bullets: [
          'You do not know the exact types and dependencies of objects beforehand',
          'You want to provide users of your library a way to extend its internal components',
          'You want to reuse existing objects instead of rebuilding them each time',
          'Your code should work with any class that implements a common interface',
        ],
        table: {
          headers: ['Scenario', 'Use Factory?', 'Why'],
          rows: [
            ['Unknown concrete type at compile time', 'Yes', 'Factory lets subclasses decide the type at runtime'],
            ['Library or framework extensibility', 'Yes', 'Users can extend by subclassing the creator'],
            ['Only one product type, never changes', 'No', 'Simple constructor is sufficient — no need for abstraction'],
            ['Object reuse (pooling, caching)', 'Yes', 'Factory can return cached instances instead of always creating new ones'],
          ],
        },
        keyTakeaway:
          'Use Factory Method when the exact type to create is determined at runtime or by subclasses.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Confusing Factory Method with Simple Factory',
        explanation:
          'A Simple Factory is just a function that creates objects. Factory Method uses inheritance — a subclass overrides the creation method. They are different patterns.',
      },
      {
        mistake: 'Creating a factory for only one product type',
        explanation:
          'If there is only one concrete product, a factory method adds unnecessary complexity. Use it when you genuinely need polymorphic creation.',
      },
    ],
    practiceQuestions: [
      'Implement a Factory Method for a document editor that creates different document types (PDF, Word, HTML).',
      'How does Factory Method differ from Abstract Factory?',
      'When would you choose a Simple Factory over Factory Method?',
      'Draw the UML class diagram for Factory Method with a logistics example (Truck vs Ship).',
    ],
  },

  /* ──────────────────────────────────────────────
     4. ABSTRACT FACTORY PATTERN
     ────────────────────────────────────────────── */
  'abstract-factory-pattern': {
    steps: [
      {
        title: 'The Problem: Families of Related Objects',
        content:
          'Sometimes you need to create groups of related objects that must be consistent with each other. A UI toolkit, for example, must create buttons, checkboxes, and text fields that all belong to the same visual theme. The Abstract Factory pattern provides an interface for creating families of related objects.',
        analogy:
          'Think of a furniture store. When you buy a "Modern" set, you get a modern chair, modern table, and modern sofa — all matching. You do not mix a Victorian chair with a modern table. Abstract Factory ensures all objects in a family are compatible.',
        keyTakeaway:
          'Abstract Factory creates families of related objects without specifying their concrete classes.',
      },
      {
        title: 'Structure',
        content:
          'Abstract Factory introduces two parallel hierarchies — one for factories and one for products.',
        diagram: `┌──────────────────┐
│ AbstractFactory  │
│──────────────────│
│ createButton()   │
│ createCheckbox() │
└────┬─────────┬───┘
     │         │
     ▼         ▼
┌─────────┐ ┌─────────┐
│ WinFactory│ │ MacFactory│
│ createButton()│ │ createButton()│
│ createCheckbox()│ │ createCheckbox()│
└─────────┘ └─────────┘
     │              │
     ▼              ▼
 WinButton      MacButton
 WinCheckbox    MacCheckbox`,
        keyTakeaway:
          'Each concrete factory produces a complete family of compatible products.',
      },
      {
        title: 'Implementation',
        content:
          'Here is a cross-platform UI framework example where the factory produces themed components.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Abstract products
interface Button {
  render(): string;
}
interface Checkbox {
  check(): string;
}

// Concrete products — Windows family
class WindowsButton implements Button {
  render() { return '[Windows Button]'; }
}
class WindowsCheckbox implements Checkbox {
  check() { return '[Windows Checkbox ✓]'; }
}

// Concrete products — Mac family
class MacButton implements Button {
  render() { return '[Mac Button]'; }
}
class MacCheckbox implements Checkbox {
  check() { return '[Mac Checkbox ✓]'; }
}

// Abstract Factory
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Concrete Factories
class WindowsFactory implements UIFactory {
  createButton() { return new WindowsButton(); }
  createCheckbox() { return new WindowsCheckbox(); }
}
class MacFactory implements UIFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}

// Client — works with any factory
function buildUI(factory: UIFactory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  console.log(button.render(), checkbox.check());
}

buildUI(new MacFactory()); // [Mac Button] [Mac Checkbox ✓]`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...

class Checkbox(ABC):
    @abstractmethod
    def check(self) -> str: ...

class WindowsButton(Button):
    def render(self): return "[Windows Button]"

class MacButton(Button):
    def render(self): return "[Mac Button]"

class WindowsCheckbox(Checkbox):
    def check(self): return "[Windows Checkbox]"

class MacCheckbox(Checkbox):
    def check(self): return "[Mac Checkbox]"

class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...
    @abstractmethod
    def create_checkbox(self) -> Checkbox: ...

class WindowsFactory(UIFactory):
    def create_button(self): return WindowsButton()
    def create_checkbox(self): return WindowsCheckbox()

class MacFactory(UIFactory):
    def create_button(self): return MacButton()
    def create_checkbox(self): return MacCheckbox()

def build_ui(factory: UIFactory):
    btn = factory.create_button()
    cb = factory.create_checkbox()
    print(btn.render(), cb.check())

build_ui(MacFactory())  # [Mac Button] [Mac Checkbox]`,
          },
        ],
        diagram: `┌──────────────────────┐
│   AbstractFactory    │
│──────────────────────│
│ + createButton()     │
│ + createCheckbox()   │
└──────┬───────────┬───┘
       │           │
       ▼           ▼
┌────────────┐ ┌────────────┐
│ WinFactory │ │ MacFactory │
└──────┬─────┘ └──────┬─────┘
       │               │
       ▼               ▼
  WinButton        MacButton
  WinCheckbox      MacCheckbox
  (Family A)       (Family B)`,
        keyTakeaway:
          'The client code works exclusively with abstract interfaces. Swapping the factory switches the entire product family.',
      },
      {
        title: 'Factory Method vs Abstract Factory',
        content:
          'These two patterns are often confused. Here is a clear comparison.',
        comparison: {
          leftTitle: 'Factory Method',
          rightTitle: 'Abstract Factory',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Creates ONE product', right: 'Creates FAMILIES of products' },
            { left: 'Uses inheritance (subclass overrides)', right: 'Uses composition (factory object)' },
            { left: 'Single factory method', right: 'Multiple factory methods per factory' },
            { left: 'Focus: defer creation to subclass', right: 'Focus: ensure product compatibility' },
          ],
        },
        keyTakeaway:
          'Factory Method creates one product via inheritance; Abstract Factory creates families of products via composition.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Mixing products from different factories',
        explanation:
          'The whole point of Abstract Factory is to ensure consistency. Mixing a WindowsButton with a MacCheckbox defeats the purpose.',
      },
      {
        mistake: 'Using Abstract Factory when you only have one product type',
        explanation:
          'If you only create one kind of object, Factory Method or Simple Factory is sufficient. Abstract Factory is for families.',
      },
    ],
    practiceQuestions: [
      'Design an Abstract Factory for a game that supports multiple themes (Fantasy, Sci-Fi) with characters, weapons, and environments.',
      'When would you choose Abstract Factory over Factory Method?',
      'How does Abstract Factory help with the Open/Closed Principle?',
    ],
  },

  /* ──────────────────────────────────────────────
     5. BUILDER PATTERN
     ────────────────────────────────────────────── */
  'builder-pattern': {
    steps: [
      {
        title: 'The Problem: Complex Object Construction',
        content:
          'Some objects have many optional parameters. A constructor with 10 parameters is unreadable, and telescoping constructors (multiple overloads) are unwieldy. The Builder pattern lets you construct complex objects step by step.',
        analogy:
          'Think about ordering a custom pizza. You do not yell all 15 toppings at once. Instead, you say: "start with thin crust, add mozzarella, add pepperoni, add mushrooms, done." The Builder pattern works the same way — one step at a time.',
        comparison: {
          leftTitle: 'Constructor',
          rightTitle: 'Builder Pattern',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'All parameters in one call', right: 'Set properties one at a time' },
            { left: 'Hard to read with many args', right: 'Each method has a descriptive name' },
            { left: 'Must pass null/undefined for optional params', right: 'Only set what you need' },
            { left: 'Order of parameters matters', right: 'Order of method calls does not matter' },
          ],
        },
        keyTakeaway:
          'Builder separates the construction of a complex object from its representation, allowing step-by-step assembly.',
      },
      {
        title: 'The Telescoping Constructor Problem',
        content:
          'Without Builder, you end up with constructors that are impossible to read.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript — The Problem',
            code: `// BAD: Telescoping constructor — what does each parameter mean?
const user = new User(
  "Alice",           // name
  "alice@email.com", // email
  25,                // age
  true,              // isAdmin
  false,             // isVerified
  "dark",            // theme
  "en",              // locale
  true,              // notifications
  undefined,         // avatar — skip this one
  "UTC-5"            // timezone
);
// Which boolean is which? Impossible to read!`,
          },
        ],
        keyTakeaway:
          'Constructors with many parameters are error-prone and hard to read.',
      },
      {
        title: 'The Builder Solution',
        content:
          'Builder provides a fluent API where each method sets one property and returns the builder itself, enabling method chaining.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `class UserBuilder {
  private name: string = '';
  private email: string = '';
  private age: number = 0;
  private isAdmin: boolean = false;
  private theme: string = 'light';
  private locale: string = 'en';

  setName(name: string): this { this.name = name; return this; }
  setEmail(email: string): this { this.email = email; return this; }
  setAge(age: number): this { this.age = age; return this; }
  setAdmin(isAdmin: boolean): this { this.isAdmin = isAdmin; return this; }
  setTheme(theme: string): this { this.theme = theme; return this; }
  setLocale(locale: string): this { this.locale = locale; return this; }

  build(): User {
    return new User(this.name, this.email, this.age,
                    this.isAdmin, this.theme, this.locale);
  }
}

// Usage — crystal clear, any order, skip what you don't need
const user = new UserBuilder()
  .setName("Alice")
  .setEmail("alice@email.com")
  .setAdmin(true)
  .setTheme("dark")
  .build();`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class UserBuilder:
    def __init__(self):
        self._name = ""
        self._email = ""
        self._age = 0
        self._is_admin = False
        self._theme = "light"

    def set_name(self, name: str) -> "UserBuilder":
        self._name = name
        return self

    def set_email(self, email: str) -> "UserBuilder":
        self._email = email
        return self

    def set_admin(self, is_admin: bool) -> "UserBuilder":
        self._is_admin = is_admin
        return self

    def set_theme(self, theme: str) -> "UserBuilder":
        self._theme = theme
        return self

    def build(self) -> "User":
        return User(self._name, self._email, self._age,
                    self._is_admin, self._theme)

# Usage
user = (UserBuilder()
    .set_name("Alice")
    .set_email("alice@email.com")
    .set_admin(True)
    .set_theme("dark")
    .build())`,
          },
        ],
        flow: [
          { label: 'Director', description: 'Orchestrates the build sequence (optional)', icon: '🎯' },
          { label: 'Builder', description: 'Creates the builder instance with defaults', icon: '🏗️' },
          { label: 'Set Part A', description: 'Calls setter methods to configure properties', icon: '🔧' },
          { label: 'Set Part B', description: 'Chains additional configuration methods', icon: '🔧' },
          { label: 'Get Result', description: 'Calls build() to produce the final object', icon: '✅' },
        ],
        keyTakeaway:
          'Builder uses method chaining to construct objects step by step with a readable, flexible API.',
      },
      {
        title: 'Real-World Examples',
        content:
          'Builder is everywhere in popular libraries and frameworks.',
        cards: [
          { title: 'SQL Query Builders', description: 'Knex, Prisma, and Sequelize use builder patterns for queries.', icon: '🗄️', color: 'blue' },
          { title: 'HTTP Requests', description: 'Axios config objects and fetch options follow builder-like construction.', icon: '🌐', color: 'emerald' },
          { title: 'UI Components', description: 'AlertDialog.Builder in Android, SwiftUI modifiers.', icon: '📱', color: 'purple' },
          { title: 'Test Data', description: 'Test fixtures often use builders to create objects with specific states.', icon: '🧪', color: 'amber' },
        ],
        keyTakeaway:
          'You have already used builders — SQL query builders, HTTP clients, and UI frameworks all use this pattern.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using Builder for simple objects with 2-3 properties',
        explanation:
          'Builder adds complexity. If your object only has a few required properties, a simple constructor is fine.',
      },
      {
        mistake: 'Allowing build() to create invalid objects',
        explanation:
          'Always validate required fields in the build() method. A builder that produces incomplete objects defeats its purpose.',
      },
    ],
    practiceQuestions: [
      'Implement a Builder for an HTTP request with method, URL, headers, body, and timeout.',
      'How does the Builder pattern differ from the Factory pattern?',
      'What is the Director in the Builder pattern, and when do you need one?',
      'Implement a Builder with validation that throws if required fields are missing.',
    ],
  },

  /* ──────────────────────────────────────────────
     6. OBSERVER PATTERN
     ────────────────────────────────────────────── */
  'observer-pattern': {
    steps: [
      {
        title: 'The Problem: Keeping Objects in Sync',
        content:
          'Imagine a spreadsheet where changing a cell should update a chart, a summary, and a log. Without a pattern, you would hardcode each update — and adding a new dependent means modifying existing code. The Observer pattern defines a one-to-many dependency so that when one object changes state, all dependents are notified automatically.',
        analogy:
          'Think of a newspaper subscription. The newspaper (subject) publishes new editions. Subscribers (observers) receive them automatically. You can subscribe or unsubscribe at any time without the newspaper needing to know who exactly its readers are.',
        keyTakeaway:
          'Observer defines a one-to-many relationship: when the subject changes, all observers are notified.',
      },
      {
        title: 'Structure',
        content:
          'The Observer pattern has two main roles.',
        diagram: `┌────────────────┐      notifies     ┌──────────────┐
│    Subject     │ ──────────────────▶│   Observer   │
│────────────────│                    │  (interface) │
│ observers[]    │                    │──────────────│
│ subscribe()    │                    │ update()     │
│ unsubscribe()  │                    └──────┬───────┘
│ notify()       │                           │
└────────────────┘                    ┌──────┴───────┐
                                      │   │   │
                                     ChartLog Summary`,
        keyTakeaway:
          'The subject maintains a list of observers and calls update() on each when state changes.',
      },
      {
        title: 'Implementation',
        content:
          'Here is an event system that notifies multiple listeners when something happens.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Observer interface
interface Observer {
  update(event: string, data: unknown): void;
}

// Subject
class EventEmitter {
  private observers: Map<string, Observer[]> = new Map();

  subscribe(event: string, observer: Observer): void {
    const list = this.observers.get(event) ?? [];
    list.push(observer);
    this.observers.set(event, list);
  }

  unsubscribe(event: string, observer: Observer): void {
    const list = this.observers.get(event) ?? [];
    this.observers.set(event, list.filter(o => o !== observer));
  }

  notify(event: string, data: unknown): void {
    const list = this.observers.get(event) ?? [];
    for (const observer of list) {
      observer.update(event, data);
    }
  }
}

// Concrete Observers
class Logger implements Observer {
  update(event: string, data: unknown) {
    console.log(\`[LOG] \${event}: \${JSON.stringify(data)}\`);
  }
}

class Analytics implements Observer {
  update(event: string, data: unknown) {
    console.log(\`[ANALYTICS] Tracking \${event}\`);
  }
}

// Usage
const emitter = new EventEmitter();
emitter.subscribe('user:signup', new Logger());
emitter.subscribe('user:signup', new Analytics());
emitter.notify('user:signup', { email: 'alice@example.com' });`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod
from collections import defaultdict

class Observer(ABC):
    @abstractmethod
    def update(self, event: str, data) -> None: ...

class EventEmitter:
    def __init__(self):
        self._observers: dict[str, list[Observer]] = defaultdict(list)

    def subscribe(self, event: str, observer: Observer):
        self._observers[event].append(observer)

    def unsubscribe(self, event: str, observer: Observer):
        self._observers[event].remove(observer)

    def notify(self, event: str, data):
        for observer in self._observers[event]:
            observer.update(event, data)

class Logger(Observer):
    def update(self, event, data):
        print(f"[LOG] {event}: {data}")

class Analytics(Observer):
    def update(self, event, data):
        print(f"[ANALYTICS] Tracking {event}")

emitter = EventEmitter()
emitter.subscribe("user:signup", Logger())
emitter.subscribe("user:signup", Analytics())
emitter.notify("user:signup", {"email": "alice@example.com"})`,
          },
        ],
        diagram: `┌──────────────────┐
│    Subject       │
│──────────────────│
│ observers: []    │
│ subscribe(obs)   │
│ unsubscribe(obs) │
│ notify()  ───────┼──┐
└──────────────────┘  │
                      │ calls update() on each
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ObserverA │ │ObserverB │ │ObserverC │
    │update()  │ │update()  │ │update()  │
    └──────────┘ └──────────┘ └──────────┘`,
        keyTakeaway:
          'Observers register with the subject. When state changes, the subject iterates over all observers and calls update().',
      },
      {
        title: 'Real-World Examples',
        content:
          'Observer is one of the most widely used patterns in software.',
        bullets: [
          'DOM event listeners: addEventListener / removeEventListener',
          'React state management: Zustand, Redux subscribers',
          'Node.js EventEmitter: the backbone of Node.js',
          'Webhooks: HTTP callbacks that notify external systems',
          'Message queues: Kafka, RabbitMQ consumers',
          'Real-time apps: WebSocket event handling',
        ],
        cards: [
          { title: 'Event Listeners', description: 'DOM addEventListener/removeEventListener follow the observer pattern exactly.', icon: '🖱️', color: 'blue' },
          { title: 'Pub/Sub Systems', description: 'Kafka, RabbitMQ, and Redis Pub/Sub decouple publishers from subscribers.', icon: '📡', color: 'emerald' },
          { title: 'React State', description: 'Zustand, Redux, and MobX notify subscribed components when state changes.', icon: '⚛️', color: 'purple' },
          { title: 'WebSocket Events', description: 'Socket.io emits events to connected clients who have subscribed to channels.', icon: '🔌', color: 'amber' },
        ],
        keyTakeaway:
          'Event listeners, pub/sub systems, webhooks, and reactive state management are all Observer pattern implementations.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to unsubscribe, causing memory leaks',
        explanation:
          'If an observer holds a reference to a destroyed component, it stays in memory. Always unsubscribe when the observer is no longer needed.',
      },
      {
        mistake: 'Creating circular notification chains',
        explanation:
          'If Observer A updates the subject, which notifies Observer B, which updates the subject again — you get infinite loops.',
      },
    ],
    practiceQuestions: [
      'Implement an Observer for a stock price tracker with multiple display widgets.',
      'How does the Observer pattern relate to the Pub/Sub pattern?',
      'What is the difference between push and pull models in Observer?',
      'How would you implement Observer in a functional programming style (without classes)?',
    ],
  },

  /* ──────────────────────────────────────────────
     7. STRATEGY PATTERN
     ────────────────────────────────────────────── */
  'strategy-pattern': {
    steps: [
      {
        title: 'The Problem: Hardcoded Algorithms',
        content:
          'When you have multiple ways to perform an operation (sorting, compression, pricing), using if/else or switch statements to pick the algorithm leads to bloated, hard-to-extend code. Adding a new algorithm means modifying existing code — violating the Open/Closed Principle.',
        analogy:
          'Think of Google Maps navigation. You choose your strategy: driving, walking, cycling, or transit. The map app does not change — only the route calculation algorithm swaps out. That is the Strategy pattern.',
        keyTakeaway:
          'Strategy defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.',
      },
      {
        title: 'Before and After Strategy',
        content:
          'Compare the messy if/else approach with the clean Strategy pattern.',
        comparison: {
          leftTitle: 'Without Strategy (if/else)',
          rightTitle: 'With Strategy Pattern',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Giant switch/if-else blocks', right: 'Each algorithm in its own class' },
            { left: 'Adding new algorithm = modify existing code', right: 'Adding new algorithm = add new class' },
            { left: 'Violates Open/Closed Principle', right: 'Follows Open/Closed Principle' },
            { left: 'Hard to unit test individual algorithms', right: 'Each strategy is independently testable' },
          ],
        },
        keyTakeaway:
          'Strategy replaces conditional logic with polymorphism — each algorithm is a separate, swappable class.',
      },
      {
        title: 'Implementation',
        content:
          'Here is a payment processing system where the strategy determines how a payment is processed.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Strategy interface
interface PaymentStrategy {
  pay(amount: number): string;
}

// Concrete Strategies
class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}
  pay(amount: number) {
    return \`Paid $\${amount} via Credit Card ending \${this.cardNumber.slice(-4)}\`;
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}
  pay(amount: number) {
    return \`Paid $\${amount} via PayPal (\${this.email})\`;
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}
  pay(amount: number) {
    return \`Paid $\${amount} via Crypto to \${this.walletAddress.slice(0, 8)}...\`;
  }
}

// Context — uses a strategy, doesn't know the details
class ShoppingCart {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setPaymentMethod(strategy: PaymentStrategy) {
    this.strategy = strategy; // swap at runtime
  }

  checkout(amount: number): string {
    return this.strategy.pay(amount);
  }
}

// Usage
const cart = new ShoppingCart(new CreditCardPayment("4111111111111234"));
console.log(cart.checkout(99.99));

cart.setPaymentMethod(new PayPalPayment("alice@email.com"));
console.log(cart.checkout(49.99));`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> str: ...

class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number: str):
        self.card_number = card_number

    def pay(self, amount: float) -> str:
        return f"Paid \${amount} via Credit Card ending {self.card_number[-4:]}"

class PayPalPayment(PaymentStrategy):
    def __init__(self, email: str):
        self.email = email

    def pay(self, amount: float) -> str:
        return f"Paid \${amount} via PayPal ({self.email})"

class ShoppingCart:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def set_payment_method(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def checkout(self, amount: float) -> str:
        return self._strategy.pay(amount)

cart = ShoppingCart(CreditCardPayment("4111111111111234"))
print(cart.checkout(99.99))
cart.set_payment_method(PayPalPayment("alice@email.com"))
print(cart.checkout(49.99))`,
          },
        ],
        keyTakeaway:
          'The context holds a reference to a strategy interface. You can swap strategies at runtime without changing the context.',
      },
      {
        title: 'Strategy vs if/else — When to Refactor',
        content:
          'Not every conditional needs Strategy. Use it when algorithms are complex, reusable, and likely to grow.',
        bullets: [
          'If you have 2-3 simple conditions that will not change, if/else is fine',
          'If new algorithms are added frequently, use Strategy',
          'If algorithms have complex logic worth unit testing, use Strategy',
          'If the same algorithm is used in multiple places, use Strategy',
        ],
        keyTakeaway:
          'Use Strategy when algorithms are complex, independently testable, or frequently changing.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Over-abstracting simple conditions into Strategy',
        explanation:
          'A two-line if/else does not need its own class hierarchy. Strategy is for non-trivial, swappable behaviors.',
      },
      {
        mistake: 'Confusing Strategy with State pattern',
        explanation:
          'Strategy swaps algorithms chosen by the client. State changes behavior automatically based on internal state. The trigger is different.',
      },
    ],
    practiceQuestions: [
      'Implement a Strategy pattern for different sorting algorithms (bubble, merge, quick).',
      'How does Strategy relate to the Open/Closed Principle?',
      'Refactor a discount calculator with if/else branches into the Strategy pattern.',
      'Compare Strategy pattern with first-class functions in JavaScript/Python — when would you prefer classes?',
    ],
  },

  /* ──────────────────────────────────────────────
     8. DECORATOR PATTERN
     ────────────────────────────────────────────── */
  'decorator-pattern': {
    steps: [
      {
        title: 'The Problem: Adding Behavior Without Modifying Classes',
        content:
          'You want to add features to an object dynamically — logging, caching, encryption, compression — without modifying its class. Inheritance creates rigid hierarchies; you cannot mix and match features at runtime. The Decorator pattern wraps objects to add behavior dynamically.',
        analogy:
          'Think of a coffee order. You start with plain coffee, then add milk (decorator), then add sugar (decorator), then add whipped cream (decorator). Each addition wraps the previous drink, adding cost and description. The base coffee never changes.',
        keyTakeaway:
          'Decorator attaches additional responsibilities to an object dynamically by wrapping it.',
      },
      {
        title: 'Why Not Inheritance?',
        content:
          'Inheritance seems like it should work, but it creates an explosion of subclasses.',
        comparison: {
          leftTitle: 'Inheritance Approach',
          rightTitle: 'Decorator Approach',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'CoffeeWithMilk, CoffeeWithSugar, CoffeeWithMilkAndSugar...', right: 'Coffee + MilkDecorator + SugarDecorator' },
            { left: 'N features = 2^N subclasses', right: 'N features = N decorator classes' },
            { left: 'Fixed at compile time', right: 'Combined at runtime' },
            { left: 'Cannot remove features', right: 'Can add/remove dynamically' },
          ],
        },
        keyTakeaway:
          'Decorators grow linearly with features; inheritance grows exponentially.',
      },
      {
        title: 'Implementation',
        content:
          'Here is a data stream that can be decorated with encryption and compression.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Component interface
interface DataSource {
  write(data: string): string;
  read(): string;
}

// Base component
class FileDataSource implements DataSource {
  private data: string = '';
  write(data: string) { this.data = data; return \`Written: \${data}\`; }
  read() { return this.data; }
}

// Base Decorator
abstract class DataSourceDecorator implements DataSource {
  constructor(protected wrapped: DataSource) {}
  write(data: string) { return this.wrapped.write(data); }
  read() { return this.wrapped.read(); }
}

// Concrete Decorators
class EncryptionDecorator extends DataSourceDecorator {
  write(data: string) {
    const encrypted = btoa(data); // base64 as simple "encryption"
    return this.wrapped.write(encrypted);
  }
  read() {
    return atob(this.wrapped.read()); // decrypt
  }
}

class CompressionDecorator extends DataSourceDecorator {
  write(data: string) {
    const compressed = \`[compressed]\${data}\`;
    return this.wrapped.write(compressed);
  }
  read() {
    return this.wrapped.read().replace('[compressed]', '');
  }
}

// Usage — stack decorators like layers
let source: DataSource = new FileDataSource();
source = new EncryptionDecorator(source);      // add encryption
source = new CompressionDecorator(source);     // add compression

source.write("Hello, World!");
console.log(source.read()); // "Hello, World!" — transparently decrypted and decompressed`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod
import base64

class DataSource(ABC):
    @abstractmethod
    def write(self, data: str) -> str: ...
    @abstractmethod
    def read(self) -> str: ...

class FileDataSource(DataSource):
    def __init__(self):
        self._data = ""

    def write(self, data: str) -> str:
        self._data = data
        return f"Written: {data}"

    def read(self) -> str:
        return self._data

class DataSourceDecorator(DataSource):
    def __init__(self, wrapped: DataSource):
        self._wrapped = wrapped

    def write(self, data: str) -> str:
        return self._wrapped.write(data)

    def read(self) -> str:
        return self._wrapped.read()

class EncryptionDecorator(DataSourceDecorator):
    def write(self, data: str) -> str:
        encrypted = base64.b64encode(data.encode()).decode()
        return self._wrapped.write(encrypted)

    def read(self) -> str:
        return base64.b64decode(self._wrapped.read()).decode()

# Stack decorators
source: DataSource = FileDataSource()
source = EncryptionDecorator(source)
source.write("Hello, World!")
print(source.read())  # "Hello, World!"`,
          },
        ],
        keyTakeaway:
          'Each decorator wraps the previous one. They share the same interface, so the client does not know it is decorated.',
      },
      {
        title: 'Real-World Decorator Examples',
        content:
          'The Decorator pattern is baked into many frameworks and languages.',
        bullets: [
          'TypeScript/Python decorators (@decorator syntax) — method wrappers',
          'Java I/O streams: BufferedInputStream(FileInputStream(file))',
          'Express.js middleware: each middleware wraps the next handler',
          'React Higher-Order Components (HOCs): withAuth, withLogging',
          'Logging wrappers around database queries or API calls',
        ],
        keyTakeaway:
          'Middleware chains, I/O stream wrappers, and language decorators are all implementations of the Decorator pattern.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Creating decorators that do not implement the full interface',
        explanation:
          'A decorator must pass through all methods it does not modify. Forgetting to delegate breaks the chain.',
      },
      {
        mistake: 'Stacking too many decorators, making debugging hard',
        explanation:
          'Each layer adds indirection. Use decorators judiciously and add logging to track the chain when debugging.',
      },
    ],
    practiceQuestions: [
      'Implement a coffee shop system with decorators for milk, sugar, whipped cream, and caramel.',
      'How does Decorator differ from Proxy pattern?',
      'Implement a logging decorator for a REST API service class.',
      'Why is Decorator preferred over inheritance for adding cross-cutting concerns?',
    ],
  },

  /* ──────────────────────────────────────────────
     9. ADAPTER PATTERN
     ────────────────────────────────────────────── */
  'adapter-pattern': {
    steps: [
      {
        title: 'The Problem: Incompatible Interfaces',
        content:
          'You have existing code that works with one interface, but a new library or service provides a different interface. Rewriting either side is expensive and risky. The Adapter pattern creates a bridge between the two incompatible interfaces.',
        analogy:
          'Think of a power adapter when you travel abroad. Your laptop charger has a US plug but the wall socket is European. The adapter converts one plug format to another without changing either the laptop or the wall socket.',
        keyTakeaway:
          'Adapter converts the interface of a class into another interface that clients expect.',
      },
      {
        title: 'Structure',
        content:
          'The Adapter sits between the client and the incompatible service, translating calls.',
        diagram: `┌────────┐     ┌─────────┐     ┌──────────────┐
│ Client │────▶│ Adapter │────▶│ Adaptee      │
│        │     │─────────│     │ (incompatible)│
│ uses   │     │translate│     │ interface     │
│ Target │     │ calls   │     │              │
└────────┘     └─────────┘     └──────────────┘`,
        keyTakeaway:
          'The adapter wraps the adaptee and exposes the interface the client expects.',
      },
      {
        title: 'Implementation',
        content:
          'Here is an adapter that makes a third-party XML analytics service work with our JSON-based system.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Target interface — what our code expects
interface AnalyticsService {
  track(event: string, data: Record<string, unknown>): void;
}

// Adaptee — third-party library with a different interface
class LegacyXMLAnalytics {
  sendXML(xmlPayload: string): void {
    console.log(\`Sending XML: \${xmlPayload}\`);
  }
}

// Adapter — bridges JSON to XML
class XMLAnalyticsAdapter implements AnalyticsService {
  private legacyService: LegacyXMLAnalytics;

  constructor(legacyService: LegacyXMLAnalytics) {
    this.legacyService = legacyService;
  }

  track(event: string, data: Record<string, unknown>): void {
    // Convert JSON data to XML format
    const xmlPayload = \`<event name="\${event}">\${
      Object.entries(data)
        .map(([k, v]) => \`<\${k}>\${v}</\${k}>\`)
        .join('')
    }</event>\`;
    this.legacyService.sendXML(xmlPayload);
  }
}

// Usage — client code works with the familiar interface
const analytics: AnalyticsService = new XMLAnalyticsAdapter(
  new LegacyXMLAnalytics()
);
analytics.track('page_view', { url: '/home', userId: '123' });`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

class AnalyticsService(ABC):
    @abstractmethod
    def track(self, event: str, data: dict) -> None: ...

class LegacyXMLAnalytics:
    """Third-party library with incompatible interface."""
    def send_xml(self, xml_payload: str):
        print(f"Sending XML: {xml_payload}")

class XMLAnalyticsAdapter(AnalyticsService):
    """Adapter that converts our JSON calls to XML."""
    def __init__(self, legacy: LegacyXMLAnalytics):
        self._legacy = legacy

    def track(self, event: str, data: dict):
        fields = "".join(f"<{k}>{v}</{k}>" for k, v in data.items())
        xml = f'<event name="{event}">{fields}</event>'
        self._legacy.send_xml(xml)

# Client code — unchanged
analytics: AnalyticsService = XMLAnalyticsAdapter(LegacyXMLAnalytics())
analytics.track("page_view", {"url": "/home", "userId": "123"})`,
          },
        ],
        keyTakeaway:
          'The adapter implements the target interface and internally calls the adaptee, translating between the two formats.',
      },
      {
        title: 'Real-World Adapter Examples',
        content:
          'Adapters are everywhere in real codebases, often hiding behind the word "wrapper."',
        cards: [
          { title: 'ORMs', description: 'Sequelize, Prisma adapt SQL databases to JavaScript objects.', icon: '🗄️', color: 'blue' },
          { title: 'API Wrappers', description: 'SDKs adapt raw HTTP APIs to language-native method calls.', icon: '🌐', color: 'emerald' },
          { title: 'Legacy Migration', description: 'Wrap old services to match new interface contracts.', icon: '🔄', color: 'amber' },
          { title: 'Testing', description: 'Mock adapters replace real services in unit tests.', icon: '🧪', color: 'purple' },
        ],
        keyTakeaway:
          'ORMs, API SDKs, and mock services are all adapters bridging incompatible interfaces.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Putting business logic in the adapter',
        explanation:
          'An adapter should only translate interfaces. Keep business logic in the client or the service, not the adapter.',
      },
      {
        mistake: 'Confusing Adapter with Facade',
        explanation:
          'Adapter makes two incompatible interfaces work together. Facade simplifies a complex subsystem. Different goals.',
      },
    ],
    practiceQuestions: [
      'Implement an adapter that makes a legacy REST API work with a modern GraphQL client.',
      'What is the difference between class adapter and object adapter?',
      'When would you use Adapter vs Facade?',
      'Design an adapter for switching between different payment providers.',
    ],
  },

  /* ──────────────────────────────────────────────
     10. COMMAND PATTERN
     ────────────────────────────────────────────── */
  'command-pattern': {
    steps: [
      {
        title: 'The Problem: Parameterizing Actions',
        content:
          'You want to queue operations, log them, support undo/redo, or decouple the sender from the receiver. Calling methods directly creates tight coupling. The Command pattern encapsulates a request as an object, letting you parameterize, queue, and reverse operations.',
        analogy:
          'Think of a restaurant. The waiter (invoker) writes your order on a slip (command) and gives it to the kitchen (receiver). The waiter does not cook — the slip decouples ordering from cooking. If the order is wrong, the slip can be canceled.',
        keyTakeaway:
          'Command encapsulates a request as an object, enabling undo, queuing, and logging of operations.',
      },
      {
        title: 'Structure',
        content:
          'Command introduces four roles.',
        flow: [
          { label: 'Command', description: 'Interface with execute() and optionally undo()' },
          { label: 'ConcreteCommand', description: 'Implements execute() by calling receiver methods' },
          { label: 'Invoker', description: 'Triggers commands without knowing their internals' },
          { label: 'Receiver', description: 'The actual object that performs the work' },
        ],
        keyTakeaway:
          'The invoker triggers a command object, which delegates to a receiver. None of them know each other directly.',
      },
      {
        title: 'Implementation with Undo/Redo',
        content:
          'Here is a text editor with undo/redo support using the Command pattern.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Command interface
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver
class TextEditor {
  content: string = '';

  insert(text: string, position: number) {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
  }

  delete(position: number, length: number): string {
    const deleted = this.content.slice(position, position + length);
    this.content = this.content.slice(0, position) + this.content.slice(position + length);
    return deleted;
  }
}

// Concrete Command
class InsertCommand implements Command {
  private text: string;
  private position: number;

  constructor(private editor: TextEditor, text: string, position: number) {
    this.text = text;
    this.position = position;
  }

  execute() { this.editor.insert(this.text, this.position); }
  undo() { this.editor.delete(this.position, this.text.length); }
}

// Invoker with undo/redo
class CommandHistory {
  private history: Command[] = [];
  private undone: Command[] = [];

  execute(command: Command) {
    command.execute();
    this.history.push(command);
    this.undone = []; // clear redo stack
  }

  undo() {
    const cmd = this.history.pop();
    if (cmd) { cmd.undo(); this.undone.push(cmd); }
  }

  redo() {
    const cmd = this.undone.pop();
    if (cmd) { cmd.execute(); this.history.push(cmd); }
  }
}

// Usage
const editor = new TextEditor();
const history = new CommandHistory();

history.execute(new InsertCommand(editor, "Hello", 0));
history.execute(new InsertCommand(editor, " World", 5));
console.log(editor.content); // "Hello World"

history.undo();
console.log(editor.content); // "Hello"

history.redo();
console.log(editor.content); // "Hello World"`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...

class TextEditor:
    def __init__(self):
        self.content = ""

    def insert(self, text: str, position: int):
        self.content = self.content[:position] + text + self.content[position:]

    def delete(self, position: int, length: int) -> str:
        deleted = self.content[position:position + length]
        self.content = self.content[:position] + self.content[position + length:]
        return deleted

class InsertCommand(Command):
    def __init__(self, editor: TextEditor, text: str, position: int):
        self._editor = editor
        self._text = text
        self._position = position

    def execute(self): self._editor.insert(self._text, self._position)
    def undo(self): self._editor.delete(self._position, len(self._text))

class CommandHistory:
    def __init__(self):
        self._history: list[Command] = []
        self._undone: list[Command] = []

    def execute(self, cmd: Command):
        cmd.execute()
        self._history.append(cmd)
        self._undone.clear()

    def undo(self):
        if self._history:
            cmd = self._history.pop()
            cmd.undo()
            self._undone.append(cmd)

editor = TextEditor()
history = CommandHistory()
history.execute(InsertCommand(editor, "Hello", 0))
history.execute(InsertCommand(editor, " World", 5))
print(editor.content)  # "Hello World"
history.undo()
print(editor.content)  # "Hello"`,
          },
        ],
        keyTakeaway:
          'Each action is an object with execute() and undo(). A history stack enables unlimited undo/redo.',
      },
      {
        title: 'Real-World Use Cases',
        content:
          'The Command pattern powers many everyday features.',
        cards: [
          { title: 'Undo/Redo', description: 'Text editors, image editors, IDEs — all use command stacks.', icon: '↩️', color: 'blue' },
          { title: 'Task Queues', description: 'Background job processors (Bull, Celery) queue command objects.', icon: '📬', color: 'emerald' },
          { title: 'Macros', description: 'Record a sequence of commands and replay them.', icon: '🎬', color: 'amber' },
          { title: 'Transactions', description: 'Database transactions can be modeled as commands with rollback.', icon: '🔒', color: 'purple' },
        ],
        keyTakeaway:
          'Undo/redo, task queues, macros, and database transactions all use the Command pattern.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Making commands too granular',
        explanation:
          'If every tiny action is a separate command class, the codebase explodes with boilerplate. Group related actions into meaningful commands.',
      },
      {
        mistake: 'Forgetting to implement undo() properly',
        explanation:
          'If undo() does not perfectly reverse execute(), the state becomes corrupted. Always test the round-trip.',
      },
    ],
    practiceQuestions: [
      'Implement a Command pattern for a smart home system (lights, thermostat, music).',
      'How does the Command pattern enable macro recording?',
      'Design a transaction system using commands with commit and rollback.',
      'Compare Command pattern with function callbacks — when would you use each?',
    ],
  },

  /* ──────────────────────────────────────────────
     11. TEMPLATE METHOD PATTERN
     ────────────────────────────────────────────── */
  'template-method-pattern': {
    steps: [
      {
        title: 'The Problem: Same Structure, Different Steps',
        content:
          'Multiple algorithms share the same overall structure but differ in specific steps. Copy-pasting the structure and changing the details leads to duplication. The Template Method defines the skeleton of an algorithm in a base class and lets subclasses override specific steps.',
        analogy:
          'Think of baking. Every recipe follows the same steps: preheat oven, prepare ingredients, mix, bake, serve. But the specifics differ (cake vs cookies). The Template Method is like a recipe card with blanks — the structure is fixed, but you fill in the details.',
        keyTakeaway:
          'Template Method defines the skeleton of an algorithm, deferring specific steps to subclasses.',
      },
      {
        title: 'Structure',
        content:
          'The base class defines the template method (the skeleton) and abstract methods (the hooks) that subclasses fill in.',
        diagram: `┌────────────────────────┐
│   AbstractClass        │
│────────────────────────│
│ templateMethod()       │ ← final, not overridable
│   step1()              │ ← abstract, subclass fills in
│   step2()              │ ← abstract, subclass fills in
│   step3() // optional  │ ← hook with default behavior
└───────────┬────────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
ConcreteClassA   ConcreteClassB
  step1()          step1()
  step2()          step2()`,
        keyTakeaway:
          'The template method calls abstract steps in order. Subclasses provide the step implementations.',
      },
      {
        title: 'Implementation',
        content:
          'Here is a data mining framework where the template method defines the ETL pipeline, and subclasses handle format-specific parsing.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `abstract class DataMiner {
  // Template Method — the fixed algorithm skeleton
  mine(path: string): void {
    const rawData = this.extractData(path);
    const parsed = this.parseData(rawData);
    const analyzed = this.analyzeData(parsed);
    this.generateReport(analyzed);
  }

  // Abstract steps — subclasses MUST implement
  protected abstract extractData(path: string): string;
  protected abstract parseData(rawData: string): Record<string, unknown>[];

  // Concrete steps — shared by all subclasses
  protected analyzeData(data: Record<string, unknown>[]): Record<string, unknown> {
    return { totalRecords: data.length, processedAt: new Date() };
  }

  protected generateReport(analysis: Record<string, unknown>): void {
    console.log('Report:', JSON.stringify(analysis, null, 2));
  }
}

class CSVMiner extends DataMiner {
  protected extractData(path: string): string {
    console.log(\`Reading CSV from \${path}\`);
    return 'name,age\\nAlice,25\\nBob,30';
  }

  protected parseData(rawData: string): Record<string, unknown>[] {
    const [header, ...rows] = rawData.split('\\n');
    const keys = header.split(',');
    return rows.map(row => {
      const values = row.split(',');
      return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    });
  }
}

class JSONMiner extends DataMiner {
  protected extractData(path: string): string {
    console.log(\`Reading JSON from \${path}\`);
    return '[{"name":"Alice","age":25}]';
  }

  protected parseData(rawData: string): Record<string, unknown>[] {
    return JSON.parse(rawData);
  }
}

// Usage
new CSVMiner().mine('/data/users.csv');
new JSONMiner().mine('/data/users.json');`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod
import json

class DataMiner(ABC):
    def mine(self, path: str):
        raw = self.extract_data(path)
        parsed = self.parse_data(raw)
        analysis = self.analyze_data(parsed)
        self.generate_report(analysis)

    @abstractmethod
    def extract_data(self, path: str) -> str: ...

    @abstractmethod
    def parse_data(self, raw_data: str) -> list[dict]: ...

    def analyze_data(self, data: list[dict]) -> dict:
        return {"total_records": len(data)}

    def generate_report(self, analysis: dict):
        print(f"Report: {json.dumps(analysis, indent=2)}")

class CSVMiner(DataMiner):
    def extract_data(self, path: str) -> str:
        print(f"Reading CSV from {path}")
        return "name,age\\nAlice,25\\nBob,30"

    def parse_data(self, raw_data: str) -> list[dict]:
        lines = raw_data.split("\\n")
        keys = lines[0].split(",")
        return [dict(zip(keys, row.split(","))) for row in lines[1:]]

class JSONMiner(DataMiner):
    def extract_data(self, path: str) -> str:
        return '[{"name":"Alice","age":25}]'

    def parse_data(self, raw_data: str) -> list[dict]:
        return json.loads(raw_data)

CSVMiner().mine("/data/users.csv")`,
          },
        ],
        keyTakeaway:
          'The base class owns the algorithm flow. Subclasses only customize the steps they care about.',
      },
      {
        title: 'Template Method vs Strategy',
        content:
          'Both patterns let you vary behavior, but they use different mechanisms.',
        comparison: {
          leftTitle: 'Template Method',
          rightTitle: 'Strategy',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Uses inheritance (override steps)', right: 'Uses composition (inject algorithm)' },
            { left: 'Algorithm skeleton is fixed', right: 'Entire algorithm is replaceable' },
            { left: 'Subclass changes parts of algorithm', right: 'Client swaps the whole algorithm' },
            { left: 'Works at class level', right: 'Works at object level' },
          ],
        },
        keyTakeaway:
          'Template Method varies steps via inheritance; Strategy varies entire algorithms via composition.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Making the template method overridable',
        explanation:
          'The template method should be final/non-virtual. If subclasses can override the skeleton, the whole pattern breaks.',
      },
      {
        mistake: 'Too many abstract steps',
        explanation:
          'If every step is abstract, subclasses end up duplicating code. Provide sensible defaults and only require overriding what varies.',
      },
    ],
    practiceQuestions: [
      'Implement a Template Method for a game AI with fixed turn flow but customizable move logic.',
      'What are "hooks" in the Template Method pattern?',
      'When would you prefer Template Method over Strategy?',
      'Implement a Template Method for report generation (HTML report vs PDF report).',
    ],
  },

  /* ──────────────────────────────────────────────
     12. STATE PATTERN
     ────────────────────────────────────────────── */
  'state-pattern': {
    steps: [
      {
        title: 'The Problem: Behavior That Changes with State',
        content:
          'When an object should behave differently based on its current state, you end up with massive if/else or switch blocks in every method. Adding a new state means touching every method. The State pattern extracts state-specific behavior into separate classes.',
        analogy:
          'Think of a vending machine. Its behavior depends on its state: "idle" (waiting for coins), "has money" (accepting selection), "dispensing" (giving product), "out of stock." Each state responds differently to the same actions (insert coin, select item, dispense).',
        keyTakeaway:
          'State lets an object change its behavior when its internal state changes — it appears to change its class.',
      },
      {
        title: 'Structure',
        content:
          'The context delegates behavior to the current state object.',
        diagram: `┌───────────┐       ┌─────────────┐
│  Context  │──────▶│   State     │
│───────────│       │ (interface) │
│ state     │       │─────────────│
│ request() │       │ handle()    │
└───────────┘       └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                ▼          ▼          ▼
           StateA      StateB     StateC
           handle()    handle()   handle()`,
        keyTakeaway:
          'The context holds a reference to a state object and delegates all state-dependent behavior to it.',
      },
      {
        title: 'Implementation',
        content:
          'Here is a document workflow that transitions between Draft, Review, and Published states.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// State interface
interface DocumentState {
  edit(doc: Document): void;
  review(doc: Document): void;
  publish(doc: Document): void;
}

// Context
class Document {
  private state: DocumentState;
  content: string;

  constructor(content: string) {
    this.content = content;
    this.state = new DraftState(); // initial state
  }

  setState(state: DocumentState) { this.state = state; }
  edit() { this.state.edit(this); }
  review() { this.state.review(this); }
  publish() { this.state.publish(this); }
}

// Concrete States
class DraftState implements DocumentState {
  edit(doc: Document) { console.log('Editing draft...'); }
  review(doc: Document) {
    console.log('Sending to review...');
    doc.setState(new ReviewState());
  }
  publish(doc: Document) { console.log('Cannot publish a draft!'); }
}

class ReviewState implements DocumentState {
  edit(doc: Document) {
    console.log('Revisions requested, back to draft...');
    doc.setState(new DraftState());
  }
  review(doc: Document) { console.log('Already in review.'); }
  publish(doc: Document) {
    console.log('Approved! Publishing...');
    doc.setState(new PublishedState());
  }
}

class PublishedState implements DocumentState {
  edit(doc: Document) { console.log('Cannot edit published doc.'); }
  review(doc: Document) { console.log('Already published.'); }
  publish(doc: Document) { console.log('Already published.'); }
}

// Usage
const doc = new Document('My article');
doc.edit();     // Editing draft...
doc.publish();  // Cannot publish a draft!
doc.review();   // Sending to review...
doc.publish();  // Approved! Publishing...
doc.edit();     // Cannot edit published doc.`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

class DocumentState(ABC):
    @abstractmethod
    def edit(self, doc: "Document") -> None: ...
    @abstractmethod
    def review(self, doc: "Document") -> None: ...
    @abstractmethod
    def publish(self, doc: "Document") -> None: ...

class Document:
    def __init__(self, content: str):
        self.content = content
        self._state: DocumentState = DraftState()

    def set_state(self, state: DocumentState):
        self._state = state

    def edit(self): self._state.edit(self)
    def review(self): self._state.review(self)
    def publish(self): self._state.publish(self)

class DraftState(DocumentState):
    def edit(self, doc): print("Editing draft...")
    def review(self, doc):
        print("Sending to review...")
        doc.set_state(ReviewState())
    def publish(self, doc): print("Cannot publish a draft!")

class ReviewState(DocumentState):
    def edit(self, doc):
        print("Back to draft...")
        doc.set_state(DraftState())
    def review(self, doc): print("Already in review.")
    def publish(self, doc):
        print("Approved! Publishing...")
        doc.set_state(PublishedState())

class PublishedState(DocumentState):
    def edit(self, doc): print("Cannot edit published doc.")
    def review(self, doc): print("Already published.")
    def publish(self, doc): print("Already published.")

doc = Document("My article")
doc.review()   # Sending to review...
doc.publish()  # Approved! Publishing...`,
          },
        ],
        keyTakeaway:
          'Each state is a class. State transitions happen by swapping the state object inside the context.',
      },
      {
        title: 'State vs Strategy',
        content:
          'State and Strategy look structurally identical but differ in intent.',
        comparison: {
          leftTitle: 'State Pattern',
          rightTitle: 'Strategy Pattern',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'State transitions happen automatically', right: 'Client explicitly chooses the strategy' },
            { left: 'States know about each other (to transition)', right: 'Strategies are independent of each other' },
            { left: 'Behavior changes as state evolves', right: 'Behavior changes by external choice' },
            { left: 'Models a finite state machine', right: 'Models interchangeable algorithms' },
          ],
        },
        keyTakeaway:
          'State transitions happen internally and automatically; Strategy is explicitly chosen by the client.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Putting state transition logic in the context instead of state classes',
        explanation:
          'If the context manages transitions, you end up with the same switch statements you were trying to avoid. Let states manage their own transitions.',
      },
      {
        mistake: 'Creating state objects for every context instance',
        explanation:
          'If states are stateless (no instance data), share singleton state objects across all contexts to save memory.',
      },
    ],
    practiceQuestions: [
      'Implement a State pattern for a traffic light system (Red, Yellow, Green).',
      'How does the State pattern relate to finite state machines?',
      'Design a State pattern for a media player (Playing, Paused, Stopped).',
      'When would you choose State over simple boolean flags?',
    ],
  },

  /* ──────────────────────────────────────────────
     13. FACADE PATTERN
     ────────────────────────────────────────────── */
  'facade-pattern': {
    steps: [
      {
        title: 'The Problem: Complex Subsystems',
        content:
          'Modern systems are built from many components. Starting a movie involves turning on the projector, sound system, streaming player, dimming lights, and loading the movie. Exposing all these to the client is overwhelming. The Facade pattern provides a simplified interface to a complex subsystem.',
        analogy:
          'Think of a hotel concierge. Instead of calling the restaurant, spa, taxi service, and theater separately, you tell the concierge "plan my evening" and they handle everything. The concierge is the Facade — one simple interface to many complex systems.',
        keyTakeaway:
          'Facade provides a simplified interface to a complex subsystem, hiding the complexity behind a single class.',
      },
      {
        title: 'Structure',
        content:
          'The Facade wraps multiple subsystem classes and exposes simple, high-level methods.',
        diagram: `         ┌────────────┐
         │   Client   │
         └─────┬──────┘
               │ simple API
               ▼
         ┌────────────┐
         │   Facade   │
         │────────────│
         │ doStuff()  │
         └──┬───┬───┬─┘
            │   │   │
    ┌───────┘   │   └───────┐
    ▼           ▼           ▼
┌───────┐ ┌─────────┐ ┌────────┐
│SubsysA│ │ SubsysB │ │SubsysC │
└───────┘ └─────────┘ └────────┘`,
        keyTakeaway:
          'The Facade sits between the client and the subsystem, simplifying the interface.',
      },
      {
        title: 'Implementation',
        content:
          'Here is a Facade for a home theater system that coordinates multiple components.',
        code: [
          {
            language: 'typescript',
            label: 'TypeScript',
            code: `// Complex subsystem classes
class Projector {
  on() { console.log('Projector warming up...'); }
  setInput(source: string) { console.log(\`Input: \${source}\`); }
  off() { console.log('Projector off.'); }
}

class SoundSystem {
  on() { console.log('Sound system on.'); }
  setVolume(level: number) { console.log(\`Volume: \${level}\`); }
  setSurround() { console.log('Surround sound enabled.'); }
  off() { console.log('Sound system off.'); }
}

class StreamingPlayer {
  on() { console.log('Streaming player on.'); }
  play(movie: string) { console.log(\`Playing: \${movie}\`); }
  stop() { console.log('Playback stopped.'); }
  off() { console.log('Streaming player off.'); }
}

class Lights {
  dim(level: number) { console.log(\`Lights dimmed to \${level}%\`); }
  on() { console.log('Lights on.'); }
}

// Facade — one simple interface
class HomeTheaterFacade {
  constructor(
    private projector: Projector,
    private sound: SoundSystem,
    private player: StreamingPlayer,
    private lights: Lights,
  ) {}

  watchMovie(movie: string) {
    console.log('=== Movie Night ===');
    this.lights.dim(10);
    this.projector.on();
    this.projector.setInput('HDMI-1');
    this.sound.on();
    this.sound.setSurround();
    this.sound.setVolume(60);
    this.player.on();
    this.player.play(movie);
  }

  endMovie() {
    console.log('=== Shutting Down ===');
    this.player.stop();
    this.player.off();
    this.sound.off();
    this.projector.off();
    this.lights.on();
  }
}

// Usage — client only needs two methods
const theater = new HomeTheaterFacade(
  new Projector(), new SoundSystem(),
  new StreamingPlayer(), new Lights()
);
theater.watchMovie('Inception');
theater.endMovie();`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class Projector:
    def on(self): print("Projector warming up...")
    def set_input(self, source: str): print(f"Input: {source}")
    def off(self): print("Projector off.")

class SoundSystem:
    def on(self): print("Sound system on.")
    def set_volume(self, level: int): print(f"Volume: {level}")
    def set_surround(self): print("Surround sound enabled.")
    def off(self): print("Sound system off.")

class StreamingPlayer:
    def on(self): print("Streaming player on.")
    def play(self, movie: str): print(f"Playing: {movie}")
    def stop(self): print("Playback stopped.")
    def off(self): print("Streaming player off.")

class HomeTheaterFacade:
    def __init__(self):
        self._projector = Projector()
        self._sound = SoundSystem()
        self._player = StreamingPlayer()

    def watch_movie(self, movie: str):
        print("=== Movie Night ===")
        self._projector.on()
        self._projector.set_input("HDMI-1")
        self._sound.on()
        self._sound.set_surround()
        self._player.on()
        self._player.play(movie)

    def end_movie(self):
        self._player.stop()
        self._sound.off()
        self._projector.off()

theater = HomeTheaterFacade()
theater.watch_movie("Inception")`,
          },
        ],
        keyTakeaway:
          'The Facade coordinates multiple subsystem objects, exposing simple high-level methods to the client.',
      },
      {
        title: 'Facade in Everyday Code',
        content:
          'You use facades constantly, even if you do not call them that.',
        bullets: [
          'jQuery: $(selector) is a facade over complex DOM APIs',
          'ORMs: Prisma/Sequelize facade over raw SQL',
          'AWS SDK: simple method calls that orchestrate multiple AWS services',
          'React hooks: useEffect is a facade over lifecycle methods',
          'Express app.listen(): facade over http.createServer + server.listen',
        ],
        keyTakeaway:
          'Facades are the most common pattern in software — any library that simplifies a complex API is a Facade.',
      },
      {
        title: 'Facade vs Adapter vs Decorator',
        content:
          'These three structural patterns are often confused.',
        table: {
          headers: ['Pattern', 'Purpose', 'Changes Interface?'],
          rows: [
            ['Facade', 'Simplify a complex subsystem', 'Provides a new, simpler interface'],
            ['Adapter', 'Make incompatible interfaces work together', 'Converts one interface to another'],
            ['Decorator', 'Add behavior to an object dynamically', 'Keeps the same interface'],
          ],
        },
        keyTakeaway:
          'Facade simplifies, Adapter converts, Decorator adds — all structural patterns but with different goals.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Making the Facade the only way to access subsystems',
        explanation:
          'A Facade should not prevent direct access to subsystem classes. Power users may need the fine-grained API.',
      },
      {
        mistake: 'Putting business logic in the Facade',
        explanation:
          'A Facade should only coordinate and delegate. Business logic belongs in the subsystem classes.',
      },
    ],
    practiceQuestions: [
      'Design a Facade for an e-commerce checkout that coordinates inventory, payment, shipping, and email.',
      'How does Facade differ from the Mediator pattern?',
      'When would a Facade become an "anti-pattern"?',
      'Implement a Facade for a deployment pipeline (build, test, deploy, notify).',
    ],
  },
};
