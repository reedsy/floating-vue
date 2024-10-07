#!/bin/bash

VERSION=$(node -p "require('./packages/floating-vue/package.json').version")

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

echo '!packages/floating-vue/dist' >> .gitignore

git tag $VERSION
git push origin refs/tags/$VERSION

npm publish -w packages/floating-vue
