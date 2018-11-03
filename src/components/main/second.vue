<template>
  <div id="all">

    <div class="over">
      <p style="color: #999999">{{$t('message.Pleasemodify')}}</p><!--Revise your course name and lesson name.-->
      <el-scrollbar style="height: 90%">
      <el-collapse accordion class="course-item" @change="courseCollapseChange">
        <el-collapse-item v-for="(course, courseIndex) in courseList"
                          :title="course.courseName" :name="course.id" :key="course.id" >
          <template slot="title">
            <img src="../../../static/images/course.png" alt="">
            <span class="course-name" :data-course-id="course.id" style="white-space: nowrap;text-overflow:ellipsis;overflow: hidden;display: inline-block;width: 80%;vertical-align: middle;">{{ course.courseName }}</span>
            <el-button
              size="mini"
              style="border: none"
              @click="courseModifyNameHandler(course)"
              >
              <img src="../../../static/images/Modify.png" alt="">
            </el-button>

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
            style="width: 99%">
            <el-table-column width="600">
              data-placement="auto"
              :show-overflow-tooltip="true"
              <template slot-scope="scope">
                <!--<i class="el-icon-time"></i>--><!---->
                <span @click="handleEdit(scope.$index, scope.row)">
                  <img   src="../../../static/images/lesson.png" alt="" style="cursor: pointer">
                <span style="text-overflow:ellipsis;display: inline-block;width: 96%;vertical-align: middle;overflow:hidden;white-space:nowrap;cursor: pointer" >{{ scope.row.lessonName }}</span>
                </span>

              </template>
            </el-table-column>
            <el-table-column >
              <template slot-scope="scope"><!-- @click="courseModify(scope.$index, scope.row)"-->
                <el-button
                  size="mini"
                  style="border: none;float: right;margin-right: 16%"
                  @click="handleDelete(scope.$index, scope.row)">
                  <img src="../../../static/images/shanchu.png" alt="">
                </el-button>
                <el-button
                  style="border: none;float: right;margin-right: 1%;"
                  size="mini"
                  @click="modifyNameHandler(scope.row)">
                 <img src="../../../static/images/Modify.png" alt=""></el-button><!-- @click="handleEdit(scope.$index, scope.row)"-->

              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      </el-scrollbar>
    </div>
    <!--修改course-->
    <el-dialog
      :title="$t('message.coursename')"
      :visible.sync="courseDialogVisible"
      width="30%">
      <div class="projectile" style="padding-left: 10%">
        <ul>
          <li>
            <span>{{$t('message.NameS')}}：</span>
            <el-input size="small" v-model="courseName" :placeholder="$t('message.coursename')" style="width: 60%"></el-input>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCourseEditDialog">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="modifyNameHandlerConfirmcourse">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog>

    <!--编辑弹框-->
    <el-dialog
      :title="$t('message.lessonname')"
      :visible.sync="teacherEditDialogVisable"
      width="20%">
      <div class="projectile" style="padding-left: 10%">
        <ul>
          <li>
            <span>{{$t('message.NameS')}}：</span>
            <el-input size="small" v-model="lessonName" :placeholder="$t('message.coursename')" style="width: 60%"></el-input>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: right">
    <el-button @click="hideTeacherEditDialog">{{$t('message.cancel')}}</el-button>
    <el-button type="primary" @click="modifyNameHandlerConfirm">{{$t('message.confirm')}}</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
    export default {
        data() {
            return {
              courseDialogVisible: false,
              courseList:[],
              lessonList: [],
              tableData: [],
              teacherEditDialogVisable: false,
              lessonName: null,
              lessonId: null,
              courseId: null,
              courseName:null,
              id:null
            }
        },
        mounted() {
          this.getCourseList();
        },

        methods: {
          modifyNameHandler(row) {
            this.teacherEditDialogVisable = true;
            this.lessonName = row.lessonName;
            this.lessonId = row.id;
            this.courseId = row.courseId;
          },
          modifyNameHandlerConfirm() {
            if (this.lessonId != null && this.lessonName != null) {
              this.$http.post(`${process.env.NODE_ENV}/lesson/modify`, {"id": this.lessonId,"lessonName":this.lessonName})
                .then((res) => {
                  if (res.data.code == 200) {
                    this.courseCollapseChange(this.courseId);
                    this.teacherEditDialogVisable=false
                  } else {
                    this.$message.error(res.data.message);
                  }
                }).catch((err) => {
                this.$message.error(err);
              });
            }
          },

          courseModifyNameHandler(course) {
            this.courseDialogVisible = true;
            this.courseName = course.courseName;
            this.id = course.id;
          },
          modifyNameHandlerConfirmcourse() {
            if (this.id != null && this.courseName != null) {
              this.$http.post(`${process.env.NODE_ENV}/course/modify`, {"id": this.id,"courseName":this.courseName})
                .then((res) => {
                  if (res.data.code == 200) {
                    this.getCourseList();
                    this.courseCollapseChange();
                    this.courseDialogVisible=false;

                  } else {
                    this.$message.error(res.data.message);
                  }
                }).catch((err) => {
                this.$message.error(err);
              });
            }
          },


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
               /* console.log("course list", res.data);*/
                if (res.data.code == 200) {
                  this.courseList = res.data.entity;
                }
              }).catch((err) => {
                console.log(err);
              });
          },
          hideTeacherEditDialog: function() {
            this.teacherEditDialogVisable = false;
          },
          hideCourseEditDialog: function() {
            this.courseDialogVisible = false;
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
    /*overflow-x: hidden;
    overflow-y: auto;*/
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
    padding-left: 2%;
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
.el-collapse-item__arrow el-icon-arrow-left {
  float: left!important;
}
</style>
