
const express=require("express");
const getConnection = require("./db_config");
const app=express();
app.use(express.json());
const runningp=3000;

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

const content='SELECT title, subtitle, content, subcontent, id, cid FROM public.course';
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
 const content='SELECT title, subtitle, content, subcontent, id, cid FROM public.course where cid=$1';
 conn.query(content,[id],(err,result)=>{
    if (err) {
        res.send("err"+err);
    } else{
         res.send(result.rows)
    }
})
});

const PORT=runningp;
 app.listen(PORT,()=>{
    console.log(`server is running http://localhost:${PORT}`);
});



//    app.post("/create-course",(req,res)=>{
//     const {title,subtitle,content,subcontent,cid}=req.body;
   
//     const courses='INSERT INTO public.course(title, subtitle, content, subcontent,cid) VALUES ($1,$2,$3,$4,$5)';
//     conn.query(courses,[title,subtitle,content,subcontent,cid],(err,resultX)=>{
//     if(err) {
//     res.status(500).send(err);
// } else {
//     res.send("Now course has been created");
// }
//   });
// });


// app.get("/category",(req,res)=>{
//  const categorys='SELECT name,id from public.category';
//  conn.query(categorys,(err,result)=>{
//      if(err) {
//       res.send(err);
//      } else {
//      res.send(result.rows);
//      }
//  })
// })

// app.get("/getda",(req,res)=>{
//  res.send("hello data APIxxx");
// })

// app.get("/course-content",(req,res)=>{
//    const coursecontent= 'SELECT title, subtitle, content, subcontent, id, cid FROM public.course';
//    conn.query(coursecontent,(err,result)=>{
//      if(err){
//          res.send('Dabase error:'+err);
//      }else{
//          res.status(200).json(result.rows);
//      }
//    });
// });

// app.get("/course-content/:id",(req,res)=>{
//     const id=req.params.id;
//     const coursecontent= 'SELECT title, subtitle, content, subcontent, id, cid FROM public.course where cid=$1';
//     conn.query(coursecontent,[id],(err,result)=>{
//      if (err) {
//          res.send('Dabase error:'+err)
//      } else {
//          res.status(200).send(result.rows);
//      }
//    });
// });


//  app.listen(process.env.PORT || 3000,()=>{
//      console.log("Server is running");
// });




