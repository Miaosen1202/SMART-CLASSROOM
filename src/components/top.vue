<template>
  <div class="logo">
    <div>
      <p  @click="goToFirst" style="display:inline-block;padding-left: 1%;vertical-align:middle;cursor: pointer">
        <img src="../../static/images/logo.png" alt="">
      </p>
      <span style="color: blue;margin-left: 8%">{{$t('message.text')}}</span>
      <span @click="dialogFormVisible = true" class="password" style="padding-top: 1%;margin-left: 2%;cursor: pointer">{{$t('message.ModifyPassword')}}</span>
      <p v-on:click="backlogin" style="float: right;margin-top:1.6%;padding-right: 2%;cursor: pointer;vertical-align:middle">
        <img src="../../static/images/u118.png" alt="">
      </p>
      <div @click="mycourse" style="float: right;padding-right: 1%;margin-top: 1%;cursor: pointer;">
        <span >
          <img src="../../static/images/admintx.png" width="34" height="34" alt="">
          {{ getLoginUser().name }}
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
      <!--语言包引入-->
      <div class="select" style="float: right;margin-right: 2%;width: 10%;margin-top: 0.5%">
        <el-select v-show="true" v-model="selectValue" @change="langChange" :placeholder="$t('message.pleaseselect')" >
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
  import util from '../utils/util'

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
                  value: 'cn',
                  label: '中文'
                }, {
                  value: 'en',
                  label: 'English'
                }
                ]
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
          backlogin() {
            let that = this;
            this.post("/logout", null, function () {
              that.$message.success("Logout Success");
              that.$router.push({path: "/"});
            }, undefined, function () {
              that.$message.error("Logout error: " + err);
              that.$router.push({path: "/"});
            });
          },
          mycourse() {
            this.$router.push({path: "/personalCenterManagement/myCourse"});
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

        }
    }
</script>

<style scoped="">

</style>
