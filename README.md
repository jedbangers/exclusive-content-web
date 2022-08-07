exclusive-content-web
=============================
Web application for exclusive content disposition for Jedbangers Magazine

Based on [andresmatasuarez/angular-express-passport-seed](https://github.com/andresmatasuarez/angular-express-passport-seed)


# Deploy
Two alternatives:
1. Just pish code to Github repo and then use Heroku's manual deploy feature to deploy `master` branch.
2. Run `npm run deploy`.


# Useful
  - Dump remote Mongo database
```console
mongodump --uri "mongodb+srv://username:password@host/db_name" --out mongo_jedbangers_backup
```

  - Restore Mongo dump
```console
mongorestore --nsFrom "remote_db_name.*" --nsTo "jedbangers_exclusive_content_dev.*" mongo_jedbangers_backup
```
