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
          <!--<span @click="preview(material.localPath)">{{material.materialName}}</span>-->
          <!--<a :href="material.materialUrl" :download="material.materialName">-->
            <!--<i  style="cursor: pointer;">-->
              <!--<img src="../../../../static/images/UPLOAD.png" alt="">-->
            <!--</i>-->
          <!--</a>-->
          <file-template :id="material.id" :url="material.materialUrl" :name="material.materialName"></file-template>
        </el-checkbox>
      </el-checkbox-group>
    </el-scrollbar>

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
        console.log(this.checkedMaterials);
        if (this.checkedMaterials.length == 0) {
          this.$message.error(this.$t('message.Pleaseselectamaterialfirst'));/* "Please select a material first"*/
          return;
        }

        let ids = "";
        for (let i = 0; i < this.checkedMaterials.length; i++) {
          ids += ((i == 0) ? "" : ",") + this.checkedMaterials[i].id;
        }

        window.open(`${process.env.NODE_ENV}/lessonMaterial/batchDownload?ids=` + ids);
        return;
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


<style scoped="">
  .all {
    margin: 0px 2%;
    width: 97%;
    height: 84%;

  }
</style>
