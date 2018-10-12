<template>

  <div style="height: 100%">
    <div class="teach" v-show="!showUpload">
      <div class="no-material">
        <p><img src="../../../assets/images/u768.png" alt=""></p>
        <p>{{$t('message.Empty')}}</p>
        <el-button style="background-color: #0e38b1" size="medium" type="primary" @click="goToAddMaterials">
          <img src="../../../assets/images/u60.png" alt="">
        </el-button>
      </div>
    </div>

    <div class="material-panel all" v-show="showUpload">
      <el-scrollbar>

        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                     @change="handleCheckAllChange">{{$t('message.checkall')}}
        </el-checkbox>

        <div class="check">
          <el-button size="small" @click="handleMaterialRemove">
            <!-- <img src="../../../assets/images/u60.png" width="20" alt="" style="visibility:hidden;">-->
            {{$t('message.delete')}}
          </el-button>
          <!--<el-button size="small" type="primary" @click="goViewMaterialBank">-->
          <!--<img src="../../../assets/images/u60.png" alt="">More-->
          <!--</el-button>-->
          <el-button size="small" type="primary" @click="copyToClike" style="background-color: #f17e26;border: none">
            <img src="../../../../static/images/COPYTO.png" alt="" width="20px" height="15px">
            {{$t('message.CopyTo')}}
          </el-button>
        </div>

        <el-upload
          class="material-upload"
          name="file"
          with-credentials
          :show-file-list="showUploadFileList"
          :action="UploadUrl()"
          :on-change="handleChange"
          :on-success="handleFileUploadSuccess"
        >
          <el-button size="small" type="primary" style="background-color: #26b196">
            <img src="../../../../static/images/UPLOAD.png" height="15px" alt="">
            {{$t('message.upload')}}
          </el-button>

          <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
        <div style="margin: 15px 0;"></div>
        <!--<el-checkbox-group v-model="checkedMaterials" @change="handleCheckedCitiesChange">-->
        <!--<div v-for="city in cities">-->
        <!--<el-checkbox :label="city" :key="city">{{city}}</el-checkbox>-->
        <!--</div>-->
        <!--</el-checkbox-group>-->
        <el-checkbox-group v-model="checkedMaterialList">
          <div class="list" v-for="material in materialList">
            <el-checkbox :label="material">
              <a :href="material.materialUrl" :download="material.materialName">{{material.materialName}}</a>
            </el-checkbox>
          </div>
        </el-checkbox-group>

        <!-- 拷贝课时资料 -->
        <el-dialog ref="copyToDialog"
                   id="copyToDialog"
                   :title="$t('message.SelectaLesson')"
                   :visible.sync="copyToDialogVisible"
                   @open="copyMaterialDialogOpen"
                   width="30%">

          <div>
            <el-collapse accordion v-model="activeName" @change="courseCollapseChange">
              <el-collapse-item v-for="course in courseList"
                                :title="course.courseName"
                                :name="course.id"
                                :key="course.id"
              >
                <el-radio class="lesson-item" v-for="les in lessonList" v-model="copyToLessonRadio" :label="les.id"
                          :key="les.id">
                  {{les.lessonName}}
                </el-radio>
              </el-collapse-item>
            </el-collapse>
          </div>
          <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="copyMaterialToLesson">{{$t('message.OK')}}</el-button>
       <el-button @click="copyToDialogVisible = false">{{$t('message.cancel')}}</el-button>
      </span>
        </el-dialog>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: '1',
        copyToDialogVisible: false,
        materialName: "",
        fromWhere: "",
        showUploadFileList: false,
        checkAll: false,
        isIndeterminate: false,
        checkedMaterialList: [],
        materialList: [],
        lessonId: this.$route.query.lessonId,
        showUpload: false,
        courseList: [],
        lessonList: [],
        activeName: '0',
        copyToLessonRadio: undefined,
      };
    },
    mounted() {
      this.getMaterialList();
    },
    methods: {
      goToAddMaterials: function () {
        this.showUpload = true;
      },
      UploadUrl: function () {
        return `${process.env.NODE_ENV}/file/upload`;
      },
      handleFileUploadSuccess: function (resp, file, fileList) {
        if (resp.code == 200) {
          var newMaterial = {
            lessonId: this.lessonId,
            materialName: resp.entity.fileOriginName,
            fromWhere: 1,
            localPath: resp.entity.fileTmpName,
            isShare: 0
          };
          let me = this;
          this._add("/lessonMaterial", newMaterial, data => {
            this.$http.get(`${process.env.NODE_ENV}/lessonMaterial/get?data=${data.entity}`)
              .then((res) => {
                if (res.data.code == 200) {
                  me.materialList.push(res.data.entity);
                } else {
                  me.$message.error(res.data.message);
                }
              })
          });
        } else {
          alert("Upload file error: " + resp.message);
        }
      },
      handleChange(file, fileList) {
        console.log("upload change", file, fileList)
      },
      handleMaterialRemove: function () {
        var deleteMaterialIds = [];
        this.checkedMaterialList.forEach(function (m) {
          deleteMaterialIds.push(m.id);
        });

        if (deleteMaterialIds.length == 0) {
          this.$message.error(this.$t('message.pleaseinformation'));//Please select class hour information first.
          return;
        }
        let me = this;
        this._del("/lessonMaterial", deleteMaterialIds, (data) => {
          var delIdCache = {};
          JSON.parse(data.entity).forEach(function (id) {
            delIdCache[id] = true;
          });
          for (var i = me.checkedMaterialList.length - 1; i >= 0; i--) {
            if (delIdCache[me.checkedMaterialList[i].id]) {
              me.checkedMaterialList.splice(i, 1);
            }
          }
          for (var i = me.materialList.length - 1; i >= 0; i--) {
            if (delIdCache[me.materialList[i].id]) {
              me.materialList.splice(i, 1);
            }
          }
          me.showUpload = me.materialList.length > 0;
        })
      },
      getMaterialList: function () {
        this.$http.get(`${process.env.NODE_ENV}/lessonMaterial/list`, {params: {status: 1, lessonId: this.lessonId}})
          .then((res) => {
            if (res.data.code == 200) {
              this.materialList = res.data.entity;
              this.showUpload = this.materialList.length > 0;
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      handleCheckAllChange(val) {
        this.checkedMaterialList = val ? this.materialList : [];
        this.isIndeterminate = false;
      },
      copyToClike: function () {
        if (this.checkedMaterialList.length == 0) {
          this.$message.error(this.$t('message.pleaseinformation'));//Please select class hour information first.
          return;
        }
        this.copyToDialogVisible = true;
      },
      copyMaterialDialogOpen: function () {
        this.$http.get(`${process.env.NODE_ENV}/course/list`, {params: {status: 1, deleteStatus: 1}})
          .then((res) => {
            if (res.data.code == 200) {
              this.courseList = res.data.entity;
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      courseCollapseChange: function (courseId) {
        if (typeof courseId == "undefined") {
          return;
        }
        this.$http.get(`${process.env.NODE_ENV}/lesson/list?status=1&courseId=` + courseId)
          .then((res) => {
            if (res.data.code == 200) {
              var arr = res.data.entity;
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == this.lessonId) {
                  arr.splice(i, 1);
                  break;
                }
              }
              this.lessonList = arr;
            } else {
              alert(res.data.message);
            }
          }).catch((err) => {
          console.log(err);
        });
      },
      copyMaterialToLesson: function () {
        if (typeof this.copyToLessonRadio == "undefined") {
          this.$message.error(this.$t('message.Pleaseselectalesson'));//"Please select a lesson"
          return;
        }
        if (this.checkedMaterialList.length == 0) {
          this.$message.error(this.$t('message.Pleaseselectmaterial'));//"Please select material"
          return;
        }

        var checkedMaterialIds = [];
        this.checkedMaterialList.forEach(function (m) {
          checkedMaterialIds.push(m.id);
        });

        var param = {
          targetLessonId: this.copyToLessonRadio,
          lessonMaterialIds: checkedMaterialIds
        };
        this.$http.post(`${process.env.NODE_ENV}/lessonMaterial/copyTo/edit`, param)
          .then((res) => {
            if (res.data.code == 200) {
              this.copyToDialogVisible = false;
              this.$message.info(this.$t('message.CopySuccess'));//"Copy Success"
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      goViewMaterialBank: function () {
        // todo
        console.log("go view material bank");
      }
    }
  }
</script>

<style scoped>
  .all {
    margin-top: 2%;
    width: 99.4%;
  }

  .material-panel {
    height: 100%;
  }

  .el-dialog {
    width: 40% !important;

  }

  .el-dialog__body {
    width: 100% !important;
    height: 200px !important;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-collapse-item__header {
    color: #6d6d6d;
    border-bottom: 1px solid #ebeef5;
    font-size: 15px !important;
    font-weight: 700 !important;
    padding-left: 2%;
  }

  .material-upload {
    display: inline-block;
  }

  .check {
    display: inline-block;
  }

  .dialog-footer .el-button:first-child {
    background-color: rgba(0, 204, 0, 1);
    border: none;
  }

  .dialog-footer .el-button:first-child:hover {
    background-color: rgb(0, 160, 0);
    border: none;
  }

  .dialog-footer .el-button:last-child {
    background-color: rgba(153, 153, 153, 1);
    border: none;
    color: white;
  }

  .dialog-footer .el-button:last-child:hover {
    background-color: rgb(116, 116, 116);
    border: none;
    color: white;
  }

  .teach {
    text-align: center;
    margin-top: 4%;
  }

  .teach p:first-child {
    color: #ccc;
    margin-bottom: 3%;
  }

  .teach p:nth-child(2) {
    color: #999;
    margin-bottom: 3%;
  }

  .el-button--medium {
    padding: 1% 5%;
  }

  .lesson-item {
    width: 100%;
    margin-top: 10px;
  }

  .lesson-item.el-radio {
    margin: 10px;
    margin-left: 30px;
  }
</style>
