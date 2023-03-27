<template>
  <h1>Post Addd</h1>
  <div class="content">
    <form>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <div class="col-2">
          <select
            class="form-select form-select-l mb-3"
            aria-label=".form-select-lg example"
            v-for="(cat, index) in info"
            :key="index"
          >
            <option>{{ cat.catagory_name }}</option>
          </select>
        </div>
      </div>
      <div id="editor" class="justify-content-center"></div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="btn btn-outline-success justify">SAVE</button>
      </div>
    </form>
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

export default defineComponent({
  name: "App",

  mounted() {
    this.editor = new Editor({
      el: document.querySelector("#editor")!,
      height: "auto",
      plugins: [colorSyntax, codeSyntaxHighlight],
    });

    axios.get("https://interm-api.onrender.com/api/catagory/getall").then((response) => {
      console.log(response.data);
      this.info = response.data;
    });
  },

  data() {
    // const content = editor.getValue();
    return {
      editor: {},
      info: null,
    };
  },
});
</script>
