'use strict';

var flatiron = require('flatiron')
  , fipassport = require('flatiron-passport')
  , GoogleStrategy = require('passport-google').Strategy
  , app = flatiron.app
  , port = 8000
  , serverURL = 'http://localhost:' + port
  , userProfile

// init passport
fipassport.use(new GoogleStrategy({
  returnURL: serverURL + '/auth/google/return'
  , realm: serverURL
  }
  , function(ident, profile, done){

    // simulate async
    process.nextTick(function(){
      profile.identifier = ident
      userProfile = profile
      return done(null, userProfile)
    })
  }
))

fipassport.serializeUser(function(user, done) {
  done(null, user)
})

fipassport.deserializeUser(function(obj, done) {
  done(null, obj)
})

// init plugins
app.use(flatiron.plugins.http)
app.use(fipassport)

// routes
app.router.get('/auth/google', fipassport.authenticate('google'))
app.router.get('/auth/google/return', function(){
  fipassport.authenticate('google', {failureRedirect: '/login'})
  this.res.redirect('/')
})
app.router.get('/', function(){
  console.log(this.req.user)
  if (!this.req.isAuthenticated()) this.res.redirect('/login')
  this.res.end('hi!' + JSON.stringify(this.req.user, null, 2))
})
app.router.get('/login', function(){
  this.res.redirect('/auth/google')
  this.res.end('<a href="/auth/google">click to login</a>')
})

app.start(port)
