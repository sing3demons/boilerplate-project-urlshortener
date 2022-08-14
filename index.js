require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const dns = require('dns')

const bodyParser = require('body-parser')

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

app.get('/api/shorturl/:id', async (req, res) => {
  const { id } = req.params

  const links = link.find(({ short_url }) => Number(short_url) === Number(id))

  if (typeof links === 'undefined') {
    console.log(links)
    return res.json({ error: 'not url' })
  }

  return await res.redirect(links.original_url)
})

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body
  let regex = /https:\/\/www.|http:\/\/www.|https:\/\//g

  dns.lookup(url.replace(regex, ''), (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' })
    } else {
      short_url++

      let resp = { original_url: url, short_url }
      link.push(resp)
      return res.json(resp)
    }
  })
})

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
