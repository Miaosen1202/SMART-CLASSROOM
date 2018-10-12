<template>
  <div id="prepare">
    <div>
      <h4>{{$t('message.step')}} 1:</h4>
      <p class="step">{{$t('message.newlesson')}}</p>
      <div>
        <input class="form-control step1" type="text" :placeholder="$t('message.pleaseenter')" v-model="lessonName">
      </div>
    </div>

    <div class="new">
      <h4>{{$t('message.step')}} 2:</h4>
      <p class="step">{{$t('message.addcourse')}}</p>
      <div class="step2">
        <el-radio v-model="submitCourseFlag" label="1" >
          <input class="form-control" type="text" id="firstinput2"
                 :placeholder="$t('message.pleaseselect')"
                 v-model="existCourseName" readonly>
        </el-radio>
        <!--<el-button style="color: #fff" size="medium" class="list btn" type="text" @click="showCourseDialog">{{$t('message.list')}}</el-button>-->
        <input style="color: #fff" type="submit" v-on:click="showCourseDialog()" class="list btn" :value="$t('message.Select')">
      </div>
      <!--<h4 class="or">step 2:</h4>-->
      <p class="red">{{$t('message.orcreate')}}</p>
      <div class="here">
        <el-radio v-model="submitCourseFlag" label="2">
          <input class="form-control" type="text" id="firstinput3"
                 clearable
                 @focus="focusNewCourseNameInput"
                 :placeholder="$t('message.pleaseselect')" v-model="courseName">
        </el-radio>
        <!--<input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option1">-->
      </div>
    </div>
    <input style="color: #fff" type="submit" v-on:click="toggle()" class="list btn tj" :value="$t('message.Next')">

    <el-dialog
      title="Tips"
      :visible.sync="dialogVisible"
      width="30%">
      <span>
        <img src="../../../static/images/Continuetocourse.png" alt="">
        {{$t('message.quite')}}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button style="background-color: #0e38b1" size="medium" type="primary" @click="goContinue()">{{$t('message.Continue')}}</el-button>
        <!--<el-button style="background-color: #0e38b1" size="medium" type="primary" @click="dialogVisible = false">Continue</el-button>-->
        <el-button size="medium" @click="dialogVisible = false">{{$t('message.giveup')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Select Course"
      :visible.sync="showCourseDialogVisible"
      width="30%"
      height="200px"
    >
      <el-scrollbar style="height: 100%">
        <div v-for="existCourse in existCourseList">
          <el-radio v-model="radio" :label="existCourse.id">{{existCourse.courseName}}</el-radio>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button style="background-color:#0e38b1 " size="medium" type="primary" @click="sure">OK</el-button>
        <el-button size="medium" @click="showCourseDialogVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import eventBus from '../../eventBus'

  export default {
    data() {
      return {
        showCourseDialogVisible: false,
        dialogVisible: false,
        lessonName: "",
        courseName: "",
        continueLessonId: "",
        existCourseName: "",
        /*existCourseExampleList:[
          {
            id:1,
            courseName:"课程名称1"
          },
          {
            id:2,
            courseName:"课程名称2"
          }
        ],*/
        existCourseList: [],
        radio: "",
        submitCourseFlag: "1",
        lessonId: ""
      }
    },
    //methods: {}
    mounted() {
      this.isShowDialog();
    },
    methods: {
      focusNewCourseNameInput: function () {
        this.submitCourseFlag = "2";
      },


      goContinue() {
        this.$router.push({path: "/homePage/course/addMaterials?lessonId="+ this.continueLessonId})
      },
      isShowDialog() {
        //未发布第一条
        this.$http.get(`${process.env.NODE_ENV}/lesson/pageList?status=0&pageIndex=1&pageSize=1`)
          .then((res) => {
            if (res.data.code == 200) {
              if (res.data.entity.list.length > 0) {
                this.continueLessonId = res.data.entity.list[0].id;
                this.dialogVisible = true;
              }
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          console.log(err);
        });
      },
      showCourseDialog() {
        this.showCourseDialogVisible = true;
        this.existCourseList = this.existCourseExampleList;
        this.$http.get(`${process.env.NODE_ENV}/course/list`)
          .then((res) => {
            if (res.data.code == 200) {
              this.existCourseList = res.data.entity;
            }
          }).catch((err) => {
          console.log(err);
        });


      },

      sure() {
        this.submitCourseFlag = "1";

        for (let i = 0; i < this.existCourseList.length; i++) {
          if (this.existCourseList[i].id == this.radio) {
            this.existCourseName = this.existCourseList[i].courseName;
            break;
          }
        }
        this.showCourseDialogVisible = false;
      },

      toggle: function () {
        let postParam = {
          lessonName: this.lessonName.trim(),
          courseId: this.submitCourseFlag === "1" ? this.radio : null,
          courseName: this.submitCourseFlag === "2" ? this.courseName.trim() : null
        };

        console.log(this.submitCourseFlag, postParam)
        if (this.submitCourseFlag === "1" && postParam.courseId === "") {
          this.$message.error("Please select a course first");
          return;
        }
        if (this.submitCourseFlag === "2" && postParam.courseName === "") {
          this.$message.error("Please input course name first");
          return;
        }

        if (postParam.lessonName === "") {
          this.$message.error("Please input lesson name first");
          return;
        }

        let me = this;
        this._add("/lesson",postParam,data=>{
          me.lessonId = data.entity;
          this.$router.push({path: "/homePage/course", query: {"lessonId": me.lessonId}});
        });

        // this.$http.post(`${process.env.NODE_ENV}/lesson/add`, postParam)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.lessonId = res.data.entity;
        //       this.$router.push({path: "/homePage/course", query: {"lessonId": this.lessonId}});
        //     }else {
        //       this.$message.error('The new class name already exists');
        //     }
        //   }).catch((err) => {
        //   console.log(err);
        // });


      }

    },
    watch: {
      submitCourseFlag(newV, oldV) {
        if (newV == 1) {
          this.courseName = "";
        } else {
          this.existCourseName = "";
        }
      }
    }

  }
</script>

<style scoped>
  #prepare {
    width: 80%;
    margin-left: 6%;
    padding-top: 4%;
  }

  .form-control {
    display: inline-block !important;
    /*width: 60% !important;*/
  }

  #firstinput2 {
    width: 94% !important;
  }

  #firstinput3 {
    width: 100% !important;
  }

  h4, p {
    display: inline-block;
  }

  p {
    font-size: 14px;
    color: #575757;
  }

  .red {
    color: red;
  }

  .step2 {
    /*width: 100%;
    height: 100%;*/
    width: 89%;
    margin-left: 3%;
  }

  .step1 {
    margin-left: 5%;
    width: 60% !important;
  }

  .here {
    margin-left: 3%;
  }

  /* .el-button {
     padding: 1% 0px !important;
   }*/

  .list {
    display: inline-block;
    width: 8%;
    /* height: 6%;*/
    background-color: #0e38b1;
    border: 1px solid #0e38b1;
    margin-left: -0.5%;
    vertical-align: inherit;
  }

  /* .list:active {
     background-color: red;
   }*/
  .tj {
    margin-left: 5%;
    margin-top: 6%;
  }

  .or {
    padding-top: 3%;
  }

  .new {
    padding-top: 6%;
  }

  .el-dialog__body {
    overflow: auto;
    width: 100%;
    height: 200px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #ccc;
    width: 90%;
    margin: 0 auto;
  }

  .el-radio {
    width: 60%;
  }
</style>
