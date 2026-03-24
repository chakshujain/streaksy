import type { LessonStep, QuizQuestion } from '@/lib/learn-data';

export const gitLessons: Record<
  string,
  {
    steps: LessonStep[];
    commonMistakes?: { mistake: string; explanation: string }[];
    practiceQuestions?: string[];
    quiz?: QuizQuestion[];
  }
> = {
  // ───────────────────────────────────────────────
  // 1. Git Basics
  // ───────────────────────────────────────────────
  'git-basics': {
    steps: [
      {
        title: 'What is Version Control?',
        content:
          'Version control tracks every change to your files over time. You can see who changed what, when, and why — and undo any mistake by going back to a previous version.',
        analogy:
          'Git is like Google Docs history for code. Every time you save (commit), a snapshot is created. You can scroll back to any snapshot, see what changed, and restore it if needed.',
        cards: [
          { title: 'Track Changes', description: 'See every edit, who made it, and when', icon: '📝', color: 'blue' },
          { title: 'Undo Mistakes', description: 'Go back to any previous version', icon: '⏪', color: 'amber' },
          { title: 'Collaborate', description: 'Multiple people work on the same codebase', icon: '👥', color: 'emerald' },
          { title: 'Branch', description: 'Work on features without affecting others', icon: '🌿', color: 'purple' },
        ],
        comparison: {
          leftTitle: 'Without Git',
          rightTitle: 'With Git',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: 'project-v1.zip, project-v2-final.zip', right: 'Single folder, full history inside' },
            { left: 'Cannot undo specific changes', right: 'Revert any commit at any time' },
            { left: 'Emailing files back and forth', right: 'Push/pull with remote repository' },
            { left: 'Overwrite each other\'s work', right: 'Merge changes intelligently' },
          ],
        },
        keyTakeaway:
          'Git is a distributed version control system that tracks every change as a snapshot, enabling collaboration and safe experimentation.',
      },
      {
        title: 'The Three Areas',
        content:
          'Git has three areas where your files live. Understanding these is the key to understanding every Git command.',
        diagram:
          '┌────────────────┐     ┌────────────────┐     ┌────────────────┐\n│   Working      │     │   Staging      │     │   Repository   │\n│   Directory    │     │   Area         │     │   (.git)       │\n│                │     │   (Index)      │     │                │\n│  Your files    │     │  Next commit   │     │  All commits   │\n│  you edit      │     │  preview       │     │  (permanent)   │\n│                │     │                │     │                │\n│         ──git add──► │        ──git commit──►│               │\n│                │     │                │     │                │\n│  ◄──git restore────  │                │     │                │\n│                │     │                │     │                │\n│  ◄──────────── git checkout ─────────────── │               │\n└────────────────┘     └────────────────┘     └────────────────┘',
        bullets: [
          '**Working Directory** — the files you see and edit in your editor.',
          '**Staging Area (Index)** — a holding area for changes you want in the next commit.',
          '**Repository (.git)** — the permanent history of all committed snapshots.',
        ],
        flow: [
          { label: 'Edit Files', description: 'Change code in editor', icon: '✏️' },
          { label: 'git add', description: 'Stage specific changes', icon: '📋' },
          { label: 'git commit', description: 'Save snapshot to repo', icon: '💾' },
          { label: 'git push', description: 'Share with remote', icon: '📤' },
        ],
        keyTakeaway:
          'git add moves changes from working directory to staging. git commit saves staged changes to the repository. This two-step process gives you fine control.',
      },
      {
        title: 'Your First Commits',
        content:
          'A commit is a snapshot of your staged changes with a message explaining what you did. Each commit has a unique hash (like a fingerprint).',
        diagram:
          'Commit History (git log --oneline):\n\n  a1b2c3d  Add index.html with greeting\n     │\n  f4e5d6c  Initial commit: add README\n     │\n    (root)\n\n  Each commit stores:\n  ┌────────────────────────┐\n  │ Hash:    a1b2c3d       │\n  │ Author:  Alice <a@b.c> │\n  │ Date:    2026-03-21    │\n  │ Message: Add index...  │\n  │ Parent:  f4e5d6c       │\n  │ Tree:    (file snapshot)│\n  └────────────────────────┘',
        code: [
          {
            language: 'bash',
            label: 'Basic Git workflow',
            code: `# Create a new repository\ngit init my-project\ncd my-project\n\n# Create a file and stage it\necho "# My Project" > README.md\ngit add README.md\n\n# Commit the snapshot\ngit commit -m "Initial commit: add README"\n\n# Make changes, stage, commit\necho "Hello, world!" > index.html\ngit add index.html\ngit commit -m "Add index.html with greeting"\n\n# See commit history\ngit log --oneline\n# a1b2c3d Add index.html with greeting\n# f4e5d6c Initial commit: add README`,
          },
        ],
        keyTakeaway:
          'The core loop is: edit files, git add to stage, git commit to save. Each commit is a permanent snapshot with a unique hash.',
      },
      {
        title: 'Inspecting Changes',
        content:
          'Before committing, always review what you have changed. Git provides tools to see differences at every level.',
        table: {
          headers: ['Command', 'Shows', 'Use When'],
          rows: [
            ['git status', 'Changed/staged/untracked files', 'Before every commit'],
            ['git diff', 'Unstaged line-level changes', 'Reviewing your edits'],
            ['git diff --staged', 'Staged changes about to commit', 'Final review before committing'],
            ['git log', 'Commit history', 'Understanding project timeline'],
            ['git blame', 'Who wrote each line', 'Tracking down when a line changed'],
          ],
        },
        code: [
          {
            language: 'bash',
            label: 'Inspecting changes',
            code: `# See which files have changed\ngit status\n\n# See unstaged changes (working dir vs staging)\ngit diff\n\n# See staged changes (staging vs last commit)\ngit diff --staged\n\n# See the full history\ngit log --oneline --graph --all\n\n# See what changed in a specific commit\ngit show a1b2c3d\n\n# See who changed each line of a file\ngit blame index.html`,
          },
        ],
        flow: [
          { label: 'git status', description: 'What files changed?', icon: '📋' },
          { label: 'git diff', description: 'What lines changed?', icon: '🔍' },
          { label: 'git add', description: 'Stage the good changes', icon: '✅' },
          { label: 'git diff --staged', description: 'Review staged changes', icon: '👀' },
          { label: 'git commit', description: 'Save the snapshot', icon: '💾' },
        ],
        keyTakeaway:
          'Use git status and git diff before every commit. git log shows history, and git blame traces individual lines.',
      },
      {
        title: 'Undoing Things',
        content:
          'Everyone makes mistakes. Git provides several ways to undo changes depending on where the change lives.',
        comparison: {
          leftTitle: 'git reset',
          rightTitle: 'git revert',
          leftColor: 'amber',
          rightColor: 'emerald',
          items: [
            { left: 'Rewrites history (removes commits)', right: 'Adds a new undo commit' },
            { left: 'Safe on local/private branches', right: 'Safe on shared/public branches' },
            { left: 'Commit disappears from log', right: 'Original commit stays in log' },
            { left: 'Can lose work if careless', right: 'Never loses history' },
          ],
        },
        cards: [
          { title: 'git restore', description: 'Discard changes in working directory', icon: '↩️', color: 'blue' },
          { title: 'git restore --staged', description: 'Unstage a file (keep changes)', icon: '📤', color: 'purple' },
          { title: 'git reset --soft', description: 'Undo commit, keep changes staged', icon: '🔙', color: 'emerald' },
          { title: 'git revert', description: 'Create undo commit (safe for shared)', icon: '🔄', color: 'amber' },
        ],
        code: [
          {
            language: 'bash',
            label: 'Undo operations',
            code: `# Unstage a file (keep changes in working directory)\ngit restore --staged file.txt\n\n# Discard changes in working directory\ngit restore file.txt\n\n# Undo the last commit but keep changes staged\ngit reset --soft HEAD~1\n\n# Undo the last commit and unstage changes\ngit reset HEAD~1\n\n# Create a NEW commit that undoes a specific commit\n# (safe for shared branches)\ngit revert a1b2c3d`,
          },
        ],
        keyTakeaway:
          'Use git restore to discard local changes, git reset on private branches, and git revert on shared branches to safely undo commits.',
      },
    ],
    commonMistakes: [
      { mistake: 'Committing without reviewing changes first', explanation: 'Always run git status and git diff before committing. Accidental commits with debug code or secrets are common.' },
      { mistake: 'Writing vague commit messages like "fix" or "update"', explanation: 'Good messages explain WHY, not just what. "Fix login redirect for expired sessions" is far more useful than "fix bug".' },
      { mistake: 'Adding all files with git add . without checking', explanation: 'This can stage secrets (.env), large files, or build artifacts. Stage specific files or use .gitignore.' },
      { mistake: 'Using git reset --hard without thinking', explanation: 'This permanently discards uncommitted work. Use git stash if you might need the changes later.' },
    ],
    practiceQuestions: [
      'Explain the three areas in Git (working directory, staging, repository). How does a file move through them?',
      'What is the difference between git reset and git revert? When would you use each?',
      'Create a new repository, make three commits, then undo the last one using both reset and revert.',
      'Why is "git add ." risky? What safer alternatives exist?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What does git commit do?',
        options: ['Uploads changes to the remote repository', 'Saves staged changes to the local repository', 'Downloads changes from a remote', 'Moves files to the staging area'],
        answer: 'Saves staged changes to the local repository',
        explanation: 'git commit saves a snapshot of the currently staged changes to your local repository. To upload to a remote, you need git push.',
      },
      {
        type: 'mcq',
        question: 'Which command moves changes from the working directory to the staging area?',
        options: ['git commit', 'git push', 'git add', 'git stash'],
        answer: 'git add',
        explanation: 'git add stages changes from your working directory, preparing them for the next commit. git commit then saves those staged changes.',
      },
      {
        type: 'short-answer',
        question: 'What are the three areas in Git where files can live?',
        answer: 'Working directory, staging area, repository',
        explanation: 'Files move from the working directory (your edits) to the staging area (git add) to the repository (git commit). This two-step process gives you fine control over what goes into each commit.',
      },
      {
        type: 'mcq',
        question: 'What is the difference between git reset and git revert?',
        options: ['reset creates a new undo commit, revert removes commits', 'reset removes commits from history, revert creates a new undo commit', 'They are the same command with different syntax', 'reset works on remote, revert works locally'],
        answer: 'reset removes commits from history, revert creates a new undo commit',
        explanation: 'git reset rewrites history by removing commits (safe for private branches). git revert creates a new commit that undoes changes (safe for shared branches because history is preserved).',
      },
      {
        type: 'short-answer',
        question: 'What command shows unstaged line-level changes in your working directory?',
        answer: 'git diff',
        explanation: 'git diff compares your working directory against the staging area, showing exactly which lines have changed. Use git diff --staged to see changes already staged for the next commit.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 2. Branching & Merging
  // ───────────────────────────────────────────────
  'branching-and-merging': {
    steps: [
      {
        title: 'What are Branches?',
        content:
          'A branch is just a pointer to a commit. Creating a branch is instant because Git only creates a tiny file with the commit hash — it does not copy any files.',
        analogy:
          'Branches are like bookmarks in a book. The book (repository) stays the same, but you can have multiple bookmarks (branches) pointing to different pages (commits).',
        diagram:
          '         main\n          │\n  A ── B ── C\n          \\\n           D ── E\n               │\n            feature\n\n  • main points to commit C\n  • feature points to commit E\n  • HEAD points to whichever branch you\'re on\n  • Creating a branch = creating a new pointer',
        cards: [
          { title: 'Lightweight', description: 'A branch is just a 41-byte file (commit hash)', icon: '🪶', color: 'blue' },
          { title: 'Instant', description: 'Creating/switching branches takes milliseconds', icon: '⚡', color: 'emerald' },
          { title: 'Isolated', description: 'Changes on one branch do not affect others', icon: '🔒', color: 'purple' },
          { title: 'HEAD', description: 'Special pointer showing your current branch', icon: '👆', color: 'amber' },
        ],
        keyTakeaway:
          'Branches are lightweight pointers to commits. Creating and switching branches is nearly instant because no files are copied.',
      },
      {
        title: 'Creating and Switching Branches',
        content:
          'Every project starts with a main (or master) branch. Feature branches isolate your work so you can experiment without breaking main.',
        code: [
          {
            language: 'bash',
            label: 'Branch operations',
            code: `# List all branches (* = current)\ngit branch\n# * main\n\n# Create a new branch\ngit branch feature/login\n\n# Switch to it\ngit switch feature/login\n# (older syntax: git checkout feature/login)\n\n# Create and switch in one command\ngit switch -c feature/signup\n\n# See all branches with last commit\ngit branch -v\n\n# Delete a merged branch\ngit branch -d feature/login`,
          },
        ],
        bullets: [
          '**Naming convention** — use prefixes: feature/, bugfix/, hotfix/, chore/.',
          '**Keep branches short-lived** — merge within a few days to avoid large conflicts.',
          '**main should always work** — never commit broken code directly to main.',
        ],
        table: {
          headers: ['Prefix', 'Purpose', 'Example'],
          rows: [
            ['feature/', 'New functionality', 'feature/dark-mode'],
            ['bugfix/', 'Fix a bug', 'bugfix/login-redirect'],
            ['hotfix/', 'Urgent production fix', 'hotfix/security-patch'],
            ['chore/', 'Maintenance, deps', 'chore/update-deps'],
            ['docs/', 'Documentation changes', 'docs/api-guide'],
          ],
        },
        keyTakeaway:
          'Use git switch -c to create and switch branches in one command. Name branches descriptively with prefixes like feature/ or bugfix/.',
      },
      {
        title: 'Fast-Forward Merge',
        content:
          'When the target branch has not diverged (no new commits since you branched off), Git simply moves the pointer forward.',
        diagram:
          'Before merge:\n  main\n   │\n   A ── B\n         \\\n          C ── D\n              │\n           feature\n\nAfter fast-forward merge:\n   A ── B ── C ── D\n                  │\n            main, feature\n\n  No merge commit needed!\n  History stays linear.',
        code: [
          {
            language: 'bash',
            label: 'Fast-forward merge',
            code: `# Switch to main\ngit switch main\n\n# Merge feature branch\ngit merge feature/login\n# Fast-forward — no merge commit created\n\n# Delete the merged branch\ngit branch -d feature/login`,
          },
        ],
        comparison: {
          leftTitle: 'Fast-Forward',
          rightTitle: 'Three-Way Merge',
          leftColor: 'emerald',
          rightColor: 'blue',
          items: [
            { left: 'No divergence — just move pointer', right: 'Both branches have new commits' },
            { left: 'No merge commit', right: 'Creates a merge commit' },
            { left: 'Linear history', right: 'Shows branch history' },
            { left: 'Simple and clean', right: 'Can have conflicts' },
          ],
        },
        keyTakeaway:
          'Fast-forward merges happen when there is no divergence. The branch pointer simply moves forward — clean and linear history.',
      },
      {
        title: 'Three-Way Merge',
        content:
          'When both branches have new commits, Git performs a three-way merge. It compares the common ancestor, both branch tips, and creates a merge commit.',
        diagram:
          'Before merge:\n    main\n     │\n A ── B ── E\n      \\\n       C ── D\n            │\n         feature\n\nAfter three-way merge:\n A ── B ── E ── M  (merge commit)\n      \\       /\n       C ── D\n            │\n         feature\n\n  M has TWO parents: E and D\n  Git uses the common ancestor (B)\n  to determine what changed.',
        code: [
          {
            language: 'bash',
            label: 'Three-way merge',
            code: `# Switch to main\ngit switch main\n\n# Merge creates a merge commit\ngit merge feature/signup\n# Merge made by the 'ort' strategy.`,
          },
        ],
        bullets: [
          '**Common ancestor** — Git finds where branches diverged.',
          '**Three-way comparison** — ancestor vs main vs feature.',
          '**Merge commit** — has two parent commits.',
          '**Conflicts** — occur when both branches changed the same line.',
        ],
        keyTakeaway:
          'Three-way merges create a merge commit that ties both branches together. The history shows exactly when and where branches diverged and joined.',
      },
      {
        title: 'Resolving Merge Conflicts',
        content:
          'Conflicts happen when both branches changed the same line in the same file. Git cannot decide which change to keep, so it asks you.',
        diagram:
          'Conflict Markers in File:\n\n  ┌──────────────────────────────────┐\n  │  <<<<<<< HEAD                   │\n  │  <h1>Welcome Home</h1>         │  ← your branch\n  │  =======                        │  ← separator\n  │  <h1>Welcome to My Site</h1>   │  ← incoming branch\n  │  >>>>>>> feature/header         │\n  └──────────────────────────────────┘\n\n  Resolution:\n  ┌──────────────────────────────────┐\n  │  <h1>Welcome to My Site</h1>   │  ← keep what you want\n  └──────────────────────────────────┘',
        flow: [
          { label: 'git merge', description: 'Conflict detected', icon: '⚠️' },
          { label: 'Open File', description: 'Find conflict markers', icon: '📝' },
          { label: 'Edit', description: 'Choose correct code', icon: '✏️' },
          { label: 'git add', description: 'Mark as resolved', icon: '✅' },
          { label: 'git commit', description: 'Complete the merge', icon: '💾' },
        ],
        code: [
          {
            language: 'bash',
            label: 'Handling merge conflicts',
            code: `# Start the merge\ngit merge feature/header\n# CONFLICT (content): Merge conflict in index.html\n\n# The conflicted file shows:\n# <<<<<<< HEAD\n# <h1>Welcome Home</h1>\n# =======\n# <h1>Welcome to My Site</h1>\n# >>>>>>> feature/header\n\n# Edit the file — keep what you want:\n# <h1>Welcome to My Site</h1>\n\n# Mark as resolved and commit\ngit add index.html\ngit commit -m "Merge feature/header: update heading"`,
          },
        ],
        bullets: [
          '**<<<<<<< HEAD** marks your current branch\'s version.',
          '**=======** separates the two versions.',
          '**>>>>>>> feature** marks the incoming branch\'s version.',
          '**Edit the file** to keep the right code, then git add + git commit.',
        ],
        keyTakeaway:
          'Conflicts occur when both branches edit the same line. Open the file, choose the right code, remove the markers, then add and commit.',
      },
    ],
    commonMistakes: [
      { mistake: 'Working directly on main instead of a feature branch', explanation: 'This makes it hard to collaborate and impossible to code-review. Always branch off main for new work.' },
      { mistake: 'Keeping branches alive for weeks', explanation: 'Long-lived branches diverge significantly from main, causing painful merge conflicts. Merge within a few days.' },
      { mistake: 'Panicking during merge conflicts', explanation: 'Conflicts are normal and expected. Open the file, read the markers, choose the correct code, and commit. Use git merge --abort to cancel if needed.' },
      { mistake: 'Deleting branches before merging', explanation: 'Make sure the branch is merged (git branch -d checks this). Use -D (force delete) only when you are certain the work is not needed.' },
    ],
    practiceQuestions: [
      'What is the difference between a fast-forward merge and a three-way merge? Draw the commit graph for each.',
      'Create a feature branch, make commits on both main and the feature branch, then merge and resolve a conflict.',
      'Why are short-lived feature branches preferred over long-lived ones?',
      'Explain what the conflict markers (<<<, ===, >>>) mean and how to resolve them.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is a Git branch?',
        options: ['A copy of the entire repository', 'A lightweight pointer to a commit', 'A separate folder on disk', 'A remote server connection'],
        answer: 'A lightweight pointer to a commit',
        explanation: 'A branch is just a small file containing a commit hash (41 bytes). Creating a branch does not copy any files, which is why it is instant.',
      },
      {
        type: 'mcq',
        question: 'When does a fast-forward merge occur?',
        options: ['When both branches have new commits', 'When there are merge conflicts', 'When the target branch has no new commits since you branched off', 'When you use the --force flag'],
        answer: 'When the target branch has no new commits since you branched off',
        explanation: 'A fast-forward merge happens when there is no divergence — the branch pointer simply moves forward to the latest commit. No merge commit is needed.',
      },
      {
        type: 'short-answer',
        question: 'What command creates and switches to a new branch in one step?',
        answer: 'git switch -c',
        explanation: 'git switch -c <branch-name> creates a new branch and immediately switches to it. The older equivalent is git checkout -b <branch-name>.',
      },
      {
        type: 'mcq',
        question: 'What does the ======= marker represent in a merge conflict?',
        options: ['The end of the file', 'The separator between your changes and the incoming changes', 'A comment added by Git', 'The common ancestor version'],
        answer: 'The separator between your changes and the incoming changes',
        explanation: 'In a conflict, <<<<<<< HEAD marks your version, ======= separates the two versions, and >>>>>>> branch-name marks the incoming version. You edit the file to keep the correct code and remove all markers.',
      },
      {
        type: 'short-answer',
        question: 'How do you abort a merge that has conflicts you do not want to resolve yet?',
        answer: 'git merge --abort',
        explanation: 'git merge --abort cancels the merge and restores your branch to the state before the merge started. This is useful when you realize you are not ready to handle the conflicts.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 3. GitHub Workflows
  // ───────────────────────────────────────────────
  'github-workflows': {
    steps: [
      {
        title: 'Local vs Remote',
        content:
          'Git is distributed — every developer has a full copy of the repository. GitHub hosts a shared remote copy that everyone syncs with.',
        diagram:
          '┌──────────────┐     push      ┌──────────────┐     pull\n│  Your Laptop │ ───────────►  │    GitHub    │ ◄───────────\n│  (full repo) │ ◄─────────── │  (full repo) │ ────────────\n└──────────────┘     pull      └──────────────┘     push\n                                     ▲\n                                     │ pull/push\n                               ┌──────────────┐\n                               │  Teammate\'s  │\n                               │   Laptop     │\n                               └──────────────┘',
        comparison: {
          leftTitle: 'git fetch',
          rightTitle: 'git pull',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Downloads remote changes', right: 'Downloads AND merges' },
            { left: 'Does NOT modify your files', right: 'Updates your current branch' },
            { left: 'Safe — preview first', right: 'Convenient — one step' },
            { left: 'git fetch + git merge = git pull', right: 'Shortcut for fetch + merge' },
          ],
        },
        code: [
          {
            language: 'bash',
            label: 'Remote operations',
            code: `# Clone a remote repo\ngit clone https://github.com/user/repo.git\n\n# Push local commits to remote\ngit push origin main\n\n# Pull remote changes\ngit pull origin main\n\n# Fetch without merging (preview changes)\ngit fetch origin\ngit log origin/main --oneline`,
          },
        ],
        keyTakeaway:
          'git push sends your commits to the remote. git pull fetches and merges remote changes. git fetch downloads without merging.',
      },
      {
        title: 'Pull Requests (PRs)',
        content:
          'A pull request is a proposal to merge your branch into main. It is where code review, discussion, and automated checks happen before merging.',
        flow: [
          { label: 'Branch', description: 'Create feature branch', icon: '🌿' },
          { label: 'Commit', description: 'Make changes and push', icon: '📝' },
          { label: 'Open PR', description: 'Propose merge on GitHub', icon: '📋' },
          { label: 'Review', description: 'Teammates review code', icon: '👀' },
          { label: 'CI Checks', description: 'Automated tests run', icon: '🧪' },
          { label: 'Merge', description: 'Approved PR is merged', icon: '✅' },
        ],
        diagram:
          'PR Workflow:\n\n  feature/dark-mode\n  ┌─────────────────────────────┐\n  │  commit 1: Add toggle UI   │\n  │  commit 2: Add CSS vars    │\n  │  commit 3: Persist choice  │\n  └──────────────┬──────────────┘\n                 │\n                 ▼\n  ┌──────────────────────────────┐\n  │  Pull Request #42            │\n  │  Title: Add dark mode toggle │\n  │                              │\n  │  ✓ 2 approvals               │\n  │  ✓ CI tests passed           │\n  │  ✓ No conflicts              │\n  │                              │\n  │  [Merge Pull Request]        │\n  └──────────────────────────────┘\n                 │\n                 ▼\n            main branch',
        code: [
          {
            language: 'bash',
            label: 'PR workflow from terminal',
            code: `# Create branch and make changes\ngit switch -c feature/dark-mode\n# ... edit files ...\ngit add .\ngit commit -m "Add dark mode toggle to settings"\n\n# Push branch to remote\ngit push -u origin feature/dark-mode\n\n# Create PR using GitHub CLI\ngh pr create --title "Add dark mode toggle" \\\n  --body "Adds a toggle in settings to switch between light/dark themes"`,
          },
        ],
        keyTakeaway:
          'Pull requests are the standard way to propose changes. They enable code review, discussion, and automated testing before merging.',
      },
      {
        title: 'Code Review Best Practices',
        content:
          'Code review catches bugs, improves code quality, and spreads knowledge across the team.',
        comparison: {
          leftTitle: 'Bad Review Comments',
          rightTitle: 'Good Review Comments',
          leftColor: 'red',
          rightColor: 'emerald',
          items: [
            { left: '"This is wrong"', right: '"This might cause an issue because..." + suggestion' },
            { left: '"Why did you do it this way?"', right: '"Have you considered X? It would handle edge case Y"' },
            { left: 'Nitpicking formatting', right: 'Let the linter handle formatting' },
            { left: 'Approving without reading', right: 'Test locally, read every line' },
          ],
        },
        bullets: [
          '**Review promptly** — do not block teammates for days.',
          '**Focus on logic, not style** — use linters for formatting.',
          '**Explain the why** — "This could leak memory because..." not just "change this."',
          '**Approve with suggestions** — minor issues don\'t need to block merging.',
        ],
        cards: [
          { title: 'Correctness', description: 'Does the code do what it should?', icon: '✅', color: 'emerald' },
          { title: 'Security', description: 'SQL injection, XSS, auth bypasses?', icon: '🔒', color: 'red' },
          { title: 'Performance', description: 'N+1 queries, unnecessary re-renders?', icon: '⚡', color: 'amber' },
          { title: 'Readability', description: 'Clear names, small functions, comments?', icon: '📖', color: 'blue' },
        ],
        keyTakeaway:
          'Good code reviews are timely, specific, and kind. Focus on correctness and logic, not style preferences.',
      },
      {
        title: 'Issues and Project Management',
        content:
          'GitHub Issues track bugs, features, and tasks. Link issues to PRs so they close automatically when the PR is merged.',
        code: [
          {
            language: 'bash',
            label: 'Working with issues',
            code: `# Create an issue with GitHub CLI\ngh issue create --title "Fix login timeout" \\\n  --body "Users are logged out after 5 minutes instead of 7 days"\n\n# Reference issue in commit message\ngit commit -m "Fix session expiry to 7 days\n\nCloses #42"\n\n# List open issues\ngh issue list\n\n# View an issue\ngh issue view 42`,
          },
        ],
        bullets: [
          '**"Closes #42"** in a PR description auto-closes issue 42 when merged.',
          '**Labels** categorize issues: bug, enhancement, documentation, help-wanted.',
          '**Milestones** group issues by release or sprint.',
          '**Assignees** show who is responsible for each issue.',
        ],
        table: {
          headers: ['Keyword', 'Effect', 'Example'],
          rows: [
            ['Closes #N', 'Auto-closes issue on merge', 'Closes #42'],
            ['Fixes #N', 'Same as Closes', 'Fixes #15'],
            ['Resolves #N', 'Same as Closes', 'Resolves #7'],
            ['Refs #N', 'Links without closing', 'Refs #42'],
          ],
        },
        keyTakeaway:
          'Use issues to track work and link them to PRs with "Closes #N". This creates a clear audit trail from problem to solution.',
      },
      {
        title: 'Branch Protection Rules',
        content:
          'Branch protection prevents accidental pushes to main. Require PR reviews and passing CI checks before merging.',
        cards: [
          { title: 'Require PR Reviews', description: 'At least one approval before merge', icon: '👀', color: 'blue' },
          { title: 'Require CI Checks', description: 'Tests must pass before merge', icon: '🧪', color: 'emerald' },
          { title: 'No Force Push', description: 'Prevent history rewriting on main', icon: '🛡️', color: 'red' },
          { title: 'No Direct Push', description: 'All changes must go through PRs', icon: '🚫', color: 'amber' },
        ],
        flow: [
          { label: 'Push to Branch', description: 'Developer pushes feature', icon: '📤' },
          { label: 'Open PR', description: 'Propose merge to main', icon: '📋' },
          { label: 'CI Passes', description: 'Required checks green', icon: '✅' },
          { label: 'Review Approved', description: 'Teammate approves', icon: '👍' },
          { label: 'Merge', description: 'Now allowed to merge', icon: '🎉' },
        ],
        keyTakeaway:
          'Protect main with required reviews and CI checks. This ensures every change is reviewed and tested before reaching production.',
      },
    ],
    commonMistakes: [
      { mistake: 'Pushing directly to main', explanation: 'Direct pushes skip review and CI. Set up branch protection to require PRs for all changes to main.' },
      { mistake: 'Creating huge PRs with 1000+ lines', explanation: 'Large PRs are impossible to review thoroughly. Keep PRs small and focused on a single feature or fix.' },
      { mistake: 'Not linking issues to PRs', explanation: 'Without links, there is no trail from bug report to fix. Use "Closes #N" in PR descriptions.' },
      { mistake: 'Ignoring CI failures and merging anyway', explanation: 'Failing tests mean something is broken. Fix the issue instead of overriding the check.' },
    ],
    practiceQuestions: [
      'Describe the full PR workflow from creating a branch to merging.',
      'What is the difference between git fetch and git pull? When would you use each?',
      'Write a PR description for a feature that adds dark mode to a web app.',
      'What branch protection rules would you recommend for a team of 5 developers?',
      'Explain how "Closes #42" works in a PR description.',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What is the difference between git fetch and git pull?',
        options: ['fetch uploads, pull downloads', 'fetch downloads without merging, pull downloads and merges', 'They are identical commands', 'fetch works on branches, pull works on tags'],
        answer: 'fetch downloads without merging, pull downloads and merges',
        explanation: 'git fetch downloads remote changes but does not modify your working files. git pull is a shortcut for git fetch + git merge — it downloads and immediately merges into your current branch.',
      },
      {
        type: 'short-answer',
        question: 'What keyword in a PR description automatically closes a GitHub issue when the PR is merged?',
        answer: 'Closes',
        explanation: 'Using "Closes #N", "Fixes #N", or "Resolves #N" in a PR description automatically closes issue #N when the PR is merged into the default branch.',
      },
      {
        type: 'mcq',
        question: 'Which is NOT a benefit of branch protection rules?',
        options: ['Requiring PR reviews before merging', 'Preventing force pushes to main', 'Automatically fixing merge conflicts', 'Requiring CI checks to pass'],
        answer: 'Automatically fixing merge conflicts',
        explanation: 'Branch protection rules can require reviews, passing CI checks, and prevent force pushes, but they cannot automatically resolve merge conflicts. Developers must resolve conflicts manually.',
      },
      {
        type: 'mcq',
        question: 'Why should pull requests be kept small?',
        options: ['GitHub has a file limit per PR', 'Small PRs are easier to review thoroughly and catch bugs', 'Large PRs cannot be merged', 'Small PRs run faster in CI'],
        answer: 'Small PRs are easier to review thoroughly and catch bugs',
        explanation: 'Large PRs with 1000+ lines are nearly impossible to review properly. Reviewers tend to skim and miss bugs. Small, focused PRs get better feedback and faster approvals.',
      },
      {
        type: 'short-answer',
        question: 'What command pushes a local branch to a remote and sets up tracking?',
        answer: 'git push -u origin branch-name',
        explanation: 'git push -u (or --set-upstream) origin <branch-name> pushes the branch to the remote and sets up tracking, so future git push and git pull commands know which remote branch to use.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 4. Advanced Git
  // ───────────────────────────────────────────────
  'advanced-git': {
    steps: [
      {
        title: 'Rebase — Replaying Commits',
        content:
          'Rebase moves your branch\'s commits on top of another branch, creating a linear history. Unlike merge, it does not create a merge commit.',
        analogy:
          'Rebase is like cutting chapters from a book and pasting them at the end of a new edition. The content is the same, but the order is updated to fit the latest context.',
        diagram:
          'Before rebase:\n    main\n     │\n A ── B ── E\n      \\\n       C ── D\n            │\n         feature\n\nAfter rebase:\n A ── B ── E ── C\' ── D\'\n              │          │\n            main      feature\n\n  C\' and D\' are NEW commits\n  (same changes, new hashes)\n  History is now linear!',
        comparison: {
          leftTitle: 'Merge',
          rightTitle: 'Rebase',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Creates a merge commit', right: 'Moves commits to new base' },
            { left: 'Preserves branch history', right: 'Creates linear history' },
            { left: 'Safe for shared branches', right: 'Only use on private branches' },
            { left: 'Easy to understand', right: 'Cleaner git log' },
          ],
        },
        code: [
          {
            language: 'bash',
            label: 'Rebasing a feature branch',
            code: `# On feature branch — replay commits on top of main\ngit switch feature/login\ngit rebase main\n\n# If conflicts occur, resolve them then:\ngit add .\ngit rebase --continue\n\n# To abort a rebase:\ngit rebase --abort`,
          },
        ],
        keyTakeaway:
          'Rebase creates clean, linear history by replaying commits. Never rebase commits that have been pushed to a shared branch.',
      },
      {
        title: 'Interactive Rebase — Edit History',
        content:
          'Interactive rebase lets you squash, reorder, edit, or drop commits before sharing them. It is the most powerful history-editing tool in Git.',
        table: {
          headers: ['Command', 'Action', 'Use Case'],
          rows: [
            ['pick', 'Keep commit as-is', 'Default — no change'],
            ['squash', 'Combine with previous commit', 'Merge "fix typo" into parent'],
            ['reword', 'Edit commit message', 'Fix a typo in the message'],
            ['edit', 'Pause and amend', 'Split a commit or add changes'],
            ['drop', 'Remove the commit', 'Delete an accidental commit'],
          ],
        },
        diagram:
          'Interactive Rebase (squash):\n\n  Before:\n  pick   a1b2c3d  Add login form\n  pick   e4f5g6h  Fix typo in login\n  pick   i7j8k9l  Add validation\n\n  After (squash middle commit):\n  pick   a1b2c3d  Add login form\n  squash e4f5g6h  Fix typo in login  ← combined\n  pick   i7j8k9l  Add validation\n\n  Result:\n  x1y2z3a  Add login form (includes typo fix)\n  i7j8k9l  Add validation',
        code: [
          {
            language: 'bash',
            label: 'Interactive rebase',
            code: `# Edit the last 3 commits\ngit rebase -i HEAD~3\n\n# The editor opens with:\n# pick a1b2c3d Add login form\n# pick e4f5g6h Fix typo in login\n# pick i7j8k9l Add validation\n\n# Change to:\n# pick a1b2c3d Add login form\n# squash e4f5g6h Fix typo in login    <- combine with previous\n# pick i7j8k9l Add validation\n\n# Save and close — Git combines the two commits`,
          },
        ],
        keyTakeaway:
          'Interactive rebase cleans up messy commit history before pushing. Squash small fixes into their parent commits.',
      },
      {
        title: 'Cherry-Pick — Grab Specific Commits',
        content:
          'Cherry-pick copies a single commit from one branch to another. It is useful when you need one specific change without merging the entire branch.',
        diagram:
          'Cherry-pick commit D from feature to main:\n\n  Before:\n    main\n     │\n  A ── B ── C\n       \\\n        D ── E ── F\n                  │\n               feature\n\n  After git cherry-pick D:\n    main\n     │\n  A ── B ── C ── D\'\n       \\\n        D ── E ── F\n                  │\n               feature\n\n  D\' is a copy of D (new hash, same changes)',
        code: [
          {
            language: 'bash',
            label: 'Cherry-pick a commit',
            code: `# Find the commit hash\ngit log --oneline feature/payments\n# a1b2c3d Fix currency rounding bug\n# e4f5g6h Add Stripe integration\n\n# Copy just the bug fix to main\ngit switch main\ngit cherry-pick a1b2c3d\n\n# Cherry-pick multiple commits\ngit cherry-pick a1b2c3d e4f5g6h\n\n# Cherry-pick without committing (stage only)\ngit cherry-pick --no-commit a1b2c3d`,
          },
        ],
        bullets: [
          '**Hotfix use case** — apply a critical fix to main without merging the whole feature.',
          '**New hash** — the cherry-picked commit gets a new hash (it is a copy).',
          '**Conflicts possible** — resolve them just like merge conflicts.',
          '**Use sparingly** — frequent cherry-picking creates duplicate commits.',
        ],
        keyTakeaway:
          'Cherry-pick copies individual commits across branches. Use it for hotfixes that need to land on main before the full feature is ready.',
      },
      {
        title: 'Stash — Shelve Work in Progress',
        content:
          'Stash temporarily saves uncommitted changes so you can switch branches with a clean working directory. Pop them back when you return.',
        analogy:
          'Stash is like putting your half-finished puzzle in a box so you can use the table for something else. When you are ready, you take the box out and continue where you left off.',
        flow: [
          { label: 'Working on Feature', description: 'Uncommitted changes', icon: '✏️' },
          { label: 'git stash', description: 'Save changes aside', icon: '📦' },
          { label: 'Switch Branch', description: 'Handle urgent task', icon: '🔀' },
          { label: 'git stash pop', description: 'Restore changes', icon: '📤' },
        ],
        code: [
          {
            language: 'bash',
            label: 'Stash operations',
            code: `# Save current changes\ngit stash\n\n# Save with a description\ngit stash push -m "WIP: login form styling"\n\n# List all stashes\ngit stash list\n# stash@{0}: WIP: login form styling\n# stash@{1}: On main: debug experiment\n\n# Restore the latest stash\ngit stash pop\n\n# Restore a specific stash\ngit stash apply stash@{1}\n\n# Delete a stash\ngit stash drop stash@{1}`,
          },
        ],
        keyTakeaway:
          'git stash saves uncommitted work temporarily. Use it when you need to switch branches quickly without committing half-done work.',
      },
      {
        title: 'Reflog — Your Safety Net',
        content:
          'The reflog records every time HEAD moves — every commit, checkout, rebase, and reset. Even "lost" commits can be recovered.',
        diagram:
          'Reflog — Git\'s flight recorder:\n\n  Action                    HEAD points to\n  ─────────────────────────────────────────\n  git commit "Add auth"     a1b2c3d  HEAD@{0}\n  git commit "Add login"    e4f5g6h  HEAD@{1}\n  git reset --hard HEAD~2   i7j8k9l  HEAD@{2}\n\n  "Lost" commits a1b2c3d and e4f5g6h\n  are still in the reflog!\n\n  Recovery:\n  git reset --hard a1b2c3d  ← back to normal\n  git branch recovered a1b2c3d  ← or save to branch',
        code: [
          {
            language: 'bash',
            label: 'Recovering with reflog',
            code: `# View the reflog\ngit reflog\n# a1b2c3d HEAD@{0}: reset: moving to HEAD~3\n# e4f5g6h HEAD@{1}: commit: Add payment processing\n# i7j8k9l HEAD@{2}: commit: Add checkout page\n\n# Oops! I reset too far. Recover the lost commit:\ngit reset --hard e4f5g6h\n\n# Or create a branch at the lost commit:\ngit branch recovered e4f5g6h`,
          },
        ],
        bullets: [
          '**Reflog is local only** — it tracks YOUR actions, not the team\'s.',
          '**Entries expire** after 90 days (30 for unreachable commits).',
          '**It records everything** — commits, checkouts, rebases, resets, merges.',
          '**Your safety net** — even after a bad reset, the commit is in the reflog.',
        ],
        keyTakeaway:
          'The reflog is your undo history for Git itself. If you lose commits after a reset or rebase, git reflog shows where they went.',
      },
    ],
    commonMistakes: [
      { mistake: 'Rebasing commits that have been pushed to a shared branch', explanation: 'Rebase rewrites commit hashes. If others have based work on those commits, their history diverges. Only rebase local/private branches.' },
      { mistake: 'Force-pushing without --force-with-lease', explanation: '--force overwrites the remote blindly. --force-with-lease checks that no one else pushed in the meantime, preventing data loss.' },
      { mistake: 'Forgetting about stashed changes', explanation: 'Stashes are easy to forget. Use descriptive messages and check git stash list regularly.' },
      { mistake: 'Not knowing about reflog when things go wrong', explanation: 'Many developers panic and re-clone when they lose commits. The reflog almost always has the answer.' },
    ],
    practiceQuestions: [
      'Explain the difference between merge and rebase. When should you use each?',
      'You have 5 commits on a feature branch. Squash the last 3 into one using interactive rebase.',
      'How would you recover a commit after accidentally running git reset --hard?',
      'Describe a scenario where cherry-pick is more appropriate than merging.',
      'What does git push --force-with-lease do differently than git push --force?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'What does git rebase do?',
        options: ['Creates a merge commit combining two branches', 'Replays your commits on top of another branch for linear history', 'Deletes commits from the history permanently', 'Copies files from one branch to another'],
        answer: 'Replays your commits on top of another branch for linear history',
        explanation: 'Rebase takes your commits and re-applies them on top of the target branch. This creates a clean, linear history without merge commits. The rebased commits get new hashes.',
      },
      {
        type: 'short-answer',
        question: 'What command temporarily saves uncommitted changes so you can switch branches?',
        answer: 'git stash',
        explanation: 'git stash saves your uncommitted changes (both staged and unstaged) to a stack. Use git stash pop to restore them later. You can add a message with git stash push -m "description".',
      },
      {
        type: 'mcq',
        question: 'Why should you never rebase commits that have been pushed to a shared branch?',
        options: ['Rebase deletes the branch', 'Rebase changes commit hashes, causing divergent history for others', 'Rebase is slower than merge', 'Rebase does not work on remote branches'],
        answer: 'Rebase changes commit hashes, causing divergent history for others',
        explanation: 'Rebase creates new commits with new hashes. If others have based work on the original commits, their history will diverge from the rewritten history, causing confusion and conflicts.',
      },
      {
        type: 'mcq',
        question: 'What does git cherry-pick do?',
        options: ['Merges an entire branch', 'Copies a specific commit from one branch to another', 'Deletes a commit from history', 'Creates a new branch from a commit'],
        answer: 'Copies a specific commit from one branch to another',
        explanation: 'Cherry-pick copies a single commit (creating a new commit with a new hash but the same changes) to your current branch. It is useful for applying hotfixes without merging an entire feature branch.',
      },
      {
        type: 'short-answer',
        question: 'How can you recover a commit that was lost after an accidental git reset --hard?',
        answer: 'git reflog',
        explanation: 'git reflog shows every time HEAD moved, including commits that are no longer reachable. Find the lost commit hash in the reflog and use git reset --hard <hash> or git branch recovered <hash> to restore it.',
      },
    ],
  },

  // ───────────────────────────────────────────────
  // 5. Team Collaboration
  // ───────────────────────────────────────────────
  'team-collaboration': {
    steps: [
      {
        title: 'Branching Strategies',
        content:
          'Teams need a shared agreement on how branches are used. The right strategy depends on team size, release cadence, and project complexity.',
        comparison: {
          leftTitle: 'Git Flow',
          rightTitle: 'GitHub Flow',
          leftColor: 'purple',
          rightColor: 'blue',
          items: [
            { left: 'main + develop + feature + release + hotfix', right: 'main + feature branches only' },
            { left: 'Scheduled releases', right: 'Deploy on every merge to main' },
            { left: 'Complex, many long-lived branches', right: 'Simple, short-lived branches' },
            { left: 'Enterprise / mobile apps', right: 'Web apps with continuous deployment' },
          ],
        },
        cards: [
          { title: 'Git Flow', description: 'Feature > develop > release > main. Best for versioned releases', icon: '🔀', color: 'purple' },
          { title: 'GitHub Flow', description: 'Feature > main via PR. Best for continuous deployment', icon: '🚀', color: 'blue' },
          { title: 'Trunk-Based', description: 'Everyone commits to main with feature flags. Fastest iteration', icon: '🌳', color: 'emerald' },
        ],
        diagram:
          'GitHub Flow (recommended for most teams):\n\n  main ──●────●────●────●────●────●──── (always deployable)\n          \\       /  \\       /\n           ●──●──    ●──●──\n          feature/A  feature/B\n\n  Git Flow (complex releases):\n  main ────────●─────────────●────── (releases only)\n               ▲             ▲\n  release ─────●             │\n               ▲             │\n  develop ──●──●──●──●──●──●─●──── (integration)\n             \\  / \\  /\n              ●●   ●●\n            feat  feat',
        keyTakeaway:
          'GitHub Flow (feature branches + PRs to main) is the simplest and best choice for most web teams. Use Git Flow only for complex release schedules.',
      },
      {
        title: 'Conventional Commits',
        content:
          'A commit message convention makes history readable and enables automatic changelog generation. The format is: type(scope): description.',
        table: {
          headers: ['Type', 'When to Use', 'Bumps Version'],
          rows: [
            ['feat', 'New feature', 'Minor (1.X.0)'],
            ['fix', 'Bug fix', 'Patch (1.0.X)'],
            ['docs', 'Documentation only', 'None'],
            ['refactor', 'Code change, no behavior change', 'None'],
            ['test', 'Adding or fixing tests', 'None'],
            ['chore', 'Build, deps, CI changes', 'None'],
          ],
        },
        code: [
          {
            language: 'bash',
            label: 'Conventional commit examples',
            code: `# Types: feat, fix, docs, style, refactor, test, chore\n\ngit commit -m "feat(auth): add Google OAuth login"\ngit commit -m "fix(api): handle null response from payment gateway"\ngit commit -m "docs(readme): add setup instructions for Docker"\ngit commit -m "refactor(db): extract query builder to shared utility"\ngit commit -m "test(auth): add tests for token refresh flow"\ngit commit -m "chore(deps): update React to v19"`,
          },
        ],
        diagram:
          'Conventional Commit Format:\n\n  type(scope): description\n  │    │       │\n  │    │       └── What you did (imperative mood)\n  │    └────────── What part of the app (optional)\n  └─────────────── What kind of change\n\n  Examples:\n  feat(auth): add Google OAuth login\n  fix(api): handle null response from payment gateway\n  docs(readme): add Docker setup instructions\n\n  Breaking change:\n  feat(api)!: change user response shape\n  BREAKING CHANGE: user.name is now user.fullName',
        keyTakeaway:
          'Conventional commits (feat, fix, docs, refactor) create a readable history and enable automated versioning and changelogs.',
      },
      {
        title: 'Git Hooks — Automate Checks',
        content:
          'Git hooks are scripts that run automatically at certain points in the Git workflow. They enforce quality gates before code reaches the remote.',
        flow: [
          { label: 'git commit', description: 'Developer runs commit', icon: '📝' },
          { label: 'pre-commit', description: 'Lint & format staged files', icon: '🔍' },
          { label: 'commit-msg', description: 'Validate message format', icon: '✅' },
          { label: 'Commit Created', description: 'Only if hooks pass', icon: '💾' },
        ],
        code: [
          {
            language: 'bash',
            label: 'Setting up hooks with Husky',
            code: `# Install Husky\nnpm install -D husky\nnpx husky init\n\n# Pre-commit: lint staged files\necho "npx lint-staged" > .husky/pre-commit\n\n# Commit-msg: enforce conventional commits\nnpm install -D @commitlint/cli @commitlint/config-conventional\necho "npx commitlint --edit \\$1" > .husky/commit-msg\n\n# lint-staged config in package.json:\n# "lint-staged": {\n#   "*.{ts,tsx}": ["eslint --fix", "prettier --write"]\n# }`,
          },
        ],
        table: {
          headers: ['Hook', 'When It Runs', 'Common Use'],
          rows: [
            ['pre-commit', 'Before commit is created', 'Lint, format, run tests'],
            ['commit-msg', 'After message is written', 'Validate conventional format'],
            ['pre-push', 'Before push to remote', 'Run full test suite'],
            ['post-merge', 'After a merge completes', 'npm install if lockfile changed'],
          ],
        },
        keyTakeaway:
          'Git hooks with Husky and lint-staged automatically lint, format, and validate commits before they are created.',
      },
      {
        title: 'CI/CD Integration',
        content:
          'Continuous Integration (CI) runs automated tests on every push. Continuous Deployment (CD) deploys automatically when tests pass on main.',
        diagram:
          'CI/CD Pipeline:\n\n  Developer          GitHub            CI Server        Production\n     │                 │                  │                 │\n     ├──push──────────►│                  │                 │\n     │                 ├──webhook────────►│                 │\n     │                 │                  ├──npm install    │\n     │                 │                  ├──npm run lint   │\n     │                 │                  ├──npm test       │\n     │                 │                  ├──npm run build  │\n     │                 │                  │                 │\n     │                 │◄──status: pass──┤                 │\n     │                 │                  │                 │\n     │              [merge PR]            │                 │\n     │                 │                  │                 │\n     │                 ├──webhook────────►│                 │\n     │                 │                  ├──build docker──►│\n     │                 │                  │   deploy        │\n     │                 │                  │                 │',
        code: [
          {
            language: 'yaml',
            label: 'GitHub Actions CI workflow',
            code: `# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test\n      - run: npm run build`,
          },
        ],
        bullets: [
          '**On every PR** — run lint, tests, and build to catch issues early.',
          '**On merge to main** — deploy automatically to staging or production.',
          '**Required checks** — make CI pass a requirement for merging PRs.',
          '**Cache dependencies** — speed up CI by caching node_modules.',
        ],
        keyTakeaway:
          'CI/CD ensures every change is tested automatically. Make passing checks a requirement for merging PRs to main.',
      },
      {
        title: 'The Fork-and-PR Model',
        content:
          'Open source projects use forks so external contributors can propose changes without having write access to the original repository.',
        comparison: {
          leftTitle: 'Fork',
          rightTitle: 'Clone',
          leftColor: 'blue',
          rightColor: 'purple',
          items: [
            { left: 'Creates a copy on YOUR GitHub', right: 'Downloads to your local machine' },
            { left: 'You own the fork (can push)', right: 'Need write access to push' },
            { left: 'For contributing to others\' repos', right: 'For working on your own repos' },
            { left: 'Stays linked to original (upstream)', right: 'Independent local copy' },
          ],
        },
        flow: [
          { label: 'Fork', description: 'Copy repo to your account', icon: '🍴' },
          { label: 'Clone', description: 'Clone your fork locally', icon: '📥' },
          { label: 'Branch', description: 'Create feature branch', icon: '🌿' },
          { label: 'Push', description: 'Push to your fork', icon: '📤' },
          { label: 'PR', description: 'Open PR to original repo', icon: '📋' },
          { label: 'Review', description: 'Maintainer reviews + merges', icon: '✅' },
        ],
        code: [
          {
            language: 'bash',
            label: 'Fork workflow',
            code: `# Fork on GitHub, then clone your fork\ngit clone https://github.com/YOUR-USER/project.git\ncd project\n\n# Add the original repo as upstream\ngit remote add upstream https://github.com/ORIGINAL/project.git\n\n# Keep your fork in sync\ngit fetch upstream\ngit rebase upstream/main\n\n# Push and open a PR\ngit push origin feature/my-fix`,
          },
        ],
        keyTakeaway:
          'Fork the repo, branch, push to your fork, and open a PR to the original. Keep your fork synced with upstream using git fetch + rebase.',
      },
    ],
    commonMistakes: [
      { mistake: 'Not agreeing on a branching strategy', explanation: 'Without a shared convention, developers create conflicting branch structures. Agree on GitHub Flow or another strategy and document it.' },
      { mistake: 'Skipping CI checks by merging without waiting', explanation: 'Merging before CI finishes often introduces broken code to main. Require status checks on protected branches.' },
      { mistake: 'Not keeping forks in sync with upstream', explanation: 'Stale forks cause massive merge conflicts. Regularly fetch and rebase from upstream.' },
      { mistake: 'Committing large generated files to the repository', explanation: 'node_modules, build output, and binary files bloat the repo. Use .gitignore to exclude them.' },
    ],
    practiceQuestions: [
      'Compare Git Flow, GitHub Flow, and trunk-based development. Which would you choose for a small startup?',
      'Set up Husky with a pre-commit hook that runs ESLint on staged files.',
      'Write a GitHub Actions workflow that runs tests on every pull request.',
      'Walk through the complete fork-and-PR workflow for contributing to an open source project.',
      'What is the purpose of conventional commits? How do they enable automated releases?',
    ],
    quiz: [
      {
        type: 'mcq',
        question: 'Which branching strategy is recommended for most web teams with continuous deployment?',
        options: ['Git Flow', 'GitHub Flow', 'Trunk-Based Development', 'Release Branching'],
        answer: 'GitHub Flow',
        explanation: 'GitHub Flow uses short-lived feature branches merged to main via PRs. It is simple and works well for web apps that deploy on every merge. Git Flow is better for complex release schedules.',
      },
      {
        type: 'short-answer',
        question: 'In the conventional commits format, what type prefix indicates a new feature?',
        answer: 'feat',
        explanation: 'The "feat" prefix marks a new feature (e.g., "feat(auth): add Google OAuth login"). Other common types include fix, docs, refactor, test, and chore.',
      },
      {
        type: 'mcq',
        question: 'What does the pre-commit Git hook do?',
        options: ['Runs after a commit is created', 'Runs before a commit is created, allowing you to lint and format code', 'Runs when you push to a remote', 'Runs when you create a new branch'],
        answer: 'Runs before a commit is created, allowing you to lint and format code',
        explanation: 'The pre-commit hook runs before Git creates the commit. If the hook script exits with a non-zero status, the commit is aborted. Teams commonly use it to run linters and formatters on staged files.',
      },
      {
        type: 'mcq',
        question: 'What is the difference between a fork and a clone?',
        options: ['A fork is local, a clone is remote', 'A fork creates a copy on your GitHub account, a clone downloads to your machine', 'They are the same thing', 'A clone creates a copy on GitHub, a fork downloads locally'],
        answer: 'A fork creates a copy on your GitHub account, a clone downloads to your machine',
        explanation: 'Forking copies the repository to your own GitHub account (you have push access). Cloning downloads a repository to your local machine. For open source contributions, you fork first, then clone your fork.',
      },
      {
        type: 'short-answer',
        question: 'How do you keep a forked repository in sync with the original upstream repository?',
        answer: 'git fetch upstream && git rebase upstream/main',
        explanation: 'Add the original repo as a remote called "upstream" (git remote add upstream URL), then regularly fetch and rebase from it. This keeps your fork up to date and avoids large merge conflicts.',
      },
    ],
  },
};
