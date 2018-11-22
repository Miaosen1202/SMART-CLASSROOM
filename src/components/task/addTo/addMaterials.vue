<template>

  <div style="height: 100%">
    <div class="teach" v-show="!showUpload">
      <div class="no-material">
        <p><img src="../../../assets/images/u550.png" alt=""></p>
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
          <el-button size="small"  @click="frommyresource" style="border: 1px solid #0e38b1;color: #0e38b1">
            <img src="../../../../static/images/tianjia.png" alt=""  height="15px">
            {{$t('message.frommyresource')}}
          </el-button>
          <el-button size="small" type="primary" @click="copyToClike" style="background-color: #f17e26;border: none">
            <img src="../../../../static/images/COPYTO.png" alt=""  height="15px">
            {{$t('message.CopyTo')}}
          </el-button>
        </div>
        <el-upload
          style="width: 30%;padding-bottom: 2%"
          class="material-upload"
          name="file"
          :before-upload="beforeAvatarUpload"
          accept=".doc,.docx,.mp4,.ppt,.pptx,.xls,.xlsx,.pdf,.mp3,.swf,.jpg,.jpeg,.png,.gif,.bmp"
          with-credentials
          :show-file-list="showUploadFileList"
          :action="UploadUrl()"
          :on-change="handleChange"
          :on-success="handleFileUploadSuccess"
        >
          <el-button size="small" type="primary" style="background-color: #26b196;margin-left: 10%">
            <img src="../../../../static/images/UPLOAD1.png" height="15px" alt="">
            {{$t('message.upload')}}
          </el-button>
         <!-- <div slot="tip" class="el-upload__tip">{{$t('message.Onlysupport')}}</div>-->
        </el-upload>
        <!--<div style="margin: 15px 0;"></div>-->
        <!--<el-checkbox-group v-model="checkedMaterials" @change="handleCheckedCitiesChange">-->
        <!--<div v-for="city in cities">-->
        <!--<el-checkbox :label="city" :key="city">{{city}}</el-checkbox>-->
        <!--</div>-->
        <!--</el-checkbox-group>-->
        <el-checkbox-group v-model="checkedMaterialList">
          <div class="list" v-for="material in materialList">
            <el-checkbox :label="material">
              <file-template :id="material.id" :name="material.materialName" :url="material.materialUrl"></file-template>
              <!--<a :href="serverPath + material.materialUrl + '/download'" :download="material.materialName">{{material.materialName}}</a>-->
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <!-- 拷贝课时资料 -->
        <div class="clone">
        <el-dialog ref="copyToDialog"
                   id="copyToDialog"
                   :title="$t('message.SelectaLesson')"
                   :visible.sync="copyToDialogVisible"
                   @open="copyMaterialDialogOpen"
                   width="30%">
          <div style="height: 360px">
            <el-scrollbar style="height: 100%">
              <el-collapse accordion v-model="activeName" @change="courseCollapseChange">
                <el-collapse-item v-for="course in courseList"
                                  :title="course.courseName"
                                  :name="course.id"
                                  :key="course.id">
                  <el-radio class="lesson-item" v-for="les in lessonList" v-model="copyToLessonRadio" :label="les.id"
                            :key="les.id">
                  <span style="white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: inline-block;
                  width: 74%;vertical-align: middle;">
                    {{les.lessonName}}
                  </span>
                  </el-radio>
                </el-collapse-item>
              </el-collapse>
            </el-scrollbar>
          </div>
          <span slot="footer" class="dialog-footer">
       <el-button style="background-color: #0e38b1;" type="primary" @click="copyMaterialToLesson">{{$t('message.OK')}}</el-button>
       <el-button @click="copyToDialogVisible = false">{{$t('message.cancel')}}</el-button>
      </span>
        </el-dialog>
      </div>




        <!-- 拷贝课时资料 -->
        <div class="clones">
          <el-dialog ref="copyTofrommyresource"
                     id="copyTofrommyresource"
                     :title="$t('message.frommyresource')"
                     :visible.sync="copyTofrommyresource"
                     width="80%">
            <div style="height: 600px">
              <el-scrollbar style="height: 100%">
                <div class="addto">
                  <p style="display: inline-block">{{$t('message.Total')}}</p>：<span style="font-weight: 700;padding-right: 1%;">{{ page.total }}</span>
                  <el-input v-model="search.materialName" size="small" :placeholder="$t('message.Pleaseinputfilenametosearch')" style="width: 20%"></el-input>
                  <el-select v-model="search.fileType" clearable="" :placeholder="$t('message.pleaseselect')" size="small">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-button type="primary" @click="resourceManagementQuery(1)" size="small" icon="el-icon-search" style="background-color: #0138b1;color: #fff"></el-button>
                  <el-button  @click="goBatchUpload" size="mini" style="float: right;margin-right: 1%;color:#0e38b1;border: 1px solid #0e38b1">
                    <img src="../../../../static/images/tianjia.png" alt="" height="18">
                    {{$t('message.batchAddTo')}}</el-button>
                  <div>
                  <el-table
                    ref="multipleTable"
                    :data="page.list"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column prop="materialName" :label="$t('message.fileName')" data-placement="auto" align="center" :show-overflow-tooltip="true" min-width="80%">
                      <!--{{materialName}}-->
                      <template slot-scope="scope">
                        <file-template
                          :id="scope.row.id"
                          :url="scope.row.materialUrl"
                          :name="scope.row.materialName">
                        </file-template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="fileType" :label="$t('message.fileType')" min-width="40%" align="center"></el-table-column>
                    <el-table-column prop="materialTypeDesc" :label="$t('message.Categorys')" min-width="40%" align="center"></el-table-column>
                    <el-table-column prop="fileSize" :label="$t('message.Size')" min-width="60%" align="center">
                      <template slot-scope="scope">{{ fileSizeConvert(scope.row.fileSize) }}</template>
                    </el-table-column>
                    <el-table-column prop="updateTime" :label="$t('message.DateTime')" min-width="90%" align="center">
                      <template slot-scope="scope">{{ formatDateTime(scope.row.updateTime) }}</template>
                    </el-table-column>
                    <!--<el-table-column prop="fileType" :label="$t('message.Views')" min-width="70%" align="center">
                    </el-table-column>-->
                    <el-table-column  :label="$t('message.Operation')" width="200" fixed="right" align="center">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          style="border: none;color: #0e38b1"
                          @click="materialAdd(scope.$index, scope.row)">{{$t('message.AddTo')}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  </div>
                </div>
                <div style="position: absolute;bottom: 8%;left: 44%">
                  <el-pagination
                    background
                    :page-size="page.pageSize"
                    :page-count="pageNumber"
                    :current-page="page.pageIndex"
                    layout="prev, pager, next"
                    :total=page.total
                    @current-change="resourceManagementQuery">
                  </el-pagination>
                </div>
                <!-- 批量上传面板 -->
                <el-dialog
                  :title="$t('message.batchUpload')"
                  :visible.sync="batchUploadDialogVisible"
                  width="30%"
                  @close="batchUploadDialogClosed"

                >
                  <el-upload
                    class="material-batch-upload"
                    name="file"
                    :before-upload="beforeAvatarUploads"
                    accept=".doc,.docx,.mp4,.ppt,.pptx,.xls,.xlsx,.pdf,.mp3,.swf,.jpg,.jpeg,.png,.gif,.bmp"
                    :file-list="fileList"
                    :action="fileUploadPath"
                    with-credentials
                    :on-change="handleFileChange"
                    :on-remove="removeFile"
                    :on-success="handleFileUploadSuccesss">
                    <el-button size="small" style="background-color: #0e38b1;color: #fff">
                      <img src="../../../../static/images/UPLOAD1.png" alt="">
                      {{$t('message.upload')}}</el-button>
                    <div slot="tip" class="el-upload__tip">{{$t('message.Onlysupport')}}</div>
                  </el-upload>
                  <span slot="footer" class="dialog-footer">
                    <el-button  @click="batchUploadDialogVisible = false">{{$t('message.cancel')}}</el-button>
                    <el-button style="background-color: #0e38b1;color: #fff" @click="batchUpload">{{$t('message.save')}}</el-button>
                  </span>
                </el-dialog>

              </el-scrollbar>
            </div>
            <!--<el-button @click="copyTofrommyresource = false"></el-button>-->
          </el-dialog>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import eventBus from '../../../eventBus'
  import util from '../../../utils/util'
  export default {
    data() {
      return {
        radio: '1',
        copyToDialogVisible: false,
        copyTofrommyresource:false,
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






        /*commonsresource*/
        batchUploadDialogVisible: false,
        fileUploadPath: `${process.env.NODE_ENV}/file/upload`,
        materialFileList: [],
        /*lessonId:'',*/
        fileList: [],

        addMaterials: [],

        search: {
          fileType:null,
          materialName: null,
          accessScope: 2
        },
        page: {
          total: 0,
          pageIndex: 1,
          pageSize: 5,
          list: [],

        },
        pageNumber: 5,

        pageSize: 1,//页大小
        currentPage: 1,//当前页
        pages: 0,//总页数
        total: 0,//总条数
        resourceManagementList: [],
        multipleSelection: [],
        options: [{
          value: 'image',
          label: 'image'
        }, {
          value: 'word',
          label: 'word'
        }, {
          value: 'excel',
          label: 'excel'
        }, {
          value: 'pdf',
          label: 'pdf'
        }, {
          value: 'ppt',
          label: 'ppt'
        }, {
          value: 'video',
          label: 'video'
        }, {
          value: 'audio',
          label: 'audio'
        }],
        value: '',
      };
    },
    mounted() {
      this.getMaterialList();
      this.resourceManagementQuery();
    },
    methods: {
      beforeAvatarUpload(file) {
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1);
        const extension1 = testmsg === 'doc' || testmsg === 'docx' || testmsg === 'ppt' || testmsg === 'pptx' || testmsg === 'xls' || testmsg === 'xlsx' || testmsg === 'pdf' || testmsg === 'swf' || testmsg === 'jpg' || testmsg === 'jpeg' || testmsg === 'png' || testmsg === 'gif' || testmsg === 'bmp';
        const extension2 = testmsg === 'mp4' || testmsg === 'mp3';
        const isLimit30M = file.size / 1024 / 1024 < 30;
        const isLimit200M = file.size / 1024 / 1024 < 200;
        if(!(extension1) && !(extension2)) {
          this.$message({
            // message: '上传文件只能是 doc、docx、mp4、ppt、pptx、xls、xlsx、pdf、mp3、swf、jpg、jpeg、png、gif、bmp格式!',
            message: this.$t('message.Uploadfilecanonly'),
            type: 'warning'
          });
        }
        if(extension1){ //其它文件
          if(!isLimit30M){
            this.$message({
              // message: '音视频文件大小不超过200M，其他类型文件不得超过30M!',
              dangerouslyUseHTMLString:true,
              message: this.$t('message.Audioandvideo'),
              type: 'warning'
            });
            return false;
          }
        }
        if(extension2){ //视频文件
          if(!isLimit200M){
            this.$message({
              dangerouslyUseHTMLString:true,
              message: this.$t('message.Audioandvideo'),
              type: 'warning'
            });
            return false;
          }

        }
        return (extension1 || extension2) && (isLimit30M || isLimit200M);
      },
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
                  eventBus.$emit("getMaterialNumber","");
                } else {
                  me.$message.error(res.data.message);
                }
              })
          });
        } else {
        /*  alert("Upload file error: " + resp.message);*/
          this.$message.error(this.$t('message.Uploadfileerror'));/*Upload file error: File type are not allowed*/
        }
      },
      handleChange(file, fileList) {
        // console.log("upload change", file, fileList)
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
            eventBus.$emit("getMaterialNumber","");
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
      frommyresource: function () {
        this.copyTofrommyresource = true;
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
      },




      /*commonsresource*/
      formatDateTime: util.formatDateTime,

      fileSizeConvert: util.fileSizeConvert,

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      beforeAvatarUploads(file) {
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1);
        const extension1 = testmsg === 'doc' || testmsg === 'docx' || testmsg === 'ppt' || testmsg === 'pptx' || testmsg === 'xls' || testmsg === 'xlsx' || testmsg === 'pdf' || testmsg === 'swf' || testmsg === 'jpg' || testmsg === 'jpeg' || testmsg === 'png' || testmsg === 'gif' || testmsg === 'bmp';
        const extension2 = testmsg === 'mp4' || testmsg === 'mp3';
        const isLimit30M = file.size / 1024 / 1024 < 30;
        const isLimit200M = file.size / 1024 / 1024 < 200;
        if(!(extension1) && !(extension2)) {
          this.$message({
            // message: '上传文件只能是 doc、docx、mp4、ppt、pptx、xls、xlsx、pdf、mp3、swf、jpg、jpeg、png、gif、bmp格式!',
            message: this.$t('message.Uploadfilecanonly'),
            type: 'warning'
          });
        }
        if(extension1){ //其它文件
          if(!isLimit30M){
            this.$message({
              // message: '音视频文件大小不超过200M，其他类型文件不得超过30M!',
              dangerouslyUseHTMLString:true,
              message: this.$t('message.Audioandvideo'),
              type: 'warning'
            });
            return false;
          }
        }
        if(extension2){ //视频文件
          if(!isLimit200M){
            this.$message({
              dangerouslyUseHTMLString:true,
              message: this.$t('message.Audioandvideo'),
              type: 'warning'
            });
            return false;
          }

        }
        return (extension1 || extension2) && (isLimit30M || isLimit200M);
      },
      resourceManagementQuery: function (pageIndex) {
        let param = {
          params: this.search,
          accessScope: 2,
        };
        param.params.pageIndex = (typeof pageIndex == "undefined") ? this.page.pageIndex : pageIndex;
        param.params.pageSize = this.page.pageSize;

        this.$http.get(`${process.env.NODE_ENV}/materialBank/pageList`,param)
          .then((res) => {
            if (res.data.code == 200) {
              this.page = res.data.entity;
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },

      modifyPageSkip:function (row)  {
        this.$router.push({path:"/personalCenterManagement/modify", query: {id: row.id}});
      },

      handleDelete(index, row) {
        this.doDelete([row.id]);
      },

      batchDelete: function () {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t('message.Pleaseselectatleastonerowofdata'));/*"Please select at least one row of data"*/
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.doDelete(ids);
      },

      doDelete: function (ids) {
        // let me = this;
        // this._del("/materialBank", ids, (data) => {
        //   me.resourceManagementQuery();
        // });
        this.$http.post(`${process.env.NODE_ENV}/lessonMaterial/batchDownload`, ids)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.info("Delete success");
              this.resourceManagementQuery();
            } else if (res.data.code == 300) {
              this.$router.push({path: "/login"});
            } else {
              this.$message.error(res.data.message);
            }
          });
        /*
                this.$http.post(`${process.env.NODE_ENV}/materialBank/deletes`, ids),
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'}).then((res) => {
                  if (res.data.code == 200) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!',
                    }).catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消删除'
                        })
                      });
                    this.resourceManagementQuery();
                  }
                })*/
      },

      removeFile: function (file, fileList) {
        let tmpName = file.response.entity.fileTmpName;
        for (let i = 0; i < this.addMaterials.length; i++) {
          if (tmpName  === this.addMaterials[i].localPath) {
            this.addMaterials.splice(i, 1);
          }
        }
      },

      batchUploadDialogClosed: function () {
        this.addMaterials = [];
        this.fileList = [];
      },

      goBatchUpload: function () {
        this.batchUploadDialogVisible = true;
      },

      handleFileChange: function (file, fileList) {
        console.log("upload change", file);
        console.log("upload change", fileList);
      },

      handleFileUploadSuccesss: function (resp, file, fileList) {
        if (resp.code == 200) {
          var newMaterial = {
            accessScope: 2,
            materialName: resp.entity.fileOriginName,
            localPath: resp.entity.fileTmpName,
          };

          this.addMaterials.push(newMaterial);
        } else if (resp.code == 300) {
          this.$message.error(resp.message);
          this.$router.push("/");
        } else {
          this.$message.error(resp.message);
        }
      },

      batchUpload: function () {
        if (this.addMaterials.length <= 0) {
          this.$message.error(this.$t('message.Pleaseuploadfilefirst'));/*"Please upload file first"*/
          return;
        }

        this.$http.post(`${process.env.NODE_ENV}/materialBank/batchUpload/edit`, this.addMaterials)
          .then((res) => {
            if (res.data.code == 200) {
              this.batchUploadDialogVisible = false;
              this.addMaterials = [];

              this.resourceManagementQuery();
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


      /*课时资料分享*/
      materialAdd: function (s) {
          var newMaterial = {
            lessonId: this.lessonId,
            fromWhere: 2,
            isShare: 1,
            materialName: this.page.list[s].materialName,
            localPath: this.page.list[s].localPath,
            materialBankId:this.page.list[s].id,
          };
          // let me = this;
          // this._add("/lessonMaterial", newMaterial, data => {
            this.$http.post(`${process.env.NODE_ENV}/lessonMaterial/add`,newMaterial)
              .then((res) => {
                if (res.data.code == 200) {
                  this.getMaterialList();
                  this.materialList.push(res.data.entity);
                  eventBus.$emit("getMaterialNumber","");
                  this.copyTofrommyresource=false;
                  this.$message.success(this.$t('message.success'));//"Copy Success"
                } else {
                  this.$message.error(res.data.message);
                }
              })
          // });

      },
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

/*  .el-dialog {
    width: 40% !important;

  }*/
  .addto .el-dialog {
    width: 80% !important;

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
  .el-upload__tip {
    display: inline-block;
    padding-left: 2%;
    color: #999;
  }
</style>
