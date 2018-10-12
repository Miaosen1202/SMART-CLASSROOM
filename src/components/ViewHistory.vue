<template>
  <div id="viewhistory">
    <!--<div class="historytop">
      <p>Welcome {{ getLoginUser().name }} !</p>
      <p @click="logout" style="float: right;padding-right: 2%;cursor: pointer">
        <img src="../assets/images/u118.png" alt="">
      </p>
    </div>-->






    <!--表格建立 样式修改2018/9/6-->
    <!--:header-cell-style="{background:'#ccc',color:'#fff'}"-->
    <div class="all">
      <el-table
        :data="teacherTeachingHistoryRecords"
        style="width: 100%;"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
       >
        <el-table-column prop="lessonName" :label="$t('message.Lesson')" width="180"></el-table-column>
        <el-table-column prop="courseName" :label="$t('message.Course')" width="180"></el-table-column>
        <el-table-column prop="teacherName" :label="$t('message.Teacher')" width="180"></el-table-column>
        <el-table-column prop="time" :label="$t('message.DateTime')" :formatter="formatter"></el-table-column>
        <el-table-column :label="$t('message.Operation')">
          <template slot-scope="scope">
            <el-button style="border: none;color: #0138b1;" size="mini" @click="goTeaching(scope.$index, scope.row)">{{$t('message.enter')}}</el-button>
            <el-button style="border: none;color: #0138b1;" size="mini"  @click="handleDelete(scope.$index, scope.row)">{{$t('message.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :page-size="pageSize"
        :page-count="5"
        :current-page="pageIndex"
        layout="prev, pager, next"
        :total="recordNumber"
        @current-change="loadTeacherTeachingHistory">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import util from '../utils/util'

  export default {
    data() {
      return {
        pageSize: 5,
        pageIndex: 1,
        recordNumber: 0,
        teacherTeachingHistoryRecords: [],

      }
    },

    mounted() {
      this.loadTeacherTeachingHistory(this.pageIndex);
    },
    methods: {
      getLoginUser: util.getLoginUser,

      formatter: function (row, column, cellVal, index) {
        var st = new Date(row.startTime);
        var et = new Date(row.endTime);

        return this.formatDateTime(st);
      },
      formatDateTime: util.formatDateTime,

      goTeaching: function(index, row) {
        // this.$router.push({path: "/homePage/course", query: {"lessonId": row.lessonId}});

        this.$router.push({path: "/StartTeachingMaterials", query: {"lessonId": row.lessonId, lessonCode: row.lessonCode,isShow: false}});
        // StartTeachingMaterials?lessonId=80&lessonCode=XDQ9
      },
      loadTeacherTeachingHistory: function (pageIndex) {
        var param = {
          pageIndex: pageIndex,
          pageSize: this.pageSize,
          status: 2
        };
        let  me = this;
        this.get("/teacherClassRecord/pageList",{params: param},function (data) {
          me.teacherTeachingHistoryRecords = data.entity.list;
          me.pageIndex = data.entity.pageIndex;
          me.recordNumber = data.entity.total;
        });
        // this.$http.get(`${process.env.NODE_ENV}/teacherClassRecord/pageList`, {params: param})
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.teacherTeachingHistoryRecords = res.data.entity.list;
        //       this.pageIndex = res.data.entity.pageIndex;
        //       this.recordNumber = res.data.entity.total;
        //     } else {
        //       alert(res.data.message);
        //     }
        //   }).catch((err) => {
        //     alert(err);
        //   });
      },
      handleDelete: function (index, row) {
        console.log("handle delete, index=" + index, row)
        let me=this;
        //todo xxxx
        this._del("/teacherClassRecord", [row.id],function (data) {
          me.loadTeacherTeachingHistory(me.pageIndex);
        })
        // this.$http.post(`${process.env.NODE_ENV}/teacherClassRecord/deletes`, [row.id])
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.loadTeacherTeachingHistory(this.pageIndex);
        //     } else {
        //       alert(res.data.message);
        //     }
        //   }).catch((err) => {
        //     console.error("delete error", err);
        //     alert(err);
        //   });
      },
      logout: function() {
        this.$http.post(`${process.env.NODE_ENV}/logout`)
          .then((res) => {
            this.$router.push({path: "/"});
          }).catch((err) => {
          this.$message.error("Logout error: " + err);
          this.$router.push({path: "/"});
        });
      },

    }
  }
</script>

<style scoped="">
  .all {
    width: 90%;
    height: 80%;
    display: inline-block;
    vertical-align: middle;
    padding-left: 4%;
    margin-top: 2%;
  }

  #viewhistory {
    width: 100%;
    height: 80%;
  }

  .historytop {
    width: 100%;
    height: 10%;
    font-family: 'Arial Normal', 'Arial';
    background-color: rgb(248, 248, 248);
    /* position: fixed;
     z-index: 99999;*/
  }

  /*.historytop p {
    display: inline-block;
    padding-top: 1%;
    padding-left: 2%;
  }*/

  .historymain {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    overflow: auto;
    padding-top: 4%;

  }

  .have {
    border: 1px solid #ccc;
    width: 100%;
    padding-left: 2%;
    padding-right: 2%;
    position: relative;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: none;
    margin-bottom: 2%;
  }
  .have ul li {
    color: #0066CC;
    font-size: 12px;
  }

  .have h5 {
    display: inline-block;
    font-weight: 700;
  }
  .lesson {
    border: 1px solid #ccc;
    width: 100%;
    padding: 2%;
    margin-bottom: 2%;
    box-sizing: border-box;
    background-color: rgba(248, 248, 248, 1);
    border-color: rgba(204, 204, 204, 1);
    border-radius: 4px;
    box-shadow: none;
  }
  p {
    display: inline-block;
  }
  .el-table th, .el-table tr {
    cursor: pointer;
  }
</style>
