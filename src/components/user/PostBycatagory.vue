<template>
    <div class="row">
      <div class="col-3">
        <h2 class="fw-light indigo" v-if="catagory_name == null ">Menu</h2>
        <h2 class="fw-light indigo" v-else>{{ catagory_name }}</h2>
        <ul class="nav flex-column" >
          <li class="nav-item" v-for="posts in post" :key="posts.id">
            <a class="nav nav-link link-dark " role="button" data-bs-toggle="button" @click="onclickTitle(posts.content)">{{ extractH1(posts.content) }}</a>
            <ul class="nav-item " v-if="extractH2(posts.content) !== null">
              <li > 
                <a class="nav nav-link link-dark" role="button" data-bs-toggle="button" @click="onclickTitle(posts.content)">{{ extractH2(posts.content) }}
                </a>
              </li>
            </ul>
          </li>
        </ul> 
      </div> 
      <div id="viewer" class="col-9"></div>  
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import cheerio from 'cheerio';
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
export default {
   created(){
    console.log("created working");
    this.getPostbycat();
   },
   mounted() {
    // this.viewer = new Viewer({
    //   el: document.querySelector("#viewer")!,
    //   initialValue: "<h1>Welcome</h1>",
    // });
  },
   data :():{post : any[],viewer : any,catagory_name : any} =>({
    post : [], 
    viewer : "",
    catagory_name :null
   }),
   methods :{
       async getPostbycat(){
        this.$store.commit('UPDATE_LOADING',true);
            var catagory = this.$route.params.id;
            let apiUrl = "https://interm-api.onrender.com/api/post/getbycatagory/"
           await axios.get(apiUrl+catagory)
            .then((res) =>{
              //  console.log(res.data);
              this.catagory_name = res.data[0].catagory.name;
              this.post = res.data;
              let contents = res.data[0].content
              this.viewer = new Viewer({
              el: document.querySelector("#viewer")!,
              initialValue: contents,
              })      
            })
            .catch((err) =>{
                console.log(err.response.data.message);
                console.log(err);  
            })  
            .finally(() =>  {
                this.$store.commit('UPDATE_LOADING',false)
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
        extractH2(htmlString : string) {
            const $ = cheerio.load(htmlString);
            const h2 = $('h2').text();
            if(h2 != ""){
            return h2;
            }else{
            return null
            }
        },
        async   onclickTitle(content : any){
         this.viewer = await new Viewer({
            el: document.querySelector("#viewer")!,
            initialValue: content,
          });
          console.log("click");
        }
   }
}
</script>