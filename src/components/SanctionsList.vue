<template>

  <SanctionsFilter @filter="applyFilter"/>
  <p v-if="loadingErrors">{{ loadingErrors }}</p>
  <div v-if="isLoading" class="loading-icon">
    <p>Loading Sanctions...</p>
  </div>
  <div v-else-if="sanctions && sanctions.length">
    <ul>
      <li v-for="sanction in sanctions" :key="sanction.id" class="sanction-card">
        <div class="sanction-card__header">
          {{ sanction.disciplineName }}
        </div>
        <div class="sanction-card__body">
          <div class="sanction-card__column">
            <AthleteInfo :athlete="sanction.athlete"/>
          </div>
          <div class="sanction-card__column">
            <p>{{ sanction.competitionSummary?.date }} - {{ sanction.competitionSummary?.place }} - ({{ sanction.competitionSummary?.placeNationCode }})</p>
            <p>{{ sanction.competitionSummary?.categoryCode }}</p>
          </div>
          <div class="sanction-card__column">
            <p>{{ sanction.violations[0]?.name }}</p>
            <p>{{ sanction.sanctions[0]?.title }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {useSanctionsStore} from '../stores/sanctions';
import SanctionsFilter from './SanctionsFilter.vue';
import AthleteInfo from './AthleteInfo.vue';
import {mapState, mapActions} from 'pinia';

export default {
  components: {SanctionsFilter, AthleteInfo},
  computed: {
    ...mapState(useSanctionsStore, ['sanctions', 'filters', 'isLoading','loadingErrors'])
  },
  methods: {
    ...mapActions(useSanctionsStore, ['doSearch', 'setFilters']),
    applyFilter(filters) {
      this.setFilters(filters);
    }
  },
  created() {
    this.doSearch();
  }
};
</script>