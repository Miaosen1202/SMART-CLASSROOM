<template>
  <div>
    <div>
      <p  @click="goToFirst" style="display:inline-block;padding-left: 1%;vertical-align:bottom;cursor: pointer;padding-top: 0.6%">
        <img src="../../../static/images/logo.png" alt="">
      </p>
      <span style="color: blue;margin-left: 4%;font-weight: 700">{{$t('message.text')}}</span>
      <!--<p v-on:click="backlogin" style="float: right;margin-top:1%;padding-right: 2%;cursor: pointer;vertical-align:middle">
        <img src="../../../static/images/u118.png" alt="">
      </p>-->
      <div style="float: right;padding-right: 2%;margin-top: 0.6%;">
        <el-dropdown>
           <span class="el-dropdown-link">
              {{ getLoginUser().name }}<i class="el-icon-arrow-down el-icon--right"></i>
           </span>
          <el-dropdown-menu slot="dropdown">
            <!--<el-dropdown-item @click.native="mycourse">
              <img src="../../../static/images/mycoursr.png" alt="">
              mycourse
            </el-dropdown-item>-->
            <el-dropdown-item  @click.native="goReply()">
              <img src="../../../static/images/reply-blue.png" alt="">
              {{$t('message.reply')}}
            </el-dropdown-item>
            <el-dropdown-item class="password" @click.native="dialogFormVisible = true">
              <img src="../../../static/images/ResetPassword-blue.png" alt="">
              {{$t('message.ModifyPassword')}}
            </el-dropdown-item>
            <el-dropdown-item class="help" >
              <i><img src="../../../static/images/help-blue.png" alt=""></i>
              {{$t('message.help')}}
            </el-dropdown-item>
            <el-dropdown-item v-on:click.native="backlogin" >
              <img src="../../../static/images/Quit-blue.png" alt="">
              {{$t('message.Quit')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <span >
          <img src="../../../static/images/yuan10.png" width="34" height="34" alt="">
          <!--{{$t('message.Teacher')}}--><!--{{ getLoginUser().name }}-->
        </span>
      </div>
      <!--<el-select v-model="value" placeholder="admin" style="border: none">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>-->
      <div class="select" v-show="true" style="float: right;margin-right: 2%;width: 7%;margin-top: 0.5%">
        <el-select  v-model="selectValue" @change="langChange" :placeholder="$t('message.pleaseselect')" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-dialog :title="$t('message.ModifyPassword')"
               :visible.sync="dialogFormVisible"
               @close="modifyPasswordDialogClose"
               style="height: 100%">
      <!-- <div v-for="(password,index) in oldpasswordlist" :key="index">-->
      <p style="color: #009900">{{$t('message.Password')}}</p>
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


    <el-dialog
      @close="replyDialogClose"
      :title="$t('message.feedback')"
      :visible.sync="replyDialogVisible"
      width="50%">
      <div class="projectile" style=" width: 100%;height: 400px;overflow: auto">
        <el-scrollbar style="height: 100%">
          <div style="padding:2% 6%;">
            <div class="root-reply" v-show="this.feedbackDetail.root.id != null">
              <!--<div style="padding: 2%; margin: 2%; border: 1px solid black">{{ this.feedbackDetail.root.content }}</div>-->
              <el-input
                :readonly="true"
                type="textarea"
                autosize
                v-model="this.feedbackDetail.root.content">
              </el-input>
            </div>

            <el-input
              type="textarea"
              autosize
              :placeholder="$t('message.pleaseEnter')"
              v-model="reply.content">
            </el-input>
          </div>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="cancelReply">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="addReply">{{$t('message.reply')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import util from "@/utils/util"
  export default {
    data() {
      return {
        dialogFormVisible: false,
        oldPassword: '',
        newPassword:'',
        newPasswordConfirm: '',
        selectValue:'',
        options:[
          {
            value: 'zh',
            label: '中文'
          }, {
            value: 'en',
            label: 'English'
          }
        ],
        replyDialogVisible: false,
        feedbackDetail: {
          root: {},
          replyList: []
        },
        reply: {
          content: null
        },
      }
    },
    created() {
      let that = this;
      console.log(localStorage.lang)
      that.selectValue = localStorage.lang == undefined?'en':localStorage.lang
      this.langChange(that.selectValue)
    },
    methods: {
      getLoginUser: util.getLoginUser,
      goToFirst(){
        this.$router.push({path:"/homePage/prepare"});
      },
      /*backlogin() {
        this.$router.push({path: "/"});
      },*/
      backlogin() {
        let that = this;
        this.post("/logout", null, function () {
          that.$message.success("Logout Success");/*logoutSuccess*/
          that.$router.push({path: "/"});
        }, undefined, function () {
          that.$message.error("Logout error: " + err);
          that.$router.push({path: "/"});
        });
      },
      //语言切换
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








      goReply: function (row) {
        this.replyDialogVisible = true;

        if (row !== undefined) {
          this.loadFeedbackReply(row.id);
        }
      },

      addReply: function () {
        let reply = {
          content: this.reply.content,
          replyId: this.feedbackDetail.root.id,
        };

        if (reply.content === null || reply.content === '' || reply.content.trim() === "") {
          this.$message.error(this.$t('message.Pleaseinputreplycontent'));/* Please input reply content*/
          return;
        }

        let me = this;
        this._add("/feedback", reply, data => {
          me.reply.content = '';
          if (reply.replyId) {
            me.loadFeedbackReply(reply.replyId);
          } else {
            me.replyDialogVisible = false;
          }
        });
        // this.$http.post(`${process.env.NODE_ENV}/feedback/add`, reply)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.$message.info("Reply success");
        //       this.reply.content = '';
        //
        //       if (reply.replyId) {
        //         this.loadFeedbackReply(reply.replyId);
        //       } else {
        //         this.replyDialogVisible = false;
        //       }
        //     } if (res.data.code == 300) {
        //       this.$message.error(this.data.message);
        //       this.$router.push("/");
        //     } else {
        //       this.$message.error(this.data.message);
        //     }
        //
        //     return null;
        //   }).catch((err) => {
        //     this.$message.error(err);
        // });
      },

      cancelReply: function () {
        this.replyDialogVisible = false;
        this.reply.content = '';
      },

      replyDialogClose: function () {
        this.feedbackDetail.root = {};
        this.feedbackDetail.replyList = [];
      },

      loadFeedbackReply: function (id) {
        this.feedbackReplyDetail = [];

        this.$http.get(`${process.env.NODE_ENV}/feedback/reply/query`, {params: {rootId: id}})
          .then((res) => {
            if (res.data.code == 200) {
              this.feedbackDetail.root = res.data.entity.list[0];
              this.feedbackDetail.replyList = res.data.entity.list.slice(1);

            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },
    }
  }
</script>

<style scoped="">

</style>
