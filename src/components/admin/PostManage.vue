<template>
  <h1>Post Manage</h1>
  <div id="app">
    <div>
      <div class="row justify-content-between">
        <div class="col-4">
          <router-link to="/addpost" class="btn btn-outline-success">
            Add Post</router-link
          >
        </div>
        <div class="col-4">
          <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="table">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <!-- <th scope="col">Post</th> -->
            <th scope="col">Content</th>
            <th scope="col">Catagory</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in info" :key="index">
            <td>{{ index }}</td>
            <td>{{ post.content }}</td>
            <td>{{ post.catagory_id }}</td>
            <td class="row">
              <div class="col-4">
                <router-link to="/" class="btn btn-outline-success justify">Edit</router-link>
              </div>
              <div class="col-4">
                <button class="btn btn-outline-danger justify" @click.prevent="onDelete(post._id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, reactive } from "vue";
import { IPost } from "@/interface/post";

export default defineComponent({
  data() {
    const  onDelete = async (id : any) => {
    axios.get("https://interm-api.onrender.com/api/post/getall",id).then((response) => {
      console.log(id);
     
    }).catch((err) =>{
      console.log(err);
    })
  } 
    return {
      info: null,
      onDelete 
    };
  },
  mounted() {
    axios.get("https://interm-api.onrender.com/api/post/getall").then((response) => {
      this.info = response.data;
    });
  },
    
});
</script>
