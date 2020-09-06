const express= require('express');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const Clarifai= require('clarifai');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const db= knex({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST || '127.0.0.1',
    user : process.env.DB_USER || '',
    password : process.env.DB_PASSWORD || '',
    database : process.env.DB_NAME || 'face'
  }
});


const app= express();
app.use(bodyParser.json());
app.use(cors());

 
app.get('/', (req, res)=> {
    res.send('it is working')
})

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;

const app1 = new Clarifai.App({
 apiKey: CLARIFAI_API_KEY
});


app.post ('/api/imageurl', (req, res)=>{
    app1.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data=>{
            res.json(data);
        })
        .catch(err=>res.status(400).json('API isssue'))
})


app.post('/api/signin', (req, res)=>{
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

app.post('/api/register', (req, res)=> {
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
        .catch(err=> {
            console.log(err)
            res.status(400).json('you cannot be register')
        })
})

app.get('/api/profile/:id', (req, res)=>
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
    .catch(err=> {
        console.log(err)
        res.status(400).json('error getting user')
    })}
 )

app.put('/api/image', (req, res)=>{
    const {id}= req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0]);
    })
    .catch(err=> res.status(400).json('unable to get result'))
    
})

const port = process.env.PORT || 3003
app.listen(port, ()=> {
    console.log(`app is running on port ${port}`)
}) 