<template>
  <button :class="buttonClass">{{ text }}</button>
</template>

<script>
export default {
  name: 'ButtonComponent',
  props: {
    text: String,
    buttonClass: Array
  }
}
</script>


<style scoped>
button {
  padding: .5em 1.5em;
  border: none;
  font-size: 1em;
  cursor: pointer;
  border-radius: .5rem;
  font-weight: bold;
  color: rgb(33, 33, 33);
  transition: .3s all ease-in-out;
  border: 4px solid white;
}

button:hover {
  background-color: transparent;
  color: white;
}

.button-action {
  padding: .25rem .5rem !important;
  font-size: .9em !important;
}

.button-action.primary {
  background-color: #5b92e5 !important;
  border-color: #5b92e5 !important;
  color: white;
}

.button-action.primary:hover {
  background-color: transparent !important;
}

.button-action.critical {
  background-color: #AE0A0A !important;
  border-color: #AE0A0A !important;
  color: white !important;
}

.button-action.critical:hover {
  color: #AE0A0A !important;
  background-color: transparent !important;
}

.button-action.good {
  background-color: #5b92e5 !important;
  border-color: #5b92e5 !important;
  color: white !important;
}

.button-action.good:hover {
  color: #5b92e5 !important;
  background-color: transparent !important;
}
</style>