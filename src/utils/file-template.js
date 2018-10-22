import Vue from "vue";
import player from './player'

let html = "<span>\
              <span style='margin-right: 5px;' v-on:click='preview'>{{ name }}</span>\
              <a class='file-download' v-on:click='download' target='_blank' :href=\"serverPath + url + '/download?id=' + id\" :download='name'>\
                <img src='../../static/images/UPLOAD.png' alt='Download' style='cursor: pointer;'>\
              </a>\
              <el-dialog class='file-preview' :title='name' :visible.sync='previewVisible' @close='previewDialogClose' fullscreen>\
                <iframe v-if='previewType === \"doc\"' width='100%' height='100%' :src='previewUrl'></iframe>\
                <div class='img-preview' v-if='previewType === \"img\"' style='width: 100%; height: 100%;'><img :src='previewUrl'/> </div>\
                <div v-if='previewType == \"video\" || previewType == \"audio\"' style='width: 100%; height: 100%;'>\
                  <player :video-url='previewUrl' :state='state'></player>\
                </div>\
                <div v-show='previewType == \"audio\"' style='width: 100%; height: 100%;'>Video </div>\
              </el-dialog>\
            </span>";

Vue.component("file-template", {
  props: ["id", "url", "name"],
  template: html,
  components: {
    player: player
  },
  data: function () {
    return {
      previewUrl: "",
      previewVisible: false,
      previewType: "",
      state: false,
    };
  },
  methods: {
    previewDialogClose: function () {
      this.state = true;
    },
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
        this.previewUrl = this.url + "/preview?id=" + this.id;
      } else if (/\.mp3$/.test(filename)) {
        this.state = false;
        this.previewType = "audio";
        this.previewUrl = "/" + this.url + "/preview?id=" + this.id;
        console.log(this.previewUrl)
      } else if (/\.(mp4|swf)$/.test(filename)) {
        this.state = false;
        this.previewType = "video";
        this.previewUrl = `${process.env.NODE_ENV}` + "/" + this.url + "/preview?id=" + this.id;
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

