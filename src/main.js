// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import echarts from 'echarts'
import md5 from 'js-md5';
/*import locale from 'element-ui/lib/locale/lang/en'*/
import i18n from './i18n/i18n';
import "babel-polyfill"


Vue.prototype.$echarts = echarts;
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false;

var $http = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  withCredentials: true
});

// 为请求增加动态随机数，防止浏览器缓存
$http.interceptors.request.use(function (request) {
  if (request.method.toUpperCase() === "GET") {
    if (request.params) {
      request.params["_str"] = new Date().getTime();
    } else {
      request.params = {
        "_str": new Date().getTime(),
      }
    }
  }

  return request;
});

// 拦截全局响应，处理未登录操作
$http.interceptors.response.use(function (response) {
  if (response.data.code === 300) {
    Vue.prototype.$message.error(response.data.message);
    router.push("/");
  } else {
    // if (response.data.code === 500) {
    //   Vue.prototype.$message.error(response.data.message);
    // }
    return response;
  }
}, function (error) {
  console.error("request error", error)
  Vue.prototype.$message.error("An error occurred in request");
  // 不调用 Promise.reject(error), 使用默认处理：提示一个错误
  // return Promise.reject(error);
  return error;
});

Vue.prototype.$http = $http;

Vue.use(ElementUI);
Vue.prototype.post = function (path, param, successCallback, errorCallback, catchCallback) {
  $http.post(`${process.env.NODE_ENV}` + path, param)
    .then((res) => {
      _mythen(res, successCallback, errorCallback)
    })
    .catch((err) => {
      _mycatch(err, catchCallback)
    });
};
Vue.prototype.get = function (path, param, successCallback, errorCallback, catchCallback) {
  $http.get(`${process.env.NODE_ENV}` + path, param)
    .then((res) => {
      _mythen(res, successCallback, errorCallback)
    })
    .catch((err) => {
      _mycatch(err, catchCallback)
    });
};

function _mycatch(err, catchCallback) {
  if (catchCallback != undefined) {
    catchCallback(err)
  } else {
    console.error(err)
  }
}
function _mythen(res, successCallback, errorCallback) {
  if (res.data.code == 200) {
    console.log("---200----");
    successCallback(res.data)
  } else if (res.data.code == 300) {
    console.log("---300----");
    this.$router.push("/")
  } else {
    console.log("---500----");
    if (errorCallback == undefined) {
      this.$message.error(res.data.message)
    } else {
      errorCallback(res)
    }
  }
}

Vue.prototype._del = function (path, param, successCallback, errorCallback) {
  this.$confirm(this.$t('message.confirmDelete'), this.$t('message.tip'), {
    confirmButtonText: this.$t('message.confirm'),
    cancelButtonText: this.$t('message.cancel'),
    type: 'warning'
  })
  // this.$confirm('确认删除？')
    .then(() => {
      this.post(path + "/deletes", param, (data)=>{
        successCallback(data);
        Vue.prototype.$message.success(this.$t("message.deleteSuccess"));
      }, errorCallback)
    })
    .catch(() => {
    });
};

Vue.prototype._add = function (path, param, successCallback, errorCallback) {
  // let el = event.currentTarget;
  // el.disabled = true;
  this.post(path + "/add", param, (data) => {
    successCallback(data);
    // el.disabled = false;
  }, (res) => {
    if (errorCallback != undefined) {
      errorCallback(res);
    } else {
      this.$message.error(res.data.message)
    }
    // el.disabled = false;
  },(err)=>{
    // el.disabled = false;
  })
};

function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime)
      return;
  }
}

/*// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // node环境的不同，对应不同的baseURL
  timeout: 5000, // 请求的超时时间
  //设置默认请求头，使post请求发送的是formdata格式数据// axios的header默认的Content-Type好像是'application/json;charset=UTF-8',我的项目都是用json格式传输，如果需要更改的话，可以用这种方式修改
  // headers: {
  // "Content-Type": "application/x-www-form-urlencoded"
  // },
  withCredentials: true // 允许携带cookie
});*

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {App},
  template: '<App/>'
});


