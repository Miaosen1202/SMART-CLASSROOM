<template>
  <div class="curriculumRecovery">
    <!--课程找回-->
    <div>
      <p style="display: inline-block">{{$t('message.Total')}}</p>：<span>{{ page.total }}</span>
      <el-input v-model="search.lessonName" size="small" :placeholder="$t('message.lessonName')" style="width: 14%"></el-input>
      <el-input v-model="search.createUserName" size="small" :placeholder="$t('message.createUser')" style="width: 14%"></el-input>
      <div class="block" style="width: 30%;display: inline-block" >
       <!-- {{value6}}-->
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

      <el-button type="primary" @click="loadRecords(1)" size="small" icon="el-icon-search" style="background-color: #0138b1;color: #fff"></el-button>
      <el-button type="primary" @click="batchDelete" size="mini" style="float: right;margin-left: 1%;background-color: #0138b1;">{{$t("message.batchdelete")}}</el-button>
    </div>

    <div>
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
          prop="lessonName"
          :label="$t('message.lessonName')"
          min-width="30%">
        </el-table-column>

        <el-table-column
          prop="courseName"
          :label="$t('message.course')"
          min-width="40%">
        </el-table-column>

        <el-table-column
          prop="createUserName"
          :label="$t('message.createUser')"
          min-width="30%">
        </el-table-column>

        <el-table-column
          prop="updateTime"
          :label="$t('message.updateTime')"
          min-width="50%">
          <template slot-scope="scope">{{ formatDateTime(scope.row.updateTime) }}</template>
        </el-table-column>

        <el-table-column :label="$t('message.Operation')">
          <template slot-scope="scope">
            <el-button
              style="border: none;color: #0e38b1"
              size="mini"
              @click="lessonRecovery(scope.$index, scope.row)">{{$t('message.recovery')}}</el-button>
            <el-button
              size="mini"
              style="border: none;color: #0e38b1"
              @click="lessonDelete(scope.$index, scope.row)">{{$t('message.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="position: absolute;bottom: 8%;left: 44%">
      <el-pagination
        background
        :page-size="page.pageSize"
        :page-count="pageNumber"
        :current-page="page.pageIndex"
        layout="prev, pager, next"
        :total="page.total"
        @current-change="loadRecords">
      </el-pagination>
    </div>

  </div>
</template>
<!--教师分页查询/teacher/pageList-->
<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        input:'',
        teacherRecords: [],
        multipleSelection: [],
        page: {
          list: [],
          total: 0,
          pageIndex: 1,
          pageSize: 5
        },
        pageNumber: 5,

        value: '',
        value6: '',

        searchTimeRange: [],
        search: {
          lessonName: "",
          createUserName: "",
          startTime: null,
          endTime: null
        }
      }
    },
    mounted() {
      this.loadRecords(this.pageIndex);
    },
    methods: {
      formatDateTime: util.formatDateTime,

      lessonRecovery: function (index, row) {
        this.$http.post(`${process.env.NODE_ENV}/lesson/recover/edit`, [row.id])
          .then((res) => {
             if (res.data.code == 200) {
               this.$message.success(this.$t("message.success"));
               this.loadRecords();
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

      batchDelete: function () {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t("message.pleaseSelectLeastOneRowOfData"));
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.doDelete(ids);
      },

      lessonDelete: function (index, row) {
        this.doDelete([row.id]);
      },

      doDelete: function (ids) {
        let me = this;
        // this.post("/lesson/deletes", ids, (data) => {
        //   me.loadRecords();
        // });

        this._del("/lesson", ids, (data) => {
          me.loadRecords();
        });
      },

      loadRecords: function(pageIndex) {
        let param = {
          params: {
            pageIndex: (typeof pageIndex == "undefined") ? this.page.pageIndex : pageIndex,
            pageSize: this.page.pageSize,
            deleteStatus: 0
          }
        };
        param.params.lessonName = this.search.lessonName;
        param.params.createUserName = this.search.createUserName;

        if (this.searchTimeRange != null && this.searchTimeRange.length > 0) {
          param.params.startTime = new Date(this.searchTimeRange[0]).getTime();
          param.params.endTime = new Date(this.searchTimeRange[1]).getTime();
        }

        this.$http.get(`${process.env.NODE_ENV}/lesson/pageList`, param)
          .then((res) => {
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              return;
            }
            this.page = res.data.entity;
          }).catch((err) => {
            this.$message.error(err);
        });
      },

      handleSelectionChange(selection) {
        this.multipleSelection = selection;
      },
    }
  }
</script>

<style scoped="">
  .curriculumRecovery {
    margin: 2%;
    margin-top: 0px;
    padding-top: 2%;
  }
  .end-placeholder {
    margin-left: 6% !important;
  }
</style>


