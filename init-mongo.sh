#!/bin/bash

echo test

mongoimport -d usermanagement -c groups --file /DB/groups.json  --jsonArray

mongoimport -d usermanagement -c permissions --file /DB/permissions.json  --jsonArray

mongoimport -d usermanagement -c users --file /DB/users.json  --jsonArray


echo test2

