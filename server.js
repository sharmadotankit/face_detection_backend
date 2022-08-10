import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import bodyParser from 'body-parser';
import knex from 'knex';

const db = knex({
	client:'pg',
	connection:{
		host:'127.0.0.1',
		user:'postgres',
		password:'postgres',
		database:'smart-brain'
	}
})


const app = express();
const saltRounds = 10;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());




app.get('/',(req,res)=>{
	res.send(database.users);
})


app.post('/signin',(req,res)=>{
	const {email,password} = req.body;
	console.log(email+" "+password);

	db.select('email','hash')
	.from('login')
	.where('email','=', email)
	.then(data=> 
		{
			const isValid = bcrypt.compareSync(password, data[0].hash);
			// console.log(data[0].hash);
			if(isValid){
				console.log(isValid)
				return db.select('*')
				.from('users')
				.where('email','=',email)
				.then(user=>{
					console.log(user[0]);
					res.json(user[0]);
				})
				.catch(err => res.status(400).json('unable to get user'));
			}
			else{
				res.status(400).json('Wrong credentials');
			}
		}).catch(err => res.status(400).json('Wrong credentials'));
});


app.post('/register',(req,res)=>{
	const {name,email,password}=req.body;

	const passwordHash = bcrypt.hashSync(password, saltRounds, function(err, hash) {
		return hash;
	});

	db.transaction(trx=>{
		trx.insert({
			hash:passwordHash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return  trx('users')
					.returning('*')
					.insert({
						name:name,
						email:loginEmail[0].email,
						joined: new Date()
					})
					.then(user=>{
						res.json(user[0]);
					})
					.then(trx.commit)
					.catch(trx.rollback)
		}).catch(err=> res.status(400).json('Unable to register'));
	}).catch(err=> res.status(400).json('Unable to register'));


	
})


app.get('/profile/:id',(req,res)=>{
	let {id} = req.params;

	db.select('*').from('users').where({id})
	.then(user=> {
		if(user.length){
			res.status(200).json(user[0])
		}
		else{
			res.status(404).json("User not found")
		}}
		)	
})


app.put('/image',(req,res)=>{
	let {id} = req.body;

	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries =>{
		res.json(entries[0].entries);
	}).catch(err => res.status(400).json('Unable to get the entries'))

})




app.listen(3001,()=>{ console.log("app is running in port 3001")});