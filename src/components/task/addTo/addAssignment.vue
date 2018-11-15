<template>
  <div style="height: 100%;">
    <div class="no-record assignment" v-show="!showAssignmentListPanel">
      <p><img src="../../../assets/images/u1046.png" width="140" height="139" alt=""></p>
      <p style="display: block;padding-top: 0px">{{$t('message.Empty')}}</p>
      <el-button style="background-color: #0e38b1" size="medium" type="primary" @click="goToAddAssignment">
        <img src="../../../assets/images/u60.png" alt="">
      </el-button>
    </div>
    <div class="all assignment-panel" v-show="showAssignmentListPanel">
      <el-scrollbar style="height: 100%">
        <div class="create" v-on:click="createPanelToggle()">
          <el-button  size="medium"  style="border: 1px solid #f17e26;color: #f17e26">
            <p>
              <img src="../../../../static/images/Creat.png" alt="">
              {{$t('message.CreateanAssignment')}}
            </p>
          </el-button>
        </div>
        <div class="discussion" v-show="createPanelShow">
          <h5 v-if="flag == 'add'">{{$t('message.NewAssignment')}}</h5>
          <h5 v-if="flag == 'edit'">{{$t('message.Assignment')}}  {{showSort}}</h5>
          <el-input
            style="width: 98%"
            type="textarea"
            maxlength="500"
            @input = "descInput"
            autosize
            :placeholder="$t('message.pleaseenter')"
            v-model="assignmentName">
          </el-input>
          <span style="float: right;padding-right: 2%;font-size: 12px;color: #999999">{{remnant}}{{$t('message.byte')}}</span>
          <!-- <div style="margin: 20px 0;"></div>-->
          <el-upload
            style="padding-top: 2%"
            class="upload-demo"
            :action="action"
            :before-remove="beforeRemove"
            :on-remove="removeFile"
            :before-upload="beforeAvatarUpload"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :with-credentials="true"
            accept=".doc,.docx,.mp4,.ppt,.pptx,.xls,.xlsx,.pdf,.mp3,.swf,.jpg,.jpeg,.png,.gif,.bmp"
            :file-list="attachmentFileList">
            <el-button size="mini" style="background-color: #26be96;color: #fff;">
              <img src="../../../assets/images/u166.png" alt="">
              {{$t('message.AddAttachments')}}
            </el-button>
            <div slot="tip" class="el-upload__tip" style="font-size: 12px;color: #999999">{{$t('message.Onlysupport')}}</div><!--Only support-->
          </el-upload><!--  accept=".doc,.docx,.mp4,.ppt,.pptx,.xls,.xlsx,.pdf,.mp3,.swf,.jpg,.jpeg,.png,.gif,.bmp"-->

          <span slot="footer" class="dialog-footer" style="margin-left: 40%">
        <el-button style="margin-top: 2%;background-color: #0e38b1;color: #fff;" size="medium" type="primary" v-on:click="addOrUpdateAssignment()">{{$t('message.save')}}</el-button>
        <el-button size="medium" style="color: #333333" @click="cancelAddOrUpdate">{{$t('message.cancel')}}</el-button>
      </span>
        </div>

        <div class="have" v-for="(assignment,index) in assignmentList" :key="index">
          <h5>{{$t('message.Assignment')}} {{assignment.sort}}</h5>
          <el-button v-on:click="deleteAssignment(assignment.id, index)" type="text" icon="el-icon-delete">
          </el-button>
          <el-button v-on:click="goEditAssignment(assignment.id,assignment.sort, index)" type="text" icon="el-icon-edit">
          </el-button>
          <p style="display: block;padding-bottom: 1%; margin: 0;padding-left: 2%;word-break: break-all;">{{assignment.assignmentName}}</p>
          <ul style="padding-left: 2%">
            <li v-for="(attachment,ind) in assignment.attachments" :key="ind">
              <!--{{attachment.fileName}}-->
              <file-template :id="attachment.id" :name="attachment.fileName" :url="attachment.fileUrl"></file-template>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import eventBus from '../../../eventBus'

  export default {
    data() {
      return {
        remnant:500,
        showAssignmentListPanel: false,
        createPanelShow: false,
        isShow: true,
        assignmentName: '',
        attachmentFileList: [],
        action: process.env.NODE_ENV + '/file/upload',
        removedFileName: "",
        fileEntity: {},
        boName: '',
        loading: true,
        lessonId: this.$route.query.lessonId,
        attachments: [],
        assignmentList: [],
        editAssignmentId: undefined,
        showSort:1,
        flag:'add',
        videoType:["mp4","mp3"]

      }
    },
    mounted() {
      this.getAssignmentListByLessonId();
    },
    methods: {

      descInput(){
        var txtVal = this.assignmentName.length;
        this.remnant = 500-txtVal;
      },
     /* isSupportBigFile( type) {
        let result = false;
        for (let i = 0; i < this.videoType.length; i++) {
          if (this.videoType[i] == type) {
            result =true;
            break;
          }
        }
        return result;

      },
      beforeAvatarUpload(file) {
       /!*||docx||ppt||pptx||xls||xlsx||pdf||swf||jpg||jpeg||png||gif||bmp*!/
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1);
        let isLt2M;
        if (this.isSupportBigFile(testmsg)) {
          //100
          isLt2M = file.size / 1024 / 1024 < 200;
          if(!isLt2M) {
            this.$message({
              message: '上传文件大小不能超过 200MB!!',
              type: 'warning'
            });
          }

          return isLt2M;
          //大于100 提示错误
        }else {
          //2 0
          isLt2M = file.size / 1024 / 1024 < 2;
          if(!isLt2M) {
            this.$message({
              message: '上传文件大小不能超过 30MB!!',
              type: 'warning'
            });
          }
          return isLt2M;
          //同上 提示错误

        }
       /!* const extension = testmsg === 'xls';
        const extension2 = testmsg === 'xlsx';*!/
     /!*   const isMP = file.type === 'mp4||mp3';*!/

        /!*const isLt1M = file.size / 1024 / 1024 < 200;*!/
        // if(!isJPGs) {
        //   this.$message({
        //     message: '上传文件为 xls、xlsx格式!',
        //     type: 'warning'
        //   });
        // }
       /!* if(!isMP) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          });
        }*!/
        // if(!isLt2M) {
        //   this.$message({
        //     message: '上传文件为.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.swf,.jpg,.jpeg,.png,.gif,.bmp大小不能超过 10MB!',
        //     type: 'warning'
        //   });
        // }
       /!* if(!isLt1M) {
          this.$message({
            message: '上传文件大小不能超过 1MB!',
            type: 'warning'
          });
        }*!/
        return true;

      },*/



      beforeAvatarUpload(file) {
        debugger;
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1);
        const extension1 = testmsg === 'doc' || testmsg === 'docx' || testmsg === 'ppt' || testmsg === 'pptx' || testmsg === 'xls' || testmsg === 'xlsx' || testmsg === 'pdf' || testmsg === 'swf' || testmsg === 'jpg' || testmsg === 'jpeg' || testmsg === 'png' || testmsg === 'gif' || testmsg === 'bmp';
        const extension2 = testmsg === 'mp4' || testmsg === 'mp3';
        const isLimit30M = file.size / 1024 / 1024 < 1;
        const isLimit200M = file.size / 1024 / 1024 < 3;
        if(!(extension1) && !(extension2)) {
          this.$message({
            message: '上传文件只能是 doc、docx、mp4、ppt、pptx、xls、xlsx、pdf、mp3、swf、jpg、jpeg、png、gif、bmp格式!',
            type: 'warning'
          });
        }
        if(extension1){ //其它文件
          if(!isLimit30M){
            this.$message({
              message: '上传文件大小不能超过 1MB!',
              type: 'warning'
            });
            return false;
          }
        }
        if(extension2){ //视频文件
          if(!isLimit200M){
            this.$message({
              message: '上传文件大小不能超过 2MB!',
              type: 'warning'
            });
            return false;
          }

        }
        return (extension1 || extension2) && (isLimit30M || isLimit200M);
      },


      createPanelToggle: function () {
        // this.isShow = !this.isShow;
        this.createPanelShow = !this.createPanelShow;
        this.flag = 'add';
      },
      goToAddAssignment: function() {
        this.createPanelShow = true;
        this.showAssignmentListPanel = true;
      },
      beforeRemove(file, fileList) {
        this.removedFileName = file.name;
      },
      removeFile(file, fileList) {
        console.log(fileList);
        /*this.attachments.forEach((e)=>{
          if(e.fileName == this.removedFileName){

          }

        })*/
        for (let i = 0; i < this.attachments.length; i++) {
          if (this.attachments[i].fileName == this.removedFileName) {
            this.attachments.splice(i, 1);
            break;
          }
        }
      },
      handleChange(file, fileList) {
        this.attachmentFileList = fileList;
      },
      handleSuccess(res, file) {
        console.log(res);
        if (res.code == 200) {
          this.fileEntity = res.entity;
          this.attachments.push(
            {
              fileLocalPath: this.fileEntity.fileTmpName,
              fileName: this.fileEntity.fileOriginName
            });
        }
      },

      cancelAddOrUpdate: function() {
        this.createPanelShow = false;
        this.assignmentName = "";
        this.attachments = [];
        this.attachmentFileList = [];
        this.editAssignmentId = undefined;
        this.showAssignmentListPanel = this.assignmentList.length > 0;
      },

      addOrUpdateAssignment: function () {
        let assignment = {
          lessonId: this.lessonId,
          assignmentName: this.assignmentName.trim(),
          attachments: this.attachments
        };

        if (assignment.assignmentName === "" && assignment.attachments.length === 0) {
          this.$message.error(this.$t("message.assignmentSaveNeedContentOrAttachmentNotEmpty"));
          return;
        }

        if (this.editAssignmentId === undefined) {
          let me = this;
          this._add("/lessonAssignment", assignment, data => {

            this.assignmentName = "";
            me.attachments =[];
            me.attachmentFileList = [];
            me.createPanelShow = false;
            me.getAssignmentListByLessonId();
            eventBus.$emit("getAssignmentNumber","");
          });
          // this.$http.post(`${process.env.NODE_ENV}/lessonAssignment/add`, assignment)
          //   .then((res) => {
          //     if (res.data.code == 200) {
          //       this.assignmentName = "";
          //       this.attachments =[];
          //       this.attachmentFileList = [];
          //       this.createPanelShow = false;
          //       this.getAssignmentListByLessonId();
          //     }
          //   }).catch((err) => {
          //   this.$message.error(err);
          // });
        } else {
          assignment["id"] = this.editAssignmentId;
          this.$http.post(`${process.env.NODE_ENV}/lessonAssignment/modify`, assignment)
            .then((res) => {
              if (res.data.code == 200) {
                this.assignmentName = "";
                this.attachments =[];
                this.attachmentFileList = [];
                this.createPanelShow = false;
                this.editAssignmentId = undefined;
                this.getAssignmentListByLessonId();
              }
            }).catch((err) => {
            this.$message.error(err);
          });
        }

      },

      getAssignmentListByLessonId() {
        this.$http.get(`${process.env.NODE_ENV}/lessonAssignment/list?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              eventBus.$emit("getAssignmentNumber","");
              this.assignmentList = res.data.entity;
              this.showAssignmentListPanel = this.assignmentList.length > 0;
              this.createPanelShow = this.assignmentList.length == 0;
            }
          }).catch((err) => {
            this.$message.error(err);
        });


      },

      deleteAssignment:function (id, index) {
        let me = this;
        this._del("/lessonAssignment", [id], () => me.getAssignmentListByLessonId());
        // this.$http.post(`${process.env.NODE_ENV}/lessonAssignment/deletes`, [id])
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.getAssignmentListByLessonId();
        //     } else {
        //       this.$message.error(res.data.message);
        //     }
        //   }).catch((err) => {
        //     this.$message.error(err);
        // });
      },

      goEditAssignment: function (id,sort,index) {
        let editAssignment = this.assignmentList[index];

        this.createPanelShow = true;
        this.flag = 'edit';
        this.showSort = sort;
        this.editAssignmentId = editAssignment.id;
        this.assignmentName = editAssignment.assignmentName;
        this.attachments = editAssignment.attachments || [];
        this.attachmentFileList = [];
        for (let i = 0; i < this.attachments.length; i++) {
          this.attachmentFileList.push({
            name: this.attachments[i].fileName,
            url: this.attachments[i].fileUrl
          });
        }
      }
    }
  }
</script>

<style scoped="">
  .all {
    width: 98%;
    height: 106%;
  }

  p {
    display: inline-block;
    padding-top: 2%;
    margin: 0px;
  }

  .el-button--small {
    padding: 0px 3%;
  }

  .create {
    margin: 2% 0px;
  }

  .discussion {
    border: 1px solid #ccc;
    width: 96%;
    padding-left: 2%;
    padding-bottom: 2%;
    background-color: #f9f9f9;
  }

 /* .el-textarea {
    width: 70%;
    padding-bottom: 3%;
  }*/

  .el-upload {
    width: 30% !important;
  }

  .el-upload__tip {
    display: inline-block;
    padding-left: 2%;
    color: #999;
  }

  .el-upload-list__item-name {
    color: #0066CC !important;
  }

  .have {
    border: 1px solid #ccc;
    width: 96%;
    padding-left: 2%;
    margin-top: 2%;
    margin-bottom: 2%;
  }

  .have ul li {
    color: #0066CC;
    font-size: 12px;
  }

  .have h5 {
    display: inline-block;
    border-bottom: 2px solid #999;
  }

  .have .el-button {
    float: right;
    padding-right: 2%;
  }

  .el-icon-delete:before {
    color: red !important;
  }

  .no-record.assignment {
    text-align: center;
    margin-top: 4%;
  }
  .no-record.assignment p:first-child {
    color: #ccc;
    margin-bottom: 3%;
  }
  .no-record.assignment p:nth-child(2) {
    color: #999;
    margin-bottom: 3%;
  }
  .no-record .el-button--medium {
    padding: 1% 5%;
  }
  .no-record input[type="file"] {
    display: none!important;
  }
  .assignment {
    text-align: center;
    margin-top: 4%;
  }
  .assignment p:first-child {
    color: #ccc;
    margin-bottom: 3%;
  }
  .assignment p:nth-child(2) {
    color: #999;
    margin-bottom: 3%;
  }
  .el-button--medium {
    padding: 1% 5%;
  }
  input[type="file"] {
    display: none!important;
  }
</style>
