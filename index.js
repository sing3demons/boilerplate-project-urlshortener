require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dns = require('dns')
const validURL = require('valid-url')
const bodyParser = require('body-parser')

const app = express()
// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

let link = []
let short_url = 0

app.get('/api/shorturl/:id', (req, res) => {
  try {
    const { id } = req.params

    const links = link.find(({ short_url }) => Number(short_url) === Number(id))

    if (links) {
      return res.redirect(links.original_url)
    }

    return res.status(404).json('No URL found')
  } catch (error) {
    console.log(err)
  }
})

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body
  console.log(validURL.isWebUri(url))

  if (validURL.isWebUri(url) === undefined) {
    res.json({ error: 'invalid url' })
  } else {
    try {
      dns.lookup(validURL.isWebUri(url), (err, address, family) => {
        short_url++

        let resp = { original_url: url, short_url }
        link.push(resp)
        return res.json(resp)
      })
    } catch (err) {
      console.log(err)
    }
  }
})

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
