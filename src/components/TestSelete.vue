<!-- <template>
  <Multiselect
    v-model="value"
    mode="tags"
    placeholder="Select employees"
    track-by="name"
    label="name"
    :close-on-select="false"
    :searchable="true"
    :options= "option"
    :create-option="true"
    :on-create="handleTagCreate"
  >
      <template v-slot:tag="{ option, handleTagRemove, disabled }">
        <div
          class="multiselect-tag is-user"
          :class="{
            'is-disabled': disabled
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
  <label >{{ value }}</label>
</template>

<script lang="ts">
import Multiselect from '@vueform/multiselect'
import axios from 'axios';

export default {
  created(){
    console.log('Created working');
    this.getAllTags();
  },
  components: {
      Multiselect,
    },
  data: ():{value : any[],option : any[]} => ({
    value: [],
    option:[]
  }),
  methods :{
   async handleTagCreate(option : any){
      let apiUrl = "https://interm-api.onrender.com/api/tags/create";
     var new_tag : any = await axios.post(apiUrl,{name : option.value})
      .then((res)=>{
        return res.data
      })
      console.log('Create Tag',new_tag);
      new_tag.value = new_tag.id;
      this.option.push(new_tag);
      option.value = new_tag.id;
      return option 
    },
    getAllTags(){
      let apiUrl = "https://interm-api.onrender.com/api/tags/getall";
      axios.get(apiUrl, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }).then((data)=>{
        let result = data.data.map((tag_item : any) =>{
          tag_item.value = tag_item.id
          return tag_item;
        })
        this.option =result;
        console.log(result);
      }).catch((err) =>{
        console.log(err);
      })
    }
  } 


}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>
  .multiselect-tag.is-user {
    padding: 5px 8px;
    border-radius: 22px;
    background: #35495e;
    margin: 3px 3px 8px;
  }

  .multiselect-tag.is-user img {
    width: 18px;
    border-radius: 50%;
    height: 18px;
    margin-right: 8px;
    border: 2px solid #ffffffbf;
  }

  .multiselect-tag.is-user i:before {
    color: #ffffff;
    border-radius: 50%;;
  }

  .user-image {
    margin: 0 6px 0 0;
    border-radius: 50%;
    height: 22px;
  }
</style> -->