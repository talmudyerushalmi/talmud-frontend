git push origin -d staging
git branch -D staging
git checkout -b staging
git push --set-upstream origin staging
git checkout -