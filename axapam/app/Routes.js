'use strict'

var axios = require('axios');
var express = require('express');
var webRoute = express.Router();


var CONST_PARAM_MAP = {
    "HW01" : "hw01",
    "HW02" : "hw02",
    "HW03" : ["hw03","hw03Remark"],
    "1540" : "hw03Lose",
    "1543" : "hw03Gain",
    "INS01" : ["ins01","ins01Remark"],
    "INS02" : ["ins02","ins02Remark"],
    "LIFESTYLE01" : ["lifestyle01","lifestyle01Remark"],
    "270" : "lifestyle01Consume",
    "LIFESTYLE02" : ["lifestyle02","lifestyle02Remark"],
    "1081" : "lifestyle02Consume",
    "LIFESTYLE03" : ["lifestyle03","lifestyle03Remark"],
    "FAMILY01" : ["family01","family01Remark"],
    "HEALTH01" : ["health01","health01Remark"],
    "1438" : ["health01Disabled","health01DisabledRemark"],
    "1439" : "health01Describe"
}

webRoute.route('/get/:id').get(function(req,res,next){

    let queriesCall = {
        method: "post",
        url: "http://localhost:8080/kie-server/services/rest/server/containers/medical-flow_1.0.0/processes/medical-flow.get_questionaire/instances",
        headers: { "accept":"application/json" , "content-type" : "application/json" },
        data : {
            "answer" : {
                "com.axaspace.medical_flow.Answer" : {"questionId":req.params.id}
            }
        },
        auth:{username:'rhpamAdmin', password:"p@ssw0rd"}
    }

    let queriesFetch = {
        method: "get",
        url: "http://localhost:8080/kie-server/services/rest/server/queries/processes/instances/",
        headers: { "accept":"application/json" , "content-type" : "application/json" },
        auth:{username:'rhpamAdmin', password:"p@ssw0rd"}
    }


    axios(queriesCall).then(function(responseQueries){
        console.log(responseQueries.data);
        queriesFetch.url = queriesFetch.url + responseQueries.data + "/variables/instances";

        axios(queriesFetch).then(function(responseFetch){
            let item = responseFetch.data['variable-instance'].find(function(e){ return e.name === 'answer';});

            if(item!= null){
                console.log(item.value);
                res.status(200).json(item.value);
            }

        }).catch(function(responseFetch){
            console.log('Fetch Error');
        });

    }).catch(function(responseQueries){
        console.log("Error Happen");
    });

});




webRoute.route('/submit').post(function(req,res,next){
    console.log(req.body);
    console.log(CONST_PARAM_MAP["hello"]);

});

module.exports = webRoute;
