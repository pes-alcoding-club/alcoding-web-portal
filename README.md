# Data Analysis Project
A web application built using MERN (MongoDB, Express.js, React.js, Node.js) full-stack framework. This project is developed for the students and professors of the CS&E department, PES University and is developed by the members of *The Alcoding Club*, PES University.
The web app enables student to view their ranking among other students in global competitive coding competitions, helps them build a public profile, submit course related assignments and view their submissions.

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
