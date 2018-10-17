<template>
  <div id="all">
    <div class="right-top">
      <p style="display:inline-block;padding-left: 1%;vertical-align: bottom;">
        <img src="../../static/images/logo.png" alt="">
      </p>
      <p style="font-weight: 700;display: inline-block;">
        {{$t('message.Welcome')}} {{ getLoginUser().name }} ! <!--text-->
      </p>
      <span @click="dialogFormVisible = true" class="password" style="padding-top: 1%;margin-left: 2%;cursor: pointer">{{$t('message.ModifyPassword')}}</span>
      <!--<p style="float: right;padding-right: 3%;cursor: pointer"><img v-on:click="goback()" src="../assets/images/u4.png" alt=""></p>-->
      <p v-on:click="goback()" style="float: right;padding-right: 3%;padding-top:1%;cursor: pointer">
        <img src="../../static/images/u118.png" alt="">
      </p>
      <span style="float: right;padding-top:0.8%;">
          <img src="../../static/images/yuan10.png" width="34" height="34" alt="">
          {{ getLoginUser().name }}
        </span>

      <div class="select" v-show="true" style="float: right;margin-right: 2%;width: 7%;margin-top: 0.5%">
        <el-select  v-model="selectValue" @change="langChange" placeholder="请选择" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

    </div>

    <div class="left">
      <left :lessonId="lessonId" :lessonCode="lessonCode"></left>
  </div>
    <div class="right">
      <div class="right-main">
        <div class="coursetop">
          <!--Lesson : Our Solar System and Life’s Emergence  v-for="lessonId in existCourseList"{{lessonId.courseName}}-->
          <p style="padding-top: 1%">{{entity.lesson.lessonName}}<!--Emergence--><!--{{entity.lesson.lessonName}}-->
            <!--<img src="../assets/images/u475.png" alt="">-->
          </p>
          <p style="padding-top: 1%">
            <img src="../assets/images/u434.png" alt="">
            {{entity.course.courseName}}
           <!-- Course : Journey of the Universe: A Story for Our Times-->
          </p>
        </div>
        <router-view></router-view>
      </div>
    </div>


    <el-dialog :title="$t('message.ModifyPassword')"
               :visible.sync="dialogFormVisible"
               @close="modifyPasswordDialogClose"
               style="width: 50%;height: 100%">
      <!-- <div v-for="(password,index) in oldpasswordlist" :key="index">-->
      <p>{{$t('message.Password')}}</p>
      <el-input type="password" v-model="oldPassword" :placeholder="$t('message.pleaseenter')"></el-input>

      <p style="color: #009900">{{$t('message.NewPassword')}}</p>
      <el-input type="password" v-model="newPassword" :placeholder="$t('message.pleaseenter')"></el-input>

      <p style="color: #009900">{{$t('message.ConfirmPassword')}}</p>
      <el-input type="password" v-model="newPasswordConfirm" :placeholder="$t('message.pleaseenter')"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button size="medium" style="background-color: #0138b1;color: #fff"  @click="updatepassword">{{$t('message.confirm')}}</el-button>
      </div>
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  import eventBus from '../eventBus'
  import util from '../utils/util'

  import left from './student/studentLeft.vue'
  export default {
    name: 'homePage',

    data () {
      return {
        dialogFormVisible: false,
        oldPassword: '',
        newPassword:'',
        newPasswordConfirm: '',
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
        lessonId: this.$route.query.lessonId,
        lessonCode:this.$route.query.lessonCode,
        entity: {
          lesson: {lessonName: ""},
          course: {courseName: ""}
        },
      }
    },
    created() {
      let that = this;
      console.log(localStorage.lang)
      that.selectValue = localStorage.lang == undefined?'en':localStorage.lang
    },
    mounted() {
      this.getDetailByLessonId();
    },
    methods:{
      getLoginUser: util.getLoginUser,

      getDetailByLessonId: function () {
        this.$http.get(`${process.env.NODE_ENV}/lesson/detail/query?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.entity = res.data.entity;
            }
          }).catch((err) => {
          console.log(err);
        });
      },
      goback: function () {
        this.$router.push({path: "/"});
      },
      langChange(e){
        // console.log(e)
        localStorage.setItem('lang',e);
        this.$i18n.locale = e;
      },
      modifyPasswordDialogClose: function () {
        this.oldPassword = '';
        this.newPassword = '';
        this.newPasswordConfirm = "";
      },
      updatepassword: function () {
        if ((this.oldPassword == "" || this.oldPassword.trim() == "")) {
          this.$message.error(this.$t('message.Pleaseenteroldpassword'));/*"Please enter old password"*/
          return;
        }
        if ((this.newPassword == "" || this.newPassword.trim() == "")) {
          this.$message.error(this.$t('message.Pleaseenternewpassword'));/*"Please enter new password"*/
          return;
        }
        if ((this.newPasswordConfirm == "" || this.newPasswordConfirm.trim() == "")) {
          this.$message.error(this.$t('message.Pleaseenternewpasswordagain'));/*"Please enter new password again"*/
          return;
        }
        if (this.newPassword !== this.newPasswordConfirm) {
          this.$message.error(this.$t('message.Newpasswordnotmatchtheconfirmpassword'));/*"New password not match the confirm password"*/
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
                message: this.$t('Passwordmodificationsucceeded!'),/*Password modification succeeded!*/
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
    },
    components:{
      left,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #all{
    width:100%;
    height:100%;
    background-color: #ccc;
  }
  .left{
    width: 16%;
    height: 88%;
    float: left;
    color: #fff;
    /*margin-left: 1%;
    margin-top: 1%;*/
    background-color: #0138b1;
    /*border-radius: 4px;*/
  }
  .right {
    width: 82%;
    height: 90%;
    /* background-color: blue;*/
    float: left;
  }
  .right-top{
    width: 100%;
    height: 8%;
    border: 1px solid #929292;
    background-color: #fff;
    color: #0f0f0f;
  }
  .right-main{
    width: 98%;
    height: 96%;
    margin-top: 2%;
    margin-left: 2%;
    background-color: #fff;
    border-radius: 4px;

  }
  p {
    display: inline-block;
    /*padding-top: 1%;*/
    padding-left: 2%;
    margin: 0px !important;
  }
  .coursetop p {
    width: 60%;
    padding-left: 2%;
  }

  .coursetop {
    height: 12%;
    /*margin-top: 2%;*/
    border-bottom: 1px solid #ddd;
    margin:1% 2%;

  }

  .coursetop p:first-child {
    /*padding-top: 1%;*/
    display: inline-block;
  }

  .coursetop p:nth-child(2) {
    padding-left: 4%;
    color: #999;
    display: inline-block;
  }
</style>

