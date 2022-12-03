<template>
  <div class="main">
    <FullScreenImage
      v-if="imageSelectedIndex !== -1"
      @handleCloseFullScreenImage="imageSelectedIndex = -1"
      :images="images"
      :index="imageSelectedIndex"
    />

    <div class="main-container">
      <div id="home"></div>

      <section id="parallax-main-image" class="parallax">
        <div class="container">
          <div class="text-center main-title">
            <h1>Wabi Sabi Design</h1>
            <p>A beautiful room means a beautiful mind</p>
          </div>
        </div>
      </section>

      <section class="no-parallax steps-container">
        <div class="figure-container figure1">
          <div class="f1"></div>
          <div class="f2"></div>
          <div class="f3"></div>
          <div class="f4"></div>
        </div>

        <div class="container">
          <h1 class="section-heading">What we offer</h1>

          <div class="steps">
            <div v-for="(step, index) in steps" :key="index" class="step">
              <div class="step-content">
                <i :class="step.icon"></i>
                <h1>{{ step.title }}</h1>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </div>

          <h1 class="section-heading" style="margin-top: 4rem">Our projects</h1>

          <div v-if="images.length == 0">
            <h1 class="text-center">😭 There are no projects yet 😭</h1>
          </div>

          <div v-if="projects.length > 0" class="projects-container">
            <div id="projects"></div>

            <div v-for="(image, index) in images" :key="index" class="project">
              <div class="project-content">
                <img :src="image" @click="imageSelectedIndex = index" />
              </div>
            </div>
          </div>

          <div v-if="projects.length > 0" class="button-container-center">
            <router-link to="/projects">
              <Button v-if="images.length > 0" text="Browse all projects" />
            </router-link>
          </div>
        </div>
      </section>

      <section id="parallax-secondary-image" class="parallax">
        <div class="container">
          <h1 class="section-heading">What our clients think</h1>

          <div v-if="testimonials.length == 0">
            <h1 class="text-center">😭 There are no testimonials yet 😭</h1>
          </div>

          <div v-if="testimonials.length > 0" class="rating">
            <div class="stars-outer">
              <div class="stars-inner" :style="`width: ${getRatingPercentage}%;`"></div>
            </div>
          </div>

          <div v-if="testimonials.length > 0" class="clients-container">
            <div id="testimonials"></div>

            <div class="client text-center" v-for="(testimonial, index) in testimonials" :key="index">
              <p class="client-text">"{{ testimonial.body }}"</p>
              <p class="client-name">{{ testimonial.name }}</p>
            </div>
          </div>

          <div v-if="testimonials.length > 0" class="button-container-center">
            <router-link to="/testimonials">
              <Button v-if="totalTestimonials > 4" text="Browse all testimonials" />
            </router-link>
          </div>
        </div>
      </section>

      <section class="contact-area no-parallax">
        <div class="figure-container figure2">
          <div class="g1"></div>
          <div class="g2"></div>
          <div class="g3"></div>
        </div>

        <div class="figure-container figure3">
          <div class="mc">
            <div class="upper">
              <div class="c1"></div>
            </div>

            <div class="lower">
              <div class="c2"></div>
            </div>

            <div class="l1"></div>
            <div class="l2"></div>
            <div class="l3"></div>
            <div class="l4"></div>
          </div>
        </div>

        <div class="container">
          <h1 class="section-heading">Send us a message</h1>

          <div class="form-container">
            <div id="contact"></div>

            <form @submit.prevent="sendMessage">
              <div class="input-row-two-cols">
                <div class="input-row">
                  <label for="name">Name</label>
                  <div class="input-input">
                    <input
                      :class="{ 'input-invalid': messageSettings.nameError }"
                      :maxlength="messageSettings.nameMax"
                      v-model.trim="message.name"
                      @blur="messageSettings.nameError = false"
                      type="text"
                      id="name"
                      placeholder="Name"
                    />
                    <i
                      class="input-clear fas fa-times"
                      v-show="message.name.length !== 0"
                      @click="message.name = ''"
                    ></i>
                  </div>
                </div>

                <div class="input-row">
                  <label for="phone">Phone</label>
                  <div class="input-input">
                    <input
                      :class="{ 'input-invalid': messageSettings.phoneError }"
                      v-model.trim="message.phone"
                      @blur="(message.phone = message.phone.replaceAll(' ', '')), (messageSettings.phoneError = false)"
                      type="tel"
                      pattern="[0-9]{10}"
                      id="phone"
                      placeholder="Phone number"
                    />
                    <i
                      class="input-clear fas fa-times"
                      v-show="message.phone.length !== 0"
                      @click="message.phone = ''"
                    ></i>
                  </div>
                </div>
              </div>

              <div class="input-row">
                <label for="email">E-mail</label>
                <div class="input-input">
                  <input
                    :class="{ 'input-invalid': messageSettings.emailError }"
                    :maxlength="messageSettings.emailMax"
                    v-model.trim="message.email"
                    @blur="messageSettings.emailError = false"
                    type="mail"
                    id="email"
                    placeholder="We'll use this email provided here if we can't reach you via phone"
                  />
                  <i
                    class="input-clear fas fa-times"
                    v-show="message.email.length !== 0"
                    @click="message.email = ''"
                  ></i>
                </div>
              </div>

              <div class="input-row">
                <label for="message">Message</label>
                <div class="input-input">
                  <textarea
                    :class="{ 'input-invalid': messageSettings.messageError }"
                    :maxlength="messageSettings.messageMax"
                    v-model.trim="message.message"
                    @blur="messageSettings.messageError = false"
                    id="message"
                    rows="6"
                    placeholder="What is in your mind?"
                  >
                  </textarea>
                  <i
                    class="input-clear fas fa-times"
                    v-show="message.message.length !== 0"
                    @click="message.message = ''"
                  ></i>
                </div>
                <p>{{ message.message.length }} / {{ messageSettings.messageMax }}</p>
              </div>

              <div class="input-row submit-row">
                <p v-show="messageSettings.error" class="input-error-p">All fields must be filled in</p>
                <input
                  :class="{ 'button-disabled': messageSettings.buttonDisabled }"
                  type="submit"
                  :value="messageSettings.buttonText"
                />
              </div>
            </form>
          </div>

          <div>
            <h1 class="text-center">Or you can always reach out to us using the good old methods</h1>

            <div class="contact-methods">
              <div class="method">
                <i class="fas fa-phone-alt"></i>
                <p>+40 740 558 361</p>
              </div>

              <div class="method">
                <i class="fas fa-envelope"></i>
                <p>office.wabis@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Button from "../components/Button";
import FullScreenImage from "../components/FullScreenImage.vue";

export default {
  name: "MainView",
  components: {
    Button,
    FullScreenImage,
  },
  data() {
    return {
      imageSelectedIndex: -1,
      loggedIn: false,
      notification: {
        isError: false,
        message: "",
      },
      messageSettings: {
        buttonDisabled: false,
        buttonText: "Send",
        nameMax: 32,
        phoneMax: 10,
        emailMax: 64,
        messageMax: 200,
        nameError: false,
        phoneError: false,
        emailError: false,
        messageError: false,
        error: false,
        result: "",
      },
      message: {
        name: "",
        phone: "",
        email: "",
        message: "",
      },
      totalTestimonials: 0,
      testimonials: [],
      steps: [
        {
          _id: "9A09zZaL",
          title: "Surveying",
          description: "Traveling to the location and performing the measurements",
          icon: "fas fa-fw fa-map-marker-alt",
        },
        {
          _id: "PAL9ufaL",
          title: "2D projection",
          description: "Plan, snapshots, technical drawing, electrical plan",
          icon: "fas fa-fw fa-square",
        },
        {
          _id: "ZAs9ufaL",
          title: "3D projection",
          description: "Photorealistic images - 4/5 plane renderings",
          icon: "fas fa-fw fa-cube",
        },
        {
          _id: "PA01ufaL",
          title: "Project management",
          description: "Shopping list, store recomandations",
          icon: "fas fa-fw fa-tasks",
        },
        {
          _id: "LA09ufaD",
          title: "Site assistance",
          description: "",
          icon: "fas fa-fw fa-hands-helping",
        },
      ],
      images: [],
      totalProjects: 0,
      projects: [],
    };
  },
  async mounted() {
    try {
      const projectsResponse = await axios.get("/api/public/projects");

      console.log(projectsResponse);

      this.projects = projectsResponse.data.projects;

      this.projects.forEach(project => {
        this.images = [...this.images, ...project.images];
      });

      this.images = this.images.slice(0, 4);

      const response = await axios.get("/api/public/testimonials");

      this.testimonials = response.data.testimonials.slice(0, 4);
      this.totalTestimonials = response.data.testimonials.length;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    validateField(field, fieldError) {
      if (field === "") {
        this.messageSettings[fieldError] = true;
        this.messageSettings.error = true;
      }
    },
    async sendMessage() {
      this.messageSettings.error = false;

      this.validateField(this.message.name, "nameError");
      this.validateField(this.message.phone, "phoneError");
      this.validateField(this.message.email, "emailError");
      this.validateField(this.message.message, "messageError");

      if (this.messageSettings.error) return;

      try {
        this.messageSettings.buttonDisabled = true;
        this.messageSettings.buttonText = "Sending...";

        const response = await axios.post("/api/public/send-message", this.message);

        this.$store.dispatch("setNotification", { isError: false, text: response.data.message });

        this.message.name = "";
        this.message.phone = "";
        this.message.email = "";
        this.message.message = "";
      } catch (err) {
        this.$store.dispatch("setNotification", { isError: true, text: err.message });
      } finally {
        this.messageSettings.buttonDisabled = false;
        this.messageSettings.buttonText = "Send";
      }
    },
  },
  computed: {
    getRating() {
      var rating = 0;

      this.testimonials.forEach(element => {
        rating += element.rating;
      });

      return (rating / this.testimonials.length).toFixed(2);
    },
    getRatingPercentage() {
      return Math.round((this.getRating / 5) * 100);
    },
  },
};
</script>

<style scoped>
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
  content: "\f005 \f005 \f005 \f005 \f005";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  color: #aaa;
}

.stars-inner::before {
  content: "\f005 \f005 \f005 \f005 \f005";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  color: #f8ce0b;
}
</style>
