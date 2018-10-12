<template>
  <div class="management">
    <!--{{$t('message.studentManagement')}}-->
    <div>
      <p style="display: inline-block"> {{$t('message.Total')}}</p>：<span>{{ page.total }}</span>
      <el-input v-model="studentNameSearch" size="small" :placeholder="$t('message.Studentname')" style="width: 20%"></el-input>
      <el-button type="primary" @click="loadStudentRecords(1)" size="small" icon="el-icon-search" style="background-color: #0138b1;color: #fff"></el-button>
      <el-button type="primary" @click="batchDelete" size="mini" style="float: right;margin-left: 1%;background-color: #0138b1">{{$t('message.batchdelete')}}</el-button>
      <el-button type="primary" @click="resetPassword" size="mini" style="float: right;margin-left: 1%;background-color: #0138b1">{{$t('message.ResetPassword')}}</el-button>
      <!--<el-button type="primary" @click="getImportModelFile" size="mini" style="float: right;">获取学生导入模板</el-button>-->
      <el-button type="primary" @click="goImportStudent" size="mini" style="float: right;background-color: #0138b1">{{$t('message.importdata')}}</el-button>
      <el-button type="primary" @click="getImportTpl" size="mini" style="float: right;background-color: #0138b1">{{$t('message.Download')}}</el-button>

    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="studentRecords"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column
          prop="userName"
          :label="$t('message.Account')"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('message.Name')"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="email"
          :label="$t('message.EMail')"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="cellPhoneNo"
          :label="$t('message.Phone')"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="majorName"
          :label="$t('message.major')"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="className"
          :label="$t('message.class')"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          :label="$t('message.updateTime')"
          min-width="36%">
          <template slot-scope="scope">{{ formatDateTime(scope.row.updateTime) }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('message.Status')"
          min-width="26%">
          <template slot-scope="scope">{{ scope.row.status == 1 ? $t("message.enable") : $t("message.disable") }}</template>
        </el-table-column>

        <el-table-column :label="$t('message.Operation')">
          <template slot-scope="scope">
            <el-button
              style="border: none;color: #0138b1;"
              size="mini"
              @click="editStudentStatus(scope.$index, scope.row)">{{ scope.row.status == 1 ? $t("message.disable") : $t("message.enable") }}</el-button>

            <el-button
              style="border: none;color: #0138b1;"
              size="mini"
              @click="showStudentEditDialog(scope.$index, scope.row)" >| {{$t("message.edit")}} |</el-button>

            <el-button
              style="border: none;color: #0138b1;"
              size="mini"

              @click="deleteStudent(scope.$index, scope.row)">{{$t("message.delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="position: absolute;bottom: 6%;left: 44%">
      <el-pagination
        background
        :page-size="page.pageSize"
        :page-count="page.pageNumber"
        :current-page="page.pageIndex"
        layout="prev, pager, next"
        :total="page.total"
        @current-change="loadStudentRecords">
      </el-pagination>
    </div>

    <!--编辑弹框-->
    <el-dialog
      :title="$t('message.Studentinformationeditor')"
      :visible.sync="studentEditDialogVisible"
      width="20%"
      >
      <div class="projectile" style="padding-left: 10%">
        <ul>
          <li>
            <span>{{$t('message.Account')}}：</span>
            <el-input disabled v-model="editStudent.studentNo" size="small" :placeholder="$t('message.Account')" style="width: 60%"></el-input>
            <el-input disabled v-show="false" v-model="editStudent.id" size="small" style="width: 60%"></el-input>
          </li>
          <li><span>{{$t('message.Name')}}：</span><el-input v-model="editStudent.name" size="small" :placeholder="$t('message.Name')" style="width: 60%"></el-input></li>
          <li><span>{{$t('message.EMail')}}：</span><el-input v-model="editStudent.email" size="small" :placeholder="$t('message.EMail')" style="width: 60%"></el-input></li>
          <li><span>{{$t('message.Phone')}}：</span><el-input v-model="editStudent.cellPhoneNo" size="small" :placeholder="$t('message.Phone')" style="width: 60%"></el-input></li>
          <li><span>{{$t('message.class')}}：</span><el-input v-model="editStudent.className" size="small" :placeholder="$t('message.class')" style="width: 60%"></el-input></li>
          <li><span>{{$t('message.major')}}：</span>
            <template>
              <el-select v-model="editStudent.major" :placeholder="$t('message.pleaseselect')">
                <el-option
                  v-for="item in studentMajors"
                  :key="item.dictionaryCode"
                  :label="item.dictionaryName"
                  :value="item.dictionaryCode">
                </el-option>
              </el-select>
            </template>
          </li>
          <li>
            <span style="padding-right: 10%">{{$t('message.Status')}}：</span>
            <el-radio name="studentStatus" v-model="editStudent.status" label="1">{{$t('message.enable')}}</el-radio>
            <el-radio name="studentStatus" v-model="editStudent.status" label="0">{{$t('message.disable')}}</el-radio>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="hideStudentEditDialog">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="editStudentSubmit">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog>

    <!-- 数据导入弹框 -->
    <el-dialog
      :title="$t('message.importStudentData')"
      :visible.sync="studentImportDialogVisible"
      width="30%"
      center>

      <el-upload
        class="student-data-upload"
        name="file"
        with-credentials
        :file-list="studentDataFileList"
        :action="getUploadFilePath()"
        :on-change="handleUploadFileChange"
        :before-upload="beforeUpload"
        :on-success="handleUploadFileSuccess">
        <el-button size="small" type="primary">{{$t('message.upload')}}</el-button>
      </el-upload>

      <el-checkbox v-model="overrideExistsStudentNoData">{{$t('message.overwriteExistsData')}}</el-checkbox>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="confirmImport">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        studentMajors: [],
        studentNameSearch: '',
        radio: '0',
        studentRecords: [],
        multipleSelection: [],
        page: {
          total: 0,
          pageIndex: 1,
          pageSize: 5,
          pageNumber: 5
        },
        editStudent: {

        },
        studentEditDialogVisible: false,
        studentImportDialogVisible: false,
        studentDataFilePath: "",
        studentDataFileList: [],
        overrideExistsStudentNoData: false
      }
    },

    mounted() {
      this.loadStudentRecords(this.pageIndex);
    },

    methods: {
      formatDateTime: util.formatDateTime,

      loadStudentRecords: function(pageIndex) {
        var param = {
          params: {
            pageIndex: (typeof pageIndex == "undefined") ? this.page.pageIndex : pageIndex,
            pageSize: this.page.pageSize
          }
        };
        if (this.studentNameSearch && this.studentNameSearch.trim()) {
          param.params.name = this.studentNameSearch;
        }
        this.$http.get(`${process.env.NODE_ENV}/student/pageList`, param)
          .then((res) => {
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              return;
            }
            this.studentRecords = res.data.entity.list;
            this.page.total = res.data.entity.total;
            this.page.pageIndex = res.data.entity.pageIndex;
            this.page.pageSize = res.data.entity.pageSize;

            return true;
          }).catch((err) => {
            this.$message.error(err);
            return false;
        });
      },
      getImportTpl() {
        window.open(`../../../static/tpl/student_import_`+localStorage.lang+'.xlsx');
      },
      handleSelectionChange(selection) {
        this.multipleSelection = selection;
      },

      showStudentEditDialog: function(index, row) {
        this.$http.get(`${process.env.NODE_ENV}/dictionary/list`, {params: {dictionaryCode: "student.major", status: 1}})
          .then((res) => {
            if (res.data.code == 200) {
              this.studentMajors = res.data.entity;

              this.studentEditDialogVisible = true;
              this.editStudent = {
                id: row.id,
                studentNo: row.studentNo,
                name: row.name,
                email: row.email,
                cellPhoneNo: row.cellPhoneNo,
                className: row.className,
                major: row.major,
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

      hideStudentEditDialog: function() {
        this.studentEditDialogVisible = false;
      },

      editStudentSubmit: function() {
        console.log("update", this.editStudent);

        this.$http.post(`${process.env.NODE_ENV}/student/modify`, this.editStudent)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.info(this.$t('message.Modifystudentsuccess'));/* "Modify student success"*/
              this.hideStudentEditDialog();
              this.loadStudentRecords(this.pageIndex);
            } else {
              this.$message.error(this.$t('message.Modifystudentfail') + res.data.message);/* "Modify student fail: "*/
            }
          }).catch((err) => {
            this.$message.error(err);
        });
      },

      editStudentStatus(index, row) {
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

      deleteStudent(index, row) {
        this.doDeleteStudent([row.id]);
      },

      batchDelete: function () {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t('message.pleaseSelectLeastOneRowOfData'));/* "pleaseSelectLeastOneRowOfData"*/
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.doDeleteStudent(ids);
      },

      resetPassword: function() {
        if (this.multipleSelection.length == 0) {
          this.$message.error(this.$t('message.pleaseSelectLeastOneRowOfData'));
          return;
        }

        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.$http.post(`${process.env.NODE_ENV}/user/resetPassword/edit`, {userIds: ids})
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.info(this.$t('message.Resetuserspasswordsuccess'))
            } else {
              this.$message.error(this.$t('message.Resetuserspasswordfail') + res.data.message);
            }
          }).catch((err) => {
           this.$message.error(err);
        });
      },

      goImportStudent: function() {
        this.studentImportDialogVisible =  true;
      },

      doDeleteStudent: function (ids) {
        let me = this;
        this._del("/student", ids, (data) => {
          me.loadStudentRecords(me.page.pageIndex);
        });
        // this.$http.post(`${process.env.NODE_ENV}/student/deletes`, ids)
        //   .then((res) => {
        //     if (res.data.code == 200) {
        //       this.$message.info("Delete success");
        //       this.loadStudentRecords(this.page.pageIndex);
        //     }
        //   }).catch((err) => {
        //   this.$message.error(err);
        // });
      },

      getUploadFilePath: function () {
        return util.fileUploadPath();
      },


      handleUploadFileSuccess: function (res, file, fileList) {
        console.log(res)
        if (res.code == 200) {
          this.studentDataFilePath = res.entity.fileTmpName;
        } else {
          this.studentDataFileList = [];
          this.$message.error(res.message);
        }
      },
      handleUploadFileChange: function (file, fileList) {
        if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
          this.$message.error(this.$t("message.onlySupportFileType") + "xls, xlsx");
          if (fileList.length > 1) {
            this.studentDataFileList = fileList.slice(0, 1);
          }
          return;
        }
        this.studentDataFileList = fileList.slice(-1);
      },

      beforeUpload: function(file) {
        if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
          return false;
        }
        return true;
      },

      cancelImport: function () {
        this.studentImportDialogVisible = false;
        this.studentDataFileList = [];
      },
      confirmImport: function () {
        if (this.studentDataFilePath == "") {
          this.$message.error(this.$t('message.Pleaseuploadfile'));
          return;
        }

        let param = {
          fileName: this.studentDataFilePath,
          override: this.overrideExistsStudentNoData ? true : null
        };

        this.$http.post(`${process.env.NODE_ENV}/student/import/edit`, param)
          .then((res) => {
            if (res.data.code == 200) {
              this.studentImportDialogVisible = false;
              this.studentDataFileList = [];

              this.$message.info(this.$t('message.Importstudentdatasuccess'));/* Import student data success*/

              this.loadStudentRecords(1);
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
           this.$message.error(err);
        });
      },

      getImportModelFile: function () {

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
  .projectile ul li {
    margin-top: 2%;
  }
</style>
