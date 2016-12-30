import { Router } from 'express'
import path from 'path'

import config from '../config'

const router = Router()

router.get('/demo-items', (req, res, next) => {
  let items = []
  const length = Math.floor(128*Math.random())
  for (let i = 0; i < length; i++)
    items.push({ id: i, name: 'demo-item: ' + i, url: config.EXTERNAL_URL + path.resolve('/' + config.WEBAPP_PREFIX, `demo-items/${i}`)})
  res.json(items)
})

router.get('/demo-items/:id', (req, res, next) => {
  const id = req.params.id
  let rand = Math.floor(1e7*Math.random())
  const item = { id: id, name: 'item: ' + id, rand: rand, url: path.resolve('/', config.WEBAPP_PREFIX, `demo-items/${id}`)}
  res.json(item)
})

module.exports = router   // TODO how to es6 export?
