<template>
  <div class="all">
    <el-scrollbar style="height: 100%">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('message.SelectAll')}}
      </el-checkbox>
      <div style="display: inline-block">
        <el-button @click="download" style="background-color: #0e38b1;color: #fff">{{$t('message.download')}}</el-button>
      </div>
      <el-checkbox-group v-model="checkedMaterials" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(material, index) in materialList" :key="index" :label="material"
                     style="display: block;padding-top: 2%">
          <!--<img src="../../../assets/images/u558.png" alt="">-->
          <!--<a :href="material.materialUrl" :download="material.materialName">{{ material.materialName }}</a>-->
            <!--<span @click="preview(material.localPath)">{{material.materialName}}</span>-->
            <!--<i class="el-icon-download" @click="downFile(material.materialUrl)" style="cursor: pointer;"></i>-->
          <span @click="preview(material.localPath)">{{material.materialName}}</span>
          <a :href="material.materialUrl" :download="material.materialName">
            <i  style="cursor: pointer;">
              <img src="../../../../static/images/UPLOAD.png" alt="">
            </i>

          </a>
        </el-checkbox>
      </el-checkbox-group>
    </el-scrollbar>


    <el-dialog
      class="file-preview"
      :title="$t('message.preview')"
      :visible.sync="filePreviewDialogVisible"
      width="100%"
      fullscreen>
      <iframe :src="previewHtml" style="width: 100%; height: 100%">
      </iframe>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkAll: false,
        checkedMaterials: [],
        materialList: [],
        isIndeterminate: true,
        lessonId: this.$route.query.lessonId,

        filePreviewDialogVisible: false,
        previewHtml: "",
      }
    },

    /*mounted: function () {
      this.getMaterialList();
    },*/
    mounted() {
      this.getMaterialList();
    },
    methods: {
      download: function() {
        this.$message.warning(this.$t('message.Thefunctionisbeingperfected'));/*"The function is being perfected"*/
        return;
      },

      preview: function (filePath) {
        this.filePreviewDialogVisible = true;
        this.previewHtml = "";

        this.$http.get(`${process.env.NODE_ENV}/file/preview`, {params: {filePath: filePath}})
          .then((res) => {
            if (res.data.code == 200) {
              this.previewHtml = res.data.entity;
            } else if (res.data.code == 300) {
              this.$message.error(res.data.message);
              this.$router.push("/");
            } else {
              console.error("preview fail", res.data.message);
              this.$message.error(this.$t('message.ThepreviewfilefailedPleasedownloadittoviewitlocally.'));/*预览文件失败，请下载至本地查看*/
            }
          }).catch((err) => {
          console.error("preview fail", err);
          this.$message.error(this.$t('message.ThepreviewfilefailedPleasedownloadittoviewitlocally.'));
        });
      },

      handleCheckAllChange(val) {
        this.checkedMaterials = val ? this.materialList : [];
        this.isIndeterminate = false;
      },

      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.materialList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.materialList.length;
      },

      getMaterialList: function (id) {
        this.$http.get(`${process.env.NODE_ENV}/lessonMaterial/list`, {params: {status: 1, lessonId: this.lessonId}})
          .then((res) => {
            if (res.data.code == 200) {
              this.materialList = res.data.entity;
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        })
      }
    }
  }
</script>

<style>
  .file-preview .el-dialog.is-fullscreen {
    width: 80% !important;
  }
  .file-preview .el-dialog.is-fullscreen .el-dialog__body {
    height: 90%;
  }
</style>
<style scoped="">
  .all {
    margin: 0px 2%;
    width: 97%;
    height: 84%;

  }
</style>
