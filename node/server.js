const express= require('express');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const Clarifai= require('clarifai');


const db= knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'kamilaszabela',
    password : '',
    database : 'face'
  }
});


const app= express();
app.use(bodyParser.json());
app.use(cors());

 
app.get('/', (req, res)=> {
    res.send(database.users)
})


const app1 = new Clarifai.App({
 apiKey: '9599c39a61ae4479867dfbffb4dd1053'
});


app.post ('/imageurl', (req, res)=>{
    app1.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data=>{
            res.json(data);
        })
        .catch(err=>res.status(400).json('API isssue'))
})


app.post('/signin', (req, res)=>{
    const {email, password}= req.body
    if (!email || !password){
        return res.status(400).json('incorrect register')};
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data=>{
        const isValid=bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
                .where('email', '=', email)
                .then(user=> {
                    res.json(user[0])
                })
                .catch(err=> res.status(400).json('unable to get user'))
        }else
        {res.status(400).json('wrong datails')}
    })
        .catch(err=> res.status(400).json('wrong details'))   
})

app.post('/register', (req, res)=> {
    const {email, name, password}= req.body;
    if (!email || !name || !password){
        return res.status(400).json('incorrect register');
    }
    const hash= bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    db.transaction( trx=>{
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
            })
            .then(user=> {
                res.json(user[0]);
            })
        })
            .then(trx.commit)
            .catch(trx.rollback)
        })   
        .catch(err=> res.status(400).json('you cannot be register'))
})

app.get('/profile/:id', (req, res)=>
    { const {id}= req.params;
    db.select('*').from('users').where({id})
    .then(user=>{
        if (user.length){
            res.json(user[0])
        }
        else{
            res.status(400).json('not such user')
        }
    })
    .catch(err=> {res.status(400).json('error getting user')
        })}
 )

app.put('/image', (req, res)=>{
    const {id}= req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0]);
    })
    .catch(err=> res.status(400).json('unable to get result'))
    
})

app.listen(3003, ()=> {
    console.log('app is running on port 3003')
}) 