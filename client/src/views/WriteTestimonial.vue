<template>
  <div v-if="loaded" class="view-container">
    <div v-if="!valid" class="not-valid">
      <h1>{{ errorMessage }}</h1>
    </div>

    <div v-else class="write-testimonial">
      <h1 class="text-center">Your opinion is very valuable to us</h1>

      <div class="testimonial-textarea">
        <div class="input-row">
          <label for="name">Name</label>
          <div class="input-input">
            <input maxlength="32" type="text" id="name" placeholder="Name" v-model.trim="testimonial.name" />
            <i class="input-clear fas fa-times" v-show="testimonial.name.length !== 0" @click="testimonial.name = ''"></i>
          </div>
        </div>

        <div class="input-row">
          <label for="name">Message</label>
          <div class="input-input">
            <textarea maxlength="100" rows="4" placeholder="Write your short opinion here" v-model.trim="testimonial.body"></textarea>
            <i class="input-clear fas fa-times" v-show="testimonial.body.length !== 0" @click="testimonial.body = ''"></i>
          </div>
          <p>{{ testimonial.body.length }} / {{ messageMax }}</p>
        </div>
      </div>

      <div class="stars-container">
        <div class="stars">
          <i @click="testimonial.rating = i" v-for="i in 5" :key="i" class="fas fa-star" :class="{ 'active': i <= testimonial.rating }"></i>
        </div>
        <div class="emoji">
          <p>{{ emoji[testimonial.rating] }}</p>
        </div>
      </div>

      <div>
        <Button @click.native="sendTestimonial" :disabled="testimonial.name == '' || testimonial.message == '' || testimonial.rating == 0" :text="buttonText" />
      </div>
    </div>  
    

  </div>
</template>

<script>
import axios from 'axios'

import Button from '../components/Button.vue'

export default {
  name: 'WriteTestimonialView',
  components: {
    Button
  },
  data() {
    return {
      loaded: false,
      valid: false,
      emoji: [ '🤔', '😭', '😩', '😶', '🙂', '🥰' ],
      errorMessage: '',
      testimonial: {
        name: '',
        body: '',
        rating: 0,
        token: this.$route.params.token
      },
      messageMax: 100,
      buttonDisabled: true,
    } 
  },
  methods: {
    async sendTestimonial() {
      try {
        const response = await axios.post('/api/public/post-testimonial', this.testimonial)
        this.$store.dispatch('setNotification', { isError: false, text: response.data.message })
        this.valid = false
        this.errorMessage = response.data.additionalMessage
      } catch (err) {
        this.$store.dispatch('setNotification', { isError: true, text: err.response.data.error })
      }
    }
  },
  async mounted() {
    try {
      await axios.get('/api/public/check-testimonial-token', { params: { token: this.$route.params.token }})
      this.valid = true
    } catch (err) {
      this.valid = false
      this.errorMessage = err.response.data.error
    } finally {
      this.loaded = true
    }
  },
  computed: {
    buttonText() {
      if (this.testimonial.name == '') return 'Please fill in your name'
      if (this.testimonial.body == '') return 'Please fill in your message'
      if (this.testimonial.rating == 0) return 'Please pick a rating'

      return 'Submit'
    }
  }
}
</script>

<style scoped>

.emoji {
  font-size: 3rem;
  display: flex;
  justify-content: center;
}

button:disabled {
  cursor: not-allowed;
  background-color: gray !important;
  border-color: gray !important;
}

.active {
  color: #f8ce0b;
}

.write-testimonial {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding-right: 1rem;
  padding-left: 1rem;
  padding-bottom: 2rem;
}

.testimonial-textarea {
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.testimonial-textarea textarea {
  max-width: 100%;
  min-width: 100%;
  font-family: 'Poppins', sans-serif;
}

.stars-container {
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stars-container i {
  cursor: pointer;
}

.stars {
  display: flex;
}

.not-valid {
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
}

@media screen and (max-width: 480px) {
  .stars {
    gap: .5rem;
  }
  .emoji {
    font-size: 2rem;
  }
}
</style>