<template>
  <!-- <nav
      class="navbar navbar-dark bg-primary justify-content-between flex-nowrap flex-row"
    >
      <div class="container text-center">
        <router-link to="/" class="navbar-brand float-left">Menu</router-link>
        <ul class="nav navbar-nav flex-row float-right">
          <li class="nav-item">
            <router-link to="/login" class="nav-link p-3">Login</router-link>
          </li>
        </ul>
      </div>
    </nav> -->
  <div class="content">
    <!-- <h1 class="text-center">Welcome to Admin Page</h1> -->
    <div class="row">
      <div class="col-2">
        <ul class="list-group list-group-flush">
          <a class="nav-link disabled">MENU</a>
          <li class="list-group-item list-group-item-action">
            <router-link to="/post" class="nav-link">Post</router-link>
          </li>
          <li class="list-group-item list-group-item-action">
            <router-link to="/catagory" class="nav-link">Catagory</router-link>
          </li>
         
        </ul>
      </div>
      <div class="col-10">
        <router-view />
      </div>
    </div>
  </div>
</template>
