const express = require('express')
const app = express()
const port = 3001
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

//session
app.use(session({
  secret: 'kotak',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true
   }
}))
app.use('/', require('./routers'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})