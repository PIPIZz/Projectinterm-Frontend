<template>
  <div >
    <div class="position-absolute top-50 start-50 translate-middle">
      <form  @submit.prevent="onclickRegiste" style="width: 60rem; ">
        <div class="row">
          <div class="col-6 p-2">
            <img src="../assets/cat.gif" style="width: 30rem; height: 30rem;" >
          </div>
          <div class="col-6 p-2">
            <div class="row justify-content-center p-4">
              <h4 class="text-center pb-4 pt-5">Register</h4>
              <div class="mb-3">
                <label for="name">Name</label>
                <input type="text"  class="form-control"  required  v-model="name"   />
              </div>
              <div class="mb-3">
                <label for="Email">Email</label>
                <input  type="text"  class="form-control" required v-model="email" />
              </div>
              <div class="mb-3">
                  <label for="password">Password</label>
                  <input  type="text" class="form-control" required v-model="password" />
              </div> 
          
              <button class="btn btn-dark col-11 pm-3" type="submit">Register</button>
              <div class=""><hr></div>
              <button class="btn btn-danger col-11 text-white " @click.prevent="onclickGoogleRegister"><i class="bi-google"  ></i> Sign up with Google</button>
              <router-link to="/" class="text-center link-dark mt-3">Back</router-link>
            </div>
          </div>
        </div>    
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import axios from 'axios';
import { defineComponent } from 'vue'
import { IUser } from '@/interface/user';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
export default defineComponent({
  data :():{
    name : any;
    email : any;
    password :any;
  } => ({
      name : "",
      email : "",
      password :""
  }),
  methods: {
    async onclickRegiste() {   
      if(this.name == ""){
        alert("Please Fill Name")
      }
      if(this.email == ""){
        alert("Please Fill email")
      }
      if(this.password == ""){
        alert("Please Fill password")
      }

      var data ={
        name : this.name,
        email :this.email,
        password : this.password,
        role:"user"
      }
      let apiUrl = "https://interm-api.onrender.com/api/profile/create";
      await axios
        .post(apiUrl,data )
        .then((response) => {
          console.log(response);
          router.push({ name: "login" });
        })
        .catch((error) => {
          console.log(error.response.data);
          alert(error.response.data.message);
          router.push({path : '/register'}).then(() => { this.$router.go() })
        });
    },

    async onclickGoogleRegister(){
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(async(result) => {
          const email = result.user.email;
          const name = result.user.displayName;
          const password = '1234';
          const role = 'user';
          let apiUrl = "https://interm-api.onrender.com/api/profile/create";
            await axios
              .post(apiUrl,{name,email,password,role})
              .then((response) => {
                console.log(response);
                alert('Register Success')
                router.push({ name: "login" });
              })
              .catch((error) => {
                console.log(error.response.data);
                alert(error.response.data.message);
                router.push({path : '/register'}).then(() => { this.$router.go() })
              });
        })

    },
  }
})
</script>
