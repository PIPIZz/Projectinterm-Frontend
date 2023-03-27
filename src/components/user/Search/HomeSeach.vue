<template>
  <div>
    <div class="text-center p-3">
      <img src="../../../assets/logo.png" class="img-fluid" alt="..." />
    </div>

    <div class="row justify-content-center">
      <div class="col-4">
        <div class="row align-items-center">
          <div class="search-wrapper">  
              <div class="input-group-lg flex-nowrap" role="search">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Search"
                  aria-label="Search"
                  v-model="txt_search"
                />
               </div>
          </div>
          <div class="wrapper">
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item"
                v-for="tagList in filteredList"
                :key="tagList.id"
              >
                <a
                  :href="`/user/search/${tagList.id}`"
                  class="nav-link link-dark"
                  ><i class="bi-tag"></i> {{ tagList.name }}</a
                >
              </li>
            </ul>
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item"
                v-for="catagory in filteredListCat"
                :key="catagory.id"
              >
                <a
                  :href="`/user/catagory/${catagory.id}`"
                  class="nav-link link-dark"
                  ><i class="bi-postcard"></i> {{ catagory.name }}</a
                >
              </li>
            </ul>
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item"
                v-for="postLists in filteredListContent"
                :key="postLists._id"
              >
                <a :href="`/user/detail/${postLists._id}`"
                  class="nav-link link-dark"
                  ><i class="bi-file-earmark-richtext"></i> {{extractH1(postLists.content) }}</a
                >
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
import cheerio from 'cheerio';
export default {
  created() {
    this.getallTags();
    this.getallPost();
    this.getAllCatagory();
  },
  data: (): { txt_search: any; tagsList: any[];postList: any[];catagoryList:any[] } => ({
    txt_search: "",
    tagsList: [],
    postList: [],
    catagoryList:[]
  }),
  computed: {
    filteredList() {
      if (this.txt_search) {
        return this.tagsList.filter((tagList: { name: string }) => {
          return tagList.name.toLowerCase().includes(this.txt_search.toLowerCase());
        });
      } else {
        return null;
      }
    },
    filteredListContent() {
      if (this.txt_search) {
        return this.postList.filter((postList: { content: string }) => {
          return postList.content.toLowerCase().includes(this.txt_search.toLowerCase());
        });
      } else {
        return null;
      }
    },
    filteredListCat(){
        if (this.txt_search) {
        return this.catagoryList.filter((catList: { name: string }) => {
          return catList.name.toLowerCase().includes(this.txt_search.toLowerCase());
        });
      } else {
        return null;
      }
    }
  },
  methods: {
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
    extractH1(htmlString : string) {
        const $ = cheerio.load(htmlString);

        const h1 = $('h1').text();
        if(h1 != ""){
        return h1;
        }else{
        return "Unknown Title"
        }
    },
    getAllCatagory() {
      let apiUrl = "https://interm-api.onrender.com/api/catagory/getall";
      axios
        .get(apiUrl)
        .then((res) => {
          this.catagoryList = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    }, 
  },

};
</script>
