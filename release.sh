#!/bin/bash

set -e
echo "Switching to main branch..."
git checkout main
echo "Pulling changes from develop branch..."
git pull origin develop
echo "Updating version with pnpm..."
NEW_VERSION=$(pnpm -r exec pnpm version patch | grep -m 1 -oP "v[0-9]+\.[0-9]+\.[0-9]+" | head -n 1)
echo "Staging all changes..."
git add .
echo "Committing changes with version $NEW_VERSION..."
git commit -m "$NEW_VERSION"
echo "Pushing changes to main branch..."
git push
echo "Creating and pushing tag $NEW_VERSION..."
git tag $NEW_VERSION
git push origin $NEW_VERSION
echo "Switching to develop branch..."
git checkout develop
echo "Pulling main branch changes into develop..."
git pull origin main
echo "Pushing changes to develop branch..."
git push
echo "Process complete. Version updated to $NEW_VERSION."
