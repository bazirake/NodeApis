
const express=require("express");
const getConnection=require("./db_config");
const cors=require('cors');
const app=express();
//JSON parser middleware
app.use(express.json());
const runningp=5000;
app.use(cors())//Allow all origins (for development)
app.get("/",(req,res)=>{
     res.send("Node js api Serv");
 });

const conn=getConnection();
conn.connect().then(()=>console.log("connected:")).catch((err)=>console.log(err));
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

app.get("/user",(req,res)=>{
    const results='SELECT name,id FROM public.user';
    conn.query(results,(err,result)=>{
        if (err) {
           res.send(err);
        } else {
            res.send(result.rows);
        }
    });
});

app.get("/category",(req,res)=>{
const category='SELECT name, id FROM public.category';
conn.query(category,(err,result)=>{
 if(err){
    res.send("error"+err);
 } else{
    res.send(result.rows);
 }
});

});

app.get("/content",(req,res)=>{
const content='SELECT title, subtitle,content,subcontent, id, cid FROM public.course';
conn.query(content,(err,result)=>{
 if(err){
    res.send("error"+err);
 } else{
    res.send(result.rows);
 }
});
});

app.get("/content/:id",(req,res)=>{
 const id=req.params.id;
 const content='SELECT title, subtitle, content, subcontent, id, cid,image FROM public.course where cid=$1';
 conn.query(content,[id],(err,result)=>{
    if (err) {
        res.send("err"+err);
    } else{
       res.send(result.rows)
    }
})
});
 app.post("/student",(req,res)=>{
  const{fname,email,tel,country,terms,cid,conid}=req.body;
  const student='INSERT INTO public.student(fname,email,tel,country,terms,cid,conid) VALUES ($1,$2,$3,$4,$5,$6,$7)';
  conn.query(student,[fname,email,tel,country,terms,cid,conid],(err,result)=>{
   if (err) {
    res.send(err);
   } else {
    res.send({message:"Course applied successfully"});
   }
  }); 
});

app.get("/student-course",(req,res)=>{
    const stcourse='SELECT id, fname, email, tel, country, terms, cid, conid FROM public.student';
    conn.query(stcourse,(err,result)=>{
      if (err) {
        res.send({errorm:err});
      } else {
        res.send(result.rows);
      }
    });
});

app.post("/contact",(req,res)=>{
 const{name,email,subjects,message}=req.body;
 const contact='INSERT INTO public.contacts(name,email,subjects,message) VALUES($1,$2,$3,$4)';
 conn.query(contact,[name,email,subjects,message],(err,result)=>{
 if(err){
    res.send({errormessage:err})
  }else{
    res.send({message:"message has been sent"})
  }
 })
});

app.get("/get-contact",(req,res)=>{
    const contact='SELECT id,name,email,subjects,message FROM public.contacts';
    conn.query(contact,(err,result)=>{
       if (err) {
        res.send({errorMessage:err});
       } else {
        res.send(result.rows);
       }
    });
});

 app.post("/iptracker",(req,res)=>{
  const{ip,page,country,timest,city,region,org,timezone, network,latitude,
    longitude,languages,currency_name,country_capital}=req.body;
  const qweryx='INSERT INTO public.iptracker(ip,page,country,timest,city,region,org,timezone, network,latitude,longitude,languages,currency_name,country_capital)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)'
  conn.query(qweryx,[ip,page,country,timest,city,region,org,timezone, network,latitude,
    longitude,languages,currency_name,country_capital],(err,result)=>{
     if(err){
       res.send({errorm:err}); 
      }else{
      res.send({message:'ip tracker have been recorded successully'});
      }
   });
  });
 app.get("/getTracker",(req,res)=>{
    const qwery='SELECT * FROM public.iptracker';
    conn.query(qwery,(err,result)=>{
  if (err) {
    res.send({messageerr:err});
  } else {
    res.send(result.rows); 
  }
    });
 });

 app.get("/detail/:id/:cid",(req,res)=>{
  const id=req.params.id;
   const cid=req.params.cid;
 const sqld='SELECT title,subtitle,content,subcontent,id,cid FROM public.course where id=$1 and cid=$2';
 conn.query(sqld,[id,cid],(err,result)=>{
    if(err){
      res.send({errmess:err});
    }else{
      res.send(result.rows);
    }
 });
 });

 const PORT=runningp;
   app.listen(PORT,()=>{
    console.log(`server is running http://localhost:${PORT}`);
 });






