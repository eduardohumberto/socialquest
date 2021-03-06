import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import { sharedRef } from './config/references'
import { Toast } from 'quasar'

// import Hello from '@/Hello.vue'

Vue.use(VueRouter)

/*
 * Uncomment this section and use "load()" if you want
 * to lazy load routes.
 */

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

function loadPages (component) {
  // '@' is aliased to src/components
  return () => import(`@/pages/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    {
      path: '/login',
      component: load('Login'),
      name: 'login',
      beforeEnter (to, from, next) {
        if (!store.state['auth'].user) {
          next()
        } else {
          next('/app')
        }
      }
    },
    {
      path: '/register',
      component: load('Register'),
      name: 'register',
      beforeEnter (to, from, next) {
        if (!store.state['auth'].user) {
          next()
        } else {
          next('/app')
        }
      }
    },
    { path: '/app',
      component: load('Index'),
      beforeEnter (to, from, next) {
        if (store.state['auth'].user) {
          next()
        } else {
          next('/login')
        }
      },
      children: [
        { path: '', component: load('Home'), name: 'app' },
        { path: 'home', component: load('Home') },
        { path: 'create-quest', component: loadPages('CreateQuest'), name: 'CreateQuest'},
        { path: 'user-quests', component: loadPages('UserQuests'), name: 'UserQuest' },
        {
          path: 'single-quest/:uid',
          component: loadPages('SingleQuest'),
          name: 'SingleQuest',
          beforeEnter (to, from, next) {
            let quest = store.getters['quest/getObjectQuest']
            if (quest.isShared && quest.user != store.state['auth'].user.uid) {
              // verify if user is allowed if the quest is private
              sharedRef.orderByChild('user').equalTo(store.state['auth'].user.uid).on('value', (snapshot) => {
                let val = snapshot.val()
                if (val) {
                  next()
                } else {
                  next('/app')
                  Toast.create('Você não pode votar nesta Quest!')
                }
              })
            }
            next()
          }
        },
        { path: 'edit-quest/:uid', component: loadPages('EditQuest'), name: 'EditQuest' },
        { path: 'top-quests', component: loadPages('TopQuests'), name: 'TopQuests' },
        { path: 'search-quests', component: loadPages('SearchQuests'), name: 'SearchQuests' },
        { path: 'profile/:uid', component: loadPages('ProfileUser'), name: 'ProfileUser' },
        { path: 'notifications', component: loadPages('Notifications'), name: 'Notifications' }
      ]
    },
    { path: '/', redirect: { name: 'login' } },
    { path: '*', component: load('Error404') } // Not found
  ]
})
