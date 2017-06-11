'use strict';
// using chai assertion library for expect
const expect = require('chai').expect
const chai = require('chai')
const fs = require('fs')
const chaiHttp = require('chai-http')

let server = require('../server')

chai.use(chaiHttp)

let token
let list

describe("auth test", () => {

  it("fails to log in with no username given", done => {
    chai.request(server)
      .post('/login')
      .send({
        password: '123'
      })
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(400)
        expect(result.req.res.body.success).equal(false)
        expect(result.req.res.body.errors.errors[0].field).equal('username')
        done();
      }
    )
  })

  it("fails to log in with no password given", done => {
    chai.request(server)
      .post('/login')
      .send({
        username: 'admin'
      })
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(400)
        expect(result.req.res.body.success).equal(false)
        expect(result.req.res.body.errors.errors[0].field).equal('password')
        done();
      }

    )
  })

  it("fails to log in with wrong credentials", done => {
    chai.request(server)
      .post('/login')
      .send({
        username: 'admin',
        password: '124'
      })
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(401)
        expect(result.req.res.body.success).equal(false)
        done()
      }
    )
  })

  it("logs in to system and get auth token", done => {
    chai.request(server)
      .post('/login')
      .send({
        username: 'admin',
        password: '123'
      })
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        expect(result.req.res.body.token).to.be.not.empty;
        token = result.req.res.body.token
        done();
      }
    )
  })
})

describe("upload image", () => {

  it("fails to upload an image without authorization", done => {
    chai.request(server)
      .post('/upload')
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(401)
        done();
      }
    )
  })

  it("fails to upload an image without image", done => {
    chai.request(server)
      .post('/upload')
      .set('Authorization', token)
      .end((err, result) => {
        expect(result.req.res.body.success).equal(false)
        expect(result.req.res.statusCode).equal(400)
        expect(result.req.res.body.errors.errors[0].field).equal('fileData')
        done();
      }
    )
  })

  it("uploads image", done => {
    chai.request(server)
      .post('/upload')
      .set('Authorization', token)
      .field('fileName', 'logo')
      .attach('fileData', fs.readFileSync('tests/images/logo.png'), 'logo.png')
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        expect(result.req.res.body.id).is.not.empty
        expect(result.req.res.body.name).is.not.empty
        done();
      }
    )
  })

  it("uploads image again", done => {
    chai.request(server)
      .post('/upload')
      .set('Authorization', token)
      .field('fileName', 'logo')
      .attach('fileData', fs.readFileSync('tests/images/logo.png'), 'logo.png')
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        expect(result.req.res.body.id).is.not.empty
        expect(result.req.res.body.name).is.not.empty
        done();
      }
    )
  })

})

describe("gets list of images", () => {

  it("gets list of images", done => {
    chai.request(server)
      .get('/images')
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        expect(result.req.res.body.images).is.an('array')
        expect(result.req.res.body.images[0].id).is.a('number')
        expect(result.req.res.body.images[0].name).is.a('string')
        list = result.req.res.body.images
        done();
      }
    )
  })

  it("gets list of images with offset", done => {
    chai.request(server)
      .get('/images?offset=1')
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        expect(result.req.res.body.offset).equal(1)
        expect(result.req.res.body.images).is.an('array')
        expect(result.req.res.body.images[0].id).is.a('number')
        expect(result.req.res.body.images[0].name).is.a('string')
        list = result.req.res.body.images
        done();
      }
    )
  })

  it("gets list of images with offset and limit", done => {
    chai.request(server)
      .get('/images?offset=1&limit=1')
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        expect(result.req.res.body.limit).equal(1)
        expect(result.req.res.body.offset).equal(1)
        expect(result.req.res.body.images).is.an('array')
        expect(result.req.res.body.images[0].id).is.a('number')
        expect(result.req.res.body.images[0].name).is.a('string')
        list = result.req.res.body.images
        done();
      }
    )
  })
})

describe("gets one image object", () => {

  it("fails to get one image object with wrong id", done => {
    chai.request(server)
      .get('/images/999999')
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(404)
        expect(result.req.res.body.success).equal(false)
        done();
      }
    )
  })

  it("gets one image object", done => {
    chai.request(server)
      .get('/images/' + list[0].id)
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        expect(result.req.res.body.image).is.an('object')
        expect(result.req.res.body.image.id).is.a('number')
        expect(result.req.res.body.image.name).is.a('string')
        done();
      }
    )
  })
})

describe("renders one image", () => {

  it("fails to render one image with wrong id", done => {
    chai.request(server)
      .get('/images/99999/image')
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(404)
        expect(result.req.res.body.success).equal(false)
        done();
      }
    )
  })

  it("renders one image", done => {
    chai.request(server)
      .get('/images/' + list[0].id + '/image')
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(200)
        done();
      }
    )
  })

})

describe("resize one image", () => {

  it("fails to resize one image with no width given", done => {
    chai.request(server)
      .get('/resize/99999')
      .end((err, result) => {
        // console.log(result.req.res.body.errors);
        expect(result.req.res.statusCode).equal(400)
        expect(result.req.res.body.success).equal(false)
        expect(result.req.res.body.errors).is.not.empty
        expect(result.req.res.body.errors.errors).is.an('array')
        expect(result.req.res.body.errors.errors[0]).is.an('object')
        expect(result.req.res.body.errors.errors[0].field).equal('width')
        done();
      }
    )
  })

  it("fails to resize one image with no height given", done => {
    chai.request(server)
      .get('/resize/99999?width=100')
      .end((err, result) => {
        // console.log(result.req.res.body.errors);
        expect(result.req.res.statusCode).equal(400)
        expect(result.req.res.body.success).equal(false)
        expect(result.req.res.body.errors).is.not.empty
        expect(result.req.res.body.errors.errors).is.an('array')
        expect(result.req.res.body.errors.errors[0]).is.an('object')
        expect(result.req.res.body.errors.errors[0].field).equal('height')
        done();
      }
    )
  })

  it("fails to resize one image with wrong id", done => {
    chai.request(server)
      .get('/resize/99999?width=100&height=60')
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(404)
        expect(result.req.res.body.success).equal(false)
        done();
      }
    )
  })

  it("resizes one image to 90x60", done => {
    chai.request(server)
      .get('/resize/' + list[0].id + '?width=90&height=20')
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(200)
        done();
      }
    )
  })

  it("resizes one image to 90x60 and rotates 90 degrees", done => {
    chai.request(server)
      .get('/resize/' + list[0].id + '?width=90&height=20&rotate=90')
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(200)
        done();
      }
    )
  })

})

describe("delete image object", () => {

  it("fails to delete an image without authorization", done => {
    chai.request(server)
      .delete('/images/' + list[0].id)
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(401)
        done()
      }
    )
  })

  it("fails to delete an image with wrong id", done => {
    chai.request(server)
      .delete('/images/9999')
      .set('Authorization', token)
      .end((err, result) => {
        expect(result.req.res.body.success).equal(false)
        expect(result.req.res.statusCode).equal(404)
        done()
      }
    )
  })

  it("deletes image", done => {
    chai.request(server)
      .delete('/images/' + list[0].id)
      .set('Authorization', token)
      .end((err, result) => {
        // console.log(result.req.res.body);
        expect(result.req.res.statusCode).equal(200)
        expect(result.req.res.body.success).equal(true)
        done()
      }
    )
  })

})
