###数据库升级
```
npx sequelize migration:generate --name=addColumn-shop
npx sequelize db:migrate
```