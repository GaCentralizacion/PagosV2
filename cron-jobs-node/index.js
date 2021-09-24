const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

app = express();

const Request = require("request");
console.log('revisando');

cron.schedule('* * * * *', function() {
    console.log('CRON');

    var url='http://192.168.20.89/PagosApi/api/pagoapi/?id=15%7C1%7C10423';
    
    Request.post(url,  (error, response, body) => {
        if (!error) {
            console.log('body',body);
        }else{
            console.log('error', error);
        };
    });
  });


  app.listen(3128);
