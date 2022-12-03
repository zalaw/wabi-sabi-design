<template>
  <div class="testimonials-container-component">
    <div class="testimonials-main-container">
      <div class="testimonials-heading">
        <span class="back" @click.self="$emit('handleTestimonialsClose')"><i class="fas fa-arrow-left"></i>Back</span>
        <h1 class="text-center">Testimonials</h1>
      </div>

      <div class="select-box">
        <div class="options-container" :class="{ 'active': option.active }">
          <div  v-for="(item, index) in data" 
                :key="index" 
                :class="{ 'option-selected': index == option.index }" 
                class="option" 
                @click="selectOption(item, index)">
            <input type="radio" class="radio" :id="item.title" name="project" />
            <label for="default">{{ item.title }}</label>
          </div>
        </div>

        <div class="selected" @click="option.active = !option.active">
          {{ getOptionText }}
        </div>
      </div>

      <div v-if="option.selected !== null" class="gallery">
        <div @click="selectImage(index)" v-for="(image, index) in option.selected.images" :key="index" class="image-container">
          <img :src="image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullScreenImageVue from './FullScreenImage.vue'

export default {
  name: 'ProjectsComponent',
  components: {
    FullScreenImageVue
  },
  props: {
    loggedIn: Boolean,
    project: Object
  },
  data() {
    return {
      option: {
        active: false,
        selected: null,
        index: -1
      },
      imageSelectedIndex: -1,
      data: [
        {
          _id: 'TE09ufaD',
          title: 'Tension of desire',
          images: [
            require('@/assets/img/projects/p1.jpg'),
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p2.jpg'),
            require('@/assets/img/projects/p3.jpg'),
            require('@/assets/img/projects/p1.jpg'),
            require('@/assets/img/projects/p3.jpg'),
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p1.jpg'),
            require('@/assets/img/projects/p3.jpg'),
            require('@/assets/img/projects/p2.jpg'),
            require('@/assets/img/projects/p1.jpg'),
            require('@/assets/img/projects/p3.jpg'),
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p1.jpg'),
            require('@/assets/img/projects/p3.jpg'),
            require('@/assets/img/projects/p2.jpg')
          ]
        },
        {
          _id: 'EX09ufaD',
          title: 'Exaled eternity',
          images: [
            require('@/assets/img/projects/p2.jpg'),
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p4.jpg')
          ]
        },
        {
          _id: 'DI09ufaD',
          title: 'Dining room moodboard',
          images: [
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p4.jpg')
          ]
        },
        {
          _id: 'EM09ufaD',
          title: 'Emergency relaxation',
          images: [
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p4.jpg'),
            require('@/assets/img/projects/p4.jpg')
          ]
        }
      ]
    }
  },
  methods: {
    selectOption(item, index) {
      this.option.active = false
      this.option.selected=  item
      this.option.index = index
    },
    selectImage(index) {
      this.imageSelectedIndex = index
    }
  },
  computed: {
    getOptionText() {
      return this.option.selected?.title ?? 'Select a project'
    }
  },
  created() {
    console.log('projects.vue created')
  },
  async mounted() {
    console.log('projects.vue mounted')
    this.option.selected = JSON.parse(JSON.stringify(this.data)).find(x => x._id == this.project?._id) || null
  },
  destroyed() {
    console.log('projects.vue destroyed')
  }
}
</script>


<style scoped>
.projects-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.text-cont {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.text-cont span {
  cursor: pointer;
}

.text-cont i {
  margin-right: .5rem;
}

.back {
  font-size: 1rem;
  position: absolute;
  left: 0;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  padding: .25rem 0;
}

.back:hover {
  border-bottom: 2px solid white;
}

.back i {
  margin-right: .5rem;
}

.close-projects {
  position: absolute;
  top: 4rem;
  right: 2rem;
  font-size: 2rem;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: .3s all ease-in-out;
}

.close-projects:hover {
  background-color: rgb(59, 59, 59);
}

.highlighted {
  background-color: rgb(80, 80, 80) !important;
}

.projects-container-component {
  width: 100%;
  min-height: 100%;
  background-color: rgb(39, 39, 39);
  position: absolute;
  color: white;
  z-index: 20000;
}

.projects-main-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 4rem 7.5%;
}

.flex {
  display: flex;
  flex: 1 1;
  overflow: hidden;
  gap: 2rem;
}

.list {
  width: 30%;
  min-width: 320px;
  font-size: 1em;
  overflow-y: auto;
}

.item {
  background-color: rgb(45, 45, 45);
  padding: .5rem 1rem;
  cursor: pointer;
}

.item:hover {
  background-color: rgb(55, 55, 55);
}

.content {
  width: 70%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
}







.select-box {
  display: flex;
  max-width: 400px;
  width: 100%;
  flex-direction: column;
  margin: 0 auto;
}

.select-box .options-container {
  background: rgb(55, 55, 55);
  color: #f5f6fa;
  max-height: 0;
  width: 100%;
  opacity: 0;
  transition: all 0.3s;
  border-radius: .5rem;
  overflow: hidden;
  order: 1;
}

.selected {
  background: rgb(55, 55, 55);
  border-radius: .5rem;
  margin-bottom: .5rem;
  color: white;
  position: relative;
  order: 0;
}

.select-box .options-container.active {
  max-height: 240px;
  opacity: 1;
  overflow-y: scroll;
}

.select-box .options-container.active + .selected::after {
  transform: rotateX(180deg);
  top: -6px;
}

.select-box .options-container::-webkit-scrollbar {
  width: .5rem;
  background: rgb(65, 65, 65);
  border-radius: 0 .5rem .5rem 0;
}

.select-box .options-container::-webkit-scrollbar-thumb {
  background: rgb(85, 85, 85);
  border-radius: 0 .5rem .5rem 0;
}

.select-box .option,
.selected {
  padding: .75rem 1.5rem;
  cursor: pointer;
}

.select-box .option:hover {
  background: rgb(70, 70, 70);
}

.select-box label {
  cursor: pointer;
}

.select-box .option .radio {
  display: none;
}

.option-selected {
  background-color: rgb(70, 70, 70);
}


.gallery {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
  grid-auto-rows: minmax(14rem, 40vh);
  margin: 0 auto;
  width: 100%;
  max-width: 80rem;
}

.image-container {
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .3s all ease-in-out;
  cursor: pointer;
}

.image-container img:hover {
  transform: scale(1.05);
}
</style>