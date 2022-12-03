<template>
  <div class="not-found">
    <div style="position: relative; z-index: 10;">
      <h1>4😰4</h1>
      <p>Oops! Page cannot be found</p>
      <router-link class="rl" to="/">Back to main page</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.rl {
  display: inline-block;
  margin-top: 1em;
  font-size: .5em;
  background-color: #5b92e5;
  padding: .75em 1.5em;
}

.not-found {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-size: 2em;
  padding: 0 2rem;
  background-image: url('@/assets/img/not-found.jpg');
  background-size: cover;
  background-position: center;
}

.not-found::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, .65);
}
</style>