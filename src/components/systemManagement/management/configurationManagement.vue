<template>
  <div style="height: 100%;width: 100%;padding: 2%">
    <div style="margin-top: -1%">
      <ul>
        <li >
          <img src="../../../../static/images/back1.png" alt="" @click="back()" style="cursor: pointer;">
          <h4 style="display: inline-block;vertical-align: middle;color: #144efc">{{$t('message.back')}}</h4>
        </li>
      </ul>
    </div>
    <div style="float: left;width: 40%;height: 80%">
      <div>
        <ul>
          <li>
            <h4 style="color: #333333">{{$t('message.ResourceName')}}:</h4>
            <el-input disabled v-model="editMaterialBank.materialName"  size="small" :placeholder="$t('message.Pleaseinputresourcename')"></el-input>
          </li>
          <li style="margin-top: 4%">
            <h4>{{$t('message.Category')}}:</h4>
            <el-select v-model="editMaterialBank.materialType" size="small" :placeholder="$t('message.Pleaseselectcategory')" style="display: block">
              <el-option
                v-for="type in materialTypeList"
                :key="type.id"
                :label="type.dictionaryName"
                :value="type.dictionaryCode">
              </el-option>
            </el-select>
          </li>
          <li style="margin-top: 4%">
            <h4>{{$t('message.Description')}}:</h4>
            <el-input
              maxlength="4000"
              @input = "descInput"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 16}"
              :placeholder="$t('message.Pleaseinputresourcedescription')"
              v-model="editMaterialBank.materialDesc">
            </el-input>
            <span style="float: right;padding-right: 0%;font-size: 12px;color: #999999">{{remnant}}{{$t('message.byte')}}</span>
          </li>
        </ul>

      </div>
    </div>

    <div class="replace">
      <!--<h4 style="margin-top: -4%;">{{$t('message.medin')}}</h4>
      <div >
        <el-upload
        class="upload-demo"
        :action="action"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :with-credentials="true"
        :file-list="fileList3"
        style="display: inline-block;margin: 18% 38%;">
        <img src="../../../../static/images/u550.png" alt="">
        <el-button type="primary" size="mini" style="float: right;">Replace the file</el-button>
        </el-upload>
      </div>-->
    </div>

    <el-button type="primary" @click="updateMaterialBank" size="mini" style="float: left;margin-left: 70%;">{{$t("message.update")}}</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        remnant:4000,
        editMaterialBank: {
          id: this.$route.query.id,
        },

        materialTypeList: [],

        textarea2:'',
        value: '',
        input:'',
      }

    },

    mounted: function () {
      this.getMaterialBankDetail();
      this.getMaterialTypes();
    },

    methods: {

      descInput(){
        var txtVal = this.editMaterialBank.materialDesc.length;
        this.remnant = 4000-txtVal;
      },
      getMaterialBankDetail: function () {
        this.$http.get(`${process.env.NODE_ENV}/materialBank/get`, {params: {data: this.editMaterialBank.id}})
          .then((res) => {
            if (res.data.code == 200) {
              this.editMaterialBank = res.data.entity;
            } else if (res.data.code == 300) {
              this.$message.error(res.data.message);
              this.$router.push("/");
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },

      getMaterialTypes: function () {
        this.$http.get(`${process.env.NODE_ENV}/dictionary/list`, {params: {dictionaryCode: "material.type", status: 1}})
          .then((res) => {
            if (res.data.code == 200) {
              this.materialTypeList = res.data.entity;
            } else if (res.data.code == 300) {
              this.$message.error(res.data.message);
              this.$router.push("/");
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },

      updateMaterialBank: function () {
        this.$http.post(`${process.env.NODE_ENV}/materialBank/modify`, this.editMaterialBank)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.info(this.$t('message.Modifyteachersuccess'));
              this.$router.push({path: "/admin/resourceManagement"});
            } else if (res.data.code == 300) {
              this.$message.error(res.data.message);
              this.$router.push({path: "/login"});
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      back() {
        this.$router.push({path: "/admin/resourceManagement"});
      },
    }
  }
</script>

<style scoped="">
  .replace {
    float: left;
    background-color: #a4b7f0;
    width: 56%;
    height: 80%;
    margin-left: 4%;
    margin-top: 2%;
    border: 1px solid #bbdde5;
    border-radius: 4px;
  }
</style>
