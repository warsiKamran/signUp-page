const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");          //The request module uses the http module and adds a lot of sugar to make it easier to digest: A lot of common cases can be handled with just a tiny bit of code, it supports piping request data, forwarding requests to a different server, etc.

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static("public"));                 //if we want to show images as well as css when calling port 3000
                                                  //we also have to specify the name of the folder here it is "public"


app.use(express.static(__dirname + "/public/"));


app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.mail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                } 
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/bfc4b6e836";

    const options = {
        method: "POST",
        auth: "kamran2:5e7e39892f1363f57f0f3a43475aa373-us21"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }

        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app