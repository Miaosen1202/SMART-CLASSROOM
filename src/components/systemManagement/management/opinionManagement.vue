<template>
  <div class="management">
    <div>
      <p style="display: inline-block">{{$t('message.Total')}}</p>：<span style="font-weight: 700;padding-right: 1%">{{ page.total }}</span>
      <!--<el-input v-model="input" size="small" placeholder="请输入意见内容查询" style="width: 14%"></el-input>-->
      <el-input v-model="search.replyerName" size="small" :placeholder="$t('message.plfrom')" style="width: 14%"></el-input>
      <el-select v-model="search.replyStatus" size="small" clearable :placeholder="$t('message.plStatus')" style="width: 14%">
        <el-option
          v-for="item in replyStatusOps"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="block" style="width: 30%;display: inline-block" >
        <el-date-picker
          style="width: 100%"
          size="small"
          v-model="searchTimeRange"
          type="datetimerange"
          :range-separator="$t('message.to')"
          :start-placeholder="$t('message.startdata')"
          :end-placeholder="$t('message.enddata')"
          >
        </el-date-picker>
      </div>
      <el-button  @click="loadFeedbackRecord(1)"  style="background-color: #0138b1;color: #fff" size="small" icon="el-icon-search"></el-button>
      <el-button @click="batchDelete"  size="mini" style="float: right;margin-left: 1%;">
        <img src="../../../../static/images/Deleteinbatches.png" height="18" alt="">
        {{$t('message.batchdelete')}}
      </el-button>
    </div>

    <div class="mangementtable">
      <el-table
        ref="multipleTable"
        :data="page.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          width="50" align="center">
        </el-table-column>

        <el-table-column
          prop="content"
          :label="$t('message.feedback')"
          min-width="60%" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="goReply(scope.$index, scope.row)">{{scope.row.content}}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="replyerName"
          data-placement="auto"
          :show-overflow-tooltip="true"
          :label="$t('message.from')"
          min-width="30%" align="center">
        </el-table-column>

        <el-table-column
          prop="createTime"
          :label="$t('message.fromdata')"
          min-width="50%" align="center">
          <template slot-scope="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>

        <el-table-column
          prop="replyStatus"
          :label="$t('message.Status')"
          min-width="30%" align="center">
          <template slot-scope="scope">{{ scope.row.replyStatus == 1 ? $t('message.replied') : $t('message.notReplied') }}</template>
        </el-table-column>

        <el-table-column
          prop="updateTime"
          :label="$t('message.Disposaltime')"
          min-width="60%" align="center">
          <template slot-scope="scope">{{ formatDateTime(scope.row.updateTime) }}</template>
        </el-table-column>


        <el-table-column :label="$t('message.Operation')" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              style="border: none;color: #0e38b1"
              size="mini"
              @click="goReply(scope.$index, scope.row)">{{$t('message.reply')}}</el-button>
            <span style="color: #0e38b1;padding-left: 1%">|</span>
            <el-button
              size="mini"
              style="border: none;color: #0e38b1"
              @click="handleDelete(scope.$index, scope.row)">{{$t('message.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="position: absolute;bottom: 8%;left: 44%">
      <el-pagination
        background
        :page-size="page.pageSize"
        :current-page="page.pageIndex"
        :page-count="pageNumber"
        layout="prev, pager, next"
        :total="page.total"
        @current-change="loadFeedbackRecord">
      </el-pagination>
    </div>

    <!--编辑反馈弹框-->
    <el-dialog
      @close="replyDialogClose"
      :title="$t('message.opinion')"
      :visible.sync="replyDialogVisible"
      height="400px"
      width="90%">

      <div class="projectile" style=" width: 100%;height: 400px;overflow: auto">
        <el-scrollbar style="height: 100%">
          <div style="padding:2% 6%;">
        <span><i>{{ this.feedbackDetail.root.replyerName }}</i> {{$t('message.reportedOn')}} </span>
        <span>{{ formatDateTime(this.feedbackDetail.root.createTime) }}</span>
        <!--<div style="padding: 2%; margin: 2%; border: 1px solid black">-->
          <!--{{ this.feedbackDetail.root.content }}-->
        <!--</div>-->
        <div class="textarea-modify">
          <el-input
            :readonly="true"
            type="textarea"
            autosize
            v-model="this.feedbackDetail.root.content">
          </el-input>
          <ul style="padding-left: 2%">
            <li  style="word-break:break-all;" v-for="(attachment,ind) in feedbackDetail.root.attachments" :key="ind">

              <file-template :id="attachment.id" :url="attachment.fileUrl" :name="attachment.fileName"></file-template>

            </li>
          </ul>

        </div>
        <div class="reply">
          <ul>
            <li v-for="fd in feedbackDetail.replyList">
              <span><h4 style="display: inline-block">{{ fd.replyerName }}</h4> {{ formatDateTime(fd.createTime) }}</span>
              <p style="word-break:break-all;">{{$t('message.Replied')}}:
                <el-input
                  :readonly="true"
                  type="textarea"
                  autosize
                  :placeholder="$t('message.pleaseEnter')"
                  v-model="fd.content">
                </el-input>
              </p>

            </li>
            <!--<li>
              <el-upload
                :action="action"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </li>-->
          </ul>
        </div>
        <el-input
          type="textarea"
          maxlength="4000"
          @input = "descInput"
          autosize
          :placeholder="$t('message.pleaseenter')"
          v-model="reply.content">
        </el-input>
            <span style="float: right;padding-right: 0%;font-size: 12px;color: #999999">{{remnant}}{{$t('message.byte')}}</span>
          </div>
        </el-scrollbar>
      </div>

      <span slot="footer" class="dialog-footer" style="text-align: right">
        <el-button  @click="cancelReply">{{$t('message.cancel')}}</el-button>
        <el-button style="background-color: #0e38b1;color: #fff" @click="addReply">{{$t('message.save')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import util from '@/utils/util'
  import eventBus from '../../../eventBus'
  export default {
    data() {
      return {
        attachments: [],
        remnant:4000,
        replyDialogVisible: false,
        action: process.env.NODE_ENV + '/file/upload',
        replyStatusOps: [{
          /*label: "待反馈",*/
          label:this.$t('message.notReplied'),
          value: 0
        }, {
          label: this.$t('message.replied'),
          value: 1
        }],
        // value: '',

        page: {
          list: [],
          total: 0,
          pageIndex: 1,
          pageSize: 5,
        },
        pageNumber: 5,

        multipleSelection: [],

        searchTimeRange: [],
        search: {
          replyId: -1,
          replyStatus: '',
          replyerName: '',
          startTime: '',
          endTime: '',
        },

        feedbackDetail: {
          root: {},
          replyList: []
        },

        reply: {
          content: null
        },
      }
    },

    mounted() {
      this.loadFeedbackRecord();
    },

    methods: {
      descInput(){
        var txtVal = this.reply.content.length;
        this.remnant = 4000-txtVal;
      },

      formatDateTime: util.formatDateTime,

      loadFeedbackRecord: function(pageIndex) {
        if (this.searchTimeRange != null && this.searchTimeRange.length >= 2) {
          this.search.startTime = util.formatDateTime(this.searchTimeRange[0]);
          this.search.endTime = util.formatDateTime(this.searchTimeRange[1]);
        } else {
          this.search.startTime = null;
          this.search.endTime = null;
        }

        let param = {
          params: this.search
        };
        param.params.pageIndex = (typeof pageIndex == "undefined") ? this.page.pageIndex : pageIndex;
        param.params.pageSize = this.page.pageSize;

        this.$http.get(`${process.env.NODE_ENV}/feedback/pageList`, param)
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

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      goReply: function (index, row) {
        this.replyDialogVisible = true;
        this.loadFeedbackReply(row.id);
      },

      addReply: function () {
        let reply = {
          content: this.reply.content,
          replyId: this.feedbackDetail.root.id,
        };

        if (reply.content === null || reply.content === '' || reply.content.trim() === "") {
          this.$message.error(this.$t('message.Pleaseinputreplycontent'));/*Please input reply content*/
          return;
        }

        let me = this;
        this._add("/feedback", reply, data => {
          me.$message.info(this.$t('message.Replysuccess'));/*"Reply success"*/
          me.reply.content = '';
          me.loadFeedbackReply(reply.replyId);
        });
        // this.$http.post(`${process.env.NODE_ENV}/feedback/add`, reply)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.$message.info("Reply success");
        //       this.reply.content = '';
        //       this.loadFeedbackReply(reply.replyId);
        //     } else {
        //       this.$message.error(this.data.message);
        //     }
        //   }).catch((err) => {
        //     this.$message.error(err);
        // });
      },
      cancelReply: function () {
        this.replyDialogVisible = false;
        this.reply.content = '';
      },

      replyDialogClose: function () {
        this.loadFeedbackRecord();
      },

      loadFeedbackReply: function (id) {
        this.feedbackReplyDetail = [];

        this.$http.get(`${process.env.NODE_ENV}/feedback/reply/query`, {params: {rootId: id}})
          .then((res) => {
            if (res.data.code == 200) {
              this.feedbackDetail.root = res.data.entity.list[0];
              this.feedbackDetail.replyList = res.data.entity.list.slice(1);

            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
           this.$message.error(err);
        });
      },

      handleDelete: function (index, row) {
        this.doDelete([row.id]);
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

      doDelete: function (ids) {
        let me = this;
        this._del("/feedback", ids, (data) => {
          me.loadFeedbackRecord(me.page.pageIndex);
        });
        // this.$http.post(`${process.env.NODE_ENV}/feedback/deletes`, ids)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.$message.info("Delete success");
        //       this.loadFeedbackRecord(this.page.pageIndex);
        //     }
        //   }).catch((err) => {
        //     this.$message.error(err);
        // });
      },
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
  .management {
    margin: 2%;
    margin-top: 0px;
    padding-top: 2%;
  }
  .end-placeholder {
    margin-left: 6% !important;
  }
  .mangementtable .el-tooltip__popper {
    width: 50%!important;
  }
  .el-dialog__body {
    overflow: auto;
    width: 100%;
    height: 200px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #ccc;
    width: 90%;
    margin: 0 auto;
  }

  .el-radio {
    width: 60%;
  }

  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    word-break: inherit;
    line-height: 23px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap!important;
  }
  .textarea-modify textarea {
    border: none;
  }
</style>



