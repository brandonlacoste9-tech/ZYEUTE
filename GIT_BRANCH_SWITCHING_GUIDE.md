# Git Branch Switching Guide

## Problem: Commits Not Going to Main Branch

### Scenario
You tried to commit changes with the message "Fix black screen" and push to `main`, but the push was rejected because you were on a different branch (e.g., `copilot/fix-lint-errors-and-warnings` or another feature branch).

### Error Messages You Might See
- "Updates were rejected because the tip of your current branch is behind"
- "non-fast-forward"
- "You are not currently on a branch"

## Solution: Switch to Main Branch Properly

### Step 1: Check Your Current Branch
First, verify which branch you're currently on:
```bash
git branch
# or
git status
```

This will show you the current branch with an asterisk (*).

### Step 2: Stash or Commit Your Changes (If Any)
If you have uncommitted changes, you have two options:

**Option A: Commit your changes on the current branch**
```bash
git add .
git commit -m "Your commit message"
```

**Option B: Stash your changes temporarily**
```bash
git stash push -m "Work in progress"
```

### Step 3: Switch to Main Branch
Now switch to the main branch:
```bash
git checkout main
```

If the main branch doesn't exist locally yet, fetch it from remote:
```bash
git fetch origin main:main
git checkout main
```

Or create a tracking branch:
```bash
git checkout -b main origin/main
```

### Step 4: Update Main Branch
Make sure your local main branch is up to date with the remote:
```bash
git pull origin main
```

### Step 5: Apply Your Changes (If Stashed)
If you stashed changes in Step 2, apply them now:
```bash
git stash pop
```

### Step 6: Commit Your Changes on Main
Add and commit your changes on the main branch:
```bash
git add .
git commit -m "Fix black screen"
```

### Step 7: Push to Main
Finally, push your changes to the remote main branch:
```bash
git push origin main
```

## Alternative: Merge Feature Branch into Main

If you've already committed your changes on a feature branch, you can merge them into main:

```bash
# Step 1: Switch to main
git checkout main

# Step 2: Pull latest changes
git pull origin main

# Step 3: Merge your feature branch
git merge your-feature-branch

# Step 4: Push to main
git push origin main
```

## Best Practices

### 1. Always Check Your Branch Before Committing
```bash
git status
```

### 2. Use Descriptive Branch Names
- `feature/add-new-component`
- `fix/black-screen-error`
- `refactor/cleanup-code`

### 3. Keep Main Branch Clean
- Don't commit directly to main unless necessary
- Use feature branches for development
- Merge to main through pull requests

### 4. Pull Before You Push
Always pull the latest changes before pushing:
```bash
git pull origin main
git push origin main
```

### 5. Create Pull Requests for Code Review
Instead of pushing directly to main:
1. Create a feature branch
2. Commit your changes
3. Push the feature branch
4. Create a pull request on GitHub
5. Merge after review

## Common Git Commands Reference

```bash
# Check current branch
git branch
git status

# List all branches (including remote)
git branch -a

# Switch branches
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Update local branch from remote
git pull origin branch-name

# Push changes to remote
git push origin branch-name

# View commit history
git log --oneline

# View differences
git diff

# Discard changes in a file
git restore filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## Troubleshooting

### "fatal: not a git repository"
You're not in a git repository directory. Navigate to your project folder first.

### "error: pathspec 'main' did not match any file(s) known to git"
The main branch doesn't exist locally. Fetch it from remote:
```bash
git fetch origin main:main
git checkout main
```

### "Updates were rejected because the remote contains work that you do not have"
Your local branch is behind the remote. Pull first:
```bash
git pull origin main
# Resolve any conflicts if they occur
git push origin main
```

### "You have divergent branches"
Your local and remote branches have different histories. You need to either:
- Merge: `git pull origin main` (creates a merge commit)
- Rebase: `git pull --rebase origin main` (replays your commits on top)

## Getting Help

For more information about Git commands:
```bash
git --help
git <command> --help
```

Online resources:
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
