<template>
  <div class="container">
    <div class="row justify-content-between">
      <h1 class="fw-light col-4">My Post</h1>
      <div class="col-4">
        <br />
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <router-link to="addpost" class="btn btn-info me-md-2 opacity-40" ><i class="bi-pencil-square "></i> Write Post</router-link>
        </div>
      </div>
    </div>
    <div class="row">
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Title</th>
      <th class="col-3"></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="post , index in allPost" :key="post.id">
      <th scope="row">{{ index+1 }}</th>
      <td>{{ extractH1(post.content) }}</td>
      <td > 
        <div class="row justify-content-around"> 
            <router-link class="btn btn-primary col-4 " :to="`/user/editpost/${post.id}`"><i class="bi-pen"></i> Edit Post</router-link> 
        <button class="btn btn-danger col-4" @click.prevent="onclickDelete(post.id)" ><i class="bi-trash3-fill"></i> Delete</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
    </div>
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import cheerio from 'cheerio';
import router from '@/router';

export default {
   created(){
    console.log('created work');
    this.getAllPost();
   },
  
   data:():{allPost : any} =>({
        allPost : null, 

   }),
   methods : {
      async  getAllPost(){
            this.$store.commit('UPDATE_LOADING',true);
            var profiles = JSON.parse(localStorage.getItem("profile") || "");
            let apiUrl = 'https://interm-api.onrender.com/api/post/getallbyid/';
           await axios.get(apiUrl+profiles.id)
            .then((res) => {
                this.allPost = res.data
                console.log(res);
            })
            .catch((err) =>{
                console.log(err.response.data.message); 
            })  
            .finally(() =>  { 
                this.$store.commit('UPDATE_LOADING',false);           
            })
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
        onclickDelete(id : string){
          let apiUrl = 'https://interm-api.onrender.com/api/post/delete/';
            axios.delete(apiUrl+id)
            .then((res) => {
                alert("Delete Success")
                router.push({path : '/user/post'}).then(() => { this.$router.go() })
            })
            .catch((err) =>{
                console.log(err); 
            })
        }
   }
}
</script>
