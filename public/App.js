const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(bodyParser.urlencoded({extended:true}));

app.post("/",function(req,res){
    if (req.body.tag == "expense"){
        console.log(Number(req.body.val));
        if (String(req.body.ExpenseType) == "Select Expense Type" || req.body.val == "" || isNaN(Number(req.body.val))){
            res.sendFile(__dirname+"/hub.html");
        }else{
            var date;
            if (req.body.expDate == "Invalid Date"){
                date = new Date();
            }else{
                let temp = Date.parse(req.body.expDate.replace("-","/"));
                date = new Date(temp);
                date.setHours(12);
            }
            const data = req.body.val+","+req.body.ExpenseType+","+date;
            fs.appendFile('Data.txt',data+"\n",(error)=>{if (error) throw error;});
            res.sendFile(__dirname+"/hub.html");
        }
    }else if (req.body.tag == "goal"){
        if (req.body.Start == "" || req.body.End == "" || req.body.Amount == ""){
            res.sendFile(__dirname+"/hub.html");
        }
        let temp1 = Date.parse(req.body.Start.replace("-","/"));
        date1 = new Date(temp1);
        date1.setHours(12);
        let temp2 = Date.parse(req.body.End.replace("-","/"));
        date2 = new Date(temp2);
        date2.setHours(12);
        fs.appendFile("Data.txt","Goal,"+date1+","+date2+","+req.body.Amount+"\n",(error)=>{if (error) throw error;});
        res.sendFile(__dirname+"/hub.html");
    }else if (req.body.tag == "remove"){
        console.log("Hey");
        fs.readFile("Data.txt",'utf-8',function(err,data){
            console.log("Hey");
            if (err) {throw err};
            var lines = data.split("\n");
            var linesDup = [];
            var id = Number(req.body.identity);
            var lineNum = 0;
            for (let i=0; i<lines.length;i++){
                if (lines[i].substring(0,4)=="Goal"){
                    if (id==0){
                        lineNum=i;
                        break;
                    }
                    id --;
                }
                linesDup.push(lines[i]);
            }
            console.log(linesDup);
            fs.writeFile("Data.txt",linesDup.join("\n")+lines.splice(lineNum+1).join("\n")+"\n",(error)=>{if(error)throw err;});
        });
        res.sendFile(__dirname+"/hub.html");
    }
});

app.use('/css',express.static(__dirname +'/css'));
app.use('/',express.static(__dirname +'/'));
app.use('/',router);
app.listen(process.env.port || 3000);
