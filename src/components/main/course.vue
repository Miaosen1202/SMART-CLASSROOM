<template>
  <div class="all">
    <div class="coursetop">
      <!--Lesson : Our Solar System and Life’s Emergence  v-for="lessonId in existCourseList"{{lessonId.courseName}}-->
      <p><!--Emergence-->{{entity.lesson.lessonName}}
        <img src="../../assets/images/u475.png" alt="">
      </p>
      <p>
        <img src="../../assets/images/u434.png" alt="">
        {{entity.course.courseName}}
        <!--Course : Journey of the Universe: A Story for Our Times-->
      </p>

      <el-tooltip class="item" effect="dark" content="Submit the lesson and you can find it in “Manage all lessons”"
                  placement="bottom-end">
        <el-button style="background-color: #0e38b1;border: 1px solid #0e38b1;color: #fff" size="small"  @click="lessonPublish">{{$t('message.Publish')}}</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Delete the lesson and all the data under this lesson."
                  placement="bottom-start">
        <el-button size="small" @click="lessonDelete">{{$t('message.delete')}}</el-button>
      </el-tooltip>
    </div>
    <div class="left">
      <router-view></router-view>
    </div>

    <div class="right">
      <ul>
        <li :class="{active1 : activeFlag == 'teaching'}" @click="showContent('teaching')" style="background-color: #fff4e3;color:#f17e26">
          <p style="display: inline-block;padding-left: 1%;color: #898989;font-weight: 700;width: 76%">{{$t('message.TeachingMaterials')}}</p>
          <p style="display: inline-block;margin-top: 25%"><img src="../../../static/images/Materials.png" alt=""></p>
          <!--<h2 style="display: inline-block;margin-top: 0px;padding-left: 4%">{{materialNumber}}</h2>-->
        </li>
        <li :class="{active2 : activeFlag == 'discussion'}" @click="showContent('discussion')" style="background-color: #d8fff5;color:#26be96">
          <p style="display: inline-block;padding-left: 1%;color: #898989;font-weight: 700;width: 76%">{{$t('message.Discussion')}}</p>
          <p style="display: inline-block;margin-top: 25%"><img src="../../../static/images/Discussion.png" alt=""></p>
          <!--<h2 style="display: inline-block;margin-top: 0px;padding-left: 4%">{{discussNumber}}</h2>-->
        </li>
        <li :class="{active3 : activeFlag == 'exercises'}" @click="showContent('exercises')" style="background-color: #d6e1ff;color:#0138b1">
          <p style="display: inline-block;padding-left: 1%;color: #898989;font-weight: 700;width:76%">{{$t('message.Exercises')}}</p>
          <p style="display: inline-block;margin-top: 25%"><img src="../../../static/images/Exericises.png" alt=""></p>
          <!--<h2 style="display: inline-block;margin-top: 0px;padding-left: 4%">{{exercisesNumber}}</h2>-->
        </li>
        <li :class="{active4 : activeFlag == 'assignment'}" @click="showContent('assignment')" style="background-color: #f2dafc;color:#b10eab">
          <p style="display: inline-block;padding-left: 1%;color: #898989;font-weight: 700;width:76%">{{$t('message.Assignment')}}</p>
          <p style="display: inline-block;margin-top: 25%"><img src="../../../static/images/Assignment.png" alt=""></p>
          <!--<h2 style="display: inline-block;margin-top: 0px;padding-left: 4%">{{assignmentNumber}}</h2>-->

        </li>
      </ul>
    </div>
    <!--Delete the lesson and all the data under this lesson.-->
  </div>

</template>

<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        tabPosition: 'right',
        activeFlag: 'teaching',
        existCourseList: "",
        lessonId: this.$route.query.lessonId,
        materialNumber: 0,
        discussNumber: 0,
        exercisesNumber: 0,
        assignmentNumber: 0,
        entity: {
          lesson: '',
          course: ''
        },//lesson和course
      }
    },
    mounted() {
      this.getDetailByLessonId();
      // this.$router.push({path: "/homePage/course/teachingMaterials", query: {"lessonId": this.lessonId}});
      this.$router.push({path: "/homePage/course/addMaterials", query: {"lessonId": this.lessonId}});
      this.materialNumberLoad();
      // this.discussNumberLoad();
      // this.exercisesNumberLoad();
      // this.assignmentNumberLoad();
    },
    methods: {
      lessonDelete: function () {
        let me = this;
        me._del("/lesson", [me.lessonId], (data) => {
          me.$router.push("/homePage/second");
        });
      },

      assignmentNumberLoad() {
        this.$http.get(`${process.env.NODE_ENV}/lessonAssignment/statistic/query?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.assignmentNumber = res.data.entity;
            }else{
              console.log(res.data.message);
            }
          }).catch((err) => {
          console.log(err);
        });

      },
      exercisesNumberLoad() {
        this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/statistic/query?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.exercisesNumber = res.data.entity;
            }else{
              console.log(res.data.message);
            }
          }).catch((err) => {
          console.log(err);
        });

      },
      discussNumberLoad() {
        this.$http.get(`${process.env.NODE_ENV}/classDiscuss/statistic/query?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.discussNumber = res.data.entity;
            }else{
              console.log(res.data.message);
            }
          }).catch((err) => {
          console.log(err);
        });

      },
      materialNumberLoad() {
        this.$http.get(`${process.env.NODE_ENV}/lessonMaterial/statistic/query?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.materialNumber = res.data.entity;
            }else{
              console.log(res.data.message);
            }
          }).catch((err) => {
          console.log(err);
        });

      },
      lessonPublish() {
        if (this.entity.lesson != '' && this.entity.lesson.id) {
          this.$http.post(`${process.env.NODE_ENV}/lesson/publish/edit`, {"id": this.entity.lesson.id})
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.info("Lesson publish success");
              } else {
                this.$message.error(res.data.message);
              }
            }).catch((err) => {
              this.$message.error(err);
          });
        }
      },

      showContent(s) {
        if (s == "teaching") {
          this.activeFlag = s;
          // this.$router.push({path: "/homePage/course/teachingMaterials", query: {lessonId: this.lessonId}});
          this.$router.push({path: "/homePage/course/addMaterials", query: {"lessonId": this.lessonId}});
        } else if (s == "discussion") {
          this.activeFlag = s;
          // this.$router.push({path: "/homePage/course/disCussion", query: {lessonId: this.lessonId}});
          this.$router.push({path: "/homePage/course/addDiscussion", query: {"lessonId": this.lessonId}});
        } else if (s == "exercises") {
          this.activeFlag = s;
          this.$router.push({path: "/homePage/course/exerCises", query: {lessonId: this.lessonId}});
        } else if (s == "assignment") {
          this.activeFlag = s;
          // this.$router.push({path: "/homePage/course/assigNment", query: {lessonId: this.lessonId}});
          this.$router.push({path: "/homePage/course/addAssignment", query: {"lessonId": this.lessonId}})
        }
      },
      getDetailByLessonId: function () {
        /*console.log("课时id" + this.lessonId);*/
        this.$http.get(`${process.env.NODE_ENV}/lesson/detail/query?lessonId=${this.lessonId}`)
          .then((res) => {
            if (res.data.code == 200) {
              this.entity = res.data.entity;
            }
          }).catch((err) => {
          console.log(err);
        });
        /* this.$http.get(`${process.env.NODE_ENV}/lesson/detail/query?lessonId=57`)
           .then((res) => {
             if(res.data.code == 200){
               this.entity = res.data.entity;
             }
           }).catch((err) => {
           console.log(err);
         });*/
      },
    },
    components: {},
  }
</script>

<style scoped="">
  .all {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 3%;
    background-color: #fff;
  }

  .auto p {
    padding-left: 40%;
  }

  .auto .print {
    padding-left: 44%;
  }

  .auto .el-button {
    margin-left: 46%;
  }

  .left {
    width: 80%;
    height: 80%;
    float: left;
  }

  .right {
    width: 16%;
    height: 80%;
    float: left;
    position: fixed;
    top: 26%;
    right: 0px;
    border-left: 1px solid #ccc;
  }

  .right ul {
    width: 100%;
    height: 100%;
  }

  .right ul li {
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 80%;
    height: 18%;
    /*padding-left: 20px;*/
    margin-left: 20px;
    margin-top: 10px;
    background-color: rgba(242, 242, 242, 1);
    /* box-shadow:10px 10px 5px #888888;*/
  }

  ul li.active1 {
    /* background-color: #1d4c9e;*/
    border-left: 4px solid #f17e26;
  }
  ul li.active2 {
    /* background-color: #1d4c9e;*/
    border-left: 4px solid #26be96;
  }ul li.active3 {
     /* background-color: #1d4c9e;*/
     border-left: 4px solid #0e38b1;
   }ul li.active4 {
      /* background-color: #1d4c9e;*/
      border-left: 4px solid #b10eab;
    }
  .right ul li p:first-child {
    padding-top: 8%;
    text-align: center;

  }

  .right ul li p:last-child {
    /*padding-top: 6%;*/
    text-align: center;
  }

  .coursetop p {
    width: 60%;
  }

  .coursetop {
    /*margin-top: 2%;*/
    border-bottom: 1px solid #ddd;

  }

  .coursetop p:first-child {
    padding-top: 1%;
    display: inline-block;
  }

  .coursetop p:nth-child(2) {
    padding-left: 2%;
    color: #999;
    display: inline-block;
  }

  .el-button {
    float: right;
    margin-right: 3%;
    margin-top: -2%;
  }

  span {
    display: inline-block;
  }

  .anniu {
    height: 18%;
    line-height: 18%;
  }

  .el-tooltip__popper {
    width: 10%;
  }
</style>
