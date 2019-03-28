###数据库升级
```
npx sequelize migration:generate --name=addColumn-shop
npx sequelize db:migrate
```

# egg-xyy
1.CREATE DATABASE IF NOT EXISTS egg_commerce DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

# 部署打包
```
tar -zcvf ../release.tgz .
```

```
select * from (select address,category,promotion_info,phone, ROUND(6378.138*2*ASIN(SQRT(POW(SIN((${latiude}*PI()/180-latitude*PI()/180)/2),2)+COS(${latiude}*PI()/180)*COS(latitude*PI()/180)*POW(SIN((${longitude}*PI()/180-longitude*PI()/180)/2),2)))*1000) AS distance from shops order by distance ) as a where a.distance<=${range * 1000}
```

```
select * from (select address,category,promotion_info,phone, ROUND(6378.138*2*ASIN(SQRT(POW(SIN((30.664385188806*PI()/180-lat*PI()/180)/2),2)+COS(30.664385188806*PI()/180)*COS(lat*PI()/180)*POW(SIN((104.07559730274*PI()/180-lng*PI()/180)/2),2)))*1000) AS distance from merchants order by distance ) as a where a.distance<=5000000 LIMIT ${pageNum},${pageSize} 
```