<template>
  <div>
    <input v-model="filters.season" placeholder="Season" @input="updateFilter" :max="currentSeason" :min="2000" type="number"/>

    <select v-model="filters.discipline" @change="updateFilter">
      <option value="">All Discipline</option>
      <option v-for="discipline in availableDisciplines" :key="discipline.code" :value="discipline.code">
        {{ discipline.description }}
      </option>
    </select>
    <input v-model="filters.athleteName" placeholder="Athlete Name" @input="updateFilter" />
  </div>
</template>

<script>
import { AVAILABLE_DISCIPLINES,CURRENT_SEASON } from '../globals';
export default {
  data() {
    return {
      filters: {
        season: '',
        discipline: '',
        athleteName: ''
      },
      availableDisciplines: AVAILABLE_DISCIPLINES,
      currentSeason: CURRENT_SEASON
    };
  },
  methods: {
    updateFilter() {
      this.$emit('filter', this.filters);
    }
  }
};
</script>