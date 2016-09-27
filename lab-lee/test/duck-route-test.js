'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const Duck = require('../model/duck');

require('../server.js');

describe('testing duck routes', function() {

  describe('testing POST /api/duck', function() {
    let duck;

    after( done => {
      Duck.deleteDuck(duck.id)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should return a duck with status 200', function(done) {
      request.post('localhost:3000/api/duck')
      .send({name: 'larry', color: 'blue', feathers: '15'})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('larry');
        expect(res.body.color).to.equal('blue');
        expect(res.body.feathers).to.equal('15');
        duck = res.body;
        done();
      });
    });

    it('should 400 bad request', function(done) {
      request.post('localhost:3000/api/duck')
      .send({name: '', color: '', feathers: ''})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing GET /api/duck', function(){
    let duck;

    before( done => {
      Duck.createDuck( {
        name: 'larry',
        color: 'blue',
        feathers: '15',
      })
      .then( (_duck) => {
        duck = _duck;
        done();
      })
      .catch(err => done(err));
    });

    after( done => {
      Duck.deleteDuck(duck.id)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should get a duck with a valid id and status 200', function(done) {
      request.get(`localhost:3000/api/duck?id=${duck.id}`)
      .end( (err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should give a 400', function(done) {
      request.get('localhost:3000/api/duck?id= ')
      .end( (err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should give a 404', function(done) {
      request.get('localhost:3000/api/duck?id=not-exist')
      .end( (err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('testing PUT /api/duck if no file already', function() {
    let duck;

    after( done => {
      console.log(duck);
      Duck.deleteDuck(duck.id)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should return a duck with status 200', function(done) {
      request.put('localhost:3000/api/duck')
      .send({name: 'larry', color: 'blue', feathers: '15'})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('larry');
        expect(res.body.color).to.equal('blue');
        expect(res.body.feathers).to.equal('15');
        duck = res.body;
        done();
      });
    });

    it('should 400 bad request', function(done) {
      request.put('localhost:3000/api/duck')
      .send({name: '', color: '', feathers: ''})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing PUT /api/duck if file already exists', function() {
    let duck;

    before( done => {
      Duck.createDuck( {
        name: 'larry',
        color: 'blue',
        feathers: '15',
      })
      .then( (_duck) => {
        duck = _duck;
        done();
      })
      .catch(err => done(err));
    });

    after( done => {
      console.log(duck);
      Duck.deleteDuck(duck.id)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should return a duck with a status 200', function(done) {
      request.put('localhost:3000/api/duck')
      .send({name: 'steve', color: 'yellow', feathers: '18', id: duck.id})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('steve');
        expect(res.body.color).to.equal('yellow');
        expect(res.body.feathers).to.equal('18');
        duck = res.body;
        done();
      });
      Duck.deleteDuck(duck.id);
    });
  });

  describe('testing DELETE /api/duck', function(){
    let duck;

    before( done => {
      Duck.createDuck( {
        name: 'larry',
        color: 'blue',
        feathers: '15',
      })
      .then( (_duck) => {
        duck = _duck;
        done();
      })
      .catch(err => done(err));
    });

    it('should get a duck with a valid id, delete it and status 200', function(done) {
      request.delete(`localhost:3000/api/duck?id=${duck.id}`)
      .end( (err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should give a 400', function(done) {
      request.delete('localhost:3000/api/duck?id= ')
      .end( (err, res) => {
        expect(res.status).to.equal(400);
        console.log(res.body);
        done();
      });
    });

    it('should give a 404', function(done) {
      request.delete('localhost:3000/api/duck?id=not-exist')
      .end( (err, res) => {
        expect(res.status).to.equal(404);
        console.log(res.body);
        done();
      });
    });
  });
  //
  // describe('testing non-described routes', function() {
  //
  //   it('should return with a 404 not found', function(done) {
  //
  //   });
  // });

  describe('testing GET /api/duck/all', function() {
    let duck;

    before( done => {
      Duck.createDuck( {
        name: 'larry',
        color: 'blue',
        feathers: '15',
      })
      .then( (_duck) => {
        duck = _duck;
        done();
      })
      .catch(err => done(err));
    });

    after( done => {
      Duck.deleteDuck(duck.id)
      .then(() => done())
      .catch(err => done(err));
    });
    //
    // it('should return an array', function(done) {
    //   request.get('localhost:3000/api/duck/all')
    //   .end((err, res) => {
    //     // if (err) return done(err);
    //     console.log(res.body);
    //     done();
    //   });
    // });
  });
});
