#!/bin/bash

VERSION=$(node -p "require('.packages/floating-vue/package.json').version")

git config --local user.email "github@reedsy.com"
git config --local user.name "GitHub Action"
git fetch --tags

VERSION_COUNT=$(git tag --list $VERSION | wc -l)

if [ $VERSION_COUNT -gt 0 ]
then
  echo "Version $VERSION already deployed."
  exit 0
else
  echo "Deploying version $VERSION"
fi

echo '!/dist' >> .gitignore

git checkout -b release-$VERSION
git add .gitignore
git add --all dist/
git commit --message "Release version $VERSION"
git tag $VERSION
git push origin refs/tags/$VERSION
