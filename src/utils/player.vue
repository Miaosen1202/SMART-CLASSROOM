<template>
  <div id="alls" class="player-container">
    <div class="player">
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="false"
                    :options="playerOptions"
                    @play="onPlay($event)"
                    @pause="OnPause($event)"
                    @statechanged="playerStateChanged($event)"
                    >
      </video-player>
    </div>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player'
  import '../../node_modules/video.js/dist/video-js.css'
  import '../../node_modules/vue-video-player/src/custom-theme.css'

  export default {
    props: {
      videoUrl: String,
      state: Boolean,
    },
    data() {
      return {
        playerOptions: {
          // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false,
          muted: false,
          loop: false,
          preload: 'auto',
          language: 'zh-CN',
          aspectRatio: '16:9',
          fluid: true,
          sources: [{
            type: 'video/mp4',
            src: this.videoUrl  // 你的m3u8地址（必填）
            // src: "/file/lessonMaterial/download?id=319"
          }],
          // poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-3.jpg', // 你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试'
        },

      };
    },
    watch: {
      videoUrl: function (val) {
        if (val !== "") {
          this.$refs.videoPlayer.player.dispose();
          this.$refs.videoPlayer.player.src(val);
        }
      },
      //弹出框关闭后暂停 否则一直在播放 state从弹出框组件传值
      state: function (val) {
        if (val) {
          this.$refs.videoPlayer.player.pause();
        }
      },
    },
    components: {
      videoPlayer
    },
    mounted () {
      console.log("player mounted");
    },
    methods: {
      onPlay (player) {
        console.log("play...");
      },
      OnPause (player) {
        console.log("pause...");
      },
      playerStateChanged (player) {
        console.log("player state changed...");
      }
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player;
      }
    }
  }
</script>
<style scoped>
  #alls {
    width: 100%;
    height: 50%;
    /*background-color: #0e38b1;*/
  }

  .player-container {
    /*background-color: #efefef;*/
    min-height: 100%;
  }
</style>
