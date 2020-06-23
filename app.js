const mongoose = require("mongoose");
const express=require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/StudentsDB",{useUnifiedTopology: true,useNewUrlParser:true});

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please check your data entry no name specified"]
    },
    age:{
        type:Number,
        required:[true,"Please check your data entry no age specified"]
    },
    standard:{
        type:Number,
        required:[true,"Please check your data entry no standard specified"]
    }
});
 
const Student = mongoose.model("Student",studentSchema);

const Rohan =new Student({
    name:"Rohan",
    age:14,
    standard:8
});

const Vishwas =new Student({
    name:"Vishwas",
    age:15,
    standard:9
});

const Yashwanth =new Student({
    name:"Yashwanth",
    age:16,
    standard:10
});

//Student.insertMany([Rohan,Yashwanth,Vishwas],function(err){
    //if(err){
        //console.log(err);

    //}else{
        //console.log("Successfully saved pa");
    //}
//});

//Request targetting all Students//

app.route("/students")
.get(function(req,res){
    Student.find(function(err,foundStudents){
      if(err){
          console.log(err);
      }else{
          console.log(foundStudents);
      }  
      
    });
})
.post(function(req,res){
    console.log(req.body.name);
    const newStudent=new Student({
  name:req.body.name,
  age:req.body.age,
  standard:req.body.standard   
 });
 newStudent.save(function(err){
     if(err){
         res.send(err);
     }else{
         res.send("successfully added student");
     }
     
 });
 
 })
 .delete(function(req,res){
    Student.deleteMany(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("All student data has been deleted");
        }
    });
});

//Request targeting specific student//
app.route("/students/:studentName")

.get(function(req,res){
   
    Student.findOne({name:req.params.studentName },function(err,foundStudent){
        if(err){
            res.send("no Student found by the params you specified") ; 
        }else{
            res.send(foundStudent);
        }
    });
    
    
})
.put(function(req,res){
    Student.update(
        {name:req.params.studentName},
        {name:req.body.name,age: req.body.age,standard:req.body.standard},
        {overwrite:true},
        function(err){
            if(err){
                res.send(err);
            }
            else{
               res.send("student updated successfully");
        }
    });
})
.patch(function(req,res){
Student.update(
    {name:req.params.studentName},
    {$set:req.body},
    function(err){
        if(err){
            res.send(err);
        }
        else{
           res.send(" updated successfully");
    }
});

})
.delete(function(req,res){
    Student.deleteOne(
        {name:req.params.studentName},
function(err){
        if(err){
            res.send(err);
        }else{
            res.send("successfully deleted");
        }
    });
    
});


app.listen(3000,function(){
    console.log("server started at port 3000");
});