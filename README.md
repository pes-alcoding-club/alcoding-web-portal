# Data Analysis Project
This project is being developed for the Alcoding Club of PES University, Bangalore.
It is a Web Application that acts as a portal for all students belonging to the Computer Science Department, in which students can view their coding contest rankings and submit assignments for the courses they have enrolled.
This project is currently being developed using the MERN stack. 
Implementation details, features shall be enlisted in the near future. 


## Requirements

- [Node.js](https://nodejs.org/en/) 6+
- [MongoDB](https://docs.mongodb.com/manual/installation/)

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
  2. Make a `POST` request using any REST API client to `http://localhost:8080/api/admin/signup` with the body as `{ "usn": "admin", "firstName": "YourName" }`
  
  3. Using Mongo Compass, change the role of the created user to `admin`. 
  4. Undo changes to `server/routes/api/admin.js`.
  5. Run the server.
  6. Log in using admin credentials. ( username = "ADMIN", password = "ADMIN" )
  
  ### Steps to add new users
  1. Using an `admin` account, access `localhost:8080/admin` page. Upload a csv file containing new users in the format "firstName, email, usn".
  2. Default password is USN (in uppercase) for all users.
