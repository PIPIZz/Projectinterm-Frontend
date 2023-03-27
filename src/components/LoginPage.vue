<template>
  <div class="container" >
    <div class="position-absolute top-50 start-50 translate-middle">
      <form  style="width: 60rem; ">
        <div class="row">
          <div class="col-6 p-2">

            <img src="../assets/cat.gif" style="width: 30rem; height: 30rem;" >

          </div>

          <div class="col-6 p-2">
            <div class="row justify-content-center p-4">
              <h4 class="text-center pb-4 pt-5">Login</h4>
            <div class=" pb-3">
              <label  class="form-label">Email address</label>
              <input type="email" class="form-control"  placeholder="  Email" required   v-model="states.email">
            </div>

            <div class="pb-4">
              <label class="form-label">Password</label>
              <input type="password" class="form-control"  placeholder="  Password" required
                  v-model="states.password">
            </div> 
          
              <button class="btn btn-primary col-11 " @click.prevent="onclickLogin" type="submit">LOGIN</button>
              <div class=""><hr></div>
              <button class="btn btn-danger col-11 text-white" @click.prevent="onclickGoogleLogin"><i class="bi-google"  ></i> Google</button>
             
              <router-link to="/register" class="text-center link-dark mt-4">Register</router-link>
              
          </div>
          </div>
        </div>
        
        
       
        <br />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from "vue";
import { ILogin } from "@/interface/user";
import axios from "axios";
import router from "@/router";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default defineComponent({
  methods: {
    async onclickLogin() {
      this.$store.commit("UPDATE_LOADING", true);
      let apiUrl = "http://localhost:4040/api/profile/login";
      await axios
        .post(apiUrl, this.states)
        .then((response) => {
          let profile = response.data.userInfo;
          let accessToken = response.data.accessToken;

          localStorage.setItem("profile", JSON.stringify(profile));
          localStorage.setItem("access_token", accessToken);

          router.push("/user/home");
        })
        .catch((error) => {
          console.log(error.response.data);
          alert(error.response.data.message);

          this.$store.commit("UPDATE_LOADING", false);
        });
    },
    onclickGoogleLogin(){
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(async(result) => {
          const email = result.user.email;
          const provider_id = result.user.uid;

          let apiUrl = "http://localhost:4040/api/profile/loginwithgoogle";
            await axios.post(apiUrl,{email,provider_id})
              .then((response) => {
              let profile = response.data.userInfo;
              let accessToken = response.data.accessToken;

              localStorage.setItem("profile", JSON.stringify(profile));
              localStorage.setItem("access_token", accessToken);

              router.push("/user/home");
        })
        .catch((error) => {
          console.log(error.response.data);
          alert(error.response.data.message);
          this.$store.commit("UPDATE_LOADING", false);
        });   
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    }
  },
  setup() {
    const states = reactive<ILogin>({
      email: "",
      password: "",
    });
    const firebaseAuth: any = inject("firebaseAuth");
    return {
      states,firebaseAuth,
    };
  },
});
</script>
