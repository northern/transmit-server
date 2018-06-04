
import express from 'express'
import HttpStatus from 'http-status-codes'

const router = express.Router()

router.get('/', (req, res) => {
  return res.sendStatus(HttpStatus.ACCEPTED)
})

export default router
