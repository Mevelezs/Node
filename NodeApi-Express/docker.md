```sh
docker-compose up -d postgres 
docker-compose up -d pgAdmin

```

```sh
docker ps
docker inspect 'dbName'

```
```sh
docker-compose exec postgres bash 
root@bb993ed98bca:-- > psql -h localhost -d nombredb -U userName

```
