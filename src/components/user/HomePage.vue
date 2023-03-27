<template>
  <div class="row" >
    <div>
    <img src="../../assets/new-post.png" class="pb-2" style="height: auto; width: auto;">
    <!-- <h1 class="fw-light indigo">New post</h1> -->
  </div>
    <div class="col-9">
      <div class="row row-cols-1 row-cols-md-3 g-4 p-2">
        <div class="col"  v-for="posts in (showLess ? post : post.slice(0,15))" :key="posts.id" >
          <div class="card border-dark " style="max-width: 18rem ;height: 10rem;">
            <div class="card-body" >
                <h5 class="crop-text-2 title">{{ extractH1(posts.content) }}</h5>         
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <router-link class="badge rounded-pill bg-success font-monospace" role="button" :to="`/user/detail/${posts._id}`">more</router-link>   
                </div>
            </div>
            <div class="card-footer border-dark" >
              <small class="text-dark" v-for="tags in posts.tbl_tags.slice(0,3)" :key="tags.id"><i class="bi-tag p-1"></i>{{ tags.name }} </small>
            </div>
          </div>
        </div>
      </div>
      <div class=" col-md-6 offset-md-3  row justify-content-center mt-2" role="button" @click="showLess = true" >
       <button  class="btn btn-outline-dark font-monospace  col-4">Show More</button>
      </div>
    </div>
    <div class="col-3">
      <div class="row row-cols-1 row-cols-md-2 g-4">
        <div class="col-md-auto">
          <div class="card border-dark" style="width: 18rem ;" >
            <div class="card-header border-dark">Tags</div>
            <ul class="list-group list-group-flush"  >
              <li class="list-group-item " v-for="tags in tag" :key="tags.id" >
                <router-link :to="`/user/search/${tags.id}`" class="nav-link link-dark" ><i class="bi-tag"></i> {{ tags.name }} </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
import cheerio from 'cheerio';
export default defineComponent({
  created() {
    this.getallPost();
    this.getallTags();
    this.getTags()
  },
  data: (): {
    post: any[];
    tag: any;
    search :any
    tagsList:any[]
    showLess :boolean
  } => ({
    post: [],
    tag: null,
    tagsList:[],
    search:"",
    showLess : false
  }),
  computed: { 
      filteredList(){ 
      if(this.search){
          return this.tagsList.filter((tagList: { name: string; }) => {
            return tagList.name.toLowerCase().includes(this.search.toLowerCase())
        })
      }else{
        return null
      }
   },
   
  },  
  methods: {
    async getallPost() {
      this.$store.commit('UPDATE_LOADING',true)
      let apiUrl = "http://localhost:4040/api/post/getall";
      await axios
        .get(apiUrl)
        .then((res) => {
          this.post = res.data;
        })
        .catch((err) => { 
          console.log(err);
        })
        .finally(() =>  {
          setTimeout(() => {
             this.$store.commit('UPDATE_LOADING',false)
          },1000)
        })
    },
    async getTags() {
      let apiUrl = "http://localhost:4040/api/tags/tag";
      await axios
        .get(apiUrl, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        })
        .then((res) => {
          this.tag = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getallTags() {
      let apiUrl = "http://localhost:4040/api/tags/getall";
      await axios
        .get(apiUrl, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        })
        .then((res) => {
          this.tagsList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    extractH1(htmlString : string) {
      const $ = cheerio.load(htmlString);    
      const h1 = $('h1').text();
      if(h1 != ""){
        return h1;
      }else{
         return "Unknown Title"
      }
    }, 
  }
});
</script>

<style>

.crop-text-2 {
  -webkit-line-clamp: 2;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
