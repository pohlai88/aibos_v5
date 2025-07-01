# CI/CD Setup with Release-Please

## 🚀 Overview

This project uses GitHub Actions with `release-please` for automated versioning, changelog generation, and releases. The setup provides enterprise-grade CI/CD capabilities with minimal configuration.

## 📋 Features

- ✅ **Automated Versioning** - Semantic versioning based on commit messages
- ✅ **Changelog Generation** - Automatic CHANGELOG.md updates
- ✅ **GitHub Releases** - Automated release creation with notes
- ✅ **Build & Test** - Automated testing and building
- ✅ **Deployment Ready** - Configurable deployment pipelines
- ✅ **NPM Publishing** - Optional automatic NPM package publishing

## 🏗️ Architecture

### Workflow Structure

```
.github/workflows/
├── release-please.yml    # Main release automation
├── ci.yml               # Continuous integration
└── [future workflows]   # Additional CI/CD workflows
```

### Configuration Files

```
├── .release-please-manifest.json  # Version tracking
├── release-please-config.json     # Release configuration
├── COMMIT_CONVENTION.md           # Commit message guide
└── package.json                   # Project metadata
```

## ⚙️ Configuration

### 1. Release-Please Workflow

The main workflow (`.github/workflows/release-please.yml`) handles:

- **Version Detection**: Analyzes commit messages for version bumps
- **Changelog Generation**: Creates detailed changelog sections
- **Release Creation**: Automatically creates GitHub releases
- **Build & Deploy**: Optional build and deployment steps

### 2. Commit Message Convention

Uses [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
feat: add new feature          # Minor version bump
fix: resolve bug              # Patch version bump
BREAKING CHANGE: major change # Major version bump
```

### 3. Changelog Sections

Organized changelog with emoji sections:

- 🚀 **Features** - New functionality
- 🐛 **Bug Fixes** - Bug corrections
- 🔧 **Maintenance** - Routine tasks
- 📚 **Documentation** - Docs updates
- ♻️ **Code Refactoring** - Code improvements
- 🧪 **Tests** - Test additions/updates
- ⚙️ **CI/CD** - Pipeline changes
- 💄 **Styling** - Style updates
- ⚡ **Performance** - Performance improvements
- 📦 **Build System** - Build changes

## 🚀 Getting Started

### 1. Prerequisites

- GitHub repository with Actions enabled
- Node.js project with `package.json`
- Conventional commit messages

### 2. Setup Steps

#### Step 1: Verify Configuration Files

Ensure these files exist in your repository:

```bash
# Check configuration files
ls -la .release-please-manifest.json
ls -la release-please-config.json
ls -la .github/workflows/release-please.yml
```

#### Step 2: Update Package.json

Ensure your `package.json` has the correct version:

```json
{
  "name": "aibos_v5",
  "version": "1.0.0",
  "description": "Apple-inspired modular accounting SaaS"
}
```

#### Step 3: Test the Workflow

1. Make a commit with conventional format:

   ```bash
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. Check GitHub Actions tab for workflow execution
3. Verify release creation in Releases tab

### 3. GitHub Repository Settings

#### Required Permissions

Ensure your repository has these permissions:

1. Go to **Settings** → **Actions** → **General**
2. Enable **Read and write permissions**
3. Allow **Pull requests** to be created

#### Secrets (Optional)

For NPM publishing, add these secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add `NPM_TOKEN` with your NPM authentication token

## 📝 Usage Examples

### Making a Feature Release

```bash
# Add new feature
git add .
git commit -m "feat: add user authentication system"
git push origin main

# Result: Version 1.0.0 → 1.1.0
```

### Making a Bug Fix Release

```bash
# Fix a bug
git add .
git commit -m "fix: resolve login validation issue"
git push origin main

# Result: Version 1.1.0 → 1.1.1
```

### Making a Breaking Change Release

```bash
# Breaking change
git add .
git commit -m "feat: redesign API

BREAKING CHANGE: API endpoints have been restructured.
All existing integrations will need to be updated."
git push origin main

# Result: Version 1.1.1 → 2.0.0
```

## 🔧 Customization

### 1. Modify Changelog Sections

Edit `release-please-config.json`:

```json
{
  "packages": {
    ".": {
      "changelog-sections": [
        { "type": "feat", "section": "🚀 New Features" },
        { "type": "fix", "section": "🐛 Bug Fixes" },
        { "type": "docs", "section": "📚 Documentation" }
      ]
    }
  }
}
```

### 2. Custom Release Notes Template

Update the template in `release-please-config.json`:

````json
{
  "packages": {
    ".": {
      "release-notes": {
        "template": "## What's New in ${version}\n\n${changelog}\n\n## Installation\n\n```bash\nnpm install aibos_v5@${version}\n```"
      }
    }
  }
}
````

### 3. Add Deployment Steps

Uncomment and customize deployment in `.github/workflows/release-please.yml`:

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🧪 Testing the Setup

### 1. Test Commit Messages

```bash
# Test feature commit
git commit -m "feat: add test feature" --allow-empty
git push origin main

# Test fix commit
git commit -m "fix: resolve test issue" --allow-empty
git push origin main
```

### 2. Verify Workflow Execution

1. Go to **Actions** tab in GitHub
2. Check `release-please` workflow
3. Verify successful execution

### 3. Check Release Creation

1. Go to **Releases** tab in GitHub
2. Verify new release with correct version
3. Check changelog content

## 🚨 Troubleshooting

### Common Issues

#### 1. Workflow Not Triggering

**Problem**: Push to main doesn't trigger release-please

**Solution**:

- Check branch name (must be `main`)
- Verify workflow file location (`.github/workflows/release-please.yml`)
- Check GitHub Actions permissions

#### 2. No Release Created

**Problem**: Commits don't create releases

**Solution**:

- Verify commit message format (must follow conventional commits)
- Check `release-please-config.json` configuration
- Review workflow logs for errors

#### 3. Incorrect Version Bumping

**Problem**: Version doesn't bump as expected

**Solution**:

- Check commit message type (`feat`, `fix`, `BREAKING CHANGE`)
- Verify `release-please-manifest.json` current version
- Review configuration in `release-please-config.json`

### Debug Steps

1. **Check Workflow Logs**:

   ```bash
   # Go to Actions tab → release-please → View logs
   ```

2. **Verify Configuration**:

   ```bash
   # Check all config files exist
   ls -la .release-please-*
   ls -la .github/workflows/
   ```

3. **Test with Simple Commit**:
   ```bash
   git commit -m "feat: test release please" --allow-empty
   git push origin main
   ```

## 📚 Advanced Features

### 1. Multi-Package Support

For monorepos with multiple packages:

```json
// release-please-config.json
{
  "packages": {
    "frontend": {
      "path": "frontend",
      "release-type": "node"
    },
    "backend": {
      "path": "backend",
      "release-type": "node"
    }
  }
}
```

### 2. Custom Release Types

Support for different release types:

```json
{
  "packages": {
    ".": {
      "release-type": "java", // For Java projects
      "release-type": "python" // For Python projects
    }
  }
}
```

### 3. Pre-release Support

For alpha/beta releases:

```bash
git commit -m "feat: add new feature

This is a pre-release for testing."
```

## 🔗 Resources

- [Release-Please Documentation](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

## 📞 Support

For issues with the CI/CD setup:

1. Check this documentation first
2. Review GitHub Actions logs
3. Verify configuration files
4. Test with simple commits
5. Create an issue with detailed logs

---

**Status**: ✅ Production Ready  
**Last Updated**: January 2024  
**Version**: 1.0.0
