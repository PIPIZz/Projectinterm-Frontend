import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RegisterComponent from '../components/RegisterPage.vue'
import LoginComponent from '../components/LoginPage.vue'
import Test from '../components/TestViewer.vue'
import HomePageUser from '../components/user/HomePage.vue'
import axios from 'axios'
import AddPost  from '../components/user/Post/AddPost.vue'
import EditPost  from '../components/user/Post/EditPost.vue'
import Post  from '../components/user/Post/PostPage.vue'
import DetailPost  from '../components/user/DetailPost.vue'
import PostBycat  from '../components/user/PostBycatagory.vue'
import PageSerach from '../components/user/Search/PageSearch.vue'
import HomeSeach from '../components/user/Search/HomeSeach.vue'
const routes: Array<RouteRecordRaw> = [
  
  {
    path: '/register',
    name: 'register',
    component: RegisterComponent
  },
  {
    path: '/',
    name: 'login',
    component: LoginComponent,
  },
  {
    path: '/user',
    name: 'user.home',
    component:() => import(/* webpackChunkName: "about" */ '../components/user/LayoutHomePage.vue'),
    children:[
      {path:'home', component:HomePageUser},
      {path:'addpost', component: AddPost},
      {path:'editpost/:id', name : 'editpost', component: EditPost},
      {path:'post', component:Post},
      {path:'detail/:id', component:DetailPost},
      {path:'catagory/:id', component: PostBycat},
      {path:'search/:id', component:PageSerach}
    ]
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next) => {
  console.log('page change')
  const publicPages = ['/','/register'];
  const authRequired = !publicPages.includes(to.path);

  if(authRequired){
    axios.get('https://interm-api.onrender.com/api/profile/vertify',{
      headers: {
        Authorization: "Bearer "+localStorage.getItem("access_token"),
      },
    }).then(()=>{ 
      next();  
    }).catch((error : any)=>{
      console.log(error.response.data);
      localStorage.removeItem("access_token")
      next({ name: 'login' });
    })
  }else{
    if(to.path == '/user' && localStorage.getItem("access_token") != null){
      next({name : 'user.home'}); 
    }
   next();
  }

})
export default router
