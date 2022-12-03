<template>
  <div class="root">
    <Navbar />
    <LoginModal v-if="showLoginModal" />
    <NotificationToast />

    <router-view />
  </div>
</template>

<script>
import axios from "axios";

import Navbar from "./components/Navbar.vue";
import LoginModal from "./components/LoginModal.vue";
import NotificationToast from "./components/NotificationToast.vue";

export default {
  name: "App",
  components: {
    Navbar,
    LoginModal,
    NotificationToast,
  },
  async mounted() {
    try {
      console.log(process.env.NODE_ENV);
      const response = await axios.get("/api/public/logged-in");

      this.$store.dispatch("setLoggedIn", response.data.loggedIn);
    } catch (err) {
      console.error(err);
    }
  },
  computed: {
    showLoginModal() {
      return this.$store.getters.getShowLoginModal;
    },
  },
};
</script>

<style></style>
