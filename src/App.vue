<template>
  <div id="overlay" v-if="loading == true">
    <div class="position-absolute top-50 start-50 translate-middle">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
 
  <router-view style="min-height: 100vh;"></router-view>
 
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
export default defineComponent({
  setup() {
    return {};
  },
  created() {
    console.log(this.$store.state.loading);
  },
  computed: {
    ...mapState({
      loading: (state: any) => state.loading,
    }),
  },
});
</script>
<style>
#overlay {
  position: fixed;
  /* display: none; */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color:#eeeaf7;
  z-index: 10;
  cursor: pointer;
}
</style>
