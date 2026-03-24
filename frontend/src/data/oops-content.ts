import type { LessonStep, QuizQuestion } from '@/lib/learn-data';

export const oopsLessons: Record<string, {
  steps: LessonStep[];
  commonMistakes?: { mistake: string; explanation: string }[];
  practiceQuestions?: string[];
  quiz?: QuizQuestion[];
}> = {
  /* ──────────────────────────────────────────────
     1. WHAT IS OOP?
     ────────────────────────────────────────────── */
  'what-is-oop': {
    steps: [
      {
        title: 'Think About Real-World Objects',
        content:
          'Look around you right now. You see a phone, a chair, a cup of coffee. Each of these things has **properties** (color, size, weight) and **behaviors** (a phone can ring, a chair can be sat on, coffee can be poured). Object-Oriented Programming models software the same way — by grouping related data and behavior into self-contained units called **objects**.',
        analogy:
          'Imagine you are describing your dog to a friend. You would say it has a name, a breed, and a color (properties), and it can bark, fetch, and sit (behaviors). OOP lets you represent that exact model in code.',
        keyTakeaway:
          'OOP organizes code around objects that combine data (properties) and actions (methods).',
      },
      {
        title: 'Procedural vs Object-Oriented',
        content:
          'Before OOP, most programs were written **procedurally** — a sequence of instructions executed top to bottom. Data and functions lived separately. As programs grew, this became a spaghetti nightmare. OOP bundles data with the functions that operate on it, making code easier to organize, reuse, and reason about.',
        comparison: {
          leftTitle: 'Procedural',
          rightTitle: 'Object-Oriented',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'Data and functions are separate', right: 'Data and functions bundled together' },
            { left: 'Functions operate on external data', right: 'Objects manage their own state' },
            { left: 'Hard to manage as code grows', right: 'Easier to scale and maintain' },
            { left: 'Global state causes bugs', right: 'Encapsulation reduces bugs' },
          ],
        },
        keyTakeaway:
          'Procedural code separates data from functions; OOP bundles them into objects.',
      },
      {
        title: 'A Side-by-Side Comparison',
        content:
          'Let us model a bank account. In procedural style, the balance is a standalone variable and functions accept it as a parameter. In OOP, the balance lives inside the account object, and methods operate on it directly.',
        code: [
          {
            language: 'python',
            label: 'Procedural Python',
            code: `# --- Procedural Style ---
# Data is a plain variable
balance = 1000

# Functions take data as an argument
def deposit(current_balance, amount):
    return current_balance + amount  # return new balance

def withdraw(current_balance, amount):
    if amount > current_balance:
        print("Insufficient funds")  # no encapsulation
        return current_balance
    return current_balance - amount

# Caller must track the variable manually
balance = deposit(balance, 500)   # balance = 1500
balance = withdraw(balance, 200)  # balance = 1300
print(balance)                    # 1300`,
          },
          {
            language: 'python',
            label: 'OOP Python',
            code: `# --- Object-Oriented Style ---
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner      # property: account owner
        self.balance = balance   # property: current balance

    def deposit(self, amount):
        self.balance += amount   # method modifies internal state
        return self              # allows method chaining

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
            return self
        self.balance -= amount   # encapsulated logic
        return self

# Create an object and use its methods
account = BankAccount("Alice", 1000)
account.deposit(500).withdraw(200)
print(account.balance)  # 1300`,
          },
        ],
        keyTakeaway:
          'OOP keeps data and behavior together, so you never lose track of which function operates on which data.',
      },
      {
        title: 'The Four Pillars of OOP',
        content:
          'OOP rests on four foundational concepts. Every subsequent lesson dives deep into one of these:\n\n1. **Encapsulation** — Hide internal details, expose only what is needed.\n2. **Inheritance** — Reuse code by building child classes from parent classes.\n3. **Polymorphism** — One interface, many implementations.\n4. **Abstraction** — Focus on *what* an object does, not *how*.\n\nThink of these as the four legs of a table — remove any one and the design collapses.',
        cards: [
          { title: 'Encapsulation', description: 'Hide internal details, expose only what is needed.', icon: '🔒', color: 'blue' },
          { title: 'Inheritance', description: 'Reuse code by building child classes from parents.', icon: '🧬', color: 'emerald' },
          { title: 'Polymorphism', description: 'One interface, many implementations.', icon: '🎭', color: 'purple' },
          { title: 'Abstraction', description: 'Focus on what an object does, not how.', icon: '🎨', color: 'amber' },
        ],
        keyTakeaway:
          'Encapsulation, Inheritance, Polymorphism, and Abstraction are the four pillars of OOP.',
      },
      {
        title: 'Why OOP Matters in Interviews',
        content:
          'Almost every major tech company evaluates OOP understanding:\n\n- **Low-Level Design rounds** ask you to design systems like a parking lot or an ATM — pure OOP.\n- **Coding rounds** expect clean, class-based solutions.\n- **System Design** discussions reference design patterns rooted in OOP.\n- **Code reviews** at work demand SOLID principles.\n\nMastering OOP is not optional — it is the vocabulary the industry speaks.',
        keyTakeaway:
          'OOP knowledge is tested in coding rounds, low-level design, and system design interviews.',
      },
      {
        title: 'OOP in Java vs Python',
        content:
          'Java enforces OOP — everything lives inside a class. Python is multi-paradigm but supports OOP fully. Here is the exact same concept in both languages so you see how the syntax differs while the idea stays identical.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Java: Everything must be inside a class
public class Dog {
    // Properties (instance variables)
    private String name;   // private = encapsulated
    private String breed;

    // Constructor — called when you create a new Dog
    public Dog(String name, String breed) {
        this.name = name;   // "this" refers to the current object
        this.breed = breed;
    }

    // Method (behavior)
    public void bark() {
        System.out.println(name + " says Woof!");  // access internal state
    }
}

// Creating an object
// Dog myDog = new Dog("Rex", "Labrador");
// myDog.bark();  // Rex says Woof!`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `# Python: OOP is optional but fully supported
class Dog:
    # Constructor — called when you create a new Dog
    def __init__(self, name, breed):
        self.name = name    # "self" refers to the current object
        self.breed = breed

    # Method (behavior)
    def bark(self):
        print(f"{self.name} says Woof!")  # access internal state

# Creating an object
my_dog = Dog("Rex", "Labrador")
my_dog.bark()  # Rex says Woof!`,
          },
        ],
        keyTakeaway:
          'Java enforces OOP everywhere; Python supports OOP but does not require it. The concepts are identical.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Thinking OOP is just about using classes',
        explanation:
          'OOP is a design philosophy, not just syntax. You can write classes without following OOP principles and end up with the same spaghetti code as procedural programming.',
      },
      {
        mistake: 'Overusing OOP for simple scripts',
        explanation:
          'A 20-line script to rename files does not need a class hierarchy. Use OOP when complexity justifies it.',
      },
      {
        mistake: 'Confusing objects with classes',
        explanation:
          'A class is a blueprint; an object is an instance. You can have many objects from one class, just as many houses can be built from one blueprint.',
      },
      {
        mistake: 'Ignoring OOP in interview prep',
        explanation:
          'Many candidates focus only on data structures and algorithms. OOP is explicitly tested in low-level design rounds and code quality assessments.',
      },
    ],
    practiceQuestions: [
      'Explain the difference between procedural and object-oriented programming with an example.',
      'Name the four pillars of OOP and give a one-line definition of each.',
      'Rewrite a procedural "calculate area of shapes" program using OOP.',
      'Why does Java force everything into a class while Python does not?',
      'Give a real-world analogy for each of the four OOP pillars.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which of the following is NOT one of the four pillars of OOP?',
        options: ['Encapsulation', 'Compilation', 'Polymorphism', 'Abstraction'],
        answer: 'Compilation',
        explanation: 'The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction. Compilation is a build process, not an OOP principle.',
      },
      {
        type: 'mcq',
        question: 'In OOP, what is the primary advantage over procedural programming?',
        options: ['Faster execution speed', 'Data and functions are bundled together', 'Uses less memory', 'Requires fewer lines of code'],
        answer: 'Data and functions are bundled together',
        explanation: 'OOP bundles data with the functions that operate on it into objects, making code easier to organize, reuse, and maintain compared to procedural programming where data and functions are separate.',
      },
      {
        type: 'short-answer',
        question: 'What does the word "polymorphism" literally mean in Greek?',
        answer: 'many forms',
        explanation: 'In Greek, "poly" means many and "morph" means forms. Polymorphism allows one interface to have many implementations.',
      },
      {
        type: 'mcq',
        question: 'Which language enforces OOP by requiring everything to live inside a class?',
        options: ['Python', 'JavaScript', 'Java', 'C'],
        answer: 'Java',
        explanation: 'Java enforces OOP — every piece of code must exist inside a class. Python is multi-paradigm and supports OOP but does not require it.',
      },
      {
        type: 'short-answer',
        question: 'In OOP, what is the relationship between a class and an object?',
        answer: 'A class is a blueprint and an object is an instance of that class',
        explanation: 'A class defines the structure and behavior (like an architectural blueprint), while an object is a concrete instance built from that class (like a house built from the blueprint).',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     2. CLASSES & OBJECTS
     ────────────────────────────────────────────── */
  'classes-and-objects': {
    steps: [
      {
        title: 'Blueprint and House',
        content:
          'A **class** is a blueprint — it describes what something will look like and what it can do. An **object** is a specific thing built from that blueprint. Just as one architectural blueprint can produce many houses, one class can produce many objects.',
        analogy:
          'Think of a cookie cutter (class) and cookies (objects). The cutter defines the shape, but each cookie is its own independent piece. Change one cookie (add sprinkles) and the others remain unchanged.',
        keyTakeaway:
          'A class defines structure and behavior; an object is a concrete instance with its own state.',
      },
      {
        title: 'Anatomy of a Class',
        content:
          'Every class has three core components:\n\n1. **Properties (Fields/Attributes)** — The data an object holds (e.g., `name`, `age`).\n2. **Constructor** — A special method that initializes a new object.\n3. **Methods** — Functions that define what the object can do.\n\nLet us build a `Car` class step by step.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `public class Car {
    // ──── 1. Properties (instance variables) ────
    private String make;     // e.g., "Toyota"
    private String model;    // e.g., "Camry"
    private int year;        // e.g., 2024
    private double speed;    // current speed in km/h

    // ──── 2. Constructor ────
    public Car(String make, String model, int year) {
        this.make = make;    // assign parameter to property
        this.model = model;
        this.year = year;
        this.speed = 0;      // every new car starts stationary
    }

    // ──── 3. Methods (behaviors) ────
    public void accelerate(double amount) {
        this.speed += amount;  // increase speed
        System.out.println(make + " accelerating to " + speed + " km/h");
    }

    public void brake(double amount) {
        this.speed = Math.max(0, this.speed - amount);  // speed never negative
        System.out.println(make + " slowing to " + speed + " km/h");
    }

    public String describe() {
        return year + " " + make + " " + model;  // return a description
    }
}`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class Car:
    # ──── Constructor ────
    def __init__(self, make, model, year):
        # Properties (instance variables)
        self.make = make      # e.g., "Toyota"
        self.model = model    # e.g., "Camry"
        self.year = year      # e.g., 2024
        self.speed = 0        # every new car starts stationary

    # ──── Methods (behaviors) ────
    def accelerate(self, amount):
        self.speed += amount  # increase speed
        print(f"{self.make} accelerating to {self.speed} km/h")

    def brake(self, amount):
        self.speed = max(0, self.speed - amount)  # speed never negative
        print(f"{self.make} slowing to {self.speed} km/h")

    def describe(self):
        return f"{self.year} {self.make} {self.model}"  # return description`,
          },
        ],
        keyTakeaway:
          'A class has properties (data), a constructor (initialization), and methods (behavior).',
      },
      {
        title: 'Creating Objects (Instantiation)',
        content:
          'Creating an object from a class is called **instantiation**. Each object gets its own copy of the properties. Changing one object does not affect another.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `public class Main {
    public static void main(String[] args) {
        // Create two separate Car objects from the same blueprint
        Car car1 = new Car("Toyota", "Camry", 2024);  // object 1
        Car car2 = new Car("Honda", "Civic", 2023);    // object 2

        // Each object has its own state
        car1.accelerate(60);  // Toyota accelerating to 60 km/h
        car2.accelerate(80);  // Honda accelerating to 80 km/h

        // car1's speed is 60, car2's speed is 80 — independent!
        System.out.println(car1.describe());  // 2024 Toyota Camry
        System.out.println(car2.describe());  // 2023 Honda Civic
    }
}`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `# Create two separate Car objects from the same blueprint
car1 = Car("Toyota", "Camry", 2024)  # object 1
car2 = Car("Honda", "Civic", 2023)    # object 2

# Each object has its own state
car1.accelerate(60)  # Toyota accelerating to 60 km/h
car2.accelerate(80)  # Honda accelerating to 80 km/h

# car1's speed is 60, car2's speed is 80 — independent!
print(car1.describe())  # 2024 Toyota Camry
print(car2.describe())  # 2023 Honda Civic`,
          },
        ],
        keyTakeaway:
          'Each object created from a class has its own independent copy of properties.',
      },
      {
        title: 'The Constructor Deep Dive',
        content:
          'The constructor is called **automatically** when you create an object. It sets up the initial state. Some key points:\n\n- In Java: the constructor has the **same name as the class** and no return type.\n- In Python: the constructor is always `__init__`.\n- You can have **multiple constructors** (overloading) in Java.\n- The `this` (Java) / `self` (Python) keyword refers to the current object being created.',
        code: [
          {
            language: 'java',
            label: 'Java — Constructor Overloading',
            code: `public class Student {
    private String name;
    private int age;
    private String major;

    // Constructor 1: All fields
    public Student(String name, int age, String major) {
        this.name = name;
        this.age = age;
        this.major = major;
    }

    // Constructor 2: Without major (default to "Undeclared")
    public Student(String name, int age) {
        this(name, age, "Undeclared");  // call Constructor 1
    }

    // Constructor 3: Name only
    public Student(String name) {
        this(name, 18);  // call Constructor 2, which calls Constructor 1
    }
}

// Usage:
// Student s1 = new Student("Alice", 20, "CS");       // all fields
// Student s2 = new Student("Bob", 19);                // major = "Undeclared"
// Student s3 = new Student("Charlie");                // age = 18, major = "Undeclared"`,
          },
          {
            language: 'python',
            label: 'Python — Default Parameters',
            code: `class Student:
    # Python uses default parameters instead of overloading
    def __init__(self, name, age=18, major="Undeclared"):
        self.name = name      # required parameter
        self.age = age        # default: 18
        self.major = major    # default: "Undeclared"

    def __repr__(self):
        return f"Student({self.name}, {self.age}, {self.major})"

# Usage:
s1 = Student("Alice", 20, "CS")  # all fields
s2 = Student("Bob", 19)          # major = "Undeclared"
s3 = Student("Charlie")          # age = 18, major = "Undeclared"

print(s1)  # Student(Alice, 20, CS)
print(s2)  # Student(Bob, 19, Undeclared)
print(s3)  # Student(Charlie, 18, Undeclared)`,
          },
        ],
        keyTakeaway:
          'Constructors initialize object state. Java supports overloading; Python uses default parameters.',
      },
      {
        title: 'Instance vs Class (Static) Members',
        content:
          'Properties and methods can belong to an **instance** (each object gets its own) or to the **class** (shared across all objects). Class-level members are called **static** in Java and use `@classmethod` or class variables in Python.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `public class Employee {
    // Static (class-level) variable — shared by ALL employees
    private static int totalEmployees = 0;

    // Instance variables — unique to each employee
    private String name;
    private int id;

    public Employee(String name) {
        this.name = name;
        totalEmployees++;              // increment the shared counter
        this.id = totalEmployees;      // assign a unique ID
    }

    // Static method — belongs to the class, not an instance
    public static int getTotalEmployees() {
        return totalEmployees;  // can only access static members
    }

    // Instance method — belongs to a specific employee
    public String getInfo() {
        return "Employee #" + id + ": " + name;
    }
}

// Employee e1 = new Employee("Alice");
// Employee e2 = new Employee("Bob");
// Employee.getTotalEmployees();  // 2 (called on the CLASS, not an object)`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class Employee:
    # Class variable — shared by ALL employees
    total_employees = 0

    def __init__(self, name):
        self.name = name                     # instance variable
        Employee.total_employees += 1        # increment shared counter
        self.id = Employee.total_employees   # assign unique ID

    # Class method — belongs to the class
    @classmethod
    def get_total_employees(cls):
        return cls.total_employees  # "cls" refers to the class itself

    # Instance method — belongs to a specific employee
    def get_info(self):
        return f"Employee #{self.id}: {self.name}"

e1 = Employee("Alice")
e2 = Employee("Bob")
print(Employee.get_total_employees())  # 2 (called on the CLASS)
print(e1.get_info())                   # Employee #1: Alice`,
          },
        ],
        keyTakeaway:
          'Instance members belong to individual objects; static/class members are shared across all instances.',
      },
      {
        title: 'Objects in Memory',
        content:
          'When you write `Car car1 = new Car(...)` in Java, two things happen:\n\n1. The `new Car(...)` part allocates memory on the **heap** and runs the constructor.\n2. `car1` is a **reference** (pointer) stored on the **stack** that points to that heap object.\n\nThis means when you assign `car2 = car1`, both variables point to the **same** object. Changing `car2` changes `car1` too! To create an independent copy, you need to explicitly clone or create a new object.',
        diagram: `STACK                    HEAP\n┌──────────────┐     ┌────────────────────────┐\n│ car1 ─────────────►│ 0x1A: Car              │\n│              │     │  make: "Toyota"        │\n│ car2 ─────────────►│  speed: 60             │\n│              │     │  (SAME object!)        │\n└──────────────┘     └────────────────────────┘\n\ncar2 = car1 does NOT copy — both point\nto the same object on the heap.`,
        code: [
          {
            language: 'python',
            label: 'Python — Reference Demo',
            code: `# Both variables point to the SAME object
car1 = Car("Toyota", "Camry", 2024)
car2 = car1  # car2 is NOT a copy — it is the same object

car2.accelerate(100)
print(car1.speed)  # 100!  car1 is affected because it is the same object

# To create an independent copy:
import copy
car3 = copy.copy(car1)  # shallow copy — now car3 is a separate object
car3.accelerate(50)
print(car1.speed)  # 100 (unchanged)
print(car3.speed)  # 150 (independent)`,
          },
        ],
        keyTakeaway:
          'Variables store references to objects, not the objects themselves. Assignment copies the reference, not the object.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Confusing class with object',
        explanation:
          'A class is a template (like a cookie cutter). An object is an instance (like a cookie). You cannot eat the cookie cutter.',
      },
      {
        mistake: 'Forgetting that assignment copies references, not objects',
        explanation:
          'Writing `b = a` makes both variables point to the same object. Modifying `b` changes `a` too. Use explicit cloning if you need independence.',
      },
      {
        mistake: 'Using class variables when you mean instance variables',
        explanation:
          'In Python, writing `self.x = 5` creates an instance variable. Writing `x = 5` at class level creates a shared class variable. Mixing these up causes subtle bugs.',
      },
    ],
    practiceQuestions: [
      'Create a `Book` class with title, author, pages, and a method `is_long()` that returns True if pages > 300.',
      'What is the difference between a constructor and a regular method?',
      'Explain what happens in memory when you write `Dog d = new Dog("Rex")` in Java.',
      'Create a `Counter` class with a static variable that tracks how many Counter objects have been created.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is the process of creating an object from a class called?',
        options: ['Compilation', 'Instantiation', 'Encapsulation', 'Serialization'],
        answer: 'Instantiation',
        explanation: 'Creating an object from a class is called instantiation. Each object (instance) gets its own copy of the instance variables defined in the class.',
      },
      {
        type: 'short-answer',
        question: 'What keyword is used to create a new object in Java?',
        answer: 'new',
        explanation: 'In Java, the "new" keyword is used to instantiate an object, e.g., Car car1 = new Car("Toyota", "Camry", 2024).',
      },
      {
        type: 'mcq',
        question: 'Which of the following is true about static (class) members?',
        options: ['Each object gets its own copy', 'They are shared across all instances of the class', 'They can only be accessed inside the constructor', 'They are always private'],
        answer: 'They are shared across all instances of the class',
        explanation: 'Static members belong to the class itself, not to any particular instance. All objects share the same static variable, so changing it in one place affects all.',
      },
      {
        type: 'mcq',
        question: 'What are the three core components of a class?',
        options: ['Variables, loops, conditions', 'Properties, constructor, methods', 'Import, export, return', 'Header, body, footer'],
        answer: 'Properties, constructor, methods',
        explanation: 'Every class has properties (data/fields), a constructor (initialization logic), and methods (behaviors/actions the object can perform).',
      },
      {
        type: 'short-answer',
        question: 'In Python, what is the name of the constructor method?',
        answer: '__init__',
        explanation: 'In Python, the __init__ method serves as the constructor. It is automatically called when a new object is created from the class.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     3. ENCAPSULATION
     ────────────────────────────────────────────── */
  'encapsulation': {
    steps: [
      {
        title: 'The Medicine Capsule',
        content:
          'Encapsulation is the practice of **bundling data with the methods that operate on it** and **restricting direct access** to internal details. The word itself comes from "capsule" — you take a medicine capsule without knowing or caring what chemicals are inside. You just trust it works.',
        analogy:
          'Think of a car dashboard. You interact with a steering wheel, gas pedal, and brake. You do NOT directly touch the engine, transmission, or fuel injection system. The car **encapsulates** its internals and gives you a simple interface.',
        keyTakeaway:
          'Encapsulation hides internal state and exposes only a controlled interface.',
      },
      {
        title: 'Access Modifiers — The Gates',
        content:
          'Languages use **access modifiers** to control who can see and change an object\'s properties:\n\n| Modifier | Java Keyword | Python Convention | Who Can Access |\n|----------|-------------|------------------|---------------|\n| Public | `public` | no prefix | Anyone |\n| Protected | `protected` | `_single_underscore` | Class + subclasses |\n| Private | `private` | `__double_underscore` | Class only |\n\nThink of these as security levels: public is the lobby (anyone enters), protected is the employee area (badge required), private is the vault (authorized personnel only).',
        table: {
          headers: ['Level', 'Java', 'Python', 'Access'],
          rows: [
            ['Public', 'public', 'no prefix', 'Everyone'],
            ['Protected', 'protected', '_var', 'Class + subclasses'],
            ['Private', 'private', '__var', 'Class only'],
          ],
        },
        keyTakeaway:
          'Access modifiers (public, protected, private) control visibility of class members.',
      },
      {
        title: 'Why Not Just Make Everything Public?',
        content:
          'Imagine a `BankAccount` where anyone can directly set `balance = -1000000`. Chaos! Encapsulation prevents this by making `balance` private and providing controlled methods:\n\n- **Validation** — Setters can reject invalid values.\n- **Consistency** — Internal state always stays valid.\n- **Flexibility** — You can change the internal implementation without breaking external code.\n- **Debugging** — If balance changes, you know it went through `deposit()` or `withdraw()`.',
        code: [
          {
            language: 'java',
            label: 'Java — BAD: No Encapsulation',
            code: `// BAD: Fields are public — anyone can break the rules
public class BankAccount {
    public String owner;
    public double balance;  // DANGER: anyone can set this to anything!
}

// Somewhere else in the code...
BankAccount acct = new BankAccount();
acct.balance = -999999;  // No validation! Account is now invalid.
acct.owner = "";         // Empty owner? Sure, why not. Chaos.`,
          },
          {
            language: 'java',
            label: 'Java — GOOD: Encapsulated',
            code: `// GOOD: Fields are private, accessed through controlled methods
public class BankAccount {
    private String owner;     // only this class can touch these
    private double balance;

    public BankAccount(String owner, double initialBalance) {
        if (owner == null || owner.isEmpty()) {
            throw new IllegalArgumentException("Owner required");  // validate
        }
        this.owner = owner;
        this.balance = Math.max(0, initialBalance);  // no negative start
    }

    public double getBalance() {
        return balance;  // read-only access to balance
    }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Must be positive");
        balance += amount;  // controlled modification
    }

    public boolean withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;  // guard
        balance -= amount;  // safe withdrawal
        return true;
    }
}`,
          },
        ],
        keyTakeaway:
          'Private fields + public methods = validation, consistency, and safety.',
      },
      {
        title: 'Getters and Setters',
        content:
          'Getters read private data; setters write it. They look simple, but they give you a hook to add validation, logging, or transformation **without changing the external interface**.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `public class Temperature {
    private double celsius;  // private field

    // Getter — read access
    public double getCelsius() {
        return celsius;
    }

    // Setter — write access with validation
    public void setCelsius(double celsius) {
        if (celsius < -273.15) {
            throw new IllegalArgumentException("Below absolute zero!");
        }
        this.celsius = celsius;
    }

    // Computed getter — derived from internal state
    public double getFahrenheit() {
        return celsius * 9.0 / 5.0 + 32;  // no separate field needed
    }
}

// Temperature t = new Temperature();
// t.setCelsius(100);
// t.getFahrenheit();  // 212.0
// t.setCelsius(-300); // throws exception!`,
          },
          {
            language: 'python',
            label: 'Python — @property decorator',
            code: `class Temperature:
    def __init__(self, celsius=0):
        self.celsius = celsius  # uses the setter below!

    @property
    def celsius(self):
        """Getter — read access."""
        return self._celsius  # private field uses underscore convention

    @celsius.setter
    def celsius(self, value):
        """Setter — write access with validation."""
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value  # store in private variable

    @property
    def fahrenheit(self):
        """Computed property — derived from internal state."""
        return self._celsius * 9 / 5 + 32

t = Temperature(100)
print(t.fahrenheit)  # 212.0
print(t.celsius)     # 100

# t.celsius = -300   # raises ValueError!`,
          },
        ],
        keyTakeaway:
          'Getters and setters provide controlled access to private fields and a hook for validation.',
      },
      {
        title: 'Encapsulation in Practice — User Profile',
        content:
          'Let us build a real-world example: a `UserProfile` that encapsulates email validation, password hashing, and age restrictions.',
        code: [
          {
            language: 'python',
            label: 'Python',
            code: `import hashlib  # for password hashing demo

class UserProfile:
    def __init__(self, username, email, password, age):
        self.username = username       # public — OK to read/write freely
        self.email = email             # uses setter for validation
        self.__password_hash = None    # private — NEVER expose raw password
        self.set_password(password)    # hash the password immediately
        self.age = age                 # uses setter for validation

    @property
    def email(self):
        return self.__email

    @email.setter
    def email(self, value):
        if "@" not in value or "." not in value:
            raise ValueError(f"Invalid email: {value}")
        self.__email = value.lower().strip()  # normalize

    @property
    def age(self):
        return self.__age

    @age.setter
    def age(self, value):
        if not (13 <= value <= 150):
            raise ValueError("Age must be between 13 and 150")
        self.__age = value

    def set_password(self, raw_password):
        """Hash the password — never store raw."""
        if len(raw_password) < 8:
            raise ValueError("Password must be at least 8 characters")
        self.__password_hash = hashlib.sha256(
            raw_password.encode()
        ).hexdigest()

    def check_password(self, raw_password):
        """Verify a password without exposing the hash."""
        return self.__password_hash == hashlib.sha256(
            raw_password.encode()
        ).hexdigest()

# Usage
user = UserProfile("alice", "Alice@Example.com", "secure123", 25)
print(user.email)                    # alice@example.com (normalized)
print(user.check_password("secure123"))  # True
print(user.check_password("wrong"))      # False
# print(user.__password_hash)          # AttributeError! Private.`,
          },
        ],
        keyTakeaway:
          'Encapsulation protects invariants: valid emails, hashed passwords, and age restrictions are all enforced automatically.',
      },
      {
        title: 'Data Hiding vs Encapsulation',
        content:
          'People often confuse these two:\n\n- **Data hiding** = Making fields private (the mechanism).\n- **Encapsulation** = Bundling data + methods together AND controlling access (the principle).\n\nData hiding is a **tool** used to achieve encapsulation, but encapsulation is bigger — it is about designing clean, self-contained units of code.\n\nYou can have encapsulation without strict data hiding (Python\'s underscore convention is advisory, not enforced). The intent matters more than the enforcement.',
        keyTakeaway:
          'Data hiding is a mechanism; encapsulation is the broader principle of bundling data with controlled access.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Making every field public "for convenience"',
        explanation:
          'This defeats the purpose of encapsulation. Other code becomes tightly coupled to your internal representation, making changes impossible without breaking everything.',
      },
      {
        mistake: 'Creating getters and setters for every field',
        explanation:
          'Blindly generating get/set for all fields is just public fields with extra steps. Only expose what external code actually needs.',
      },
      {
        mistake: 'Returning mutable references from getters',
        explanation:
          'If your getter returns a list or map, the caller can modify the internal collection. Return copies or unmodifiable views instead.',
      },
      {
        mistake: 'Thinking Python underscore convention is enforced',
        explanation:
          'Python\'s `_var` and `__var` are conventions and name mangling, not true access control. They signal intent but can be bypassed.',
      },
    ],
    practiceQuestions: [
      'Create a `Password` class that stores a hashed password and provides a `verify(raw)` method but never exposes the hash.',
      'Explain the difference between data hiding and encapsulation.',
      'Why is returning a mutable list from a getter dangerous? Show an example.',
      'Refactor a class with all public fields to use proper encapsulation with validation.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which OOP principle involves hiding internal implementation details and exposing only a controlled interface?',
        options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        answer: 'Encapsulation',
        explanation: 'Encapsulation bundles data with the methods that operate on it and restricts direct access to internal details, exposing only a controlled interface.',
      },
      {
        type: 'mcq',
        question: 'In Java, which access modifier restricts access to the class itself only?',
        options: ['public', 'protected', 'default', 'private'],
        answer: 'private',
        explanation: 'The private access modifier makes a field or method accessible only within the class that declares it. Not even subclasses can access it directly.',
      },
      {
        type: 'short-answer',
        question: 'In Python, what naming convention indicates a private variable?',
        answer: 'double underscore prefix',
        explanation: 'Python uses __double_underscore prefix (name mangling) to indicate private variables. A single underscore _ is the convention for protected.',
      },
      {
        type: 'mcq',
        question: 'Why should setters include validation logic?',
        options: ['To make the code run faster', 'To prevent invalid data from corrupting the object state', 'To reduce memory usage', 'To enable polymorphism'],
        answer: 'To prevent invalid data from corrupting the object state',
        explanation: 'Setters act as gatekeepers. By validating input before assignment (e.g., age cannot be negative, email must contain @), they protect the object from entering an invalid state.',
      },
      {
        type: 'short-answer',
        question: 'What is the difference between data hiding and encapsulation?',
        answer: 'Data hiding restricts access to fields; encapsulation bundles data and methods together',
        explanation: 'Data hiding is about restricting access (using private/protected). Encapsulation is the broader concept of bundling data with behavior. Data hiding is a technique used to achieve encapsulation.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     4. INHERITANCE
     ────────────────────────────────────────────── */
  'inheritance': {
    steps: [
      {
        title: 'Family Traits',
        content:
          'Inheritance lets a new class **acquire** properties and methods from an existing class. The existing class is called the **parent** (or superclass), and the new class is called the **child** (or subclass). Just like you inherit traits from your parents — eye color, height — a child class inherits fields and methods from its parent.',
        analogy:
          'Think of a family tree. Your grandparents had certain traits. Your parents inherited some, added their own. You inherited from your parents and added yours. Each generation builds on the previous one without starting from scratch.',
        keyTakeaway:
          'Inheritance creates a parent-child relationship where children reuse and extend parent code.',
      },
      {
        title: 'Basic Inheritance — Animal Example',
        content:
          'Let us build a classic example: an `Animal` base class with `Dog` and `Cat` children.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Parent class (superclass)
public class Animal {
    protected String name;   // protected = accessible by subclasses
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " is eating.");  // shared behavior
    }

    public void sleep() {
        System.out.println(name + " is sleeping.");  // shared behavior
    }

    public String describe() {
        return name + " (age " + age + ")";
    }
}

// Child class (subclass) — inherits ALL of Animal's fields and methods
public class Dog extends Animal {
    private String breed;  // Dog-specific property

    public Dog(String name, int age, String breed) {
        super(name, age);     // call parent constructor FIRST
        this.breed = breed;   // then set Dog-specific field
    }

    // Dog-specific method
    public void fetch() {
        System.out.println(name + " is fetching the ball!");
    }

    // Override parent method to add Dog-specific behavior
    @Override
    public String describe() {
        return super.describe() + " [" + breed + "]";  // reuse parent + add
    }
}

// Dog rex = new Dog("Rex", 3, "Labrador");
// rex.eat();       // "Rex is eating." — inherited from Animal
// rex.fetch();     // "Rex is fetching the ball!" — Dog-specific
// rex.describe();  // "Rex (age 3) [Labrador]" — overridden`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `# Parent class (superclass)
class Animal:
    def __init__(self, name, age):
        self.name = name   # instance variable
        self.age = age

    def eat(self):
        print(f"{self.name} is eating.")   # shared behavior

    def sleep(self):
        print(f"{self.name} is sleeping.")  # shared behavior

    def describe(self):
        return f"{self.name} (age {self.age})"


# Child class — inherits from Animal
class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)  # call parent constructor FIRST
        self.breed = breed           # Dog-specific property

    # Dog-specific method
    def fetch(self):
        print(f"{self.name} is fetching the ball!")

    # Override parent method
    def describe(self):
        return f"{super().describe()} [{self.breed}]"


rex = Dog("Rex", 3, "Labrador")
rex.eat()       # "Rex is eating." — inherited from Animal
rex.fetch()     # "Rex is fetching the ball!" — Dog-specific
print(rex.describe())  # "Rex (age 3) [Labrador]" — overridden`,
          },
        ],
        keyTakeaway:
          'Child classes inherit parent methods and can add new ones or override existing ones.',
      },
      {
        title: 'Method Overriding',
        content:
          'When a child class defines a method with the **same name** as the parent, it **overrides** the parent\'s version. The child\'s version runs instead. This is powerful — you can customize behavior while keeping the same interface.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `public class Animal {
    public void makeSound() {
        System.out.println("Some generic sound");  // default
    }
}

public class Dog extends Animal {
    @Override  // annotation tells compiler: "I intend to override"
    public void makeSound() {
        System.out.println("Woof! Woof!");  // Dog's version
    }
}

public class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");  // Cat's version
    }
}

// All are treated as Animals but each sounds different
Animal[] animals = { new Dog(), new Cat(), new Animal() };
for (Animal a : animals) {
    a.makeSound();
}
// Output:
// Woof! Woof!
// Meow!
// Some generic sound`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class Animal:
    def make_sound(self):
        print("Some generic sound")  # default behavior

class Dog(Animal):
    def make_sound(self):            # override — same method name
        print("Woof! Woof!")

class Cat(Animal):
    def make_sound(self):            # override — same method name
        print("Meow!")

# All treated as Animals but each behaves differently
animals = [Dog(), Cat(), Animal()]
for a in animals:
    a.make_sound()
# Output:
# Woof! Woof!
# Meow!
# Some generic sound`,
          },
        ],
        keyTakeaway:
          'Method overriding lets child classes replace parent behavior while keeping the same interface.',
      },
      {
        title: 'The super Keyword',
        content:
          'The `super` keyword lets a child class call its parent\'s methods. This is essential for:\n\n1. **Constructors** — calling the parent constructor to initialize inherited fields.\n2. **Extending behavior** — running the parent version plus adding more.\n\nWithout `super`, the child would have to duplicate the parent\'s logic.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `public class Vehicle {
    protected String make;
    protected int year;

    public Vehicle(String make, int year) {
        this.make = make;
        this.year = year;
    }

    public void startEngine() {
        System.out.println("Engine starting...");  // base behavior
    }
}

public class ElectricCar extends Vehicle {
    private int batteryPercent;

    public ElectricCar(String make, int year, int batteryPercent) {
        super(make, year);  // MUST call parent constructor first
        this.batteryPercent = batteryPercent;
    }

    @Override
    public void startEngine() {
        super.startEngine();  // run parent's version first
        System.out.println("Electric motor humming. Battery: " + batteryPercent + "%");
    }
}

// ElectricCar tesla = new ElectricCar("Tesla", 2024, 95);
// tesla.startEngine();
// Output:
// Engine starting...
// Electric motor humming. Battery: 95%`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class Vehicle:
    def __init__(self, make, year):
        self.make = make
        self.year = year

    def start_engine(self):
        print("Engine starting...")  # base behavior


class ElectricCar(Vehicle):
    def __init__(self, make, year, battery_percent):
        super().__init__(make, year)  # call parent constructor
        self.battery_percent = battery_percent

    def start_engine(self):
        super().start_engine()  # run parent's version first
        print(f"Electric motor humming. Battery: {self.battery_percent}%")


tesla = ElectricCar("Tesla", 2024, 95)
tesla.start_engine()
# Output:
# Engine starting...
# Electric motor humming. Battery: 95%`,
          },
        ],
        keyTakeaway:
          'Use super to call parent constructors and methods — extend behavior without duplicating code.',
      },
      {
        title: 'Types of Inheritance',
        content:
          'There are several forms of inheritance:\n\n1. **Single** — One parent, one child (Dog extends Animal).\n2. **Multilevel** — Chain: Animal → Dog → GuideDog.\n3. **Hierarchical** — One parent, many children: Animal → Dog, Cat, Bird.\n4. **Multiple** — One child inherits from multiple parents. Java does NOT support this with classes (uses interfaces instead). Python supports it.\n\nThe **diamond problem** occurs with multiple inheritance when two parents share a common grandparent. Python resolves this with MRO (Method Resolution Order).',
        cards: [
          { title: 'Single', description: 'One parent, one child: Animal -> Dog', icon: '↓', color: 'blue' },
          { title: 'Multilevel', description: 'Chain: Animal -> Dog -> GuideDog', icon: '⬇️', color: 'emerald' },
          { title: 'Hierarchical', description: 'One parent, many children: Animal -> Dog, Cat, Bird', icon: '🌿', color: 'purple' },
          { title: 'Multiple', description: 'Two parents -> one child. Python yes, Java uses interfaces.', icon: '🔀', color: 'amber' },
        ],
        keyTakeaway:
          'Java supports single, multilevel, and hierarchical inheritance with classes. Python also supports multiple inheritance.',
      },
      {
        title: 'When NOT to Use Inheritance',
        content:
          'Inheritance is powerful but often overused. Avoid it when:\n\n- There is no clear **"is-a"** relationship (a `Stack` is NOT an `ArrayList`).\n- You only need a few methods from the parent (use composition instead).\n- The hierarchy is more than 3 levels deep (becomes brittle).\n- You find yourself overriding most parent methods (the parent is wrong for you).\n\nRule of thumb: **Favor composition over inheritance** unless the "is-a" relationship is crystal clear.',
        keyTakeaway:
          'Use inheritance for clear "is-a" relationships. Favor composition when the relationship is "has-a".',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to call super() in the child constructor',
        explanation:
          'In Java, if the parent has no no-arg constructor, you MUST call super(...) explicitly. In Python, forgetting super().__init__() means parent fields are never initialized.',
      },
      {
        mistake: 'Creating deep inheritance hierarchies',
        explanation:
          'A → B → C → D → E is fragile. A change in A can break E in unexpected ways. Keep hierarchies shallow (2-3 levels max).',
      },
      {
        mistake: 'Using inheritance for code reuse alone',
        explanation:
          'Inheritance should model "is-a" relationships, not just share code. A Penguin "is-a" Bird, but if Bird has fly(), Penguin breaks the contract. Use composition for code sharing.',
      },
      {
        mistake: 'Overriding methods without calling super',
        explanation:
          'If the parent method has important setup logic (like logging or validation), overriding without super() skips that logic silently.',
      },
    ],
    practiceQuestions: [
      'Create a Shape base class with area() and a Circle child class that overrides it.',
      'Explain the difference between method overriding and method overloading.',
      'What is the diamond problem? How does Python solve it?',
      'Why should you prefer composition over inheritance? Give an example where inheritance is wrong.',
      'Build a 3-level hierarchy: Vehicle → Car → ElectricCar, each adding new behavior.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What keyword is used to inherit from a class in Java?',
        options: ['implements', 'inherits', 'extends', 'super'],
        answer: 'extends',
        explanation: 'In Java, the extends keyword is used to create a subclass that inherits from a parent class. For example: class Dog extends Animal.',
      },
      {
        type: 'mcq',
        question: 'Which type of inheritance is NOT directly supported in Java?',
        options: ['Single inheritance', 'Multilevel inheritance', 'Multiple inheritance of classes', 'Hierarchical inheritance'],
        answer: 'Multiple inheritance of classes',
        explanation: 'Java does not support multiple inheritance of classes (a class extending two classes) to avoid the diamond problem. However, a class can implement multiple interfaces.',
      },
      {
        type: 'short-answer',
        question: 'What does the super keyword do in inheritance?',
        answer: 'It refers to the parent class, allowing access to parent methods and constructors',
        explanation: 'The super keyword is used to call the parent class constructor (super()) or to invoke a parent method that has been overridden in the child class (super.methodName()).',
      },
      {
        type: 'mcq',
        question: 'When a child class provides its own version of a method already defined in the parent, this is called:',
        options: ['Method overloading', 'Method overriding', 'Method hiding', 'Method chaining'],
        answer: 'Method overriding',
        explanation: 'Method overriding occurs when a subclass provides a specific implementation for a method that is already defined in its parent class. The method signature must match exactly.',
      },
      {
        type: 'short-answer',
        question: 'What annotation should you use in Java when overriding a parent method?',
        answer: '@Override',
        explanation: 'The @Override annotation tells the compiler you intend to override a parent method. If the method signature does not match any parent method, the compiler will throw an error, catching bugs early.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     5. POLYMORPHISM
     ────────────────────────────────────────────── */
  'polymorphism': {
    steps: [
      {
        title: 'One Word, Many Meanings',
        content:
          'The word "open" means different things depending on context — open a door, open a file, open a browser. You use the **same word** but the **behavior changes** based on what you are opening. That is polymorphism: one interface, many implementations.\n\nIn Greek, "poly" = many, "morph" = forms. Polymorphism lets you write code that works with a general type but automatically uses the correct specific behavior at runtime.',
        analogy:
          'A universal remote control has a "power" button. Press it for a TV — it turns on the TV. Press it for a speaker — it turns on the speaker. Same button, different behavior depending on the device.',
        keyTakeaway:
          'Polymorphism = one interface, many forms. Same method call, different behavior based on the actual object.',
      },
      {
        title: 'Compile-Time Polymorphism (Method Overloading)',
        content:
          'Method **overloading** means having multiple methods with the **same name** but **different parameters** in the same class. The compiler decides which version to call based on the arguments you pass. This is resolved at **compile time**.\n\nPython does not support traditional overloading (latest definition wins), but you can simulate it with default arguments or `*args`.',
        code: [
          {
            language: 'java',
            label: 'Java — Method Overloading',
            code: `public class Calculator {
    // Same method name, different parameter lists

    // Version 1: two integers
    public int add(int a, int b) {
        return a + b;
    }

    // Version 2: three integers
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Version 3: two doubles
    public double add(double a, double b) {
        return a + b;
    }

    // Version 4: string concatenation
    public String add(String a, String b) {
        return a + b;
    }
}

// Calculator calc = new Calculator();
// calc.add(2, 3);         // calls Version 1 → 5
// calc.add(2, 3, 4);      // calls Version 2 → 9
// calc.add(2.5, 3.5);     // calls Version 3 → 6.0
// calc.add("Hello", " World"); // calls Version 4 → "Hello World"`,
          },
          {
            language: 'python',
            label: 'Python — Simulating Overloading',
            code: `from functools import singledispatch

class Calculator:
    def add(self, *args):
        """Python uses *args or default params instead of overloading."""
        if len(args) == 2:
            return args[0] + args[1]       # two arguments
        elif len(args) == 3:
            return args[0] + args[1] + args[2]  # three arguments
        else:
            raise ValueError("Expected 2 or 3 arguments")

calc = Calculator()
print(calc.add(2, 3))       # 5
print(calc.add(2, 3, 4))    # 9
print(calc.add(2.5, 3.5))   # 6.0
print(calc.add("Hi", " there"))  # "Hi there"`,
          },
        ],
        keyTakeaway:
          'Method overloading = same name, different parameters. Resolved at compile time (Java) or via dynamic dispatch (Python).',
      },
      {
        title: 'Runtime Polymorphism (Method Overriding)',
        content:
          'Method **overriding** happens when a child class redefines a parent\'s method. The actual method called depends on the **runtime type** of the object, not the variable type. This is the most powerful form of polymorphism.',
        code: [
          {
            language: 'java',
            label: 'Java — Runtime Polymorphism',
            code: `// Parent class
public abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    // Each shape calculates area differently
    public abstract double area();

    public void printInfo() {
        System.out.println(color + " shape with area: " + area());
    }
}

// Child class 1
public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;  // circle area formula
    }
}

// Child class 2
public class Rectangle extends Shape {
    private double width, height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;  // rectangle area formula
    }
}

// ✨ The magic: ONE method call, DIFFERENT behavior
Shape[] shapes = {
    new Circle("Red", 5),
    new Rectangle("Blue", 4, 6),
    new Circle("Green", 3)
};

for (Shape s : shapes) {
    s.printInfo();  // calls the correct area() for each shape
}
// Red shape with area: 78.54
// Blue shape with area: 24.0
// Green shape with area: 28.27`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `import math
from abc import ABC, abstractmethod

class Shape(ABC):
    def __init__(self, color):
        self.color = color

    @abstractmethod
    def area(self):
        pass  # subclasses MUST implement this

    def print_info(self):
        print(f"{self.color} shape with area: {self.area()}")


class Circle(Shape):
    def __init__(self, color, radius):
        super().__init__(color)
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2  # circle formula


class Rectangle(Shape):
    def __init__(self, color, width, height):
        super().__init__(color)
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height  # rectangle formula


# ONE method call, DIFFERENT behavior
shapes = [Circle("Red", 5), Rectangle("Blue", 4, 6), Circle("Green", 3)]
for s in shapes:
    s.print_info()
# Red shape with area: 78.54
# Blue shape with area: 24.00
# Green shape with area: 28.27`,
          },
        ],
        keyTakeaway:
          'Runtime polymorphism: the actual object type determines which overridden method runs.',
      },
      {
        title: 'Polymorphism with Interfaces',
        content:
          'Interfaces define a contract that multiple unrelated classes can implement. This is polymorphism at its most flexible — completely unrelated classes can be treated uniformly through a shared interface.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Interface = contract
public interface Printable {
    void print();  // any class that implements this MUST define print()
}

// Completely unrelated classes implementing the same interface
public class Invoice implements Printable {
    private double amount;
    public Invoice(double amount) { this.amount = amount; }

    @Override
    public void print() {
        System.out.println("Invoice: $" + amount);
    }
}

public class Report implements Printable {
    private String title;
    public Report(String title) { this.title = title; }

    @Override
    public void print() {
        System.out.println("Report: " + title);
    }
}

public class Photo implements Printable {
    private String filename;
    public Photo(String filename) { this.filename = filename; }

    @Override
    public void print() {
        System.out.println("Printing photo: " + filename);
    }
}

// Polymorphism: treat all as Printable
Printable[] items = { new Invoice(99.99), new Report("Q1 Sales"), new Photo("vacation.jpg") };
for (Printable item : items) {
    item.print();  // each class's own implementation runs
}`,
          },
        ],
        keyTakeaway:
          'Interfaces let completely unrelated classes be treated polymorphically through a shared contract.',
      },
      {
        title: 'Why Polymorphism Matters',
        content:
          'Polymorphism eliminates massive `if-else` chains. Without polymorphism, adding a new shape means finding and updating every `if (shape == "circle")` check in your entire codebase. With polymorphism, you just create a new class, override the method, and everything works.\n\nThis is the **Open/Closed Principle** in action: your code is open for extension (add new shapes) but closed for modification (no need to change existing code).',
        code: [
          {
            language: 'java',
            label: 'Without Polymorphism (BAD)',
            code: `// WITHOUT polymorphism — fragile if-else chain
public double calculateArea(String type, double[] dims) {
    if (type.equals("circle")) {
        return Math.PI * dims[0] * dims[0];
    } else if (type.equals("rectangle")) {
        return dims[0] * dims[1];
    } else if (type.equals("triangle")) {
        return 0.5 * dims[0] * dims[1];
    }
    // Adding a new shape? Must edit THIS function.
    // 50 shapes? 50 if-else branches. Nightmare.
    return 0;
}`,
          },
          {
            language: 'java',
            label: 'With Polymorphism (GOOD)',
            code: `// WITH polymorphism — clean and extensible
public double totalArea(Shape[] shapes) {
    double total = 0;
    for (Shape s : shapes) {
        total += s.area();  // each shape knows its own formula
    }
    return total;
    // Adding a new shape? Just create a new class.
    // This method NEVER changes. Zero modification.
}`,
          },
        ],
        keyTakeaway:
          'Polymorphism eliminates if-else chains and makes code extensible without modification.',
      },
      {
        title: 'Compile-Time vs Runtime — Summary',
        content:
          'Let us nail down the difference once and for all:',
        comparison: {
          leftTitle: 'Compile-Time (Overloading)',
          rightTitle: 'Runtime (Overriding)',
          items: [
            { left: 'Same class, same method name', right: 'Parent and child class' },
            { left: 'Different parameters', right: 'Same method signature' },
            { left: 'Resolved by compiler', right: 'Resolved at runtime by JVM' },
            { left: 'Also called static polymorphism', right: 'Also called dynamic polymorphism' },
            { left: 'Java supports natively', right: 'Both Java and Python support' },
          ],
        },
        keyTakeaway:
          'Overloading = compile-time (same class, different params). Overriding = runtime (parent-child, same signature).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Confusing overloading with overriding',
        explanation:
          'Overloading = same name, different parameters, same class. Overriding = same name, same parameters, parent-child classes.',
      },
      {
        mistake: 'Forgetting @Override annotation in Java',
        explanation:
          'Without @Override, if you accidentally misspell the method name, Java creates a new method instead of overriding. The annotation catches this at compile time.',
      },
      {
        mistake: 'Calling the child method on a parent reference without overriding',
        explanation:
          'If the method is not overridden in the child, the parent version runs. Polymorphism only works when the child actually overrides the method.',
      },
      {
        mistake: 'Thinking Python supports method overloading',
        explanation:
          'Python does not have native method overloading — the last definition wins. Use default parameters, *args, or @singledispatch instead.',
      },
    ],
    practiceQuestions: [
      'Create a Notification base class with send(). Implement Email, SMS, and Push child classes that override send().',
      'What is the difference between compile-time and runtime polymorphism?',
      'Show how polymorphism eliminates a switch-case for processing different payment types.',
      'Can you override a static method? Explain.',
      'Write a polymorphic calculateArea() function that works with any Shape.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Method overloading is an example of which type of polymorphism?',
        options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Dynamic dispatch', 'Late binding'],
        answer: 'Compile-time polymorphism',
        explanation: 'Method overloading (same method name, different parameters) is resolved at compile time based on the argument types. This is also called static polymorphism.',
      },
      {
        type: 'mcq',
        question: 'Method overriding is an example of which type of polymorphism?',
        options: ['Compile-time polymorphism', 'Static polymorphism', 'Runtime polymorphism', 'Parametric polymorphism'],
        answer: 'Runtime polymorphism',
        explanation: 'Method overriding is resolved at runtime based on the actual object type, not the reference type. The JVM decides which overridden method to call using dynamic dispatch.',
      },
      {
        type: 'short-answer',
        question: 'What does "polymorphism" literally mean?',
        answer: 'many forms',
        explanation: 'From Greek: "poly" = many, "morph" = forms. Polymorphism allows the same interface (method name) to exhibit different behaviors depending on the actual object type.',
      },
      {
        type: 'mcq',
        question: 'Given: Animal a = new Dog(); a.speak(); — which speak() method is called?',
        options: ['Animal\'s speak()', 'Dog\'s speak()', 'Depends on the compiler', 'Neither — it throws an error'],
        answer: 'Dog\'s speak()',
        explanation: 'Even though the reference type is Animal, the actual object is a Dog. At runtime, Java uses dynamic dispatch to call Dog\'s overridden speak() method. This is runtime polymorphism in action.',
      },
      {
        type: 'short-answer',
        question: 'Does Python support traditional method overloading like Java?',
        answer: 'No',
        explanation: 'Python does not support traditional method overloading. If you define two methods with the same name but different parameters, the latest definition wins. You can simulate overloading using default arguments or *args.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     6. ABSTRACTION
     ────────────────────────────────────────────── */
  'abstraction': {
    steps: [
      {
        title: 'The TV Remote',
        content:
          'You press the "volume up" button on a TV remote. The volume increases. But do you know how? Do you know about the infrared signal encoding, the digital-to-analog converter in the TV, or the amplifier circuit? No. And you do not need to. The remote **abstracts away** the complexity and gives you a simple button.\n\nAbstraction in OOP means **exposing only what is necessary** (the "what") and **hiding the implementation** (the "how").',
        analogy:
          'When you drive a car, you interact with a steering wheel and pedals. You do not manually control the fuel injectors, spark plugs, or transmission gears. The car presents an abstract interface to you, the driver.',
        keyTakeaway:
          'Abstraction hides complexity and shows only the relevant features to the user.',
      },
      {
        title: 'Abstraction vs Encapsulation',
        content:
          'These two are often confused:\n\n- **Encapsulation** = Hiding the *data* (making fields private, using getters/setters). It is about **access control**.\n- **Abstraction** = Hiding the *complexity* (showing only what the user needs). It is about **simplifying the interface**.\n\nEncapsulation is a mechanism; abstraction is a design principle. Encapsulation *helps achieve* abstraction, but they solve different problems.',
        comparison: {
          leftTitle: 'Encapsulation',
          rightTitle: 'Abstraction',
          items: [
            { left: 'Hides DATA (fields)', right: 'Hides COMPLEXITY (details)' },
            { left: 'Uses access modifiers', right: 'Uses abstract classes / interfaces' },
            { left: 'About access control', right: 'About simplifying the interface' },
            { left: 'Implementation technique', right: 'Design principle' },
          ],
        },
        keyTakeaway:
          'Encapsulation hides data; abstraction hides complexity. They complement each other.',
      },
      {
        title: 'Abstract Classes',
        content:
          'An **abstract class** is a class that cannot be instantiated directly — it serves as a template. It can contain:\n\n- **Abstract methods** — declared but not implemented (children MUST override these).\n- **Concrete methods** — fully implemented (children inherit these).\n\nThink of it as a blueprint that is intentionally incomplete — it forces child classes to fill in the blanks.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Abstract class — cannot create "new PaymentProcessor()" directly
public abstract class PaymentProcessor {
    protected String merchantName;

    public PaymentProcessor(String merchantName) {
        this.merchantName = merchantName;
    }

    // Abstract method — NO body, children MUST implement
    public abstract boolean processPayment(double amount);

    // Abstract method — children decide how to issue refunds
    public abstract boolean refund(String transactionId);

    // Concrete method — shared by all children, fully implemented
    public void printReceipt(double amount, String type) {
        System.out.println("=== " + merchantName + " ===");
        System.out.println(type + ": $" + amount);
        System.out.println("Thank you!");
    }
}`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

# Abstract class — cannot create PaymentProcessor() directly
class PaymentProcessor(ABC):
    def __init__(self, merchant_name):
        self.merchant_name = merchant_name

    @abstractmethod
    def process_payment(self, amount):
        """Children MUST implement this."""
        pass

    @abstractmethod
    def refund(self, transaction_id):
        """Children MUST implement this."""
        pass

    # Concrete method — shared by all children
    def print_receipt(self, amount, payment_type):
        print(f"=== {self.merchant_name} ===")
        print(f"{payment_type}: \\\${amount}")
        print("Thank you!")`,
          },
        ],
        keyTakeaway:
          'Abstract classes define what children must do (abstract methods) while providing shared behavior (concrete methods).',
      },
      {
        title: 'Implementing the Abstract Class',
        content:
          'Now let us create concrete payment processors. Each one implements the abstract methods differently, but they all share the receipt printing logic.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Concrete class 1: Credit Card payments
public class CreditCardProcessor extends PaymentProcessor {
    private String cardNetwork;  // Visa, Mastercard, etc.

    public CreditCardProcessor(String merchantName, String cardNetwork) {
        super(merchantName);
        this.cardNetwork = cardNetwork;
    }

    @Override
    public boolean processPayment(double amount) {
        // Credit-card-specific logic (connect to card network, verify, charge)
        System.out.println("Charging $" + amount + " via " + cardNetwork);
        printReceipt(amount, "Credit Card");  // reuse parent method
        return true;
    }

    @Override
    public boolean refund(String transactionId) {
        System.out.println("Refunding via " + cardNetwork + ": " + transactionId);
        return true;
    }
}

// Concrete class 2: PayPal payments
public class PayPalProcessor extends PaymentProcessor {
    private String email;

    public PayPalProcessor(String merchantName, String email) {
        super(merchantName);
        this.email = email;
    }

    @Override
    public boolean processPayment(double amount) {
        // PayPal-specific logic (redirect to PayPal, authenticate, charge)
        System.out.println("PayPal charge $" + amount + " to " + email);
        printReceipt(amount, "PayPal");
        return true;
    }

    @Override
    public boolean refund(String transactionId) {
        System.out.println("PayPal refund to " + email + ": " + transactionId);
        return true;
    }
}

// Usage — the caller does not care HOW the payment is processed
PaymentProcessor processor = new CreditCardProcessor("Amazon", "Visa");
processor.processPayment(49.99);  // abstracted!`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class CreditCardProcessor(PaymentProcessor):
    def __init__(self, merchant_name, card_network):
        super().__init__(merchant_name)
        self.card_network = card_network  # Visa, Mastercard, etc.

    def process_payment(self, amount):
        print(f"Charging \\\${amount} via {self.card_network}")
        self.print_receipt(amount, "Credit Card")
        return True

    def refund(self, transaction_id):
        print(f"Refunding via {self.card_network}: {transaction_id}")
        return True


class PayPalProcessor(PaymentProcessor):
    def __init__(self, merchant_name, email):
        super().__init__(merchant_name)
        self.email = email

    def process_payment(self, amount):
        print(f"PayPal charge \\\${amount} to {self.email}")
        self.print_receipt(amount, "PayPal")
        return True

    def refund(self, transaction_id):
        print(f"PayPal refund to {self.email}: {transaction_id}")
        return True


# Caller does not care HOW payment is processed
processor = CreditCardProcessor("Amazon", "Visa")
processor.process_payment(49.99)  # abstracted!`,
          },
        ],
        keyTakeaway:
          'Concrete classes implement abstract methods, each with their own logic. Callers interact with the abstract interface.',
      },
      {
        title: 'Real-World Abstraction Layers',
        content:
          'Abstraction is everywhere in software:\n\n- **JDBC** abstracts database connections — your code works with MySQL, PostgreSQL, or Oracle without changes.\n- **File I/O** abstracts storage — `read()` works whether the data is on an SSD, HDD, or network drive.\n- **HTTP Client** abstracts network calls — you do not handle TCP sockets manually.\n- **ORM (Hibernate, SQLAlchemy)** abstracts SQL — you work with objects, not raw queries.\n\nEvery layer of software is an abstraction over the layer below it.',
        keyTakeaway:
          'Abstraction layers are everywhere: databases, file systems, networks, ORMs. Each hides complexity below.',
      },
      {
        title: 'When to Use Abstraction',
        content:
          'Use abstract classes when:\n\n1. You have a **common interface** but each implementation is different (payment processors, notification senders).\n2. You want to **enforce** that subclasses implement specific methods.\n3. You have **shared code** that all subclasses reuse (concrete methods in the abstract class).\n4. You want to **program to an interface**, not an implementation.\n\nDo NOT use abstraction when a simple concrete class suffices. Over-abstraction adds complexity without benefit.',
        keyTakeaway:
          'Use abstraction when you have a common interface with varying implementations. Avoid it for simple, one-off classes.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Confusing abstraction with encapsulation',
        explanation:
          'Encapsulation hides data (private fields). Abstraction hides complexity (abstract methods/interfaces). They are complementary, not the same.',
      },
      {
        mistake: 'Trying to instantiate an abstract class',
        explanation:
          'Abstract classes cannot be instantiated directly. You must create a concrete subclass that implements all abstract methods.',
      },
      {
        mistake: 'Over-abstracting simple code',
        explanation:
          'Creating an abstract class with one implementation is pointless overhead. Abstract when you have (or foresee) multiple implementations.',
      },
      {
        mistake: 'Forgetting to implement all abstract methods',
        explanation:
          'If a concrete class fails to implement even one abstract method, it becomes abstract itself and cannot be instantiated.',
      },
    ],
    practiceQuestions: [
      'Create an abstract NotificationSender with send(). Implement EmailSender, SmsSender, and PushSender.',
      'Explain the difference between abstraction and encapsulation with examples.',
      'Name 3 real-world abstraction layers you use daily as a programmer.',
      'When would you use an abstract class vs a regular class?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is the key difference between abstraction and encapsulation?',
        options: ['They are the same thing', 'Abstraction hides complexity; encapsulation hides data', 'Encapsulation hides complexity; abstraction hides data', 'Abstraction is for interfaces; encapsulation is for classes'],
        answer: 'Abstraction hides complexity; encapsulation hides data',
        explanation: 'Abstraction focuses on hiding implementation complexity and showing only relevant features (the "what"). Encapsulation focuses on hiding data by restricting access to internal fields (access control).',
      },
      {
        type: 'mcq',
        question: 'Can you create an instance of an abstract class directly?',
        options: ['Yes, always', 'Yes, if it has a constructor', 'No, abstract classes cannot be instantiated', 'Only in Python'],
        answer: 'No, abstract classes cannot be instantiated',
        explanation: 'Abstract classes are incomplete by design — they contain abstract methods without implementations. You must create a concrete subclass that implements all abstract methods before instantiation.',
      },
      {
        type: 'short-answer',
        question: 'What keyword is used to declare an abstract class in Java?',
        answer: 'abstract',
        explanation: 'In Java, you use the abstract keyword before the class declaration: public abstract class Shape { ... }. This prevents direct instantiation and allows abstract method declarations.',
      },
      {
        type: 'mcq',
        question: 'Which of the following is a real-world example of abstraction?',
        options: ['A locked safe', 'A car dashboard hiding engine details', 'A password-protected file', 'A private variable'],
        answer: 'A car dashboard hiding engine details',
        explanation: 'A car dashboard abstracts away the complexity of the engine, transmission, and fuel injection, giving you simple controls (steering wheel, pedals). A locked safe and password-protected file are examples of encapsulation (access control).',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     7. INTERFACES & ABSTRACT CLASSES
     ────────────────────────────────────────────── */
  'interfaces-and-abstract-classes': {
    steps: [
      {
        title: 'Contracts and Job Descriptions',
        content:
          'An **interface** is a contract — it says "any class that signs this contract MUST provide these methods." It defines **what** must be done but says nothing about **how**.\n\nAn **abstract class** is more like a job description with some training materials included — it says what you must do (abstract methods) AND provides some ready-made procedures (concrete methods).',
        analogy:
          'Think of a job posting: "Must be able to code in Java, communicate with clients, and write tests." That is an interface — a list of capabilities. Now think of a training manual that teaches you the company\'s specific communication templates but leaves coding style up to you. That is an abstract class — partial implementation.',
        keyTakeaway:
          'Interfaces define pure contracts (what). Abstract classes define contracts plus shared behavior (what + some how).',
      },
      {
        title: 'Interfaces in Java',
        content:
          'In Java, an interface contains:\n\n- **Abstract methods** (implicitly `public abstract`)\n- **Default methods** (Java 8+ — methods with a body)\n- **Static methods** (Java 8+ — utility methods)\n- **Constants** (implicitly `public static final`)\n\nA class **implements** an interface and can implement **multiple** interfaces — this is Java\'s answer to multiple inheritance.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Interface 1: Flyable — anything that can fly
public interface Flyable {
    void fly();                          // abstract — must implement
    double getMaxAltitude();             // abstract — must implement

    default void land() {                // default — optional to override
        System.out.println("Landing safely...");
    }
}

// Interface 2: Swimmable — anything that can swim
public interface Swimmable {
    void swim();
    double getMaxDepth();
}

// A Duck can BOTH fly AND swim — multiple interfaces!
public class Duck implements Flyable, Swimmable {
    @Override
    public void fly() {
        System.out.println("Duck flying with flapping wings");
    }

    @Override
    public double getMaxAltitude() { return 6000; }  // meters

    @Override
    public void swim() {
        System.out.println("Duck paddling on water");
    }

    @Override
    public double getMaxDepth() { return 2; }  // meters

    // land() is inherited from Flyable's default method
}

// An Airplane can fly but not swim
public class Airplane implements Flyable {
    @Override
    public void fly() { System.out.println("Airplane cruising at 30,000 ft"); }

    @Override
    public double getMaxAltitude() { return 12000; }
}`,
          },
        ],
        keyTakeaway:
          'Java interfaces define contracts. Classes can implement multiple interfaces, enabling multiple inheritance of behavior.',
      },
      {
        title: 'Abstract Classes in Python (ABC)',
        content:
          'Python uses the `abc` module to create abstract classes. Since Python supports multiple inheritance with classes directly, the line between interfaces and abstract classes is blurrier. Python developers often use abstract classes (ABCs) where Java developers would use interfaces.',
        code: [
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

# "Interface-like" abstract class
class Flyable(ABC):
    @abstractmethod
    def fly(self):
        pass

    @abstractmethod
    def get_max_altitude(self):
        pass

    def land(self):  # concrete method (like Java default)
        print("Landing safely...")


class Swimmable(ABC):
    @abstractmethod
    def swim(self):
        pass

    @abstractmethod
    def get_max_depth(self):
        pass


# Multiple inheritance — Duck "implements" both
class Duck(Flyable, Swimmable):
    def fly(self):
        print("Duck flying with flapping wings")

    def get_max_altitude(self):
        return 6000

    def swim(self):
        print("Duck paddling on water")

    def get_max_depth(self):
        return 2


class Airplane(Flyable):
    def fly(self):
        print("Airplane cruising at 30,000 ft")

    def get_max_altitude(self):
        return 12000


duck = Duck()
duck.fly()    # Duck flying with flapping wings
duck.swim()   # Duck paddling on water
duck.land()   # Landing safely... (inherited concrete method)`,
          },
        ],
        keyTakeaway:
          'Python uses ABCs for interfaces. Multiple inheritance of ABCs achieves what Java does with multiple interfaces.',
      },
      {
        title: 'When to Use Interface vs Abstract Class',
        content:
          'This is one of the most common interview questions. Here is the decision framework:',
        table: {
          headers: ['Criteria', 'Interface', 'Abstract Class'],
          rows: [
            ['Relationship', '"can-do" (Flyable, Printable)', '"is-a" (Animal, Vehicle)'],
            ['Multiple', 'Yes (implement many)', 'No (extend one) in Java'],
            ['State (fields)', 'No instance fields', 'Yes, can have fields'],
            ['Constructors', 'No', 'Yes'],
            ['Implementation', 'None (or default)', 'Partial or full'],
            ['When to use', 'Unrelated classes sharing behavior', 'Related classes sharing code + state'],
          ],
        },
        code: [
          {
            language: 'java',
            label: 'Java — Decision Example',
            code: `// USE INTERFACE when unrelated classes share a capability
// A Dog and a Printer can both be "Loggable" — they are unrelated
public interface Loggable {
    void log(String message);
}

// USE ABSTRACT CLASS when related classes share state + behavior
// Car and Truck are both Vehicles — they share engine, speed, etc.
public abstract class Vehicle {
    protected String make;       // shared state
    protected double speed;

    public Vehicle(String make) {
        this.make = make;
        this.speed = 0;
    }

    public void accelerate(double amount) {  // shared behavior
        speed += amount;
    }

    public abstract double fuelEfficiency();  // different per vehicle
}`,
          },
        ],
        keyTakeaway:
          'Use interfaces for "can-do" capabilities across unrelated classes. Use abstract classes for "is-a" hierarchies with shared state.',
      },
      {
        title: 'Interface Segregation in Action',
        content:
          'A common mistake is creating "fat" interfaces that force implementers to provide methods they do not need. Instead, create small, focused interfaces and let classes implement only what they need.',
        code: [
          {
            language: 'java',
            label: 'BAD — Fat Interface',
            code: `// BAD: One giant interface forces all implementers to handle everything
public interface Worker {
    void code();
    void test();
    void design();
    void manage();
    void presentToClient();
}

// A junior developer has to implement manage() and presentToClient()
// even though they never do those things. Forced to write empty stubs.`,
          },
          {
            language: 'java',
            label: 'GOOD — Segregated Interfaces',
            code: `// GOOD: Small, focused interfaces
public interface Coder { void code(); }
public interface Tester { void test(); }
public interface Designer { void design(); }
public interface Manager { void manage(); void presentToClient(); }

// Each role implements only what applies
public class JuniorDev implements Coder, Tester {
    @Override public void code() { System.out.println("Writing code"); }
    @Override public void test() { System.out.println("Writing tests"); }
}

public class TechLead implements Coder, Tester, Manager {
    @Override public void code() { System.out.println("Reviewing code"); }
    @Override public void test() { System.out.println("Reviewing tests"); }
    @Override public void manage() { System.out.println("Sprint planning"); }
    @Override public void presentToClient() { System.out.println("Demo time"); }
}`,
          },
        ],
        keyTakeaway:
          'Keep interfaces small and focused. Do not force classes to implement methods they do not need.',
      },
      {
        title: 'Protocols in Python (Structural Typing)',
        content:
          'Python 3.8+ introduced `Protocol` from `typing`, which enables **structural typing** (duck typing with type checking). A class does not need to explicitly inherit from a Protocol — it just needs to have the right methods.',
        code: [
          {
            language: 'python',
            label: 'Python — Protocol',
            code: `from typing import Protocol

# Protocol — structural typing (duck typing + type hints)
class Drawable(Protocol):
    def draw(self) -> None: ...  # must have this method signature

class Circle:
    def draw(self) -> None:
        print("Drawing circle")  # has draw() — matches Protocol

class Square:
    def draw(self) -> None:
        print("Drawing square")  # has draw() — matches Protocol

# Works with any object that has draw() — no inheritance needed!
def render(shape: Drawable) -> None:
    shape.draw()

render(Circle())  # Drawing circle
render(Square())  # Drawing square
# render(42)      # Type checker error: int has no draw()`,
          },
        ],
        keyTakeaway:
          'Python Protocols enable duck typing with type safety — classes match by structure, not inheritance.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using an abstract class when an interface suffices',
        explanation:
          'If you do not need shared state or constructors, prefer an interface. It is more flexible and allows multiple implementation.',
      },
      {
        mistake: 'Creating fat interfaces with too many methods',
        explanation:
          'Large interfaces force implementers to write stub methods they do not need. Split into smaller, focused interfaces.',
      },
      {
        mistake: 'Not understanding Java default methods',
        explanation:
          'Since Java 8, interfaces can have default methods with implementations. This blurs the line with abstract classes but is useful for adding methods without breaking existing implementations.',
      },
    ],
    practiceQuestions: [
      'Create Serializable and Deserializable interfaces. Implement them for JSON and XML classes.',
      'When would you choose an abstract class over an interface?',
      'What is the diamond problem with interfaces? How does Java handle it?',
      'Refactor a fat Worker interface into segregated interfaces. Show the before and after.',
      'Explain Python\'s Protocol and how it differs from ABC.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What keyword does a Java class use to adopt an interface?',
        options: ['extends', 'implements', 'inherits', 'uses'],
        answer: 'implements',
        explanation: 'In Java, a class uses the implements keyword to adopt an interface: class Dog implements Walkable, Barkable. A class can implement multiple interfaces.',
      },
      {
        type: 'mcq',
        question: 'Can a Java class implement multiple interfaces?',
        options: ['No, only one interface is allowed', 'Yes, and this is Java\'s answer to multiple inheritance', 'Only if the interfaces have no default methods', 'Only with Java 11+'],
        answer: 'Yes, and this is Java\'s answer to multiple inheritance',
        explanation: 'Java does not allow multiple class inheritance but allows a class to implement multiple interfaces. This provides the benefits of multiple inheritance without the diamond problem.',
      },
      {
        type: 'short-answer',
        question: 'In Python, what module provides the ABC class for creating abstract base classes?',
        answer: 'abc',
        explanation: 'Python\'s abc module provides the ABC class and @abstractmethod decorator. You create abstract classes by inheriting from ABC and decorating methods with @abstractmethod.',
      },
      {
        type: 'mcq',
        question: 'When should you use an interface over an abstract class?',
        options: ['When you need shared state between subclasses', 'When you want to define a pure contract with no implementation', 'When you need a constructor', 'When you have only one implementing class'],
        answer: 'When you want to define a pure contract with no implementation',
        explanation: 'Interfaces define pure contracts (what must be done). Use an abstract class when you need shared code or state. Use an interface when unrelated classes need to share a capability.',
      },
      {
        type: 'short-answer',
        question: 'What is structural typing (duck typing) in Python, and how do Protocols support it?',
        answer: 'Structural typing checks if an object has required methods regardless of its class hierarchy; Protocols define expected method signatures without requiring explicit inheritance',
        explanation: 'Python Protocols (typing.Protocol) enable structural typing — if a class has the right methods, it satisfies the protocol without explicitly inheriting from it. This is "duck typing" with type checker support.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     8. SOLID PRINCIPLES
     ────────────────────────────────────────────── */
  'solid-principles': {
    steps: [
      {
        title: 'Why SOLID?',
        content:
          'SOLID is a set of five principles that make object-oriented code **maintainable**, **extensible**, and **testable**. They were introduced by Robert C. Martin (Uncle Bob) and are considered the gold standard for OOP design.\n\nThink of SOLID as the building codes for software architecture — you CAN build without them, but your building will eventually collapse.',
        analogy:
          'Imagine building a house without any structural engineering principles. It might stand for a while, but the moment you try to add a second floor (new feature) or fix the plumbing (bug fix), the whole thing comes crashing down. SOLID principles are your structural engineering.',
        keyTakeaway:
          'SOLID = five principles for writing maintainable, extensible, and testable OOP code.',
      },
      {
        title: 'S — Single Responsibility Principle',
        content:
          '**A class should have only one reason to change.**\n\nEvery class should do ONE thing and do it well. If a class handles user authentication AND sends emails AND generates reports, changing any one of those features risks breaking the others.',
        analogy:
          'Think of a Swiss army knife vs dedicated tools. A Swiss army knife does everything badly. A chef\'s knife cuts perfectly, a screwdriver drives screws perfectly. Each tool has ONE job.',
        code: [
          {
            language: 'java',
            label: 'BAD — Multiple Responsibilities',
            code: `// BAD: This class does THREE unrelated things
public class UserService {
    public void createUser(String name, String email) {
        // 1. Database logic
        // 2. Email sending
        // 3. Logging
        System.out.println("INSERT INTO users...");     // DB responsibility
        System.out.println("Sending welcome email...");  // Email responsibility
        System.out.println("LOG: User created");          // Logging responsibility
    }
    // If email format changes, you edit a DB class. Bad coupling.
}`,
          },
          {
            language: 'java',
            label: 'GOOD — Single Responsibility',
            code: `// GOOD: Each class does ONE thing
public class UserRepository {
    public void save(User user) {
        System.out.println("INSERT INTO users...");  // only DB logic
    }
}

public class EmailService {
    public void sendWelcomeEmail(User user) {
        System.out.println("Sending welcome email to " + user.getEmail());
    }
}

public class UserService {
    private final UserRepository repo;
    private final EmailService emailService;

    public UserService(UserRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    public void createUser(String name, String email) {
        User user = new User(name, email);
        repo.save(user);                    // delegate DB work
        emailService.sendWelcomeEmail(user); // delegate email work
    }
}`,
          },
        ],
        keyTakeaway:
          'One class = one responsibility = one reason to change.',
      },
      {
        title: 'O — Open/Closed Principle',
        content:
          '**Software entities should be open for extension but closed for modification.**\n\nYou should be able to add new behavior WITHOUT changing existing code. This is achieved through polymorphism and abstraction.',
        analogy:
          'Think of a power outlet on your wall. You can plug in a phone charger, a lamp, a blender — any device. You NEVER rewire the outlet to support a new device. The outlet is CLOSED for modification but OPEN for extension.',
        code: [
          {
            language: 'python',
            label: 'BAD — Must Modify to Extend',
            code: `# BAD: Adding a new discount type requires modifying this function
def calculate_discount(customer_type, amount):
    if customer_type == "regular":
        return amount * 0.05
    elif customer_type == "premium":
        return amount * 0.10
    elif customer_type == "vip":      # <-- Had to MODIFY existing code
        return amount * 0.20
    # Every new type means touching this function. Fragile.`,
          },
          {
            language: 'python',
            label: 'GOOD — Open for Extension',
            code: `# GOOD: New discount types require ZERO changes to existing code
from abc import ABC, abstractmethod

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount):
        pass

class RegularDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.05

class PremiumDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.10

# Adding VIP? Just create a new class. Nothing else changes.
class VipDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.20

def apply_discount(strategy: DiscountStrategy, amount: float):
    return strategy.calculate(amount)  # works with ANY discount type`,
          },
        ],
        keyTakeaway:
          'Extend behavior by adding new classes, not by modifying existing ones.',
      },
      {
        title: 'L — Liskov Substitution Principle',
        content:
          '**Subtypes must be substitutable for their base types.**\n\nIf your code works with a parent class, it should work identically with any child class. A child should NEVER break the parent\'s contract.',
        analogy:
          'If it looks like a duck and quacks like a duck, it should BE a duck. If you replace a regular duck with a rubber duck in a pond, and someone tries to make it swim (it sinks), you violated LSP.',
        code: [
          {
            language: 'java',
            label: 'BAD — Violates LSP',
            code: `// BAD: Penguin breaks the Bird contract
public class Bird {
    public void fly() {
        System.out.println("Flying...");
    }
}

public class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
        // Code that expects Bird.fly() to work will CRASH here.
        // Penguin is NOT substitutable for Bird. LSP violated!
    }
}`,
          },
          {
            language: 'java',
            label: 'GOOD — Respects LSP',
            code: `// GOOD: Separate flying from non-flying birds
public abstract class Bird {
    public abstract void move();  // all birds can move somehow
}

public interface Flyable {
    void fly();
}

public class Sparrow extends Bird implements Flyable {
    @Override
    public void move() { fly(); }

    @Override
    public void fly() {
        System.out.println("Sparrow flying");
    }
}

public class Penguin extends Bird {
    @Override
    public void move() {
        System.out.println("Penguin waddling");  // no fly() — no violation
    }
}`,
          },
        ],
        keyTakeaway:
          'Child classes must honor the parent\'s contract. If substitution breaks things, the hierarchy is wrong.',
      },
      {
        title: 'I — Interface Segregation Principle',
        content:
          '**Clients should not be forced to depend on interfaces they do not use.**\n\nDo not create one massive interface. Split it into smaller, specific ones so that implementing classes only need to handle what is relevant to them.',
        analogy:
          'Imagine a restaurant menu where vegetarians must read through 50 meat dishes to find their 5 options. That is a fat interface. Instead, split the menu into sections: Appetizers, Mains, Vegetarian, Desserts. Each customer reads only what is relevant.',
        code: [
          {
            language: 'python',
            label: 'BAD vs GOOD',
            code: `# BAD: Fat interface — printer must handle scan and fax?!
class MultiFunctionDevice(ABC):
    @abstractmethod
    def print_doc(self): pass
    @abstractmethod
    def scan(self): pass
    @abstractmethod
    def fax(self): pass

class SimplePrinter(MultiFunctionDevice):
    def print_doc(self): print("Printing...")
    def scan(self): raise NotImplementedError("I can't scan!")   # forced stub
    def fax(self): raise NotImplementedError("I can't fax!")     # forced stub

# GOOD: Segregated interfaces
class Printable(ABC):
    @abstractmethod
    def print_doc(self): pass

class Scannable(ABC):
    @abstractmethod
    def scan(self): pass

class Faxable(ABC):
    @abstractmethod
    def fax(self): pass

class SimplePrinter(Printable):
    def print_doc(self): print("Printing...")  # only what it can do

class AllInOnePrinter(Printable, Scannable, Faxable):
    def print_doc(self): print("Printing...")
    def scan(self): print("Scanning...")
    def fax(self): print("Faxing...")`,
          },
        ],
        keyTakeaway:
          'Many small interfaces > one big interface. Classes should only implement what they need.',
      },
      {
        title: 'D — Dependency Inversion Principle',
        content:
          '**High-level modules should not depend on low-level modules. Both should depend on abstractions.**\n\nDo not hardcode dependencies. Instead, depend on interfaces/abstract classes and inject the concrete implementations.',
        analogy:
          'A wall socket lets you plug in ANY device — it depends on the plug standard (abstraction), not on a specific device. If your house was hardwired to a specific lamp, replacing it would mean rewiring the house. The plug standard (interface) inverts the dependency.',
        code: [
          {
            language: 'python',
            label: 'BAD vs GOOD',
            code: `# BAD: High-level class depends on low-level concrete class
class MySQLDatabase:
    def query(self, sql):
        return f"MySQL executing: {sql}"

class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # HARDCODED! Can't switch to PostgreSQL

    def get_user(self, user_id):
        return self.db.query(f"SELECT * FROM users WHERE id={user_id}")


# GOOD: Depend on abstraction, inject implementation
class Database(ABC):
    @abstractmethod
    def query(self, sql): pass

class MySQLDatabase(Database):
    def query(self, sql):
        return f"MySQL: {sql}"

class PostgreSQLDatabase(Database):
    def query(self, sql):
        return f"PostgreSQL: {sql}"

class UserService:
    def __init__(self, db: Database):  # depends on ABSTRACTION
        self.db = db                   # injected from outside

    def get_user(self, user_id):
        return self.db.query(f"SELECT * FROM users WHERE id={user_id}")

# Easy to switch or test
service = UserService(PostgreSQLDatabase())  # inject any implementation
# For tests: service = UserService(MockDatabase())`,
          },
        ],
        keyTakeaway:
          'Depend on abstractions, not concrete implementations. Inject dependencies from outside.',
      },
      {
        title: 'SOLID Summary',
        content:
          'Let us recap all five principles with their one-line essence:',
        table: {
          headers: ['Letter', 'Principle', 'One-Liner'],
          rows: [
            ['S', 'Single Responsibility', 'One class, one job'],
            ['O', 'Open/Closed', 'Extend, do not modify'],
            ['L', 'Liskov Substitution', 'Subtypes must be swappable'],
            ['I', 'Interface Segregation', 'Small, focused interfaces'],
            ['D', 'Dependency Inversion', 'Depend on abstractions'],
          ],
        },
        keyTakeaway:
          'SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Applying SOLID dogmatically to trivial code',
        explanation:
          'A 50-line script does not need dependency injection and five interfaces. SOLID shines in large, evolving codebases.',
      },
      {
        mistake: 'Confusing Open/Closed with never changing existing code',
        explanation:
          'The principle means you DESIGN for extension. Bug fixes and refactors are fine — the point is that adding features should not require modifying stable code.',
      },
      {
        mistake: 'Violating Liskov by throwing exceptions in overridden methods',
        explanation:
          'If a parent method never throws, the child should not either. Throwing UnsupportedOperationException is a classic LSP violation.',
      },
      {
        mistake: 'Over-segregating interfaces into single-method fragments',
        explanation:
          'ISP says do not force unneeded methods, not that every method needs its own interface. Group related methods logically.',
      },
    ],
    practiceQuestions: [
      'Refactor a class that reads a CSV file, processes data, and sends emails into SRP-compliant classes.',
      'Show a before/after example of violating and then fixing the Open/Closed principle.',
      'Give a Liskov Substitution violation example with Rectangle/Square and explain why it breaks.',
      'Design segregated interfaces for a smart home device that can be a light, thermostat, and security camera.',
      'Refactor a hardcoded database dependency to use Dependency Inversion.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What does the "S" in SOLID stand for?',
        options: ['Serialization Principle', 'Single Responsibility Principle', 'Static Binding Principle', 'Substitution Principle'],
        answer: 'Single Responsibility Principle',
        explanation: 'The Single Responsibility Principle states that a class should have only one reason to change — it should do one thing and do it well.',
      },
      {
        type: 'short-answer',
        question: 'What does the Open/Closed Principle state?',
        answer: 'Classes should be open for extension but closed for modification',
        explanation: 'The Open/Closed Principle means you should be able to add new behavior (open for extension) without changing existing code (closed for modification). This is typically achieved through inheritance or composition.',
      },
      {
        type: 'mcq',
        question: 'The Liskov Substitution Principle states that:',
        options: ['Subclasses should hide parent methods', 'Objects of a superclass should be replaceable with objects of a subclass without breaking the program', 'Every class should implement all interfaces', 'Dependencies should be injected'],
        answer: 'Objects of a superclass should be replaceable with objects of a subclass without breaking the program',
        explanation: 'If class B is a subclass of class A, then you should be able to use B anywhere A is expected without unexpected behavior. The classic violation is Square extending Rectangle.',
      },
      {
        type: 'mcq',
        question: 'The Interface Segregation Principle recommends:',
        options: ['Using one large interface for everything', 'Many small, specific interfaces instead of one fat interface', 'Avoiding interfaces entirely', 'Using abstract classes instead of interfaces'],
        answer: 'Many small, specific interfaces instead of one fat interface',
        explanation: 'Clients should not be forced to depend on methods they do not use. Split large interfaces into smaller, focused ones so classes only implement what they actually need.',
      },
      {
        type: 'short-answer',
        question: 'Who introduced the SOLID principles?',
        answer: 'Robert C. Martin',
        explanation: 'Robert C. Martin (also known as Uncle Bob) introduced the SOLID principles. They are considered the gold standard for writing maintainable, extensible, and testable object-oriented code.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     9. DESIGN PATTERN: SINGLETON & FACTORY
     ────────────────────────────────────────────── */
  'design-pattern-singleton-factory': {
    steps: [
      {
        title: 'What Are Design Patterns?',
        content:
          'Design patterns are **proven solutions to recurring problems** in software design. They are not code you copy-paste — they are templates you adapt. Think of them as recipes: a recipe for chocolate cake gives you the structure, but you choose the brand of chocolate.\n\nThe Gang of Four (GoF) cataloged 23 patterns in three categories:\n- **Creational** — How objects are created (Singleton, Factory, Builder)\n- **Structural** — How objects are composed (Adapter, Decorator)\n- **Behavioral** — How objects communicate (Observer, Strategy)',
        keyTakeaway:
          'Design patterns are reusable solutions to common design problems, categorized as creational, structural, and behavioral.',
      },
      {
        title: 'Singleton Pattern — Only One President',
        content:
          'The Singleton pattern ensures a class has **exactly one instance** and provides a global access point to it.\n\nUse it when exactly one object is needed to coordinate actions: a database connection pool, a configuration manager, a logging service, or a cache.',
        analogy:
          'A country has exactly one president at any time. No matter how many people reference "the president," they are all talking about the same person. You cannot create a second president — the system ensures only one exists.',
        code: [
          {
            language: 'java',
            label: 'Java — Thread-Safe Singleton',
            code: `public class DatabaseConnection {
    // 1. Private static instance — the ONE object
    private static volatile DatabaseConnection instance;

    // 2. Private constructor — prevents external instantiation
    private DatabaseConnection() {
        System.out.println("Connecting to database...");
    }

    // 3. Public static method — the global access point
    public static DatabaseConnection getInstance() {
        if (instance == null) {                    // first check (no lock)
            synchronized (DatabaseConnection.class) {  // lock
                if (instance == null) {            // second check (with lock)
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;  // always returns the SAME object
    }

    public void query(String sql) {
        System.out.println("Executing: " + sql);
    }
}

// Usage — both variables point to the SAME object
// DatabaseConnection db1 = DatabaseConnection.getInstance();
// DatabaseConnection db2 = DatabaseConnection.getInstance();
// System.out.println(db1 == db2);  // true — same instance!`,
          },
          {
            language: 'python',
            label: 'Python — Singleton',
            code: `import threading

class DatabaseConnection:
    _instance = None       # the ONE object
    _lock = threading.Lock()  # thread safety

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:            # acquire lock
                if cls._instance is None:  # double-check
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return  # skip re-initialization
        print("Connecting to database...")
        self._initialized = True

    def query(self, sql):
        print(f"Executing: {sql}")

# Both variables point to the SAME object
db1 = DatabaseConnection()
db2 = DatabaseConnection()
print(db1 is db2)  # True — same instance!`,
          },
        ],
        keyTakeaway:
          'Singleton ensures exactly one instance exists. Use double-checked locking for thread safety.',
      },
      {
        title: 'Singleton — Pros, Cons, and Alternatives',
        content:
          '**Pros:**\n- Controlled access to a single instance\n- Lazy initialization (created only when needed)\n- Global access point\n\n**Cons:**\n- Difficult to unit test (global state)\n- Can hide dependencies\n- Violates Single Responsibility (manages its own lifecycle)\n\n**Alternatives:**\n- Dependency Injection frameworks (Spring, Guice) manage singletons for you\n- Module-level instances in Python (`config = Config()` at module level)',
        keyTakeaway:
          'Singleton is useful but can hurt testability. Prefer dependency injection in modern codebases.',
      },
      {
        title: 'Factory Pattern — The Car Factory',
        content:
          'The Factory pattern **delegates object creation** to a separate method or class. The caller says "I need a product" without knowing the exact class being instantiated.\n\nThere are two flavors:\n- **Factory Method** — A method in a class that subclasses override to create different products.\n- **Abstract Factory** — A family of related factories.',
        analogy:
          'A car factory takes an order ("sedan", "SUV", "truck") and builds the right vehicle. You do not walk into the factory and assemble the car yourself — you just specify what you want and receive the finished product.',
        code: [
          {
            language: 'java',
            label: 'Java — Factory Method',
            code: `// Product interface
public interface Notification {
    void send(String message);
}

// Concrete products
public class EmailNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("EMAIL: " + message);
    }
}

public class SmsNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}

public class PushNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("PUSH: " + message);
    }
}

// Factory — creates the right Notification based on type
public class NotificationFactory {
    public static Notification create(String type) {
        switch (type.toLowerCase()) {
            case "email": return new EmailNotification();
            case "sms":   return new SmsNotification();
            case "push":  return new PushNotification();
            default:
                throw new IllegalArgumentException("Unknown type: " + type);
        }
    }
}

// Usage — caller does NOT know which class is instantiated
// Notification notif = NotificationFactory.create("email");
// notif.send("Hello!");  // EMAIL: Hello!`,
          },
          {
            language: 'python',
            label: 'Python — Factory',
            code: `from abc import ABC, abstractmethod

# Product interface
class Notification(ABC):
    @abstractmethod
    def send(self, message): pass

# Concrete products
class EmailNotification(Notification):
    def send(self, message):
        print(f"EMAIL: {message}")

class SmsNotification(Notification):
    def send(self, message):
        print(f"SMS: {message}")

class PushNotification(Notification):
    def send(self, message):
        print(f"PUSH: {message}")

# Factory
class NotificationFactory:
    _creators = {
        "email": EmailNotification,
        "sms": SmsNotification,
        "push": PushNotification,
    }

    @staticmethod
    def create(notification_type: str) -> Notification:
        creator = NotificationFactory._creators.get(notification_type.lower())
        if not creator:
            raise ValueError(f"Unknown type: {notification_type}")
        return creator()  # instantiate and return

# Usage
notif = NotificationFactory.create("sms")
notif.send("Hello!")  # SMS: Hello!`,
          },
        ],
        keyTakeaway:
          'Factory pattern centralizes object creation. Callers specify what they need without knowing the concrete class.',
      },
      {
        title: 'When to Use Each Pattern',
        content:
          'Use **Singleton** when:\n- Exactly one instance is needed (config, connection pool, cache)\n- You need a global access point\n\nUse **Factory** when:\n- The exact type of object to create is determined at runtime\n- You want to decouple creation logic from business logic\n- You have a family of related classes that share an interface\n- You want to centralize and simplify complex construction logic',
        comparison: {
          leftTitle: 'Singleton',
          rightTitle: 'Factory',
          items: [
            { left: 'One instance only', right: 'Multiple instances of different types' },
            { left: 'Global access point', right: 'Type determined at runtime' },
            { left: 'Database connections', right: 'Notification systems' },
            { left: 'Configuration managers', right: 'Document parsers (PDF, DOCX, CSV)' },
            { left: 'Logging services', right: 'Payment processors' },
          ],
        },
        keyTakeaway:
          'Singleton = one global instance. Factory = creating the right type at runtime.',
      },
      {
        title: 'Combining Singleton and Factory',
        content:
          'In practice, these patterns often work together. A NotificationFactory might be a Singleton (only one factory needed), and each notification type might have its own Singleton connection pool.',
        code: [
          {
            language: 'java',
            label: 'Java — Combined',
            code: `// Singleton Factory — one factory instance creates different products
public class NotificationFactory {
    private static NotificationFactory instance;

    private NotificationFactory() {}  // private constructor

    public static NotificationFactory getInstance() {
        if (instance == null) {
            synchronized (NotificationFactory.class) {
                if (instance == null) {
                    instance = new NotificationFactory();
                }
            }
        }
        return instance;
    }

    public Notification create(String type) {
        switch (type.toLowerCase()) {
            case "email": return new EmailNotification();
            case "sms":   return new SmsNotification();
            case "push":  return new PushNotification();
            default: throw new IllegalArgumentException("Unknown: " + type);
        }
    }
}

// Usage
// Notification n = NotificationFactory.getInstance().create("push");
// n.send("You got a match!");`,
          },
        ],
        keyTakeaway:
          'Patterns combine naturally — a Singleton Factory is a common real-world combination.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using Singleton for everything',
        explanation:
          'Singleton is a controlled form of global state. Overuse makes code tightly coupled and hard to test. Use it sparingly.',
      },
      {
        mistake: 'Forgetting thread safety in Singleton',
        explanation:
          'Without synchronization, two threads can create two instances simultaneously. Use double-checked locking or an enum (Java) for safety.',
      },
      {
        mistake: 'Putting too much logic in the Factory',
        explanation:
          'The Factory should only handle creation. Business logic belongs in the created objects or services.',
      },
      {
        mistake: 'Not using an interface for Factory products',
        explanation:
          'Without a common interface, the Factory cannot return a generic type. Always define a shared interface for all products.',
      },
    ],
    practiceQuestions: [
      'Implement a thread-safe Singleton Logger that writes to a file.',
      'Create a ShapeFactory that returns Circle, Rectangle, or Triangle based on a string input.',
      'Explain why Singleton can make unit testing difficult. How would you solve it?',
      'Design an Abstract Factory for creating UI components (Button, TextBox) for Windows and Mac.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What does the Singleton pattern ensure?',
        options: ['A class can only have one method', 'A class has exactly one instance with a global access point', 'A class cannot be inherited', 'A class is immutable'],
        answer: 'A class has exactly one instance with a global access point',
        explanation: 'The Singleton pattern restricts a class to a single instance and provides a global point of access to it. Common examples include database connection pools and configuration managers.',
      },
      {
        type: 'short-answer',
        question: 'How do you make a Singleton constructor private in Java and what does this achieve?',
        answer: 'Declare the constructor as private to prevent external instantiation',
        explanation: 'A private constructor prevents other classes from using "new" to create instances. The only way to get an instance is through the static getInstance() method, which creates the instance once and returns it thereafter.',
      },
      {
        type: 'mcq',
        question: 'Which design pattern category does the Factory pattern belong to?',
        options: ['Behavioral', 'Structural', 'Creational', 'Architectural'],
        answer: 'Creational',
        explanation: 'Factory is a creational pattern — it deals with object creation mechanisms. It provides an interface for creating objects without specifying the exact class to instantiate.',
      },
      {
        type: 'mcq',
        question: 'What is a key disadvantage of the Singleton pattern?',
        options: ['It uses too much memory', 'It makes unit testing difficult due to global state', 'It is too slow', 'It requires multiple inheritance'],
        answer: 'It makes unit testing difficult due to global state',
        explanation: 'Singletons introduce global state, making it hard to isolate tests. You cannot easily substitute a mock object for the singleton. Dependency injection is often preferred for testability.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     10. DESIGN PATTERN: OBSERVER & STRATEGY
     ────────────────────────────────────────────── */
  'design-pattern-observer-strategy': {
    steps: [
      {
        title: 'Observer Pattern — YouTube Subscriptions',
        content:
          'The Observer pattern defines a **one-to-many** relationship: when one object (the **subject**) changes state, all its dependents (the **observers**) are notified automatically.\n\nThis is the backbone of event-driven systems.',
        analogy:
          'When you subscribe to a YouTube channel, you get notified every time the channel uploads a new video. You do not check the channel manually every hour — the notification comes to you. The channel is the subject, you are the observer.',
        keyTakeaway:
          'Observer = one subject notifies many observers automatically when its state changes.',
      },
      {
        title: 'Observer — Implementation',
        content:
          'Let us build a stock price alert system. When a stock price changes, all registered investors get notified.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `import java.util.ArrayList;
import java.util.List;

// Observer interface — anyone who wants to be notified
public interface StockObserver {
    void update(String stock, double price);  // called when price changes
}

// Subject — the thing being observed
public class StockMarket {
    private final List<StockObserver> observers = new ArrayList<>();
    private String stockName;
    private double price;

    public StockMarket(String stockName, double price) {
        this.stockName = stockName;
        this.price = price;
    }

    // Subscribe — add an observer
    public void subscribe(StockObserver observer) {
        observers.add(observer);
    }

    // Unsubscribe — remove an observer
    public void unsubscribe(StockObserver observer) {
        observers.remove(observer);
    }

    // When price changes, notify ALL observers
    public void setPrice(double newPrice) {
        this.price = newPrice;
        notifyObservers();
    }

    private void notifyObservers() {
        for (StockObserver obs : observers) {
            obs.update(stockName, price);  // push notification
        }
    }
}

// Concrete observer 1: Phone alert
public class PhoneAlert implements StockObserver {
    private String ownerName;
    public PhoneAlert(String name) { this.ownerName = name; }

    @Override
    public void update(String stock, double price) {
        System.out.println("[PHONE] " + ownerName + ": " + stock + " is now $" + price);
    }
}

// Concrete observer 2: Email alert
public class EmailAlert implements StockObserver {
    private String email;
    public EmailAlert(String email) { this.email = email; }

    @Override
    public void update(String stock, double price) {
        System.out.println("[EMAIL to " + email + "] " + stock + " is now $" + price);
    }
}

// Usage:
// StockMarket apple = new StockMarket("AAPL", 150.0);
// apple.subscribe(new PhoneAlert("Alice"));
// apple.subscribe(new EmailAlert("bob@mail.com"));
// apple.setPrice(155.0);
// [PHONE] Alice: AAPL is now $155.0
// [EMAIL to bob@mail.com] AAPL is now $155.0`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

class StockObserver(ABC):
    @abstractmethod
    def update(self, stock: str, price: float):
        pass

class StockMarket:
    def __init__(self, stock_name, price):
        self._observers = []    # list of subscribers
        self.stock_name = stock_name
        self._price = price

    def subscribe(self, observer: StockObserver):
        self._observers.append(observer)

    def unsubscribe(self, observer: StockObserver):
        self._observers.remove(observer)

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, new_price):
        self._price = new_price
        self._notify_observers()  # automatic notification

    def _notify_observers(self):
        for obs in self._observers:
            obs.update(self.stock_name, self._price)

class PhoneAlert(StockObserver):
    def __init__(self, name):
        self.name = name

    def update(self, stock, price):
        print(f"[PHONE] {self.name}: {stock} is now \\\${price}")

class EmailAlert(StockObserver):
    def __init__(self, email):
        self.email = email

    def update(self, stock, price):
        print(f"[EMAIL to {self.email}] {stock} is now \\\${price}")

# Usage
apple = StockMarket("AAPL", 150.0)
apple.subscribe(PhoneAlert("Alice"))
apple.subscribe(EmailAlert("bob@mail.com"))
apple.price = 155.0
# [PHONE] Alice: AAPL is now $155.0
# [EMAIL to bob@mail.com] AAPL is now $155.0`,
          },
        ],
        keyTakeaway:
          'The subject maintains a list of observers and notifies them all when state changes.',
      },
      {
        title: 'Strategy Pattern — GPS Navigation',
        content:
          'The Strategy pattern lets you define a **family of algorithms**, put each in a separate class, and make them **interchangeable**. The algorithm can be swapped at runtime without changing the code that uses it.',
        analogy:
          'GPS navigation can find a route using different strategies: fastest route, shortest distance, or avoid tolls. The destination is the same — but the strategy changes. You pick the strategy before you start driving, and you can switch mid-trip.',
        keyTakeaway:
          'Strategy = define a family of interchangeable algorithms. Swap behavior at runtime.',
      },
      {
        title: 'Strategy — Implementation',
        content:
          'Let us build a payment system where the payment method (credit card, PayPal, crypto) is a swappable strategy.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Strategy interface
public interface PaymentStrategy {
    boolean pay(double amount);
    String getName();
}

// Strategy 1: Credit Card
public class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public boolean pay(double amount) {
        System.out.println("Paid $" + amount + " via Credit Card ending " +
            cardNumber.substring(cardNumber.length() - 4));
        return true;
    }

    @Override
    public String getName() { return "Credit Card"; }
}

// Strategy 2: PayPal
public class PayPalPayment implements PaymentStrategy {
    private String email;
    public PayPalPayment(String email) { this.email = email; }

    @Override
    public boolean pay(double amount) {
        System.out.println("Paid $" + amount + " via PayPal (" + email + ")");
        return true;
    }

    @Override
    public String getName() { return "PayPal"; }
}

// Strategy 3: Crypto
public class CryptoPayment implements PaymentStrategy {
    private String walletAddress;
    public CryptoPayment(String wallet) { this.walletAddress = wallet; }

    @Override
    public boolean pay(double amount) {
        System.out.println("Paid $" + amount + " via Crypto to " + walletAddress);
        return true;
    }

    @Override
    public String getName() { return "Crypto"; }
}

// Context — uses a strategy but does not care which one
public class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    private double total = 0;

    public void addItem(double price) { total += price; }

    // Set the strategy at runtime
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public boolean checkout() {
        if (paymentStrategy == null) {
            System.out.println("No payment method selected!");
            return false;
        }
        return paymentStrategy.pay(total);
    }
}

// Usage:
// ShoppingCart cart = new ShoppingCart();
// cart.addItem(29.99);
// cart.addItem(49.99);
// cart.setPaymentStrategy(new PayPalPayment("alice@mail.com"));
// cart.checkout();  // Paid $79.98 via PayPal (alice@mail.com)`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> bool:
        pass

class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number):
        self.card_number = card_number

    def pay(self, amount):
        print(f"Paid \\\${amount} via Credit Card ending {self.card_number[-4:]}")
        return True

class PayPalPayment(PaymentStrategy):
    def __init__(self, email):
        self.email = email

    def pay(self, amount):
        print(f"Paid \\\${amount} via PayPal ({self.email})")
        return True

class CryptoPayment(PaymentStrategy):
    def __init__(self, wallet):
        self.wallet = wallet

    def pay(self, amount):
        print(f"Paid \\\${amount} via Crypto to {self.wallet}")
        return True

class ShoppingCart:
    def __init__(self):
        self.items = []
        self.payment_strategy = None

    def add_item(self, price):
        self.items.append(price)

    def set_payment_strategy(self, strategy: PaymentStrategy):
        self.payment_strategy = strategy

    def checkout(self):
        if not self.payment_strategy:
            print("No payment method selected!")
            return False
        return self.payment_strategy.pay(sum(self.items))

# Usage
cart = ShoppingCart()
cart.add_item(29.99)
cart.add_item(49.99)
cart.set_payment_strategy(PayPalPayment("alice@mail.com"))
cart.checkout()  # Paid $79.98 via PayPal (alice@mail.com)`,
          },
        ],
        keyTakeaway:
          'The context class holds a strategy reference and delegates behavior to it. Strategies are swappable at runtime.',
      },
      {
        title: 'Observer vs Strategy — When to Use Each',
        content:
          'Both decouple behavior, but in different ways:',
        comparison: {
          leftTitle: 'Observer',
          rightTitle: 'Strategy',
          items: [
            { left: 'One-to-many notification', right: 'One-to-one algorithm swap' },
            { left: 'Subject doesn\'t know observer types', right: 'Context delegates to one strategy' },
            { left: 'Event-driven systems', right: 'Algorithm selection' },
            { left: 'Stock alerts, chat rooms, UI events', right: 'Payment methods, sorting, routing' },
            { left: 'Observers come and go dynamically', right: 'Strategy set once (or switched)' },
          ],
        },
        keyTakeaway:
          'Observer = notify many when something changes. Strategy = swap one algorithm at runtime.',
      },
      {
        title: 'Real-World Applications',
        content:
          '**Observer in the wild:**\n- JavaScript DOM events (`addEventListener`)\n- React state management (re-render on state change)\n- Pub/Sub messaging (Kafka, RabbitMQ)\n- MVC pattern (model notifies views)\n\n**Strategy in the wild:**\n- Sorting algorithms (pick quicksort or mergesort based on data)\n- Compression (gzip, brotli, zstd)\n- Authentication (OAuth, JWT, API key)\n- Logging (console, file, cloud)',
        keyTakeaway:
          'Observer powers event systems and reactive UIs. Strategy powers configurable algorithms and pluggable behaviors.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Not unsubscribing observers (memory leak)',
        explanation:
          'If observers are never removed, the subject holds references to them forever, preventing garbage collection. Always provide an unsubscribe mechanism.',
      },
      {
        mistake: 'Using if-else chains instead of Strategy pattern',
        explanation:
          'If you have `if (type == "A") doA(); else if (type == "B") doB();`, that is a Strategy pattern begging to be extracted.',
      },
      {
        mistake: 'Notifying observers in an undefined order',
        explanation:
          'Observers should not depend on notification order. If they do, your design is fragile.',
      },
    ],
    practiceQuestions: [
      'Implement an Observer-based event system for a chat room (users get notified of new messages).',
      'Create a Strategy pattern for different sorting algorithms. Let the user pick at runtime.',
      'How does React\'s state management relate to the Observer pattern?',
      'When would you use Observer over simple callbacks?',
      'Design a compression system using Strategy (gzip, brotli, no compression).',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'The Observer pattern defines what type of relationship?',
        options: ['One-to-one', 'Many-to-many', 'One-to-many', 'Many-to-one'],
        answer: 'One-to-many',
        explanation: 'The Observer pattern defines a one-to-many dependency: one subject notifies many observers when its state changes. Think of a YouTube channel (one subject) notifying many subscribers (observers).',
      },
      {
        type: 'short-answer',
        question: 'In the Observer pattern, what are the two main roles called?',
        answer: 'Subject and Observer',
        explanation: 'The Subject (or Publisher) maintains a list of observers and notifies them of state changes. The Observer (or Subscriber) registers with the subject and receives updates.',
      },
      {
        type: 'mcq',
        question: 'What does the Strategy pattern allow you to do?',
        options: ['Create only one instance of a class', 'Select an algorithm at runtime from a family of algorithms', 'Notify multiple objects of state changes', 'Adapt one interface to another'],
        answer: 'Select an algorithm at runtime from a family of algorithms',
        explanation: 'The Strategy pattern defines a family of interchangeable algorithms and lets you swap between them at runtime. For example, a GPS app switching between fastest route, shortest route, and scenic route.',
      },
      {
        type: 'mcq',
        question: 'Which design pattern category do Observer and Strategy belong to?',
        options: ['Creational', 'Structural', 'Behavioral', 'Architectural'],
        answer: 'Behavioral',
        explanation: 'Both Observer and Strategy are behavioral patterns. They deal with how objects communicate and distribute responsibility, rather than how they are created (creational) or composed (structural).',
      },
      {
        type: 'short-answer',
        question: 'Give a real-world example of the Strategy pattern.',
        answer: 'A navigation app choosing between different route algorithms (fastest, shortest, scenic)',
        explanation: 'GPS navigation is a classic Strategy example. The routing algorithm can be swapped at runtime without changing the navigation system itself. Other examples include payment processing (credit card, PayPal, crypto) and compression (gzip, brotli).',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     11. DESIGN PATTERN: BUILDER & ADAPTER
     ────────────────────────────────────────────── */
  'design-pattern-builder-adapter': {
    steps: [
      {
        title: 'Builder Pattern — The Subway Sandwich',
        content:
          'The Builder pattern constructs a complex object **step by step**. Instead of a constructor with 15 parameters, you chain method calls to set only what you need.\n\nThis is especially useful when:\n- An object has many optional parameters\n- The construction process has multiple steps\n- You want immutable objects built incrementally',
        analogy:
          'At a Subway restaurant, you build a sandwich step by step: choose bread, choose protein, add vegetables, add sauce, choose size. You can skip any step (no veggies? fine!). The builder (sandwich artist) creates the final product from your choices.',
        keyTakeaway:
          'Builder constructs complex objects step-by-step with a fluent, readable interface.',
      },
      {
        title: 'Builder — Implementation',
        content:
          'Let us build an HTTP request using the Builder pattern. An HTTP request has many optional fields: headers, query parameters, body, timeout, etc.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `import java.util.HashMap;
import java.util.Map;

public class HttpRequest {
    // All fields are final — immutable once built
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;
    private final int timeoutMs;

    // Private constructor — only Builder can create HttpRequest
    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = builder.headers;
        this.body = builder.body;
        this.timeoutMs = builder.timeoutMs;
    }

    // Static inner Builder class
    public static class Builder {
        private final String url;          // required
        private String method = "GET";     // default
        private Map<String, String> headers = new HashMap<>();
        private String body = null;
        private int timeoutMs = 5000;      // default 5 seconds

        public Builder(String url) {       // only required param in constructor
            this.url = url;
        }

        public Builder method(String method) {
            this.method = method;
            return this;  // return "this" for chaining
        }

        public Builder header(String key, String value) {
            this.headers.put(key, value);
            return this;
        }

        public Builder body(String body) {
            this.body = body;
            return this;
        }

        public Builder timeout(int ms) {
            this.timeoutMs = ms;
            return this;
        }

        public HttpRequest build() {
            return new HttpRequest(this);  // create the final object
        }
    }

    @Override
    public String toString() {
        return method + " " + url + " (timeout: " + timeoutMs + "ms)";
    }
}

// Usage — clean, readable, flexible
// HttpRequest request = new HttpRequest.Builder("https://api.example.com/users")
//     .method("POST")
//     .header("Content-Type", "application/json")
//     .header("Authorization", "Bearer token123")
//     .body("{\\"name\\": \\"Alice\\"}")
//     .timeout(10000)
//     .build();`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class HttpRequest:
    def __init__(self, url, method="GET", headers=None, body=None, timeout_ms=5000):
        # All set via builder, stored as read-only
        self.url = url
        self.method = method
        self.headers = headers or {}
        self.body = body
        self.timeout_ms = timeout_ms

    def __repr__(self):
        return f"{self.method} {self.url} (timeout: {self.timeout_ms}ms)"


class HttpRequestBuilder:
    def __init__(self, url):
        self._url = url               # required
        self._method = "GET"           # default
        self._headers = {}
        self._body = None
        self._timeout_ms = 5000

    def method(self, method):
        self._method = method
        return self  # chaining

    def header(self, key, value):
        self._headers[key] = value
        return self

    def body(self, body):
        self._body = body
        return self

    def timeout(self, ms):
        self._timeout_ms = ms
        return self

    def build(self):
        return HttpRequest(
            url=self._url,
            method=self._method,
            headers=self._headers.copy(),
            body=self._body,
            timeout_ms=self._timeout_ms,
        )

# Usage — clean and readable
request = (
    HttpRequestBuilder("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token123")
    .body('{"name": "Alice"}')
    .timeout(10000)
    .build()
)
print(request)  # POST https://api.example.com/users (timeout: 10000ms)`,
          },
        ],
        keyTakeaway:
          'Builder uses method chaining to construct complex objects step-by-step. Each method returns `this`/`self`.',
      },
      {
        title: 'Adapter Pattern — The Power Adapter',
        content:
          'The Adapter pattern converts the interface of one class into another interface that clients expect. It lets classes work together that otherwise could not because of incompatible interfaces.',
        analogy:
          'When you travel from the US to Europe, your phone charger plug does not fit European outlets. You use a power adapter — it does not change the electricity, it just converts the plug format. The Adapter pattern does the same for code interfaces.',
        keyTakeaway:
          'Adapter bridges incompatible interfaces by wrapping one class and exposing the expected interface.',
      },
      {
        title: 'Adapter — Implementation',
        content:
          'Imagine you have a new analytics library that expects JSON data, but your existing system produces XML. An adapter bridges the gap.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// ── The interface YOUR code expects (Target) ──
public interface AnalyticsService {
    void trackEvent(String jsonData);  // expects JSON
}

// ── The old system you cannot change (Adaptee) ──
public class LegacyXmlAnalytics {
    public void sendXmlReport(String xmlData) {
        System.out.println("Legacy system processing XML: " + xmlData);
    }
}

// ── Adapter: makes LegacyXmlAnalytics look like AnalyticsService ──
public class XmlAnalyticsAdapter implements AnalyticsService {
    private final LegacyXmlAnalytics legacySystem;

    public XmlAnalyticsAdapter(LegacyXmlAnalytics legacySystem) {
        this.legacySystem = legacySystem;  // wrap the old system
    }

    @Override
    public void trackEvent(String jsonData) {
        // Convert JSON to XML (simplified)
        String xmlData = "<event>" + jsonData.replace("{", "")
            .replace("}", "").replace(":", ">").replace(",", "</")
            + "</event>";
        legacySystem.sendXmlReport(xmlData);  // delegate to old system
    }
}

// Usage — your code talks to the interface, adapter handles conversion
// AnalyticsService analytics = new XmlAnalyticsAdapter(new LegacyXmlAnalytics());
// analytics.trackEvent("{\\"event\\": \\"click\\", \\"page\\": \\"home\\"}");
// Legacy system processing XML: <event>...`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from abc import ABC, abstractmethod
import json

# Target interface — what YOUR code expects
class AnalyticsService(ABC):
    @abstractmethod
    def track_event(self, json_data: str):
        pass

# Adaptee — the old system you cannot change
class LegacyXmlAnalytics:
    def send_xml_report(self, xml_data: str):
        print(f"Legacy system processing XML: {xml_data}")

# Adapter — bridges the gap
class XmlAnalyticsAdapter(AnalyticsService):
    def __init__(self, legacy_system: LegacyXmlAnalytics):
        self._legacy = legacy_system  # wrap the old system

    def track_event(self, json_data: str):
        # Convert JSON to XML
        data = json.loads(json_data)
        xml_parts = [f"<{k}>{v}</{k}>" for k, v in data.items()]
        xml_data = f"<event>{''.join(xml_parts)}</event>"
        self._legacy.send_xml_report(xml_data)  # delegate

# Usage
analytics = XmlAnalyticsAdapter(LegacyXmlAnalytics())
analytics.track_event('{"event": "click", "page": "home"}')
# Legacy system processing XML: <event><event>click</event><page>home</page></event>`,
          },
        ],
        keyTakeaway:
          'The adapter wraps an incompatible class and translates calls between the expected and actual interfaces.',
      },
      {
        title: 'Builder vs Adapter — When to Use Each',
        content:
          'These patterns solve completely different problems:',
        comparison: {
          leftTitle: 'Builder',
          rightTitle: 'Adapter',
          items: [
            { left: 'Creates complex objects step-by-step', right: 'Bridges incompatible interfaces' },
            { left: 'Solves "too many constructor params"', right: 'Solves "wrong interface" problem' },
            { left: 'Used at object CREATION time', right: 'Used to integrate existing systems' },
            { left: 'HTTP requests, SQL queries, UI configs', right: 'Legacy code, third-party libraries' },
            { left: 'Creational pattern', right: 'Structural pattern' },
          ],
        },
        keyTakeaway:
          'Builder = construct complex objects. Adapter = make incompatible interfaces work together.',
      },
      {
        title: 'Real-World Examples',
        content:
          '**Builder in the wild:**\n- `StringBuilder` in Java\n- `RequestBuilder` in OkHttp\n- `AlertDialog.Builder` in Android\n- `QueryBuilder` in ORMs\n\n**Adapter in the wild:**\n- `Arrays.asList()` in Java (array → List interface)\n- `InputStreamReader` in Java (byte stream → character stream)\n- Database drivers (JDBC adapts different databases to one interface)\n- React wrappers around vanilla JS libraries',
        keyTakeaway:
          'Builder is everywhere in API design. Adapter is the go-to pattern for integration and legacy code.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using Builder for simple objects with 2-3 fields',
        explanation:
          'Builder adds complexity. Use it when you have 4+ parameters, especially with many optionals. For simple objects, a constructor is fine.',
      },
      {
        mistake: 'Confusing Adapter with Facade',
        explanation:
          'Adapter changes the interface but keeps the same behavior. Facade simplifies a complex subsystem into a simpler interface.',
      },
      {
        mistake: 'Not making the built object immutable',
        explanation:
          'The whole point of Builder is controlled construction. If the built object is mutable, external code can bypass the builder logic.',
      },
    ],
    practiceQuestions: [
      'Implement a Builder for a Pizza class (size, crust, toppings, cheese, sauce).',
      'Create an Adapter that makes a Celsius temperature sensor work with a Fahrenheit display system.',
      'When would you use Builder vs a constructor with default parameters?',
      'Design an Adapter for a payment gateway that expects dollars but receives euros.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'When is the Builder pattern most useful?',
        options: ['When a class has no constructor', 'When an object has many optional parameters', 'When you need exactly one instance', 'When objects need to observe each other'],
        answer: 'When an object has many optional parameters',
        explanation: 'The Builder pattern shines when constructing complex objects with many optional fields. Instead of a constructor with 15 parameters, you chain readable method calls and set only what you need.',
      },
      {
        type: 'short-answer',
        question: 'What does the Adapter pattern do?',
        answer: 'It converts one interface into another that clients expect',
        explanation: 'The Adapter pattern acts as a bridge between two incompatible interfaces. Like a power adapter that lets a US plug work in a European socket, it wraps an existing class to make it compatible with a different interface.',
      },
      {
        type: 'mcq',
        question: 'Which design pattern category does the Adapter belong to?',
        options: ['Creational', 'Structural', 'Behavioral', 'Concurrency'],
        answer: 'Structural',
        explanation: 'Adapter is a structural pattern. Structural patterns deal with how classes and objects are composed to form larger structures. The Adapter wraps one interface to make it compatible with another.',
      },
      {
        type: 'mcq',
        question: 'Which feature of the Builder pattern makes code more readable?',
        options: ['Static methods', 'Method chaining (fluent interface)', 'Abstract classes', 'Multiple constructors'],
        answer: 'Method chaining (fluent interface)',
        explanation: 'Builder uses method chaining (each setter returns "this") to create a fluent, readable interface: new RequestBuilder().setUrl("...").setMethod("GET").addHeader("...").build().',
      },
      {
        type: 'short-answer',
        question: 'Which design pattern category does the Builder belong to?',
        answer: 'Creational',
        explanation: 'Builder is a creational pattern — it provides a flexible solution for constructing complex objects step by step, separating the construction process from the final representation.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     12. COMPOSITION OVER INHERITANCE
     ────────────────────────────────────────────── */
  'composition-over-inheritance': {
    steps: [
      {
        title: 'LEGO Bricks vs Wooden Blocks',
        content:
          'Inheritance says "a Dog IS-A Animal." Composition says "a Dog HAS-A ability to bark, HAS-A ability to walk." With composition, you build objects by combining small, reusable pieces (like LEGO bricks) instead of creating rigid hierarchies (like wooden blocks glued together).',
        analogy:
          'LEGO bricks: each brick is independent, you snap them together to build anything, and you can swap pieces freely. Wooden blocks glued together: once glued, you cannot rearrange. If you glue a wheel to a house, every house made from that mold has a wheel. Inheritance is the glue; composition is the LEGO snap.',
        keyTakeaway:
          'Composition builds objects from small, reusable parts. Inheritance locks you into rigid hierarchies.',
      },
      {
        title: 'The Problem with Deep Inheritance',
        content:
          'Imagine you are building a game with different characters. With inheritance, you might create:\n\n`Character → Warrior → FlyingWarrior → FlyingFireWarrior`\n\nBut what about a `SwimmingFireMage`? Do you create `Character → Mage → FireMage → SwimmingFireMage`? You end up with an explosion of classes for every combination.',
        code: [
          {
            language: 'java',
            label: 'BAD — Inheritance Explosion',
            code: `// The inheritance nightmare
class Character { }
class Warrior extends Character { }
class Mage extends Character { }
class FlyingWarrior extends Warrior { }    // can fly
class SwimmingWarrior extends Warrior { }  // can swim
class FlyingMage extends Mage { }          // can fly
class SwimmingMage extends Mage { }        // can swim

// What about a FlyingSwimmingWarrior? Or a FlyingFireSwimmingMage?
// You need a class for EVERY combination.
// With 3 abilities and 3 character types: 3 * 2^3 = 24 classes!
// This is called the "combinatorial explosion."`,
          },
        ],
        keyTakeaway:
          'Deep inheritance creates a "combinatorial explosion" — too many classes for every combination of behaviors.',
      },
      {
        title: 'Composition to the Rescue',
        content:
          'Instead of inheriting abilities, compose them. Create small ability classes and attach them to characters as needed.',
        code: [
          {
            language: 'java',
            label: 'Java — Composition',
            code: `// Abilities as separate classes (components)
public interface Ability {
    void use();
}

public class FlyAbility implements Ability {
    @Override
    public void use() { System.out.println("Flying through the sky!"); }
}

public class SwimAbility implements Ability {
    @Override
    public void use() { System.out.println("Swimming through water!"); }
}

public class FireAbility implements Ability {
    @Override
    public void use() { System.out.println("Shooting fireballs!"); }
}

// Character COMPOSES abilities — mix and match freely
public class Character {
    private final String name;
    private final String role;
    private final List<Ability> abilities = new ArrayList<>();

    public Character(String name, String role) {
        this.name = name;
        this.role = role;
    }

    public Character addAbility(Ability ability) {
        abilities.add(ability);
        return this;  // fluent interface
    }

    public void useAllAbilities() {
        System.out.println(name + " the " + role + ":");
        for (Ability a : abilities) {
            a.use();
        }
    }
}

// Now ANY combination is trivial — no new classes needed!
// Character hero = new Character("Thor", "Warrior")
//     .addAbility(new FlyAbility())
//     .addAbility(new FireAbility());
//
// Character mermaid = new Character("Ariel", "Mage")
//     .addAbility(new SwimAbility())
//     .addAbility(new FireAbility());`,
          },
          {
            language: 'python',
            label: 'Python — Composition',
            code: `from abc import ABC, abstractmethod

class Ability(ABC):
    @abstractmethod
    def use(self):
        pass

class FlyAbility(Ability):
    def use(self):
        print("Flying through the sky!")

class SwimAbility(Ability):
    def use(self):
        print("Swimming through water!")

class FireAbility(Ability):
    def use(self):
        print("Shooting fireballs!")

class Character:
    def __init__(self, name, role):
        self.name = name
        self.role = role
        self.abilities = []  # COMPOSE abilities

    def add_ability(self, ability):
        self.abilities.append(ability)
        return self

    def use_all_abilities(self):
        print(f"{self.name} the {self.role}:")
        for a in self.abilities:
            a.use()

# Mix and match — no inheritance hierarchy needed
hero = Character("Thor", "Warrior")
hero.add_ability(FlyAbility()).add_ability(FireAbility())
hero.use_all_abilities()
# Thor the Warrior:
# Flying through the sky!
# Shooting fireballs!`,
          },
        ],
        keyTakeaway:
          'Composition lets you mix and match behaviors without creating a class for every combination.',
      },
      {
        title: 'Before/After Refactoring',
        content:
          'Let us refactor a real example — a notification system. The inheritance version has a class for every notification + channel combination.',
        code: [
          {
            language: 'python',
            label: 'BEFORE — Inheritance (rigid)',
            code: `# BEFORE: Inheritance hierarchy
class Notification:
    def send(self, msg): pass

class EmailNotification(Notification):
    def send(self, msg): print(f"Email: {msg}")

class SmsNotification(Notification):
    def send(self, msg): print(f"SMS: {msg}")

class UrgentEmailNotification(EmailNotification):
    def send(self, msg): print(f"URGENT Email: {msg}")

class UrgentSmsNotification(SmsNotification):
    def send(self, msg): print(f"URGENT SMS: {msg}")

# LoggedEmail? LoggedSms? UrgentLoggedEmail?
# Every combination = new class. Explosion!`,
          },
          {
            language: 'python',
            label: 'AFTER — Composition (flexible)',
            code: `# AFTER: Composition — mix and match
class Channel(ABC):
    @abstractmethod
    def deliver(self, msg): pass

class EmailChannel(Channel):
    def deliver(self, msg): print(f"Email: {msg}")

class SmsChannel(Channel):
    def deliver(self, msg): print(f"SMS: {msg}")

class Modifier(ABC):
    @abstractmethod
    def transform(self, msg): pass

class UrgentModifier(Modifier):
    def transform(self, msg): return f"[URGENT] {msg}"

class LogModifier(Modifier):
    def transform(self, msg):
        print(f"LOG: {msg}")
        return msg

class Notification:
    def __init__(self, channel, modifiers=None):
        self.channel = channel          # HAS-A channel
        self.modifiers = modifiers or []  # HAS modifiers

    def send(self, msg):
        for mod in self.modifiers:
            msg = mod.transform(msg)    # apply each modifier
        self.channel.deliver(msg)       # deliver via channel

# Any combination without new classes!
urgent_email = Notification(EmailChannel(), [UrgentModifier()])
logged_sms = Notification(SmsChannel(), [LogModifier()])
urgent_logged_email = Notification(
    EmailChannel(), [UrgentModifier(), LogModifier()]
)

urgent_email.send("Server down")  # Email: [URGENT] Server down`,
          },
        ],
        keyTakeaway:
          'Refactoring from inheritance to composition eliminates the combinatorial explosion and makes the system flexible.',
      },
      {
        title: 'When to Use Inheritance vs Composition',
        content:
          'Inheritance is not inherently bad — it is the right choice sometimes. Here is the decision guide:',
        table: {
          headers: ['Question', 'If Yes...', 'Use'],
          rows: [
            ['Is it a clear IS-A relationship?', 'Dog IS-A Animal', 'Inheritance'],
            ['Do you need to swap behaviors at runtime?', 'Change payment method', 'Composition'],
            ['Are there many combinations of features?', '3+ feature axes', 'Composition'],
            ['Is the hierarchy 3+ levels deep?', 'A → B → C → D', 'Refactor to composition'],
            ['Do you share state AND behavior?', 'Common fields + methods', 'Inheritance OK'],
          ],
        },
        keyTakeaway:
          'Use inheritance for clear IS-A relationships with shared state. Use composition for everything else.',
      },
      {
        title: 'The Golden Rule',
        content:
          'Here is the rule that experienced developers follow:\n\n**"Favor composition over inheritance, but do not avoid inheritance entirely."**\n\nInheritance is useful for:\n- Small, stable hierarchies (Animal → Dog, Cat)\n- Framework extension points (extending a base Controller)\n- When you genuinely need to share state AND behavior\n\nComposition is better for:\n- Behaviors that combine in many ways\n- Runtime flexibility (swap strategies)\n- Reducing coupling between classes\n- Most real-world scenarios',
        keyTakeaway:
          'Default to composition. Use inheritance only when the IS-A relationship is clear, stable, and simple.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using inheritance just to reuse code',
        explanation:
          'Inheritance should model IS-A relationships, not just share code. If a Stack inherits from ArrayList just to reuse add/remove, that is wrong — a Stack is NOT an ArrayList.',
      },
      {
        mistake: 'Avoiding inheritance entirely',
        explanation:
          'Composition is preferred but inheritance has its place. Small, stable hierarchies with genuine IS-A relationships benefit from inheritance.',
      },
      {
        mistake: 'Creating God classes that compose everything',
        explanation:
          'Composition should not mean one class that has 20 components. Keep classes focused with a few well-chosen compositions.',
      },
    ],
    practiceQuestions: [
      'Refactor a Vehicle inheritance hierarchy (Vehicle → Car → ElectricCar → SelfDrivingElectricCar) to use composition.',
      'When is inheritance the better choice over composition? Give 2 examples.',
      'Design a character system for a game using composition (abilities: fly, swim, shoot, shield).',
      'Explain the "combinatorial explosion" problem with inheritance.',
      'Show how composition enables runtime behavior changes that inheritance cannot.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What relationship does composition model?',
        options: ['IS-A relationship', 'HAS-A relationship', 'USES-A relationship', 'KNOWS-A relationship'],
        answer: 'HAS-A relationship',
        explanation: 'Composition models HAS-A relationships: a Dog HAS-A ability to bark, HAS-A ability to walk. Inheritance models IS-A: a Dog IS-A Animal. Composition builds objects from reusable parts.',
      },
      {
        type: 'mcq',
        question: 'What is the main problem with deep inheritance hierarchies?',
        options: ['They use too much memory', 'They cause combinatorial explosion of classes for every combination of behaviors', 'They run slower than flat classes', 'They cannot have constructors'],
        answer: 'They cause combinatorial explosion of classes for every combination of behaviors',
        explanation: 'With deep inheritance, adding each new capability multiplies the number of classes needed. A FlyingFireWarrior, SwimmingFireMage, etc. Composition avoids this by assembling abilities as components.',
      },
      {
        type: 'short-answer',
        question: 'What is the common saying that summarizes preferring composition?',
        answer: 'Favor composition over inheritance',
        explanation: 'This principle from the Gang of Four book advises building objects by combining small, reusable components (composition) rather than creating rigid class hierarchies (inheritance). It leads to more flexible and maintainable code.',
      },
      {
        type: 'mcq',
        question: 'Which advantage does composition have over inheritance at runtime?',
        options: ['Faster method calls', 'Ability to change behavior dynamically at runtime', 'Less memory usage', 'Automatic method resolution'],
        answer: 'Ability to change behavior dynamically at runtime',
        explanation: 'With composition, you can swap components at runtime (e.g., change a character\'s movement strategy from walking to flying). Inheritance locks the class hierarchy at compile time and cannot be changed.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     13. DESIGN: PARKING LOT SYSTEM
     ────────────────────────────────────────────── */
  'design-parking-lot-system': {
    steps: [
      {
        title: 'Understanding the Problem',
        content:
          'The parking lot design is the most popular OOP design interview question. Before writing any code, let us gather requirements:\n\n**Functional Requirements:**\n1. Multiple floors, each with many parking spots\n2. Different spot sizes: Small, Medium, Large\n3. Different vehicle types: Motorcycle, Car, Truck\n4. Vehicles get assigned the right spot size\n5. Issue a ticket when a vehicle enters\n6. Calculate fee when the vehicle exits\n7. Track available spots per floor and type\n\n**Non-Functional:**\n- Thread-safe (multiple entry/exit points)\n- Efficient spot finding',
        keyTakeaway:
          'Always start with clear requirements before designing classes.',
      },
      {
        title: 'Identifying the Classes',
        content:
          'From the requirements, we can identify these core classes:\n\n1. **ParkingLot** — The main system (Singleton)\n2. **Floor** — One level of the parking lot\n3. **ParkingSpot** — An individual spot (Small, Medium, Large)\n4. **Vehicle** — Base class (Motorcycle, Car, Truck)\n5. **Ticket** — Issued on entry, tracks time\n6. **FeeCalculator** — Strategy pattern for pricing\n\nRelationships:\n- ParkingLot HAS many Floors\n- Floor HAS many ParkingSpots\n- ParkingSpot HAS a Vehicle (when occupied)\n- Ticket references a Vehicle and a ParkingSpot',
        diagram: `┌─────────────┐\n│ ParkingLot  │ (Singleton)\n│  (1 instance)│\n└──────┬──────┘\n       │ has many\n┌──────┴──────┐\n│   Floor     │\n└──────┬──────┘\n       │ has many\n┌──────┴──────┐     ┌──────────┐\n│ ParkingSpot │────►│ Vehicle  │\n│ (S/M/L)     │     │(abstract)│\n└─────────────┘     └────┬─────┘\n       │                 │ extends\n┌──────┴──────┐    ┌─────┴────────────┐\n│   Ticket    │    │Motorcycle|Car|Truck│\n│ (entry time)│    └──────────────────┘\n└─────────────┘`,
        keyTakeaway:
          'Identify nouns from requirements as classes and verbs as methods. Map relationships.',
      },
      {
        title: 'Enums and Base Types',
        content:
          'Let us define the foundational types first.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `// Spot size enum
public enum SpotSize {
    SMALL,    // for motorcycles
    MEDIUM,   // for cars
    LARGE     // for trucks
}

// Vehicle base class
public abstract class Vehicle {
    private final String licensePlate;
    private final SpotSize requiredSize;

    public Vehicle(String licensePlate, SpotSize requiredSize) {
        this.licensePlate = licensePlate;
        this.requiredSize = requiredSize;
    }

    public String getLicensePlate() { return licensePlate; }
    public SpotSize getRequiredSize() { return requiredSize; }
}

public class Motorcycle extends Vehicle {
    public Motorcycle(String plate) { super(plate, SpotSize.SMALL); }
}

public class Car extends Vehicle {
    public Car(String plate) { super(plate, SpotSize.MEDIUM); }
}

public class Truck extends Vehicle {
    public Truck(String plate) { super(plate, SpotSize.LARGE); }
}`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `from enum import Enum
from abc import ABC
from datetime import datetime

class SpotSize(Enum):
    SMALL = 1    # motorcycles
    MEDIUM = 2   # cars
    LARGE = 3    # trucks

class Vehicle(ABC):
    def __init__(self, license_plate: str, required_size: SpotSize):
        self.license_plate = license_plate
        self.required_size = required_size

class Motorcycle(Vehicle):
    def __init__(self, plate):
        super().__init__(plate, SpotSize.SMALL)

class Car(Vehicle):
    def __init__(self, plate):
        super().__init__(plate, SpotSize.MEDIUM)

class Truck(Vehicle):
    def __init__(self, plate):
        super().__init__(plate, SpotSize.LARGE)`,
          },
        ],
        keyTakeaway:
          'Use enums for fixed categories. Abstract base classes define common vehicle properties.',
      },
      {
        title: 'ParkingSpot and Ticket',
        content:
          'Each spot tracks its occupancy. Each ticket tracks entry time and assigned spot.',
        code: [
          {
            language: 'java',
            label: 'Java',
            code: `import java.time.LocalDateTime;

public class ParkingSpot {
    private final int spotNumber;
    private final SpotSize size;
    private final int floor;
    private Vehicle currentVehicle;

    public ParkingSpot(int spotNumber, SpotSize size, int floor) {
        this.spotNumber = spotNumber;
        this.size = size;
        this.floor = floor;
        this.currentVehicle = null;  // empty by default
    }

    public boolean isAvailable() { return currentVehicle == null; }
    public SpotSize getSize() { return size; }
    public int getFloor() { return floor; }
    public int getSpotNumber() { return spotNumber; }

    public boolean canFitVehicle(Vehicle v) {
        return isAvailable() && size.ordinal() >= v.getRequiredSize().ordinal();
    }

    public void park(Vehicle v) {
        if (!canFitVehicle(v)) throw new IllegalStateException("Cannot park here");
        this.currentVehicle = v;
    }

    public Vehicle removeVehicle() {
        Vehicle v = this.currentVehicle;
        this.currentVehicle = null;
        return v;
    }
}

public class Ticket {
    private static int nextId = 1;
    private final int ticketId;
    private final Vehicle vehicle;
    private final ParkingSpot spot;
    private final LocalDateTime entryTime;
    private LocalDateTime exitTime;

    public Ticket(Vehicle vehicle, ParkingSpot spot) {
        this.ticketId = nextId++;
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = LocalDateTime.now();
    }

    public void markExit() { this.exitTime = LocalDateTime.now(); }

    public long getDurationMinutes() {
        LocalDateTime end = exitTime != null ? exitTime : LocalDateTime.now();
        return java.time.Duration.between(entryTime, end).toMinutes();
    }

    // Getters
    public int getTicketId() { return ticketId; }
    public Vehicle getVehicle() { return vehicle; }
    public ParkingSpot getSpot() { return spot; }
}`,
          },
          {
            language: 'python',
            label: 'Python',
            code: `class ParkingSpot:
    def __init__(self, spot_number: int, size: SpotSize, floor: int):
        self.spot_number = spot_number
        self.size = size
        self.floor = floor
        self.current_vehicle = None  # empty by default

    @property
    def is_available(self):
        return self.current_vehicle is None

    def can_fit_vehicle(self, vehicle: Vehicle) -> bool:
        return self.is_available and self.size.value >= vehicle.required_size.value

    def park(self, vehicle: Vehicle):
        if not self.can_fit_vehicle(vehicle):
            raise ValueError("Cannot park here")
        self.current_vehicle = vehicle

    def remove_vehicle(self) -> Vehicle:
        v = self.current_vehicle
        self.current_vehicle = None
        return v


class Ticket:
    _next_id = 1

    def __init__(self, vehicle: Vehicle, spot: ParkingSpot):
        self.ticket_id = Ticket._next_id
        Ticket._next_id += 1
        self.vehicle = vehicle
        self.spot = spot
        self.entry_time = datetime.now()
        self.exit_time = None

    def mark_exit(self):
        self.exit_time = datetime.now()

    @property
    def duration_minutes(self):
        end = self.exit_time or datetime.now()
        return (end - self.entry_time).total_seconds() / 60`,
          },
        ],
        keyTakeaway:
          'ParkingSpot manages occupancy with can_fit, park, and remove. Ticket tracks time.',
      },
      {
        title: 'Floor and ParkingLot',
        content:
          'The Floor manages a collection of spots. The ParkingLot orchestrates everything.',
        code: [
          {
            language: 'python',
            label: 'Python — Complete System',
            code: `class Floor:
    def __init__(self, floor_number: int, spots: list[ParkingSpot]):
        self.floor_number = floor_number
        self.spots = spots

    def find_available_spot(self, vehicle: Vehicle):
        """Find the first available spot that fits the vehicle."""
        for spot in self.spots:
            if spot.can_fit_vehicle(vehicle):
                return spot
        return None

    def get_available_count(self, size: SpotSize = None) -> int:
        return sum(
            1 for s in self.spots
            if s.is_available and (size is None or s.size == size)
        )


class ParkingLot:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, name: str, floors: list[Floor]):
        if hasattr(self, '_initialized'):
            return
        self.name = name
        self.floors = floors
        self.active_tickets = {}  # license_plate -> Ticket
        self._initialized = True

    def park_vehicle(self, vehicle: Vehicle) -> Ticket:
        """Find a spot and issue a ticket."""
        if vehicle.license_plate in self.active_tickets:
            raise ValueError("Vehicle already parked!")

        for floor in self.floors:
            spot = floor.find_available_spot(vehicle)
            if spot:
                spot.park(vehicle)
                ticket = Ticket(vehicle, spot)
                self.active_tickets[vehicle.license_plate] = ticket
                print(f"Parked {vehicle.license_plate} at "
                      f"Floor {floor.floor_number}, Spot {spot.spot_number}")
                return ticket

        raise ValueError("No available spots for this vehicle!")

    def exit_vehicle(self, license_plate: str, rate_per_min=0.05) -> float:
        """Remove vehicle and calculate fee."""
        ticket = self.active_tickets.pop(license_plate, None)
        if not ticket:
            raise ValueError("Vehicle not found!")

        ticket.mark_exit()
        ticket.spot.remove_vehicle()
        fee = ticket.duration_minutes * rate_per_min
        print(f"Vehicle {license_plate} exited. "
              f"Duration: {ticket.duration_minutes} min. Fee: \\\${fee}")
        return fee

    def get_availability(self):
        """Show available spots per floor."""
        for floor in self.floors:
            print(f"Floor {floor.floor_number}: "
                  f"Small={floor.get_available_count(SpotSize.SMALL)}, "
                  f"Medium={floor.get_available_count(SpotSize.MEDIUM)}, "
                  f"Large={floor.get_available_count(SpotSize.LARGE)}")


# === Setup and Demo ===
def create_parking_lot():
    floors = []
    for f in range(1, 4):  # 3 floors
        spots = []
        for i in range(1, 6):
            spots.append(ParkingSpot(i, SpotSize.SMALL, f))
        for i in range(6, 16):
            spots.append(ParkingSpot(i, SpotSize.MEDIUM, f))
        for i in range(16, 20):
            spots.append(ParkingSpot(i, SpotSize.LARGE, f))
        floors.append(Floor(f, spots))
    return ParkingLot("Downtown Garage", floors)

# lot = create_parking_lot()
# lot.park_vehicle(Car("ABC-123"))
# lot.park_vehicle(Truck("XYZ-789"))
# lot.get_availability()
# lot.exit_vehicle("ABC-123")`,
          },
        ],
        keyTakeaway:
          'ParkingLot is a Singleton that orchestrates floors, spots, tickets, and fee calculation.',
      },
      {
        title: 'Design Patterns Used',
        content:
          'Let us recap the OOP principles and patterns used:\n\n- **Encapsulation**: Spot manages its own occupancy state privately\n- **Inheritance**: Vehicle → Motorcycle, Car, Truck\n- **Polymorphism**: All vehicles treated uniformly through Vehicle base class\n- **Singleton**: Only one ParkingLot instance\n- **Strategy**: FeeCalculator can be swapped (hourly, flat rate, dynamic pricing)\n- **Composition**: ParkingLot HAS Floors, Floor HAS Spots\n\nThis is exactly what interviewers want to see: not just working code, but clean OOP design with appropriate patterns.',
        keyTakeaway:
          'A good OOP design uses multiple principles and patterns together naturally.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Not starting with requirements gathering',
        explanation:
          'Jumping into code without clear requirements leads to missing features and poor design. Always ask clarifying questions first.',
      },
      {
        mistake: 'Using strings instead of enums for types',
        explanation:
          'Using "small", "medium", "large" strings is error-prone (typos). Enums provide type safety and IDE support.',
      },
      {
        mistake: 'Putting all logic in the ParkingLot class',
        explanation:
          'Each class should manage its own concerns: Spot manages occupancy, Floor manages spot searching, ParkingLot orchestrates.',
      },
      {
        mistake: 'Forgetting thread safety',
        explanation:
          'Multiple entry/exit points means concurrent access. Use locks on critical sections like spot assignment.',
      },
    ],
    practiceQuestions: [
      'Add a VIP/reserved spot system to the parking lot design.',
      'How would you add dynamic pricing (higher rates during peak hours)?',
      'Design the payment system (cash, card, mobile) using the Strategy pattern.',
      'How would you make spot assignment thread-safe?',
      'Add an electric vehicle charging spot type.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which design pattern is most appropriate for the ParkingLot class to ensure only one instance exists?',
        options: ['Factory', 'Observer', 'Singleton', 'Strategy'],
        answer: 'Singleton',
        explanation: 'The ParkingLot should be a Singleton since there is only one parking lot system. This ensures a single point of coordination for all entry/exit operations.',
      },
      {
        type: 'mcq',
        question: 'In the parking lot design, which OOP concept is used when Motorcycle, Car, and Truck all extend Vehicle?',
        options: ['Encapsulation', 'Inheritance', 'Composition', 'Singleton'],
        answer: 'Inheritance',
        explanation: 'Motorcycle, Car, and Truck are subclasses of the Vehicle base class. They inherit common properties (license plate, required spot size) and each specifies its own spot size requirement.',
      },
      {
        type: 'short-answer',
        question: 'What design pattern would you use for implementing different pricing strategies (hourly, daily, monthly) in the parking lot?',
        answer: 'Strategy pattern',
        explanation: 'The Strategy pattern is ideal for interchangeable fee calculation algorithms. You can define a FeeCalculator interface with different implementations (HourlyFee, DailyFee, MonthlyFee) and swap them at runtime.',
      },
      {
        type: 'mcq',
        question: 'What relationship does ParkingLot have with Floor in this design?',
        options: ['IS-A (inheritance)', 'HAS-A (composition)', 'USES-A (dependency)', 'None'],
        answer: 'HAS-A (composition)',
        explanation: 'A ParkingLot HAS many Floors. This is a composition relationship — the floors are contained within the parking lot. Similarly, a Floor HAS many ParkingSpots.',
      },
      {
        type: 'short-answer',
        question: 'Why should the Vehicle class be abstract in this design?',
        answer: 'Because you never create a generic Vehicle — you always create a specific type like Car, Motorcycle, or Truck',
        explanation: 'Making Vehicle abstract prevents instantiation of a generic vehicle. Each vehicle must be a concrete type (Motorcycle, Car, Truck) that specifies its required spot size. This enforces correct usage through the type system.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     14. DESIGN: ATM MACHINE
     ────────────────────────────────────────────── */
  'design-atm-machine': {
    steps: [
      {
        title: 'Understanding ATM Requirements',
        content:
          'Let us design an ATM system from scratch. Here are the requirements:\n\n**Functional Requirements:**\n1. User inserts card and enters PIN to authenticate\n2. Check balance\n3. Withdraw cash (with denomination breakdown)\n4. Deposit cash\n5. Transfer between accounts\n6. Print receipt\n7. ATM has limited cash inventory\n\n**Non-Functional:**\n- Secure (PIN validation, session timeout)\n- Handle insufficient funds\n- Handle ATM out of cash\n- Transaction logging\n- State machine for flow control',
        keyTakeaway:
          'ATM design tests state management, transaction handling, and clean OOP decomposition.',
      },
      {
        title: 'Core Classes',
        content:
          'From the requirements, we identify:\n\n1. **ATM** — Main machine (Singleton per physical machine)\n2. **Account** — Bank account with balance\n3. **Card** — Links to an account, has PIN\n4. **Transaction** — Base class (Withdrawal, Deposit, Transfer)\n5. **CashDispenser** — Manages bill denominations\n6. **ATMState** — State pattern for flow control (Idle, Authentication, MainMenu, Transaction)\n7. **Receipt** — Transaction summary',
        diagram: `┌───────────────┐     ┌──────────────┐\n│ ATM (Singlet.)│────►│ ATMState     │\n│ - screen      │     │ (State Ptrn) │\n│ - dispenser   │     ├──────────────┤\n│ - cardReader  │     │Idle|Auth|Menu│\n└───────┬───────┘     │|Transaction  │\n        │             └──────────────┘\n   ┌────┴─────┐\n   │  Card    │────►┌──────────┐\n   │ - PIN    │     │ Account  │\n   └──────────┘     │ - balance│\n                    └──────────┘\n┌───────────────┐\n│ Transaction   │ (abstract)\n├───────────────┤\n│Withdrawal|    │\n│Deposit|Xfer  │\n└───────────────┘`,
        keyTakeaway:
          'The ATM design uses Singleton, State, and Strategy patterns together.',
      },
      {
        title: 'Account and Card',
        content:
          'The foundational classes that model bank data.',
        code: [
          {
            language: 'python',
            label: 'Python',
            code: `import hashlib
from datetime import datetime
from enum import Enum
from abc import ABC, abstractmethod

class Account:
    def __init__(self, account_number: str, holder_name: str, balance: float):
        self.account_number = account_number
        self.holder_name = holder_name
        self._balance = balance             # private balance
        self._transaction_history = []      # audit log

    @property
    def balance(self):
        return self._balance

    def debit(self, amount: float):
        """Withdraw from account."""
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount
        self._log(f"DEBIT: -\\\${amount}")

    def credit(self, amount: float):
        """Deposit to account."""
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self._balance += amount
        self._log(f"CREDIT: +\\\${amount}")

    def _log(self, entry: str):
        self._transaction_history.append(
            f"{datetime.now().strftime('%Y-%m-%d %H:%M')} | {entry} | Balance: \\\${self._balance}"
        )

    def get_history(self) -> list[str]:
        return self._transaction_history.copy()  # return copy, not reference


class Card:
    def __init__(self, card_number: str, pin: str, account: Account):
        self.card_number = card_number
        self._pin_hash = hashlib.sha256(pin.encode()).hexdigest()
        self.account = account
        self.is_blocked = False

    def verify_pin(self, entered_pin: str) -> bool:
        """Verify PIN without exposing the hash."""
        if self.is_blocked:
            raise ValueError("Card is blocked")
        return self._pin_hash == hashlib.sha256(entered_pin.encode()).hexdigest()`,
          },
          {
            language: 'java',
            label: 'Java',
            code: `import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

public class Account {
    private final String accountNumber;
    private final String holderName;
    private double balance;
    private final List<String> transactionHistory = new ArrayList<>();

    public Account(String accountNumber, String holderName, double balance) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = balance;
    }

    public double getBalance() { return balance; }
    public String getAccountNumber() { return accountNumber; }

    public synchronized void debit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (amount > balance) throw new IllegalArgumentException("Insufficient funds");
        balance -= amount;
        log("DEBIT: -$" + amount);
    }

    public synchronized void credit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
        log("CREDIT: +$" + amount);
    }

    private void log(String entry) {
        transactionHistory.add(LocalDateTime.now() + " | " + entry + " | Balance: $" + balance);
    }
}`,
          },
        ],
        keyTakeaway:
          'Account encapsulates balance with thread-safe debit/credit. Card encapsulates PIN verification.',
      },
      {
        title: 'Cash Dispenser',
        content:
          'The ATM needs to manage physical bill denominations and find the right combination of bills to dispense.',
        code: [
          {
            language: 'python',
            label: 'Python',
            code: `class CashDispenser:
    def __init__(self):
        # denomination -> count of bills available
        self._inventory = {
            100: 50,   # 50 hundred-dollar bills
            50: 100,   # 100 fifty-dollar bills
            20: 200,   # 200 twenty-dollar bills
            10: 500,   # 500 ten-dollar bills
        }

    @property
    def total_cash(self) -> float:
        return sum(denom * count for denom, count in self._inventory.items())

    def can_dispense(self, amount: float) -> bool:
        """Check if we can make exact change for this amount."""
        if amount > self.total_cash:
            return False
        return self._calculate_bills(amount) is not None

    def dispense(self, amount: float) -> dict:
        """Dispense bills and update inventory."""
        bills = self._calculate_bills(amount)
        if bills is None:
            raise ValueError(f"Cannot dispense \\\${amount} with available denominations")

        # Deduct from inventory
        for denom, count in bills.items():
            self._inventory[denom] -= count

        return bills

    def _calculate_bills(self, amount: float) -> dict | None:
        """Greedy algorithm: use largest bills first."""
        remaining = int(amount)
        result = {}

        for denom in sorted(self._inventory.keys(), reverse=True):
            if remaining <= 0:
                break
            num_bills = min(remaining // denom, self._inventory[denom])
            if num_bills > 0:
                result[denom] = num_bills
                remaining -= denom * num_bills

        return result if remaining == 0 else None

    def refill(self, denomination: int, count: int):
        """Refill the ATM with bills."""
        if denomination in self._inventory:
            self._inventory[denomination] += count`,
          },
        ],
        keyTakeaway:
          'CashDispenser uses a greedy algorithm for bill selection and tracks inventory per denomination.',
      },
      {
        title: 'Transactions',
        content:
          'Each transaction type is a separate class following the Template Method pattern.',
        code: [
          {
            language: 'python',
            label: 'Python',
            code: `class TransactionType(Enum):
    WITHDRAWAL = "withdrawal"
    DEPOSIT = "deposit"
    TRANSFER = "transfer"
    BALANCE_CHECK = "balance_check"

class Transaction(ABC):
    _next_id = 1

    def __init__(self, account: Account, amount: float = 0):
        self.transaction_id = Transaction._next_id
        Transaction._next_id += 1
        self.account = account
        self.amount = amount
        self.timestamp = datetime.now()
        self.success = False

    @abstractmethod
    def execute(self) -> bool:
        """Execute the transaction. Return True on success."""
        pass

    @abstractmethod
    def get_receipt(self) -> str:
        pass


class WithdrawalTransaction(Transaction):
    def __init__(self, account: Account, amount: float, dispenser: CashDispenser):
        super().__init__(account, amount)
        self.dispenser = dispenser
        self.bills = {}

    def execute(self) -> bool:
        try:
            if not self.dispenser.can_dispense(self.amount):
                print("ATM cannot dispense this amount")
                return False
            self.account.debit(self.amount)         # deduct from account
            self.bills = self.dispenser.dispense(self.amount)  # get physical cash
            self.success = True
            return True
        except ValueError as e:
            print(f"Withdrawal failed: {e}")
            return False

    def get_receipt(self) -> str:
        bills_str = ", ".join(f"{count}x \\\${denom}" for denom, count in self.bills.items())
        return (f"=== WITHDRAWAL RECEIPT ===\\n"
                f"Amount: \\\${self.amount}\\n"
                f"Bills: {bills_str}\\n"
                f"Remaining Balance: \\\${self.account.balance}\\n"
                f"Time: {self.timestamp.strftime('%Y-%m-%d %H:%M')}\\n")


class DepositTransaction(Transaction):
    def execute(self) -> bool:
        try:
            self.account.credit(self.amount)
            self.success = True
            return True
        except ValueError as e:
            print(f"Deposit failed: {e}")
            return False

    def get_receipt(self) -> str:
        return (f"=== DEPOSIT RECEIPT ===\\n"
                f"Amount: \\\${self.amount}\\n"
                f"New Balance: \\\${self.account.balance}\\n"
                f"Time: {self.timestamp.strftime('%Y-%m-%d %H:%M')}\\n")


class TransferTransaction(Transaction):
    def __init__(self, from_account: Account, to_account: Account, amount: float):
        super().__init__(from_account, amount)
        self.to_account = to_account

    def execute(self) -> bool:
        try:
            self.account.debit(self.amount)       # debit source
            self.to_account.credit(self.amount)   # credit destination
            self.success = True
            return True
        except ValueError as e:
            print(f"Transfer failed: {e}")
            return False

    def get_receipt(self) -> str:
        return (f"=== TRANSFER RECEIPT ===\\n"
                f"From: {self.account.account_number}\\n"
                f"To: {self.to_account.account_number}\\n"
                f"Amount: \\\${self.amount}\\n"
                f"Time: {self.timestamp.strftime('%Y-%m-%d %H:%M')}\\n")`,
          },
        ],
        keyTakeaway:
          'Each transaction type encapsulates its own logic. The base Transaction class defines the interface.',
      },
      {
        title: 'ATM State Machine',
        content:
          'The ATM flows through states: Idle -> CardInserted -> Authenticated -> Transaction -> Idle. We model this with the State pattern.',
        code: [
          {
            language: 'python',
            label: 'Python',
            code: `class ATMState(Enum):
    IDLE = "idle"                 # waiting for card
    CARD_INSERTED = "card_inserted"   # card in, waiting for PIN
    AUTHENTICATED = "authenticated"   # PIN verified, show menu
    TRANSACTION = "transaction"       # processing a transaction

class ATM:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, atm_id: str):
        if hasattr(self, '_initialized'):
            return
        self.atm_id = atm_id
        self.dispenser = CashDispenser()
        self._state = ATMState.IDLE
        self._current_card = None
        self._pin_attempts = 0
        self._max_pin_attempts = 3
        self._initialized = True

    @property
    def state(self):
        return self._state

    def insert_card(self, card: Card):
        """Step 1: Insert card."""
        if self._state != ATMState.IDLE:
            raise ValueError("ATM is busy")
        if card.is_blocked:
            raise ValueError("Card is blocked")
        self._current_card = card
        self._pin_attempts = 0
        self._state = ATMState.CARD_INSERTED
        print(f"Card {card.card_number} inserted. Please enter PIN.")

    def enter_pin(self, pin: str) -> bool:
        """Step 2: Verify PIN."""
        if self._state != ATMState.CARD_INSERTED:
            raise ValueError("No card inserted")

        if self._current_card.verify_pin(pin):
            self._state = ATMState.AUTHENTICATED
            print("PIN verified. Welcome!")
            return True
        else:
            self._pin_attempts += 1
            remaining = self._max_pin_attempts - self._pin_attempts
            if remaining <= 0:
                self._current_card.is_blocked = True
                self.eject_card()
                print("Too many attempts. Card blocked.")
                return False
            print(f"Incorrect PIN. {remaining} attempts remaining.")
            return False

    def check_balance(self):
        """Show account balance."""
        self._require_authenticated()
        balance = self._current_card.account.balance
        print(f"Current balance: \\\${balance}")
        return balance

    def withdraw(self, amount: float) -> bool:
        """Withdraw cash."""
        self._require_authenticated()
        self._state = ATMState.TRANSACTION
        txn = WithdrawalTransaction(
            self._current_card.account, amount, self.dispenser
        )
        success = txn.execute()
        if success:
            print(txn.get_receipt())
        self._state = ATMState.AUTHENTICATED
        return success

    def deposit(self, amount: float) -> bool:
        """Deposit cash."""
        self._require_authenticated()
        self._state = ATMState.TRANSACTION
        txn = DepositTransaction(self._current_card.account, amount)
        success = txn.execute()
        if success:
            print(txn.get_receipt())
        self._state = ATMState.AUTHENTICATED
        return success

    def transfer(self, to_account: Account, amount: float) -> bool:
        """Transfer funds."""
        self._require_authenticated()
        self._state = ATMState.TRANSACTION
        txn = TransferTransaction(
            self._current_card.account, to_account, amount
        )
        success = txn.execute()
        if success:
            print(txn.get_receipt())
        self._state = ATMState.AUTHENTICATED
        return success

    def eject_card(self):
        """Return card and reset."""
        print(f"Ejecting card. Thank you!")
        self._current_card = None
        self._state = ATMState.IDLE

    def _require_authenticated(self):
        if self._state != ATMState.AUTHENTICATED:
            raise ValueError("Please authenticate first")`,
          },
        ],
        keyTakeaway:
          'ATM uses State pattern for flow control: Idle -> CardInserted -> Authenticated -> Transaction.',
      },
      {
        title: 'Putting It All Together',
        content:
          'Here is a complete demo showing the ATM in action.',
        code: [
          {
            language: 'python',
            label: 'Python — Demo',
            code: `# === Setup ===
alice_account = Account("ACC-001", "Alice Johnson", 5000.00)
bob_account = Account("ACC-002", "Bob Smith", 3000.00)

alice_card = Card("4111-1111-1111-1111", "1234", alice_account)

atm = ATM("ATM-DOWNTOWN-01")

# === Session ===
atm.insert_card(alice_card)          # Card inserted. Please enter PIN.
atm.enter_pin("0000")                # Incorrect PIN. 2 attempts remaining.
atm.enter_pin("1234")                # PIN verified. Welcome!

atm.check_balance()                  # Current balance: $5000.00

atm.withdraw(280)                    # Dispenses 2x $100, 1x $50, 1x $20, 1x $10
                                     # Remaining Balance: $4720.00

atm.deposit(500)                     # New Balance: $5220.00

atm.transfer(bob_account, 1000)      # Transfer $1000 to Bob
                                     # Alice: $4220.00, Bob: $4000.00

atm.eject_card()                     # Ejecting card. Thank you!

# Attempt to use ATM without card
# atm.check_balance()  # ValueError: Please authenticate first`,
          },
        ],
        keyTakeaway:
          'The ATM enforces a strict flow through states, ensuring security and correctness at every step.',
      },
      {
        title: 'Design Patterns Recap',
        content:
          'The ATM design showcases many OOP concepts:\n\n- **Singleton**: One ATM instance per physical machine\n- **State Pattern**: ATM states control valid operations\n- **Strategy Pattern**: Different transaction types (Withdrawal, Deposit, Transfer)\n- **Template Method**: Transaction base class with execute() and get_receipt()\n- **Encapsulation**: Account hides balance, Card hides PIN hash\n- **Inheritance**: Transaction → WithdrawalTransaction, DepositTransaction\n- **Composition**: ATM HAS-A CashDispenser, HAS-A state\n\nIn an interview, explain these choices explicitly — it shows mastery.',
        keyTakeaway:
          'The ATM design naturally combines Singleton, State, Strategy, Template Method, and Encapsulation.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Not enforcing state transitions',
        explanation:
          'Without a state machine, users could withdraw without authentication. Always validate the current state before allowing operations.',
      },
      {
        mistake: 'Storing PIN in plain text',
        explanation:
          'Always hash PINs. Store only the hash and compare hashes, never raw PINs.',
      },
      {
        mistake: 'Not handling concurrent access',
        explanation:
          'Two people should not be able to use the same ATM simultaneously. The state machine inherently prevents this, but account operations still need synchronization.',
      },
      {
        mistake: 'Putting all logic in the ATM class',
        explanation:
          'Separate concerns: Account handles money, CashDispenser handles bills, Transaction handles logic, ATM orchestrates.',
      },
    ],
    practiceQuestions: [
      'Add a mini-statement feature that shows the last 5 transactions.',
      'How would you handle the ATM running low on a specific denomination?',
      'Design a PIN change flow with proper validation.',
      'Add daily withdrawal limits to the ATM system.',
      'How would you add support for multiple currencies?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which design pattern is used to manage the ATM flow (Idle → Authentication → MainMenu → Transaction)?',
        options: ['Observer', 'Strategy', 'State', 'Factory'],
        answer: 'State',
        explanation: 'The State pattern is used for ATM flow control. Each state (Idle, Authentication, MainMenu, Transaction) is a separate class that handles user actions differently. The ATM delegates behavior to the current state object.',
      },
      {
        type: 'mcq',
        question: 'In the ATM design, why is Transaction an abstract class with Withdrawal, Deposit, and Transfer as subclasses?',
        options: ['To save memory', 'Because each transaction type has different execution logic but shares common structure', 'To prevent instantiation of the ATM class', 'To implement the Singleton pattern'],
        answer: 'Because each transaction type has different execution logic but shares common structure',
        explanation: 'Transaction as an abstract class captures shared behavior (timestamp, amount, status) while forcing each subclass to implement its own execute() logic. A withdrawal debits, a deposit credits, and a transfer does both.',
      },
      {
        type: 'short-answer',
        question: 'Which design pattern would you use for the CashDispenser to break down a withdrawal amount into available bill denominations?',
        answer: 'Chain of Responsibility',
        explanation: 'The Chain of Responsibility pattern is ideal for denomination breakdown. Each handler tries to dispense its denomination (100s, then 50s, then 20s, then 10s) and passes the remaining amount to the next handler in the chain.',
      },
      {
        type: 'mcq',
        question: 'What OOP principle justifies separating Account, Card, CashDispenser, and Transaction into different classes?',
        options: ['Open/Closed Principle', 'Single Responsibility Principle', 'Liskov Substitution Principle', 'Dependency Inversion Principle'],
        answer: 'Single Responsibility Principle',
        explanation: 'Each class has one responsibility: Account handles money, Card handles authentication, CashDispenser manages physical bills, and Transaction handles logic. This makes each class easier to understand, test, and modify independently.',
      },
      {
        type: 'short-answer',
        question: 'Why is the ATM class typically implemented as a Singleton?',
        answer: 'Because each physical ATM machine should have exactly one software instance coordinating its operations',
        explanation: 'A Singleton ensures there is only one ATM controller per physical machine, preventing conflicts in cash inventory, session management, and state transitions. Multiple instances could cause race conditions with the cash dispenser.',
      },
    ],
  },
};
