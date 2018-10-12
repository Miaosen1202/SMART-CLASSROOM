<template>
  <div id="all">

    <div class="over">
      <p style="color: #999999">{{$t('message.Pleasemodify')}}</p><!--Revise your course name and lesson name.-->
      <el-collapse accordion class="course-item" @change="courseCollapseChange">
        <el-collapse-item v-for="(course, courseIndex) in courseList"
                          :title="course.courseName" :name="course.id" :key="course.id" >
          <template slot="title">
            <img src="../../../static/images/course.png" alt="">
            <span class="course-name" :data-course-id="course.id">{{ course.courseName }}</span>
            <el-button
              size="mini"
              style="border: none"
              @click="courseDelete(course.id, courseIndex)">
              <img src="../../../static/images/shanchu.png" alt="">
            </el-button>
          </template>

          <el-table v-show="true"
            :show-header="false"
            :data="tableData"
            :data-course-id="course.id"
            class="lesson-items"
            style="width: 90%">
            <el-table-column width="600">
              <template slot-scope="scope">
                <!--<i class="el-icon-time"></i>-->
                <img src="../../../static/images/lesson.png" alt="">
                <span style="margin-left: 10px">{{ scope.row.lessonName }}</span>
              </template>
            </el-table-column>
            <el-table-column >
              <template slot-scope="scope">
                <el-button
                  style="border: none"
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"><img src="../../../static/images/Modify.png" alt=""></el-button>
                <el-button
                  size="mini"
                  style="border: none"
                  @click="handleDelete(scope.$index, scope.row)">
                  <img src="../../../static/images/shanchu.png" alt="">
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-collapse-item>
      </el-collapse>
    </div>
  </div>

</template>

<script>
    export default {
        data() {
            return {
              courseList:[],
              lessonList: [],
              tableData: []
            }
        },
        mounted() {
          this.getCourseList();
        },
        methods: {
          courseCollapseChange: function(courseId) {
            if (typeof courseId !== "undefined") {
              this.$http.get(`${process.env.NODE_ENV}/lesson/list?courseId=` + courseId)
                .then((res) => {
                  if (res.data.code == 200) {
                    this.tableData = res.data.entity;
                  } else {
                    alert(res.data.message);
                  }
                }).catch((err) => {
                  console.log(err);
                });
            }
          },
          getCourseList: function() {
            this.$http.get(`${process.env.NODE_ENV}/course/list?status=1`)
              .then((res) => {
                console.log("course list", res.data);
                if (res.data.code == 200) {
                  this.courseList = res.data.entity;
                }
              }).catch((err) => {
                console.log(err);
              });
          },
          handleEdit(index, row) {
            console.log("edit lesson, id=", row.id);
            this.$router.push({path: "/homePage/course/addMaterials", query: {"lessonId": row.id}});
          },
          courseDelete(courseId, index) {
            let me = this;
            this._del("/course", [courseId], () => me.courseList.splice(index, 1));
          },
          handleDelete(index, row) {
            let me = this;
            this._del("/lesson", [row.id], () => me.tableData.splice(index, 1));
          }
        }
    }
</script>

<style scoped>
  #all {
    width: 100%;
  }
  .over {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 3%;
    padding-top: 2%;
    background-color: #fff;
  }
  /*设置表格头部大小*/
  .cell{
    max-height: 2px !important;
    /*overflow: auto !important;*/
  }
  .el-table__header-wrapper {
    height: 2px!important;
  }
  .el-table {
    padding-left: 6%;
  }
  .el-collapse-item__content {
    padding-bottom: 0px;
  }
  /*.el-collapse{
    color: #ccc;
    border-bottom: 1px solid #ebeef5;
    font-size: 17px !important;
    font-weight: 700 !important;
  }*/

</style>
