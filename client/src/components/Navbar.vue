<template>
  <div class="navbar">
    <div class="logo" @click="showMenu = false">
      <router-link to="/">
        <p>Wabi</p>
        <p>Sabi</p>
        <p>Design</p>
      </router-link>
    </div>

      <div :class="{ 'active': showMenu }" class="menu" @click="showMenu = false">
        <router-link to="/">Home</router-link>
        <router-link to="/projects">Projects</router-link>
        <router-link to="/testimonials">Testimonials</router-link>
        <span v-if="!loggedIn" @click="showLoginModal">Login</span>
        <div v-else style="display: flex; gap: 2rem;">
          <router-link to="/admin">Admin</router-link>
          <span @click="logout">Logout</span>
        </div>
      </div>

      <div :class="{ 'active': showMenu }"  class="hamburger" @click="showMenu = !showMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NavbarComponent',
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    showLoginModal() {
      this.$store.dispatch('setShowLoginModal', true)
    },
    async logout() {
      try {
        const response = await axios.get('/api/auth/logout')

        this.$store.dispatch('setLoggedIn', false)
        this.$store.dispatch('setNotification', { isError: false, text: response.data.message })
      } catch (err) {
        this.$store.dispatch('setNotification', { isError: true, text: err.response.data.error })
      }
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: rgba(39, 39, 39, .95);
  color: white;
  padding: 1rem 5%;
  margin: 0 auto;
  box-shadow: rgba(20, 20, 20, 0.35) 0px 7px 29px 0px;
  font-weight: bold;
}

.logo {
  display: flex;
  flex-direction: column;
}

.menu {
  display: flex;
  gap: 2rem;
}

.menu span {
  cursor: pointer;
}

.hamburger {
  width: 2rem;
  height: 2rem;
  position: relative;
  display: none;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.bar {
  display: block;
  width: 80%;
  height: 4px;
  -webkit-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
  background-color: white;
}

@media screen and (max-width: 560px) {
  .logo a {
    display: flex;
    gap: .25rem;
  }

  .hamburger {
    display: flex;
  }

  .hamburger.active .bar:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active .bar:nth-child(1) {
    transform: translateY(.65rem) rotate(45deg);
  }

  .hamburger.active .bar:nth-child(3) {
    transform: translateY(-.65rem) rotate(-45deg);
  }

  .menu {
    position: fixed;
    left: -100%;
    top: 4rem;
    flex-direction: column;
    background-color: rgba(39, 39, 39, .95);
    width: 100%;
    height: 100%;
    text-align: center;
    transition: 0.3s;
    gap: 0;
  }

  .menu div {
    flex-direction: column;
    gap: 0 !important;
  }

  .menu a, .menu span {
    font-size: 1rem;
    padding: 1rem 0;
  }

  .menu.active {
    left: 0;
  }
}
</style>