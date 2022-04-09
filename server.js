const express = require('express');
const app = express();
const PORT = 3000;
const querystring = require('querystring')
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://127.0.0.1:27017";
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.get('/', (req, res) => {
    res.send('index.html');
});


app.post('/edit',(req,res)=>{




    
MongoClient.connect(mongourl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("vacation");
    var myquery = { email : req.body.email };
    var newvalues = { $set: {name: req.body.name , cindate : req.body.cin , coutdate : req.body.cout , noguest : req.body.noguest, nochildren : req.body.nochildren } };
    dbo.collection("booking").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    
    });
  }); 
   
  res.redirect('/bookings.html')
})


app.get('/delete',(req,res)=>{

    MongoClient.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            return console.log(err);
        }
    
        const db = client.db('vacation');
        var myquery = { email: req.query.email };
        db.collection("booking").deleteOne(myquery , function(err, obj) {
            if (err) throw err;
       res.redirect('/bookings.html')
          });
       
       
    });


})

app.get('/bookings',(req,res)=>{
    MongoClient.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            return console.log(err);
        }
    
        const db = client.db('vacation');
        db.collection('booking').find().toArray().then((data)=>{
            res.json(data);
        });
       
       
    });


    
    
})

app.post('/book',(req,res)=>{
 

    MongoClient.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            return console.log(err);
        }
    
        const db = client.db('vacation');
     db.collection('booking').insertOne(req.body).then(()=>{
         
     });


     db.collection('customers').insertOne(req.body).then(()=>{
         
    });
    

       
    });


    res.redirect('/bookings.html')
})

app.get('/gethotels', (req, res) => {
    

var location = req.query.place;
    MongoClient.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            return console.log(err);
        }
    
        const db = client.db('vacation');
        var query = { location: location.toLocaleLowerCase() };
        db.collection("hotels").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
           
          });


       
    });




});




app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
