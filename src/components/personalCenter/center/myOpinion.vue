<template>
  <div class="management">
    <div>
      <p style="display: inline-block">{{$t('message.Total')}}</p>：<span>{{ page.total }}</span>
      <el-select v-model="search.replyStatus" size="small" clearable :placeholder="$t('message.Status')" style="width: 14%">
        <el-option
          v-for="stat in replyStatusOps"
          :key="stat.value"
          :label="stat.label"
          :value="stat.value">
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
          :end-placeholder="$t('message.enddata')">
        </el-date-picker>
      </div>
      <el-button type="primary" @click="loadFeedbackRecord(1)" style="background-color: #0138b1;color: #fff" size="small" icon="el-icon-search"></el-button>

      <el-button type="primary" @click="goReply()" size="mini" style="float: right;margin-left: 1%;background-color: #0138b1;color: #fff">{{$t('message.reply')}}</el-button>
      <el-button type="primary" @click="batchDelete" size="mini" style="float: right;margin-left: 1%;background-color: #0138b1;color: #fff">{{$t('message.batchdelete')}}</el-button>
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
          width="50">
        </el-table-column>

        <el-table-column
          data-placement="auto"
          :show-overflow-tooltip="true"
          prop="content"
          :label="$t('message.Description')"
          min-width="60%">
        </el-table-column>

        <el-table-column
          prop="startTime"
          :label="$t('message.DateTime')"
          min-width="50%">
          <template slot-scope="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>

        <el-table-column
          prop="replyStatus"
          :label="$t('message.Status')"
          min-width="30%">
          <template slot-scope="scope">{{ scope.row.replyStatus == 1 ? $t('message.replied') : $t('message.notReplied') }}</template>
        </el-table-column>

        <el-table-column
          prop="endTime"
          :label="$t('message.TimeofDisposal')"
          min-width="60%">
          <template slot-scope="scope">{{ formatDateTime(scope.row.updateTime) }}</template>
        </el-table-column>

        <el-table-column :label="$t('message.Operation')">
          <template slot-scope="scope">

            <el-button style="border: none;color: #0e38b1" size="mini" :disabled="scope.row.replyStatus == 0"
              @click="goReply(scope.row)"> {{$t('message.reply')}}</el-button>

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
        :page-count="page.pageNumber"
        :current-page="page.pageIndex"
        layout="prev, pager, next"
        :total="page.total"
        @current-change="loadFeedbackRecord">
      </el-pagination>
    </div>


    <!--编辑反馈弹框-->
    <el-dialog
      @close="replyDialogClose"
      :title="$t('message.feedback')"
      :visible.sync="replyDialogVisible"
      width="50%">
      <div class="projectile" style=" width: 100%;height: 400px;overflow: auto">
        <el-scrollbar style="height: 100%">
          <div style="padding:2% 6%;">
        <div class="root-reply" v-show="this.feedbackDetail.root.id != null">
          <span><i>{{ this.feedbackDetail.root.replyerName }}</i>{{$t('message.reportedon')}}</span>
          <span>{{ formatDateTime(this.feedbackDetail.root.createTime) }}</span>
          <div style="padding: 2%; margin: 2%; border: 1px solid black">{{ this.feedbackDetail.root.content }}</div>
        </div>

        <div>
          <!--<ul>
            <li v-for="fd in feedbackDetail.replyList">
              <span>{{ formatDateTime(fd.createTime) }}</span>
              <span>{{ fd.replyerName }}</span>回复:
              <span>{{ fd.content }}</span>
            </li>
          </ul>-->
          <ul>
            <li v-for="fd in feedbackDetail.replyList">
              <span><h4 style="display: inline-block">{{ fd.replyerName }}</h4> {{ formatDateTime(fd.createTime) }}</span>
              <p style="word-break:break-all;">{{$t('message.Replied')}}: {{ fd.content }}</p>
            </li>
          </ul>
        </div>
        <el-input
          type="textarea"
          autosize
          :placeholder="$t('message.pleaseEnter')"
          v-model="reply.content">
        </el-input>
      </div>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="cancelReply">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="addReply">{{$t('message.reply')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        multipleSelection: [],
        page: {
          total: 0,
          pageIndex: 1,
          pageSize: 5,
          pageNumber: 5,
          list: []
        },

        replyStatusOps: [{
          label: this.$t('message.notReplied'),
          value: 0
        }, {
          label: this.$t('message.replied'),
          value: 1
        }],

        searchTimeRange: [],
        search: {
          replyId: -1,
          replyStatus: '',
          startTime: '',
          endTime: '',
        },

        replyDialogVisible: false,
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
      formatDateTime: util.formatDateTime,

      loadFeedbackRecord: function (pageIndex) {
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

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      batchDelete: function () {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t('message.Pleaseselectatleastonerowofdata'));/* "Please select at least one row of data"*/
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.doDelete(ids);
      },

      handleDelete: function (index, row) {
        this.doDelete([row.id]);
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
        //     } else if (res.data.code == 300) {
        //       this.$message.info(res.data.message);
        //       this.$router.push("/");
        //     } else {
        //       this.$message.info(res.data.message);
        //     }
        //   }).catch((err) => {
        //     this.$message.error(err);
        // });
      },


      goReply: function (row) {
        this.replyDialogVisible = true;

        if (row !== undefined) {
          this.loadFeedbackReply(row.id);
        }
      },

      addReply: function () {
        let reply = {
          content: this.reply.content,
          replyId: this.feedbackDetail.root.id,
        };

        if (reply.content === null || reply.content === '' || reply.content.trim() === "") {
          this.$message.error(this.$t('message.Pleaseinputreplycontent'));/* Please input reply content*/
          return;
        }

        let me = this;
        this._add("/feedback", reply, data => {
          me.reply.content = '';
          if (reply.replyId) {
            me.loadFeedbackReply(reply.replyId);
          } else {
            me.replyDialogVisible = false;
          }
        });
        // this.$http.post(`${process.env.NODE_ENV}/feedback/add`, reply)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.$message.info("Reply success");
        //       this.reply.content = '';
        //
        //       if (reply.replyId) {
        //         this.loadFeedbackReply(reply.replyId);
        //       } else {
        //         this.replyDialogVisible = false;
        //       }
        //     } if (res.data.code == 300) {
        //       this.$message.error(this.data.message);
        //       this.$router.push("/");
        //     } else {
        //       this.$message.error(this.data.message);
        //     }
        //
        //     return null;
        //   }).catch((err) => {
        //     this.$message.error(err);
        // });
      },

      cancelReply: function () {
        this.replyDialogVisible = false;
        this.reply.content = '';
      },

      replyDialogClose: function () {
        this.feedbackDetail.root = {};
        this.feedbackDetail.replyList = [];

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
    }
  }
</script>

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
  .end-placeholder {
    margin-left: 6% !important;
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
</style>




