<template>
  <div class="stretch" @click="$router.push('/')">
    <div class="text">
      Should be showing: {{ this.slideTopper ? 'snow scene' : 'water sunset' }}
    </div>
    <div class="slideTop">
      <video src="video://./static/video1.mp4" playsinline loop muted ref="video" preload="auto" />
    </div>
    <div class="slideBottom" :class="{slideTopper: this.slideTopper}">
      <video src="video://./static/video2.mp4" playsinline loop muted ref="video2" preload="auto" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data() {
    return {
      slideTopper: false
    };
  },
  mounted() {
    this.playVideo();
    this.transition();
  },
  methods: {
    transition() {
      setTimeout(() => {
        this.slideTopper = !this.slideTopper;
        this.transition();
      }, 10000);
    },
    playVideo() {
      this.$nextTick(() => {
        this.$refs.video.play();
        this.$refs.video2.play();
      });
    }
  }
};
</script>

<style scoped>
  .stretch {
    width: 100%;
    height: 100%;
  }
  .slideTop {
    position: absolute;
    top: 50px;
    z-index: 10;
    width: 100%;
    height: 100%;
  }
  .slideBottom {
    top: 50px;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .slideTopper {
    position: absolute;
    z-index: 20;
  }
  video {
    width: 100%;
    height: auto;
  }
  .text {
    width: 100%;
    height: 50px;
    font-size: 40px;
    background: black;
    color: white;
  }
</style>
