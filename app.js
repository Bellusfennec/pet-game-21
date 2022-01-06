console.log('hello');

const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const mysql = require("mysql2")
const app = express()

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "bellus0a_zerda",
//     password: "&lQyPzx5"
//   });
//   connection.connect(function(err){
//     if (err) {
//       return console.error("Ошибка: " + err.message);
//     }
//     else{
//       console.log("Подключение к серверу MySQL успешно установлено");
//     }
//  })









const CONTACTS = [
    {id: v4(), name: 'Нияз', value: '891700022200', marked: false}
]

app.use(express.json())

app.get('/api/contacts', (req, res) => {
    res.status(200).json(CONTACTS)
})

app.post('/api/contacts', (req, res) => {

    // console.log(req.body)
    const contact = {...req.body, id: v4(), marked: false}
    CONTACTS.push(contact)
    res.status(201).json(contact)
})

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(3000, () => console.log('Server has been started...'))

// const PORT = process.env.PORT || 3000
// const http = require('http');

// let server = http.createServer(function(req, res) {
// res.writeHead(200, { 'Content-Type': 'text/plain' });
// res.end('Hello World!!');
// });

// server.listen(PORT, () => console.log('Server has been started...'))

