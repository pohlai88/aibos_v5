# Release-Please Setup Guide

## 🔑 **Critical Fix: Personal Access Token Setup**

The release-please workflow requires a Personal Access Token (PAT) to create releases and pull requests. This guide will walk you through the complete setup process.

## 📋 **Prerequisites**

- GitHub account with admin access to the repository
- Repository: `pohlai88/aibos_v5`
- GitHub Actions enabled

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Personal Access Token (PAT)**

1. **Go to GitHub Settings**

   - Navigate to [GitHub Settings](https://github.com/settings)
   - Click on **Developer settings** (bottom left)
   - Click on **Personal access tokens**
   - Click on **Tokens (classic)**

2. **Generate New Token**

   - Click **"Generate new token (classic)"**
   - Give it a descriptive name: `Release Please Token - AI-BOS`
   - Set expiration: **1 year** (recommended for maintenance ease)

3. **Select Required Scopes**

   - ✅ **`repo`** - Full control of private repositories
   - ✅ **`workflow`** - Update GitHub Action workflows
   - ✅ **`write:packages`** - Upload packages to GitHub Package Registry (optional)
   - ✅ **`read:packages`** - Download packages from GitHub Package Registry (optional)

4. **Generate and Copy Token**
   - Click **"Generate token"**
   - **⚠️ IMPORTANT**: Copy the token immediately - you won't see it again!
   - Store it securely (password manager recommended)

### **Step 2: Add Token to Repository Secrets**

1. **Go to Repository Settings**

   - Navigate to your repository: `https://github.com/pohlai88/aibos_v5`
   - Click on **Settings** tab
   - Click on **Secrets and variables**
   - Click on **Actions**

2. **Add New Repository Secret**
   - Click **"New repository secret"**
   - **Name**: `RELEASE_PLEASE_TOKEN`
   - **Value**: Paste your PAT from Step 1
   - Click **"Add secret"**

### **Step 3: Verify Configuration Files**

Ensure these files exist in your repository root:

#### **`.release-please-manifest.json`**

```json
{
  ".": "1.0.0"
}
```

#### **`release-please-config.json`**

```json
{
  "packages": {
    ".": {
      "changelog-sections": [
        { "type": "feat", "section": "🚀 Features" },
        { "type": "fix", "section": "🐛 Bug Fixes" },
        { "type": "chore", "section": "🔧 Maintenance" },
        { "type": "docs", "section": "📚 Documentation" },
        { "type": "refactor", "section": "♻️ Code Refactoring" },
        { "type": "test", "section": "🧪 Tests" },
        { "type": "ci", "section": "⚙️ CI/CD" },
        { "type": "style", "section": "💄 Styling" },
        { "type": "perf", "section": "⚡ Performance" },
        { "type": "build", "section": "📦 Build System" }
      ],
      "release-type": "node",
      "bump-minor-pre-major": true,
      "bump-patch-for-minor-pre-major": true
    }
  }
}
```

#### **`.github/workflows/release-please.yml`**

```yaml
name: release-please

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    outputs:
      release_created: ${{ steps.release.outputs.release_created }}
      tag_name: ${{ steps.release.outputs.tag_name }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Release Please
        id: release
        uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
          package-name: aibos-v5
          token: ${{ secrets.RELEASE_PLEASE_TOKEN }}
          changelog-sections: |
            [
              {"type": "feat", "section": "🚀 Features"},
              {"type": "fix", "section": "🐛 Bug Fixes"},
              {"type": "chore", "section": "🔧 Maintenance"},
              {"type": "docs", "section": "📚 Documentation"},
              {"type": "refactor", "section": "♻️ Code Refactoring"},
              {"type": "test", "section": "🧪 Tests"},
              {"type": "ci", "section": "⚙️ CI/CD"},
              {"type": "style", "section": "💄 Styling"},
              {"type": "perf", "section": "⚡ Performance"},
              {"type": "build", "section": "📦 Build System"}
            ]
```

### **Step 4: Test the Setup**

1. **Make a Test Commit**

   ```bash
   git add .
   git commit -m "feat: test release-please authentication fix"
   git push origin main
   ```

2. **Check GitHub Actions**

   - Go to **Actions** tab in your repository
   - Look for the `release-please` workflow
   - Verify it runs successfully (green checkmark)

3. **Check for Release PR**
   - Go to **Pull requests** tab
   - Look for a PR titled "Release v1.1.0" (or similar)
   - This indicates the workflow is working correctly

## 🔒 **Security Best Practices**

### **Token Management**

- ✅ **Scope Limitation**: Only grant minimum required permissions
- ✅ **Expiration**: Set reasonable expiration dates (1 year recommended)
- ✅ **Secure Storage**: Store tokens in password managers
- ✅ **Regular Rotation**: Rotate tokens periodically

### **Repository Security**

- ✅ **Secret Management**: Never commit tokens to repository
- ✅ **Access Control**: Limit who can access repository secrets
- ✅ **Audit Logs**: Monitor token usage in GitHub audit logs

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. "Resource not accessible by integration"**

**Problem**: Workflow fails with permission errors

**Solution**:

- Verify PAT has correct scopes (`repo`, `workflow`)
- Check token expiration
- Ensure token is added as `RELEASE_PLEASE_TOKEN` secret

#### **2. "No releases created"**

**Problem**: Commits don't trigger releases

**Solution**:

- Verify commit message format (must follow conventional commits)
- Check `release-please-config.json` configuration
- Review workflow logs for errors

#### **3. "Token not found"**

**Problem**: Workflow can't find the token

**Solution**:

- Verify secret name is exactly `RELEASE_PLEASE_TOKEN`
- Check repository settings → Secrets and variables → Actions
- Ensure you're in the correct repository

### **Debug Steps**

1. **Check Workflow Logs**

   ```bash
   # Go to Actions tab → release-please → View logs
   # Look for authentication errors
   ```

2. **Verify Secret Configuration**

   ```bash
   # Go to Settings → Secrets and variables → Actions
   # Verify RELEASE_PLEASE_TOKEN exists
   ```

3. **Test Token Permissions**
   ```bash
   # Try to create a test PR manually
   # Verify token has correct permissions
   ```

## 📊 **Expected Workflow Behavior**

### **First Run**

1. Release-please scans commit history
2. Creates a "Release PR" with version bump
3. Generates changelog from conventional commits

### **Subsequent Runs**

1. New commits update the release PR
2. Changelog is automatically updated
3. When PR is merged, GitHub release is created

### **Release Process**

1. **Commit**: `feat: add new feature`
2. **Workflow**: Creates/updates release PR
3. **Merge**: Release PR is merged to main
4. **Result**: GitHub release v1.1.0 is created

## 🎯 **Success Indicators**

✅ **Workflow runs successfully** (green checkmark in Actions)  
✅ **Release PR is created** (visible in Pull requests tab)  
✅ **Changelog is generated** (visible in release PR)  
✅ **GitHub release is created** (when PR is merged)

## 📞 **Support**

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review workflow logs** for specific error messages
3. **Verify token permissions** and expiration
4. **Test with simple commits** to isolate issues
5. **Create an issue** with detailed logs and error messages

---

**Status**: ✅ Ready for Implementation  
**Last Updated**: January 2024  
**Version**: 1.0.0
