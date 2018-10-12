<template>
  <div style="height: 100%">
    <div class="no-discuss" v-show="!showDiscussListPanel">
      <p><img src="../../../assets/images/u674.png" alt=""></p>
      <p>{{$t('message.Empty')}}</p>
      <el-button style="background-color: #0e38b1" size="medium" type="primary" @click="goToAddDiscussion">
        <img src="../../../assets/images/u60.png" alt="">
      </el-button>
    </div>

    <div class="discuss-panel" style="height: 100%" v-show="showDiscussListPanel">
      <el-scrollbar style="height: 100%">

        <div class="create" v-on:click="createPanelToggle()">
          <el-button size="medium" style="border: 1px solid #f17e26;color: #f17e26">
            <p>
              <img src="../../../../static/images/Creat.png" alt="">
              {{$t('message.CreateaDiscussion')}}
            </p>
          </el-button>
        </div>
        <div class="discussion" v-show="createPanelShow">
          <h5>{{$t('message.NewDiscussion')}}</h5>
          <!--v-model="lessonName"-->
          <!--输入框输入内容-->
          <el-input
            type="textarea"
            autosize
            :placeholder="$t('message.Enterdiscussion')"
            v-model="discussContent">
          </el-input><!-- //Enter discussion content here.-->

          <!--上传文件-->
          <el-upload
            class="upload-demo"
            :action="action"
            :before-remove="beforeRemove"
            :on-remove="removeFile"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :with-credentials="true"
            :file-list="fileList3">
            <el-button size="mini"  style="background-color: #0e38b1">
              <img src="../../../assets/images/u166.png" alt="">
            </el-button>
            <div slot="tip" class="el-upload__tip">{{$t('message.AddAttachments')}}</div>
          </el-upload>
          <!--按钮-->
          <span slot="footer" class="dialog-footer" style="margin-left: 40%">
            <el-button style="margin-top: 2%;background-color: #0e38b1;color: #fff" size="medium"  v-on:click="sure">{{$t('message.save')}}</el-button>
            <el-button size="medium" style="color: #333333" @click="cancelCreateDiscuss">{{$t('message.cancel')}}</el-button>
          </span>
        </div>

        <div class="have" v-for="(discussion,index) in discussionList" :key="index">
          <h5>{{$t('message.Discussion')}} {{discussion.sort}}</h5>
          <el-button v-on:click="deleteDiscussion(discussion.id)" type="text" icon="el-icon-delete"><!--错误符号-->
          </el-button>
          <el-button v-on:click="goEditDiscuss(discussion.id, index)" type="text" icon="el-icon-edit">
          </el-button>
          <p style="display: block;padding-bottom: 1%; margin: 0;padding-left: 2%">{{discussion.discussContent}}</p>
          <ul style="padding-left: 2%">
            <li v-for="(attachment,ind) in discussion.attachments" :key="ind">{{attachment.fileName}}</li>
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
        showDiscussListPanel: false,
        createPanelShow: false,
        discussContent: '',
        fileList3: [],
        action: process.env.NODE_ENV + '/file/upload',
        removedFileName:"",
        fileEntity: {},
        boName: '',
        loading: true,
        lessonId:this.$route.query.lessonId,
        discussionId: "",
        attachments: [],
        discussionList:[],//课堂列表
        editDiscussId: undefined,
      };
    },
    mounted(){
      this.getDiscussionListByLessonId();
    },
    methods: {
      cancelCreateDiscuss: function() {
        this.createPanelShow = false;
        this.discussContent = "",
        this.fileList3 = [];
        this.attachments = [];
        this.editDiscussId = undefined;
        this.showDiscussListPanel = this.discussionList.length > 0;
      },
      goToAddDiscussion: function() {
        this.showDiscussListPanel = true;
        this.createPanelShow = true;
      },
      createPanelToggle: function(){
        this.createPanelShow = !this.createPanelShow;
      },
      beforeRemove(file,fileList){
        this.removedFileName = file.name;
      },
      removeFile(file,fileList){
        console.log(fileList);
        /*this.attachments.forEach((e)=>{
          if(e.fileName == this.removedFileName){
          }
        })*/

        for(let i=0;i<this.attachments.length;i++){
          if(this.attachments[i].fileName == this.removedFileName){
            this.attachments.splice(i,1);
            break;
          }
        }
      },

      handleChange(file, fileList) {
        this.fileList3 = fileList;
      },

      handleSuccess(res, file) {
        if (res.code == 200) {
          this.fileEntity = res.entity;
          this.attachments.push(
            {
              fileLocalPath: this.fileEntity.fileTmpName,
              fileName: this.fileEntity.fileOriginName
            });
        }
      },
      sure: function () {
        var discussion = {
          lessonId: this.lessonId,
          discussContent: this.discussContent,
          attachments: this.attachments
        };

        if (typeof this.editDiscussId == "undefined") {
          let me = this;
          this._add("/classDiscuss", discussion, data => {
            me.discussContent = "",
            me.fileList3 = [];
            me.attachments = [];
            me.getDiscussionListByLessonId();
            me.createPanelShow = false;
          });
          // this.$http.post(`${process.env.NODE_ENV}/classDiscuss/add`, discussion)
          //   .then((res) => {
          //     if (res.data.code == 200) {
          //       this.discussContent = "";
          //       this.fileList3 = [];
          //       this.attachments = [];
          //       this.getDiscussionListByLessonId();
          //       this.createPanelShow = false;
          //     }
          //   }).catch((err) => {
          //   console.log(err);
          // });
        } else {
          discussion["id"] = this.editDiscussId;
          this.$http.post(`${process.env.NODE_ENV}/classDiscuss/modify`, discussion)
            .then((res) => {
              if (res.data.code == 200) {
                this.discussContent = "";
                this.fileList3 = [];
                this.attachments = [];
                this.getDiscussionListByLessonId();
                this.editDiscussId = undefined;
                this.createPanelShow = false;
              } else {
                this.$message.error(res.data.message);
              }
            }).catch((err) => {
              this.$message.error(err)
          });
        }
      },

      //课堂讨论列表
      getDiscussionListByLessonId(){
        this.$http.get(`${process.env.NODE_ENV}/classDiscuss/list?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {

              this.discussionList = res.data.entity;
              this.showDiscussListPanel = this.discussionList.length > 0;
              this.createPanelShow = this.discussionList.length == 0;
            }
          }).catch((err) => {
          console.log(err);
        });

      },
      goEditDiscuss: function (id, index) {
        let editDiscuss = this.discussionList[index];
        console.log("go edit, id=" + id + ", index=" + index, editDiscuss);

        this.createPanelShow = true;
        this.editDiscussId = editDiscuss.id;
        this.discussContent = editDiscuss.discussContent;
        this.attachments = editDiscuss.attachments ? editDiscuss.attachments.slice() : [];

        this.fileList3 = [];
        for (let i = 0; i < this.attachments.length; i++) {
          this.fileList3.push({
            name: this.attachments[i].fileName,
            url: this.attachments[i].fileUrl
          })
        }
      },
      /*删除列表*/
      deleteDiscussion:function (id) {
        let me = this;
        this._del("/classDiscuss",[id],()=>me.getDiscussionListByLessonId());
        // this.$http.post(`${process.env.NODE_ENV}/classDiscuss/deletes`,[id])
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       /*this.discussionId = res.data.entity;
        //       console.log("discussionId:"+this.discussionId);*/
        //       this.getDiscussionListByLessonId();
        //     }
        //   }).catch((err) => {
        //   console.log(err);
        // });
      }
    }
  }
</script>

<style scoped>
  .all {
    width: 98%;
    height: 100%;
  }

 .create p {
    display: inline-block;
    padding-top: 2%;
    margin: 0px;
  }

  .el-button p:last-child {

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
    font-weight: 700;
  }

  .have .el-button {
    float: right;
    padding-right: 2%;
  }
  .el-icon-delete:before {
    color: red !important;
  }
  .no-discuss {
    text-align: center;
    margin-top: 4%;
  }
  .no-discuss p:first-child {
    color: #ccc;
    margin-bottom: 3%;
  }
  .no-discuss p:nth-child(2) {
    color: #999;
    margin-bottom: 3%;
  }
  .no-discuss .el-button--medium {
    padding: 1% 5%;
  }
</style>
