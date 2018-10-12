import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import navBar from '@/components/navBar'
import homePage from '@/components/homePage'
import prepare from '@/components/main/prepare'
import second from '@/components/main/second'
import goTeach from '@/components/goTeach'
import course from '@/components/main/course'
import teachingMaterials from '@/components/task/teachingMaterials'
import disCussion from '@/components/task/disCussion'
import exerCises from '@/components/task/exerCises'
import assigNment from '@/components/task/assigNment'
import addMaterials from '@/components/task/addTo/addMaterials'
import addDiscussion from '@/components/task/addTo/addDiscussion'
import addExercises from '@/components/task/addTo/addExercises'
import addAssignment from '@/components/task/addTo/addAssignment'
import StartTeachingMaterials from '@/components/StartTheClass/StartTeachingMaterials'
import ViewHistory from '@/components/ViewHistory'
import LearningHomework from '@/components/LearningHomework'
/*import studentLeft from '@/components/student/studentLeft'*/
import LearningMaterials from '@/components/student/LearningMaterials'
import LetDiscuss from '@/components/student/LetDiscuss'
import TakeExercises from '@/components/student/TakeExercises'
import MyAssignment from '@/components/student/MyAssignment'
import FinishMaterials from '@/components/student/FinishTo/FinishMaterials'
import FinishDiscuss from '@/components/student/FinishTo/FinishDiscuss'
import FinishExercise from '@/components/student/FinishTo/FinishExercise'
import FinishAssignment from '@/components/student/FinishTo/FinishAssignment'
import admin from '@/components/admin'
import teacherManagement from '@/components/systemManagement/management/teacherManagement'
import studentManagement from '@/components/systemManagement/management/studentManagement'
import resourceManagement from '@/components/systemManagement/management/resourceManagement'
import curriculumRecovery from '@/components/systemManagement/management/curriculumRecovery'
import configurationManagement from '@/components/systemManagement/management/configurationManagement'
import opinionManagement from '@/components/systemManagement/management/opinionManagement'
import personalCenterManagement from '@/components/personalCenterManagement'
import myCourse from '@/components/personalCenter/center/myCourse'
import myOpinion from '@/components/personalCenter/center/myOpinion'
import myResources from '@/components/personalCenter/center/myResources'
import modify from '@/components/personalCenter/center/modify'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/navBar',
      component: navBar
    },
    {
      path: '/homePage',
      component: homePage,
      children: [
        {
          path: 'course',
          component: course,
          children: [
            {
              path: 'teachingMaterials',
              component: teachingMaterials,
            },
            {
              path: 'disCussion',
              component: disCussion,
            }, {
              path: 'exerCises',
              component: exerCises,
            },
            {
              path: 'assigNment',
              component: assigNment,
            },
            {
              path: 'addMaterials',
              component: addMaterials
            },
            {
              path: 'addDiscussion',
              component: addDiscussion
            },
            {
              path: 'addExercises',
              component: addExercises
            },
            {
              path: 'addAssignment',
              component: addAssignment
            },

          ]
        },
        {
          path: 'prepare',
          component: prepare
        },
        {
          path: 'second',
          component: second
        },
        {
          path: 'goTeach',
          component: goTeach,
        },
        {
          path: 'ViewHistory',
          component: ViewHistory,
        },

      ]
    },

    {
      path: '/StartTeachingMaterials',
      component: StartTeachingMaterials,
    },

    {
      path: '/LearningHomework',
      component: LearningHomework,
      children: [

        {
          path: 'LearningMaterials',
          component: LearningMaterials,
        },
        {
          path: 'LetDiscuss',
          component: LetDiscuss,
        },
        {
          path: 'TakeExercises',
          component: TakeExercises,
        },
        {
          path: 'MyAssignment',
          component: MyAssignment,
        },
        {
          path: 'FinishMaterials',
          component: FinishMaterials,
        },
        {
          path: 'FinishDiscuss',
          component: FinishDiscuss,
        },
        {
          path: 'FinishExercise',
          component: FinishExercise,
        },
        {
          path: 'FinishAssignment',
          component: FinishAssignment,
        },
      ]
    },
    {
      path: '/admin',
      component: admin,
      children: [
        {
          path: 'teacherManagement',
          component: teacherManagement,
        },
        {
          path: 'studentManagement',
          component: studentManagement,
        },
        {
          path: 'resourceManagement',
          component: resourceManagement,
        },
        {
          path: 'curriculumRecovery',
          component: curriculumRecovery,
        },
        {
          path: 'configurationManagement',
          component: configurationManagement,
        },
        {
          path: 'opinionManagement',
          component: opinionManagement,
        },
      ]
    },
    {
      path: '/personalCenterManagement',
      component: personalCenterManagement,
      children: [
        {
          path: 'myCourse',
          component: myCourse,
        },
        {
          path: 'myOpinion',
          component: myOpinion,
        },
        {
          path: 'myResources',
          component: myResources,
        },
        {
          path: 'modify',
          component: modify,
        },
      ]
    },
  ]
})
