<template>
<div class="all">
    <el-scrollbar style="height: 100%">
    <div class="Exercises">
      <div class="elbtn">
        <el-button type="success" icon="el-icon-arrow-left" circle @click="goBack"></el-button>
        <h4 style="display: inline-block">{{currentPage}}/{{pages}}</h4>
        <el-button type="success" icon="el-icon-arrow-right" circle @click="toNextPage"></el-button>
      </div>
      <div class="have" v-for="(exercises,index) in existExercisesList">
        <h5 style="display: inline-block">{{$t('message.Exercises')}} {{exercises.sort}}</h5>
        <span style="border: 1px solid #ccc;padding: 1px;margin-left: 1%" v-show="exercises.questionType == '1'">{{$t('message.Singlechoice')}}</span>
        <span style="border: 1px solid #ccc;padding: 1px;margin-left: 1%" v-show="exercises.questionType == '2'">{{$t('message.Multiplechoice')}}</span>
        <p class="pexer">{{exercises.questionTitle}}</p>
        <ul style="padding-left: 2%" v-for="(option,index) in exercises.options" :key="index">
          <li>
            <el-radio v-model="selectedAnswerCode" :label="option.answerCode" v-show="exercises.questionType == '1'">
              <span style="padding-right: 2%" >{{option.answerCode}}</span>
              <span style="padding-left: 2%">{{option.answerContent}}</span>
            </el-radio>
            <el-checkbox v-model="selectedMultiAnswerCode" :label="option.answerCode" v-show="exercises.questionType == '2'">
              <span style="padding-right: 2%" >{{option.answerCode}}</span>
              <span style="padding-left: 2%">{{option.answerContent}}</span>
            </el-checkbox>

          </li>
        </ul>
         <!-- <el-checkbox-group
            v-model="selectedMultiAnswerCode" v-show="exercises.questionType == '2'">
            <el-checkbox v-for="(option,index) in exercises.options" :label="option.answerCode" :key="index">
              <span style="padding-right: 2%" >{{option.answerCode}}</span>
              <span style="padding-left: 2%">{{option.answerContent}}</span>
            </el-checkbox>
          </el-checkbox-group>-->

      </div>
      <div class="submitt">
        <el-button style="margin: 2%;background-color: #0e38b1;color: #fff" :disabled="disableSubmit"  round @click="submitQuestionAnswer(existExercisesList[0])">{{$t('message.submit')}}</el-button>
      </div>

      <div class="answer" v-for="exercises in existExercisesList" v-show="hasAnswerSubmit">
        <div>
          <span>{{$t('message.CorrectAnswer')}} ：</span>
          <span v-for="(option,index) in exercises.options" v-if="option.isCorrect == 1">{{option.answerCode}} </span>
        </div>

        <p>{{$t('message.YourAnswer')}} ：<span style="color: red">{{answer.answerContent}}</span></p>

        <P>{{$t('message.Explanation')}}</P>
        <span  style="width: 60%;display: inline-block">
          {{exercises.analysis}}
        </span>
      </div>
    </div>
    </el-scrollbar>
  </div>
</template>

<script>
    export default {
        data() {
            return {
              disableSubmit: true,
              isShow: false,
              existExercisesList:[],
              selectedAnswerCode:"",
              selectedMultiAnswerCode:[],
              lessonId: this.$route.query.lessonId,
              lessonCode:this.$route.query.lessonCode,
              pageSize:1,//页大小
              currentPage:1,//当前页
              pages: 0,//总页数
              total:0,//总条数
              isSubmit:1,
              exercises:{},
              questionType:'1',
              answer: {},
              hasAnswerSubmit: false
            }
        },
      mounted() {
        this.loadFinishexercise();
      },
        methods: {
          toggle: function () {
            this.isShow = !this.isShow;
          },
          loadFinishexercise:function () {
            let param = {
              lessonId:this.lessonId,
              pageIndex: this.currentPage,
              pageSize: this.pageSize
            };
            this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/pageList`, {params:param})
              .then((res) => {
                if (res.data.code == 200) {
                  this.existExercisesList = res.data.entity.list;
                  this.total = res.data.entity.total;
                  this.currentPage = res.data.entity.pageIndex;
                  this.pages = (res.data.entity.total)%(res.data.entity.pageSize) == 0 ?
                    (res.data.entity.total)/(res.data.entity.pageSize) :
                    (res.data.entity.total)/(res.data.entity.pageSize)+1;
                  this.pageSize = res.data.entity.pageSize;

                  if (this.existExercisesList.length == 0) {
                    return;
                  }

                  this.loadAnswer(this.existExercisesList[0].id);
                }
              }).catch((err) => {
              console.log(err);
            });
          },

          loadAnswer: function(questionId) {
            // load answer
            let ansParam = {
              params: {
                lessonCode: this.lessonCode,
                questionId: questionId,
                questionType: 1
              }
            };
            this.$http.get(`${process.env.NODE_ENV}/questionAnswer/submitHistory/query`, ansParam)
              .then((res) => {
                if (res.data.code === 200) {
                  if (res.data.entity.questionAnswerRecordVos.length > 0) {
                    this.answer = res.data.entity.questionAnswerRecordVos[0];
                    this.disableSubmit = true;
                    this.hasAnswerSubmit = true;
                  } else {
                    this.answer = {};
                    this.disableSubmit = false;
                    this.hasAnswerSubmit = false;
                  }
                }
              });
          },

          //向下翻页
          toNextPage(){
            this.currentPage = this.currentPage+1;
            if(this.currentPage > this.pages){
              this.$message({
                message: this.$t('message.lastpage'),/* sorry,this is the last page!*/
                type: 'warning'
              });
              this.currentPage--;
            }else if(this.currentPage <= this.pages){
              this.selectedAnswerCode = "";
              this.isSubmit = 1;
              this.loadFinishexercise();
            }

          },
          //向上翻页
          goBack(){
            this.currentPage = this.currentPage-1;
            if(this.currentPage == 0){
              this.$message({
                message: this.$t('message.firstpage'),/*sorry,this is the first page!*/
                type: 'warning'
              });
              this.currentPage++;
            }else{
              this.selectedAnswerCode = "";
              this.isSubmit = 1;
              this.loadFinishexercise();
            }

          },
          //提交问题答案
          submitQuestionAnswer(exercises){
            let hasAnswer = false;
            if (exercises.questionType == 1 && this.selectedAnswerCode.length > 0) {
              hasAnswer = true;
            } else if (this.selectedMultiAnswerCode.length > 0) {
              hasAnswer = true;
            }

            if (!hasAnswer) {
              this.$message.error(this.$t('message.Pleasetick'));/*Pleasetick*/
              return;
            }
            let answer;
            if (exercises.questionType == '1') {
              answer = this.selectedAnswerCode;
              this.selectedAnswerCode = "";
            } else {
              answer = this.selectedMultiAnswerCode.sort().join(",");
              this.selectedMultiAnswerCode.splice(0)
            }

            this.questionType = exercises.questionType;
            let queryParam = {
              questionId: exercises.id,
              // todo
              questionType: 1,
              answerContent: answer,
              lessonCode:this.lessonCode,
              isSubmit: 1
            }

            this.$http.post(`${process.env.NODE_ENV}/questionAnswer/submit/edit`,queryParam )
              .then((res) => {
                if (res.data.code == 200) {
                  this.isSubmit = 1;
                  this.exercises = exercises;
                  this.$message({
                    message: this.$t('message.SubmitSuccess'),/*'Submit Success'*/
                    type: 'success'
                  });

                  this.loadAnswer(exercises.id);
                } else {
                  this.$message.error(res.data.message);
                }
              }).catch((err) => {
              console.log(err);
            });
          }

        }
    }
</script>

<style scoped="">
  .all {
    margin:0px 2%;
    width: 98%;
    height: 84%;
  }
  .have {
    border: 1px solid #ccc;
    width: 96%;
    padding-left: 2%;
    margin-top: 2%;
    border-radius: 4px 4px 0px 0px;
    display: inline-block;
  }
  .submitt {
    width: 96%;
    border: 1px solid #ccc;
    background-color: rgba(242, 242, 242, 1)
  }

  .have ul li {
    color: #0066CC;
    font-size: 14px;
  }

  .have h5 {
    display: inline-block;
    border-bottom: 2px solid #999;
    font-weight: 700;
  }

  .have .el-button {
    float: right;
    padding-right: 2%;
  }
  .pexer {
    display: block;
    padding-bottom: 1%;
    margin: 0;
    padding-left: 2%;
    font-weight: 700;
    color: #6F6FB7;
  }
  .answer P {
    font-style: italic;
    font-weight: 700;
    color: #6F6FB7
  }
  .answer {
    /*border: 1px solid #ccc;
    width: 96%;
    padding-left: 2%;
    margin-bottom: 2%;
    border-radius: 0px 0px 4px 4px;
    display: inline-block;*/
    /*float: right;*/
    margin-top: 1%;
    margin-right: 4%;
  }
  .elbtn {
    float: right;
    margin-top:1%;
    margin-right:4%;
  }
  .elbtn .el-button {
    background-color: #0e38b1;
    border: none;
  }
  .elbtn .el-button:active {
    background-color: #144efc;
    color: #fff;
  }
</style>
