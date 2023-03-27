<template>
  <h1>text-small</h1>
<div class="row"> 
    <div id="app" class="col-4" >
    <ul >
      <li v-for="posts in post" :key="posts.id">
        <router-link :to="`user/detail/${posts._id}`" >{{ extractH1(posts.content)}}</router-link>
      </li>
    </ul>
  </div>
    <div class="col-8">
        <router-view></router-view>
    </div>
</div>
 
</template>
<script lang="ts">
import axios from "axios";
import cheerio from 'cheerio';

export default {
  created() {
    console.log("created working");
    this.getPostbycat();
  },
  data: (): { post: any[]; viewer: any } => ({
    post: [],
    viewer: null,
  }),
  methods: {
    async getPostbycat() {
      let apiUrl =
        "http://localhost:4040/api/post/getbycatagory/63eb45eb318da58c0e924ac8";
      await axios
        .get(apiUrl)
        .then((res) => {
          this.post = res.data;
          console.log(res);
        })
        .catch((err) => {
          console.log(err.response.data.message);
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
        }
  },
};
</script>
