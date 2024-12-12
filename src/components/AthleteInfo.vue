<template>
  <div v-if="athlete">
    <h3>{{ athlete.firstName }} {{ athlete.lastName }} ({{ athlete.birthYear }})</h3>
    <p>Nation: {{ athlete.nationCode }}</p>
    <p>Gender: {{ athlete.gender }}</p>
    <p>FIS Code: {{ athlete.fisCode }}</p>
  </div>
</template>

<script>
export default {
  props: {
    athlete: {
      type: Object,
      required: true
    }
  }
};
</script>