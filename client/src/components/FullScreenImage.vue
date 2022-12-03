<template>
  <div class="full-screen-image">
    <i @click="$emit('handleCloseFullScreenImage')" class="close-full-screen fas fa-times"></i>

    <div class="previous" @click="prev()">
      <i class="fas fa-angle-left"></i>
    </div>

    <img :src="images[dataIndex]" />

    <div class="next" @click="next()">
      <i class="fas fa-angle-right"></i>
    </div>

    <p class="total">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'FullScreenImageComponent',
  props: {
    index: Number,
    images: Array
  },
  data() {
    return {
      dataIndex: this.index
    }
  },
  methods: {
    prev() {
      this.dataIndex -= 1
      if (this.dataIndex < 0) this.dataIndex = this.images.length - 1
    },
    next() {
      this.dataIndex += 1
      if (this.dataIndex >= this.images.length) this.dataIndex = 0
    }
  },
  computed: {
    text() {
      return `${this.dataIndex + 1} / ${this.images.length}`
    }
  }
}
</script>


<style scoped>
.total {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translate(-50%, 0);
}
.full-screen-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(39, 39, 39, 0.95);
  z-index: 20000;
  padding: 4rem 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.full-screen-image img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: 0 auto;
}

.close-full-screen {
  position: absolute;
  top: 1rem;
  left: 50%;
  color: white;
  font-size: 2rem;
  z-index: 40000;
  transform: translate(-50%, 0);
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-full-screen:hover {
  background-color: rgb(80, 80, 80);
}

.previous, .next {
  position: absolute;
  color: white;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  padding: 0 1rem;
  cursor: pointer;
}

.previous:hover, .next:hover {
  background-color: rgb(80, 80, 80, 0.5);
}

.previous i, .next i {
  font-size: 3rem;
}

.previous {
  left: 0;
}

.next {
  right: 0;
}

@media screen and (max-width: 480px) {
  .full-screen-image {
    padding: 2rem;
  }

  .previous, .next {
    padding: .5rem;
  }

  .previous i, .next i {
    font-size: 1.5rem;
  }
}
</style>