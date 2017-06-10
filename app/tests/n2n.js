'use strict';
// using chai assertion library for expect
const expect = require('chai').expect
const chai = require('chai')
const fs = require('fs')
const chaiHttp = require('chai-http')

let server = require('../server');

chai.use(chaiHttp);

let token

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
        expect(result.req.res.body.errors[0].field).equal('username')
        done();
      }

    )
  });

  it("fails to log in with no password given", done => {
    chai.request(server)
      .post('/login')
      .send({
        username: 'admin'
      })
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(400)
        expect(result.req.res.body.success).equal(false)
        expect(result.req.res.body.errors[0].field).equal('password')
        done();
      }

    )
  });

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
        done();
      }

    )
  });

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
  });

  it("fails to upload an image without authorization", done => {
    chai.request(server)
      .post('/images')
      .end((err, result) => {
        expect(result.req.res.statusCode).equal(403)
        done();
      }
    )
  });

  it("uploads image", done => {
    chai.request(server)
      .post('/images')
      .set('Authorization', token)
      .attach('image', fs.readFileSync('tests/images/logo.png'), 'logo.png')
      .end((err, result) => {
        console.log(result.req.res.body);
        done();
      }
    )
  });



});
