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

Vue.prototype.serverPath = `${process.env.NODE_ENV}/`;

let html = "<span>\
              <span style='margin-right: 5px;' v-on:click='preview'>{{ name }}</span>\
              <a class='file-download' v-on:click='download' target='_blank' :href=\"serverPath + url + '/download?id=' + id\" :download='name'>\
                <img src='../static/images/UPLOAD.png' alt='Download' style='cursor: pointer;'>\
              </a>\
              <el-dialog class='file-preview' :title='name' :visible.sync='previewVisible' fullscreen>\
                <iframe v-if='previewType === \"doc\"' width='100%' height='100%' :src='previewUrl'></iframe>\
                <div class='img-preview' v-if='previewType === \"img\"' style='width: 100%; height: 100%;'><img :src='previewUrl'/> </div>\
                <div v-show='previewType == \"video\"' style='width: 100%; height: 100%;'>\
                </div>\
                <div v-show='previewType == \"audio\"' style='width: 100%; height: 100%;'>Video </div>\
              </el-dialog>\
            </span>";


Vue.component("file-template", {
  props: ["id", "url", "name"],
  template: html,
  data: function () {
    return {
      previewUrl: "",
      previewVisible: false,
      previewType: "",
    };
  },
  methods: {
    download: function () {
      this.$emit("download");
    },
    preview: function () {
      this.$emit("beforePreview");

      let filename = this.name;
      if (/\.((ppt|doc|xls)x?|pdf)$/.test(filename)) {
        this.previewType = "doc";
        this.previewUrl = "/static/pdf/web/viewer.html?file=" + encodeURIComponent("/" + this.url + "/preview?id=" + this.id);
      } else if (/\.(gif|png|jpe?g|bmp)$/.test(filename)) {
        this.previewType = "img";
        this.previewUrl = this.url + "/download?id=" + this.id;
      } else if (/\.mp3$/.test(filename)) {
        this.previewType = "audio";
        this.previewUrl = this.url + "/download?id=" + this.id;
      } else if (/\.(mp4|swf)$/.test(filename)) {
        this.previewType = "video";
        this.previewUrl = `${process.env.NODE_ENV}` + "/" + this.url + "/download?id=" + this.id;
      } else {
        this.previewType = "";
        this.previewUrl = "";
        this.$message.error(this.$t("message.Filetypeisnotsupportpreview"));/*"File type is not support preview"*/
        return;
      }
      this.previewVisible = true;

      this.$emit("afterPreview");
    }
  }
});

var $http = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  withCredentials: true,
  // headers: {"language": "zh"}
  // transformRequest: [function (data, header) {
  //   // Do whatever you want to transform the data
  //   console.log("header", header)
  //   header.common["language"] = "zh"
  //   console.log("header", header)
  //   return data;
  // }],

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
  Vue.prototype.$message.error(this.$t("message.Anerroroccurredinrequest"));/*"An error occurred in request"*/
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
  // this.$confirm('确认删除？'
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


