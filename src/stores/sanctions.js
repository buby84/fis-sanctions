import { defineStore } from 'pinia';
import {fetchSanctions} from '../services/apiService';
import {AVAILABLE_DISCIPLINES, CURRENT_SEASON} from '../globals';

export const useSanctionsStore = defineStore('sanctions', {
  state: () => ({
    sanctions: [],
    cachedSanctions: [],
    filters: {
      season: '',
      discipline: '',
      athleteName: ''
    },
    isLoading: false,
    loadingErrors: false
  }),
  actions: {

    /**
     * set filter and do search
     * @returns {Promise<*>}
     */
    setFilters(filters) {
      this.filters = filters;

      this.doSearch();
    },
    /**
     * With some caching logic, load sanctions from the API and set the sanctions state
     * and add app logic (max 20 result) and filter by name
     * @returns {Promise<*>}
     */
    async doSearch() {
      this.loadingErrors = false;
      this.isLoading = true;
      let results = [];
      let season = this.filters.season;
      if (season == '') {
        //season in api is by default is the current year in yyyy format
        season = CURRENT_SEASON;
      }

      let discipline = this.filters.discipline;
      if(discipline == ''){
        //take all disciplines and combine them
        for (let i = 0; i < AVAILABLE_DISCIPLINES.length; i++) {
          results = results.concat(await this.loadSanctions(AVAILABLE_DISCIPLINES[i].code, season));
        }
        //sort by time
        results.sort((a, b) => new Date(b.time) - new Date(a.time));
      }else{
        results = await this.loadSanctions(discipline, season);
      }



      //filter sanction for athlete name
      if (this.filters.athleteName && this.filters.athleteName.length > 0) {
        const nameParts = this.filters.athleteName.toLowerCase().split(' ');
        results= results.filter(sanction =>
            sanction.athlete &&
            nameParts.every(part =>
                (sanction.athlete.firstName && sanction.athlete.firstName.toLowerCase().includes(part)) ||
                (sanction.athlete.lastName && sanction.athlete.lastName.toLowerCase().includes(part))
            )
        );
      }

      //only first 20 sanctions
      this.sanctions = results.slice(0, 20);
      this.isLoading = false;
      this.loadingErrors = false;
    },
    /**
     * Load sanctions from the API
     * @param discipline
     * @param season
     * @returns {Promise<*>}
     */
    async loadSanctions(discipline, season) {
      let key = discipline + season;
      let results = [];
      if (this.cachedSanctions[key]) {
        results = this.cachedSanctions[key];
      } else {
        try {
          results = await fetchSanctions(discipline, season);
          results.forEach(sanction => {
            sanction.discipline = discipline;
            sanction.disciplineName = AVAILABLE_DISCIPLINES.find(d => d.code === discipline).description;
          });
          this.cachedSanctions[key] = results;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            console.log('Too many requests, waiting for 30 seconds...');

            this.loadingErrors = 'Server is busy, will try again soon...';
            await new Promise(resolve => setTimeout(resolve, 30000));
            return this.loadSanctions(discipline, season);
          } else {
            this.loadingErrors = error.message;
            this.isLoading = false;
            throw error;
          }
        }
      }
      return results;
    }
  }
});