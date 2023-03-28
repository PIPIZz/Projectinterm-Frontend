<template>
  <div class="" style="background-color: #F5F5F5;">
  <nav
    class="navbar navbar-dark navbar-expand-lg d-flex flex-wrap align-items-center justify-content-center  py-2 mb-2 border-bottom bg-dark"  
   style="width:auto;">
  <div class="container-xl">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbars" aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse p-2" id="navbars">  
          <ul  class="navbar-nav me-auto mb-2 mb-lg-0">
            <li>
              <router-link :to="`/user/home`" class="nav-link link-light"
                ><i class="bi-house-door p-2" style="font-size: 2rem;"></i>Home</router-link
              >
            </li>    
            <li class="dropdown p-2">
              <a
                href="#"
                class="d-block link-light text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi-file-earmark-richtext" style="font-size: 2rem;"></i> Catagory
              </a>
              <ul class="dropdown-menu text-small" style="">
                <li v-for="catagory in catagories" :key="catagory.id">
                  <a
                    :href="`/user/catagory/${catagory.id}`"
                    class="nav-link px-2 link-dark"
                    ><i class="bi-file-earmark-richtext p-2"></i
                    >{{ catagory.name }}</a
                  >
                </li>
              </ul>
            </li> 
          </ul>

        <div class="row justify-content-end">
          <ul  class="navbar-nav me-auto mb-2 mb-lg-0 ">
            <li class="col align-self-center">
              <div class="input-group ">
              <span class="input-group-text"><i class="bi-search" ></i></span>
              <input  class="form-control " data-bs-toggle="dropdown" type="text" v-model="txt_search" placeholder="Search" >
              <div>
                <ul class="dropdown-menu" style="position: absolute;" >
                    <li  v-for="tagList in filteredList" :key="tagList.id" >
                      <a :href="`/user/search/${tagList.id}`" class="dropdown-item"><i class="bi-tag"></i> {{ tagList.name }}</a>
                    </li>

                  <li v-for="catagory in filteredListCat" :key="catagory.id">
                    <a  :href="`/user/catagory/${catagory.id}`"  class="dropdown-item"><i class="bi-postcard"></i> {{ catagory.name }}</a>
                  </li>
              
                  <li  v-for="postLists in filteredListContent"  :key="postLists._id">
                    <a :href="`/user/detail/${postLists._id}`" class="dropdown-item"><i class="bi-file-earmark-richtext"></i> {{extractH1(postLists.content) }}</a>
                  </li>
                </ul>  
              </div> 
            </div> 
            </li>
            <li>
                <router-link
                  :to="`/user/addpost`"
                  class="nav-link  link-light"
                  ><i class="bi-pencil-square p-2" style="font-size: 2rem;"></i>Write</router-link
                >
            </li>
            <li class="dropdown p-2">
                <a
                  href="#"
                  class="d-block link-light text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi-person" style="font-size: 2rem;"></i> {{ profile.email }}
                </a>
                <ul class="dropdown-menu text-small" style="">
                  <li>
                    <router-link :to="`/user/post`" class="dropdown-item"
                      ><i class="bi-box-seam"></i> My Post</router-link
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a href="" class="dropdown-item" @click.prevent="isLoggedOut"
                      ><i class="bi-box-arrow-right"></i> Sign out</a
                    >
                  </li>
                </ul>
            </li>
          </ul>
        </div> 
    </div>
  </div>
</nav>

  <div class="container mt-5" >
    <router-view></router-view>
  </div>
</div>
</template>
<script lang="ts">
import axios from "axios";
import router from "@/router";
import cheerio from "cheerio";
export default {
  created() {
    this.getAllCatagory();
    this.getallTags();
    this.getallPost();
    this.profiles = JSON.parse(localStorage.getItem("profile") || "");
  },
  data: (): {
    catagories: any;
    txt_search: any;
    tagsList: any[];
    postList: any[];
    catagoryList: any[];
    toggle :boolean;
    profile : any[]
  } => ({
    catagories: null,
    txt_search: "",
    tagsList: [],
    postList: [],
    catagoryList: [],
    toggle : false,
    profile : []
  }),
  computed: {
    filteredList() {
      if (this.txt_search) {
        return this.tagsList.filter((tagList: { name: string }) => {
          return tagList.name
            .toLowerCase()
            .includes(this.txt_search.toLowerCase());
        });
      } else {
        return null;
      }
    },
    filteredListContent() {
      if (this.txt_search) {
        return this.postList.filter((postList: { content: string }) => {
          return postList.content
            .toLowerCase()
            .includes(this.txt_search.toLowerCase());
        });
      } else {
        return this.postList.slice(0,5);
      }
    },
    filteredListCat() {
      if (this.txt_search) {
        return this.catagoryList.filter((catList: { name: string }) => {
          return catList.name
            .toLowerCase()
            .includes(this.txt_search.toLowerCase());
        });
      } else {
        return null;
      }
    },
  },
  methods: {
    getAllCatagory() {
      let apiUrl = "https://interm-api.onrender.com/api/catagory/getall";
      axios
        .get(apiUrl)
        .then((res) => {
          this.catagories = res.data;
          this.catagoryList = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    },
    isLoggedOut() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("profile");
      return router.push({ path: "/login" });
    },
    async getallTags() {
      let apiUrl = "https://interm-api.onrender.com/api/tags/getall";
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
    async getallPost() {
      let apiUrl = "https://interm-api.onrender.com/api/post/getall";
      await axios
        .get(apiUrl)
        .then((res) => {
          this.postList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    extractH1(htmlString: string) {
      const $ = cheerio.load(htmlString);

      const h1 = $("h1").text();
      if (h1 != "") {
        return h1;
      } else {
        return "Unknown Title";
      }
    },
  },
};
</script>
<style>
/* .results {
    position: absolute;
    width: 100%;
    background: #fff;  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    .result {
      padding:  20px 0.75rem;
    }
  } */
</style>
