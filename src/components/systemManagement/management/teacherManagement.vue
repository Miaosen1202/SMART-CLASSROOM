<template>
  <div class="management">
    <div>
      <p style="display: inline-block">{{$t('message.Total')}}</p>：<span style="font-weight: 700">{{ page.total }}</span>
      <el-input v-model="teacherNameSearch" size="small" :placeholder="$t('message.pleaseentername')" style="width: 20%;margin-left: 1%"></el-input>
      <el-button @click="loadTeacherRecords(1)" style="background-color: #0138b1;color: #fff" size="small" icon="el-icon-search"></el-button>
      <el-button @click="resetPassword"  size="mini" style="float: right;margin-left: 1%;">
        <img src="../../../../static/images/Resettheinitializationpassword.png" height="18" alt="">
        {{$t('message.ResetPassword')}}</el-button>
      <el-button type="primary" @click="goImportStudent" size="mini" style="float: right;background-color: #0138b1">
        <img src="../../../../static/images/Importteacherdata.png" height="18" alt="">
        {{$t('message.Import')}}</el-button>
      <el-button  @click="getImportTpl" size="mini" style="float: right;">
        <img src="../../../../static/images/UPLOAD.png" height="18" alt="">
        {{$t('message.Download')}}</el-button>
      <!--<el-upload
        class="upload-demo"
        :action="action"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :with-credentials="true"
        :file-list="fileList3"
        style="display: inline-block;float: right;">
        <el-button type="primary" size="mini" style="float: right;">导入教师数据</el-button>
      </el-upload>-->
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="teacherRecords"
        tooltip-effect="dark"
        style="width: 100%"
        min-height="70%"

        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="teacherNo" :label="$t('message.Account')" min-width="30%"></el-table-column>
        <el-table-column prop="name"
                         data-placement="auto"
                         :show-overflow-tooltip="true"
                         :label="$t('message.Name')"
                         min-width="30%" align="center">
        </el-table-column>
        <el-table-column prop="email"
                         data-placement="auto"
                         :show-overflow-tooltip="true"
                         :label="$t('message.EMail')"
                         min-width="40%" align="center">
        </el-table-column>
        <el-table-column prop="cellPhoneNo" :label="$t('message.Phone')" min-width="40%" align="center"></el-table-column>
        <el-table-column prop="subject"
                         data-placement="auto"
                         :show-overflow-tooltip="true"
                         :label="$t('message.Category')"
                         min-width="30%">
        </el-table-column>
        <el-table-column prop="updateTime" :label="$t('message.updateTime')" min-width="42%" align="center">
           <template slot-scope="scope">{{ formatDateTime(scope.row.updateTime) }}</template>

        </el-table-column>
        <el-table-column prop="status" :label="$t('message.Status')" min-width="30%" align="center">
          <template slot-scope="scope">{{ scope.row.status == 1 ? $t("message.enable") : $t("message.disable") }}</template>
        </el-table-column>

        <el-table-column :label="$t('message.Operation')" width="260" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button style="border: none;color: #0138b1;"  size="mini" @click="editTeacher(scope.$index, scope.row)">{{ scope.row.status == 1 ? $t("message.disable") : $t("message.enable") }}</el-button>
            <el-button style="border: none;color: #0138b1;"  size="mini" @click="showStudentEditDialog(scope.$index, scope.row)" >| {{$t("message.edit")}} |</el-button>
            <el-button style="border: none;color: #0138b1;"  size="mini"  @click="deleteStudent(scope.$index, scope.row)">{{$t("message.delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="position: absolute;bottom: 6%;left: 44%">
        <el-pagination
          background
          :page-size="page.pageSize"
          :page-count="page.pageNumber"
          :current-page="page.pageIndex"
          layout="prev, pager, next"
          :total="page.total"
          @current-change="loadTeacherRecords">
        </el-pagination>
      </div>
      <!--编辑弹框-->
      <el-dialog
        :title="$t('message.teacherEdit')"
        :visible.sync="teacherEditDialogVisable"
        width="20%">
        <div class="projectile" style="padding-left: 10%">
          <ul>
            <li>
              <span>{{$t('message.Account')}}：</span>
              <el-input disabled v-model="editStudent.teacherNo" size="small" :placeholder="$t('message.Account')" style="width: 60%"></el-input>
              <el-input disabled v-show="false" v-model="editStudent.id" size="small" style="width: 60%"></el-input>
            </li>
            <li>
              <span>{{$t('message.Name')}}：</span>
              <el-input
                v-model.trim="editStudent.name"
                size="small"
                ref="test"
                :placeholder="$t('message.Name')"
                style="width: 60%">
              </el-input>
              <i class="double" style="color: red;font-size: 22px" >*</i>
            </li>
            <li>
              <span>{{$t('message.EMail')}}：</span>
              <el-input v-model="editStudent.email" size="small" :placeholder="$t('message.EMail')" style="width: 60%"></el-input>
            </li>
            <li>
              <span>{{$t('message.Phone')}}：</span>
              <el-input v-model="editStudent.cellPhoneNo" size="small" :placeholder="$t('message.Phone')" style="width: 60%"></el-input>
            </li>
            <li>
              <span style="padding-right: 10%">{{$t('message.Status')}}：</span>
              <el-radio v-model="editStudent.status" label="1">{{$t('message.enable')}}</el-radio>
              <el-radio v-model="editStudent.status" label="0">{{$t('message.disable')}}</el-radio>
              <!-- <span style="color: red;padding-left: 18%">“*”{{$t('message.Forarequireditem')}}</span>-->
            </li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align: right">
    <el-button @click="hideTeacherEditDialog">{{$t('message.cancel')}}</el-button>
    <el-button type="primary" @click="editTeacherModify">{{$t('message.confirm')}}</el-button>
  </span>
      </el-dialog>
    </div>
    <!-- 数据导入弹框 -->
    <el-dialog
      :title="$t('message.importTeacherData')"
      :visible.sync="teacherImportDialogVisible"
      width="30%"
      @close="teacherImportDialogClose"
      center>

      <el-upload
        style="padding-left: 4%"
        class="student-data-upload"
        name="file"
        accept=".xls,.xlsx,"
        with-credentials
        :file-list="teacherDataFileList"
        :action="getUploadFilePath()"
        :on-change="handleUploadFileChange"
        :before-upload="beforeUpload"
        :on-success="handleUploadFileSuccess">
        <el-button size="small" style="background-color: #0e38b1;color: #fff">
          <img src="../../../../static/images/UPLOAD1.png" alt="">
          {{$t('message.upload')}}</el-button>
        <div slot="tip" class="el-upload__tip">{{$t('message.Onlysupportxls')}}</div>
      </el-upload>

      <el-checkbox style="padding-left: 4%;padding-top: 2%" v-model="overrideExistsTeacherNoData">
        {{$t('message.overwriteExistsData')}}</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport">{{$t('message.cancel')}}</el-button>
        <el-button style="background-color: #0e38b1;color: #fff" @click="confirmImport">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        teacherEditDialogVisable: false,
        input: '',
        radio: '1',
        teacherNameSearch: '',
        page: {
          total: 0,
          pageIndex: 1,
          pageSize: 5,
          pageNumber: 5
        },
        isSubmit: 1,
        /*action: process.env.NODE_ENV + '/teacher/import/edit',*/
        exercises: {},
        questionType: '1',
        teacherRecords: [],
        tableData: [],
        multipleSelection: [],
        editStudent: {},
        teacherImportDialogVisible: false,
        teacherDataFilePath: "",
        teacherDataFileList: [],
        overrideExistsTeacherNoData: false
      }
    },
    mounted() {
      this.loadTeacherRecords(this.pageIndex);
    },
    methods: {
      formatDateTime: util.formatDateTime,

      teacherImportDialogClose: function () {
        this.teacherDataFileList = [];
        this.overrideExistsTeacherNoData = null;
      },

      loadTeacherRecords: function(pageIndex) {
        var param = {
          params: {
            pageIndex: (typeof pageIndex == "undefined") ? this.page.pageIndex : pageIndex,
            pageSize: this.page.pageSize
          }
        };
        if (this.teacherNameSearch && this.teacherNameSearch.trim()) {
          param.params.name = this.teacherNameSearch;
        }

        this.$http.get(`${process.env.NODE_ENV}/teacher/pageList`, param)
          .then((res) => {
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              return;
            }
            this.teacherRecords = res.data.entity.list;
            this.page.total = res.data.entity.total;
            this.page.pageIndex =param.params.pageIndex;
            /*this.page.pageSize = res.data.entity.pageSize;*/
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      handleSelectionChange(selection) {
        // console.log("select change", val);
        // console.log(val[0].id)
        this.multipleSelection = selection;
      },
      editTeacher(index, row) {
        let status = row.status == 1 ? 0 : 1;
        let param = {
          id: row.id,
          status: status
        };
        this.$http.post(`${process.env.NODE_ENV}/user/status/edit`, param)
          .then((res) => {
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              return;
            }

            row.status = status;
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      showStudentEditDialog: function(index, row) {
        this.$http.get(`${process.env.NODE_ENV}/dictionary/list`, {params: {dictionaryCode: "student.major", status: 1}})
          .then((res) => {
            if (res.data.code == 200) {
              this.studentMajors = res.data.entity;

              this.teacherEditDialogVisable = true;
              this.editStudent = {
                id: row.id,
                teacherNo: row.teacherNo,
                name: row.name,
                cellPhoneNo: row.cellPhoneNo,
                email: row.email,
                status: row.status + "",
                sex: row.sex + ""
              };
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });

      },


      hideTeacherEditDialog: function() {
        this.teacherEditDialogVisable = false;
      },


      editTeacherModify: function() {
        console.log("update", this.editStudent);
        if(this.editStudent.name === ''){
          this.$refs.test.focus();
          this.$message.error(this.$t('message.Pleaseenteryourname'));
          return ;
        }
        this.$http.post(`${process.env.NODE_ENV}/teacher/modify`, this.editStudent)
          .then((res) => {

            if (res.data.code == 200) {
              this.$message.info(this.$t('message.Modifyteachersuccess'));/*"Modify teacher success"*/
              this.hideTeacherEditDialog();
              this.loadTeacherRecords(this.pageIndex);
            }else {
              this.$message.error(this.$t('message.Modifyteacherfail') + res.data.message);/*"Modify teacher fail: "*/
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },
      getImportTpl() {
        window.open(`../../../static/tpl/teacher_import_`+localStorage.lang+'.xlsx');
      },
      /*教师数据导入*/
      goImportStudent: function() {
        this.teacherImportDialogVisible =  true;
      },
      getUploadFilePath: function () {
        return util.fileUploadPath();
      },

      handleUploadFileSuccess: function (res, file, fileList) {
        console.log(res)
        if (res.code == 200) {
          this.teacherDataFilePath = res.entity.fileTmpName;
        } else {
          this.teacherDataFileList = [];
          this.$message.error(res.message);
        }
      },

      handleUploadFileChange: function (file, fileList) {
        if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
          this.$message.error(this.$t("message.onlySupportFileType") + "xls, xlsx");
          if (fileList.length > 1) {
            this.teacherDataFileList = fileList.slice(0, 1);
          }
          return;
        }
        this.teacherDataFileList = fileList.slice(-1);
      },
      beforeUpload: function(file) {
        if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
          return false;
        }
        return true;
      },

      cancelImport: function () {
        this.teacherImportDialogVisible = false;
        this.teacherDataFileList = [];
      },
      confirmImport: function () {
        if (this.teacherDataFilePath == "") {
          this.$message.error(this.$t('message.Pleaseuploadfile'));/* "Please upload file"*/
          return;
        }

        let param = {
          fileName: this.teacherDataFilePath,
          override: this.overrideExistsTeacherNoData ? true : null
        };

        this.$http.post(`${process.env.NODE_ENV}/teacher/import/edit`, param)
          .then((res) => {
            if (res.data.code == 200) {
              this.teacherImportDialogVisible = false;
              this.teacherDataFileList = [];

              this.$message.info(this.$t("message.importDataSuccess"));
              this.loadTeacherRecords(1);
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
      },

      /*handleEdit(index, row) {
        console.log(index, row);
      },*/
      deleteStudent(index, row) {
        this.doDeleteStudent([row.id]);
      },
      /*batchDelete: function () {
        if (this.multipleSelection.length == 0) {
          this.$message.error("Please select at least one row of data");
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.doDeleteStudent(ids);
      },*/
      doDeleteStudent: function (ids) {
        let me = this;
        this._del("/teacher", ids, (data) => {
          me.loadTeacherRecords(this.page.pageIndex);
        });
        // this.$http.post(`${process.env.NODE_ENV}/teacher/deletes`, ids)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.$message.info("Delete success");
        //       this.loadTeacherRecords(this.page.pageIndex);
        //     }
        //   }).catch((err) => {
        //   this.$message.error(err);
        // });
      },
      resetPassword: function() {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t('message.pleaseSelectLeastOneRowOfData'));/*pleaseSelectLeastOneRowOfData*/
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.$http.post(`${process.env.NODE_ENV}/user/resetPassword/edit`, {userIds: ids})
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success(this.$t('message.Resetuserspasswordsuccess'))/*"Reset user's password success"*/
            } else {
              this.$message.error(this.$t('message.Resetuserspasswordfail')+ res.data.message);/* "Reset user's password fail: "*/
            }
          }).catch((err) => {
          this.$message.error(err);
        });
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

  .el-dialog {
    width: 32% !important;
  }

  .projectile ul li {
    margin-top: 2%;
    text-align: right;
    padding-right: 18%;
    position: relative;
  }
  .double{
    position: absolute;
    top:0;
    right:40px;
  }
  .el-upload__tip {
    display: inline-block;
    padding-left: 2%;
    color: #999;
  }

</style>
