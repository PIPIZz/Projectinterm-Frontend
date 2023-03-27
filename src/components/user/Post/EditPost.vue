<template>
  <h1>Edit Post</h1>
  <div class="row">
    <div class="container-fluid">
      <div class="row">
        <div class="col-8">
          <div id="editor" class="justify-content-center" ></div>
        </div>
        <div class="col-4">
          <div class="col">
            <label>Catagory</label>
            <Multiselect
                  v-model="value_cat"
                  :close-on-select="false"
                  :options="catagories"
                  label="name"
                  :searchable="true"
                  :create-option="true"
                  :on-create="handleCatagoryCreate"
                />
         
          </div>   
          <div class="col">
            <label>Tags</label>
            <Multiselect
              v-model="value"
              mode="tags"
              placeholder="Select Tags"
              track-by="name"
              label="name"
              :close-on-select="false"
              :searchable="true"
              :options="option"
              :create-option="true"
              :on-create="handleTagCreate"
            >
              <template v-slot:tag="{ option, handleTagRemove, disabled }">
                <div
                  class="multiselect-tag is-user"
                  :class="{
                    'is-disabled': disabled,
                  }"
                >
                  {{ option.name }}
                  <span
                    v-if="!disabled"
                    class="multiselect-tag-remove"
                    @click="handleTagRemove(option, $event)"
                  >
                    <span class="multiselect-tag-remove-icon"></span>
                  </span>
                </div>
              </template>
            </Multiselect>
          </div>
          <div>
            <br />
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                class="btn btn-outline-success justify"
                @click="onclickEdit"
              >
                Edit
              </button>
              <router-link :to="`/user/post`" class="btn btn-outline-danger justify"><i class="bi-box-arrow-right"></i>Back</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import Editor, { toastui } from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "prismjs/themes/prism.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import axios from "axios";
import Multiselect from "@vueform/multiselect";
import router from '@/router';
export default  {
  created() {
    this.getPost();
    this.getAllTags();
    this.getAllCatagory();
  },
  components: {
    Multiselect,
  }, 
  mounted() {
    this.editor = new Editor({
      el: document.querySelector("#editor")!,
      height: "auto",
      initialEditType: "wysiwyg",
      hideModeSwitch : true,
      plugins: [colorSyntax, codeSyntaxHighlight],
    });
    
  },
  data: (): { 
    posts: any ,
    catagories: any;
    value: any[];
    option: any[];
    catagory_name: any;
    editor :any
    value_cat :any
    } => ({
    posts: null,
    value: [],
    option: [],
    catagories: null,
    catagory_name: null,
    editor : null,
    value_cat:null
  }),
  methods: {
    getPost() {
      var id = this.$route.params.id;
      let apiUrl = "https://interm-api.onrender.com/api/post/getbyid/";
      axios
        .get(apiUrl + id)
        .then((res) => {
          this.posts = res.data;
          this.value = res.data.tags
          this.value_cat = res.data.catagory_id; 
          console.log(res);   
          // console.log(res.data.content);      
          this.editor = new Editor({
                el: document.querySelector("#editor")!,
                height: "auto",
                initialEditType: "wysiwyg",
                initialValue : res.data.content,
                hideModeSwitch : true,
                plugins: [colorSyntax, codeSyntaxHighlight],
          });
        })
        .catch((err) => {
          console.log(err);       
          console.log(err.response.data.message);
        });
      console.log("Edit post");
    }, 
    onclickEdit() {
      var profiles = JSON.parse(localStorage.getItem("profile") || "");
      var data = {
        content: this.editor.getHTML(),
        catagory_id: this.value_cat,
        tags: this.value,
        author: profiles.id,
      };
        console.log(data);
        var id = this.$route.params.id;
      let apiUrl = "https://interm-api.onrender.com/api/post/update/";
      axios
        .put(apiUrl+id, data)
        .then((res) => {
          console.log(res);
          router.push({ path:'/user/post'}).then(() => { this.$router.go() })
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    },
    async handleTagCreate(option: any) {
      let apiUrl = "https://interm-api.onrender.com/api/tags/create";
      var new_tag: any = await axios
        .post(apiUrl, { name: option.value })
        .then((res) => {
          return res.data;
        });
      console.log("Create Tag", new_tag);
      new_tag.value = new_tag.id;
      this.option.push(new_tag);
      option.value = new_tag.id;
      return option;
    },
    async handleCatagoryCreate(option: any) {
      console.log(option);
      
      let apiUrl = "https://interm-api.onrender.com/api/catagory/create";
      var new_cat: any = await axios
        .post(apiUrl, { name: option.value })
        .then((res) => {
          return res.data;
        });
      console.log("Create Catagory", new_cat);
      new_cat.value = new_cat.id;
      this.option.push(new_cat);
      option.value = new_cat.id;
      return option;
    },
    getAllTags() {
      let apiUrl = "https://interm-api.onrender.com/api/tags/getall";
      axios
        .get(apiUrl, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        })
        .then((data) => {
          let result = data.data.map((tag_item: any) => {
            tag_item.value = tag_item.id;
            return tag_item;
          });
          this.option = result;
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    },
    getAllCatagory() {
      let apiUrl = "https://interm-api.onrender.com/api/catagory/getall";
      axios
        .get(apiUrl)
        .then((res) => {
          let result = res.data.map((cat_item: any) => {
          cat_item.value = cat_item.id;
            return cat_item;
          }); 
          this.catagories =  result;
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    },
  },
};
</script>
