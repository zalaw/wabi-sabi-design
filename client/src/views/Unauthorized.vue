<template>
  <div class="unauthorized">
    <div style="position: relative; z-index: 10;">
      <h1>👮‍♂️ Stop right there!</h1>
      <p>You don't have access to this resource</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnauthorizedView'
}
</script>

<style scoped>
.unauthorized {
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
  background-image: url('@/assets/img/unauthorized.jpg');
  background-size: cover;
  background-position: center;
}

.unauthorized::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, .65);
}
</style>