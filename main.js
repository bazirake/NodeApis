require("dotenv").config();
const {Client}=require("pg");
const express=require("express");
const app=express();
app.use(express.json());

const runningp=3000;

const conn=new Client({
  host:process.env.HOST,
  user:process.env.USER,
  port:process.env.PORT,
  password:process.env.PASSWORD,
  database:process.env.DATABASE,
  ssl:{
       rejectUnauthorized: false // Accept self-signed certs (ok for Render)
  },
   idleTimeoutMillis: 30000, // optional
});

conn.connect().then(()=> console.log("connection succeeds")).catch((err)=>console.log(err));
app.post("/create-user",(req,res)=>{
    const{name,id}=req.body;
    const userss='INSERT INTO public.user (name,id) values($1,$2)';
    conn.query(userss,[name,id],(err,result)=>{
        if(err){
            res.send(err)
        } else{
            console.log(result);
            res.send("posted data");
        }
    })
});

   app.post("/create-course",(req,res)=>{
    const {title,subtitle,content,subcontent,cid}=req.body;
   
    const courses='INSERT INTO public.course(title, subtitle, content, subcontent,cid) VALUES ($1,$2,$3,$4,$5)';
    conn.query(courses,[title,subtitle,content,subcontent,cid],(err,resultX)=>{
    if(err) {
    res.status(500).send(err);
} else {
    res.send("Now course has been created");
}
  });
});


app.get("/category",(req,res)=>{
 const categorys='SELECT name,id from public.category';
 conn.query(categorys,(err,result)=>{
     if(err) {
      res.send(err);
     } else {
     res.send(result.rows);
     }
 })
})

app.get("/course-content",(req,res)=>{
   const coursecontent= 'SELECT title, subtitle, content, subcontent, id, cid FROM public.course';
   conn.query(coursecontent,(err,result)=>{
     if(err){
         res.send('Dabase error:'+err);
     }else{
         res.status(200).json(result.rows);
     }
   });
});

app.get("/course-content/:id",(req,res)=>{
    const id=req.params.id;
    const coursecontent= 'SELECT title, subtitle, content, subcontent, id, cid FROM public.course where cid=$1';
    conn.query(coursecontent,[id],(err,result)=>{
     if (err) {
         res.send('Dabase error:'+err)
     } else {
         res.status(200).send(result.rows);
     }
   });
});

 app.get("/",(req,res)=>{
     res.send("Node js api Server");
 });

 app.listen(3000,()=>{
    console.log( "server is running http://localhost:3000");
});



