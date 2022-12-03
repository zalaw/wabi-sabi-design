<template>

  <div class="view-container">
    <div v-if="loading" class="loader-container">
      <span class="loader"></span>
    </div>

    <div v-else class="testimonials">
      <h1>Testimonials</h1>

      <div class="rating">
        <h1>{{ getRating }}</h1>

        <div class="stars-outer">
          <div class="stars-inner" :style="`width: ${getRatingPercentage}%;`"></div>
        </div>
      </div>

      <div v-if="testimonials.length == 0">
        <h1>😭 There are no testimonials yet 😭</h1>
      </div>

      <div class="grid-container">
        <div class="testimonial" v-for="(testimonial, index) in testimonials" :key="index">
          <div style="display: flex; flex-direction: column; gap: .5rem;">
            <span style="font-size: .9rem; color: rgb(170, 170, 170)">{{ testimonial.name }}</span>

            <div>
              <i v-for="i in testimonial.rating" :key="`${testimonial._id}-${i}`" class="fas fa-star" style="color: #f8ce0b;"></i>
              {{ testimonial.rating }}
            </div>

            <p>{{ testimonial.body }}</p>
          </div>

          <div>
            <p style="font-size: .75rem; color: rgb(170, 170, 170)">{{ getDate(testimonial.createdAt) }}</p>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TestimonialsView',
  data() {
    return { 
      loading: false,
      testimonials: []
    }
  },
  async mounted() {
    this.loading = true 

    try {
      const response = await axios.get('/api/public/testimonials')
      this.testimonials = response.data.testimonials
      console.log(response)
    } catch (err) {
      this.$store.dispatch('setNotification', { isError: true, text: err.response.data.error })
    } finally {
      this.loading = false
    }
  },
  methods: {
    getDate(date) {
      return new Date(date).toLocaleString('ro-RO').split(',')[0]
    }
  },
  computed: {
    getRating() {
      var rating = 0

      this.testimonials.forEach(element => {
        rating += element.rating
      })

      const result = (rating / this.testimonials.length).toFixed(2)

      if (isNaN(result)) return ''
      else return result
    },
    getRatingPercentage() {
      return Math.round((this.getRating / 5) * 100)
    }
  }
}
</script>

<style scoped>

.grid-container {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  max-width: 80rem;
  width: 100%;
  padding: 0 1rem;
  justify-items: center;
}

.testimonials {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
}

.testimonial {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(55, 55, 55);
  border-radius: 1em;
  padding: 1rem 2rem;
  box-shadow: rgb(20 20 20 / 35%) 0px 7px 29px 0px;
  gap: .5rem;

  width: 100%;
}


.testimonial-name-and-rating {
  display: flex;
  justify-content: center;
  gap: .25rem;
}

.testimonial-rating::after {
  content: '\f005';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: #f8ce0b;
  padding: 0 .25rem;
}

.rating {
  font-size: 1rem;
  text-align: center;
}

.stars-outer {
  position: relative;
  display: inline-block;
  font-size: 2rem;
}

.stars-inner {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  width: 0;
}

.stars-outer::before {
  content: '\f005 \f005 \f005 \f005 \f005';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: #aaa;
}

.stars-inner::before {
  content: '\f005 \f005 \f005 \f005 \f005';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: #f8ce0b;
}
</style>