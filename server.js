let express = require('express')
let request = require('request')
let querystring = require('querystring')

const cors = require("cors");

let app = express()

app.use(
  cors("http://localhost:3000")    // TODO: CORRECT
)

// let redirect_uri = 
//   process.env.REDIRECT_URI || 
//   'https://spoofyclean.herokuapp.com/callback'

// TODO: Change back to the above when done with localhost
let redirect_uri = 'https://localhost:3000/callback';
  

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope:  'user-read-playback-position ' +
              'user-read-private ' +
              'user-read-email ' +
              'playlist-read-private ' +
              'user-library-read ' +
              'user-library-modify ' +
              'user-top-read ' +
              'playlist-read-collaborative ' +
              'playlist-modify-public ' +
              'playlist-modify-private ' +
              'ugc-image-upload ' +
              'user-follow-read ' +
              'user-follow-modify ' +
              'user-read-playback-state ' +
              'user-modify-playback-state ' +
              'user-read-currently-playing ' +
              'user-read-recently-played',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.headers.code;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    // Spotify has responded with token, now send it to Frontend
    res.send({
      access_token: body.access_token,
      expires_in: body.expires_in,
      refresh_token: body.refresh_token 
    })
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)