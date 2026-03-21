import type { LessonStep } from '@/lib/learn-data';

export const gitLessons: Record<
  string,
  {
    steps: LessonStep[];
    commonMistakes?: { mistake: string; explanation: string }[];
    practiceQuestions?: string[];
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
        keyTakeaway:
          'Git is a distributed version control system that tracks every change as a snapshot, enabling collaboration and safe experimentation.',
      },
      {
        title: 'The Three Areas',
        content:
          'Git has three areas where your files live. Understanding these is the key to understanding every Git command.',
        diagram:
          'Working Directory     Staging Area        Repository\n  (your files)       (next commit)      (commit history)\n       │                   │                   │\n       │── git add ──────► │                   │\n       │                   │── git commit ───► │\n       │                   │                   │\n       │◄── git checkout ──────────────────────│\n       │                   │                   │',
        bullets: [
          '**Working Directory** — the files you see and edit in your editor.',
          '**Staging Area (Index)** — a holding area for changes you want in the next commit.',
          '**Repository (.git)** — the permanent history of all committed snapshots.',
        ],
        keyTakeaway:
          'git add moves changes from working directory to staging. git commit saves staged changes to the repository. This two-step process gives you fine control.',
      },
      {
        title: 'Your First Commits',
        content:
          'A commit is a snapshot of your staged changes with a message explaining what you did. Each commit has a unique hash (like a fingerprint).',
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
        code: [
          {
            language: 'bash',
            label: 'Inspecting changes',
            code: `# See which files have changed\ngit status\n\n# See unstaged changes (working dir vs staging)\ngit diff\n\n# See staged changes (staging vs last commit)\ngit diff --staged\n\n# See the full history\ngit log --oneline --graph --all\n\n# See what changed in a specific commit\ngit show a1b2c3d\n\n# See who changed each line of a file\ngit blame index.html`,
          },
        ],
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
        keyTakeaway:
          'Use git status and git diff before every commit. git log shows history, and git blame traces individual lines.',
      },
      {
        title: 'Undoing Things',
        content:
          'Everyone makes mistakes. Git provides several ways to undo changes depending on where the change lives.',
        code: [
          {
            language: 'bash',
            label: 'Undo operations',
            code: `# Unstage a file (keep changes in working directory)\ngit restore --staged file.txt\n\n# Discard changes in working directory\ngit restore file.txt\n\n# Undo the last commit but keep changes staged\ngit reset --soft HEAD~1\n\n# Undo the last commit and unstage changes\ngit reset HEAD~1\n\n# Create a NEW commit that undoes a specific commit\n# (safe for shared branches)\ngit revert a1b2c3d`,
          },
        ],
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
          'Branches are like bookmarks in a book. The book (repository) stays the same, but you can have multiple bookmarks (branches) pointing to different pages (commits). Moving a bookmark is instant and free.',
        diagram:
          '         main\n          │\n  A ── B ── C\n          \\\n           D ── E\n               │\n            feature',
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
        keyTakeaway:
          'Use git switch -c to create and switch branches in one command. Name branches descriptively with prefixes like feature/ or bugfix/.',
      },
      {
        title: 'Fast-Forward Merge',
        content:
          'When the target branch has not diverged (no new commits since you branched off), Git simply moves the pointer forward. This is called a fast-forward merge.',
        diagram:
          'Before merge:\n  main\n   │\n   A ── B\n         \\\n          C ── D\n              │\n           feature\n\nAfter fast-forward merge:\n   A ── B ── C ── D\n                  │\n            main, feature',
        code: [
          {
            language: 'bash',
            label: 'Fast-forward merge',
            code: `# Switch to main\ngit switch main\n\n# Merge feature branch\ngit merge feature/login\n# Fast-forward — no merge commit created\n\n# Delete the merged branch\ngit branch -d feature/login`,
          },
        ],
        keyTakeaway:
          'Fast-forward merges happen when there is no divergence. The branch pointer simply moves forward — clean and linear history.',
      },
      {
        title: 'Three-Way Merge',
        content:
          'When both branches have new commits, Git performs a three-way merge. It compares the common ancestor, both branch tips, and creates a merge commit.',
        diagram:
          'Before merge:\n    main\n     │\n A ── B ── E\n      \\\n       C ── D\n            │\n         feature\n\nAfter three-way merge:\n A ── B ── E ── M  (merge commit)\n      \\       /\n       C ── D\n            │\n         feature',
        code: [
          {
            language: 'bash',
            label: 'Three-way merge',
            code: `# Switch to main\ngit switch main\n\n# Merge creates a merge commit\ngit merge feature/signup\n# Merge made by the 'ort' strategy.`,
          },
        ],
        keyTakeaway:
          'Three-way merges create a merge commit that ties both branches together. The history shows exactly when and where branches diverged and joined.',
      },
      {
        title: 'Resolving Merge Conflicts',
        content:
          'Conflicts happen when both branches changed the same line in the same file. Git cannot decide which change to keep, so it asks you.',
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
  },

  // ───────────────────────────────────────────────
  // 3. GitHub Workflows
  // ───────────────────────────────────────────────
  'github-workflows': {
    steps: [
      {
        title: 'Local vs Remote',
        content:
          'Git is distributed — every developer has a full copy of the repository. GitHub (or GitLab/Bitbucket) hosts a shared remote copy that everyone syncs with.',
        diagram:
          '┌──────────────┐     push      ┌──────────────┐     pull\n│  Your Laptop │ ───────────►  │    GitHub    │ ◄───────────\n│  (full repo) │ ◄─────────── │  (full repo) │ ────────────\n└──────────────┘     pull      └──────────────┘     push\n                                     ▲\n                                     │ pull/push\n                               ┌──────────────┐\n                               │  Teammate\'s  │\n                               │   Laptop     │\n                               └──────────────┘',
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
          'Code review catches bugs, improves code quality, and spreads knowledge across the team. Good reviews are respectful, specific, and constructive.',
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
          'Before rebase:\n    main\n     │\n A ── B ── E\n      \\\n       C ── D\n            │\n         feature\n\nAfter rebase:\n A ── B ── E ── C\' ── D\'\n              │          │\n            main      feature',
        code: [
          {
            language: 'bash',
            label: 'Rebasing a feature branch',
            code: `# On feature branch — replay commits on top of main\ngit switch feature/login\ngit rebase main\n\n# If conflicts occur, resolve them then:\ngit add .\ngit rebase --continue\n\n# To abort a rebase:\ngit rebase --abort`,
          },
        ],
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
        keyTakeaway:
          'Rebase creates clean, linear history by replaying commits. Never rebase commits that have been pushed to a shared branch.',
      },
      {
        title: 'Interactive Rebase — Edit History',
        content:
          'Interactive rebase lets you squash, reorder, edit, or drop commits before sharing them. It is the most powerful history-editing tool in Git.',
        code: [
          {
            language: 'bash',
            label: 'Interactive rebase',
            code: `# Edit the last 3 commits\ngit rebase -i HEAD~3\n\n# The editor opens with:\n# pick a1b2c3d Add login form\n# pick e4f5g6h Fix typo in login\n# pick i7j8k9l Add validation\n\n# Change to:\n# pick a1b2c3d Add login form\n# squash e4f5g6h Fix typo in login    <- combine with previous\n# pick i7j8k9l Add validation\n\n# Save and close — Git combines the two commits`,
          },
        ],
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
        keyTakeaway:
          'Interactive rebase cleans up messy commit history before pushing. Squash small fixes into their parent commits.',
      },
      {
        title: 'Cherry-Pick — Grab Specific Commits',
        content:
          'Cherry-pick copies a single commit from one branch to another. It is useful when you need one specific change without merging the entire branch.',
        code: [
          {
            language: 'bash',
            label: 'Cherry-pick a commit',
            code: `# Find the commit hash\ngit log --oneline feature/payments\n# a1b2c3d Fix currency rounding bug\n# e4f5g6h Add Stripe integration\n\n# Copy just the bug fix to main\ngit switch main\ngit cherry-pick a1b2c3d\n\n# Cherry-pick multiple commits\ngit cherry-pick a1b2c3d e4f5g6h\n\n# Cherry-pick without committing (stage only)\ngit cherry-pick --no-commit a1b2c3d`,
          },
        ],
        keyTakeaway:
          'Cherry-pick copies individual commits across branches. Use it for hotfixes that need to land on main before the full feature is ready.',
      },
      {
        title: 'Stash — Shelve Work in Progress',
        content:
          'Stash temporarily saves uncommitted changes so you can switch branches with a clean working directory. Pop them back when you return.',
        code: [
          {
            language: 'bash',
            label: 'Stash operations',
            code: `# Save current changes\ngit stash\n\n# Save with a description\ngit stash push -m "WIP: login form styling"\n\n# List all stashes\ngit stash list\n# stash@{0}: WIP: login form styling\n# stash@{1}: On main: debug experiment\n\n# Restore the latest stash\ngit stash pop\n\n# Restore a specific stash\ngit stash apply stash@{1}\n\n# Delete a stash\ngit stash drop stash@{1}`,
          },
        ],
        analogy:
          'Stash is like putting your half-finished puzzle in a box so you can use the table for something else. When you are ready, you take the box out and continue where you left off.',
        keyTakeaway:
          'git stash saves uncommitted work temporarily. Use it when you need to switch branches quickly without committing half-done work.',
      },
      {
        title: 'Reflog — Your Safety Net',
        content:
          'The reflog records every time HEAD moves — every commit, checkout, rebase, and reset. Even "lost" commits can be recovered from the reflog.',
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
          { title: 'Git Flow', description: 'Feature → develop → release → main. Best for versioned releases', icon: '🔀', color: 'purple' },
          { title: 'GitHub Flow', description: 'Feature → main via PR. Best for continuous deployment', icon: '🚀', color: 'blue' },
          { title: 'Trunk-Based', description: 'Everyone commits to main with feature flags. Fastest iteration', icon: '🌳', color: 'emerald' },
        ],
        keyTakeaway:
          'GitHub Flow (feature branches + PRs to main) is the simplest and best choice for most web teams. Use Git Flow only for complex release schedules.',
      },
      {
        title: 'Conventional Commits',
        content:
          'A commit message convention makes history readable and enables automatic changelog generation. The format is: type(scope): description.',
        code: [
          {
            language: 'bash',
            label: 'Conventional commit examples',
            code: `# Types: feat, fix, docs, style, refactor, test, chore\n\ngit commit -m "feat(auth): add Google OAuth login"\ngit commit -m "fix(api): handle null response from payment gateway"\ngit commit -m "docs(readme): add setup instructions for Docker"\ngit commit -m "refactor(db): extract query builder to shared utility"\ngit commit -m "test(auth): add tests for token refresh flow"\ngit commit -m "chore(deps): update React to v19"`,
          },
        ],
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
        keyTakeaway:
          'Conventional commits (feat, fix, docs, refactor) create a readable history and enable automated versioning and changelogs.',
      },
      {
        title: 'Git Hooks — Automate Checks',
        content:
          'Git hooks are scripts that run automatically at certain points in the Git workflow. They enforce quality gates before code reaches the remote.',
        code: [
          {
            language: 'bash',
            label: 'Setting up hooks with Husky',
            code: `# Install Husky\nnpm install -D husky\nnpx husky init\n\n# Pre-commit: lint staged files\necho "npx lint-staged" > .husky/pre-commit\n\n# Commit-msg: enforce conventional commits\nnpm install -D @commitlint/cli @commitlint/config-conventional\necho "npx commitlint --edit \\$1" > .husky/commit-msg\n\n# lint-staged config in package.json:\n# "lint-staged": {\n#   "*.{ts,tsx}": ["eslint --fix", "prettier --write"]\n# }`,
          },
        ],
        flow: [
          { label: 'git commit', description: 'Developer runs commit', icon: '📝' },
          { label: 'pre-commit', description: 'Lint & format staged files', icon: '🔍' },
          { label: 'commit-msg', description: 'Validate message format', icon: '✅' },
          { label: 'Commit Created', description: 'Only if hooks pass', icon: '💾' },
        ],
        keyTakeaway:
          'Git hooks with Husky and lint-staged automatically lint, format, and validate commits before they are created.',
      },
      {
        title: 'CI/CD Integration',
        content:
          'Continuous Integration (CI) runs automated tests on every push. Continuous Deployment (CD) deploys automatically when tests pass on main.',
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
  },
};
