<template>
    <div>
      <div>
        <p style="display:inline-block;padding-left: 1%;vertical-align:bottom;padding-top: 0.5%">
          <img src="../../../static/images/logo.png" alt="">
        </p>
        <span style="color: blue;margin-left: 2%;font-weight: 700">{{$t('message.text')}}</span>
        <!--<p v-on:click="backlogin" style="float: right;margin-top:1%;padding-right: 2%;cursor: pointer;vertical-align:middle">
          <img src="../../../static/images/u118.png" alt="">
        </p>-->
        <div style="float: right;padding-right: 2%;margin-top: 0.6%;">
          <el-dropdown>
           <span class="el-dropdown-link">
              {{ getLoginUser().name }}<i class="el-icon-arrow-down el-icon--right"></i>
           </span>
            <el-dropdown-menu slot="dropdown">
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
            <!--{{ getLoginUser().name }}-->
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
    </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    data() {
        return {
          selectValue:'',
          options:[
            {
              value: 'zh',
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

      backlogin() {
        let that = this;
        this.post("/logout", null, function () {
          that.$message.success(that.$t('message.logoutSuccess'));
          that.$router.push({path: "/"});
        }, undefined, function (err) {
          that.$message.error(that.$t('message.logoutFail') + ": " + err);
          that.$router.push({path: "/"});
        });
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

</style>
