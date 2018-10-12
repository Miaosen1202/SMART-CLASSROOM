<template>
  <div class="management">
    <!--{{$t('message.mycourse')}}-->
    <div>
      <p style="display: inline-block">{{$t('message.Total')}}</p>：<span>{{ page.total }}</span>
      <el-input v-model="search.courseName" size="small" :placeholder="$t('message.CourseName')" style="width: 14%"></el-input>
      <el-input v-model="search.lessonName" size="small" :placeholder="$t('message.lessonName')" style="width: 14%"></el-input>

      <el-select v-model="search.status" clearable
                 size="small" :placeholder="$t('message.Status')" style="width: 14%">
        <el-option
          v-for="stat in classRecordStatus"
          :key="stat.value"
          :label="stat.label"
          :value="stat.value">
        </el-option>
      </el-select>

      <div class="block" style="width: 30%;display: inline-block" >
        <!-- {{value6}}-->
        <el-date-picker
          style="width: 100%"
          size="small"
          v-model="searchTimeRange"
          type="daterange"
          :range-separator="$t('message.to')"
          :start-placeholder="$t('message.startdata')"
          value-format="timestamp"
          :end-placeholder="$t('message.enddata')">
        </el-date-picker>
      </div>

      <el-button type="primary" @click="loadLessonRecords(1)" style="background-color: #0138b1;color: #fff" size="small" icon="el-icon-search"></el-button>
      <el-button type="primary" @click="batchDelete()" size="mini" style="float: right;margin-left: 1%;background-color: #0138b1;">{{$t('message.batchdelete')}}</el-button>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="page.list"
        tooltip-effect="dark"
        style="width: 100%"
        :cell-style="rowSelectable"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectAll">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="lessonName"
          :label="$t('message.Lesson')"
          min-width="60%">
        </el-table-column>

        <el-table-column
          prop="courseName"
          :label="$t('message.Course')"
          min-width="50%">
        </el-table-column>

        <el-table-column
          prop="teacherName"
          :label="$t('message.Author')"
          min-width="30%">
        </el-table-column>

        <el-table-column
          prop="startTime"
          :label="$t('message.DateTime')"
          :formatter="formatDateTime"
          min-width="40%">
        </el-table-column>

        <el-table-column
          prop="status"
          :label="$t('message.Status')"
          min-width="30%">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? $t('message.Published'): (scope.row.status === 1 ? $t('message.Started') : (scope.row.status === 2 ? $t('message.Over') : $t('message.Unpublished'))) }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.Operation')">
          <template slot-scope="scope" v-if="scope.row.status != 0 && scope.row.status != 10">
            <el-button size="mini" style="border: none;color: #0e38b1" @click="handleInto(scope.$index, scope.row)">{{$t('message.enter')}}</el-button>
            <el-button size="mini" style="border: none;color: #0e38b1" @click="handleDelete(scope.$index, scope.row)">{{$t('message.delete')}}</el-button>
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
        @current-change="loadLessonRecords">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        teacherRecords: [],
        multipleSelection: [],
        page: {
          total: 0,
          pageIndex: 1,
          pageSize: 5,
          pageNumber: 5
        },
        value: '',
        value6: '',

        classRecordStatus: [{
            label: this.$t('message.Tobeinclass'),
            value: 0
          }, {
            label: this.$t('message.Haveinhand'),/*Have in hand*/
            value: 1
          }, {
            label: this.$t('message.Finished'),/*Finished*/
            value: 2
        }],

        searchTimeRange: [],
        search: {
          courseName: null,
          lessonName: null,
          status: null,
          startTime: null,
          endTime: null
        }
      }

    },
    mounted() {
      this.loadLessonRecords(1);
    },
    methods: {
      formatDateTime: function (row, column, cellVal, index) {
       /* console.log("formatter time")*/
        return util.formatDateTime(cellVal);
      },
      rowSelectable: function(data) {
       /* console.log("call row style", data)*/
        if (data.columnIndex === 0 && (data.row.status === 0 || data.row.status === 10)) {
          return {visibility: "hidden"};
        }
      },
      handleSelectAll(selection) {
        this.$refs.multipleTable.clearSelection();
        for (let i = 0; i < selection.length; i++) {
          if (selection[i].status != 0) {
            this.$refs.multipleTable.toggleRowSelection(this.page.list[i]);
          }
        }
      },
      loadLessonRecords: function (pageIndex) {
        let param = {
          params: this.search
        };
        if (this.searchTimeRange != null && this.searchTimeRange.length >= 2) {
          console.log(this.searchTimeRange);
          this.search.startTime = this.searchTimeRange[0];
          this.search.endTime = this.searchTimeRange[1];
        } else {
          this.search.startTime = null;
          this.search.endTime = null;
        }

        param.params.pageIndex = (typeof pageIndex == "undefined") ? this.page.pageIndex : pageIndex;
        param.params.pageSize = this.page.pageSize;

        this.$http.get(`${process.env.NODE_ENV}/teacherClassRecord/pageList`, param)
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
      handleInto(index, row) {
        this.$router.push({
          path: "/StartTeachingMaterials",
          query: {lessonId: row.lessonId, lessonCode: row.lessonCode}
        });
      },
      handleDelete(index, row) {
        this.doDelete([row.id])
      },
      handleSelectionChange(selection) {
        // console.log("select change", val);
        // console.log(val[0].id)
        this.multipleSelection = selection;
      },
      batchDelete: function () {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t('message.Pleaseselectatleastonerowofdata'));/* Please select at least one row of data*/
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          console.log(this.multipleSelection[i]);
          ids.push(this.multipleSelection[i].id);
        }
        this.doDelete(ids);
      },
      doDelete(ids) {
        let me = this;
        this._del("/teacherClassRecord", ids, (data) => {
          me.loadLessonRecords()
        });
        // this.$http.post(`${process.env.NODE_ENV}/teacherClassRecord/deletes`, ids)
        //   .then((res) => {
        //     if (res.data.code != 200) {
        //       this.$message.error(res.data.message);
        //     }else{
        //       this.loadLessonRecords()
        //     }
        //   }).catch((err) => {
        //   this.$message.error(err);
        // });
      }
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
</style>





