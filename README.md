# Nodejs User Management

Nodejs User Management is an appication to help administrators manage user identities including password resets, creating and provisioning, blocking and deleting users.



# key features !

* Written in Typescript
* Permission based access control
* Stateless ( JWT )
* User
  - Login 
  - Logout
  - Get Own Info ( By Token )
  - Change Own Info 
  - Change Own Password
  - Reset Password ( Generating Token To send it to user email )
   

* Admin
  - Get All Users  
  - Get User By ID 
  - Add New User 
  - Edit User 
  - Delete User ( Soft Delete )
  - Login As User 
  - Get All Groups 
  - Get Group By Group ID 
  - Add Group 
  - Edit Group
  - Delete Group ( Soft )
  - Get All Permissions 


### Tech

Node-UM uses a number of open source projects to work properly:
* [node.js](https://nodejs.org)
* [Typescript](https://www.typescriptlang.org)
* [Express](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com) 
* [Mongoose](https://mongoosejs.com)
* [Joi](https://github.com/hapijs/joi)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)



### Docker Installation

If you have docker and docker compose, just run the below commands then the application will start listening on port 8082 

```sh
$ tsc
$ docker-compose up 

```


### Installation

Node-UM requires [node.js](https://nodejs.org),  [Typescript](https://www.typescriptlang.org), [Mongodb](https://www.mongodb.com)

Install the dependencies and devDependencies and import DB Collections from DB folder.
then run the below script to start the server.

```sh
$ npm install
$ npm start
```


### Environment

You can change env variables from **.env** file 

| Variable | Description |
| ------ | ------ |
| PORT | HTTP Server Port |
| HOST | HTTP Server HOST |
| DB_URL | Mongodb URL |
| POOL_SIZE | DB connection pool size |
| JWT_ACCESS_SECRET_KEY | Json Web Token Access Secret Key |
| JWT_REFRESH_SECRET_KEY | Json Web Token Refresh Secret Key |
| ACCESS_TOKEN_EXP_TIME | Access token expiration time |
| REFRESH_TOKEN_EXP_TIME | Refresh token expiration time |
| RESET_PASSWORD_EXP_TIME | Reset Password Token Expiration Time (MS) |


### API
-----------


> For all requests ( URL & JSON body ) please check Postman Collection 


 **Authentication** 

 
```

Client ->> Server: send login request
Server ->> Client: return access & refresh token


// all subsequents requests 

Client ->> Server: send access token in Authorization header
Server ->> Client: return response



// If token expired ?

Client ->> Server: send refresh token request
Server ->> Client: return new access & refresh token


```




 **Authorization** 

- Node-UM will validate all request against permissions table, if url doesn't exists in permissions table it means that it's a public url and any user can access this url without any kind of authorization  ( that will be useful for GUI static pages  ).

- All records in permissions table specify whether url requires token only to be accessed or requires token and permission.

- Permission table schema :

| Field | Description |
| ------ | ------ |
| path | HTTP URL , URL could be static or dynamic , for dynamic URLs like get user by id `/users/123456789` just replace the dynamic string by question mark to be `/users/?`  |
| method | HTTP Method , eg. ( GET , POST , PUT and DELETE ) |
| isDefault | Set this flag to true if path does not require user to have permission to access it  ( eg. get own info , change own password  ) |



----


 # To be continued .......
 
 
 
### Todo

 - User Permissions ( Not only groups have permissions but also user should have permissions  )
 - Child Permissions ( eg. Add user permission should include get all users and get user by ID )

License
----

MIT

