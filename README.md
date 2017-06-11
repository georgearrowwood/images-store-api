# Image store api

The application provides endpoints for creating image objects in a
datastore, managing the objects in the datastore and providing new (resized)
renditions of existing image objects already present in the datastore.

## Features

* NodeJS with Express.js is used as the web server.
* Data is stored in MongoDB database
* Simple JWT scenario with single hardcoded user credentials is implemented
* Implementation follows specification defined in the `swagger.yaml` file in
this repository.
* As an authenticated user, can create and delete image objects in the datastore.
* As an anonymous user, able to view image objects via a public url.
* As an anonymous user, able to get a resized rendition of existing
  image objects via a public url.
* Caching of resized image renditions using apicache module
* There is a feature of rotation image
* Pagination for the list image objects endpoint
* https://www.npmjs.com/package/sharp is used for images manipulations
* mocha, chai, chai-http are used for testing
* All functionality is covered with n2n tests(TODO: Unit tests)
* Api is dokerized

## instructions

### For local testing

This will make mongo db and api run in docker container
```
mkdir images-store-api
cd images-store-api
git clone git@github.com:georgearrowwood/images-store-api.git
docker-compose up
```
To be able to run tests
```
docker exec -ti <api cotainer id> bash
```
and then from within api image container bash
```
npm test
```
