<template>
  <div id="start">

    <div class="top">
      <div >
        <p  @click="goToFirst" style="display:inline-block;padding-left: 1%;vertical-align:middle;cursor: pointer">
          <img src="../../../static/images/logo.png" alt="">
        </p>
        <div style="margin: 0 auto;color: #2c6cae;cursor: pointer;display: inline-block;padding-left: 34%">
          <!--Class Code :{{lessonCode}}-->
          <el-button type="text" @click="centerDialogVisible = true">{{$t('message.classcode')}} :{{lessonCode}}</el-button>
        </div>
       <!-- <span style="color: blue;margin-left: 8%">{{$t('message.text')}}</span>-->
        <p v-on:click="backlogin" style="float: right;margin-top:1.6%;padding-right: 2%;cursor: pointer;vertical-align:middle">
          <img src="../../../static/images/u118.png" alt="">
        </p>
        <div @click="mycourse" style="float: right;padding-right: 1%;margin-top: 1%;cursor: pointer;">
        <span >
          <img src="../../../static/images/admintx.png" width="34" height="34" alt="">
          {{ getLoginUser().name }}
        </span>
        </div>

        <!--语言包引入-->
        <div class="select" style="float: right;margin-right: 2%;width: 10%;margin-top: 0.5%">
          <el-select v-show="false" v-model="selectValue" @change="langChange" :placeholder="$t('message.pleaseselect')" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

      </div>

      <!--<div v-on:click="goback()" style="display: inline-block">
        <img src="../../assets/images/pclogo.png" alt="" width="100" height="50"
             style="cursor: pointer;vertical-align: initial;">
      </div>-->


      <!--提示弹框-->
      <el-dialog
        :title="$t('message.classcode')"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <h1 style="text-align: center;font-size: 50px">{{lessonCode}}</h1>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false" style="background-color: #0e38b1;color: #fff">
      <!--<img src="../../assets/images/u231.png" alt="">-->
      {{$t('message.close')}}
    </el-button>
    <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
  </span>
      </el-dialog>

      <!--<p v-on:click="backlogin" style="float: right;margin-top:1.6%;padding-right: 2%;cursor: pointer;vertical-align:middle">
        <img src="../../../static/images/u118.png" alt="">
      </p>-->


    </div>
    <!--下课按钮-->
    <!--<div class="right" style="width: 10%;float: right;margin-top: 1%">

     <div class="view" @click="gobackLesson()" >
       <img src="../../assets/images/u2378.png" alt="">
       View my lessons
      &lt;!&ndash; <el-button style="float: right;top: 50%;" type="primary" round @click="gobackLesson()">View my lessons</el-button>&ndash;&gt;
     </div>
      <div class="view" @click="takeAbreak">
        <img src="../../assets/images/u2326.png" alt="">
        End the class
       &lt;!&ndash; <el-button style="float: right;top: 50%;" type="primary" round @click="takeAbreak">End the class</el-button>&ndash;&gt;
      </div>
    </div>-->

    <canvas id="c1" width="1400px" height="500px">
      <span>该浏览器不支持canvas内容</span>
    </canvas>

    <div class="tool">
      <el-button v-on:click="tooll()" style="float: right;border: none;background-color: #0e38b1" circle>
        <img src="../../../static/images/toolkit.png"  alt="">
      </el-button>
      <div class="tool" style="float: right;margin-top: 1%;display: inline-block" v-show="isShow">
        <div class="view" @click="goObjectProjection">
          <el-tooltip class="item" effect="dark" content="Object Projection" placement="bottom">
            <el-button style="float: right;border: none;"  round >
              <img src="../../../static/images/Objectprojection-blue.png" alt="">
            </el-button>
          </el-tooltip>
        </div>
        <!--<div class="view" >-->
          <!--<el-tooltip class="item" effect="dark" content="share my screen" placement="bottom">-->
            <!--<el-button style="float: right;border: none;"  round >-->
              <!--<img src="../../../static/images/sharemyscreen-blue.png" alt="">-->
            <!--</el-button>-->
          <!--</el-tooltip>-->
        <!--</div>-->
        <div class="view" @click="viewPresence" >
          <el-tooltip class="item" effect="dark" content="Attentance" placement="bottom">
            <el-button style="float: right;border: none;"  round >
              <img src="../../../static/images/attentance-blue.png" alt="">
            </el-button>
          </el-tooltip>
        </div>

        <div class="view" @click="draw">
          <el-tooltip class="item" effect="dark" content="Mark pen" placement="bottom">
          <el-button style="float: right;border: none;"  round >
            <img src="../../../static/images/pen-blue.png" alt="">
          </el-button>
          </el-tooltip>
        </div>
        <div class="view" @click="gobackLesson()" >
          <el-tooltip class="item" effect="dark" content="View my lessons" placement="bottom">
            <el-button style="float: right;border: none" round @click="gobackLesson()">
              <img src="../../../static/images/viewmylesson-blue.png" alt="">
            </el-button>
          </el-tooltip>
        </div>
        <div class="view" v-show="!lessonIsEnd" @click="takeAbreak">
          <el-tooltip class="item" effect="dark" content="End the class" placement="bottom">
            <el-button style="float: right;;border: none"  round @click="takeAbreak">
              <img src="../../../static/images/over-red.png"  alt="">
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <div style="position: absolute;top: 10%;left: 10%;width: 60%">
      <div class="main" >
        <el-scrollbar>
          <el-tabs :tab-position="tabPosition" type="card" activeName="materialTab" @tab-click="tabChange" style="color: #0e38b1">

            <!--<el-tab-pane name="materialTab" :label="'Teaching Materials(' + materialNumber + ')'">-->
            <el-tab-pane name="materialTab" :label="$t('message.TeachingMaterials')">
              <p>{{$t('message.lesson')}}： {{ lessonName }}</p>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('message.checkall')}}
              </el-checkbox>
              <el-checkbox-group v-model="checkedMaterialList">
                <div class="list" v-for="material in materialList">
                  <el-checkbox :label="material" :disabled="material.isShare == 1">
                    <!--<a :href="material.materialUrl" :download="material.materialName">{{material.materialName}}</a>-->

                    <span @click="preview(material.localPath)">{{material.materialName}}</span>
                    <a :href="material.materialUrl" :download="material.materialName">
                      <!--<i class="el-icon-download" style="cursor: pointer;"></i>-->
                      <img src="../../../static/images/UPLOAD.png" alt="" style="cursor: pointer;">
                    </a>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
              <el-button style="margin-bottom: 10%;background-color: #0e38b1;color: #fff;margin-top: 1%"  @click="shareMaterial">{{$t('message.SendTo')}}</el-button>
            </el-tab-pane>

            <!--<el-tab-pane name="discussTab" :label="'Discussion(' + discussNumber + ')'" style="margin-bottom: 10%;">-->
            <el-tab-pane name="discussTab" :label="$t('message.Discussion')" style="margin-bottom: 10%;">
              <p>{{$t('message.lesson')}}： {{ lessonName }}</p>
              <div  v-for="(discussion, index) in discussionList" :key="discussion.id">
                <div class="have">
                <h5>{{$t('message.Discussion')}} {{discussion.sort}}</h5>
                <p>{{discussion.discussContent}}</p>
                <ul>
                  <li v-for="atth in discussion.attachments" >
                    <!--<a :href="atth.fileUrl" :download="atth.fileName">{{atth.fileName}}</a>-->

                    <span @click="preview(atth.fileLocalPath)">{{atth.fileName}}</span>
                    <a :href="atth.fileUrl" :download="atth.fileName">
                      <!--<i class="el-icon-download" style="cursor: pointer;"></i>-->
                      <img src="../../../static/images/UPLOAD.png" alt="" style="cursor: pointer;">
                    </a>
                  </li>
                </ul>
                <div class="news" v-on:click="getDiscussAnswer(discussion.id)">
                  <img src="../../assets/images/u2503.png" alt="">
                  <span class="discuss-answer-number"></span>
                </div>
                </div>
                <div>
                  <div class="discussion-answer-items" :data-id="discussion.id" v-show="false"><!--messageDisplay-->
                    <span v-show="discussAnswers.length == 0" style="margin-bottom: 10px; display: inline-block; color: gray;">No answer records</span>
                    <div v-show="discussAnswers.length > 0" class="leftcolor" v-for="discussAnswer in discussAnswers">
                      <span style="color: #999;display: inline-block">{{discussAnswer.studentName}}</span>
                      <span style="float: right;color: #999;padding-right: 2%">{{ formatDateTime(discussAnswer.updateTime) }}</span>
                      <p style="word-break: break-all;">{{discussAnswer.answerContent }}</p>
                      <ul>
                        <li v-for="atth in discussAnswer.attachments" >
                          <!--<a :href="getFileDownloadPath(atth.fileUrl)" :download="atth.fileName">{{ atth.fileName }}</a>-->

                          <span @click="preview(atth.fileLocalPath)">{{atth.fileName}}</span>
                          <a :href="atth.fileUrl" :download="atth.fileName">
                            <!--<i class="el-icon-download" style="cursor: pointer;"></i>-->
                            <img src="../../../static/images/UPLOAD.png" alt="" style="cursor: pointer;">
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!--<el-tab-pane name="exercisesTab" :label="'Exercises(' + execisesNumber + ')'" >-->
            <el-tab-pane name="exercisesTab" :label="$t('message.Exercises')" >
              <p>{{$t('message.lesson')}}： {{ lessonName }}</p>
              <div class="exercise">
                <div class="leftexerc" style="height: 350px">
                  <el-scrollbar style="height: 90%;">
                    <div class="elbtn" style="float: right;padding-right: 2%">
                      <el-button style="background-color: #0e38b1" type="primary" icon="el-icon-arrow-left" circle @click="goBack"></el-button>
                      <h4 style="display: inline-block">{{currentPage}}/{{pages}}</h4>
                      <el-button style="background-color: #0e38b1" type="primary" icon="el-icon-arrow-right" circle @click="toNextPage"></el-button>
                    </div>
                    <div v-for="(exercises,index) in existExercisesList">
                      <h4 style="display:inline-block; border-bottom: 2px solid #999">{{$t('message.Exercises')}} {{exercises.sort}}</h4>
                      <span style="border: 1px solid #ccc;padding: 1px;margin-left: 1%"
                            v-show="exercises.questionType == '1'">{{$t('message.Singlechoice')}}</span>
                      <span style="border: 1px solid #ccc;padding: 1px;margin-left: 1%"
                            v-show="exercises.questionType == '2'">{{$t('message.Multiplechoice')}}</span>
                      <p>{{exercises.questionTitle}}</p>
                      <ul v-for="(option,index) in exercises.options" :key="index">
                        <li><h4 style="display: inline-block">{{option.answerCode}}:</h4>
                          <span>{{option.answerContent}}</span></li>
                      </ul>

                      <div style="cursor: pointer" v-on:click="execisesAnswerShowToggle()">
                        <i class="el-icon-arrow-down"></i>
                        <!--<img src="../../../static/images/UPLOAD.png" alt="" style="cursor: pointer;">-->
                        <div style="color: #5daf34;display: inline-block">{{$t('message.AnswerExplanation')}}</div>
                      </div>
                      <div v-show="execisesAnswerShow">
                        <i style="font-weight: 700;color: #5cb85c;margin-top: 2%">{{$t('message.answer')}} :</i>
                        <div v-for="(option,index) in exercises.options">
                          <h4 v-if="option.isCorrect == 1">{{option.answerCode}}</h4>
                        </div>
                        <i style="font-weight: 700;color: #5cb85c">{{$t('message.Explanation')}} :</i>
                        <p style="word-break: break-all;">{{exercises.analysis}}</p>
                      </div>
                    </div>
                  </el-scrollbar>
                </div>
                <div class="rightexerc">
                  <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
                </div>
                <!--<div class="rightexerc" :style="{width: '300px', height: '300px'}">
                  <div id="bmyChart"></div>
                </div>-->
              </div>
              <div>

              </div>
            </el-tab-pane>
            <!--<el-tab-pane name="assignmentTab" :label="'Assignment(' + assignmentNumber + ')'" style="margin-bottom: 10%;">-->
            <el-tab-pane name="assignmentTab" :label="$t('message.Assignment')" style="margin-bottom: 10%;">
              <div>
                <h5>{{$t('message.lesson')}}： {{ lessonName }}</h5>
                <div class="have" v-for="assignment in assignmentList">
                  <h5>{{$t('message.Assignment')}} {{assignment.sort}}</h5>
                  <p>{{assignment.assignmentName}}</p>
                  <ul>
                    <li v-for="atth in assignment.attachments">
                      <!--<a :href="atth.fileUrl" :download="atth.fileName">{{atth.fileName}}</a>-->

                      <span @click="preview(atth.fileLocalPath)">{{atth.fileName}}</span>
                      <a :href="atth.fileUrl" :download="atth.fileName">
                        <!--<i class="el-icon-download" style="cursor: pointer;"></i>-->
                        <img src="../../../static/images/UPLOAD.png" alt="" style="cursor: pointer;">
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="goback">
            <span slot="label">
              <img src="../../assets/images/u273.png" alt="">
            </span>
              <!--<p>Lesson： {{ lessonName }}</p>-->
             <!-- <div class="exercise" style="width: 100%;margin-right: 2%">
                &lt;!&ndash;<div class="leftexerc" style="height: 350px">
                  <el-scrollbar style="height: 100%">
                    <h6 style="display:inline-block; border-bottom: 2px solid #999">Exercises1</h6>
                    <div style="padding-left:2%; border-bottom: 1px solid #ccc">
                      <img src="../../assets/images/u558.png" alt="">
                      <p style="display:inline-block">Which of the planets of the solar</p>
                    </div>
                  </el-scrollbar>
                </div>&ndash;&gt;

                &lt;!&ndash;<div class="rightexerc" :style="{width: '300px', height: '300px'}">
                  <div id="bmyChart"></div>
                </div>&ndash;&gt;
                &lt;!&ndash;<div>
                  <p style="display: inline-block;padding-left: 2%">Statistics Responses </p>
                  <h3 style="color: #880000;display: inline-block">14</h3>/<span>16</span>
                  &lt;!&ndash;<span class="el-icon-arrow-left"></span>&ndash;&gt;
                  <el-button style="margin-left: 8%" type="primary" icon="el-icon-caret-left" circle></el-button>
                  <el-button type="primary" icon="el-icon-caret-right" circle></el-button>
                </div>&ndash;&gt;
                <div style="float: left;width: 38%;height: 300px;margin: 1% 0%">
                  &lt;!&ndash;<el-scrollbar style="height: 100%">
                    <div style="border: 1px solid #ccc;border-radius: 4px;margin: 1% 4% 0px 2%;">
                      <p style="display: inline-block">Alexander</p><span>[201102099011]</span>
                      <span style="display: inline-block;float: right">12:00:36  02/01/2017</span>
                      <p>
                        <img src="../../assets/images/u558.png" alt="">
                        than the famous Sirius, the</p>
                    </div>
                    <div style="border: 1px solid #ccc;border-radius: 4px;margin: 1% 4% 0px 2%">
                      <p style="display: inline-block">Alexander</p><span>[201102099011]</span>
                      <span style="display: inline-block;float: right">12:00:36  02/01/2017</span>
                      <p>
                        <img src="../../assets/images/u558.png" alt="">
                        than the famous Sirius, the</p>
                    </div>
                    <div style="border: 1px solid #ccc;border-radius: 4px;margin: 1% 4% 0px 2%">
                      <p style="display: inline-block">Alexander</p><span>[201102099011]</span>
                      <span style="display: inline-block;float: right">12:00:36  02/01/2017</span>
                      <p>
                        <img src="../../assets/images/u558.png" alt="">
                        than the famous Sirius, the</p>
                    </div>
                    <div style="border: 1px solid #ccc;border-radius: 4px;margin: 1% 4% 0px 2%">
                      <p style="display: inline-block">Alexander</p><span>[201102099011]</span>
                      <span style="display: inline-block;float: right">12:00:36  02/01/2017</span>
                      <p>
                        <img src="../../assets/images/u558.png" alt="">
                        than the famous Sirius, the
                      </p>
                    </div>
                    <div style="border: 1px solid #ccc;border-radius: 4px;margin: 1% 4% 0px 2%">
                      <p style="display: inline-block">Alexander</p><span>[201102099011]</span>
                      <span style="display: inline-block;float: right">12:00:36  02/01/2017</span>
                      <p>
                        <img src="../../assets/images/u558.png" alt="">
                        than the famous Sirius, the
                      </p>
                    </div>
                  </el-scrollbar>&ndash;&gt;

                </div>
              </div>-->
            </el-tab-pane>
          </el-tabs>
              
        </el-scrollbar>

        <el-dialog
          class="file-preview"
          title="preview"
          :visible.sync="filePreviewDialogVisible"
          width="100%"
          fullscreen>
          <iframe :src="previewHtml" style="width: 100%; height: 100%">
          </iframe>
        </el-dialog>

        <el-dialog
          class="object-projection"
          title="Object Projection"
          :visible.sync="objectProjection.dialogVisible"
          @close="objectProjectionClose"
          width="100%"
          fullscreen>

          <div>
            <div style="text-align: center;">
              <object classid="clsid:49CBC347-34CD-4687-9D5C-C45E3D3314F0" id="JetionCapturer" width="1000" height="860">
                <span>Your browser dose not support object projection</span>
              </object>
            </div>
          </div>
          <!--<el-button @click="captureProjection" type="primary">Capture Screen</el-button>-->
        </el-dialog>

        <el-dialog
          class="student-presence"
          title="Student presence"
          :visible.sync="studentPresence.dialogVisible"
          @close="studentPresenceDialogClose"
          width="100%"
          fullscreen>
          <div>
            <div>Total attendance {{studentPresence.list.length}}</div>
            <div style="width: 80%; margin: auto">
              <el-tag class="presence-student" type="success" v-for="student in studentPresence.list"
                      :key="index"    style="padding: 20px; margin-right: 40px; margin-bottom: 20px; height: auto; width: 150px; font-size: 18px; color: #666; background-color: #f8f8f8">
                <span style="display: block; overflow: hidden;">
                  {{student.name}}
                </span>
                <span style="display: block; overflow: hidden;">
                  {{student.studentNo}}
                </span>
              </el-tag>
              <!--<el-row :gutter="20">-->
                <!--<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>-->
              <!--</el-row>-->
              <!--<ul>-->
                <!--<li v-for="student in studentPresence.list">{{student.name}}</li>-->
              <!--</ul>-->
            </div>
          </div>

        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../../utils/util'
  import eventBus from '../../eventBus'
  /*require('echarts-wordcloud');*/
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  require('echarts/lib/chart/pie')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  export default {
    data() {
      return {
        lessonIsEnd: false,
        selectValue:'',
        options:[
          {
            value: 'cn',
            label: '中文'
          }, {
            value: 'en',
            label: 'English'
          }
        ],
        tabPosition: 'top',
        centerDialogVisible: false,
        discussAnswers: [],
        checkedMaterialList: [],
        materialNumber: 0,
        materialList: [],
        discussNumber: 0,
        discussList: [],
        execisesNumber: 0,
        execisesList: [],
        assignmentNumber: 0,
        assignmentList: [],
        lessonName: "",
        lessonCode: this.$route.query.lessonCode,
        lessonId: this.$route.query.lessonId,
        checked: true,
        isShow: false,
        execisesAnswerShow: false,
        discussAnswerIsShow: false,
        checkAll: false,
        checked1: '',
        checked2: '',
        isIndeterminate: false,
        handleCheckedCitiesChange: '',
        discussionList: [],
        existExercisesList: [],
        /*options: [
          /!*{
            answerCode:'',
            answerContent:'',
          }*!/
        ],*/
        pageSize:1,//页大小
        currentPage:1,//当前页
        pages: 0,//总页数
        total:0,//总条数
        isSubmit:1,
        msg: '',

        filePreviewDialogVisible: false,
        previewHtml: "",

        objectProjection: {
          dialogVisible: false,
          support: true,
        },
        studentPresence: {
          dialogVisible: false,
          list: []
        },
        myChart: null,
        bmyChart: null
      }
    },
    created() {
      let that = this;
      console.log(localStorage.lang)
      that.selectValue = localStorage.lang == undefined?'en':localStorage.lang
      this.langChange(that.selectValue)
    },
    mounted() {
      this.centerDialogVisibleShow();
      this.loadFinishexercise();
      this.getMaterialList();
      this.getLessonDetail();
     /* this.getAssignmentListByLessonId();*/
    },
    methods: {
      getLoginUser: util.getLoginUser,

      execisesAnswerShowToggle: function() {
        this.execisesAnswerShow = !this.execisesAnswerShow;
      },

      studentPresenceDialogClose: function () {

      },

      viewPresence: function () {
        console.log("view");
        this.studentPresence.dialogVisible = true;

        let that = this;
        that.get("/studentInClass/list", {params: {lessonCode: that.lessonCode}}, function (res) {
          that.studentPresence.list = res.entity;
        });
      },

      goObjectProjection: function () {
        this.objectProjection.dialogVisible = true;

        this.objectProjection.support = !!window.ActiveXObject || "ActiveXObject" in window;

        console.log("support", this.objectProjection.support);
        if (this.objectProjection.support && new ActiveXObject("JCAMERAOCX.JCameraOCXCtrl.1")) {
          JetionCapturer.Run(-1);
        }
        console.log("support", new ActiveXObject("JCAMERAOCX.JCameraOCXCtrl.1"));
      },

      objectProjectionClose: function () {
        if (!this.objectProjection.support) {
          return;
        }

        JetionCapturer.Stop();
      },

      captureProjection: function () {
        if (!this.objectProjection.support) {
          return;
        }
        JetionCapturer.SetJpgQuality(255);
        let captureImg = JetionCapturer.CaptureToBase64();

        if (!captureImg) {
          this.$message.error("Capture projection fail");
          return;
        }
        captureImg = captureImg.replace(/\r|\n/g, "");

        let that = this;
        let atthName = this.lessonName + "-" + new Date().getTime() + "-capture.jpg";
        this.post("/file/dataUpload", {data: captureImg, name: atthName}, function (res) {
          let filePath = res.entity.fileTmpName;

          let atth = {
            lessonCode: that.lessonCode,
            fileName: atthName,
            fileLocalPath: filePath
          };
          let me = this;
          this._add("/teacherClassRecordAttachment", atth, data => {

          });
          // this.post("/teacherClassRecordAttachment/add", atth, function (data) {
          //   this.$message.success("Save capture image success");
          // });
        });
      },
      draw() {
        /*debugger;*/
        var oC = document.getElementById('c1');
        var oCG = oC.getContext('2d');
        oCG.strokeStyle="red";
        oCG.lineWidth=3;
        oC.onmousedown = function(ev) {

          var ev = ev || window.event;
          oCG.moveTo(ev.clientX-oC.offsetLeft,ev.clientY-oC.offsetTop);
          //ev.clientX-oC.offsetLeft,ev.clientY-oC.offsetTop鼠标在当前画布上X,Y坐标
          document.onmousemove = function(ev) {
            var ev = ev || window.event;//获取event对象
            oCG.lineTo(ev.clientX-oC.offsetLeft,ev.clientY-oC.offsetTop);
            oCG.stroke();
          };
          oC.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
      preview: function (filePath) {
        this.filePreviewDialogVisible = true;
        this.previewHtml = "";

        this.$http.get(`${process.env.NODE_ENV}/file/preview`, {params: {filePath: filePath}})
          .then((res) => {
            if (res.data.code == 200) {
              this.previewHtml = res.data.entity;
            } else if (res.data.code == 300) {
              this.$message.error(res.data.message);
              this.$router.push("/");
            } else {
              console.error("preview fail", res.data.message);
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
            console.error("preview fail", err);
            this.$message.error("预览文件失败，请下载至本地查看");
        });
      },

      downFile(filePath){
        /*window.open(`${process.env.NODE_ENV}/http://localhost:8088/${filePath}`);*/
        window.open(`${process.env.NODE_ENV}${filePath}`);
      },

      centerDialogVisibleShow() {
        console.log(this.$route.query.isShow);
        if (this.$route.query.isShow==undefined) {
          this.centerDialogVisible = true
        } else {
          this.lessonIsEnd = this.$route.query.isShow;
        }

        console.log(this.lessonIsEnd)
      },
      drawLine(data) {
        // 基于准备好的dom，初始化echarts实例
        if (this.myChart == null) {
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
        }

        let studentNumber = data.entity.studentNumber;
        let answerRecordVos = data.entity.questionAnswerRecordVos;
        let answerCount = [0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < answerRecordVos.length; i++) {
          let ans = answerRecordVos[i].answerContent;
          if (ans != null) {
            ans = ans.split(",")
            for (let j = 0; j < ans.length; j++) {
              let a = ans[j] || ans[j].toUpperCase();
              switch (a) {
                case "A":
                  answerCount[0]++;
                  break;
                case "B":
                  answerCount[1]++;
                  break;
                case "C":
                  answerCount[2]++;
                  break;
                case "D":
                  answerCount[3]++;
                  break;
                case "E":
                  answerCount[4]++;
                  break;
                case "F":
                  answerCount[5]++;
                  break;
                case "G":
                  answerCount[6]++;
                  break;
                case "H":
                  answerCount[7]++;
                  break;
                default:
                  break;
              }
            }
          }
        }

        this.myChart.setOption({
          title: {text:this.$t('message.Responses') + answerRecordVos.length + '/' + studentNumber },
          tooltip: {},
          xAxis: {
            data: ["A", "B", "C", "D", "E", "F", "G", "H"]
          },
          yAxis: {},
          series: [{
            name: '数量',
            type: 'bar',
            data: answerCount,
            itemStyle: {
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (params) {
                  var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)'];
                  return colorList[params.dataIndex];
                }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }]
        });
        window.onresize = this.myChart.resize
      },
      bdrawLine() {
        if (this.bmyChart == null) {
          this.bmyChart = this.$echarts.init(document.getElementById('bmyChart'))
        }

        // 绘制图表
        this.bmyChart.setOption({
          title: {
            text: 'Responses  14/16',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Right', 'wrong',]
          },
          series: [
            {
              name: '对错占比',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: 14, name: 'Right'},
                {value: 16, name: 'wrong'},

              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
        if (option && typeof option === "object") {
          bmyChart.setOption(option, true);
        }
      },
      getFileDownloadPath: function (fileUrl) {
        console.log(process.env.NODE_ENV + fileUrl)
        return process.env.NODE_ENV + fileUrl;
      },
      formatDateTime: function (d) {
        var date = new Date(d);
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();
        var hour = '' + date.getHours();
        var min = '' + date.getMinutes();
        var sec = '' + date.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        min = min.length < 2 ? ('0' + min) : min;
        sec = sec.length < 2 ? ('0' + sec) : sec;

        return [year, month, day].join('-') + " " + [hour, min, sec].join(":");
      },
      getLessonDetail: function () {
        this.$http.get(`${process.env.NODE_ENV}/lesson/detail/query?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.lessonName = res.data.entity.lesson.lessonName;
            } else {
              alert(res.data.message);
            }
          }).catch((err) => {
          alert(err);
        });
      },
      getMaterialList: function () {
        this.$http.get(`${process.env.NODE_ENV}/lessonMaterial/list`, {params: {status: 1, lessonId: this.lessonId}})
          .then((res) => {
            if (res.data.code == 200) {
              this.materialList = res.data.entity;
              // this.materialNumber = res.data.entity.length;
            } else {
              alert(res.data.message);
            }
          }).catch((err) => {
          alert(err);
        });
      },
      getDiscussionList: function () {
        this.$http.get(`${process.env.NODE_ENV}/classDiscuss/list`, {params: {status: 1, lessonId: this.lessonId}})
          .then((res) => {
            if (res.data.code == 200) {
              this.discussionList = res.data.entity;
              // this.discussNumber = res.data.entity.length;
            } else {
              alert(res.data.message);
            }
          }).catch((err) => {
          alert(err);
        });
      },
      getExercisesList: function () {

      },
      getAssignmentList: function () {
        this.$http.get(`${process.env.NODE_ENV}/lessonAssignment/list`, {params: {status: 1, lessonId: this.lessonId}})
          .then((res) => {
            if (res.data.code == 200) {
              this.assignmentList = res.data.entity;
              // this.assignmentNumber = res.data.entity.length;
            } else {
              alert(res.data.message);
            }
          }).catch((err) => {
          alert(err);
        });
      },
      toggle: function () {
        this.isShow = !this.isShow;
      },
      tooll: function () {
        this.isShow = !this.isShow;
      },
      getDiscussAnswer: function (questionId) {
        if (document.querySelector(".discussion-answer-items[data-id='" + questionId + "']").style.display !== "none") {
          document.querySelector(".discussion-answer-items[data-id='" + questionId + "']").style.display = "none";
          return;
        } else {
          let disAnswerItems = document.querySelectorAll(".discussion-answer-items") || [];
          disAnswerItems.forEach(function (d) {
            d.style.display = "none";
          });
        }

        let param = {
          params: {
            questionId: questionId,
            questionType: 5,
            lessonCode: this.lessonCode
          }
        };
        this.$http.get(`${process.env.NODE_ENV}/questionAnswer/submitHistory/query`, param)
          .then((res) => {
            if (res.data.code == 200) {
              document.querySelector(".discussion-answer-items[data-id='" + questionId + "']").style.display = "";
              this.discussAnswers = res.data.entity.questionAnswerRecordVos;
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        })
      },
      tabChange: function (tab) {
        if (tab.name == "materialTab") {
          this.getMaterialList();
        } else if (tab.name == "discussTab") {
          this.getDiscussionList();
        } else if (tab.name == "exercisesTab") {
          this.getExercisesList();
        } else if (tab.name == "assignmentTab") {
          this.getAssignmentList();
        }else if(tab.name=="goback"){
          this.$router.push({path: "/homePage/goTeach"});
        }
      },
      handleCheckAllChange: function (val) {
        this.checkedMaterialList = val ? this.materialList : [];
        this.isIndeterminate = false;
      },
     /* gobackk: function () {
        this.$router.push({path: "/homePage/goTeach"});
      },*/
      gobackLesson: function () {
        this.$router.push({path: "/personalCenterManagement/myCourse"});
      },
      backlogin:function (){
        let that = this;
        this.post("/logout", null, function () {
          that.$message.success("Logout Success");
          that.$router.push({path: "/"});
        }, undefined, function () {
          that.$message.error("Logout error: " + err);
          that.$router.push({path: "/"});
        });
      },
      //选择题列表
      /*getAssignmentListByLessonId() {
        this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/list?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.existExercisesList = res.data.entity;
              /!* this.options = res.data.options;*!/
            }
          }).catch((err) => {
          console.log(err);
        });
      },*/
      shareMaterial: function () {
        if (this.checkedMaterialList.length == 0) {
          this.$message.error("Please select material to share");
          return;
        }

        let shareMaterialIds = [];
        this.checkedMaterialList.forEach(function (m) {
          console.log(m);
          shareMaterialIds.push(m.id);
        });
        let param = {
          lessonCode: this.lessonCode,
          ids: shareMaterialIds,
          isShare: 1
        };
        this.$http.post(`${process.env.NODE_ENV}/lessonMaterial/shareStatus/edit`, param)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.info("Share material success");
              // this.checkedMaterialList = [];
              this.getMaterialList();
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          this.$message.error(err);
        })
      },

      //选择题分页

      loadFinishexercise:function () {
        var param = {
          lessonId:this.lessonId,
          pageIndex: this.currentPage,
          pageSize: this.pageSize
        };
        this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/pageList`, {params:param})
          .then((res) => {
            if (res.data.code == 200) {
              this.existExercisesList = res.data.entity.list;
              this.total = res.data.entity.total;
              this.currentPage = res.data.entity.pageIndex;
              this.pages = (res.data.entity.total)%(res.data.entity.pageSize) == 0 ?
                (res.data.entity.total)/(res.data.entity.pageSize) :
                (res.data.entity.total)/(res.data.entity.pageSize)+1;
              this.pageSize = res.data.entity.pageSize;

              if (this.existExercisesList.length > 0) {
                let param = {
                  params: {
                    questionId: this.existExercisesList[0].id,
                    questionType: 1,
                    lessonCode: this.lessonCode,
                  }
                };

                this.$http.get(`${process.env.NODE_ENV}/questionAnswer/submitHistory/query`, param)
                  .then((res) => {
                    if (res.data.code === 200) {
                      this.drawLine(res.data);
                    }
                  });
              }
            }
          }).catch((err) => {
          console.log(err);
        });
      },
      //向下翻页
      toNextPage(){
        this.currentPage = this.currentPage+1;
        if(this.currentPage > this.pages){
          this.$message({
            message: 'sorry,this is the last page!',
            type: 'warning'
          });
          this.currentPage--;
        }else if(this.currentPage <= this.pages){
          this.selectedAnswerCode = "";
          this.isSubmit = 1;
          this.loadFinishexercise();
        }

      },
      //向上翻页
      goBack(){
        this.currentPage = this.currentPage-1;
        if(this.currentPage == 0){
          this.$message({
            message: 'sorry,this is the first page!',
            type: 'warning'
          });
          this.currentPage++;
        }else{
          this.selectedAnswerCode = "";
          this.isSubmit = 1;
          this.loadFinishexercise();
        }

      },
      takeAbreak:function () {
        var abreak = {
          lessonCode:this.lessonCode,
        }
        this.$http.post(`${process.env.NODE_ENV}/teaching/end/edit`,abreak)
          .then((res)=>{
            if (res.data.code == 200){
              this.$message({
                message: 'Class is over!',
                type: 'success'
              });
              this.$router.push({path: "/homePage/goTeach"});
            }
          }).catch((err) => {
          console.log(err);
        });
      },

      goToFirst(){
        this.$router.push({path:"/homePage/prepare"});
      },
      // backlogin() {
      //   this.$router.push({path: "/"});
      // },
      mycourse() {
        this.$router.push({path: "/personalCenterManagement/myCourse"});
      },
      //语言切换
      langChange(e){
        // console.log(e)
        localStorage.setItem('lang',e);
        this.$i18n.locale = e;
      }

    }

  }
</script>

<style>
  .student-presence .el-dialog.is-fullscreen {
    width: 80% !important;
  }
  .student-presence .el-dialog.is-fullscreen .el-dialog__body {
    height: 90%;
  }


  .object-projection .el-dialog.is-fullscreen {
    width: 80% !important;
  }
  .object-projection .el-dialog.is-fullscreen .el-dialog__body {
    height: 90%;
  }

  .file-preview .el-dialog.is-fullscreen {
    width: 80% !important;
  }
  .file-preview .el-dialog.is-fullscreen .el-dialog__body {
    height: 90%;
  }
</style>
<style scoped>
  #start {
    width: 100%;
    height: 100%;
  }

  .top {
    height: 8%;
    /* background-color: #0066CC;*/
    background-color: rgba(248, 248, 248, 1);;
  }

  .main {
    width: 100%;
    margin: 2% auto;
    height: 80%;
    overflow: auto;
  }

  .list {
    border: 1px solid #ccc;
    width: 100%;
    border-radius: 2%;
    padding: 1% 2%;
    border-radius: 4px;

  }

  .list:active {
    border: 2px solid rgb(0, 153, 255);
  }

  .have {
    border: 1px solid #ccc;
    width: 84%;
    padding-left: 2%;
    margin-top: 2%;
    position: relative;
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

  .news {
    float: right;
    position: absolute;
    bottom: 4%;
    right: 6%;
    cursor: pointer;
    /*padding-right: 2%;*/
  }

  .discussion-answer-items {
    border: 1px solid #ccc;
    width: 84%;
    padding-left: 6%;
    position: relative;
    border-top: none;
    padding-top: 1%;
  }

  .discussion-answer-items p {
    margin-top: 1%;

  }

  .discussion-answer-items span {
    margin-top: 1%;
  }

  .discussion-answer-items ul li {
    color: #0066CC;
    font-size: 12px;
  }

  .leftcolor {
    border-left: 2px solid #5cb85c;
    padding-left: 2%;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .exercise {
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;
    margin-top: 2%;
    display: inline-block;
    border-radius: 4px;
  }

  .leftexerc {
    display: inline-block;
    /*border: 1px solid #ccc;*/
    width: 50%;
    height: 100%;
    float: left;
    padding-left: 2%;
    overflow: auto;
    padding-right: 2%;
    border-right: 2px solid #ccc;
    margin-top: 2%;
  }

  .rightexerc {
    display: inline-block;
    margin-top: 2%;
    width: 40%;
    height: 60%;
    padding-left: 2%;
    float: left;
  }
.view {
  margin-top: 1%;
  float: right;
  cursor: pointer;
}
  .view:active {
    background-color: #8c8c8c;
    cursor: pointer;
  }
  .tool {
    background-color: #fff;
    box-shadow: 0 0 5px blue;
    border-radius: 30px;
  }
</style>
