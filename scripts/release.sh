#!/bin/bash

# Release script for Teleprompter
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 Creating $VERSION_TYPE release..."

# Ensure we're on main branch and up to date
git checkout main
git pull origin main

# Run tests to ensure everything works
echo "🧪 Running tests..."
npm test

# Bump version in package.json
echo "📝 Bumping $VERSION_TYPE version..."
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)

# Commit version bump
git add package.json package-lock.json
git commit -m "Release $NEW_VERSION"

# Create tag
git tag $NEW_VERSION

# Push changes and tag
git push origin main
git push origin $NEW_VERSION

echo "✅ Version $NEW_VERSION tagged and pushed!"
echo "📋 Next steps:"
echo "   1. Go to https://github.com/raisinbread/teleprompter/releases"
echo "   2. Click 'Create a new release'"
echo "   3. Select tag: $NEW_VERSION"
echo "   4. Add release notes"
echo "   5. Click 'Publish release'"
echo "   6. GitHub Actions will automatically publish to npm!" 