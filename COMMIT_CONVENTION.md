# Conventional Commit Message Guide

## 📋 Overview

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, which enables automated versioning and changelog generation through `release-please`.

## 🎯 Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples

```
feat: add user authentication system
fix(auth): resolve login validation issue
docs: update API documentation
chore: update dependencies
BREAKING CHANGE: remove deprecated API endpoints
```

## 📝 Commit Types

### 🚀 **feat** - New Features

New features or enhancements to existing functionality.

```bash
feat: add dark mode support
feat(auth): implement OAuth2 authentication
feat(dashboard): add real-time notifications
```

### 🐛 **fix** - Bug Fixes

Bug fixes and error corrections.

```bash
fix: resolve navigation menu overflow
fix(api): handle null response from server
fix(ui): correct button alignment on mobile
```

### 📚 **docs** - Documentation

Documentation changes only.

```bash
docs: update README with installation steps
docs(api): add endpoint documentation
docs: fix typo in contributing guide
```

### 🔧 **chore** - Maintenance

Routine tasks, maintenance, and tooling changes.

```bash
chore: update dependencies
chore: configure release-please workflow
chore: add ESLint configuration
```

### ♻️ **refactor** - Code Refactoring

Code changes that neither fix bugs nor add features.

```bash
refactor: restructure component hierarchy
refactor(utils): optimize date formatting function
refactor: extract common validation logic
```

### 🧪 **test** - Tests

Adding or updating tests.

```bash
test: add unit tests for user service
test(api): add integration tests for auth endpoints
test: fix failing test cases
```

### ⚙️ **ci** - CI/CD

Changes to CI/CD configuration and scripts.

```bash
ci: add GitHub Actions workflow
ci: update deployment configuration
ci: fix build pipeline
```

### 💄 **style** - Styling

Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc.).

```bash
style: format code with Prettier
style: fix indentation in CSS files
style: remove trailing whitespace
```

### ⚡ **perf** - Performance

Performance improvements.

```bash
perf: optimize database queries
perf(ui): reduce bundle size by 15%
perf: implement lazy loading for images
```

### 📦 **build** - Build System

Changes that affect the build system or external dependencies.

```bash
build: update webpack configuration
build: add TypeScript compilation
build: optimize production build
```

## 🎯 Scopes

Scopes are optional but recommended for better organization. Use lowercase and be specific.

### Common Scopes

- `auth` - Authentication and authorization
- `api` - API endpoints and services
- `ui` - User interface components
- `db` - Database related changes
- `docs` - Documentation
- `test` - Testing
- `ci` - Continuous Integration
- `build` - Build system
- `deps` - Dependencies

### Examples with Scopes

```bash
feat(auth): add two-factor authentication
fix(ui): resolve button alignment on mobile
docs(api): update endpoint documentation
chore(deps): update React to v18
```

## 🚨 Breaking Changes

Use `BREAKING CHANGE:` in the commit body or footer to indicate breaking changes.

### In Body

```
feat: redesign user interface

BREAKING CHANGE: The user interface has been completely redesigned.
All existing custom themes will need to be updated.
```

### In Footer

```
feat: redesign user interface

Closes #123
BREAKING CHANGE: The user interface has been completely redesigned.
```

## 📋 Commit Message Guidelines

### 1. **Use Imperative Mood**

Write commit messages as if you're giving commands.

✅ **Good:**

```bash
feat: add user authentication
fix: resolve navigation bug
docs: update installation guide
```

❌ **Bad:**

```bash
feat: added user authentication
fix: resolved navigation bug
docs: updated installation guide
```

### 2. **Keep Description Short**

Limit the description to 72 characters or less.

✅ **Good:**

```bash
feat: add user authentication system
```

❌ **Bad:**

```bash
feat: add comprehensive user authentication system with OAuth2 support and role-based access control
```

### 3. **Use Body for Details**

Use the commit body for detailed explanations.

```bash
feat: add user authentication system

- Implement OAuth2 authentication with Google and GitHub
- Add role-based access control (RBAC)
- Include session management with JWT tokens
- Add password reset functionality
- Implement account lockout after failed attempts

Closes #123
Fixes #456
```

### 4. **Reference Issues**

Link commits to issues using keywords.

```bash
feat: add user authentication

Closes #123
Fixes #456
Relates to #789
```

## 🎯 Examples for AI-BOS Project

### Module Development

```bash
feat(employees): add employee management module
feat(tasks): implement task creation and assignment
feat(dashboard): add real-time statistics
```

### Shared Components

```bash
feat(shared): add reusable Button component
feat(shared): implement Loading and Skeleton components
feat(shared): add TypeScript type definitions
```

### Documentation

```bash
docs: add module organization guide
docs(employees): update employee management documentation
docs: add commit message convention guide
```

### Bug Fixes

```bash
fix(employees): resolve email validation issue
fix(tasks): fix task status not updating
fix(ui): correct responsive layout on mobile
```

### Refactoring

```bash
refactor: migrate legacy dashboard to React
refactor(shared): extract common utility functions
refactor: improve component structure
```

## 🚀 Release Process

### Automatic Versioning

Based on your commit messages, `release-please` will:

- **feat** commits → Minor version bump (1.0.0 → 1.1.0)
- **fix** commits → Patch version bump (1.0.0 → 1.0.1)
- **BREAKING CHANGE** → Major version bump (1.0.0 → 2.0.0)

### Release Triggers

- Pushes to `main` branch trigger release-please
- Only commits with conventional format are considered
- Release notes are automatically generated

## 🛠️ Tools and Integration

### VS Code Extensions

- **Conventional Commits**: Provides commit message templates
- **GitLens**: Enhanced Git integration
- **Commitizen**: Interactive commit message creation

### Git Hooks

Consider adding a pre-commit hook to validate commit messages:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### Configuration

Add to your project:

```json
// .commitlintrc.json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "chore",
        "refactor",
        "test",
        "ci",
        "style",
        "perf",
        "build"
      ]
    ]
  }
}
```

## 📚 Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)

---

**Remember**: Good commit messages help your team understand the project's history and enable automated tools to work effectively! 🎯
