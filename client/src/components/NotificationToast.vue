<template>
  <div :class="{ 'notification-error': notification.isError, 'active': notification.text !== '' }" class="notification-toast" v-html="formatedText">

  </div>
</template>

<script>
export default {
  name: 'NotificationToastComponent',
  watch: {
    notification: {
      handler() {
        setTimeout(() => {
          this.$store.dispatch('setNotification', { isError: false, text: '' })
        }, this.getMinNotificationTime(parseInt(this.notification.text.length) * 120))
      },
      deep: true
    }
  },
  methods: {
    getMinNotificationTime(time) {
      return time < 2500 ? 2500 : time
    }
  },
  computed: {
    notification() {
      return this.$store.getters.getNotification
    },
    formatedText() {
      return this.notification.text.split('\n').map(x => `<p>${x}</p>`).join('')
    }
  }
}
</script>


<style scoped>
.notification-toast {
  position: fixed;
  bottom: -100%;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #3F7F39;
  padding: 1rem 2rem;
  z-index: 10000;
  -webkit-transition: all .4s ease-in-out;
  transition: all .6s ease-in-out;
  border-radius: .5rem;
  color: white;
  max-width: 320px;
  width: 100%;
}

.notification-toast.active {
  bottom: 1rem;
}

.notification-error {
  background-color: #AE0A0A !important;
}
</style>