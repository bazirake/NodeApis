
const express=require("express");
const getConnection=require("./db_config");
require("dotenv").config();
const cors=require('cors');
const app=express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
//JSON parser middleware
app.use(express.json());
app.use(cookieParser());//to parse cookies
const runningp=5000;
app.use(cors(
{
  origin:['http://localhost:3000','https://etech-kappa.vercel.app'],
  credentials:true
}
))//Allow all origins (for development)
 
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
// Example route using JWT
app.post('/loginAuthe', (req, res) => {
  const { emails, passwords } = req.body;

  const query = 'SELECT id,cateid,contid,fname,emails,usertype,country FROM public."Courseapp" WHERE emails=$1 AND passwords=$2 order by id desc';
  conn.query(query,[emails, passwords],(err, result)=>{
    if(err){
       return res.status(500).json({message:'Database error'});
    }

    if(result.rows.length===0){
       return res.status(401).json({message:'Email or Password is incorrect'});
    }
    
    const user=result.rows[0];
    const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30min'});
    res.cookie('token',token,
      {
         httpOnly:true,
         secure:true, 
         sameSite:"None"// allow cross site request
      });//secure:true only for HTTPS
    res.json({message:'Logged in successfully',user});
  });
});

app.get('/logout',(req, res) =>{
    res.clearCookie('token',{
    httpOnly:true,
    secure:true,
    sameSite:"None"
  });
  res.json({ message:'Logged out successfully'});
});

app.get('/getinfo',(req,res) => {
  const token = req.cookies.token; //<--- This is how you access it
  if (!token) return res.sendStatus(401);

  // Verify token
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err, user) =>{
    if(err) return res.sendStatus(403);
    req.user = user;
    res.send(user);
  });
});

//  app.post("/LoginAuth",(req,res)=>{ 
//    const passwords=req.body.passwords;
//    const emails=req.body.emails;
//    const user={password:passwords,email:emails}
//    const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,
//     {expiresIn:'30min'})
//   res.json({accessToken:accessToken});
//  });

//   app.get('/protected', authenticationToken,(req,res) =>{
//    res.json(req.user)
//   });



//  function authenticationToken(req,res,next) {
//     //const authHeader=req.headers['authorization']
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if(token==null) return res.sendStatus(401)//No token = unauthorized
//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
//     if(err) return res.sendStatus(403) //Invalid token
//     req.user=user
//     next();
//     });
// }

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
    }else{
     const resultss=result.rows;
     res.send(resultss);
   }
  });
  });

app.get("/ ",(req, res)=>{
  const token = req.cookies.token; // Get token from HTTP-only cookie
  if(!token) return res.sendStatus(401); // No token = Unauthorized
  // Verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if (err) return res.sendStatus(403);// Invalid/expired token = Forbidden
    // SQL query to get course content
    const content = 'SELECT title, subtitle, content, subcontent, id, cid FROM public.course';

    conn.query(content, (err, result) => {
      if (err) {
        res.status(500).send("error: " + err); // Internal error
      } else {
        const resultss = result.rows;
        res.json({
          userinfo: user,  // user info from token
          resultss: resultss // course data from DB
        });
      }
    });
  });
});

app.get("/content/:id",(req,res)=>{
 const id=req.params.id;
 const content='SELECT title, subtitle, content, subcontent, id, cid,image FROM public.course where cid=$1';
 conn.query(content,[id],(err,result)=>{
    if (err){
        res.send("err"+err);
    } else{
       res.send(result.rows)
    }
})
});


app.get("/contentAuth/:id", (req, res) => {
  const id=req.params.id;
  const token=req.cookies.token; // Get token from HTTP-only cookie

  if(!token) return res.sendStatus(401); // Unauthorized (No token)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user) => {
     if(err) return res.sendStatus(403); // Forbidden (Invalid/expired token)

     const contentQuery =`
      SELECT title, subtitle, content, subcontent, id, cid, image 
      FROM public.course 
      WHERE cid = $1 `;
    conn.query(contentQuery, [id],(err, result)=>{
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Database error: " + err);
      }
      res.json({
        userinfo:user,// Decoded user from JWT
        resultss:result.rows// Matching course content
      });
    });
  });
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

  app.post("/courseapp",(req,res)=>{
    const {cateid,contid,usertype,fname,email,tel,country,password}=req.body;
   const query='INSERT INTO public."Courseapp" (cateid, contid, usertype, fname, emails, tel, country, passwords) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)';
   conn.query(query,[cateid,contid,usertype,fname,email,tel,country,password],(err,result)=>{
     if(err){
      res.send(err);
     } else { 
      res.send({message:"Course applied successfully"});
     }
   });  
  });

   app.get("/getusercourse/:email",(req,res)=>{
     const email=req.params.email;
     const token=req.cookies.token; // Get token from HTTP-only cookie
     if(!token) return res.sendStatus(401); // Unauthorized (No token)
     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user) => {
     if(err) return res.sendStatus(403);//Forbidden (Invalid/expired token)
     const query='SELECT * FROM public."Courseapp" cc INNER JOIN public.course BB ON cc.contid::bigint=BB.id WHERE cc.emails=$1';
     conn.query(query,[email],(err,result)=>{
        if(err){
          res.status(500).send({message:err});
        }
        else{
          res.status(200).send(result.rows);
        }
     })
   }
  )
   });

  app.post("/Login",(req,res)=>{
    const {emails,passwords}=req.body;

   const query = 'SELECT emails, passwords FROM public."Courseapp" WHERE emails = $1 AND passwords = $2';
    conn.query(query,[emails,passwords],(err,result)=>{
    if(err){
     res.status(500).send({message:"Database error",message:err});
   }else {
    if(result.rows.length > 0) {
      res.send({message:"Login successful"});
    }
    else{
      res.status(401).send({message:"email or password does not match"});
    }
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

 
 app.get("/detailAuth/:id/:cid",(req,res)=>{
  const id=req.params.id;
   const cid=req.params.cid;
  const token = req.cookies.token; // Get token from HTTP-only cookie

  if (!token) return res.sendStatus(401); // Unauthorized (No token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user) => {
    if (err) return res.sendStatus(403); // Forbidden (Invalid/expired token)
   const sqld='SELECT title,subtitle,content,subcontent,id,cid FROM public.course where id=$1 and cid=$2';
   conn.query(sqld,[id,cid],(err,result)=>{
    if(err){
      res.send({errmess:err});
    }else{
      res.json({
        userinfo:user, // Decoded user from JWT
        resultss:result.rows   // Matching course content
      });
    }
 });
 });
  }
);

 const PORT=runningp;
   app.listen(PORT,()=>{
    console.log(`server is running http://localhost:${PORT}`);
 });






