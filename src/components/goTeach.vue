<template>
  <div id="goTeach">
    <!--<div class="teachtop">
      <div v-on:click="goback()" style="display: inline-block">
        <img src="../../static/images/pclogo.png" alt="" width="100" height="50" style="cursor: pointer;vertical-align: middle">
      </div>
      <p style="cursor: pointer" v-on:click="goback()">{{$t('message.text')}}</p>
      <span @click="dialogFormVisible = true" class="password">Modify Password</span>
      <p v-on:click="backlogin" style="float: right;padding-right: 2%;cursor: pointer">
        <img src="../assets/images/u118.png" alt="">
      </p>-->



      <div class="teachtop">
        <!--<p  @click="goToFirst" style="display:inline-block;padding-left: 1%;vertical-align:bottom;cursor: pointer">
          <img src="../../static/images/logo.png" alt="">
        </p>-->
        <!--<span @click="dialogFormVisible = true" class="password" style="padding-top: 1%;margin-left: 2%">Modify Password</span>-->
        <p v-on:click="backlogin" style="float: right;margin-top:1.6%;padding-right: 2%;cursor: pointer;vertical-align:middle">
          <img src="../../static/images/u118.png" alt="">
        </p>
       <!-- <div @click="mycourse" style="float: right;padding-right: 1%;margin-top: 1%;cursor: pointer;">
        <span >
        <img src="../../static/images/admintx.png" width="34" height="34" alt="">
        Teacher</span>
        </div>-->

        <!--语言包引入-->
       <!-- <div class="select" style="float: right;margin-right: 2%;width: 10%;margin-top: 0.5%">
          <el-select  v-model="selectValue" @change="langChange" placeholder="请选择" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>-->

      </div>




     <!-- <p v-for="(student,index) in studentsid" :key="index">{{entity.student}}</p>-->
    <!--</div>-->
    <el-scrollbar style="height: 100%">
      <div class="teachmain">
        <p style="padding-left: 2%;margin-top: 2%;color: #999999">
          <i class="el-icon-warning"></i><!--Please select a  lesson to start-->
          {{$t('message.pleasestart')}}<!--Please choose a lesson.-->
        </p>
        <div class="lessonteach">
          <div class="have" v-for="(course,index) in courselist" :key="index">
            <div v-on:click="toggle(course.id)" style="cursor: pointer;display: inline-block">
              <i class="el-icon-arrow-down"></i>
              <img src="../../static/images/course.png" alt="">
            <!--  <h5 >Course：Journey of the Universe: A Story for Our Times1 </h5>-->
              <h5>{{course.courseName}}</h5>
            </div>
           <!-- <h5 v-on:click="deletecours(course.id)" class="el-icon-delete"
                style="color: red;cursor: pointer;float: right;margin-right: 1%"></h5>-->
            <div v-show="isShow && (clickedCourseId == course.id)">
              <div class="lesson" v-for="(lesson,index) in lessonlist" :key="index">
                <!--<div v-on:click="lessonhistory()" style="cursor: pointer;display: inline-block">
                  <img src="../../static/images/lesson.png" alt="">
                </div>-->
                <p v-on:click="goTeaching(lesson.id)">{{lesson.lessonName}}</p>
                <span style="float: right">{{ dateTimeformat(lesson.createTime) }}
                  <!--<i v-on:click="deletelesson(course.id,lesson.id)" class="el-icon-delete" style="color: red;cursor: pointer"></i>-->
                </span>
                <p v-on:click="goTeaching(lesson.id)" style="float: right;padding-right: 20%">
                  {{ lesson.teachingStatus == 1 ? $t('message.continue') : $t('message.start') }}
                </p>

              </div>

            </div>
          </div>
        </div>
      </div>

    </el-scrollbar>

    <el-dialog :title="$t('message.ModifyPassword')"
               :visible.sync="dialogFormVisible"
               @close="modifyPasswordDialogClose"
               style="width: 50%;height: 100%">
     <!-- <div v-for="(password,index) in oldpasswordlist" :key="index">-->
      <p>oldPassword</p>
      <el-input type="password" v-model="oldPassword" placeholder="Please enter"></el-input>

      <p style="color: #009900">New Password</p>
      <el-input type="password" v-model="newPassword" placeholder="Please enter"></el-input>

      <p style="color: #009900">Confirm Password</p>
      <el-input type="password" v-model="newPasswordConfirm" placeholder="Please enter"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">Cancel</el-button>
        <el-button size="medium" style="background-color: #0138b1;color: #fff"  @click="updatepassword">Submit</el-button>
      </div>
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  import eventBus from '../eventBus'

  export default {
    // var me = this;
    data() {
      return {
        selectValue:'',
        options:[
          {
            value: 'cn',
            label: '中文'
          }, {
            value: 'en',
            label: 'English'
          }
        ],
        courseName: '',
        isShow: false,
        clickedCourseId:"",
        lessonId:this.$route.query.lessonId,
        existCourseList: [],
        courselist: [],
        lessonlist: [],
        lessonCode:'',
        oldPassword: '',
        newPassword:'',
        newPasswordConfirm: '',

       /* input: '',
        input2: '',
        input3: '',*/
        oldpasswordlist:[],
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        formLabelWidth: '100px'
      }
    },
    created() {
      let that = this;
      console.log(localStorage.lang)
      that.selectValue = localStorage.lang == undefined?'en':localStorage.lang
      this.langChange(that.selectValue)
    },
    mounted() {
      this.getCourselist();
    },
    methods: {
      modifyPasswordDialogClose: function () {
        this.oldPassword = '';
        this.newPassword = '';
        this.newPasswordConfirm = "";
      },

      toggle: function (id) {
        this.isShow = !this.isShow;
        this.clickedCourseId = id;
        this.getLessonListByCourseId(id);

      },
      dateTimeformat: function(d) {
        var date = new Date(d);
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();
        var hour = '' + date.getHours();
        var min = '' + date.getMinutes();
        var sec = '' + date.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        min = min.length < 2 ? ('0' + min) : min;
        sec = sec.length < 2 ? ('0' + sec) : sec;

        return [year, month, day].join('-') + " " + [hour, min, sec].join(":");
      },
      getCourselist() {
        this.$http.get(`${process.env.NODE_ENV}/course/list`)
          .then((res) => {
            if (res.data.code == 200) {
              this.courselist = res.data.entity;
              if (this.courselist.length > 0) {
                this.toggle(this.courselist[0].id);
              }
            }

          }).catch((err) => {
          console.log(err);
        });
      },
      getLessonListByCourseId(id) {
        this.$http.get(`${process.env.NODE_ENV}/lesson/list?status=1&courseId=${id}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.lessonlist = res.data.entity;

            }

          }).catch((err) => {
          console.log(err);
        });
      },
      goTeaching (id) {
        var classs = {
          lessonId:id,
        };
        this.$http.post(`${process.env.NODE_ENV}/teaching/start/edit`,classs)
          .then((res) => {
            if (res.data.code == 200) {
              this.lessonCode = res.data.entity;
              this.$router.push({path: "/StartTeachingMaterials",query:{lessonId: id, lessonCode: this.lessonCode}});
            }

          }).catch((err) => {
          console.log(err);
        });

      },
      backlogin() {
        this.$router.push({path: "/"});
      },
      deletecours: function (id) {
        let me = this;
        this._del("/course",[id], (data)=> me.getCourselist())
      },
      deletelesson: function (courseId,lessonId) {
        let me = this;
        this._del("/lesson",[lessonId], ()=> {
          me.getLessonListByCourseId(courseId);
        });
        // this.$http.post(`${process.env.NODE_ENV}/lesson/deletes`, [lessonId])
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       /*this.discussionId = res.data.entity;
        //       console.log("discussionId:"+this.discussionId);*/
        //       this.$message({
        //         message: 'Congratulations on your successful deletion!',
        //         type: 'success'
        //       });
        //       this.getLessonListByCourseId(courseId);
        //
        //     }
        //   }).catch((err) => {
        //   console.log(err);
        // });
      },
      /*goback: function() {
        this.$router.push({path: "/navBar"});
      },*/
      updatepassword: function () {
        if ((this.oldPassword == "" || this.oldPassword.trim() == "")) {
          this.$message.error("Please enter old password");
          return;
        }
        if ((this.newPassword == "" || this.newPassword.trim() == "")) {
          this.$message.error("Please enter new password");
          return;
        }
        if ((this.newPasswordConfirm == "" || this.newPasswordConfirm.trim() == "")) {
          this.$message.error("Please enter new password again");
          return;
        }
        if (this.newPassword !== this.newPasswordConfirm) {
          this.$message.error("New password not match the confirm password");
          return;
        }

        let oldpassword = {
          oldPassword: this.$md5(this.oldPassword),
          newPassword: this.$md5(this.newPassword),
        };
        this.$http.post(`${process.env.NODE_ENV}/user/updatePassword/edit`,oldpassword)
          .then((res) => {
            if (res.data.code == 200) {
             /* this.oldpasswordlist = res.data.entity;*/

              this.$message({
                message: 'Password modification succeeded!',
                type: 'success'
              });
              this.oldPassword="",
              this.newPassword="",
              this.dialogFormVisible= false;
            }
          }).catch((err) => {
          console.log(err);
        });
      },
      goToFirst(){
        this.$router.push({path:"/homePage/prepare"});
      },
      backlogin() {
        this.$router.push({path: "/"});
      },
      mycourse() {
        this.$router.push({path: "/personalCenterManagement/myCourse"});
      },
      //语言切换
      langChange(e){
        // console.log(e)
        localStorage.setItem('lang',e);
        this.$i18n.locale = e;
      }
    }
  }
</script>

<style scoped="">
  #goTeach {
    width: 100%;
    height: 100%;
  }

  .teachtop {
    width: 100%;
    height: 6%;
    font-family: 'Arial Normal', 'Arial';
    /*background-color: rgb(215, 215, 215);*/
    background-color: rgba(248, 248, 248, 1);
    position: fixed;
    z-index: 1;
  }

/*  .teachtop p {
    display: inline-block;
    padding-top: 1%;
    padding-left: 2%;

  }*/

  .teachmain {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    overflow: auto;
    padding-top: 2%;

  }

  .have {
    border: 1px solid #ccc;
    width: 100%;
    padding-left: 2%;
    padding-right: 2%;
    position: relative;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: none;
    margin-bottom: 2%;
  }

  .have ul li {
    color: #0066CC;
    font-size: 12px;
  }

  .have h5 {
    display: inline-block;
    font-weight: 700;
  }

  .lesson {
    border: 1px solid #ccc;
    width: 100%;
    padding: 1%;
    margin-bottom: 2%;
    box-sizing: border-box;
    background-color: rgba(248, 248, 248, 1);
    border-color: rgba(204, 204, 204, 1);
    border-radius: 4px;
    box-shadow: none;
  }

  p {
    display: inline-block;
    margin: 0px;
    cursor: pointer;
  }

  span {
    display: inline-block;
  }

  .lesson:hover {
    background-color: rgb(255, 245, 198);
  }

  .password {
    margin-left: 1%;
    color: #0066CC;
    cursor: pointer;
  }

  .password:hover {
    border-bottom: 1px solid #0066cc;
  }

  .el-dialog__body {
    padding: 2% 10%;
    color: #606266;
    font-size: 14px;
  }
</style>
