<template>
  <div id="app">
    <div class="container" v-if="question!=null">
     
      <!-- FIRST LEVEL -->
      <form class="form-horizontal">
        <fieldset>
          <template v-for="(item  , index) in question.childQuestions">
            <template v-if="isLabel(item)">
              <legend style="margin-bottom: 0px !important">{{item.strValue}}</legend>
              <hr style="margin-top:0px !important" />
            </template>

            <template v-if="!isLabel(item)">
              <div class="form-group row">
                <label class="col-md-5 control-label" >{{item.strValue}}</label>  
                
                <template v-if="isShortText(item)">
                  <div class="col-md-3">
                    <input v-model="question.childQuestions[index].answer"  type="text"  class="form-control input-md ">
                  </div>
                </template>


                <template v-if="isBoolean(item)">
                  <div class="col-md-5">
                      <div class="input-group mb-5">
                        <div class="input-group-prepend">
                          <div class="input-group-text">
                              <input v-model="question.childQuestions[index].checkAnswer" type="checkbox" true-value="yes" false-value="no" v-on:change="toggleCheckbox(question.childQuestions[index])">
                          </div>
                        </div>
                        <input v-model="question.childQuestions[index].answer" type="text" class="form-control" :disabled="!isAnswerChecked(question.childQuestions[index])">
                      </div>
                  </div>
                </template>
              </div>

              <template v-if="question.childQuestions[index].childQuestions != null && isAnswerChecked(question.childQuestions[index])">
                  <template v-for="(childItem  , childIndex) in question.childQuestions[index].childQuestions">


                    <div class="form-group row">
                      <label class="col-md-5 control-label" >{{childItem.strValue}}</label>  
                      <div class="col-md-3">
                          <input v-model="question.childQuestions[index].childQuestions[childIndex].answer"  type="text"  class="form-control input-md ">
                      </div>
                    </div>
                  
                  </template>
              </template>



              
            </template>

          </template>


          <div class="form-group row">
            <div class="btn-group col-md-4">
              <button  v-on:click="populateReject($event)" class="btn btn-danger" >Reject</button>
              <button v-on:click="populateEscalation($event)" class="btn btn-warning" >Escalate</button>
              <button v-on:click="populateApprove($event)" class="btn btn-success" >Approve</button>
            </div>
          </div>
          <div class="form-group row">
          
            <div class="col-md-6">
              <button id="submitfull" v-on:click="submitForm($event)" class="btn btn-primary" style="width: 360px;">Submit </button>
            </div>
          </div>
        </fieldset>
      </form>
     <!--
      <div v-for="item in question.childQuestions" class="row">
        <div class="col-md-12">
          {{item.strValue}}

        </div>
      </div>
     -->

    </div>
  </div>
</template>


<script>
  import axios from 'axios';  
  import bus from "./../bus.js";
  /**
   * == Structure of the question == 
   * questionId
   * strValue ( for the question content)
   * answertType
   * order
   * parentId
   * childQuestions - []
  */

  var CONST_AUTO_FIELD = {
    REJECT : {
      "HW01" : "184",
      "HW02" : "70",
      "HW03" : ["yes","inconsistent"],
      "1540" : "0",
      "1543" : "30 kg",
      "INS01" : ["yes","disability"],
      "INS02" : ["yes","on going"],
      "LIFESTYLE01" : ["yes","heavy smoker"],
      "270" : "40",
      "LIFESTYLE02" : ["yes",""],
      "1081" : "5 bottles",
      "LIFESTYLE03" : ["yes","on going rehabilitation"],
      "FAMILY01" : ["yes","heart disease"],
      "HEALTH01" : ["yes","vision issue"],
      "1438" : ["yes","yes"],
      "1439" : "3 years back"
    },
    APPROVE : {
      "HW01" : "184",
      "HW02" : "70",
      "HW03" : ["no",""],
      "1540" : "",
      "1543" : "",
      "INS01" : ["no",""],
      "INS02" : ["no",""],
      "LIFESTYLE01" : ["no",""],
      "270" : "",
      "LIFESTYLE02" : ["no",""],
      "1081" : "",
      "LIFESTYLE03" : ["no",""],
      "FAMILY01" : ["no",""],
      "HEALTH01" : ["no",""],
      "1438" : ["no",""],
      "1439" : ""
    },
    ESCALATION : {
      "HW01" : "184",
      "HW02" : "70",
      "HW03" : ["no",""],
      "1540" : "",
      "1543" : "",
      "INS01" : ["no",""],
      "INS02" : ["no",""],
      "LIFESTYLE01" : ["no",""],
      "270" : "",
      "LIFESTYLE02" : ["no",""],
      "1081" : "",
      "LIFESTYLE03" : ["no",""],
      "FAMILY01" : ["yes","heart disease"],
      "HEALTH01" : ["yes","vision issue"],
      "1438" : ["yes",""],
      "1439" : "3 years back"
    }


  }


  export default{
    name:'app',
    data(){ return {
      "name":"robin",
      question : null,
    }},
    mounted:function(){
        this.listenEvent();
        this.question = this.createQuestion("base");
        bus.$emit("fetchQuestionaire",this.question);
    },

    methods:{
      isLabel(item){ return item.answerType === 'Label'; },
      isBoolean(item){ return item.answerType === 'Boolean'; },
      isShortText(item){ return item.answerType === 'String'; },
      isLongText(item){ return item.answerType === 'Text'; },

      listenEvent(){
        bus.$on('fetchQuestionaire', ($event) => {
          var item = $event;
          this.getQuestionaire(item);
        })
      },

      isAnswerChecked(item){return item.checkAnswer === "yes"; },
      toggleCheckbox(item){
        if(this.isAnswerChecked(item)){
          if(item.childQuestions == null || item.childQuestions.length == 0){
            bus.$emit("fetchQuestionaire",item);
          }
        }
      },

      createQuestion(id){
        return {
          questionId : id,
          strValue : '',
          answerType: '',
          order : 0,
          parentId : '',
          childQuestions : []
        }
      },

      getQuestionaire(parentQuestion){
        console.log(parentQuestion.questionId);
        let url = "http://localhost:3030/api/question/get/"+parentQuestion.questionId;
        axios.get(url).then((response) => {
          var data = response.data.replace(/'/g, "\"");
          data = JSON.parse(data);
          parentQuestion.childQuestions = data.questions;
          this.$forceUpdate(); 
        });

      },


      populateField(item, field){
        if(field === null)
          return;

        if(Array.isArray(field)){
          item.checkAnswer = field[0];
          item.answer = field[1];
        } else{
          item.answer = field;
        }
      },

      populateForm(event,fields){
        event.preventDefault();
        var that = this;
        this.question.childQuestions.forEach(function(item){
          that.populateField(item, fields[item.questionId] );
          if(item.childQuestions!=null){
            item.childQuestions.forEach(function(childItem){
              that.populateField(childItem, fields[childItem.questionId] );
              });
          }
        });
        this.$forceUpdate(); 
      },

      populateReject(event){
        this.populateForm(event,CONST_AUTO_FIELD.REJECT);
      },

      populateApprove(event){
        this.populateForm(event,CONST_AUTO_FIELD.APPROVE);
      },

      populateEscalation(event){
        this.populateForm(event,CONST_AUTO_FIELD.ESCALATION);
      },



      submitForm(event){
        event.preventDefault();     
        let url = "http://localhost:3030/api/question/submit";   
        axios.post(url,this.question);





        // event.preventDefault();
        // this.question.childQuestions.forEach(function(item){
        //     console.log(item.questionId + " - "+ item.answer);
        //     if(item.childQuestions!=null){
        //       item.childQuestions.forEach(function(childItem){
        //         console.log(childItem.questionId + " - "+ childItem.answer);
        //       });
        //     }
        // });
      }
    }
  }


</script>