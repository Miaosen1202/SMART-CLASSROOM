<template>
  <div class="all">
    <!--资源管理-->
    <div>
      <p style="display: inline-block">{{$t('message.Total')}}</p>：<span style="font-weight: 700;padding-right: 1%">{{ page.total }}</span>
      <el-input v-model="search.materialName" size="small" :placeholder="$t('message.resourceName')" style="width: 20%"></el-input>
      <el-select v-model="search.materialType" clearable="" :placeholder="$t('message.pleaseselect')" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="resourceManagementQuery(1)" style="background-color: #0138b1;color: #fff" size="small" icon="el-icon-search"></el-button>
      <el-button size="mini" @click="batchDelete" style="float: right;margin-left: 1%;">
        <img src="../../../../static/images/Deleteinbatches.png" height="18" alt="">
        {{$t('message.batchdelete')}}
      </el-button>
      <el-button type="primary" size="mini" @click="goBatchUpload" style="float: right;margin-left: 1%;background-color: #26be96;border: 1px solid #28be6b">
        <img src="../../../../static/images/BatchUpload.png" height="18" alt="">
        {{$t('message.batchUpload')}}
      </el-button>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="resourceManagementList"
        tooltip-effect="dark"

        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="materialName" :label="$t('message.fileName')" min-width="50%" align="center">
          <template slot-scope="scope">
            <file-template
              data-placement="auto"
              :show-overflow-tooltip="true"
              :id="scope.row.id"
              :url="scope.row.materialUrl"
              :name="scope.row.materialName"
              @download="resourceManagementQuery"
              @afterPreview="resourceManagementQuery"
            ></file-template>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName"
                         data-placement="auto"
                         :show-overflow-tooltip="true"
                         :label="$t('message.createUser')"
                         min-width="30%" align="center">
        </el-table-column>
        <el-table-column prop="fileType" :label="$t('message.Category')" min-width="30%" align="center"></el-table-column>
        <el-table-column prop="fileSize" :label="$t('message.fileSize')" min-width="30%" align="center"></el-table-column>
        <el-table-column prop="updateTime" :formatter="dateTimeFormatter" :label="$t('message.updateTime')" min-width="50%" align="center"></el-table-column>
      <!--  <el-table-column prop="viewCount" :label="$t('message.viewNumber')" width="130" align="center"></el-table-column>-->
        <el-table-column :label="$t('message.Operation')" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              style="border: none;color: #0e38b1"
              size="mini"
              @click="modifyPageSkip(scope.row)">{{$t("message.edit")}}</el-button>
            <span style="color: #0e38b1;padding-left: 1%">|</span>
            <el-button
              style="border: none;color: #0e38b1"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)">{{$t("message.delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="position: absolute;bottom: 8%;left: 44%">
      <el-pagination
        background
        :page-size="page.pageSize"
        :page-count="page.pageNumber"
        :current-page="page.pageIndex"
        layout="prev, pager, next"
        :total="page.total"
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
        style="padding-left: 4%"
        class="material-batch-upload"
        name="file"
        accept=".doc,.docx,.mp4,.ppt,.pptx,.xls,.xlsx,.pdf,.mp3,.swf,.jpg,.jpeg,.png,.gif,.bmp"
        :file-list="fileList"
        :action="fileUploadPath"
        with-credentials
        :on-change="handleFileChange"
        :before-upload="beforeAvatarUpload"
        :on-remove="removeFile"
        :on-success="handleFileUploadSuccess"
        >
        <el-button size="small" type="primary" style="background-color: #0e38b1;color: #fff">{{$t('message.upload')}}</el-button>
        <div slot="tip" class="el-upload__tip">{{$t('message.Onlysupport')}}</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="batchUploadDialogVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button style="background-color: #0e38b1;color: #fff" @click="batchUpload">{{$t('message.save')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        input:'',
        batchUploadDialogVisible: false,
        fileUploadPath: `${process.env.NODE_ENV}/file/upload`,
        fileList: [],
        addMaterials : [],
        filePreview: {
          dialogVisible: false,
          previewUrl: ""
        },

        page: {
          total: 0,
          pageIndex: 1,
          pageSize: 5,
          pageNumber: 5
        },
        teacherNameSearch: '',
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
        search:{
          materialName:null,
          materialType:null
        }
      }
    },
    mounted() {
      this.resourceManagementQuery(this.pageIndex);
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

      dateTimeFormatter: function (row, col, date) {
        return util.formatDateTime(date);
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      batchUploadDialogClosed: function () {
        this.addMaterials = [];
        this.fileList = [];
      },
      goBatchUpload: function () {
        this.batchUploadDialogVisible = true;
      },

      removeFile: function (file, fileList) {
        let tmpName = file.response.entity.fileTmpName;
        for (let i = 0; i < this.addMaterials.length; i++) {
          if (tmpName  === this.addMaterials[i].localPath) {
            this.addMaterials.splice(i, 1);
          }
        }
      },
      batchDelete: function () {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t('message.pleaseSelectLeastOneRowOfData'));
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.doDelete(ids);
      },
      handleDelete(index, row) {
        this.doDelete([row.id]);
      },
      resourceManagementQuery: function(pageIndex) {
        var param = {
          params: {
            accessScope: 2,
            pageIndex: (typeof pageIndex == "undefined") ? this.page.pageIndex : pageIndex,
            pageSize: this.page.pageSize,

          }
        };
        if (this.search.materialName && this.search.materialName.trim()) {
          param.params.materialName  = this.search.materialName;
        }
        if (this.search.materialType && this.search.materialType.trim()) {
          param.params.fileType  = this.search.materialType;
        }

        this.$http.get(`${process.env.NODE_ENV}/materialBank/pageList`, param)
          .then((res) => {
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              return;
            }
            this.resourceManagementList = res.data.entity.list;
            this.page.total = res.data.entity.total;
            this.page.pageIndex =param.params.pageIndex;
            /*this.page.pageSize = res.data.entity.pageSize;*/
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      /*modifyPageSkip:function ()  {
        this.$router.push({path:"/admin/configurationManagement"});
      },*/
      modifyPageSkip:function (row)  {
        this.$router.push({path:"/admin/configurationManagement", query: {id: row.id}});
      },

      doDelete: function (ids) {
        let me = this;
        this._del("/materialBank", ids, (data) => {
          me.resourceManagementQuery();
        });
        // this.$http.post(`${process.env.NODE_ENV}/materialBank/deletes`, ids)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.$message.info("Delete success");
        //       this.resourceManagementQuery();
        //     } else if (res.data.code == 300) {
        //       this.$router.push({path: "/login"});
        //     } else {
        //       this.$message.error(res.data.message);
        //     }
        //   });
      },
      handleFileChange: function (file, fileList) {
        console.log("upload change", file);
        console.log("upload change", fileList);
      },

      handleFileUploadSuccess: function (resp, file, fileList) {
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

        this.$http.post(`${process.env.NODE_ENV}/materialBank/batchUpload/edit`,this.addMaterials)

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
      }
    }
  }
</script>
<style>
  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
    word-break: break-all;
    word-wrap:break-word;
  }
</style>

<style scoped="">
  .all {
    margin: 2%;
    margin-top: 0px;
    padding-top: 2%;
  }
  .el-upload__tip {
    display: inline-block;
    padding-left: 2%;
    color: #999;
  }
</style>

