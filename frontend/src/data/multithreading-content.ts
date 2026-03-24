import type { LessonStep, QuizQuestion } from '@/lib/learn-data';

export const multithreadingLessons: Record<string, {
  steps: LessonStep[];
  commonMistakes?: { mistake: string; explanation: string }[];
  practiceQuestions?: string[];
  quiz?: QuizQuestion[];
}> = {
  /* ──────────────────────────────────────────────
     1. WHAT IS A THREAD?
     ────────────────────────────────────────────── */
  'what-is-a-thread': {
    steps: [
      {
        title: 'The Kitchen Analogy',
        content:
          'Imagine a restaurant kitchen. The kitchen itself is a **process** — it has its own space, equipment, and ingredients. Now imagine multiple **chefs** working in that kitchen simultaneously — one is chopping vegetables, another is grilling meat, a third is plating desserts. Each chef is a **thread**.\n\nAll chefs share the same kitchen (memory space) but each works on their own task independently. They can collaborate (pass ingredients) but must coordinate (not two chefs grabbing the same knife at once).',
        analogy:
          'One kitchen = one process. Multiple chefs = multiple threads. They share the workspace (memory) but each executes their own sequence of steps.',
        keyTakeaway:
          'A thread is the smallest unit of execution within a process. Threads share memory but run independently.',
      },
      {
        title: 'What Exactly IS a Thread?',
        content:
          'Technically, a thread is a **lightweight unit of execution** within a process. Here is what a thread has:\n\n- Its own **program counter** (where in the code it is executing)\n- Its own **stack** (local variables, function call chain)\n- Its own **register state** (CPU register values)\n\nBut threads within the same process **share**:\n- **Heap memory** (objects, data structures)\n- **File handles** (open files, sockets)\n- **Code segment** (the program itself)\n\nThis sharing is both the superpower and the danger of threads.',
        diagram: `┌─────────────────────────────────────┐\n│            PROCESS                  │\n│  ┌─────────────────────────────┐   │\n│  │  SHARED: Heap, Code, Files  │   │\n│  └─────────────────────────────┘   │\n│                                     │\n│  ┌──────────┐    ┌──────────┐      │\n│  │ Thread 1 │    │ Thread 2 │      │\n│  │ ┌──────┐ │    │ ┌──────┐ │      │\n│  │ │Stack │ │    │ │Stack │ │      │\n│  │ │Regs  │ │    │ │Regs  │ │      │\n│  │ │PC    │ │    │ │PC    │ │      │\n│  │ └──────┘ │    │ └──────┘ │      │\n│  │ PRIVATE  │    │ PRIVATE  │      │\n│  └──────────┘    └──────────┘      │\n└─────────────────────────────────────┘`,
        keyTakeaway:
          'Each thread has its own stack and program counter, but shares heap memory and resources with other threads in the same process.',
      },
      {
        title: 'Why Use Threads?',
        content:
          'Threads exist to do more work in less time. Here are the key motivations:\n\n1. **Parallelism** — Use multiple CPU cores simultaneously. An 8-core machine can run 8 threads truly in parallel.\n2. **Responsiveness** — Keep the UI responsive while doing heavy work in the background (file downloads, calculations).\n3. **Resource Sharing** — Threads share memory, so communicating between them is faster than between processes (no need for inter-process communication).\n4. **Efficiency** — Creating a thread is much cheaper than creating a new process.',
        code: [
          {
            language: 'python',
            label: 'Python — Why Threading Matters',
            code: `import time

# WITHOUT threading — sequential, slow
def download_file(name, seconds):
    print(f"Downloading {name}...")
    time.sleep(seconds)  # simulate download time
    print(f"  {name} complete!")

# Sequential: 3 + 2 + 4 = 9 seconds total
start = time.time()
download_file("file_a.zip", 3)
download_file("file_b.zip", 2)
download_file("file_c.zip", 4)
print(f"Sequential time: {time.time() - start:.1f}s")  # ~9.0s

# WITH threading — concurrent, fast
import threading

start = time.time()
threads = [
    threading.Thread(target=download_file, args=("file_a.zip", 3)),
    threading.Thread(target=download_file, args=("file_b.zip", 2)),
    threading.Thread(target=download_file, args=("file_c.zip", 4)),
]
for t in threads:
    t.start()    # start all downloads simultaneously
for t in threads:
    t.join()     # wait for all to complete
print(f"Threaded time: {time.time() - start:.1f}s")  # ~4.0s (max of 3,2,4)`,
          },
        ],
        keyTakeaway:
          'Threads enable parallelism, responsiveness, and efficiency by running tasks concurrently.',
      },
      {
        title: 'Thread Lifecycle',
        content:
          'A thread goes through several states during its life:\n\n1. **New** — Thread object created but not started.\n2. **Runnable** — Thread is ready to run, waiting for CPU time.\n3. **Running** — Thread is actively executing on a CPU core.\n4. **Blocked/Waiting** — Thread is paused (waiting for a lock, sleeping, or waiting for I/O).\n5. **Terminated** — Thread has finished execution.\n\nThe operating system\'s **scheduler** decides which runnable threads get CPU time.',
        flow: [
          { label: 'New', description: 'Thread created', icon: '🆕' },
          { label: 'Runnable', description: 'start() called', icon: '🏃' },
          { label: 'Running', description: 'Scheduler picks it', icon: '⚡' },
          { label: 'Blocked', description: 'sleep, lock, I/O', icon: '⏸️' },
          { label: 'Terminated', description: 'run() completes', icon: '🏁' },
        ],
        keyTakeaway:
          'Thread lifecycle: New -> Runnable -> Running -> Blocked/Waiting -> Terminated.',
      },
      {
        title: 'Single-Threaded vs Multi-Threaded',
        content:
          'Most programs start with a single thread — the **main thread**. When you call `main()` in Java or run a Python script, that is the main thread. Multi-threading means creating additional threads to work alongside the main thread.\n\nEven a simple web browser uses many threads:\n- Main thread handles UI rendering\n- Network threads fetch web pages\n- JavaScript thread executes page scripts\n- Timer threads handle animations',
        code: [
          {
            language: 'java',
            label: 'Java — Main Thread',
            code: `public class Main {
    public static void main(String[] args) {
        // This code runs on the "main" thread
        Thread current = Thread.currentThread();
        System.out.println("Thread name: " + current.getName());   // "main"
        System.out.println("Thread ID: " + current.getId());       // 1
        System.out.println("Is alive: " + current.isAlive());      // true
        System.out.println("Priority: " + current.getPriority());  // 5 (normal)
    }
}`,
          },
        ],
        keyTakeaway:
          'Every program has a main thread. Multi-threading adds worker threads for concurrent tasks.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Thinking threads run truly in parallel on a single-core CPU',
        explanation:
          'On a single core, threads are interleaved (time-sliced), not truly parallel. True parallelism requires multiple CPU cores.',
      },
      {
        mistake: 'Assuming thread execution order is deterministic',
        explanation:
          'The OS scheduler decides when each thread runs. Two runs of the same program can produce different thread execution orders.',
      },
      {
        mistake: 'Confusing concurrency with parallelism',
        explanation:
          'Concurrency = dealing with many things at once (structure). Parallelism = doing many things at once (execution). You can have concurrency without parallelism.',
      },
      {
        mistake: 'Ignoring the Python GIL',
        explanation:
          'CPython has a Global Interpreter Lock (GIL) that prevents true parallel execution of Python threads. Use multiprocessing for CPU-bound tasks in Python.',
      },
    ],
    practiceQuestions: [
      'What is the difference between a thread and a process?',
      'Name three things threads share and three things each thread has its own copy of.',
      'Why is creating a thread cheaper than creating a process?',
      'Draw the thread lifecycle diagram and explain each state.',
      'Give a real-world example where multi-threading improves performance.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which of the following is NOT shared between threads in the same process?',
        options: ['Heap memory', 'File handles', 'Stack', 'Code segment'],
        answer: 'Stack',
        explanation: 'Each thread has its own private stack (local variables and function call chain), program counter, and register state. Heap memory, file handles, and code are shared among all threads in a process.',
      },
      {
        type: 'mcq',
        question: 'What is the correct order of thread lifecycle states?',
        options: ['New -> Running -> Runnable -> Terminated', 'New -> Runnable -> Running -> Terminated', 'Runnable -> New -> Running -> Terminated', 'New -> Blocked -> Running -> Terminated'],
        answer: 'New -> Runnable -> Running -> Terminated',
        explanation: 'A thread starts in the New state when created, becomes Runnable when start() is called, enters Running when the scheduler picks it, and reaches Terminated when execution completes. It can also go to Blocked/Waiting from Running.',
      },
      {
        type: 'short-answer',
        question: 'What is the smallest unit of execution within a process?',
        answer: 'A thread',
        explanation: 'A thread is the smallest unit of execution within a process. It has its own program counter, stack, and registers, but shares heap memory and resources with other threads in the same process.',
      },
      {
        type: 'mcq',
        question: 'Why does multi-threading improve performance for I/O-bound tasks?',
        options: ['It uses more CPU cores for computation', 'Other threads can run while one thread waits for I/O', 'It reduces the total amount of I/O needed', 'It compresses data before sending to disk'],
        answer: 'Other threads can run while one thread waits for I/O',
        explanation: 'When a thread is blocked waiting for I/O (network, disk), the CPU is idle. Multi-threading allows other threads to use that CPU time productively, improving overall throughput.',
      },
      {
        type: 'short-answer',
        question: 'What prevents true parallel execution of Python threads for CPU-bound tasks?',
        answer: 'The Global Interpreter Lock (GIL)',
        explanation: 'CPython has a Global Interpreter Lock (GIL) that allows only one thread to execute Python bytecode at a time. For CPU-bound tasks, use the multiprocessing module instead.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     2. PROCESS VS THREAD
     ────────────────────────────────────────────── */
  'process-vs-thread': {
    steps: [
      {
        title: 'Restaurant vs Chef',
        content:
          'A **process** is an entire restaurant — it has its own building, kitchen, inventory, and staff. A **thread** is a chef within that restaurant — working in the shared kitchen.\n\nTwo restaurants (processes) are completely independent: they have separate buildings, separate equipment, and separate ingredients. If one restaurant burns down, the other is unaffected.\n\nTwo chefs (threads) in the same restaurant share everything: if one chef spills sauce on the counter, the other chef sees it immediately.',
        analogy:
          'Processes = separate restaurants (isolated). Threads = chefs in the same kitchen (shared workspace). A crash in one restaurant does not affect another, but a mess made by one chef affects all chefs in that kitchen.',
        keyTakeaway:
          'Processes are isolated with separate memory. Threads share memory within the same process.',
      },
      {
        title: 'Memory Model Comparison',
        content:
          'The fundamental difference is how memory is organized:',
        comparison: {
          leftTitle: 'Process',
          rightTitle: 'Thread',
          items: [
            { left: 'Own virtual memory space', right: 'Shares process memory' },
            { left: 'Own heap, stack, code segment', right: 'Own stack; shared heap and code' },
            { left: 'Isolated from other processes', right: 'Can see other threads\' data' },
            { left: 'Communication via IPC (pipes, sockets)', right: 'Communication via shared variables' },
            { left: 'Heavy to create (~10ms)', right: 'Light to create (~1ms)' },
            { left: 'Crash does NOT affect other processes', right: 'Crash CAN take down whole process' },
          ],
        },
        keyTakeaway:
          'Processes: isolated, safe, expensive. Threads: shared memory, fast, risky.',
      },
      {
        title: 'Context Switching Cost',
        content:
          'When the CPU switches from one task to another, it must save the current state and load the new state. This is called a **context switch**.\n\n**Thread context switch** is cheap:\n- Save/restore registers, program counter, and stack pointer\n- Memory mapping stays the same (same process)\n\n**Process context switch** is expensive:\n- Everything above PLUS:\n- Flush CPU caches (different memory space)\n- Update memory mapping (page tables)\n- Flush TLB (Translation Lookaside Buffer)\n\nThread switching is typically 5-10x faster than process switching.',
        table: {
          headers: ['Aspect', 'Thread Switch', 'Process Switch'],
          rows: [
            ['Registers', 'Save/restore', 'Save/restore'],
            ['Stack pointer', 'Change', 'Change'],
            ['Memory mapping', 'No change', 'Full page table switch'],
            ['CPU cache', 'Mostly valid', 'Flushed (cold start)'],
            ['TLB', 'No flush', 'Full flush'],
            ['Typical cost', '~1-10 microseconds', '~10-100 microseconds'],
          ],
        },
        keyTakeaway:
          'Thread context switches are 5-10x faster than process switches because memory mapping stays the same.',
      },
      {
        title: 'When to Use Processes vs Threads',
        content:
          'The choice depends on your needs:',
        code: [
          {
            language: 'python',
            label: 'Python — Process vs Thread',
            code: `import threading
import multiprocessing
import time

# CPU-bound task: compute-heavy work
def cpu_heavy(n):
    total = 0
    for i in range(n):
        total += i * i  # pure computation
    return total

# I/O-bound task: waiting for external resource
def io_heavy(seconds):
    time.sleep(seconds)  # simulates network/disk I/O

# === THREADS: Great for I/O-bound tasks ===
start = time.time()
threads = [threading.Thread(target=io_heavy, args=(2,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(f"4 I/O tasks with threads: {time.time() - start:.1f}s")  # ~2s

# === PROCESSES: Great for CPU-bound tasks ===
start = time.time()
processes = [
    multiprocessing.Process(target=cpu_heavy, args=(10_000_000,))
    for _ in range(4)
]
for p in processes: p.start()
for p in processes: p.join()
print(f"4 CPU tasks with processes: {time.time() - start:.1f}s")  # fast

# Rule of thumb:
# I/O-bound (network, disk, sleep) -> Threads
# CPU-bound (math, compression)     -> Processes (or native threads in Java/C++)`,
          },
        ],
        keyTakeaway:
          'Use threads for I/O-bound tasks (waiting). Use processes for CPU-bound tasks (computing).',
      },
      {
        title: 'Inter-Process Communication (IPC) vs Shared Memory',
        content:
          'Since processes do not share memory, they need special mechanisms to communicate:\n\n**IPC Methods (between processes):**\n- Pipes — one-way data channel\n- Sockets — network-style communication\n- Message Queues — async message passing\n- Shared Memory — mapped memory region (explicit setup)\n- Files — read/write to disk\n\n**Thread Communication:**\n- Shared variables — just read/write the same variable\n- No serialization needed — objects are already in shared memory\n- Much faster, but requires synchronization (locks) to avoid race conditions',
        code: [
          {
            language: 'java',
            label: 'Java — Thread Shared Memory',
            code: `// Threads share memory — direct variable access
public class SharedMemoryExample {
    private static int sharedCounter = 0;  // shared between threads

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                sharedCounter++;  // directly modify shared variable
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                sharedCounter++;  // same variable, different thread
            }
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        // Expected: 2000. Actual: unpredictable! (race condition)
        System.out.println("Counter: " + sharedCounter);
    }
}`,
          },
        ],
        keyTakeaway:
          'Processes use IPC (slow but safe). Threads use shared memory (fast but needs synchronization).',
      },
      {
        title: 'Summary Decision Matrix',
        content:
          'Here is your cheat sheet for choosing between processes and threads:',
        table: {
          headers: ['Need', 'Use Processes', 'Use Threads'],
          rows: [
            ['Isolation / Fault tolerance', 'Yes', 'No'],
            ['Shared state needed', 'No (use IPC)', 'Yes (shared heap)'],
            ['CPU-bound work', 'Yes (bypass GIL)', 'Java/C++ yes, Python no'],
            ['I/O-bound work', 'Overkill', 'Yes'],
            ['Low latency communication', 'No', 'Yes'],
            ['Simple programming model', 'Easier (no sync)', 'Harder (need locks)'],
          ],
        },
        keyTakeaway:
          'Processes for isolation and CPU work. Threads for shared state and I/O work.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using threads for CPU-bound work in Python',
        explanation:
          'Python\'s GIL (Global Interpreter Lock) prevents threads from running CPU-bound code in parallel. Use multiprocessing instead.',
      },
      {
        mistake: 'Thinking processes can share variables directly',
        explanation:
          'Processes have separate memory spaces. You must use IPC mechanisms (pipes, queues, shared memory) to communicate.',
      },
      {
        mistake: 'Creating too many processes for simple tasks',
        explanation:
          'Process creation is expensive. For lightweight I/O tasks like HTTP requests, threads are more efficient.',
      },
    ],
    practiceQuestions: [
      'Explain three key differences between a process and a thread.',
      'Why is a thread context switch faster than a process context switch?',
      'When would you choose multiprocessing over multithreading in Python?',
      'What is the GIL and how does it affect threading in Python?',
      'Give an example where process isolation is critical (hint: browser tabs).',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Why is a thread context switch faster than a process context switch?',
        options: ['Threads have smaller stacks', 'Threads do not require saving registers', 'Memory mapping and TLB do not need to change', 'Threads run at higher priority'],
        answer: 'Memory mapping and TLB do not need to change',
        explanation: 'During a thread context switch, the memory mapping (page tables) stays the same because threads share the same address space. Process switches require a full page table swap and TLB flush, making them 5-10x slower.',
      },
      {
        type: 'mcq',
        question: 'Which communication method is used between threads in the same process?',
        options: ['Pipes', 'Sockets', 'Shared variables', 'Message queues'],
        answer: 'Shared variables',
        explanation: 'Threads share the same heap memory, so they can communicate directly by reading and writing shared variables. Processes need IPC mechanisms like pipes, sockets, or message queues because they have separate memory spaces.',
      },
      {
        type: 'short-answer',
        question: 'What type of tasks should you use processes for in Python instead of threads?',
        answer: 'CPU-bound tasks',
        explanation: 'Due to the GIL, Python threads cannot run CPU-bound code in parallel. Use multiprocessing for compute-heavy tasks (math, compression, data processing) and threads for I/O-bound tasks (network requests, file operations).',
      },
      {
        type: 'mcq',
        question: 'What happens if one thread crashes in a multi-threaded process?',
        options: ['Only that thread stops', 'The entire process may crash', 'Other threads automatically restart it', 'The OS isolates the crash'],
        answer: 'The entire process may crash',
        explanation: 'Since threads share the same memory space, a crash (e.g., segfault, unhandled exception) in one thread can corrupt shared state and take down the entire process. Processes are isolated, so one crashing does not affect others.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     3. CREATING THREADS
     ────────────────────────────────────────────── */
  'creating-threads': {
    steps: [
      {
        title: 'Hiring Your First Workers',
        content:
          'Creating a thread is like hiring a worker. You need to:\n\n1. **Define the job** — What should the thread do?\n2. **Create the worker** — Instantiate a thread object.\n3. **Start the worker** — Tell the thread to begin execution.\n4. **Wait for completion** — Optionally wait for the thread to finish.\n\nLet us see how this works in Java and Python.',
        analogy:
          'Hiring a contractor: (1) Write the job description (Runnable/target function), (2) Sign the contract (create Thread object), (3) Say "start working" (thread.start()), (4) Wait for them to finish (thread.join()).',
        keyTakeaway:
          'Thread creation follows: define task -> create thread -> start -> join.',
      },
      {
        title: 'Creating Threads in Java',
        content:
          'Java offers two ways to create threads:\n\n1. **Extend Thread class** — Override the `run()` method.\n2. **Implement Runnable interface** — Pass a `Runnable` to a Thread (preferred).\n\nThe `Runnable` approach is preferred because Java does not support multiple class inheritance, and it separates the task from the thread mechanism.',
        code: [
          {
            language: 'java',
            label: 'Java — Method 1: Extend Thread',
            code: `// Method 1: Extend Thread class
public class MyThread extends Thread {
    private final String taskName;

    public MyThread(String taskName) {
        this.taskName = taskName;
    }

    @Override
    public void run() {
        // This code runs in the NEW thread
        for (int i = 1; i <= 3; i++) {
            System.out.println(taskName + " - Step " + i +
                " [Thread: " + Thread.currentThread().getName() + "]");
            try {
                Thread.sleep(500);  // simulate work (500ms)
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}

// Usage:
// MyThread t1 = new MyThread("Download");
// MyThread t2 = new MyThread("Compress");
// t1.start();  // starts the thread (calls run() internally)
// t2.start();  // both run concurrently
// t1.join();   // wait for t1 to finish
// t2.join();   // wait for t2 to finish`,
          },
          {
            language: 'java',
            label: 'Java — Method 2: Implement Runnable (Preferred)',
            code: `// Method 2: Implement Runnable interface (PREFERRED)
public class MyTask implements Runnable {
    private final String taskName;

    public MyTask(String taskName) {
        this.taskName = taskName;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(taskName + " - Step " + i);
            try { Thread.sleep(500); }
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }
    }
}

// Usage — pass Runnable to Thread constructor
// Thread t1 = new Thread(new MyTask("Download"));
// Thread t2 = new Thread(new MyTask("Compress"));
// t1.start();
// t2.start();

// Even cleaner with lambda (Java 8+)
// Thread t3 = new Thread(() -> {
//     System.out.println("Running in: " + Thread.currentThread().getName());
// });
// t3.start();`,
          },
        ],
        keyTakeaway:
          'Prefer Runnable over extending Thread. It separates the task from the threading mechanism.',
      },
      {
        title: 'Creating Threads in Python',
        content:
          'Python\'s `threading` module makes thread creation straightforward. You can pass any callable (function, method, lambda) as the target.',
        code: [
          {
            language: 'python',
            label: 'Python — Threading',
            code: `import threading
import time

# Method 1: Pass a function as the target
def download_file(filename, size_mb):
    """Simulates downloading a file."""
    print(f"[{threading.current_thread().name}] Starting download: {filename}")
    time.sleep(size_mb / 10)  # simulate: 10 MB/s
    print(f"[{threading.current_thread().name}] Completed: {filename}")

# Create threads with target function and arguments
t1 = threading.Thread(
    target=download_file,
    args=("video.mp4", 50),   # positional args as tuple
    name="Downloader-1"       # optional: name the thread
)
t2 = threading.Thread(
    target=download_file,
    args=("music.mp3", 10),
    name="Downloader-2"
)

# Start both threads
t1.start()  # begins execution in a new thread
t2.start()  # begins execution in another new thread

# Wait for both to complete
t1.join()   # blocks until t1 finishes
t2.join()   # blocks until t2 finishes
print("All downloads complete!")


# Method 2: Extend Thread class
class WorkerThread(threading.Thread):
    def __init__(self, task_name, duration):
        super().__init__(name=f"Worker-{task_name}")
        self.task_name = task_name
        self.duration = duration

    def run(self):
        """Override run() — this executes in the new thread."""
        print(f"[{self.name}] Starting {self.task_name}")
        time.sleep(self.duration)
        print(f"[{self.name}] Finished {self.task_name}")

worker = WorkerThread("data-processing", 2)
worker.start()
worker.join()`,
          },
        ],
        keyTakeaway:
          'Python threads take a target function and args. Use threading.Thread with start() and join().',
      },
      {
        title: 'Thread Lifecycle in Code',
        content:
          'Let us observe the thread lifecycle states programmatically.',
        code: [
          {
            language: 'java',
            label: 'Java — Thread States',
            code: `public class ThreadLifecycle {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            try {
                System.out.println("Worker running...");
                Thread.sleep(2000);  // goes to TIMED_WAITING state
                System.out.println("Worker done!");
            } catch (InterruptedException e) {
                System.out.println("Worker interrupted!");
            }
        });

        // State: NEW — created but not started
        System.out.println("Before start: " + worker.getState());  // NEW

        worker.start();
        // State: RUNNABLE — started, ready to run
        System.out.println("After start: " + worker.getState());  // RUNNABLE

        Thread.sleep(500);  // let worker enter sleep
        // State: TIMED_WAITING — sleeping
        System.out.println("During sleep: " + worker.getState());  // TIMED_WAITING

        worker.join();  // wait for worker to finish
        // State: TERMINATED — run() completed
        System.out.println("After join: " + worker.getState());  // TERMINATED
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Thread States',
            code: `import threading
import time

def slow_task():
    time.sleep(3)

t = threading.Thread(target=slow_task)

print(f"Before start: alive={t.is_alive()}")  # alive=False

t.start()
print(f"After start: alive={t.is_alive()}")   # alive=True

t.join()  # wait for completion
print(f"After join: alive={t.is_alive()}")     # alive=False`,
          },
        ],
        keyTakeaway:
          'Track thread states: NEW (created), RUNNABLE (started), WAITING (sleeping/blocked), TERMINATED (done).',
      },
      {
        title: 'Daemon Threads',
        content:
          'A **daemon thread** is a background thread that automatically terminates when all non-daemon threads finish. Think of it as a janitor — they clean up in the background and leave when the building closes.\n\nUse daemon threads for:\n- Background logging\n- Garbage collection\n- Heartbeat/health checks\n- Auto-save features',
        code: [
          {
            language: 'python',
            label: 'Python — Daemon Thread',
            code: `import threading
import time

def background_logger():
    """Continuously logs — runs until main thread exits."""
    while True:
        print(f"[Logger] System healthy at {time.strftime('%H:%M:%S')}")
        time.sleep(1)

# Create a daemon thread — auto-exits when main thread finishes
logger = threading.Thread(target=background_logger, daemon=True)
logger.start()

# Main thread does some work
print("Main thread working...")
time.sleep(3)
print("Main thread done. Daemon will auto-terminate.")
# When main() exits, the daemon thread is killed automatically
# No need to join() a daemon thread`,
          },
          {
            language: 'java',
            label: 'Java — Daemon Thread',
            code: `Thread logger = new Thread(() -> {
    while (true) {
        System.out.println("[Logger] System healthy");
        try { Thread.sleep(1000); }
        catch (InterruptedException e) { break; }
    }
});

logger.setDaemon(true);  // MUST set BEFORE start()
logger.start();

// When main() returns, daemon thread auto-terminates
Thread.sleep(3000);
System.out.println("Main done. Daemon will exit.");`,
          },
        ],
        keyTakeaway:
          'Daemon threads run in the background and auto-terminate when all non-daemon threads finish.',
      },
      {
        title: 'Common Pitfall: start() vs run()',
        content:
          'A critical mistake: calling `run()` instead of `start()`. Calling `run()` executes the method **on the current thread** — no new thread is created! Always call `start()` to spawn a new thread.',
        code: [
          {
            language: 'java',
            label: 'Java — start() vs run()',
            code: `Thread t = new Thread(() -> {
    System.out.println("Running in: " + Thread.currentThread().getName());
});

// WRONG: run() executes in the MAIN thread — no concurrency!
t.run();   // prints "Running in: main"

// CORRECT: start() creates a NEW thread
t.start(); // prints "Running in: Thread-0"

// ALSO WRONG: calling start() twice throws IllegalThreadStateException
// t.start(); // IllegalThreadStateException!`,
          },
        ],
        keyTakeaway:
          'Always call start() not run(). start() creates a new thread; run() executes in the current thread.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Calling run() instead of start()',
        explanation:
          'run() executes the code in the current thread. start() creates a new OS thread and then calls run() in that new thread.',
      },
      {
        mistake: 'Calling start() twice on the same thread',
        explanation:
          'A thread can only be started once. Calling start() again throws an exception. Create a new thread if you need to run the task again.',
      },
      {
        mistake: 'Not joining threads before using their results',
        explanation:
          'Without join(), the main thread may continue before worker threads finish, leading to incomplete results or using uninitialized data.',
      },
      {
        mistake: 'Extending Thread class in Java for every task',
        explanation:
          'Prefer Runnable or Callable over extending Thread. It allows your class to extend another class and is better for thread pools.',
      },
    ],
    practiceQuestions: [
      'Create three threads that each print numbers 1-5 with their thread name.',
      'What is the difference between Runnable and Callable in Java?',
      'Implement a daemon thread that monitors a shared variable every second.',
      'Why is Runnable preferred over extending Thread in Java?',
      'Show what happens when you call run() instead of start() — explain the output.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What happens if you call run() instead of start() on a Thread object in Java?',
        options: ['The thread starts in the background', 'The code executes on the current thread, not a new one', 'A RuntimeException is thrown', 'The thread is queued for later execution'],
        answer: 'The code executes on the current thread, not a new one',
        explanation: 'Calling run() directly just invokes the method on the current thread like any normal method call. You must call start() to create a new OS thread that will then invoke run() internally.',
      },
      {
        type: 'mcq',
        question: 'Why is implementing Runnable preferred over extending Thread in Java?',
        options: ['Runnable is faster at runtime', 'Java does not support multiple inheritance, so extending Thread wastes your one inheritance slot', 'Thread class is deprecated', 'Runnable allows returning values'],
        answer: 'Java does not support multiple inheritance, so extending Thread wastes your one inheritance slot',
        explanation: 'Since Java only allows single class inheritance, extending Thread prevents your class from extending anything else. Implementing Runnable (an interface) keeps your inheritance free and separates the task from the threading mechanism.',
      },
      {
        type: 'short-answer',
        question: 'What method do you call to wait for a thread to finish execution?',
        answer: 'join()',
        explanation: 'The join() method blocks the calling thread until the target thread completes execution. This is how you wait for a thread to finish before proceeding with code that depends on its results.',
      },
      {
        type: 'mcq',
        question: 'What is a daemon thread?',
        options: ['A thread with highest priority', 'A background thread that does not prevent the JVM from exiting', 'A thread that cannot be interrupted', 'A thread that runs on a separate CPU core'],
        answer: 'A background thread that does not prevent the JVM from exiting',
        explanation: 'Daemon threads are background service threads (e.g., garbage collection). The JVM exits when all non-daemon threads finish, even if daemon threads are still running. Set with setDaemon(true) before calling start().',
      },
      {
        type: 'short-answer',
        question: 'In Python threading, what parameter do you pass to Thread() to specify the function to execute?',
        answer: 'target',
        explanation: 'You pass the function as the target parameter: threading.Thread(target=my_function, args=(arg1, arg2)). The args parameter is a tuple of positional arguments for the target function.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     4. RACE CONDITIONS
     ────────────────────────────────────────────── */
  'race-conditions': {
    steps: [
      {
        title: 'Two People, One Google Doc',
        content:
          'Imagine Alice and Bob are editing the same Google Doc simultaneously. Alice reads "balance: 100" and adds 50. Bob reads "balance: 100" and subtracts 20. Alice writes "balance: 150". Bob writes "balance: 80". The addition of 50 is lost! This is a **race condition** — the result depends on the unpredictable order of operations.',
        analogy:
          'Two people both read a whiteboard showing "10 cookies left." Person A takes 3 and writes "7". Person B (who also read "10") takes 2 and writes "8". The whiteboard now says 8, but only 5 cookies should remain. The correct answer (5) is lost because both read before either wrote.',
        keyTakeaway:
          'A race condition occurs when multiple threads access shared data concurrently and the result depends on execution order.',
      },
      {
        title: 'The Classic Bank Balance Bug',
        content:
          'This is the most famous race condition example. Two threads try to update the same bank balance simultaneously.',
        code: [
          {
            language: 'java',
            label: 'Java — Race Condition',
            code: `public class BankAccount {
    private int balance = 1000;  // shared mutable state

    public void withdraw(int amount) {
        // This is NOT atomic — it is actually THREE steps:
        // 1. READ balance (load from memory to register)
        // 2. COMPUTE balance - amount
        // 3. WRITE new balance (store from register to memory)
        if (balance >= amount) {        // Step 1: READ
            // Thread can be PREEMPTED here!
            balance = balance - amount;  // Steps 2+3: COMPUTE & WRITE
        }
    }

    public int getBalance() { return balance; }

    public static void main(String[] args) throws InterruptedException {
        BankAccount account = new BankAccount();

        // Two threads both withdraw 800 from a 1000 balance
        Thread t1 = new Thread(() -> account.withdraw(800));
        Thread t2 = new Thread(() -> account.withdraw(800));

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        // Expected: one withdrawal succeeds, balance = 200
        // Actual: BOTH might succeed, balance = -600!
        System.out.println("Balance: " + account.getBalance());
        // Could print 200, 1000, or -600 depending on thread scheduling!
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Race Condition',
            code: `import threading

class BankAccount:
    def __init__(self, balance):
        self.balance = balance  # shared mutable state

    def withdraw(self, amount):
        # NOT atomic: read, compare, compute, write
        if self.balance >= amount:
            # Thread can be SWITCHED here!
            temp = self.balance    # read
            temp -= amount         # compute
            self.balance = temp    # write (stale data!)

account = BankAccount(1000)

def withdraw_many():
    for _ in range(100000):
        account.withdraw(1)  # withdraw $1, 100k times

# Two threads both withdrawing
t1 = threading.Thread(target=withdraw_many)
t2 = threading.Thread(target=withdraw_many)
t1.start()
t2.start()
t1.join()
t2.join()

# Expected: 1000 - 200000 = should be 0 or error
# Actual: some random positive number because increments get lost
print(f"Balance: {account.balance}")  # NOT -199000 or 0!`,
          },
        ],
        keyTakeaway:
          'Race conditions happen because read-modify-write is NOT atomic. Threads can be preempted between steps.',
      },
      {
        title: 'Why Does This Happen?',
        content:
          'The problem is that `balance = balance - amount` is not one operation — it is three:\n\n1. **READ**: Load `balance` from memory into a CPU register.\n2. **COMPUTE**: Subtract `amount` in the register.\n3. **WRITE**: Store the result back to memory.\n\nIf Thread A reads balance (1000), then Thread B reads balance (still 1000, because A has not written yet), both compute independently, and both write — one write overwrites the other.\n\nThis is called a **TOCTOU** (Time Of Check to Time Of Use) race condition.',
        table: {
          headers: ['Step', 'Thread A', 'Thread B', 'Balance in Memory'],
          rows: [
            ['1', 'READ balance → 1000', '-', '1000'],
            ['2', '-', 'READ balance → 1000', '1000'],
            ['3', 'COMPUTE 1000-800 = 200', '-', '1000'],
            ['4', '-', 'COMPUTE 1000-800 = 200', '1000'],
            ['5', 'WRITE 200', '-', '200'],
            ['6', '-', 'WRITE 200', '200'],
          ],
        },
        keyTakeaway:
          'TOCTOU: the time between checking a value and using it is the danger zone where another thread can intervene.',
      },
      {
        title: 'The Counter Example',
        content:
          'The simplest race condition: two threads incrementing a shared counter. Even `counter++` is not atomic!',
        code: [
          {
            language: 'java',
            label: 'Java — Counter Race Condition',
            code: `public class CounterRace {
    private static int counter = 0;  // shared state

    public static void main(String[] args) throws InterruptedException {
        Runnable increment = () -> {
            for (int i = 0; i < 100_000; i++) {
                counter++;  // NOT atomic! (read, increment, write)
            }
        };

        Thread t1 = new Thread(increment);
        Thread t2 = new Thread(increment);
        t1.start();
        t2.start();
        t1.join();
        t2.join();

        // Expected: 200,000
        // Actual: some number LESS than 200,000 (e.g., 163,842)
        System.out.println("Counter: " + counter);
        // Run it multiple times — you get different results each time!
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Counter Race',
            code: `import threading

counter = 0

def increment():
    global counter
    for _ in range(100_000):
        counter += 1  # NOT atomic in general

threads = [threading.Thread(target=increment) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()

# Expected: 500,000
# Actual: less (GIL helps somewhat but does not guarantee atomicity)
print(f"Counter: {counter}")`,
          },
        ],
        keyTakeaway:
          'Even counter++ is not atomic. It is read-increment-write: three separate operations that can be interleaved.',
      },
      {
        title: 'Identifying Race Conditions',
        content:
          'A race condition exists when ALL three conditions are true:\n\n1. **Shared data** — Multiple threads access the same variable/resource.\n2. **Mutable data** — At least one thread modifies the data.\n3. **No synchronization** — There is no mechanism to ensure orderly access.\n\nRemove any ONE of these and the race condition disappears:\n- Make data thread-local (not shared)\n- Make data immutable (read-only)\n- Add locks/synchronization\n\nThe section of code where shared data is accessed is called a **critical section**.',
        cards: [
          { title: 'Shared Data', description: 'Multiple threads access the same variable. Fix: make data thread-local.', icon: '🔗', color: 'red' },
          { title: 'Mutable Data', description: 'At least one thread modifies it. Fix: make data immutable.', icon: '✏️', color: 'red' },
          { title: 'No Synchronization', description: 'No locks or ordering. Fix: add mutex/lock.', icon: '🔓', color: 'red' },
        ],
        keyTakeaway:
          'Race conditions require three things: shared + mutable + unsynchronized. Remove any one to fix.',
      },
      {
        title: 'Real-World Consequences',
        content:
          'Race conditions are not just academic — they cause real disasters:\n\n- **Therac-25 (1985-87)**: A radiation therapy machine killed patients because a race condition caused it to deliver 100x the intended radiation dose.\n- **Northeast Blackout (2003)**: A race condition in alarm software hid critical power grid warnings, contributing to a blackout affecting 55 million people.\n- **Financial systems**: Lost transactions, double charges, and incorrect balances cost financial institutions millions annually.\n\nRace conditions are among the hardest bugs to find because they are **non-deterministic** — they might not reproduce consistently.',
        keyTakeaway:
          'Race conditions are non-deterministic, hard to reproduce, and can have catastrophic real-world consequences.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Assuming single operations are atomic',
        explanation:
          'Even `i++` is three operations (read, increment, write). In Java, only reads/writes of int and reference types are atomic. Use AtomicInteger for atomic increments.',
      },
      {
        mistake: 'Testing on a single-core machine and assuming it is safe',
        explanation:
          'Race conditions may not manifest on single-core machines (threads are interleaved, not parallel). They appear under load on multi-core systems.',
      },
      {
        mistake: 'Thinking "it worked in testing" means no race condition',
        explanation:
          'Race conditions are probabilistic. They might occur once in a million runs. Absence of bugs in testing does not mean absence of race conditions.',
      },
      {
        mistake: 'Using check-then-act without synchronization',
        explanation:
          'Patterns like `if (map.containsKey(key)) map.get(key)` are race conditions. Another thread can remove the key between the check and the get.',
      },
    ],
    practiceQuestions: [
      'Write code that demonstrates a race condition with a shared counter.',
      'Name the three conditions required for a race condition to exist.',
      'Explain why `counter++` is not atomic.',
      'What is a TOCTOU race condition? Give an example.',
      'How would you prove that a race condition exists in code (testing strategy)?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is a race condition?',
        options: ['Two threads competing for CPU time', 'When output depends on uncontrollable timing of events', 'A deadlock between two processes', 'A thread running faster than expected'],
        answer: 'When output depends on uncontrollable timing of events',
        explanation: 'A race condition occurs when the behavior of a program depends on the relative timing of events, such as the order in which threads execute, leading to unpredictable results.',
      },
      {
        type: 'mcq',
        question: 'Why is counter++ not an atomic operation?',
        options: ['It is too slow for the CPU', 'It involves three steps: read, increment, write', 'The compiler optimizes it away', 'It locks the entire memory bus'],
        answer: 'It involves three steps: read, increment, write',
        explanation: 'counter++ is actually three separate CPU operations: (1) read the current value, (2) add 1 to it, (3) write the new value back. Another thread can intervene between any of these steps, causing a lost update.',
      },
      {
        type: 'short-answer',
        question: 'What does TOCTOU stand for in the context of race conditions?',
        answer: 'Time Of Check to Time Of Use',
        explanation: 'TOCTOU (Time Of Check to Time Of Use) is a class of race condition where a condition is checked and then acted upon, but the state changes between the check and the use. For example, checking if a file exists and then reading it — another thread could delete it in between.',
      },
      {
        type: 'mcq',
        question: 'Which of the following is NOT a required condition for a race condition?',
        options: ['Shared mutable state', 'Concurrent access by multiple threads', 'At least one thread performing a write', 'Threads running on different CPU cores'],
        answer: 'Threads running on different CPU cores',
        explanation: 'Race conditions can occur even on a single-core CPU with time-slicing. The three requirements are: shared mutable state, concurrent access, and at least one write operation. No multiple cores needed.',
      },
      {
        type: 'short-answer',
        question: 'What is the region of code that accesses shared resources and must not be executed by more than one thread at a time?',
        answer: 'Critical section',
        explanation: 'A critical section is a code segment that accesses shared resources and must be executed atomically (by one thread at a time) to prevent race conditions. Locks, mutexes, and synchronized blocks are used to protect critical sections.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     5. MUTEX & LOCKS
     ────────────────────────────────────────────── */
  'mutex-and-locks': {
    steps: [
      {
        title: 'The Bathroom Door Lock',
        content:
          'A **mutex** (mutual exclusion) is like a bathroom door lock. Only one person can be inside at a time. When you enter, you lock the door. Others must wait. When you leave, you unlock it, and the next person can enter.\n\nIn threading terms: only one thread can hold the mutex at a time. Other threads that try to acquire it will **block** (wait) until it is released.',
        analogy:
          'Bathroom with a lock: enter (acquire lock), use the facilities (critical section), exit (release lock). Others wait in line. If you forget to unlock, everyone waits forever (deadlock!).',
        keyTakeaway:
          'A mutex ensures only one thread executes the critical section at a time. Others wait in line.',
      },
      {
        title: 'Fixing the Bank Balance Bug',
        content:
          'Remember the race condition from the previous lesson? Let us fix it with synchronization.',
        code: [
          {
            language: 'java',
            label: 'Java — synchronized keyword',
            code: `public class SafeBankAccount {
    private int balance = 1000;

    // synchronized = only ONE thread can execute this method at a time
    public synchronized void withdraw(int amount) {
        if (balance >= amount) {
            // Now this entire block is atomic — no thread can interrupt
            balance = balance - amount;
            System.out.println(Thread.currentThread().getName() +
                " withdrew " + amount + ". Balance: " + balance);
        } else {
            System.out.println(Thread.currentThread().getName() +
                " insufficient funds. Balance: " + balance);
        }
    }

    public synchronized int getBalance() {
        return balance;
    }

    public static void main(String[] args) throws InterruptedException {
        SafeBankAccount account = new SafeBankAccount();

        Thread t1 = new Thread(() -> account.withdraw(800), "Thread-A");
        Thread t2 = new Thread(() -> account.withdraw(800), "Thread-B");

        t1.start(); t2.start();
        t1.join(); t2.join();

        // Now GUARANTEED: one succeeds (balance=200), one fails
        System.out.println("Final balance: " + account.getBalance());
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — threading.Lock',
            code: `import threading

class SafeBankAccount:
    def __init__(self, balance):
        self.balance = balance
        self._lock = threading.Lock()  # create a mutex

    def withdraw(self, amount):
        with self._lock:  # acquire lock (blocks if held by another thread)
            # Critical section — only ONE thread at a time
            if self.balance >= amount:
                temp = self.balance
                temp -= amount
                self.balance = temp
                print(f"{threading.current_thread().name} withdrew {amount}. "
                      f"Balance: {self.balance}")
                return True
            else:
                print(f"{threading.current_thread().name} insufficient funds.")
                return False
            # Lock automatically released when exiting "with" block

account = SafeBankAccount(1000)

def many_withdrawals():
    for _ in range(100000):
        account.withdraw(0.01)

t1 = threading.Thread(target=many_withdrawals, name="T1")
t2 = threading.Thread(target=many_withdrawals, name="T2")
t1.start(); t2.start()
t1.join(); t2.join()
print(f"Final balance: {account.balance}")  # Correct!`,
          },
        ],
        keyTakeaway:
          'Use synchronized (Java) or Lock (Python) to protect critical sections. Only one thread enters at a time.',
      },
      {
        title: 'Types of Locks',
        content:
          'There are several types of locks for different situations:',
        table: {
          headers: ['Lock Type', 'Description', 'Use Case'],
          rows: [
            ['Mutex / Lock', 'One thread at a time', 'Default choice for critical sections'],
            ['ReentrantLock', 'Same thread can acquire multiple times', 'Recursive algorithms, nested calls'],
            ['ReadWriteLock', 'Multiple readers OR one writer', 'Read-heavy workloads (caches)'],
            ['SpinLock', 'Busy-wait instead of sleep', 'Very short critical sections'],
          ],
        },
        code: [
          {
            language: 'java',
            label: 'Java — ReentrantLock',
            code: `import java.util.concurrent.locks.ReentrantLock;

public class SafeCounter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();

    public void increment() {
        lock.lock();       // acquire the lock
        try {
            count++;       // critical section
        } finally {
            lock.unlock(); // ALWAYS release in finally!
        }
    }

    // ReentrantLock advantages over synchronized:
    // 1. tryLock() — non-blocking attempt
    // 2. tryLock(timeout) — wait with timeout
    // 3. lockInterruptibly() — can be interrupted while waiting
    // 4. Fairness option — new ReentrantLock(true) — longest-waiting goes first

    public boolean tryIncrement() {
        if (lock.tryLock()) {   // non-blocking — returns false if lock is held
            try {
                count++;
                return true;
            } finally {
                lock.unlock();
            }
        }
        return false;  // lock was not available
    }
}`,
          },
          {
            language: 'java',
            label: 'Java — ReadWriteLock',
            code: `import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.HashMap;
import java.util.Map;

public class ThreadSafeCache<K, V> {
    private final Map<K, V> cache = new HashMap<>();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

    // Multiple threads can read simultaneously
    public V get(K key) {
        rwLock.readLock().lock();   // shared lock — many readers allowed
        try {
            return cache.get(key);
        } finally {
            rwLock.readLock().unlock();
        }
    }

    // Only one thread can write (blocks all readers too)
    public void put(K key, V value) {
        rwLock.writeLock().lock();  // exclusive lock — one writer only
        try {
            cache.put(key, value);
        } finally {
            rwLock.writeLock().unlock();
        }
    }
}`,
          },
        ],
        keyTakeaway:
          'Choose the right lock: Mutex for general use, ReadWriteLock for read-heavy scenarios, ReentrantLock for flexibility.',
      },
      {
        title: 'Fixing the Counter with AtomicInteger',
        content:
          'For simple operations like increment, you can use **atomic classes** that use hardware-level atomic instructions (CAS — Compare And Swap) instead of locks. They are faster because no blocking occurs.',
        code: [
          {
            language: 'java',
            label: 'Java — AtomicInteger',
            code: `import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    // AtomicInteger uses hardware CAS — no locks needed!
    private final AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet();  // atomic: read + increment + write in one step
    }

    public void decrement() {
        count.decrementAndGet();
    }

    public int getCount() {
        return count.get();
    }

    public static void main(String[] args) throws InterruptedException {
        AtomicCounter counter = new AtomicCounter();

        Runnable task = () -> {
            for (int i = 0; i < 100_000; i++) {
                counter.increment();
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join(); t2.join();

        System.out.println("Count: " + counter.getCount());  // ALWAYS 200,000
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Lock-based Counter',
            code: `import threading

class AtomicCounter:
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            self._value += 1

    def decrement(self):
        with self._lock:
            self._value -= 1

    @property
    def value(self):
        with self._lock:
            return self._value

counter = AtomicCounter()

def count_up():
    for _ in range(100_000):
        counter.increment()

threads = [threading.Thread(target=count_up) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print(f"Count: {counter.value}")  # ALWAYS 500,000`,
          },
        ],
        keyTakeaway:
          'Atomic classes (AtomicInteger, AtomicLong) provide lock-free thread safety for simple operations.',
      },
      {
        title: 'Best Practices for Locks',
        content:
          'Follow these rules to avoid lock-related bugs:\n\n1. **Always release locks in finally blocks** — Exceptions must not prevent unlock.\n2. **Keep critical sections short** — Hold locks for the minimum time.\n3. **Avoid nested locks** — Acquiring multiple locks risks deadlock.\n4. **Use `with` statements (Python) or try-finally (Java)** — Never manually lock without guaranteed unlock.\n5. **Prefer higher-level constructs** — Use concurrent collections, atomic types, and thread pools before raw locks.',
        code: [
          {
            language: 'java',
            label: 'Java — Lock Best Practices',
            code: `// BAD: Lock not released on exception
lock.lock();
doRiskyOperation();  // if this throws, lock is NEVER released!
lock.unlock();       // unreachable if exception thrown

// GOOD: Always release in finally
lock.lock();
try {
    doRiskyOperation();
} finally {
    lock.unlock();  // ALWAYS runs, even if exception thrown
}

// BAD: Holding lock while doing I/O (slow)
lock.lock();
try {
    data = readFromDatabase();   // slow network I/O while holding lock!
    processData(data);
} finally { lock.unlock(); }

// GOOD: Minimize critical section
data = readFromDatabase();       // I/O outside the lock
lock.lock();
try {
    processData(data);           // only the shared-state modification is locked
} finally { lock.unlock(); }`,
          },
        ],
        keyTakeaway:
          'Always release locks in finally. Keep critical sections short. Prefer high-level concurrency tools.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to release a lock (causing deadlock)',
        explanation:
          'If a lock is acquired but never released (e.g., exception before unlock), all other threads waiting for it will block forever. Always use try-finally or with statements.',
      },
      {
        mistake: 'Using a different lock object for the same shared data',
        explanation:
          'If two methods protecting the same data use different lock objects, they provide no synchronization at all. Ensure the same lock protects the same data.',
      },
      {
        mistake: 'Over-synchronizing (locking everything)',
        explanation:
          'Making every method synchronized destroys parallelism. Only lock the minimum code that accesses shared mutable state.',
      },
      {
        mistake: 'Using synchronized on the wrong object in Java',
        explanation:
          'synchronized(this) locks the current instance. Two different instances have different locks. For class-level data, use synchronized(ClassName.class).',
      },
    ],
    practiceQuestions: [
      'Fix the race condition in a shared counter using locks.',
      'Implement a thread-safe stack (push, pop, peek) using ReentrantLock.',
      'When should you use ReadWriteLock instead of a regular Lock?',
      'What is the difference between synchronized and ReentrantLock in Java?',
      'Explain Compare-And-Swap (CAS) and when AtomicInteger is better than locks.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is the primary purpose of a mutex?',
        options: ['To speed up thread execution', 'To ensure only one thread accesses a critical section at a time', 'To create new threads efficiently', 'To communicate between processes'],
        answer: 'To ensure only one thread accesses a critical section at a time',
        explanation: 'A mutex (mutual exclusion) ensures that only one thread can enter a critical section at a time. Other threads that try to acquire the locked mutex will block until the owning thread releases it.',
      },
      {
        type: 'mcq',
        question: 'What advantage does ReentrantLock have over the synchronized keyword in Java?',
        options: ['It is faster', 'It supports tryLock with timeout and fairness policies', 'It does not require unlocking', 'It works across processes'],
        answer: 'It supports tryLock with timeout and fairness policies',
        explanation: 'ReentrantLock offers tryLock() (non-blocking attempt), tryLock(timeout) (timed attempt), fairness policy (FIFO ordering), and the ability to check lock status. synchronized is simpler but less flexible.',
      },
      {
        type: 'short-answer',
        question: 'What does "reentrant" mean in the context of locks?',
        answer: 'A thread that already holds the lock can acquire it again without deadlocking',
        explanation: 'A reentrant lock allows the same thread to acquire the lock multiple times (e.g., in recursive methods or nested synchronized blocks). An internal counter tracks how many times the lock has been acquired, and it is fully released only when the counter reaches zero.',
      },
      {
        type: 'mcq',
        question: 'When is a ReadWriteLock more efficient than a regular mutex?',
        options: ['When all operations are writes', 'When reads are far more frequent than writes', 'When there is only one thread', 'When the critical section is very short'],
        answer: 'When reads are far more frequent than writes',
        explanation: 'A ReadWriteLock allows multiple threads to read simultaneously (shared lock) while writes require exclusive access. This is ideal for read-heavy workloads like caches, where most operations are reads and writes are infrequent.',
      },
      {
        type: 'short-answer',
        question: 'What is Compare-And-Swap (CAS)?',
        answer: 'An atomic CPU instruction that updates a value only if it matches an expected value',
        explanation: 'CAS atomically checks if a variable equals an expected value and, if so, updates it to a new value. It is the foundation of lock-free algorithms and atomic classes like AtomicInteger. If the CAS fails (another thread changed the value), the operation retries.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     6. DEADLOCK
     ────────────────────────────────────────────── */
  'deadlock': {
    steps: [
      {
        title: 'The Narrow Hallway',
        content:
          'Imagine two people walking towards each other in a narrow hallway. Person A steps left; Person B also steps left. They are now blocking each other. Person A steps right; Person B steps right. Blocked again. Neither can move forward — they are in a **deadlock**.\n\nIn threading, a deadlock occurs when two or more threads are each waiting for the other to release a resource, and none of them ever will.',
        analogy:
          'Two people at a narrow doorway, each saying "after you." Neither goes through. In code: Thread A holds Lock 1 and waits for Lock 2. Thread B holds Lock 2 and waits for Lock 1. Neither can proceed.',
        keyTakeaway:
          'Deadlock: threads waiting for each other in a circular dependency, so none can proceed.',
      },
      {
        title: 'Deadlock in Code',
        content:
          'Here is the classic deadlock scenario: two threads acquire two locks in opposite order.',
        code: [
          {
            language: 'java',
            label: 'Java — Deadlock',
            code: `public class DeadlockDemo {
    private static final Object lockA = new Object();
    private static final Object lockB = new Object();

    public static void main(String[] args) {
        // Thread 1: acquire lockA, then try lockB
        Thread t1 = new Thread(() -> {
            synchronized (lockA) {
                System.out.println("T1: Holding lockA, waiting for lockB...");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lockB) {  // BLOCKED — T2 holds lockB!
                    System.out.println("T1: Holding both locks!");
                }
            }
        }, "Thread-1");

        // Thread 2: acquire lockB, then try lockA (OPPOSITE ORDER!)
        Thread t2 = new Thread(() -> {
            synchronized (lockB) {
                System.out.println("T2: Holding lockB, waiting for lockA...");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lockA) {  // BLOCKED — T1 holds lockA!
                    System.out.println("T2: Holding both locks!");
                }
            }
        }, "Thread-2");

        t1.start();
        t2.start();
        // Program hangs forever! Neither thread can proceed.
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Deadlock',
            code: `import threading
import time

lock_a = threading.Lock()
lock_b = threading.Lock()

def thread_1():
    with lock_a:
        print("T1: Holding lock_a, waiting for lock_b...")
        time.sleep(0.1)
        with lock_b:  # BLOCKED — T2 holds lock_b!
            print("T1: Holding both locks!")

def thread_2():
    with lock_b:
        print("T2: Holding lock_b, waiting for lock_a...")
        time.sleep(0.1)
        with lock_a:  # BLOCKED — T1 holds lock_a!
            print("T2: Holding both locks!")

t1 = threading.Thread(target=thread_1)
t2 = threading.Thread(target=thread_2)
t1.start()
t2.start()
# Hangs forever!`,
          },
        ],
        keyTakeaway:
          'Deadlock occurs when threads acquire locks in different orders, creating a circular wait.',
      },
      {
        title: 'Four Conditions for Deadlock',
        content:
          'A deadlock can only occur when ALL four of these conditions are true simultaneously (Coffman Conditions):\n\n1. **Mutual Exclusion** — At least one resource is held in non-shareable mode (only one thread can use it).\n2. **Hold and Wait** — A thread holding one resource is waiting to acquire another.\n3. **No Preemption** — Resources cannot be forcibly taken from a thread; it must release voluntarily.\n4. **Circular Wait** — Thread A waits for B, B waits for C, C waits for A (a cycle).\n\nBreak ANY ONE of these four conditions and deadlock becomes impossible.',
        cards: [
          { title: 'Mutual Exclusion', description: 'Resource held in non-shareable mode. Break: use shareable resources.', icon: '🔒', color: 'red' },
          { title: 'Hold and Wait', description: 'Thread holds one lock, waits for another. Break: acquire all locks at once.', icon: '✋', color: 'red' },
          { title: 'No Preemption', description: 'Cannot forcibly take resources. Break: allow timeout/preemption.', icon: '🚫', color: 'red' },
          { title: 'Circular Wait', description: 'A waits for B, B waits for A. Break: enforce lock ordering.', icon: '🔄', color: 'red' },
        ],
        keyTakeaway:
          'Deadlock requires four conditions. Break any one to prevent deadlock.',
      },
      {
        title: 'Prevention Strategy 1: Lock Ordering',
        content:
          'The simplest and most common prevention: always acquire locks in the **same global order**. If every thread acquires lockA before lockB, circular wait is impossible.',
        code: [
          {
            language: 'java',
            label: 'Java — Lock Ordering Fix',
            code: `public class DeadlockFixed {
    private static final Object lockA = new Object();
    private static final Object lockB = new Object();

    // BOTH threads now acquire locks in the SAME order: A then B
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            synchronized (lockA) {  // always A first
                System.out.println("T1: Holding lockA");
                synchronized (lockB) {  // then B
                    System.out.println("T1: Holding both locks!");
                }
            }
        });

        Thread t2 = new Thread(() -> {
            synchronized (lockA) {  // always A first (same order as T1!)
                System.out.println("T2: Holding lockA");
                synchronized (lockB) {  // then B
                    System.out.println("T2: Holding both locks!");
                }
            }
        });

        t1.start();
        t2.start();
        // No deadlock! One thread gets lockA first, the other waits.
    }
}`,
          },
        ],
        keyTakeaway:
          'Lock ordering: assign a global order to all locks and always acquire them in that order.',
      },
      {
        title: 'Prevention Strategy 2: Timeout',
        content:
          'Instead of blocking forever, use `tryLock()` with a timeout. If the lock is not available within the timeout, give up and retry later.',
        code: [
          {
            language: 'java',
            label: 'Java — tryLock with Timeout',
            code: `import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.TimeUnit;

public class TimeoutLocking {
    private static final ReentrantLock lockA = new ReentrantLock();
    private static final ReentrantLock lockB = new ReentrantLock();

    public static void transferMoney(ReentrantLock first, ReentrantLock second,
                                      String threadName) {
        while (true) {
            boolean gotFirst = false;
            boolean gotSecond = false;
            try {
                // Try to acquire first lock with timeout
                gotFirst = first.tryLock(1, TimeUnit.SECONDS);
                // Try to acquire second lock with timeout
                gotSecond = second.tryLock(1, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }

            if (gotFirst && gotSecond) {
                try {
                    System.out.println(threadName + ": Got both locks! Transferring...");
                    return;  // success!
                } finally {
                    first.unlock();
                    second.unlock();
                }
            }

            // Did not get both locks — release what we have and retry
            if (gotFirst) first.unlock();
            if (gotSecond) second.unlock();
            System.out.println(threadName + ": Could not get both locks, retrying...");
        }
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Timeout',
            code: `import threading
import time

lock_a = threading.Lock()
lock_b = threading.Lock()

def safe_transfer(name, first_lock, second_lock):
    while True:
        got_first = first_lock.acquire(timeout=1)  # try for 1 second
        if got_first:
            got_second = second_lock.acquire(timeout=1)
            if got_second:
                try:
                    print(f"{name}: Got both locks! Transferring...")
                    return  # success
                finally:
                    second_lock.release()
                    first_lock.release()
            else:
                first_lock.release()  # release and retry
                print(f"{name}: Retry...")
        time.sleep(0.01)  # brief pause before retry`,
          },
        ],
        keyTakeaway:
          'tryLock with timeout prevents indefinite blocking. If you cannot get all locks, release and retry.',
      },
      {
        title: 'Deadlock Detection',
        content:
          'Sometimes prevention is not possible, so you need detection:\n\n1. **Thread dump analysis** — In Java, `jstack` shows thread states. Look for threads in BLOCKED state waiting for each other.\n2. **Wait-for graph** — Build a directed graph of "who waits for whom." If there is a cycle, there is a deadlock.\n3. **JMX monitoring** — Java\'s `ThreadMXBean.findDeadlockedThreads()` detects deadlocks programmatically.\n4. **Timeouts** — If a thread does not progress within X seconds, assume deadlock.',
        code: [
          {
            language: 'java',
            label: 'Java — Deadlock Detection',
            code: `import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public class DeadlockDetector {
    public static void checkForDeadlocks() {
        ThreadMXBean tmx = ManagementFactory.getThreadMXBean();
        long[] deadlockedIds = tmx.findDeadlockedThreads();

        if (deadlockedIds != null) {
            ThreadInfo[] infos = tmx.getThreadInfo(deadlockedIds, true, true);
            System.err.println("=== DEADLOCK DETECTED ===");
            for (ThreadInfo info : infos) {
                System.err.println("Thread: " + info.getThreadName());
                System.err.println("  State: " + info.getThreadState());
                System.err.println("  Waiting for: " + info.getLockName());
                System.err.println("  Held by: " + info.getLockOwnerName());
            }
        } else {
            System.out.println("No deadlocks found.");
        }
    }
}`,
          },
        ],
        keyTakeaway:
          'Detect deadlocks via thread dumps, wait-for graphs, or JMX. Prevention is better than detection.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Acquiring locks in inconsistent order across the codebase',
        explanation:
          'If method A acquires lock1-then-lock2 and method B acquires lock2-then-lock1, deadlock is inevitable. Enforce a global lock ordering policy.',
      },
      {
        mistake: 'Holding a lock while doing I/O or expensive computation',
        explanation:
          'Long-held locks increase the window for deadlock and destroy performance. Release locks as soon as possible.',
      },
      {
        mistake: 'Not considering deadlock in lock-free designs',
        explanation:
          'Even without explicit locks, deadlock-like scenarios can occur with wait/notify, semaphores, or database row locks.',
      },
    ],
    practiceQuestions: [
      'Write code that creates a deadlock with two threads and two locks.',
      'Name the four Coffman conditions and explain how to break each one.',
      'Implement a deadlock-free money transfer between two accounts using lock ordering.',
      'How would you detect a deadlock in production?',
      'What is a livelock? How is it different from a deadlock?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which of the following is NOT one of the four Coffman conditions for deadlock?',
        options: ['Mutual exclusion', 'Hold and wait', 'Starvation', 'Circular wait'],
        answer: 'Starvation',
        explanation: 'The four Coffman conditions are: (1) Mutual Exclusion, (2) Hold and Wait, (3) No Preemption, (4) Circular Wait. All four must be present simultaneously for deadlock. Starvation is a separate problem where a thread never gets access to a resource.',
      },
      {
        type: 'mcq',
        question: 'How does lock ordering prevent deadlock?',
        options: ['It makes locks faster to acquire', 'It ensures all threads acquire locks in the same global order, preventing circular wait', 'It limits the number of locks a thread can hold', 'It allows the OS to preempt locks'],
        answer: 'It ensures all threads acquire locks in the same global order, preventing circular wait',
        explanation: 'If all threads always acquire locks in the same predetermined order (e.g., by lock ID), circular wait becomes impossible. Thread A locks 1 then 2, Thread B also locks 1 then 2 — no cycle can form.',
      },
      {
        type: 'short-answer',
        question: 'What is the difference between a deadlock and a livelock?',
        answer: 'In a deadlock threads are blocked forever; in a livelock threads are active but making no progress',
        explanation: 'Deadlocked threads are permanently blocked, waiting for each other. Livelocked threads keep retrying (e.g., releasing and re-acquiring locks) but never make progress because they keep interfering with each other. Adding random backoff can break livelocks.',
      },
      {
        type: 'mcq',
        question: 'Which strategy breaks the "Hold and Wait" condition?',
        options: ['Lock ordering', 'Requiring threads to acquire all needed locks at once before proceeding', 'Using tryLock with timeout', 'Using semaphores instead of mutexes'],
        answer: 'Requiring threads to acquire all needed locks at once before proceeding',
        explanation: 'If a thread must acquire all locks atomically (all-or-nothing), it never holds some locks while waiting for others. This breaks the Hold and Wait condition but can reduce concurrency.',
      },
      {
        type: 'short-answer',
        question: 'What Java tool can you use to detect deadlocks in a running application?',
        answer: 'jstack or ThreadMXBean',
        explanation: 'jstack prints thread dumps showing which threads are blocked and what locks they hold/wait for. Programmatically, ThreadMXBean.findDeadlockedThreads() detects cycles in lock dependencies at runtime.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     7. SEMAPHORES
     ────────────────────────────────────────────── */
  'semaphores': {
    steps: [
      {
        title: 'The Parking Lot Counter',
        content:
          'A **semaphore** is like a parking lot with a limited number of spots. A sign at the entrance shows "5 spots available." When a car enters, the count drops to 4. When another car leaves, it goes back to 5. When the count reaches 0, incoming cars must wait.\n\nA semaphore maintains a **counter** (permits). Threads `acquire()` a permit (decrement counter) before accessing the resource, and `release()` it (increment counter) when done.',
        analogy:
          'A parking lot with a counter sign: "Available: 3". Each car entering decrements the counter. Each car leaving increments it. When it reaches 0, the gate stays closed until someone leaves.',
        keyTakeaway:
          'A semaphore controls access to a resource by maintaining a count of available permits.',
      },
      {
        title: 'Binary vs Counting Semaphore',
        content:
          'There are two types:\n\n1. **Binary Semaphore** (permits = 1) — Behaves like a mutex. Only ONE thread at a time.\n2. **Counting Semaphore** (permits = N) — Up to N threads simultaneously.\n\nThe key difference from a mutex: a semaphore does NOT have ownership. Any thread can release it, not just the one that acquired it. This makes semaphores useful for signaling between threads.',
        comparison: {
          leftTitle: 'Binary Semaphore (1 permit)',
          rightTitle: 'Counting Semaphore (N permits)',
          items: [
            { left: 'Only 1 thread at a time', right: 'Up to N threads simultaneously' },
            { left: 'Similar to mutex', right: 'Controls access to a pool of resources' },
            { left: 'No ownership — any thread can release', right: 'Tracks available count' },
            { left: 'Used for signaling between threads', right: 'Used for connection pools, rate limiting' },
          ],
        },
        keyTakeaway:
          'Binary semaphore = 1 permit (like mutex). Counting semaphore = N permits (limited pool).',
      },
      {
        title: 'Semaphore in Action — Connection Pool',
        content:
          'Let us limit database connections to a maximum of 3 concurrent connections using a semaphore.',
        code: [
          {
            language: 'java',
            label: 'Java — Semaphore',
            code: `import java.util.concurrent.Semaphore;

public class ConnectionPool {
    // Allow at most 3 concurrent connections
    private final Semaphore semaphore = new Semaphore(3);

    public void useConnection(String threadName) {
        try {
            System.out.println(threadName + ": Waiting for connection...");
            semaphore.acquire();  // blocks if all 3 permits are taken

            // Critical section — using a connection
            System.out.println(threadName + ": Connected! (available: " +
                semaphore.availablePermits() + ")");
            Thread.sleep(2000);  // simulate database work

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            semaphore.release();  // return the permit
            System.out.println(threadName + ": Released connection.");
        }
    }

    public static void main(String[] args) {
        ConnectionPool pool = new ConnectionPool();

        // 10 threads compete for 3 connections
        for (int i = 1; i <= 10; i++) {
            final int id = i;
            new Thread(() -> pool.useConnection("Worker-" + id)).start();
        }
        // Only 3 workers run at a time; others wait their turn
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Semaphore',
            code: `import threading
import time

class ConnectionPool:
    def __init__(self, max_connections):
        self._semaphore = threading.Semaphore(max_connections)

    def use_connection(self, worker_name):
        print(f"{worker_name}: Waiting for connection...")
        with self._semaphore:  # acquire (blocks if none available)
            print(f"{worker_name}: Connected!")
            time.sleep(2)  # simulate database work
        print(f"{worker_name}: Released connection.")

pool = ConnectionPool(max_connections=3)

# 10 threads compete for 3 connections
threads = [
    threading.Thread(target=pool.use_connection, args=(f"Worker-{i}",))
    for i in range(1, 11)
]
for t in threads: t.start()
for t in threads: t.join()
print("All workers done!")`,
          },
        ],
        keyTakeaway:
          'Semaphores limit concurrent access to a pool of resources. acquire() to take a permit, release() to return it.',
      },
      {
        title: 'Producer-Consumer with Semaphore',
        content:
          'Semaphores are perfect for coordinating producers and consumers. Use two semaphores: one counting empty slots and one counting filled slots.',
        code: [
          {
            language: 'java',
            label: 'Java — Producer-Consumer with Semaphores',
            code: `import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.Semaphore;

public class BoundedBuffer<T> {
    private final Queue<T> buffer = new LinkedList<>();
    private final Semaphore empty;   // counts empty slots
    private final Semaphore full;    // counts filled slots
    private final Semaphore mutex = new Semaphore(1);  // protects buffer

    public BoundedBuffer(int capacity) {
        empty = new Semaphore(capacity);  // start with all slots empty
        full = new Semaphore(0);          // start with no items
    }

    public void produce(T item) throws InterruptedException {
        empty.acquire();   // wait for an empty slot (decrements empty count)
        mutex.acquire();   // exclusive access to buffer
        try {
            buffer.add(item);
            System.out.println("Produced: " + item + " (size: " + buffer.size() + ")");
        } finally {
            mutex.release();
        }
        full.release();    // signal that a new item is available
    }

    public T consume() throws InterruptedException {
        full.acquire();    // wait for an available item (decrements full count)
        mutex.acquire();   // exclusive access to buffer
        T item;
        try {
            item = buffer.poll();
            System.out.println("Consumed: " + item + " (size: " + buffer.size() + ")");
        } finally {
            mutex.release();
        }
        empty.release();   // signal that a slot is now empty
        return item;
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — Producer-Consumer with Semaphores',
            code: `import threading
import time
import random
from collections import deque

class BoundedBuffer:
    def __init__(self, capacity):
        self.buffer = deque()
        self.empty = threading.Semaphore(capacity)  # empty slots
        self.full = threading.Semaphore(0)           # filled slots
        self.mutex = threading.Lock()                # buffer access

    def produce(self, item):
        self.empty.acquire()    # wait for empty slot
        with self.mutex:
            self.buffer.append(item)
            print(f"Produced: {item} (size: {len(self.buffer)})")
        self.full.release()     # signal item available

    def consume(self):
        self.full.acquire()     # wait for item
        with self.mutex:
            item = self.buffer.popleft()
            print(f"Consumed: {item} (size: {len(self.buffer)})")
        self.empty.release()    # signal slot freed
        return item

buffer = BoundedBuffer(capacity=5)

def producer():
    for i in range(10):
        buffer.produce(f"item-{i}")
        time.sleep(random.uniform(0.1, 0.5))

def consumer():
    for _ in range(10):
        buffer.consume()
        time.sleep(random.uniform(0.2, 0.6))

t1 = threading.Thread(target=producer, name="Producer")
t2 = threading.Thread(target=consumer, name="Consumer")
t1.start(); t2.start()
t1.join(); t2.join()`,
          },
        ],
        keyTakeaway:
          'Use two semaphores (empty + full) for producer-consumer. They naturally handle blocking when buffer is full or empty.',
      },
      {
        title: 'Semaphore vs Mutex — Key Differences',
        content:
          'People often confuse semaphores and mutexes. Here are the key differences:',
        table: {
          headers: ['Feature', 'Mutex', 'Semaphore'],
          rows: [
            ['Purpose', 'Mutual exclusion', 'Resource counting / signaling'],
            ['Permits', '1 (binary)', 'Any positive integer'],
            ['Ownership', 'Yes — only owner can release', 'No — any thread can release'],
            ['Use case', 'Protect critical sections', 'Limit concurrent access / signal'],
            ['Analogy', 'Bathroom door lock', 'Parking lot counter'],
          ],
        },
        keyTakeaway:
          'Mutex = ownership-based, binary. Semaphore = counter-based, no ownership, flexible.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Releasing a semaphore more times than acquiring it',
        explanation:
          'This increases the permit count beyond the original limit, allowing more threads than intended. Always pair acquire() with release().',
      },
      {
        mistake: 'Using a semaphore when a mutex suffices',
        explanation:
          'For simple mutual exclusion, a mutex/lock is clearer and has ownership semantics. Use semaphores when you need to control a pool of N resources.',
      },
      {
        mistake: 'Not handling InterruptedException in acquire()',
        explanation:
          'A thread waiting on semaphore.acquire() can be interrupted. Always handle the exception properly.',
      },
    ],
    practiceQuestions: [
      'Implement a rate limiter that allows at most 5 requests per second using a semaphore.',
      'What is the difference between a binary semaphore and a mutex?',
      'Build a print queue that allows 2 printers to process jobs concurrently.',
      'Explain why a semaphore has no ownership while a mutex does.',
      'Can you implement a mutex using a semaphore? Can you implement a semaphore using a mutex?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is the key difference between a semaphore and a mutex?',
        options: ['A semaphore is faster', 'A semaphore can allow multiple threads to access a resource simultaneously', 'A mutex works across processes', 'A semaphore can only be used in Java'],
        answer: 'A semaphore can allow multiple threads to access a resource simultaneously',
        explanation: 'A mutex allows exactly one thread at a time (binary). A counting semaphore maintains a permit count and allows up to N threads to access a resource concurrently. For example, a semaphore with 3 permits allows 3 simultaneous database connections.',
      },
      {
        type: 'mcq',
        question: 'What happens when a thread calls acquire() on a semaphore with 0 available permits?',
        options: ['It throws an exception', 'It returns false immediately', 'It blocks until a permit becomes available', 'It creates a new permit'],
        answer: 'It blocks until a permit becomes available',
        explanation: 'acquire() is a blocking call. If no permits are available, the thread will wait until another thread calls release() to return a permit. Use tryAcquire() for a non-blocking attempt.',
      },
      {
        type: 'short-answer',
        question: 'What is a binary semaphore?',
        answer: 'A semaphore with a maximum count of 1',
        explanation: 'A binary semaphore has only two states: available (1) or unavailable (0). It behaves similarly to a mutex but with a key difference: any thread can release a binary semaphore, while a mutex can only be released by the thread that acquired it (ownership).',
      },
      {
        type: 'mcq',
        question: 'In a connection pool of size 5, what initial permit count should the semaphore have?',
        options: ['0', '1', '5', '10'],
        answer: '5',
        explanation: 'The semaphore permit count should match the number of available resources. With 5 connections in the pool, initialize with 5 permits. Each thread acquires a permit before taking a connection and releases it when returning the connection.',
      },
      {
        type: 'short-answer',
        question: 'Why does a semaphore have no concept of ownership unlike a mutex?',
        answer: 'Any thread can call release(), not just the thread that called acquire()',
        explanation: 'A mutex has ownership: only the locking thread can unlock it. A semaphore has no ownership: any thread can release a permit. This makes semaphores suitable for signaling between threads (one thread signals another by releasing a permit).',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     8. PRODUCER-CONSUMER PATTERN
     ────────────────────────────────────────────── */
  'producer-consumer-pattern': {
    steps: [
      {
        title: 'The Assembly Line',
        content:
          'Picture a factory assembly line. Workers at the start (producers) place items on a conveyor belt. Workers at the end (consumers) pick items off and process them. The conveyor belt is a **bounded buffer** — it can only hold a limited number of items.\n\nIf the belt is full, producers must wait. If the belt is empty, consumers must wait. This natural flow control is the essence of the Producer-Consumer pattern.',
        analogy:
          'A sushi restaurant conveyor belt: the chef (producer) places sushi on the belt. Customers (consumers) pick plates off. If the belt is full, the chef waits. If the belt is empty, customers wait.',
        keyTakeaway:
          'Producer-Consumer: producers add to a shared buffer, consumers remove from it, with coordination on full/empty states.',
      },
      {
        title: 'Why This Pattern Matters',
        content:
          'The Producer-Consumer pattern is everywhere:\n\n- **Message queues** (Kafka, RabbitMQ) — producers publish messages, consumers process them\n- **Thread pools** — tasks are produced and worker threads consume them\n- **I/O pipelines** — reader produces data, writer consumes it\n- **Logging** — application produces log entries, background thread writes them to disk\n- **Web servers** — network layer produces requests, worker threads consume them\n\nIt **decouples** production from consumption, allowing each to run at its own pace.',
        keyTakeaway:
          'Producer-Consumer decouples production from consumption, enabling independent pacing and clean architecture.',
      },
      {
        title: 'Implementation with BlockingQueue (Java)',
        content:
          'Java provides `BlockingQueue` — a thread-safe queue that handles all the synchronization for you. It is the go-to solution for Producer-Consumer in Java.',
        code: [
          {
            language: 'java',
            label: 'Java — BlockingQueue',
            code: `import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class ProducerConsumer {
    // Bounded buffer — max 5 items
    private static final BlockingQueue<String> queue = new LinkedBlockingQueue<>(5);

    // Producer — generates items
    static class Producer implements Runnable {
        @Override
        public void run() {
            try {
                for (int i = 1; i <= 10; i++) {
                    String item = "Item-" + i;
                    queue.put(item);  // blocks if queue is FULL
                    System.out.println("[Producer] Added: " + item +
                        " (queue size: " + queue.size() + ")");
                    Thread.sleep(200);  // simulate production time
                }
                queue.put("DONE");  // poison pill to signal completion
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    // Consumer — processes items
    static class Consumer implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    String item = queue.take();  // blocks if queue is EMPTY
                    if ("DONE".equals(item)) break;  // poison pill received
                    System.out.println("[Consumer] Processed: " + item);
                    Thread.sleep(500);  // simulate processing time (slower)
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public static void main(String[] args) {
        new Thread(new Producer(), "Producer").start();
        new Thread(new Consumer(), "Consumer").start();
    }
}`,
          },
        ],
        keyTakeaway:
          'BlockingQueue handles all synchronization. put() blocks when full, take() blocks when empty.',
      },
      {
        title: 'Implementation with Condition Variables (Python)',
        content:
          'Python\'s `queue.Queue` is thread-safe and handles blocking automatically. But let us also build it from scratch using `Condition` variables to understand the mechanics.',
        code: [
          {
            language: 'python',
            label: 'Python — queue.Queue (easy)',
            code: `import queue
import threading
import time

# Python's Queue is already thread-safe with blocking
buffer = queue.Queue(maxsize=5)  # bounded buffer

def producer():
    for i in range(10):
        item = f"item-{i}"
        buffer.put(item)  # blocks if full
        print(f"[Producer] Added: {item} (size: ~{buffer.qsize()})")
        time.sleep(0.2)
    buffer.put(None)  # poison pill

def consumer():
    while True:
        item = buffer.get()  # blocks if empty
        if item is None:
            break
        print(f"[Consumer] Processed: {item}")
        time.sleep(0.5)  # slower consumer
        buffer.task_done()

t1 = threading.Thread(target=producer)
t2 = threading.Thread(target=consumer)
t1.start(); t2.start()
t1.join(); t2.join()`,
          },
          {
            language: 'python',
            label: 'Python — From Scratch with Condition',
            code: `import threading
from collections import deque

class BoundedBuffer:
    def __init__(self, capacity):
        self.buffer = deque()
        self.capacity = capacity
        self.lock = threading.Lock()
        self.not_full = threading.Condition(self.lock)   # signal: space available
        self.not_empty = threading.Condition(self.lock)  # signal: item available

    def put(self, item):
        with self.not_full:
            while len(self.buffer) >= self.capacity:
                self.not_full.wait()  # wait until space is available
            self.buffer.append(item)
            self.not_empty.notify()   # wake up a waiting consumer

    def get(self):
        with self.not_empty:
            while len(self.buffer) == 0:
                self.not_empty.wait()  # wait until an item is available
            item = self.buffer.popleft()
            self.not_full.notify()    # wake up a waiting producer
            return item

# Usage
buf = BoundedBuffer(capacity=3)

def producer():
    for i in range(8):
        buf.put(f"item-{i}")
        print(f"Produced item-{i}")

def consumer():
    for _ in range(8):
        item = buf.get()
        print(f"Consumed {item}")

threading.Thread(target=producer).start()
threading.Thread(target=consumer).start()`,
          },
        ],
        keyTakeaway:
          'Condition variables signal between threads: not_full wakes producers, not_empty wakes consumers.',
      },
      {
        title: 'Multiple Producers and Consumers',
        content:
          'In real systems, you often have multiple producers and multiple consumers. The bounded buffer handles this naturally — the synchronization ensures thread safety regardless of how many threads participate.',
        code: [
          {
            language: 'java',
            label: 'Java — Multiple Producers & Consumers',
            code: `import java.util.concurrent.*;

public class MultiProducerConsumer {
    private static final BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(10);
    private static volatile boolean running = true;

    public static void main(String[] args) throws InterruptedException {
        // 3 producers, 2 consumers
        ExecutorService producers = Executors.newFixedThreadPool(3);
        ExecutorService consumers = Executors.newFixedThreadPool(2);

        // Start 3 producers
        for (int p = 1; p <= 3; p++) {
            final int producerId = p;
            producers.submit(() -> {
                try {
                    for (int i = 0; i < 5; i++) {
                        int item = producerId * 100 + i;
                        queue.put(item);
                        System.out.println("[P" + producerId + "] Produced: " + item);
                        Thread.sleep(100);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }

        // Start 2 consumers
        for (int c = 1; c <= 2; c++) {
            final int consumerId = c;
            consumers.submit(() -> {
                try {
                    while (running || !queue.isEmpty()) {
                        Integer item = queue.poll(1, TimeUnit.SECONDS);
                        if (item != null) {
                            System.out.println("[C" + consumerId + "] Consumed: " + item);
                            Thread.sleep(200);
                        }
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }

        producers.shutdown();
        producers.awaitTermination(10, TimeUnit.SECONDS);
        running = false;
        consumers.shutdown();
        consumers.awaitTermination(10, TimeUnit.SECONDS);
    }
}`,
          },
        ],
        keyTakeaway:
          'Multiple producers and consumers work naturally with a shared blocking queue. No additional synchronization needed.',
      },
      {
        title: 'The Poison Pill Pattern',
        content:
          'How do consumers know when producers are done? The **poison pill** pattern: producers send a special sentinel value (null, "DONE", -1) that tells consumers to stop.\n\nFor multiple consumers, send one poison pill per consumer:',
        code: [
          {
            language: 'python',
            label: 'Python — Poison Pill',
            code: `import queue
import threading

POISON_PILL = None  # sentinel value
NUM_CONSUMERS = 3

q = queue.Queue(maxsize=10)

def producer():
    for i in range(20):
        q.put(f"task-{i}")
    # Send one poison pill per consumer
    for _ in range(NUM_CONSUMERS):
        q.put(POISON_PILL)
    print("[Producer] All items produced. Poison pills sent.")

def consumer(consumer_id):
    while True:
        item = q.get()
        if item is POISON_PILL:
            print(f"[Consumer-{consumer_id}] Received poison pill. Exiting.")
            break
        print(f"[Consumer-{consumer_id}] Processing: {item}")

# Start 1 producer and 3 consumers
threading.Thread(target=producer).start()
for i in range(NUM_CONSUMERS):
    threading.Thread(target=consumer, args=(i,)).start()`,
          },
        ],
        keyTakeaway:
          'Use poison pills (sentinel values) to signal consumers to shut down gracefully.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using notify() instead of notifyAll() with multiple consumers',
        explanation:
          'notify() wakes only one waiting thread. If it wakes a consumer that cannot proceed, all consumers block. Use notifyAll() to wake all waiters.',
      },
      {
        mistake: 'Using if instead of while for condition checks',
        explanation:
          'Spurious wakeups can occur. Always use while(condition) instead of if(condition) before wait() calls.',
      },
      {
        mistake: 'Forgetting the poison pill for multiple consumers',
        explanation:
          'If you have 3 consumers but send only 1 poison pill, 2 consumers will block forever waiting for more items.',
      },
      {
        mistake: 'Not bounding the buffer',
        explanation:
          'An unbounded buffer can cause OutOfMemoryError if the producer is faster than the consumer. Always set a maximum capacity.',
      },
    ],
    practiceQuestions: [
      'Implement a producer-consumer system with 3 producers and 2 consumers using BlockingQueue.',
      'Why must you use while() instead of if() before wait()?',
      'How does the poison pill pattern work with multiple consumers?',
      'Design a logging system where the application produces log entries and a background thread writes them.',
      'What happens if the producer is much faster than the consumer? How does a bounded buffer help?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Why must you use while() instead of if() when checking a condition before wait()?',
        options: ['while() is faster than if()', 'Spurious wakeups can occur, so the condition must be re-checked after waking', 'if() does not work with monitors', 'while() prevents deadlocks'],
        answer: 'Spurious wakeups can occur, so the condition must be re-checked after waking',
        explanation: 'Threads can wake up without being notified (spurious wakeups), or another thread may have consumed the item between notify() and the waiting thread re-acquiring the lock. Using while() ensures the condition is re-verified after every wakeup.',
      },
      {
        type: 'mcq',
        question: 'What is the purpose of a bounded buffer in the producer-consumer pattern?',
        options: ['To make producers faster', 'To limit memory usage and apply backpressure when the buffer is full', 'To ensure LIFO ordering', 'To prevent deadlocks'],
        answer: 'To limit memory usage and apply backpressure when the buffer is full',
        explanation: 'A bounded buffer has a fixed capacity. When full, producers block until consumers free space. This prevents unbounded memory growth when producers are faster than consumers and creates natural flow control (backpressure).',
      },
      {
        type: 'short-answer',
        question: 'What is the "poison pill" pattern in producer-consumer?',
        answer: 'A special sentinel value placed in the queue to signal consumers to shut down',
        explanation: 'The producer sends a special value (poison pill) into the queue. When a consumer receives it, it knows there is no more work and terminates gracefully. For multiple consumers, send one poison pill per consumer.',
      },
      {
        type: 'mcq',
        question: 'Which Java class provides a thread-safe bounded queue for producer-consumer?',
        options: ['ArrayList', 'LinkedList', 'ArrayBlockingQueue', 'PriorityQueue'],
        answer: 'ArrayBlockingQueue',
        explanation: 'ArrayBlockingQueue is a bounded, thread-safe queue that blocks producers when full and consumers when empty. It handles all synchronization internally, making producer-consumer implementation straightforward.',
      },
      {
        type: 'short-answer',
        question: 'What two operations do wait() and notify() coordinate in the producer-consumer pattern?',
        answer: 'Producers wait when the buffer is full; consumers wait when the buffer is empty',
        explanation: 'Producers call wait() when the buffer is full (no space to add items) and consumers call wait() when the buffer is empty (nothing to consume). notify() or notifyAll() wakes up waiting threads when the state changes.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     9. THREAD POOLS
     ────────────────────────────────────────────── */
  'thread-pools': {
    steps: [
      {
        title: 'The Taxi Company',
        content:
          'Imagine a taxi company with a fleet of 10 taxis. When a customer calls, an available taxi is dispatched. When the ride is done, the taxi returns to the pool and is available for the next customer. The company does NOT buy a new taxi for every customer — that would be insanely expensive.\n\nA **thread pool** works the same way: a fixed set of worker threads are created once and reused for many tasks.',
        analogy:
          'Taxi fleet: a fixed number of taxis (threads) serve an endless stream of customers (tasks). New taxi for every ride = creating new thread for every task. Pool = reuse existing fleet.',
        keyTakeaway:
          'Thread pools maintain a fixed set of reusable threads, avoiding the overhead of creating new threads for each task.',
      },
      {
        title: 'Why Not Create Unlimited Threads?',
        content:
          'Creating a thread for every task seems simple, but it has severe problems:\n\n1. **Memory cost** — Each thread uses ~512KB-1MB of stack space. 10,000 threads = 10GB of memory just for stacks.\n2. **CPU overhead** — The OS scheduler must manage all threads. More threads = more context switching.\n3. **Thread creation cost** — Creating/destroying threads takes time (~0.1-1ms each).\n4. **Resource exhaustion** — The OS has a limit on threads per process (typically a few thousand).\n\nThread pools solve all of these: create N threads once, reuse them for thousands of tasks.',
        comparison: {
          leftTitle: 'Thread-per-Task (Bad)',
          rightTitle: 'Thread Pool (Good)',
          items: [
            { left: 'New thread for every task', right: 'Fixed number of reusable threads' },
            { left: 'Thousands of threads alive', right: '4-16 threads for most servers' },
            { left: 'Massive memory usage', right: 'Bounded memory usage' },
            { left: 'CPU thrashes on context switching', right: 'Efficient CPU utilization' },
            { left: 'OutOfMemoryError under load', right: 'Tasks queued when all threads busy' },
          ],
        },
        keyTakeaway:
          'Thread pools prevent resource exhaustion by reusing a fixed number of threads for many tasks.',
      },
      {
        title: 'ExecutorService in Java',
        content:
          'Java\'s `ExecutorService` is the standard thread pool API. It abstracts thread management completely.',
        code: [
          {
            language: 'java',
            label: 'Java — Thread Pool Types',
            code: `import java.util.concurrent.*;

public class ThreadPoolDemo {
    public static void main(String[] args) throws Exception {
        // 1. Fixed Thread Pool — exactly N threads
        ExecutorService fixedPool = Executors.newFixedThreadPool(4);

        // 2. Cached Thread Pool — grows/shrinks as needed
        ExecutorService cachedPool = Executors.newCachedThreadPool();

        // 3. Single Thread Executor — exactly 1 thread (sequential)
        ExecutorService singlePool = Executors.newSingleThreadExecutor();

        // 4. Scheduled Thread Pool — delayed/periodic tasks
        ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(2);

        // Submit tasks to the fixed pool
        for (int i = 1; i <= 10; i++) {
            final int taskId = i;
            fixedPool.submit(() -> {
                String thread = Thread.currentThread().getName();
                System.out.println("[" + thread + "] Processing task " + taskId);
                try { Thread.sleep(1000); } catch (InterruptedException e) {}
            });
        }
        // 10 tasks run on 4 threads — at most 4 run concurrently

        // Submit a task that returns a result (Callable)
        Future<Integer> future = fixedPool.submit(() -> {
            Thread.sleep(500);
            return 42;  // return a value
        });
        int result = future.get();  // blocks until result is ready
        System.out.println("Result: " + result);  // 42

        // Shutdown the pool
        fixedPool.shutdown();  // no new tasks accepted; finish existing
        fixedPool.awaitTermination(30, TimeUnit.SECONDS);
    }
}`,
          },
          {
            language: 'python',
            label: 'Python — ThreadPoolExecutor',
            code: `from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def process_task(task_id):
    """Simulate a task that takes 1 second."""
    thread_name = __import__('threading').current_thread().name
    print(f"[{thread_name}] Processing task {task_id}")
    time.sleep(1)
    return f"Result of task {task_id}"

# Create a pool with 4 worker threads
with ThreadPoolExecutor(max_workers=4, thread_name_prefix="Worker") as pool:
    # Submit 10 tasks — at most 4 run concurrently
    futures = [pool.submit(process_task, i) for i in range(1, 11)]

    # Get results as they complete
    for future in as_completed(futures):
        print(f"  Completed: {future.result()}")

# Pool is automatically shut down when exiting "with" block
print("All tasks complete!")`,
          },
        ],
        keyTakeaway:
          'ExecutorService (Java) and ThreadPoolExecutor (Python) manage thread pools. Submit tasks, get results via Future.',
      },
      {
        title: 'Choosing the Right Pool Size',
        content:
          'The optimal pool size depends on the type of work:\n\n**CPU-bound tasks** (number crunching, compression):\n- Pool size = number of CPU cores\n- More threads just cause context switching overhead\n\n**I/O-bound tasks** (HTTP calls, file reads, database queries):\n- Pool size = cores * 2 (or higher)\n- Threads spend most time waiting, so more threads keep CPU busy\n\n**Formula**: `pool_size = cores * target_utilization * (1 + wait_time / compute_time)`\n\nExample: 8 cores, 80% utilization, tasks wait 90% of the time:\n`8 * 0.8 * (1 + 9) = 64 threads`',
        code: [
          {
            language: 'java',
            label: 'Java — Optimal Pool Size',
            code: `int cores = Runtime.getRuntime().availableProcessors();
System.out.println("CPU cores: " + cores);

// CPU-bound pool
ExecutorService cpuPool = Executors.newFixedThreadPool(cores);

// I/O-bound pool
ExecutorService ioPool = Executors.newFixedThreadPool(cores * 2);

// Custom pool with queue and rejection policy
ThreadPoolExecutor customPool = new ThreadPoolExecutor(
    4,                              // core pool size (minimum threads)
    16,                             // maximum pool size
    60, TimeUnit.SECONDS,           // idle thread timeout
    new ArrayBlockingQueue<>(100),  // task queue (bounded)
    new ThreadPoolExecutor.CallerRunsPolicy()  // rejection: caller runs task
);`,
          },
        ],
        keyTakeaway:
          'CPU-bound: pool size = cores. I/O-bound: pool size = cores * 2 or higher.',
      },
      {
        title: 'Real-World Example: Parallel Web Scraper',
        content:
          'Let us build a practical example: scraping multiple web pages in parallel using a thread pool.',
        code: [
          {
            language: 'python',
            label: 'Python — Parallel Web Scraper',
            code: `from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import random

def fetch_page(url):
    """Simulate fetching a web page."""
    delay = random.uniform(0.5, 2.0)  # simulate network latency
    time.sleep(delay)
    return {
        "url": url,
        "status": 200,
        "size": random.randint(1000, 50000),
        "time": f"{delay}s"
    }

urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3",
    "https://example.com/page4",
    "https://example.com/page5",
    "https://example.com/page6",
    "https://example.com/page7",
    "https://example.com/page8",
]

# Sequential: ~8-16 seconds
start = time.time()
results_seq = [fetch_page(url) for url in urls]
print(f"Sequential: {time.time() - start:.1f}s")

# Parallel with thread pool: ~2 seconds (limited by slowest)
start = time.time()
with ThreadPoolExecutor(max_workers=4) as pool:
    future_to_url = {pool.submit(fetch_page, url): url for url in urls}
    for future in as_completed(future_to_url):
        result = future.result()
        print(f"  Fetched {result['url']} ({result['size']} bytes in {result['time']})")
print(f"Parallel: {time.time() - start:.1f}s")`,
          },
        ],
        keyTakeaway:
          'Thread pools turn sequential I/O into parallel I/O, dramatically reducing total time.',
      },
      {
        title: 'Shutdown and Error Handling',
        content:
          'Always shut down thread pools properly. Unshut pools keep daemon threads alive and can cause resource leaks.',
        code: [
          {
            language: 'java',
            label: 'Java — Proper Shutdown',
            code: `ExecutorService pool = Executors.newFixedThreadPool(4);

try {
    // Submit tasks...
    for (int i = 0; i < 20; i++) {
        pool.submit(() -> {
            // task code
        });
    }
} finally {
    pool.shutdown();  // stop accepting new tasks

    try {
        // Wait for existing tasks to finish
        if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
            pool.shutdownNow();  // force kill remaining tasks
            if (!pool.awaitTermination(10, TimeUnit.SECONDS)) {
                System.err.println("Pool did not terminate!");
            }
        }
    } catch (InterruptedException e) {
        pool.shutdownNow();  // force kill on interrupt
        Thread.currentThread().interrupt();
    }
}`,
          },
        ],
        keyTakeaway:
          'Always shutdown() thread pools. Use awaitTermination for graceful shutdown, shutdownNow() for forced shutdown.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Creating a new thread pool for every request',
        explanation:
          'Thread pools should be created once and reused. Creating a pool per request is just as wasteful as creating threads per request.',
      },
      {
        mistake: 'Using an unbounded thread pool (CachedThreadPool) for unknown workloads',
        explanation:
          'CachedThreadPool creates unlimited threads. Under spike load, this can exhaust memory. Use FixedThreadPool with a bounded queue.',
      },
      {
        mistake: 'Not shutting down the pool',
        explanation:
          'Thread pool threads are non-daemon by default. If you do not call shutdown(), the JVM will not exit.',
      },
      {
        mistake: 'Blocking the pool with long-running tasks',
        explanation:
          'If all pool threads are blocked on a single long task, no other tasks can run. Use separate pools for different task types.',
      },
    ],
    practiceQuestions: [
      'Create a thread pool that downloads 20 files concurrently with max 5 threads.',
      'What is the ideal pool size for CPU-bound tasks? For I/O-bound tasks?',
      'Explain the difference between shutdown() and shutdownNow().',
      'Implement a custom thread pool with a bounded task queue and rejection policy.',
      'When should you use CachedThreadPool vs FixedThreadPool?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is the recommended thread pool size for CPU-bound tasks?',
        options: ['1 thread', 'Number of CPU cores', 'Number of CPU cores * 10', 'As many as possible'],
        answer: 'Number of CPU cores',
        explanation: 'For CPU-bound tasks, the optimal pool size is the number of CPU cores (or cores + 1). More threads would cause excessive context switching without benefit since every core is already busy computing.',
      },
      {
        type: 'mcq',
        question: 'What is the difference between shutdown() and shutdownNow() in Java ExecutorService?',
        options: ['shutdown() is faster', 'shutdown() completes pending tasks then stops; shutdownNow() attempts to cancel running tasks immediately', 'shutdownNow() waits for tasks; shutdown() does not', 'There is no difference'],
        answer: 'shutdown() completes pending tasks then stops; shutdownNow() attempts to cancel running tasks immediately',
        explanation: 'shutdown() stops accepting new tasks but lets queued and running tasks complete. shutdownNow() attempts to interrupt running tasks and returns the list of queued tasks that were never started.',
      },
      {
        type: 'short-answer',
        question: 'Why is creating a new thread for every task inefficient?',
        answer: 'Thread creation has overhead (memory allocation, OS calls), and too many threads cause excessive context switching',
        explanation: 'Each thread consumes ~1MB of stack memory and requires OS-level allocation. Creating and destroying threads frequently wastes resources. Thread pools reuse a fixed set of threads, amortizing the creation cost across many tasks.',
      },
      {
        type: 'mcq',
        question: 'Which thread pool type creates new threads as needed and reuses idle ones?',
        options: ['FixedThreadPool', 'SingleThreadExecutor', 'CachedThreadPool', 'ScheduledThreadPool'],
        answer: 'CachedThreadPool',
        explanation: 'CachedThreadPool creates new threads on demand and reuses threads that have been idle for 60 seconds. It is good for many short-lived tasks but dangerous for long-running tasks since it can create unbounded threads.',
      },
      {
        type: 'short-answer',
        question: 'What interface does a thread pool task implement when it needs to return a result?',
        answer: 'Callable',
        explanation: 'Callable<V> is like Runnable but its call() method returns a value of type V and can throw checked exceptions. Submit a Callable to an ExecutorService and get a Future<V> to retrieve the result later.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     10. CONCURRENT DATA STRUCTURES
     ────────────────────────────────────────────── */
  'concurrent-data-structures': {
    steps: [
      {
        title: 'Thread-Safe Kitchen',
        content:
          'In a shared kitchen, you need labeled, organized containers so multiple chefs do not accidentally mix ingredients. A regular `HashMap` is like an unlabeled pot — two chefs might add different ingredients at the same time, creating chaos. **Concurrent data structures** are the labeled, thread-safe containers.',
        analogy:
          'Labeled containers in a shared kitchen: each container has a lock mechanism. When one chef is adding spice to the "Pasta Sauce" container, another chef cannot simultaneously add to the same container. But they CAN access the "Salad Dressing" container at the same time.',
        keyTakeaway:
          'Concurrent data structures provide thread-safe operations without requiring external synchronization.',
      },
      {
        title: 'Why Not Just Wrap Everything with synchronized?',
        content:
          'You could wrap a regular HashMap with synchronized:\n\n```java\nMap<K,V> syncMap = Collections.synchronizedMap(new HashMap<>());\n```\n\nBut this locks the **entire map** for every operation — even reads block other reads. `ConcurrentHashMap` is smarter: it uses **fine-grained locking** (lock segments, not the whole map), so multiple threads can read and write different keys simultaneously.',
        comparison: {
          leftTitle: 'synchronizedMap',
          rightTitle: 'ConcurrentHashMap',
          items: [
            { left: 'One giant lock for the whole map', right: 'Fine-grained locks (per segment/bucket)' },
            { left: 'Reads block other reads', right: 'Reads never block' },
            { left: 'Very poor concurrency', right: 'Multiple writers on different keys' },
            { left: 'Simple but slow', right: 'Highly concurrent and fast' },
          ],
        },
        keyTakeaway:
          'ConcurrentHashMap uses fine-grained locking for much better performance than synchronizedMap.',
      },
      {
        title: 'ConcurrentHashMap',
        content:
          'The most commonly used concurrent data structure. It allows fully concurrent reads and high-concurrency writes.',
        code: [
          {
            language: 'java',
            label: 'Java — ConcurrentHashMap',
            code: `import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class WordCounter {
    // Thread-safe map — no external locking needed
    private final ConcurrentHashMap<String, AtomicInteger> wordCounts =
        new ConcurrentHashMap<>();

    public void addWord(String word) {
        // computeIfAbsent is atomic — thread-safe key creation
        wordCounts.computeIfAbsent(word, k -> new AtomicInteger(0))
                  .incrementAndGet();  // atomic increment
    }

    public int getCount(String word) {
        AtomicInteger count = wordCounts.get(word);
        return count != null ? count.get() : 0;
    }

    // All these operations are atomic on ConcurrentHashMap:
    // putIfAbsent(key, value)    — add only if key missing
    // computeIfAbsent(key, fn)  — compute value only if key missing
    // computeIfPresent(key, fn) — update only if key exists
    // merge(key, value, fn)     — combine old and new values

    public static void main(String[] args) throws InterruptedException {
        WordCounter counter = new WordCounter();
        String[] words = {"hello", "world", "hello", "java", "hello", "world"};

        // Multiple threads adding words concurrently
        Thread[] threads = new Thread[10];
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (String w : words) counter.addWord(w);
            });
            threads[i].start();
        }
        for (Thread t : threads) t.join();

        System.out.println("hello: " + counter.getCount("hello"));  // 30
        System.out.println("world: " + counter.getCount("world"));  // 20
    }
}`,
          },
        ],
        keyTakeaway:
          'ConcurrentHashMap provides atomic operations like computeIfAbsent and merge for lock-free concurrent updates.',
      },
      {
        title: 'BlockingQueue — Thread-Safe Queue',
        content:
          'We saw BlockingQueue in the Producer-Consumer lesson. Here is a deeper look at the variants:',
        code: [
          {
            language: 'java',
            label: 'Java — BlockingQueue Variants',
            code: `import java.util.concurrent.*;

// 1. LinkedBlockingQueue — bounded or unbounded linked list queue
BlockingQueue<String> linkedQ = new LinkedBlockingQueue<>(100);
// Good for: producer-consumer with many items

// 2. ArrayBlockingQueue — bounded array-backed queue
BlockingQueue<String> arrayQ = new ArrayBlockingQueue<>(100);
// Good for: fixed-size buffers, slightly faster than linked

// 3. PriorityBlockingQueue — sorted by priority
BlockingQueue<Integer> priorityQ = new PriorityBlockingQueue<>();
priorityQ.put(5);
priorityQ.put(1);
priorityQ.put(3);
// take() returns: 1, 3, 5 (smallest first)

// 4. DelayQueue — items become available after a delay
// Good for: scheduled tasks, timeouts, rate limiting

// 5. SynchronousQueue — zero capacity! Direct hand-off
BlockingQueue<String> syncQ = new SynchronousQueue<>();
// put() blocks until another thread calls take()
// Good for: direct thread-to-thread hand-off

// Key methods:
// put(item)           — blocks until space available
// take()              — blocks until item available
// offer(item, timeout) — returns false if timeout expires
// poll(timeout)       — returns null if timeout expires`,
          },
          {
            language: 'python',
            label: 'Python — Thread-Safe Collections',
            code: `import queue
import threading

# 1. Queue — FIFO (first in, first out)
fifo = queue.Queue(maxsize=10)
fifo.put("first")
fifo.put("second")
print(fifo.get())  # "first"

# 2. LifoQueue — LIFO (stack behavior)
lifo = queue.LifoQueue(maxsize=10)
lifo.put("first")
lifo.put("second")
print(lifo.get())  # "second" (last in, first out)

# 3. PriorityQueue — sorted by priority
pq = queue.PriorityQueue()
pq.put((3, "low priority"))
pq.put((1, "high priority"))
pq.put((2, "medium priority"))
print(pq.get())  # (1, "high priority")

# All three are thread-safe — no external locking needed!
# Methods: put(), get(), qsize(), empty(), full()
# put() blocks when full, get() blocks when empty`,
          },
        ],
        keyTakeaway:
          'BlockingQueue variants serve different needs: FIFO, LIFO, Priority, Delayed. All are thread-safe with blocking operations.',
      },
      {
        title: 'Atomic Variables',
        content:
          'For simple numeric operations, atomic variables provide lock-free thread safety using hardware CAS (Compare-And-Swap) instructions.',
        code: [
          {
            language: 'java',
            label: 'Java — Atomic Classes',
            code: `import java.util.concurrent.atomic.*;

// AtomicInteger — thread-safe integer
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();       // atomically: read, increment, write → 1
counter.addAndGet(10);           // atomically: add 10 → 11
counter.compareAndSet(11, 20);   // if current == 11, set to 20 → true

// AtomicLong — thread-safe long
AtomicLong bigCounter = new AtomicLong(0L);

// AtomicBoolean — thread-safe flag
AtomicBoolean isRunning = new AtomicBoolean(true);
isRunning.compareAndSet(true, false);  // atomically flip

// AtomicReference — thread-safe reference
AtomicReference<String> ref = new AtomicReference<>("old");
ref.compareAndSet("old", "new");  // atomically update reference

// LongAdder — high-throughput counter (better than AtomicLong under contention)
LongAdder adder = new LongAdder();
adder.increment();  // each thread updates its own cell
adder.sum();        // aggregate all cells — eventually consistent`,
          },
        ],
        keyTakeaway:
          'Atomic variables use hardware CAS for lock-free thread safety. Use LongAdder for high-contention counters.',
      },
      {
        title: 'Choosing the Right Data Structure',
        content:
          'Here is your decision guide for concurrent data structures:',
        table: {
          headers: ['Need', 'Use', 'Key Feature'],
          rows: [
            ['Thread-safe map', 'ConcurrentHashMap', 'Fine-grained locking, atomic ops'],
            ['Thread-safe counter', 'AtomicInteger / LongAdder', 'Lock-free CAS operations'],
            ['Producer-Consumer queue', 'LinkedBlockingQueue', 'Blocking put/take'],
            ['Priority ordering', 'PriorityBlockingQueue', 'Sorted by priority'],
            ['Thread-safe set', 'ConcurrentHashMap.newKeySet()', 'Based on ConcurrentHashMap'],
            ['Copy-on-write list', 'CopyOnWriteArrayList', 'Best for read-heavy, write-rare'],
            ['Direct hand-off', 'SynchronousQueue', 'Zero capacity, direct transfer'],
          ],
        },
        keyTakeaway:
          'Pick the right tool: ConcurrentHashMap for maps, BlockingQueue for queues, Atomic* for counters.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using HashMap in multi-threaded code',
        explanation:
          'HashMap is NOT thread-safe. Concurrent modifications can cause infinite loops, data corruption, and ConcurrentModificationException.',
      },
      {
        mistake: 'Wrapping ConcurrentHashMap operations in synchronized blocks',
        explanation:
          'ConcurrentHashMap is already thread-safe. Adding synchronized defeats its fine-grained locking and kills performance.',
      },
      {
        mistake: 'Using CopyOnWriteArrayList for write-heavy workloads',
        explanation:
          'CopyOnWriteArrayList copies the entire array on every write. It is only efficient when reads vastly outnumber writes.',
      },
      {
        mistake: 'Iterating and modifying ConcurrentHashMap simultaneously',
        explanation:
          'Iterators on ConcurrentHashMap are weakly consistent. They may not reflect recent modifications. Use compute/merge for atomic updates.',
      },
    ],
    practiceQuestions: [
      'Implement a thread-safe LRU cache using ConcurrentHashMap.',
      'When would you use LongAdder instead of AtomicLong?',
      'Compare ConcurrentHashMap with Collections.synchronizedMap — which is better and why?',
      'Implement a thread-safe bounded set that rejects additions when full.',
      'Why is CopyOnWriteArrayList good for event listener lists?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'How does ConcurrentHashMap achieve better performance than Collections.synchronizedMap?',
        options: ['It uses no locks at all', 'It locks individual segments/buckets instead of the entire map', 'It is stored in faster memory', 'It limits the number of entries'],
        answer: 'It locks individual segments/buckets instead of the entire map',
        explanation: 'ConcurrentHashMap uses fine-grained locking (segment/bucket-level in older versions, CAS + synchronized on individual nodes in Java 8+). This allows multiple threads to read and write different buckets concurrently, unlike synchronizedMap which locks the entire map.',
      },
      {
        type: 'mcq',
        question: 'When is CopyOnWriteArrayList a good choice?',
        options: ['When writes are very frequent', 'When reads far outnumber writes', 'When the list is very large', 'When elements must be unique'],
        answer: 'When reads far outnumber writes',
        explanation: 'CopyOnWriteArrayList creates a new copy of the entire array on every write, making writes expensive O(n). But reads require no locking and are very fast. It is ideal for event listener lists or configuration that is read often but rarely modified.',
      },
      {
        type: 'short-answer',
        question: 'What advantage does LongAdder have over AtomicLong for high-contention counters?',
        answer: 'LongAdder distributes updates across multiple cells to reduce contention',
        explanation: 'AtomicLong uses a single CAS variable, causing contention when many threads update simultaneously. LongAdder splits the counter into multiple cells, each updated independently, and sums them when reading. This dramatically reduces CAS failures under high contention.',
      },
      {
        type: 'mcq',
        question: 'What does a BlockingQueue do when you try to take() from an empty queue?',
        options: ['Returns null', 'Throws NoSuchElementException', 'Blocks until an element becomes available', 'Returns a default value'],
        answer: 'Blocks until an element becomes available',
        explanation: 'take() is a blocking operation that waits until an element is available. For non-blocking alternatives, use poll() (returns null if empty) or poll(timeout) (waits up to a specified duration).',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     11. ASYNC/AWAIT & FUTURES
     ────────────────────────────────────────────── */
  'async-await-and-futures': {
    steps: [
      {
        title: 'Ordering Food While Waiting',
        content:
          'When you order food at a restaurant, you do not stand at the counter staring at the kitchen until your food is ready. You sit down, check your phone, chat with friends — and the waiter brings the food when it is done. This is **asynchronous** execution.\n\nSynchronous = you wait at the counter doing nothing until food arrives.\nAsynchronous = you sit down and do other things; you are notified when the food is ready.',
        analogy:
          'Ordering at a restaurant: you get a receipt (Future/Promise) that represents your food. The receipt is not food — it is a promise of food. When the food is ready, the receipt is "fulfilled." If the kitchen burns down, the receipt is "rejected" (error).',
        keyTakeaway:
          'Async programming lets you start a task and continue doing other work while waiting for the result.',
      },
      {
        title: 'Futures in Java',
        content:
          'A `Future` in Java represents a result that will be available in the future. You submit a task to a thread pool and get back a Future that you can check or wait on.',
        code: [
          {
            language: 'java',
            label: 'Java — Future',
            code: `import java.util.concurrent.*;

public class FutureDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(4);

        // Submit a task — get a Future back immediately
        Future<String> future = pool.submit(() -> {
            Thread.sleep(2000);  // simulate slow API call
            return "Data from API";
        });

        // Do other work while waiting...
        System.out.println("Doing other work...");
        Thread.sleep(500);
        System.out.println("Still working...");

        // Now we need the result — block until ready
        System.out.println("Waiting for result...");
        String result = future.get();  // blocks until done
        System.out.println("Got: " + result);

        // Future with timeout
        Future<Integer> slow = pool.submit(() -> {
            Thread.sleep(10000);
            return 42;
        });
        try {
            slow.get(2, TimeUnit.SECONDS);  // timeout after 2 seconds
        } catch (TimeoutException e) {
            System.out.println("Task took too long!");
            slow.cancel(true);  // cancel the task
        }

        pool.shutdown();
    }
}`,
          },
        ],
        keyTakeaway:
          'Future.get() blocks until the result is ready. Use timeouts to avoid waiting forever.',
      },
      {
        title: 'CompletableFuture — Async Chains',
        content:
          'Java 8\'s `CompletableFuture` is a huge upgrade over `Future`. It supports chaining, composition, and callbacks — no blocking required.',
        code: [
          {
            language: 'java',
            label: 'Java — CompletableFuture',
            code: `import java.util.concurrent.CompletableFuture;

public class CompletableFutureDemo {
    // Simulate API calls
    static CompletableFuture<String> fetchUser(int userId) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(1000);  // simulate network call
            return "User-" + userId;
        });
    }

    static CompletableFuture<String> fetchOrders(String user) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(800);
            return "Orders for " + user;
        });
    }

    public static void main(String[] args) {
        // Chain: fetch user → fetch orders → print
        CompletableFuture<Void> chain = fetchUser(123)
            .thenCompose(user -> fetchOrders(user))    // chain dependent tasks
            .thenAccept(orders -> System.out.println(orders));

        // Parallel: fetch two things at once, combine results
        CompletableFuture<String> user = fetchUser(1);
        CompletableFuture<String> orders = fetchOrders("Alice");

        CompletableFuture<String> combined = user
            .thenCombine(orders, (u, o) -> u + " + " + o);
        System.out.println(combined.join());  // "User-1 + Orders for Alice"

        // Error handling
        CompletableFuture<String> safe = fetchUser(999)
            .thenApply(u -> u.toUpperCase())
            .exceptionally(ex -> "Default User");  // fallback on error

        chain.join();  // wait for chain to complete
    }

    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) {}
    }
}`,
          },
        ],
        keyTakeaway:
          'CompletableFuture supports chaining (thenApply), composition (thenCompose), parallel (thenCombine), and error handling (exceptionally).',
      },
      {
        title: 'async/await in Python',
        content:
          'Python\'s `asyncio` provides async/await syntax for writing non-blocking concurrent code. Unlike threading, asyncio uses a **single thread** with an event loop.',
        code: [
          {
            language: 'python',
            label: 'Python — asyncio',
            code: `import asyncio
import time

# "async def" makes this a coroutine
async def fetch_data(url, delay):
    print(f"Fetching {url}...")
    await asyncio.sleep(delay)  # non-blocking sleep (simulates I/O)
    return f"Data from {url}"

# Sequential — slow
async def sequential():
    start = time.time()
    r1 = await fetch_data("api/users", 2)      # wait 2 seconds
    r2 = await fetch_data("api/orders", 1.5)    # then wait 1.5 seconds
    r3 = await fetch_data("api/products", 1)    # then wait 1 second
    print(f"Sequential: {time.time() - start:.1f}s")  # ~4.5s
    return [r1, r2, r3]

# Parallel — fast
async def parallel():
    start = time.time()
    # gather() runs all coroutines concurrently
    r1, r2, r3 = await asyncio.gather(
        fetch_data("api/users", 2),
        fetch_data("api/orders", 1.5),
        fetch_data("api/products", 1),
    )
    print(f"Parallel: {time.time() - start:.1f}s")  # ~2s (max of delays)
    return [r1, r2, r3]

# Run the async functions
asyncio.run(sequential())
asyncio.run(parallel())`,
          },
        ],
        keyTakeaway:
          'asyncio.gather() runs coroutines concurrently on a single thread. await pauses the coroutine without blocking the thread.',
      },
      {
        title: 'async/await in JavaScript',
        content:
          'JavaScript was the pioneer of async/await. It uses Promises (the JavaScript equivalent of Futures).',
        code: [
          {
            language: 'javascript',
            label: 'JavaScript — Promises & async/await',
            code: `// Simulate an API call
function fetchData(url, delayMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(\`Data from \${url}\`);  // resolve the promise
    }, delayMs);
  });
}

// Sequential — slow
async function sequential() {
  console.time('sequential');
  const r1 = await fetchData('api/users', 2000);    // wait 2s
  const r2 = await fetchData('api/orders', 1500);   // then wait 1.5s
  const r3 = await fetchData('api/products', 1000); // then wait 1s
  console.timeEnd('sequential');  // ~4.5s
  return [r1, r2, r3];
}

// Parallel — fast
async function parallel() {
  console.time('parallel');
  const [r1, r2, r3] = await Promise.all([
    fetchData('api/users', 2000),     // all start at the same time
    fetchData('api/orders', 1500),
    fetchData('api/products', 1000),
  ]);
  console.timeEnd('parallel');  // ~2s (max of delays)
  return [r1, r2, r3];
}

// Error handling
async function safe() {
  try {
    const data = await fetchData('api/broken', 1000);
    return data;
  } catch (error) {
    console.error('Failed:', error);
    return 'Default data';  // fallback
  }
}`,
          },
        ],
        keyTakeaway:
          'JavaScript uses Promise.all() for parallel async, try/catch for error handling. Same concepts as Python asyncio.gather().',
      },
      {
        title: 'Threads vs async/await — When to Use Each',
        content:
          'Both handle concurrent I/O, but they work differently:',
        comparison: {
          leftTitle: 'Threads',
          rightTitle: 'async/await',
          items: [
            { left: 'Multiple OS threads', right: 'Single thread with event loop' },
            { left: 'Preemptive scheduling (OS decides)', right: 'Cooperative scheduling (you choose when to yield)' },
            { left: 'Higher memory per thread (~1MB stack)', right: 'Minimal overhead per coroutine' },
            { left: 'Race conditions possible', right: 'No race conditions (single thread)' },
            { left: 'Good for blocking I/O and CPU work', right: 'Good for many concurrent I/O tasks' },
          ],
        },
        keyTakeaway:
          'Use threads for blocking I/O and CPU work. Use async/await for many concurrent non-blocking I/O tasks.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Calling blocking code inside async functions',
        explanation:
          'Using time.sleep() or blocking I/O inside an async function blocks the entire event loop. Use await asyncio.sleep() or run blocking code in a thread pool.',
      },
      {
        mistake: 'Awaiting tasks sequentially instead of using gather/Promise.all',
        explanation:
          'await task1(); await task2(); runs them sequentially. Use asyncio.gather(task1(), task2()) or Promise.all() for parallelism.',
      },
      {
        mistake: 'Not handling rejected Futures/Promises',
        explanation:
          'Unhandled rejections crash the program or cause silent failures. Always use try/catch or .exceptionally().',
      },
      {
        mistake: 'Using Future.get() without timeout',
        explanation:
          'Future.get() blocks forever if the task never completes. Always use get(timeout, unit) to avoid hanging.',
      },
    ],
    practiceQuestions: [
      'Write an async Python function that fetches 5 URLs in parallel and returns all results.',
      'Explain the difference between Future.get() and CompletableFuture.thenApply().',
      'When is async/await better than threading? When is threading better?',
      'Chain three API calls where each depends on the previous result using CompletableFuture.',
      'Implement Promise.race() equivalent in Python (return first completed result).',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is the key difference between async/await and traditional threading?',
        options: ['Async/await uses multiple CPU cores', 'Async/await uses cooperative scheduling on a single thread via an event loop', 'Async/await is always faster', 'Async/await requires more memory'],
        answer: 'Async/await uses cooperative scheduling on a single thread via an event loop',
        explanation: 'Async/await uses an event loop that cooperatively schedules coroutines on one (or few) threads. Tasks yield control at await points, allowing other tasks to run. There is no OS thread per task, making it very lightweight for I/O-bound workloads.',
      },
      {
        type: 'mcq',
        question: 'What does Future.get() do if the result is not yet available?',
        options: ['Returns null', 'Throws an exception', 'Blocks the calling thread until the result is ready', 'Starts a new thread to compute it'],
        answer: 'Blocks the calling thread until the result is ready',
        explanation: 'Future.get() is a blocking call that waits until the asynchronous computation completes and returns the result. Use CompletableFuture.thenApply() for non-blocking composition instead.',
      },
      {
        type: 'short-answer',
        question: 'What Python function runs multiple coroutines concurrently and waits for all to complete?',
        answer: 'asyncio.gather()',
        explanation: 'asyncio.gather() takes multiple coroutines or futures, runs them concurrently on the event loop, and returns a list of their results in the same order. It is the async equivalent of starting multiple threads and joining them all.',
      },
      {
        type: 'mcq',
        question: 'When is threading better than async/await?',
        options: ['For network I/O', 'For CPU-bound tasks that need true parallelism', 'For handling many concurrent connections', 'For event-driven programming'],
        answer: 'For CPU-bound tasks that need true parallelism',
        explanation: 'Async/await excels at I/O-bound concurrency (thousands of network connections) but runs on a single thread. For CPU-bound parallelism (computation, data processing), real OS threads (or processes) are needed to utilize multiple CPU cores.',
      },
      {
        type: 'short-answer',
        question: 'What does thenApply() do on a CompletableFuture in Java?',
        answer: 'Chains a transformation function that runs when the future completes, without blocking',
        explanation: 'thenApply() attaches a callback that transforms the result of a CompletableFuture when it completes. It returns a new CompletableFuture with the transformed result, enabling non-blocking composition of asynchronous operations.',
      },
    ],
  },

  /* ──────────────────────────────────────────────
     12. CLASSIC: DINING PHILOSOPHERS
     ────────────────────────────────────────────── */
  'classic-dining-philosophers': {
    steps: [
      {
        title: 'The Problem Setup',
        content:
          'Five philosophers sit around a circular table. Between each pair of philosophers is a single fork (5 forks total). To eat, a philosopher needs BOTH the fork on their left AND the fork on their right.\n\nA philosopher alternates between **thinking** and **eating**:\n1. Think for a while\n2. Pick up left fork\n3. Pick up right fork\n4. Eat\n5. Put down right fork\n6. Put down left fork\n7. Go back to thinking\n\nThe problem: if ALL five philosophers pick up their left fork simultaneously, they all wait for the right fork forever — **deadlock!**',
        analogy:
          'Five people at a round table, sharing chopsticks (one between each pair). Everyone picks up the left chopstick at the same time. Now everyone is holding one chopstick, waiting for the person to their right to put theirs down. Nobody can eat. Nobody puts down their chopstick. Deadlock.',
        keyTakeaway:
          'The Dining Philosophers problem demonstrates deadlock, resource contention, and starvation in concurrent systems.',
      },
      {
        title: 'The Naive Solution (Deadlock!)',
        content:
          'Let us first see the naive approach that leads to deadlock.',
        code: [
          {
            language: 'python',
            label: 'Python — Deadlock-Prone Version',
            code: `import threading
import time
import random

class DiningPhilosophers:
    def __init__(self, num=5):
        self.num = num
        # One fork (lock) between each pair of philosophers
        self.forks = [threading.Lock() for _ in range(num)]

    def philosopher(self, philosopher_id):
        left_fork = philosopher_id
        right_fork = (philosopher_id + 1) % self.num

        for _ in range(3):  # eat 3 times
            # Think
            print(f"Philosopher {philosopher_id} is thinking...")
            time.sleep(random.uniform(0.1, 0.5))

            # Try to eat — DEADLOCK RISK!
            print(f"Philosopher {philosopher_id} picks up LEFT fork {left_fork}")
            self.forks[left_fork].acquire()

            # If ALL philosophers reach here simultaneously, DEADLOCK!
            print(f"Philosopher {philosopher_id} picks up RIGHT fork {right_fork}")
            self.forks[right_fork].acquire()

            # Eat
            print(f"Philosopher {philosopher_id} is EATING")
            time.sleep(random.uniform(0.1, 0.3))

            # Put down forks
            self.forks[right_fork].release()
            self.forks[left_fork].release()

        print(f"Philosopher {philosopher_id} is done.")

# This WILL deadlock eventually!
# dp = DiningPhilosophers()
# threads = [threading.Thread(target=dp.philosopher, args=(i,)) for i in range(5)]
# for t in threads: t.start()
# for t in threads: t.join()  # hangs forever!`,
          },
        ],
        keyTakeaway:
          'If all philosophers pick up the left fork simultaneously, all wait for the right fork forever = deadlock.',
      },
      {
        title: 'Solution 1: Resource Ordering',
        content:
          'The most elegant solution: assign a number to each fork and always pick up the **lower-numbered** fork first. This breaks the circular wait condition (the 4th Coffman condition) and prevents deadlock.\n\nPhilosopher 4 (last one) would normally pick up fork 4 (left), then fork 0 (right). With ordering, they pick up fork 0 first (lower), then fork 4. This breaks the cycle!',
        code: [
          {
            language: 'python',
            label: 'Python — Resource Ordering Fix',
            code: `import threading
import time
import random

class DiningPhilosophersOrdered:
    def __init__(self, num=5):
        self.num = num
        self.forks = [threading.Lock() for _ in range(num)]

    def philosopher(self, philosopher_id):
        left_fork = philosopher_id
        right_fork = (philosopher_id + 1) % self.num

        # KEY FIX: Always pick up the LOWER-numbered fork first
        first_fork = min(left_fork, right_fork)
        second_fork = max(left_fork, right_fork)

        for meal in range(3):
            # Think
            print(f"P{philosopher_id} thinking...")
            time.sleep(random.uniform(0.1, 0.3))

            # Pick up lower-numbered fork first (breaks circular wait!)
            self.forks[first_fork].acquire()
            self.forks[second_fork].acquire()

            # Eat
            print(f"P{philosopher_id} EATING (forks {first_fork},{second_fork})")
            time.sleep(random.uniform(0.1, 0.2))

            # Put down forks
            self.forks[second_fork].release()
            self.forks[first_fork].release()

        print(f"P{philosopher_id} finished all meals!")

dp = DiningPhilosophersOrdered()
threads = [threading.Thread(target=dp.philosopher, args=(i,)) for i in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print("All philosophers done! No deadlock!")`,
          },
          {
            language: 'java',
            label: 'Java — Resource Ordering',
            code: `import java.util.concurrent.locks.ReentrantLock;

public class DiningPhilosophers {
    private final ReentrantLock[] forks;
    private final int numPhilosophers;

    public DiningPhilosophers(int num) {
        this.numPhilosophers = num;
        this.forks = new ReentrantLock[num];
        for (int i = 0; i < num; i++) forks[i] = new ReentrantLock();
    }

    public void philosopher(int id) {
        int left = id;
        int right = (id + 1) % numPhilosophers;

        // Always acquire lower-numbered fork first
        int first = Math.min(left, right);
        int second = Math.max(left, right);

        for (int meal = 0; meal < 3; meal++) {
            think(id);
            forks[first].lock();    // lower-numbered first
            try {
                forks[second].lock();  // then higher-numbered
                try {
                    eat(id, first, second);
                } finally {
                    forks[second].unlock();
                }
            } finally {
                forks[first].unlock();
            }
        }
        System.out.println("P" + id + " finished!");
    }

    private void think(int id) {
        System.out.println("P" + id + " thinking...");
        try { Thread.sleep((long)(Math.random() * 300)); }
        catch (InterruptedException e) {}
    }

    private void eat(int id, int f1, int f2) {
        System.out.println("P" + id + " EATING (forks " + f1 + "," + f2 + ")");
        try { Thread.sleep((long)(Math.random() * 200)); }
        catch (InterruptedException e) {}
    }
}`,
          },
        ],
        keyTakeaway:
          'Resource ordering: always acquire lower-numbered lock first. This breaks the circular wait and prevents deadlock.',
      },
      {
        title: 'Solution 2: Arbitrator (Waiter)',
        content:
          'Another approach: introduce a **waiter** (semaphore with N-1 permits). At most N-1 philosophers can attempt to eat at the same time, guaranteeing at least one can acquire both forks.',
        code: [
          {
            language: 'python',
            label: 'Python — Arbitrator Solution',
            code: `import threading
import time
import random

class DiningPhilosophersWaiter:
    def __init__(self, num=5):
        self.num = num
        self.forks = [threading.Lock() for _ in range(num)]
        # Waiter allows at most (num-1) philosophers to try eating
        self.waiter = threading.Semaphore(num - 1)  # 4 permits for 5 philosophers

    def philosopher(self, philosopher_id):
        left_fork = philosopher_id
        right_fork = (philosopher_id + 1) % self.num

        for _ in range(3):
            # Think
            time.sleep(random.uniform(0.1, 0.3))

            # Ask waiter for permission (at most 4 can try at once)
            self.waiter.acquire()

            # Now safe to pick up forks in any order
            self.forks[left_fork].acquire()
            self.forks[right_fork].acquire()

            # Eat
            print(f"P{philosopher_id} EATING")
            time.sleep(random.uniform(0.1, 0.2))

            # Put down forks and notify waiter
            self.forks[right_fork].release()
            self.forks[left_fork].release()
            self.waiter.release()  # let another philosopher try

        print(f"P{philosopher_id} done!")

dp = DiningPhilosophersWaiter()
threads = [threading.Thread(target=dp.philosopher, args=(i,)) for i in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print("No deadlock! Waiter solution works.")`,
          },
        ],
        keyTakeaway:
          'An arbitrator (semaphore with N-1 permits) ensures at least one philosopher can always get both forks.',
      },
      {
        title: 'Solution 3: Timeout and Retry',
        content:
          'Try to acquire both forks with a timeout. If you cannot get both, release what you have and try again later. This prevents deadlock but may cause livelock.',
        code: [
          {
            language: 'python',
            label: 'Python — Timeout Solution',
            code: `import threading
import time
import random

class DiningPhilosophersTimeout:
    def __init__(self, num=5):
        self.num = num
        self.forks = [threading.Lock() for _ in range(num)]

    def philosopher(self, philosopher_id):
        left_fork = philosopher_id
        right_fork = (philosopher_id + 1) % self.num

        meals = 0
        while meals < 3:
            # Think
            time.sleep(random.uniform(0.1, 0.3))

            # Try to get left fork with timeout
            got_left = self.forks[left_fork].acquire(timeout=1)
            if not got_left:
                continue  # retry

            # Try to get right fork with timeout
            got_right = self.forks[right_fork].acquire(timeout=1)
            if not got_right:
                self.forks[left_fork].release()  # release left, retry
                time.sleep(random.uniform(0.01, 0.1))  # random backoff
                continue

            # Got both forks — eat!
            print(f"P{philosopher_id} EATING (meal {meals + 1})")
            time.sleep(random.uniform(0.1, 0.2))
            meals += 1

            # Release forks
            self.forks[right_fork].release()
            self.forks[left_fork].release()

        print(f"P{philosopher_id} done!")`,
          },
        ],
        keyTakeaway:
          'Timeout + retry prevents deadlock but add random backoff to prevent livelock.',
      },
      {
        title: 'Comparison of Solutions',
        content:
          'Each solution has trade-offs:',
        table: {
          headers: ['Solution', 'Pros', 'Cons'],
          rows: [
            ['Resource Ordering', 'Simple, no extra overhead', 'Requires global lock ordering'],
            ['Arbitrator (Waiter)', 'Easy to understand', 'Reduces concurrency (N-1 at a time)'],
            ['Timeout + Retry', 'No global knowledge needed', 'Possible livelock, wasted retries'],
            ['Chandy/Misra', 'Fully distributed', 'Complex implementation'],
          ],
        },
        keyTakeaway:
          'Resource ordering is the most practical. Use the arbitrator when ordering is hard. Timeout + retry is a last resort.',
      },
      {
        title: 'Why This Problem Matters',
        content:
          'The Dining Philosophers problem is not just academic trivia. It models real-world concurrency challenges:\n\n- **Database transactions** — Two transactions locking rows in different order = deadlock\n- **Network protocols** — Two servers each waiting for the other to acknowledge\n- **Resource allocation** — Threads competing for file handles, connections, memory\n- **Distributed systems** — Nodes in a cluster each holding one resource and needing another\n\nThe solutions (ordering, arbitration, timeout) are the same patterns used in production systems.',
        keyTakeaway:
          'Dining Philosophers teaches resource ordering, arbitration, and timeout — patterns used in databases, networks, and distributed systems.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Thinking the problem only applies to 5 philosophers',
        explanation:
          'The number is arbitrary. The same deadlock occurs with any number of threads competing for shared resources in a circular dependency.',
      },
      {
        mistake: 'Forgetting about starvation',
        explanation:
          'Even without deadlock, a philosopher might never eat if others always grab the forks first. Fairness mechanisms (like fair locks) prevent starvation.',
      },
      {
        mistake: 'Confusing livelock with deadlock',
        explanation:
          'In a livelock, threads are active (retrying) but making no progress. In a deadlock, threads are permanently blocked. Timeouts can cause livelock without random backoff.',
      },
      {
        mistake: 'Over-complicating the solution',
        explanation:
          'Resource ordering is the simplest and most efficient solution. Start with it before considering more complex approaches.',
      },
    ],
    practiceQuestions: [
      'Implement the Dining Philosophers with resource ordering in Java.',
      'How does the arbitrator solution prevent deadlock? What is the minimum number of permits?',
      'What is the difference between deadlock, livelock, and starvation?',
      'Modify the timeout solution to add fair scheduling (prevent starvation).',
      'How does the Dining Philosophers relate to database deadlocks? Give a real example.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'In the Dining Philosophers problem, what causes deadlock?',
        options: ['Too many philosophers', 'Each philosopher picks up their left fork and waits for the right fork, creating a circular wait', 'The forks are too slow to use', 'Philosophers eat too quickly'],
        answer: 'Each philosopher picks up their left fork and waits for the right fork, creating a circular wait',
        explanation: 'If all 5 philosophers simultaneously pick up their left fork, each waits for the right fork held by their neighbor. This creates a circular dependency (circular wait) — one of the four Coffman conditions — resulting in deadlock.',
      },
      {
        type: 'mcq',
        question: 'How does the resource ordering solution prevent deadlock in the Dining Philosophers?',
        options: ['It adds more forks', 'It forces philosophers to always pick up the lower-numbered fork first', 'It limits philosophers to one fork', 'It removes one philosopher'],
        answer: 'It forces philosophers to always pick up the lower-numbered fork first',
        explanation: 'By numbering forks and always acquiring the lower-numbered one first, the circular wait condition is broken. The last philosopher must pick up fork 0 before fork 4, competing with philosopher 0 instead of creating a cycle.',
      },
      {
        type: 'short-answer',
        question: 'In the arbitrator solution, what is the minimum number of semaphore permits needed for 5 philosophers to avoid deadlock?',
        answer: '4',
        explanation: 'With 4 permits, at most 4 philosophers can attempt to eat simultaneously. This guarantees at least one philosopher can acquire both forks and complete, breaking the circular wait. 5 permits would allow deadlock again.',
      },
      {
        type: 'mcq',
        question: 'What is starvation in the context of the Dining Philosophers?',
        options: ['A philosopher runs out of memory', 'A philosopher never gets to eat because neighbors always grab the forks first', 'All philosophers stop eating', 'The program throws a StackOverflowError'],
        answer: 'A philosopher never gets to eat because neighbors always grab the forks first',
        explanation: 'Starvation occurs when a thread (philosopher) is perpetually denied access to resources, even though the system is not deadlocked. Fairness mechanisms like fair locks or fair semaphores ensure every philosopher eventually gets to eat.',
      },
      {
        type: 'short-answer',
        question: 'Name a real-world system that faces the same problem as the Dining Philosophers.',
        answer: 'Database transactions acquiring locks on multiple tables or rows',
        explanation: 'Database transactions that need to lock multiple rows or tables face the same circular dependency problem. If transaction A locks row 1 and waits for row 2, while transaction B locks row 2 and waits for row 1, deadlock occurs. Databases use lock ordering and deadlock detection to handle this.',
      },
    ],
  },
};
