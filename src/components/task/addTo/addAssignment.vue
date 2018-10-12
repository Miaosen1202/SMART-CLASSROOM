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
          <h5>{{$t('message.NewAssignment')}}</h5>
          <el-input
            type="textarea"
            autosize
            :placeholder="$t('message.pleaseenter')"
            v-model="assignmentName">
          </el-input>
          <!-- <div style="margin: 20px 0;"></div>-->
          <el-upload
            class="upload-demo"
            :action="action"
            :before-remove="beforeRemove"
            :on-remove="removeFile"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :with-credentials="true"
            :file-list="attachmentFileList">
            <el-button size="mini" style="background-color: #0e38b1">
              <img src="../../../assets/images/u166.png" alt="">
            </el-button>
            <div slot="tip" class="el-upload__tip">{{$t('message.AddAttachments')}}</div>
          </el-upload>

          <span slot="footer" class="dialog-footer" style="margin-left: 40%">
        <el-button style="margin-top: 2%;background-color: #0e38b1;color: #fff;" size="medium" type="primary" v-on:click="addOrUpdateAssignment()">{{$t('message.save')}}</el-button>
        <el-button size="medium" style="color: #333333" @click="cancelAddOrUpdate">{{$t('message.cancel')}}</el-button>
      </span>
        </div>

        <div class="have" v-for="(assignment,index) in assignmentList" :key="index">
          <h5>{{$t('message.Assignment')}} {{assignment.sort}}</h5>
          <el-button v-on:click="deleteAssignment(assignment.id, index)" type="text" icon="el-icon-delete">
          </el-button>
          <el-button v-on:click="goEditAssignment(assignment.id, index)" type="text" icon="el-icon-edit">
          </el-button>
          <p style="display: block;padding-bottom: 1%; margin: 0;padding-left: 2%">{{assignment.assignmentName}}</p>
          <ul style="padding-left: 2%">
            <li v-for="(attachment,ind) in assignment.attachments" :key="ind">{{attachment.fileName}}</li>
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
       /* assignmentId: '',*/
        attachments: [],
        assignmentList: [],
        editAssignmentId: undefined,
      }
    },
    mounted() {
      this.getAssignmentListByLessonId();
    },
    methods: {
      createPanelToggle: function () {
        // this.isShow = !this.isShow;
        this.createPanelShow = !this.createPanelShow;
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
          assignmentName: this.assignmentName,
          attachments: this.attachments
        };

        if (this.editAssignmentId === undefined) {
          let me = this;
          this._add("/lessonAssignment", assignment, data => {
            this.assignmentName = "";
            me.attachments =[];
            me.attachmentFileList = [];
            me.createPanelShow = false;
            me.getAssignmentListByLessonId();
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

      goEditAssignment: function (id, index) {
        let editAssignment = this.assignmentList[index];

        this.createPanelShow = true;
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
    height: 100%;
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

  .el-textarea {
    width: 70%;
    padding-bottom: 3%;
  }

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
