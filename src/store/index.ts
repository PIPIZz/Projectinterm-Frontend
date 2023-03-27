import { createStore } from 'vuex'

export default createStore({
  state: {
    loading : false
  },
  getters: {
  },
  mutations: {
    UPDATE_LOADING(state , status){
      state.loading = status;
      console.log('UPDATE_LOADING Working');
      
    }

  },
  actions: {
    update_loading({commit} , status){
      commit('UPDATE_LOADING',status)
    }
  },
  modules: {
  }
})
