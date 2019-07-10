# Data Analysis Project

A web application built using MERN (MongoDB, Express.js, React.js, Node.js) full-stack framework. This project is developed for the students and professors of the CS&E department, PES University and is developed by the members of _The Alcoding Club_, PES University.
The web app enables student to view their ranking among other students in global competitive coding competitions, helps them build a public profile, submit course related assignments and view their submissions.

## Requirements

- [Node.js](https://nodejs.org/en/) 6+
- [MongoDB](https://docs.mongodb.com/manual/installation/)
- [Docker](https://docs.docker.com/install/)

```shell
npm install
```

## Instructions

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```

### Note

1. Make sure to add a `config.js` file in the `config` folder. See the `config.example.js` under `config/` directory for more details.
2. Generate and add ssl files in the `server/` directory under a folder named `sslcert`. To genrate certificates, navigate to the `server/sslcert/` directory and execute the following command.

```shell
openssl req -x509 -out server.crt -keyout server.key \
-newkey rsa:2048 -nodes -sha256 \
-subj '/CN=localhost' -extensions EXT -config <( \
 printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

This should generate two files, `server.key` and `server.crt`.

### Steps to create the first user (an admin user)

1. Replace line 14 in `server/routes/api/admin.js` by the following

```
    app.post('/api/admin/signup', function (req, res) {
```

2. Run the server.

3. Make a `POST` request using any REST API client to `http://localhost:8080/api/admin/signup` with the body as `{ "usn": "admin", "firstName": "YourName" }`.
4. Using Mongo Compass, change the role of the created user to `admin`  
   OR  
   Start the mongo shell using `mongo` on the terminal,switch to the database mentioned in the config file using command `use yourDbName`,then execute the following command to update the database.

```
 db.users.findOneAndUpdate({'usn': 'ADMIN'},{ $set:{'role':'admin'}} )
```

5. Undo changes to `server/routes/api/admin.js`.
6. Log in using admin credentials. ( username = "ADMIN", password = "ADMIN" )

### Steps to add new users

1. Using an `admin` account, access `localhost:8080/admin` page. Upload a csv file containing new users in the format "firstName, email, usn".
2. Default password is USN (in uppercase) for all users.

### Setting up the docker image

1. Pull the docker image from Docker hub

- Run `docker pull alcoding/compiler_store`
