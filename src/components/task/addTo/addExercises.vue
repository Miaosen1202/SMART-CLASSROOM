<template>
  <div class="all">
    <el-scrollbar style="height: 100%">
      <!--<p>增加练习 第一个页面 </p>
      <p>There is no exercises yet.</p>-->
      <div class="order">
        <el-button size="medium" style="border: 1px solid #f17e26;color: #f17e26" v-on:click="createPanelToggle()">
          <!--v-on:click="createPanelToggle()"-->
          <p>
            <img src="../../../../static/images/Creat.png" alt="">
            {{$t('message.CreateAnExercise')}}
          </p>
        </el-button>
        <el-button style="background-color: #26be96;color: #fff;border: 1px solid #26be96"
                   v-bind:disabled="existExercisesList.length<1" @click="showExercisesDialog">
          <img src="../../../../static/images/Order.png" alt="">
          <p>{{$t('message.Order')}}</p>
        </el-button>
      </div>
      <!--新增exercises开始-->
      <div class="exercises" v-show="showAdd">
        <h5>{{$t('message.Exercises')}}</h5>

        <el-radio-group v-model="questionType">
          <el-radio :label="1">{{$t('message.Singlechoice')}}</el-radio>
          <el-radio :label="2">{{$t('message.Multiplechoice')}}</el-radio>
          <!--<el-radio :label="3">Other</el-radio>-->
        </el-radio-group>
        <el-input
          type="textarea"
          maxlength="500"
          @input="descInput"
          autosize
          :placeholder="$t('message.Typequestion')"
          v-model="questionTitle" style="width: 70%;display: block;">
        </el-input><!--Type question here...-->
        <span style="float: right;padding-right: 27%;font-size: 12px;color: #999999;margin-bottom: 2%">{{remnant}}{{$t('message.byte')}}</span>
        <!--选择题-->
        <div v-for="(option,index) in options" :key="index" v-if="questionType == 1">
          <el-radio v-model="selectItem" :label="option.answerCode" style="display: inline-block;width: 90%;">
            <span class="opt-answer-code">{{option.answerCode}}</span>
            <el-input type="textarea"
                      maxlength="100"
                      v-model="option.answerContent"
                      :placeholder="$t('message.pleaseenter')"
                      style="width: 60%;display: inline-block">
            </el-input>
            <el-button type="text" icon="el-icon-delete" @click="deleteSelectItems(index)"></el-button>
            <span style="float: right;padding-right: 32%;font-size: 12px;color: #999999;margin-bottom: 1%">
              {{optionContentMaxLength - option.answerContent.length}}{{$t('message.byte')}}
            </span>
          </el-radio>
        </div>
        <div v-for="(option,index) in options" :key="index" v-if="questionType == 2">
          <el-checkbox v-model="option.isCorrect" style="display: inline-block;width: 90%;">{{option.answerCode}}
            <el-input
              type="textarea"
              maxlength="100"
              v-model="option.answerContent"
              :placeholder="$t('message.pleaseenter')"
              style="width: 60%;display: inline-block"></el-input>
            <el-button type="text" icon="el-icon-delete" @click="deleteSelectItems(index)"></el-button>
            <span style="float: right;padding-right: 34%;font-size: 12px;color: #999999;margin-bottom: 1%">
                {{optionContentMaxLength - option.answerContent.length}}{{$t('message.byte')}}
            </span>
          </el-checkbox>
        </div>


        <div class="option">
          <el-button size="mini" style="display: inline-block;background-color: #f17e26;color: #fff"
                     v-bind:disabled="optionsShow" @click="addSelectItems">+{{$t('message.Option')}}
          </el-button>
          <div style="display: inline-block;width: 50%">
            <p style="color: #ff6699;padding-left: 2%">
              <i class="el-icon-warning"></i>
              {{$t('message.Pleasetick')}}</p>
          </div>

        </div>
        <div style="margin-top: 2%">
          <i style="color: #5daf34;font-weight: 700;">{{$t('message.Explanation')}}</i>
        </div>
        <el-input
          type="textarea"
          maxlength="500"
          @input="descInput"
          autosize
          :placeholder="$t('message.Explanations')"
          v-model="analysis" style="width: 70%;display: block;margin-top: 2%">
        </el-input>
        <span style="float: right;padding-right: 27%;font-size: 12px;color: #999999;margin-bottom: 1%">{{remnants}}{{$t('message.byte')}}</span>
        <span slot="footer" class="dialog-footer" style="margin-left: 40%">
        <el-button size="medium" type="primary" style="margin-top: 2%;background-color: #0e38b1;color: #fff"
                   v-on:click="sure()">{{$t('message.save')}}</el-button>
        <el-button size="medium" style="color: #333333" @click="cancelAddOrUpdate">{{$t('message.cancel')}}</el-button>
      </span>
      </div>
      <!--新增exercises结束-->

      <!--修改exercises开始-->
      <div class="exercises" v-show="isShow">
        <h5>{{$t('message.Exercises')}} {{exerciseEntity.sort}}</h5>

        <el-radio-group v-model="exerciseEntity.questionType">
          <el-radio disabled :label="'1'">{{$t('message.Singlechoice')}}</el-radio>
          <el-radio disabled :label="'2'">{{$t('message.Multiplechoice')}}</el-radio>
          <!--<el-radio :label="'3'">Other</el-radio>-->
        </el-radio-group>
        <el-input
          type="textarea"
          maxlength="500"
          @input="descInput"
          autosize
          :placeholder="$t('message.Typequestion')"
          v-model="exerciseEntity.questionTitle" style="width: 70%;display: block;">
        </el-input>
        <span style="float: right;padding-right: 27%;font-size: 12px;color: #999999;margin-bottom: 1%">{{number}}{{$t('message.byte')}}</span>
        <!--选择题-->
        <div v-for="(option,index) in exerciseEntity.options" :key="index" v-if="exerciseEntity.questionType == 1">
          <el-radio v-model="selectEditItem" :label="option.answerCode" style="display: inline-block;width: 90%;">
            <span class="opt-answer-code">{{option.answerCode}}</span>
            <el-input type="textarea"
                      maxlength="100"
                      v-model="option.answerContent"
                      :placeholder="$t('message.pleaseenter')"
                      style="width: 60%;display: inline-block">

            </el-input>
            <!--<el-input
              type="textarea"
              autosize
              :placeholder="$t('message.Explanations')"
              v-model="exerciseEntity.analysis" style="width: 70%;display: block;margin-top: 2%">
            </el-input>-->
            <el-button type="text" icon="el-icon-delete" @click="deleteSelectItems(index)"></el-button>
            <span style="float: right;padding-right: 32%;font-size: 12px;color: #999999;margin-bottom: 1%">
                {{optionContentMaxLength - option.answerContent.length}}{{$t('message.byte')}}
            </span>
          </el-radio>
        </div>
        <div v-for="(option,index) in exerciseEntity.options" :key="index" v-if="exerciseEntity.questionType == 2"
             >
          <el-checkbox v-model="option.isCorrect" style="display: inline-block;width: 90%;">{{option.answerCode}}
            <el-input type="textarea"
                      maxlength="100"
                      v-model="option.answerContent"
                      :placeholder="$t('message.pleaseenter')"
                      style="width: 60%;display: inline-block">
            </el-input>
            <el-button type="text" icon="el-icon-delete" @click="deleteSelectItems(index)"></el-button>
            <span style="float: right;padding-right: 35%;font-size: 12px;color: #999999;margin-bottom: 1%">
                {{optionContentMaxLength - option.answerContent.length}}{{$t('message.byte')}}
            </span>
          </el-checkbox>
        </div>


        <div class="option">
          <el-button size="mini" style="display: inline-block;background-color: #f17e26;color: #fff"
                     v-bind:disabled="optionsShow" @click="addSelectItems">+{{$t('message.Option')}}
          </el-button>
          <div style="display: inline-block;width: 50%">
            <p style="color: #ff6699;padding-left: 2%">
              <i class="el-icon-warning"></i>
              {{$t('message.Pleasetick')}}</p>
          </div><!--Please set the answer for your question.-->

        </div>
        <div style="margin-top: 2%">
          <i style="color: #5daf34;font-weight: 700;">{{$t('message.Explanation')}}</i>
        </div>
        <el-input
          type="textarea"
          maxlength="500"
          @input="descInput"
          autosize
          :placeholder="$t('message.Explanations')"
          v-model="exerciseEntity.analysis" style="width: 70%;display: block;margin-top: 2%">
        </el-input>
        <span style="float: right;padding-right: 27%;font-size: 12px;color: #999999;margin-bottom: 1%">
                {{modificationAnalysis}}{{$t('message.byte')}}
            </span>
        <span slot="footer" class="dialog-footer" style="margin-left: 40%">
        <el-button size="medium" type="primary" style="margin-top: 2%;background-color: #0e38b1;color: #fff"
                   v-on:click="edit()">{{$t('message.save')}}</el-button>
        <el-button size="medium" style="color: #333333"
                   @click="xgcancelAddOrUpdate">{{$t('message.cancel')}}</el-button>
      </span>
      </div>
      <!--修改exercises结束-->

      <div class="have" v-for="(exercises,index) in existExercisesList" :key="index">
        <h5>{{$t('message.Exercises')}} {{index+1}}</h5>
        <span v-show="exercises.questionType == '1'">{{$t('message.Singlechoice')}}</span>
        <span v-show="exercises.questionType == '2'">{{$t('message.Multiplechoice')}}</span>
        <el-button v-on:click="deleteExercises(exercises.id)" type="text" icon="el-icon-delete">
        </el-button>
        <el-button type="text" icon="el-icon-edit" class="scrollTop" @click="getExecisesDetail(exercises.id)">
        </el-button>
        <div style="word-wrap: break-word; word-break: normal;width: 90%">{{exercises.questionTitle}}</div>
        <ul v-for="(option,index) in exercises.options">
          <li style="color: #000" :key="index"><P style="padding-right: 2%">{{option.answerCode}}</P>
            <p style="word-wrap: break-word; word-break: normal;width: 90%">{{option.answerContent}}</p>
          </li>
        </ul>
        <p style="font-weight: 700;color: rgb(0, 204, 0);font-style: italic;display: inline-block">
          {{$t('message.answer')}} :</p>
        <div v-for="(option,index) in exercises.options">
          <div v-if="option.isCorrect == 1">{{option.answerCode}}</div>
        </div>

        <p style="font-weight: 700;color: rgb(0, 204, 0);font-style: italic">{{$t('message.Explanation')}} :</p>
        <p style="word-wrap: break-word; word-break: normal;width: 90%;display: block;padding-top: 0px">
          {{exercises.analysis}}</p>
      </div>
      <div class="orderexercise">
        <el-dialog
          :title="$t('message.Order')"
          @close="cancel"
          :visible.sync="showExercisesDialogVisible"

          width="100%">
          <!--<div v-for="existExercises in existExercisesList">-->
          <!--<el-radio v-model="radio" :label="existExercises.id">{{existExercises.questionTitle}}</el-radio>-->
          <!--</div>-->
          <el-row style="padding-left: 3%">
            <el-button type="text" size="mini" v-bind:disabled="moveTopBtn" @click="moveTopBtnHandler">
              {{$t('message.Top')}}
            </el-button>
            <el-button type="text" size="mini" v-bind:disabled="moveBoBtn" @click="moveBoBtnHandler">
              {{$t('message.Bottom')}}
            </el-button>
            <el-button type="text" size="mini" v-bind:disabled="moveUpBtn" @click="moveUpBtnHandler">
              {{$t('message.Up')}}
            </el-button>
            <el-button type="text" size="mini" v-bind:disabled="moveDownBtn" @click="moveDownBtnHandler">
              {{$t('message.Down')}}
            </el-button>
          </el-row>

          <template>
            <el-table
              ref="singleTable"
              :data="existExercisesList"
              highlight-current-row
              :show-header="false"
              @row-click="handleCurrentChange"
              style="width: 100%;padding-left: 3%">
              <el-table-column
                type="index"
                width="100"
                :index="indexMethod">
              </el-table-column>

              <el-table-column
                property="questionTitle"
                min-width="70%">
              </el-table-column>
            </el-table>
          </template>
          <span slot="footer" class="dialog-footer">
          <el-button size="medium" type="primary" @click="resetSort">{{$t('message.OK')}}</el-button>
          <el-button size="medium" @click="showExercisesDialogVisible = false">{{$t('message.cancel')}}</el-button>
        </span>
        </el-dialog>
      </div>

    </el-scrollbar>
  </div>
</template>

<script>
  import eventBus from '../../../eventBus'

  export default {
    data() {
      return {
        optionContentMaxLength: 100,
        modificationAnalysis:500,
        number: 500,
        remnant: 500,
        remnants: 500,
        selectItem: "A",
        showExercisesDialogVisible: false,
        analysis: '',
        questionTitle: '',
        input: '',
        input2: '',
        input3: '',
        radio: '1',
        questionType: 1,
        lessonId: this.$route.query.lessonId,
        existExercisesList: [],
        existExercisesListOrigin: [],
        exercisesList: [],
        codeObjList: [
          {id: 0, name: "A"},
          {id: 1, name: "B"},
          {id: 2, name: "C"},
          {id: 3, name: "D"},
          {id: 4, name: "E"},
          {id: 5, name: "F"},
          {id: 6, name: "G"},
          {id: 7, name: "H"},
          {id: 8, name: "I"},
          {id: 9, name: "J"},
        ],
        options: [
          {
            answerContent: "",
            isCorrect: true,
            answerCode: "A"
          }
        ],
        optionsShow: false,
        showAdd: false,
        isShow: false,
        exerciseEntity: {},
        selectEditItem: "",
        moveTopBtn: true,
        moveUpBtn: true,
        moveBoBtn: true,
        moveDownBtn: true,
        currentRow: null
      };
    },
    mounted() {
      this.getAssignmentListByLessonId();
    },
    methods: {
     /* multiChoiceOptionInput() {
        var txtVal = this.options[0].answerContent.length;
        this.optionContentMaxLength = 100 - txtVal;
      },*/
      descInput() {
        var txtVal = this.questionTitle.length;
        this.remnant = 500 - txtVal;
        var txt = this.analysis.length;
        this.remnants = 500 - txt;

        var mondeys = this.exerciseEntity.questionTitle ? this.exerciseEntity.questionTitle.length : 0;
        this.number = 500 - mondeys;
        // modificationAnalysis
        var mondey = this.exerciseEntity.analysis ? this.exerciseEntity.analysis.length : 0;
        this.modificationAnalysis = 500 - mondey;
      },
      indexMethod(index) {
        return "Exercises " + (index + 1);
      },

      handleCurrentChange(row) {
        this.currentRow = row;
        if (this.existExercisesList.length == 1) {
          this.moveTopBtn = true;
          this.moveUpBtn = true;
          this.moveBoBtn = true;
          this.moveDownBtn = true;
        } else if (this.existExercisesList[0].sort == this.currentRow.sort) {
          this.moveTopBtn = true;
          this.moveUpBtn = true;
          this.moveBoBtn = false;
          this.moveDownBtn = false;
        } else if (this.existExercisesList[this.existExercisesList.length - 1].sort == this.currentRow.sort) {
          this.moveTopBtn = false;
          this.moveUpBtn = false;
          this.moveBoBtn = true;
          this.moveDownBtn = true;
        } else {
          this.moveTopBtn = false;
          this.moveUpBtn = false;
          this.moveBoBtn = false;
          this.moveDownBtn = false;
        }
      },
      moveTopBtnHandler() {
        this.existExercisesList.splice(this.getIndex(), 1);
        this.existExercisesList.splice(0, 0, this.currentRow);
        this.handleCurrentChange(this.currentRow)
      },
      moveUpBtnHandler() {
        let index = this.getIndex();
        this.swapArray(this.existExercisesList, index, index - 1)
        this.handleCurrentChange(this.currentRow)
      },
      moveBoBtnHandler() {
        this.existExercisesList.splice(this.getIndex(), 1);
        this.existExercisesList.splice(this.existExercisesList.length, 0, this.currentRow);
        this.handleCurrentChange(this.currentRow)
      },
      moveDownBtnHandler() {
        let index = this.getIndex();
        this.swapArray(this.existExercisesList, index, index + 1)
        this.handleCurrentChange(this.currentRow)
      },
      swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      },
      getIndex() {
        let currentRowIndex = null;
        for (let i = 0; i < this.existExercisesList.length; i++) {
          if (this.existExercisesList[i].sort == this.currentRow.sort) {
            currentRowIndex = i;
            break
          }
        }
        return currentRowIndex;
      },
      cancel() {
        this.$refs.singleTable.setCurrentRow(null)
        this.existExercisesList = this.existExercisesListOrigin.slice(0);
      },
      resetSort() {
        let params = {
          ids: []
        };
        for (let i = 0; i < this.existExercisesList.length; i++) {
          params.ids.push(this.existExercisesList[i].id)
        }
        this.$http.post(`${process.env.NODE_ENV}/choiceQuestion/resetSort/edit`, params.ids)
          .then((res) => {
            if (res.data.code == 200) {
              this.getAssignmentListByLessonId();
              this.showExercisesDialogVisible = false;
            }
          }).catch((err) => {
          console.log(err);
        });
      },
      addSelectItems() {
        if (this.showAdd == true) {
          let answerCode = this.getCodeNameById(this.options.length);
          this.options.push({
            answerContent: "",
            isCorrect: false,
            answerCode: answerCode
          })
        } else {
          let answerCode = this.getCodeNameById(this.exerciseEntity.options.length);
          this.exerciseEntity.options.push({
            answerContent: "",
            isCorrect: false,
            answerCode: answerCode
          })
        }
        if (this.options.length >= this.codeObjList.length) {
          this.optionsShow = true;//控制按钮可用状态
        }
      },
      deleteSelectItems(ind) {
        this.optionsShow = false;//控制按钮可用状态
        if (this.showAdd == true) {
          this.options.splice(ind, 1);
          // console.log(this.options);
          this.options.forEach((e, i) => {
            e.answerCode = this.getCodeNameById(i);
          })
        } else {
          this.exerciseEntity.options.splice(ind, 1);
          // console.log(this.exerciseEntity.options);
          this.exerciseEntity.options.forEach((e, i) => {
            e.answerCode = this.getCodeNameById(i);
          })
        }

      },
      getCodeNameById(id) {
        for (let i = 0; i < this.codeObjList.length; i++) {
          if (id == this.codeObjList[i].id) {
            return this.codeObjList[i].name;
            break;
          }
        }
      },
      showExercisesDialog() {
        this.showExercisesDialogVisible = true;
      },
      sure: function () {
        let queryOptions = JSON.parse(JSON.stringify(this.options));
        if (this.questionType == 1) { // 单选
          queryOptions.forEach((e) => {
            e.isCorrect = this.selectItem == e.answerCode ? 1 : 0;
          });
        } else if (this.questionType == 2) {  // 多选
          queryOptions.forEach((e) => {
            e.isCorrect = e.isCorrect ? 1 : 0;
          });
        }

        let exercises = {
          lessonId: this.lessonId,
          questionTitle: this.questionTitle,
          questionType: this.questionType,
          analysis: this.analysis,
          options: queryOptions,
        };

        if (typeof this.questionTitle !== "string" || this.questionTitle.trim().length === 0) {
          this.$message.error(this.$t('message.Thetitlemustbenotempty'));
          /* "The title must be not empty"*/
          return;
        }
        if (queryOptions.length < 2 || queryOptions.length > 10) {
          this.$message.error(this.$t('message.Theoptionsmustbegreater'));
          /*  The options must be greater than 1 and less than 11*/
          return;
        }
        /*if (typeof this.options.answerContent !== "" || this.options.answerContent.trim().length === 0) {
          this.$message.error(this.$t('message.Thetitlemustbenotempty'));/!* "The title must be not empty"*!/
          return;
        }*/
        let me = this;
        this._add("/choiceQuestion", exercises, data => {
          eventBus.$emit("getExercisesNumber", "");
          me.questionType = 1;
          me.questionTitle = "";
          me.analysis = "";
          me.options = [
            {
              answerContent: "",
              isCorrect: true,
              answerCode: "A"
            }
          ];
          me.optionsShow = false;
          me.getAssignmentListByLessonId();
        });
      },

      //选择题列表
      getAssignmentListByLessonId() {
        this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/list?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.existExercisesList = res.data.entity;
              this.existExercisesListOrigin = res.data.entity.slice(0);
              eventBus.$emit("getExercisesNumber", "");
            }
          }).catch((err) => {
          console.log(err);
        });
      },
      /*删除选项中的列表*/
      deleteExercises: function (id) {
        let me = this;
        this._del("/choiceQuestion", [id], () => me.getAssignmentListByLessonId())
      },
      /*获取选择题详情*/
      getExecisesDetail(id) {
        this.isShow = true;
        this.showAdd = false;
        this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/get`, {params: {data: id}})
          .then((res) => {
            if (res.data.code == 200) {
              res.data.entity.options.forEach((e) => {
                if (e.isCorrect == 1) {
                  this.selectEditItem = e.answerCode;
                  e.isCorrect = true;
                } else {
                  e.isCorrect = false;
                }

              });

              this.exerciseEntity = res.data.entity;
              this.optionsShow = res.data.entity.options.length >= this.codeObjList.length;
            }
          }).catch((err) => {
          console.log(err);
        });
      },

      /*选择题修改*/
      edit() {
        var queryOptions = JSON.parse(JSON.stringify(this.exerciseEntity.options));
        if (this.exerciseEntity.questionType == 1) {//单选

          queryOptions.forEach((e) => {
            if (this.selectEditItem == e.answerCode) {//若选中,isCorrect设置为1
              e.isCorrect = 1;
            } else {
              e.isCorrect = 0;
            }
          })

        } else if (this.exerciseEntity.questionType == 2) {//多选

          queryOptions.forEach((e) => {
            if (e.isCorrect == true) {
              e.isCorrect = 1;
            } else {
              e.isCorrect = 0;
            }
          })
        }
        var exercises = {
          id: this.exerciseEntity.id,
          lessonId: this.exerciseEntity.lessonId,
          questionTitle: this.exerciseEntity.questionTitle,
          questionType: this.exerciseEntity.questionType,
          analysis: this.exerciseEntity.analysis,
          options: queryOptions
        };
        if (typeof this.exerciseEntity.questionTitle !== "string" || this.exerciseEntity.questionTitle.trim().length === 0) {
          this.$message.error(this.$t('message.Thetitlemustbenotempty'));
          /* "The title must be not empty"*/
          return;
        }
        if (queryOptions.length < 2 || queryOptions.length > 10) {
          this.$message.error(this.$t('message.Theoptionsmustbegreater'));
          /*  The options must be greater than 1 and less than 11*/
          return;
        }
        console.log(exercises);

        this.$http.post(`${process.env.NODE_ENV}/choiceQuestion/modify`, exercises)
          .then((res) => {

            if (res.data.code == 200) {
              this.optionsShow = false;
              this.showAdd = true;
              this.isShow = false;
              this.questionType = 1;
              this.questionTitle = "";
              this.options = [
                {
                  answerContent: "",
                  isCorrect: true,
                  answerCode: "A"
                }
              ];
              this.analysis = "";

              console.log("exercisesId：" + this.exercisesId);
              this.getAssignmentListByLessonId();
            }

          }).catch((err) => {
          console.log(err);
        });

      },
      createPanelToggle: function () {
        /*this.isShow = !this.isShow;*/
        if (this.showAdd || this.isShow) {
          this.showAdd = false;
          this.isShow = false;
        } else {
          this.showAdd = true;
          this.isShow = false;
        }
      },
      cancelAddOrUpdate: function () {
        /*this.showAdd = false;*/
        this.questionTitle = "";
        this.attachments = [];

        this.answerCode = "A";
        this.answerContent = "";
        this.exercisesList = [];
        this.analysis = "";
        /*this.codeObjList= "";*/
        // window.location.reload();
      },
      xgcancelAddOrUpdate: function () {
        /*his.exerciseEntity.questionTitle = "";
        this.exerciseEntity.sort = 1;
        this.exerciseEntity.analysis = "";*/
        this.showAdd = true;
        this.isShow = false;
      }


    }
  }
</script>

<style scoped="">
  .all {
    width: 99%;
  }

  span.opt-answer-code {
    width: 12px;
    display: inline-block;
    text-align: center;
  }

  .exercises {
    border: 1px solid #ccc;
    width: 96%;
    padding: 2%;
    margin-top: 1%;
  }

  .order {
    margin-top: 2%;
  }

  .el-button--small {
    padding: 0.5% 0px;
  }

  .el-checkbox__label {
    width: 60% !important;
  }

  p {
    display: inline-block;
    padding-top: 2%;
    margin: 0px;
  }

  .el-button--warning {
    padding: 1% 2%;
  }

  .el-upload__tip {
    display: inline-block;
    padding-left: 2%;
    color: #999;
  }

  .exercises h5 {
    padding-right: 6%;
    display: inline-block;
    font-weight: 700;
    /*border-bottom: 2px solid #999;*/
  }

  .have {
    border: 1px solid #ccc;
    width: 96%;
    padding-left: 2%;
    margin-top: 2%;
    margin-bottom: 1%;
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

  .el-alert--warning {
    background-color: #fff;
  }

  .el-icon-warning:before {
    color: #888787 !important;
  }

  .option {
    /*width: 86%;*/
    margin-left: 3%;
    margin-top: 1%;
  }

  .el-alert__closebtn el-icon-close {
    display: none;
  }

  .el-checkbox__label {
    width: 100% !important;
  }
</style>
