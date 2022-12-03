<template>
  <div class="admin-container">
    <div class="admin-main-container">
      <div class="left-panel">
        <h1 class="admin-h1 text-center">Admin</h1>

        <div class="admin-menu">
          <p @click="loading = false, getMessages(), selected = 0" :class="{ 'active': selected == 0 }"><i class="fas fa-fw fa-envelope"></i>Messages</p>
          <p @click="loading = false, selected = 1" :class="{ 'active': selected == 1 }"><i class="fas fa-fw fa-star"></i>Create testimonial</p>
        </div>
      </div>

      <div class="right-panel">
        <div v-if="selected == 0" class="messages-container">
          <h1>Messages</h1>

          <div v-if="loading" class="loader-container">
            <span class="loader"></span>
          </div>

          <p v-if="messages.length == 0">There are no messages</p>

          <div class="message-container" v-for="message in messages" :key="message._id">
            <div class="message">
              <p style='color: #aaa; font-size: .8rem; margin-bottom: .5rem'>{{ message.name }} ({{ message.phone }}), {{ getMessageDate(message.createdAt) }}</p>
              <p v-for="(m, index) in getMessage(message.message)" :key="index">{{ m }}</p>
              
              <p style='color: #aaa; font-size: .8rem; margin-top: .5rem'>{{ message.email }}</p>
            </div>
            
          </div>
        </div>

        <div v-if="selected == 1" class="create-testimonial">
          <h1>Create testimonial</h1>
          
          <div v-if="link === ''">
            <Button @click.native="generateLink" text="Generate link" :class="['button-action', 'good']" />
          </div>

          <div v-if="loading" class="loader-container">
            <span class="loader"></span>
          </div>

          <div v-if="link !== ''" class="input-result">
            <input ref="link" style="padding-right: 4rem;" readonly type="text" v-model="link" />
            <i @click="copy" class="fas fa-copy"></i> 
          </div>

          <p v-if="link !== ''">Send this link to your client</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Button from '../components/Button.vue'

export default {
    name: 'AdminView',
    components: {
      Button
    },
    data() {
      return {
        loading: false,
        selected: -1,
        optionTitle: '',
        link: '',
        messages: []
      }
    },
    methods: {
      copy() {
        navigator.clipboard.writeText(this.link)
        this.$store.dispatch('setNotification', { isError: false, text: 'Link copied to clipboard' })
      },
      async generateLink() {
        this.loading = true

        try {
          const response = await axios.get('/api/admin/create-testimonial', { params: { date: Date.now() } })

          this.link = `${window.location.origin}/testimonial/${response.data.token}`
        } catch (err) {
          this.$router.push('/')
          this.$store.dispatch('setLoggedIn', false)
          this.$store.dispatch('setNotification', { isError: true, text: 'Please log in again to continue your operations' })
        } finally {
          this.loading = false
        }
      },
      async getMessages() {
        this.loading = true

        try {
          const response = await axios.get('/api/admin/messages')
          this.messages = response.data.messages
        } catch (err) {
          this.$store.dispatch('setNotification', { isError: true, text: err.response.data.error })
        } finally {
          this.loading = false
        }
      },
      getMessageDate(date) {
        return new Date(date).toLocaleString('ro-RO').split(',')[0]
      },
      getMessage(message) {
        return message.split('\n')
      }
    },
    mounted() {
      if (this.$store.getters.getLoggedIn == false) {
        this.$router.push('/unauthorized')
      }
    }
}
</script>

<style scoped>
.create-testimonial {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-container {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 2rem;
  position: fixed;
}

.admin-main-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.left-panel {
  width: 30%;
  height: 100%;
  background-color: rgb(45, 45, 45);
  display: flex;
  flex-direction: column;
  padding-top: 8rem;
}

.admin-h1 {
  padding-bottom: 1rem;
}

.admin-menu {
  flex: 1 1;
  overflow: auto;
}

.input-result {
  position: relative;
}

.input-result i {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  background-color: #5b92e5;
  padding: 1em;
  font-size: .9rem;
  border-radius: 0 .5rem .5rem 0;
  cursor: pointer;
}

.admin-menu p {
  padding: 1rem 2rem;
  cursor: pointer;
  transition: .3s all ease-in-out;
  display: flex;
  align-items: center;
  gap: .5rem;
}

.admin-menu i {
  font-size: 1.5rem;
}

.admin-menu p:hover {
  background-color: rgb(55, 55, 55);
}

.right-panel {
  width: 70%;
  height: 100%;
  padding: 8rem 2rem 2rem 2rem;
  overflow: auto;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.message {
  background-color: rgb(55, 55, 55);
  padding: 1rem;
  border-radius: 1rem;
  max-width: 480px;
  width: 100%;
}

.active {
  background-color: rgb(55, 55, 55);
}

@media screen and (max-width: 960px) {
  .admin-main-container {
    flex-direction: column;
    overflow-y: auto;
  }

  .left-panel {
    padding-top: 6rem;
    width: 100%;
  }

  .right-panel {
    padding: 2rem;
    width: 100%;
    overflow: unset;
  }
}
</style>