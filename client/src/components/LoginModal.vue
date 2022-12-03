<template>
  <div class="modal-container">
    <form @submit.prevent="login">
      <i class="fas fa-times" @click="closeLoginModal"></i>

      <div class="input-row">
        <label for="password">Password</label>
        <input type="password" v-model="password" />
      </div>

      <div class="input-row submit-row">
        <input :class="{ 'button-disabled': buttonDisabled }" type="submit" :value="buttonMessage" />
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginModalComponent',
  data() {
    return {
      buttonMessage: 'Login',
      buttonDisabled: false,
      password: ''
    }
  },
  methods: {
    closeLoginModal() {
      this.$store.dispatch('setShowLoginModal', false)
    },
    async login() {
      try {
        if (this.password === '' || this.buttonDisabled) return
        
        this.buttonMessage = 'Logging in...'
        this.buttonDisabled = true

        const response = await axios.post('/api/auth/login',  { password: this.password })

        this.$store.dispatch('setLoggedIn', true)
        this.$store.dispatch('setNotification', { isError: false, text: response.data.message })

        this.closeLoginModal()
      } catch (err) {
        console.log(err)
        this.$store.dispatch('setNotification', { isError: true, text: err.response.data.message })
      } finally {
        this.buttonMessage = 'Login'
        this.buttonDisabled = false
      }
    }
  }
}
</script>


<style scoped>
.modal-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(111, 111, 111, 0.75);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.modal-container form {
  min-width: 320px;
  max-width: 480px;
  width: 100%;
  background-color: rgb(39, 39, 39);
  padding: 2rem 4rem;
  position: relative;
  box-shadow: rgba(20, 20, 20, 0.35) 0px 7px 29px 0px;
}

.modal-container form i {
  position: absolute;
  top: .25rem;
  right: .25rem;
  padding: .5rem 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container form i:hover {
  background-color: rgb(69, 69, 69);
}
</style>