
export default {

  formatDateTime: function(date) {
    if (date == undefined || date === null || date === "") {
      return '';
    }
    try {
      date = new Date(date);
    } catch (e) {
      console.error("date format error", date);
      return '';
    }
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();
    let hour = '' + date.getHours();
    let min = '' + date.getMinutes();
    let sec = '' + date.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    min = min.length < 2 ? ('0' + min) : min;
    sec = sec.length < 2 ? ('0' + sec) : sec;

    return [year, month, day].join('-') + " " + [hour, min, sec].join(":");
  },

  fileUploadPath: function () {
    return `${process.env.NODE_ENV}/file/upload`;
  },

  fileSizeConvert: function (limit){
    let size = "";
    if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B
      size = limit.toFixed(2) + "B";
    }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB
      size = (limit / 1024).toFixed(2) + "KB";
    }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    }else{ //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    let sizestr = size + "";
    let len = sizestr.indexOf("\.");
    let dec = sizestr.substr(len + 1, 2);
    if(dec == "00"){//当小数点后为00时 去掉小数部分
      return sizestr.substring(0,len) + sizestr.substr(len + 3,2);
    }
    return sizestr;
  },

  storeLoginUser: function (user) {
    sessionStorage.setItem("loginUser", JSON.stringify(user));
  },

  getLoginUser: function () {
    let loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    return loginUser == null ? {} : loginUser;
  },

  // get: function (path, param, handler) {
  //   this.$http.get(`${process.env.NODE_ENV}` + path, {params: param})
  //     .then((res) => {
  //       if (res.data.code == 200) {
  //         handler(res.data);
  //       } else if (res.data.code == 300) {
  //         this.$router.push({path: "/login"});
  //       } else {
  //         this.$message.error(res.data.message);
  //       }
  //     });
  // },
  //
  // post: function (path, param, handler) {
  //   this.$http.post(`${process.env.NODE_ENV}` + path, param)
  //     .then((res) => {
  //       if (res.data.code == 200) {
  //         handler(res.data);
  //       } else if (res.data.code == 300) {
  //         this.$router.push({path: "/login"});
  //       } else {
  //         this.$message.error(res.data.message);
  //       }
  //     });
  // },
}
