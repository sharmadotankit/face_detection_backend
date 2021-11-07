import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());

const database = {
	users:[
	{
		id:100,
		name:"Ankit",
		email:"ankit@gmail.com",
		password:"ankit@123",
		entries:0,
		joined:new Date(),
	},
	{
		id:101,
		name:"Akhilesh",
		email:"akhilesh@gmail.com",
		password:"akhilesh@123",
		entries:0,
		joined:new Date(),
	}
	]
}



app.get('/',(req,res)=>{
	res.send(database.users);
})


app.post('/signin',(req,res)=>{
	// console.log(req.body);
	//BRCRYPT PART 
// 	bcrypt.compare(req.body.password, '$2b$10$cGoOt5OOmZvtRhqWS0RTUuOHBK7N3uPYBgmwJoXzzEcLzuN6nfcni', function(err, result) {
//     console.log("matching",result)
// });
// bcrypt.compare('angry', '$2b$10$cGoOt5OOmZvtRhqWS0RTUuOHBK7N3uPYBgmwJoXzzEcLzuN6nfcni', function(err, result) {
//     console.log("false",result)
// });

if(req.body.email=== database.users[0].email && req.body.password ===database.users[0].password){
	return res.json(database.users[0]);
}
return res.status(400).json(null)
})


app.post('/register',(req,res)=>{
	const {name,email,password}=req.body;

	// bcrypt.hash(password, saltRounds, function(err, hash) {
	// 	console.log(hash);
	//     database.users.push({
	// 		id:102,
	// 		name:name,
	// 		password:hash,
	// 		email:email,
	// 		entries:0,
	// 		joined: new Date()
	// 	})
	// 	res.send(database.users[database.users.length-1]);
	// });	


	try{
		database.users.push({
			id:102,
			name:name,
			password:password,
			email:email,
			entries:0,
			joined: new Date()
		})
		return res.send(database.users[database.users.length-1]);
	}
	catch{
		return res.status(503).send({Error:"Could not register user!"});
	}
	
})


app.get('/profile/:id',(req,res)=>{
	let {id} = req.params;
	id=Number(id);
	// console.log(typeof id);
	database.users.map(user=>{
		if(user.id===id){
			return res.json(user);
		}
	})
	res.status(404).send("no such user");
})


app.put('/image',(req,res)=>{
	let {id} = req.body;
	id=Number(id);
	console.log(id);
	let found = false;
	database.users.map(user=>{
		if(user.id===id){
			found=true;
			user.entries++;
			return res.json(user.entries);
		}
	})

	if(!found){
		return res.json(null);
	}
})




app.listen(3001,()=>{ console.log("app is running in port 3001")});