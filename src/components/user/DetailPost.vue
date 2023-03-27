<template>
  <div class="row">
    <div class="col-8">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item "><router-link :to="`/user/home`" class="link-dark">Home</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Post</li>
          </ol>
        </nav>
      </div>
      <div id="viewer" class="pb-4"></div>
    </div>
    <div class="col-4">
      <div class="p-2">
        <ol class="list-group border-dark" >
          <li class="list-group-item d-flex justify-content-between align-items-start border-dark"  style="background-color: #;">
            <div class="ms-2 me-auto text-capitalize">
              <div class="fw-bold ">Author</div>
              <i class="bi-person"></i> {{ author }}
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start border-dark" style="background-color: #;" >
            <div class="ms-2 me-auto text-capitalize">
              <div class="fw-bold">Catagory</div>
              <!-- <i class="bi-book "></i>  {{ catagory_name }} -->
              <a  :href="`/user/catagory/${catagory_id}`" class="nav-link px-2 link-dark " ><i class="bi-book"></i> {{ catagory_name }}</a >
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start border-dark" style="background-color: #;" >
            <div class="ms-2 me-auto text-capitalize">
              <div class="fw-bold">Tags</div>
              <div v-for="tag in tags" :key="tag._id">
                <a  :href="`/user/search/${tag._id}`" class="nav-link px-2 link-dark" ><i class="bi-tag"></i> {{ tag.name }}</a >  
              </div>
            </div>
          </li>
        </ol>
      </div>
      <div class="p-2">
        <div class="pb-2">
          <div class="card border-dark" style="background-color: #EEF1FF;">
            <div class="card-body">
              <h5 class="card-title">Comments</h5>

              <div class="row p-2"  v-for="comments , index in (showLess ? Comments : Comments.slice(0, 5))" :key="index">
                <div class="inline-flex text-start p-2 badge text-wrap text-dark " style="background-color: #D2DAFF " >
                    <div v-if="comment_idEdit == comments._id" >
                      <form  class="p-2" >
                        <div class="form-floating">
                          <textarea class="form-control"  id="floatingTextarea" style="height: 100px" v-model="comments.text" v-show="comments.text"></textarea>
                          <label for="floatingTextarea">Comments here!!</label>
                        </div> 
                        <div class="row justify-content-md-end p-2" v-if="comments.author_id == this.author_id">
                        <div class="col-auto link-success" role="button" @click="OncliclSaveEdit(comments.text,comments._id)" >บันทึก</div> 
                      </div>
                      </form>
                    </div> 
                    
                    <div v-else>
                      <div class="">
                        <p class="fw-bold h5 text-capitalize"><i class="bi-person-bounding-box p-2" style="font-size: 2rem; color: cornflowerblue;"></i> {{ comments.author_name }} </p>
                        <p class="fw-normal p-2 h6" >{{ comments.text }}</p> 
                          <div class="row justify-content-md-end" v-if="comments.author_id == this.author_id">
                            <div  class="col-auto link-success"  role="button" @click.prevent="OnClickEdit(comments._id)">Edit </div> 
                            <div  class="col-auto link-danger" role="button" @click="OncommentsDelete(comments._id)">Delete</div>
                          </div>
                      </div>
                    </div>      
                </div>     
              </div> 
                <div class="row justify-content-md-end" >
                  <div v-if="Comments.length == 0"></div>
                  <div v-else class="col-auto" role="button" @click="showLess = true">more</div>
                </div>
            </div>
            <form @submit.prevent="OnComment" class="p-2" >
              <div class="form-floating ">
                <textarea class="form-control border-dark" placeholder="Comment here" id="floatingTextarea" style="height: 100px" v-model="comment"></textarea>
                <label for="floatingTextarea">Comments here!!</label>
              </div> 
                <div class="row justify-content-md-end p-2" >
                    <button  class="col-auto btn btn-outline-success"   role="button" >send</button> 
                </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import axios, { AxiosRequestConfig } from "axios";
import cheerio from "cheerio";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";

export default {
  created() {
    console.log("Created work");
    this.getPost();
    var author = JSON.parse(localStorage.getItem("profile") || "");
    this.author_id = author.id;
    this.getComment();
  },
  data: (): { post: any; viewer: any,tags :any[],author : any, catagory_name :any , catagory_id :any ,Comments : any[],comment_idEdit :any,comment:any,author_id:any,showLess : boolean} => ({
    post: null,
    viewer: null,
    tags : [],
    author : null,
    catagory_name : null,
    catagory_id : null,
    Comments :[],
    comment_idEdit :"",
    comment :"",
    author_id :"",
    showLess : false
  }),
  methods: {
   async getPost(){
      var id = this.$route.params.id;
      // var id = "1111111111111111"
      let apiUrl = "http://localhost:4040/api/post/getdetail/";
      await axios
        .get(apiUrl + id)
        .then((res) => {
          // this.post = res.data;
           console.log(res.data);
          this.tags = res.data.tbl_tags;
          this.author = res.data.author.name;
          this.catagory_name = res.data.catagory.name;
          this.catagory_id = res.data.catagory._id;
          this.viewer = new   Viewer({
            el: document.querySelector("#viewer")!,
            initialValue: res.data.content,
          });
          
        })
        .catch((err) => {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        });
    },
    async getComment(){
      var post_id = this.$route.params.id;
      let apiUrl = "http://localhost:4040/api/post/getcommentbyid";
     await  axios.post(apiUrl,{post_id})
      .then((res) => {
          this.comment ="";
          this.comment_idEdit = "";
          this.Comments = res.data; 
        })
        .catch((err) => {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        });
    },
    OnComment(){
      console.log('OnComment Working');   
      var text = this.comment;
      if(text){     
        var author = JSON.parse(localStorage.getItem("profile") || "");
        var author_id = author.id;
        const post_id = this.$route.params.id;
        
        let apiUrl = "http://localhost:4040/api/comments/create";
        axios.post(apiUrl,{text,author_id})
        .then((res) => {
          let comment_id = res.data.id;
          console.log(comment_id);
          console.log(res.data);
          axios.put("http://localhost:4040/api/post/addcomments",{post_id,comment_id})
          .then((res) =>{
            console.log(res.data);
            this.getComment();
          })
        })
        .catch((err) =>{
          console.log(err.response.data.message);
          alert(err.response.data.message);
        })
      }

    },
    OncommentsDelete(id : string){
      var comment_id = id;  
      let apiUrl ="http://localhost:4040/api/comments/delete/"
      axios.delete(apiUrl+comment_id)
      .then((res) =>{
        console.log(res); 
        const post_id = this.$route.params.id;
        const requestConfig: AxiosRequestConfig = {};
        requestConfig.data = { post_id: post_id,comment_id:comment_id };
        let apiUrl ="http://localhost:4040/api/post/deletecomment"
        axios.delete(apiUrl,requestConfig)
        .then((res) =>{
          this.getComment();
        })
        .catch((err) =>{
          console.log(err.response.data.message);
          alert(err.response.data.message);
        })
      })
      .catch((err) =>{
        console.log(err.response.data.message);
        alert(err.response.data.message);
      })
    },
    OnClickEdit(id : string){
      if (id) {
        this.comment_idEdit = id;
        this.$nextTick(() => {
          if (this.$refs["comments" + id]) {
            this.$refs["comments" + id][0].focus();
          }
        });
      } else {
        this.comment_idEdit = null;
      }
    },
    OncliclSaveEdit(text : string,id :string){
      console.log(text);
      let apiUrl = "http://localhost:4040/api/comments/update"
      axios.put(apiUrl,{id,text})
      .then((res) =>{
        this.getComment();
      })
      .catch((err) =>{
        console.log(err.response.data.message);
        alert(err.response.data.message);
      })
    }
  },
};
</script>
