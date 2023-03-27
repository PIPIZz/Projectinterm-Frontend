<template>
  <div class="container-fluid  ">
    <div class="row">
      <div class="g-col-6"><h1 class="fw-light">Write Post</h1></div>

        <div class="">
          <div class="row">
            <div class="col-8">
              <div id="editor" class="justify-content-center"></div>
            </div>
            <div class="col-4">
              <div class="col">
                <label>Catagory</label>
                <Multiselect
                  v-model="catagory_name"
                  :close-on-select="false"
                  :options="catagory"
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
                    @click="onclickSubmit"
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, } from "vue";
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
import router from "@/router";
export default defineComponent({
  created() {
    console.log("Created working");
    this.getAllCatagory();
    },
  components: {
    Multiselect,
  },
  name: "App",
  mounted() {
    this.editor = new Editor({
      el: document.querySelector("#editor")!,
      height: '700px',
      initialEditType: "wysiwyg",
      initialValue : "",
      hideModeSwitch : true,
      plugins: [colorSyntax, codeSyntaxHighlight],
    });
      this.getAllTags();    
  },
    computed:{
      filteredListCat(){
        
        if (this.txt_search) {
        return this.catagory.filter((catList: { name: string }) => {
          return catList.name.toLowerCase().includes(this.txt_search.toLowerCase());
        });
      } else {
        return null;
      }
    }
  },
  data: (): {
    editor: any;
    catagory: any[];
    value: any[];
    option: any[];
    seclected: any;
    catagory_name:any
    txt_search:any
  } => ({
    value: [],
    option: [],
    editor: null,
    catagory: [],
    seclected: false,
    catagory_name:null,
    txt_search :""
  }),
  methods: {
    onclickSubmit() {
      var profiles = JSON.parse(localStorage.getItem("profile") || "");
      var data = {
        content: this.editor.getHTML(),
        catagory: this.catagory_name,
        tags: this.value,
        author: profiles.id,
      };
      let apiUrl = "http://localhost:4040/api/post/create";
      axios
        .post(apiUrl, data)
        .then((res) => {
          console.log(res);
          router.push({path : '/user/home'}).then(() => { this.$router.go() })
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async handleTagCreate(option: any) {
      let apiUrl = "http://localhost:4040/api/tags/create";
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
      
      let apiUrl = "http://localhost:4040/api/catagory/create";
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
      let apiUrl = "http://localhost:4040/api/tags/getall";
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
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
   getAllCatagory() {
       let apiUrl = "http://localhost:4040/api/catagory/getall";
      axios
        .get(apiUrl)
        .then((res) => {

          let result = res.data.map((cat_item: any) => {
          cat_item.value = cat_item.id;
            return cat_item;
          }); 
          this.catagory =  result;
        })
        .catch((err) => {
          console.log(err);
        });
    },
   
  },
});
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
