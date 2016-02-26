npm run dist

cd dist

git init

git add .

git commit -m "Deploy"

git remote add origin git@heroku.com:jedbangers-exclusive-content.git

git fetch origin

git push --force origin master

cd ..
