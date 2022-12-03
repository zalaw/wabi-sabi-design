<template>
  <div v-if="loaded" class="view-container">
    <FullScreenImage v-if="imageSelectedIndex !== -1"
                        @handleCloseFullScreenImage="imageSelectedIndex = -1" 
                        :images="option.selected.images"
                        :index="imageSelectedIndex" />

    <div class="projects-container">
      <div class="projects-heading">
        <h1 class="text-center">Projects</h1>
      </div>

      <div class="select-box">
        <div class="options-container" :class="{ 'active': option.active && !canEdit }">
          <div v-if="loggedIn" class="option" @click="newProject">
            <input type="radio" class="radio" name="project" />
            <label for="default">New project</label>
          </div>

          <div class="option" @click="viewAll" :class="{ 'option-selected': option.selected.title == 'All', }">
            <input type="radio" class="radio" name="project" />
            <label for="default">All</label>
          </div>

          <div  v-for="(item, index) in projects" 
                :key="index" 
                :class="{ 'option-selected': index == option.index, 'text-overflow': loggedIn }" 
                class="option" 
                @click="selectOption(item, index)">
            <input type="radio" class="radio" :id="item.title" name="project" />
            <label for="default">{{ item.title }}</label>
            <i v-if="loggedIn" @click.stop="deleteProject(item._id)" class="delete-project fas fa-trash"></i>
          </div>
        </div>

        <div class="selected-container">
          <div class="selected" @click="option.active = !option.active">
            <input ref="project" class="input-edit-project" :class="{ 'text-overflow-input': loggedIn }" :disabled="!canEdit" type="text" @click.stop @keyup.enter="editProject" :value="option.selected.title" />
            <i v-if="loggedIn && option.selected && option.selected.title != 'All' && !canEdit" @click.stop="editProjectClicked()" class="edit-project fas fa-pen"></i>
          </div>

          <div v-if="canEdit" class="action">
            <div class="action-main">
              Editing
            </div>
            <div class="action-buttons">
              <Button @click.native="editProject" text="Save" :class="['button-action', 'primary']" />
              <Button @click.native="cancelEdit" text="Cancel" :class="['button-action']" />
            </div>
          </div>

        </div>
      </div>

      <div v-if="option.selected !== null" class="gallery-container">
        <div style="padding-bottom: 1rem; display: flex; align-items: center; gap: 1rem;" v-if="loggedIn && !canEdit && option.selected !== null && option.selected.title != 'All' && option.selected.images.length > 0">
          <Button @click.native="deleteImages" :text="deleteImagesClicked ? 'Delete images' : 'Select images to delete'" :class="['button-action', 'critical']" />
          <Button v-if="deleteImagesClicked" @click.native="deleteImagesClicked = false, imagesSelected = []" text="Cancel" :class="['button-action']" />
          <span v-if="imagesSelected.length > 0">{{ imagesSelected.length }} / {{ option.selected.images.length }}</span>
        </div>

        <div v-if="!isNewProject && option.selected.images.length == 0" class="no-images">
          <div>
            <i class="fas fa-image"></i>
            <p>Well, this is awkward, there are no images yet</p>
          </div>
        </div>

        <div v-if="imagesToUpload.length > 0" style="padding-bottom: 1rem; display: flex; align-items: center; gap: 1rem;">
          <Button text="Upload" @click.native="onUpload" :class="['button-action', 'good']" />
          <Button @click.native="imagesToUpload = [], imagesToUploadServer = []" text="Cancel" :class="['button-action']" />
        </div>

        <div v-if="isNewProject">
          <h1 class="text-center">Save the project then upload the photos</h1>
        </div>

        <div v-else class="gallery"> 
          <div v-if="loggedIn && option.selected.title != 'All'" class="image-container add-new-project" @click="addNewImagesClicked">
            <i class="fas fa-plus-circle"></i>
            <form enctype="multipart/form-data">
              <input multiple accept="image/*" ref="images" class="pick-images" type="file" @change="onFilesSelected" />
            </form>
          </div>

          <div v-for="(image, index) in imagesToUpload" :key="index" class="image-container preview">
            <div class="cta">
              <i class="remove-from-upload fas fa-ban" @click="imagesToUpload.splice(index, 1); imagesToUploadServer.splice(index, 1)"></i>
              <span>New</span>
            </div>

            <div v-if="image.invalidMessage" class="img-overlay">
              <div>
                <p>This image won't be uploaded</p>
                <p>{{image.invalidMessage}}</p>
              </div>
            </div>

            <img :src="image.preview" />
          </div>

          <div v-for="(image, index) in option.selected.images" :key="`${index}a`" class="image-container">
            <input :class="{ 'visible': deleteImagesClicked }" type="checkbox" :value="image" v-model="imagesSelected">
            <img :src="image" @click="selectImage(index)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import MainService from '../MainService'
import axios from 'axios'
import _ from 'lodash'

import FullScreenImage from '../components/FullScreenImage.vue'
import Button from '../components/Button.vue'

export default {
  name: 'ProjectsView',
  components: {
    FullScreenImage,
    Button
  },
  props: {
    project: Object
  },
  data() {
    return {
      loaded: false,
      imagesToUpload: [],
      imagesToUploadServer: [],
      deleteImagesClicked: false,
      imagesSelected: [],
      isNewProject: false,
      selectedImage: null,
      canEdit: false,
      option: {
        active: false,
        selected: null,
        index: -1
      },
      imageSelectedIndex: -1,
    }
  },
  methods: {
    async deleteImages() {
      if (!this.deleteImagesClicked) {
        this.deleteImagesClicked = true
      } else {
        this.option.selected.images = this.option.selected.images.filter(image => !this.imagesSelected.includes(image))

        try {
          const response = await axios.patch('/api/admin/projects', { id: this.option.selected._id, title: this.option.selected.title, images: this.option.selected.images })

          this.$store.dispatch('updateProject', response.data.project)
          this.$store.dispatch('setNotification', { error: response.data.isError, text: response.data.message })

          this.deleteImagesClicked = false
        } catch (err) {
          console.log(err)
        }
      }

      this.imagesSelected = []
    },
    cancelEdit() {
      this.option.active = false
      this.canEdit = false

      if (this.isNewProject) {
        this.option.selected = null
        this.option.index = -1
        this.isNewProject = false
        this.viewAll()
      }
    },
    editProjectClicked() {
      this.canEdit = true
    },
    async editProject() {
      this.option.selected.title = document.querySelector('.input-edit-project').value

      if (this.isNewProject) {
        try {
          const response = await axios.post('/api/admin/projects', this.option.selected)

          this.$store.dispatch('addProject', response.data.project)
          this.$store.dispatch('setNotification', { error: response.data.isError, text: response.data.message })

          this.option.selected = response.data.project
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          const response = await axios.patch('/api/admin/projects', { id: this.option.selected._id, title: this.option.selected.title, images: this.option.selected.images })

          this.$store.dispatch('updateProject', response.data.project)
          this.$store.dispatch('setNotification', { error: response.data.isError, text: response.data.message })
        } catch (err) {
          console.log(err)

        }
      }

      this.canEdit = false
      this.isNewProject = false
    },
    async deleteProject(id) {
      if(confirm('Are you sure you want to delete this project?')) {
        try {
          const response = await axios.delete(`/api/admin/projects/${id}`)

          this.$store.dispatch('deleteProject', id)
          this.$store.dispatch('setNotification', { error: response.data.isError, text: response.data.message })

          this.viewAll()
        } catch (err) {
          console.log(err)
          this.$store.dispatch('setNotification', { error: true, text: err.response.data.error })
        }
      }
    },
    viewAll() {
      var images = []

      this.projects.forEach(project => {
        images = [...images, ...project.images]
      })

      this.option = {
        active: false,
        selected: { 
          title: 'All',
          images: images
        },
        index: -1
      }
    },
    newProject() {
      this.imagesToUploadServer = []
      this.imagesToUpload = []
      this.imagesSelected = []

      this.option = {
        active: true,
        selected: { 
          title: `New project ${this.projects.length}`,
          images: []
        },
        index: 0
      }

      this.isNewProject = true

      setTimeout(() => {
        document.querySelector('.edit-project').click()
      }, 1)
    },
    selectOption(item, index) {
      this.imagesToUploadServer = []
      this.imagesToUpload = []
      this.deleteImagesClicked = false
      this.imagesSelected = []
      this.isNewProject = false
      this.option.active = false
      this.option.selected=  item
      this.option.index = index
    },
    selectImage(index) {
      this.imageSelectedIndex = index
    },
    addNewImagesClicked() {
      document.querySelector('.pick-images').click()
    },
    onFilesSelected() {
      this.imagesToUploadServer = [...this.imagesToUploadServer, ...this.$refs.images.files]
      this.imagesToUpload = [
        ...this.imagesToUpload,
        ..._.map(this.$refs.images.files, image => ({
          name: image.name,
          size: image.size,
          type: image.type,
          preview: URL.createObjectURL(image),
          invalidMessage: this.validateImage(image)
        }))
      ]
    },
    validateImage(image) {
      const MAX_SIZE = 1000000;
      const allowedTypes = ['image/jpeg', 'image/png']

      if (image.size > MAX_SIZE) return `Max size allowed: ${MAX_SIZE / 1000000} MB`
      if (!allowedTypes.includes(image.type)) return 'Not an image'

      return ''
    },
    async onUpload() {
      const formData = new FormData()
      
      formData.append('projectId', this.option.selected._id)

      _.forEach(this.imagesToUploadServer, image => {
        if (this.validateImage(image) == '') {
          formData.append('images', image)
        }
      })

      try {
        const response = await axios.post('/api/admin/upload', formData)
        this.$store.dispatch('updateProject', response.data.project)
        this.$store.dispatch('setNotification', { isError: false, text: response.data.message })

        this.imagesToUploadServer = []
        this.imagesToUpload = []
      } catch (err) {
        this.$store.dispatch('setNotification', { isError: true, text: err.response.data.error })
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get('/api/public/projects')
      this.$store.dispatch('setProjects', response.data.projects)
    } catch (err) {
      this.loaded = false
    }

    this.viewAll()
    this.loaded = true
  },
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    projects() {
      return this.$store.getters.getProjects
    },
    // getOptionText() {
    //   return this.option.selected?.title ?? 'Select a project'
    // }
  }
}
</script>


<style scoped>
.no-images {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #aaa;
  text-align: center;
  padding-bottom: 2rem;
}

.no-images i {
  font-size: 8rem;
  color: #444;
}

.selected-container {
  position: relative;
}

.pick-images {
  opacity: 0;
  position: absolute;
}

.img-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(60, 60, 60, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  z-index: 50;
  text-align: center;
}

.projects-container {
  display: flex;
  flex-direction: column;
  color: white;
  display: flex;
  gap: 2rem;
}

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

.action {
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-buttons {
  display: flex;
  gap: .5rem;
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

.input-edit-project {
  font-family: 'Poppins', sans-serif;
  padding: .75rem 1.5rem !important;
  font-size: .925em;
  cursor: pointer;
}

.delete-project, .edit-project, .edit-project-confirm {
  color: red;
  font-size: 1.25rem;
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translate(0, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.delete-project:hover, .edit-project:hover, .edit-project-confirm:hover {
  background-color: rgb(120, 120, 120);
  width: 32px;
  height: 32px;
}

.edit-project, .edit-project-confirm {
  color: white;
}



.select-box {
  display: flex;
  max-width: 400px;
  width: 100%;
  flex-direction: column;
  margin: 0 auto;
}

.select-box .options-container {
  margin-top: 1rem;
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

.option {
  white-space: nowrap;
  overflow: hidden;
}

.option.text-overflow {
  padding-right: 4rem !important;
}

.text-overflow-input {
  padding-right: 4rem !important;
  text-overflow: ellipsis;
}

.select-box .option {
  padding: .75rem 1.5rem;
  cursor: pointer;
  position: relative;
  text-overflow: ellipsis;
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

.gallery-container {
  height: 100%;
  max-width: 80rem;
  width: 100%;
  margin: 0 auto;
}

.gallery {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  grid-auto-rows: minmax(14rem, 40vh);
  width: 100%;
}

.image-container {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.cta {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 120;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.remove-from-upload {
  color: red;
  font-size: 2rem;
  cursor: pointer;
  transition: .3s all ease-in-out;
}

.cta span {
  background-color: #5b92e5;
  color: white;
  padding: .25em .5em;
  font-size: .8rem;
}

.image-container input[type="checkbox"] {
  position: absolute;
  top: 1rem;
  left: 1rem;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  background: lightgray;
  height: 32px !important;
  width: 32px !important;
  color: white;
  z-index: 10;
  border-radius: 50%;
  padding: 0 !important;
  display: none;
}

.visible {
  display: block !important;
}

.image-container input[type="checkbox"]:checked {
  background-color: orange;
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

.add-new-project {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 8px solid rgb(55, 55, 55);
  color: rgb(55, 55, 55);
  font-size: 4rem;
  cursor: pointer;
  transition: .3s all ease-in-out;
  position: relative;
}

.add-new-project:hover {
  color: rgb(125, 125, 125);
  border-color: rgb(125, 125, 125);
  background-color: rgb(55, 55, 55);
}

.add-project {
  font-size: 2rem;
  margin: 0 1rem;
  cursor: pointer;
  transition: .3s all ease-in-out;
}

.add-project:hover {
  color: rgb(200, 200, 200);
}

.preview img {
  transition: none !important;
}

.preview img:hover {
  transform: none;
}

</style>