<template>
  <div id="all">
    <div id="login">
      <p><img src="../assets/images/u2081.png" alt=""></p>
      <div class="mainmain">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Teacher" name="teacher">
            <div class="account">
              <input class="form-control" type="text" placeholder="Account Name" v-model="userName">
            </div>
            <div class="password">
              <input class="form-control" type="password" placeholder="Password" v-model="password">
            </div>
            <div style="padding: 4%;overflow: auto;">
              <el-tooltip style="float: right" class="item forget-pwd-tip" effect="dark" content="Please contact the system administrator"
                          placement="top" popper-class="test">
                <a href="javascript:;">Forgot your password?</a>
              </el-tooltip>
            </div>
            <el-button  v-on:click="goToLogin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff">Login</el-button> <!--@click="goToLogin"-->
          </el-tab-pane>
          <!--<el-tab-pane label="Teacher" name="first">-->
            <!--<el-form>-->
              <!--<div class="account">-->
                <!--<input class="form-control" type="text" placeholder="Account Name" v-model="userName">-->
              <!--</div>-->
              <!--<div class="password">-->
                <!--<input class="form-control" type="password" placeholder="Password" v-model="password">-->
              <!--</div>-->
              <!--<div style="padding: 4%;overflow: auto;">-->
                <!--<el-tooltip style="float: right" class="item forget-pwd-tip" effect="dark" content="Please contact the system administrator"-->
                            <!--placement="top" popper-class="test">-->
                  <!--<a href="javascript:;">Forgot your password?</a>-->
                <!--</el-tooltip>-->
              <!--</div>-->
              <!--&lt;!&ndash;<el-button  v-on:click="goToLogin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff">Login</el-button>&ndash;&gt;-->
              <!--<input type="submit" @click="goToLogin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff" value="Login"/>-->
            <!--</el-form>-->
          <!--</el-tab-pane>-->

          <el-tab-pane label="Student" name="student">
            <div class="account">
              <input class="form-control" type="text" placeholder="Account Name" v-model="userName">
            </div>
            <div class="password">
              <input class="form-control" type="password" placeholder="Password" v-model="password">
            </div>
            <div class="password">
              <input class="form-control" type="text" placeholder="lessonCode" v-model="lessonCode">
            </div>
            <div style="padding: 4%;overflow: auto;">
              <el-tooltip style="float: right" class="item forget-pwd-tip" effect="dark" content="Please contact the system administrator"
                          placement="top" popper-class="test">
                <a href="javascript:;">Forgot your password?</a>
              </el-tooltip>
            </div>
            <el-button v-on:click="studentslogin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff">Login</el-button> <!--@click="goToLogin"-->
          </el-tab-pane>
          <!--<el-tab-pane label="Student" name="second">-->
            <!--<el-form>-->
              <!--<div class="account">-->
                <!--<input class="form-control" type="text" placeholder="Account Name" v-model="userName">-->
              <!--</div>-->
              <!--<div class="password">-->
                <!--<input class="form-control" type="password" placeholder="Password" v-model="password">-->
              <!--</div>-->
              <!--<div class="password">-->
                <!--<input class="form-control" type="text" placeholder="lessonCode" v-model="lessonCode">-->
              <!--</div>-->
              <!--<div style="padding: 4%;overflow: auto;">-->
                <!--<el-tooltip style="float: right" class="item forget-pwd-tip" effect="dark" content="Please contact the system administrator"-->
                            <!--placement="top" popper-class="test">-->
                  <!--<a href="javascript:;">Forgot your password?</a>-->
                <!--</el-tooltip>-->
              <!--</div>-->
              <!--&lt;!&ndash;<el-button v-on:click="studentslogin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff">Login</el-button>&ndash;&gt;-->
              <!--<input type="submit" @click="studentslogin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff" value="Login"/>-->
            <!--</el-form>-->
          <!--</el-tab-pane>-->


          <el-tab-pane label="Admin" name="admin">
            <div class="account">
              <input class="form-control" type="text" placeholder="Account Name" v-model="userName">
            </div>
            <div class="password">
              <input class="form-control" type="password" placeholder="Password" v-model="password">
            </div>
            <el-button v-on:click="goToadmin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff">Login</el-button>
          </el-tab-pane>
          <!--<el-tab-pane label="Admin" name="third">-->
            <!--<el-form>-->
              <!--<div class="account">-->
                <!--<input class="form-control" type="text" placeholder="Account Name" v-model="userName">-->
              <!--</div>-->
              <!--<div class="password">-->
                <!--<input class="form-control" type="password" placeholder="Password" v-model="password">-->
              <!--</div>-->
              <!--<input type="submit" @click="goToadmin()" style="width: 100%;background-color: #0e38b1;height: 40px;color: #fff" value="Login"/>-->
            <!--</el-form>-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../utils/util'

 /* import crypto from 'crypto'*/
  export default {
    data() {
      return {
        activeName: 'teacher',
        toolTipClass: 'page-login-toolTipClass',
        userName: "",
       /* password: "e10adc3949ba59abbe56e057f20f883e",*/
        password:"",
        lessonCode:'',
        entity: "",
        identity: {
          manager: 1,
          teacher: 2,
          student: 3
        },
        user: {
          userName: "",
          password: "",
          lessonCode: null
        }
      }
    },
    mounted() {
      this.registerEnterLogin()
    },

    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      registerEnterLogin() {
        let me = this;

        if (navigator.userAgent.indexOf("MSIE") > 0) {
          //IE
          document.onkeydown = function () {
            if (13 == event.keyCode) {
              me.login()
            }
          }
        } else {
          //非IE
          window.onkeydown = function () {
            if (13 == event.keyCode) {
              me.login()
            }

          }
        }
      },

      login() {
        console.log(this.activeName);
        switch (this.activeName) {
          case "admin": this.goToadmin();
            return;
          case "teacher": this.goToLogin();
            return;
          case "student":this.studentslogin();
            return;
        }
      },
      goToLogin: function () {
        var login = {
          "userName": this.userName,
          "password": this.$md5(this.password),
        };
        this.$http.post(`${process.env.NODE_ENV}/login`, login)
          .then((res) => {
            if (res.data.code == 200) {
              if (this.identity.teacher != res.data.entity.identity) {
                this.$message.error("Login user is not a teacher");
                return;
              }

              util.storeLoginUser(res.data.entity);

              this.entity = res.data.entity;
              this.$router.push({path: "/homePage/prepare"});
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      goToadmin: function () {
        var login = {
          "userName": this.userName,
          "password": this.$md5(this.password),
        };
        this.$http.post(`${process.env.NODE_ENV}/login`, login)
          .then((res) => {
            if (res.data.code == 200) {
              if (this.identity.manager != res.data.entity.identity) {
                this.$message.error("Login user is not a manager");
                return;
              }

              util.storeLoginUser(res.data.entity);

              this.entity = res.data.entity;
              this.$router.push({path: "/admin/teacherManagement"});
            } else {
              this.$message.error(res.data.message)
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      studentslogin:function () {
        let login = {
          "userName": this.userName,
          "password": this.$md5(this.password),
          "lessonCode":this.lessonCode
        };
        this.$http.post(`${process.env.NODE_ENV}/login`, login)
          .then((res) => {
            if (res.data.code == 200) {
              if (this.identity.student != res.data.entity.identity) {
                this.$message.error("Login user is not a student");
                return;
              }

              util.storeLoginUser(res.data.entity);

              this.entity = res.data.entity;
              this.$router.push({path: "/LearningHomework/FinishMaterials",query:{lessonId:this.entity.lessonId,lessonCode:this.entity.lessonCode}});
            } else {
              this.$message.error(res.data.message)
            }
          }).catch((err) => {
          this.$message.error(err);
        });

      }
    }
  }
</script>
<style scoped>
  /*@import "../../static/bootstrap/css/bootstrap.css";
  @import "../../static/bootstrap/css/bootstrap-theme.css";*/
  #all {
    width: 100%;
    height: 100%;
    background-color: #0e38b1;
  }

  #login {
    text-align: center;
    width: 24%;
    height: 30%;
    margin: 2% auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #fff;
  }

  span {
    display: inline-block;
    border: 1px solid #212785;
    border-radius: 20px;
    width: 44%;
    height: 16%;
    padding-top: 1%;
    cursor: pointer;
  }

  i {
    font-style: normal;
    cursor: pointer;
    font-size: 12px;
  }

  input::-webkit-input-placeholder {
    color: #ccc;
    font-size: 12px;
    text-align: left;
  }

  input {
    display: block;
    width: 100%;
    font-size: 14px;
    line-height: 1.42857;
    color: #0f0f0f;
    background-color: #fff;
    background-image: none;
    box-shadow: rgba(255, 255, 255, 0.07) 0px 1px 1px inset;
    padding: 6px 12px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(143, 143, 143);
    border-image: initial;
    border-radius: 4px;
  }

  .account, .password {
    text-align: center;
    padding: 4% 0px;
  }

  .admin {
    display: inline-block;
    padding-top: 6%;
  }

  /* .is-dark {
     background-color: pink !important;
     color: #ff413a!important;
   }
   .page-login-toolTipClass{
     background-color: #2992FF !important
   }
   .el-tooltip__popper.is-dark {
     background-color: red !important;
   }*/
  /*.el-button {
    padding: 0px !important;
  }*/

  .page-login-toolTipClass {
    background-color: rgb(255, 204, 204) !important;
    border-color: rgb(255, 133, 174) !important;
    color: rgb(255, 133, 174) !important;
  }

  .el-tooltip__popper[x-placement^=top] .popper__arrow:after {
    border-top-color: rgb(255, 204, 204);
  }

  .el-tooltip__popper[x-placement^=top] .popper__arrow {
    border-top-color: rgb(255, 204, 204);
  }
.mainmain {
  background-color: #fff;
  padding: 10%;
  border-radius: 2px;
}
</style>

