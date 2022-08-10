<template>
  <div class="flex place-items-center">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useAuth } from '@websanova/vue-auth'
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const auth = useAuth();
    const route = useRoute();

    const state: any = reactive({
      read: false,
      user: computed(() => {
          return auth.user() || {};
      }),  
      loaded: computed(() => {
          return auth.ready() && state.artificialLoad;
      }),
      path: computed(() => {
          return ((route.name || '') as string).split('-').join(' / ')
      }),
      remember: computed(() => {
          var remember = auth.remember();
          if (remember) {
              remember = JSON.parse(remember);
          }
          return remember;
      }),
      check: computed(() => {
          return auth.check();
      }),
      meta: computed(() => {
          return route.meta;
      }),
          
      links: computed(() => {
          var links = [];
          links.push({to: {name: 'site-home'}, text: 'home'});
          if (state.loaded) {
              if (!auth.check()) {
                  links.push({to: {name: 'auth-login'}, text: 'login'});
                  links.push({to: {name: 'auth-register'}, text: 'register'});
                  links.push({to: {name: 'auth-social'}, text: 'social'});
                  links.push({to: {name: 'site-users'}, text: 'users'});
              }
              if (auth.check('user')) {
                  links.push({to: {name: 'user-users'}, text: 'users'});
              }
              if (auth.check('admin')) {
                  links.push({to: {name: 'admin-landing'}, text: 'admin'});
              }
              if (auth.impersonating()) {
                  links.push({to: {name: 'user-unimpersonate'}, text: 'unimpersonate'});
              }
              if (auth.check()) {
                  links.push({to: {name: 'user-account'}, text: 'account'});
                  links.push({to: {name: 'user-logout'}, text: 'logout'});
              }
          }
          return links;
      }),
    });

    return {
      state,
      auth,
      route
    }
  },
  async mounted() {
      await this.auth.load()
      this.state.ready = true
      if (!this.$auth.check()) {
        // fetch some data
        console.info('check')
      }
  }
})
</script>
