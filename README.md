# Nodejs User Management
------------
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
* [node.js] 
* [Typescript](https://www.typescriptlang.org)
* [Express] 
* [Mongodb](https://www.mongodb.com) 
* [Mongoose](https://mongoosejs.com)
* [Joi](https://github.com/hapijs/joi)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)


### Installation

Node-UM requires [node.js], [Mongodb](https://www.mongodb.com)

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
| JWT_SECRET_KEY | Json Web Token Secret Key |
| SESSION_EXP_TIME | Session Expiration Time (MS) |
| RESET_PASSWORD_EXP_TIME | Reset Password Token Expiration Time (MS) |


### API
-----------


> For all requests ( URL & JSON body & Response ) please check Postman Collection 


 **User Authentication and Permissions** 
 
Application will validate all requests if the request URL and method required token or permission or booth. 
*httpInterceptor* function will be responsible for doing that check.
*httpInterceptor* function will check if request url and method exists in DB Permissions collection, so there are many odds: 

 1. URL and Method Not exists In Permissions collection in that case app will consider that URL is Public URL and any user can access it ( that will be useful for GUI static pages  )
 2. URL and Method exists app will check isDefault flag 
    * if true that's mean that no need to check if user permissions includes this path and method ( eg. logout , get own info , change own password all of this requests is default permissions for any user )
    * if false so user must have permission for that url and method 

> PS: Node-UM support path params by replacing path param with question mark
> Eg. If admin submit requst to get user by id ( url: /users/123456789 , method: get ) Node-UM will replace "123456789" with question mark to be ( url: /users/? , method: get ), so in permissions collection you have to replace any path params with question mark 
> Eg2. ( /groups/122456/users/123654789 ) => ( /groups/?/users/? )


----

 **Login** 

User login is like any other user management application, it will check if username and password exists in db or not and return user info and token, beside it will remove all old ( expired ) sessions ( async ) 

-------------
 **Get User By Token**
 I will return user if token exists and not expired also it will remove expired sessions ( asyc ), Also it will update current token expiration date
 
 > PS. Get user by token the only web service which will update token expiry date, that behavior based on, this web service will be called when user open the web page so no need to update token expiry with all requests
------------
 **Reset Password**
User can reset own password by two steps 
1. Submit reset password request with his username, so token will be generated and sent to user email ( send mail not implemented yet ) token will have expiry date ( 2 min to be configured from .env file )
2. by this token user can submit new password to url ( /changePasswordByToken/:token )

------
 **Login As**
 
 Only Super User ( super user flage ) can login as any user 
 
 
 ----------
 
 # To be continued .......
 
 
 
### Todo

 - Child Permissions ( eg. Add user should have get all users and get user by ID )
 - User Permissions ( Not only groups have permissions but also user should have permissions )

License
----

MIT

