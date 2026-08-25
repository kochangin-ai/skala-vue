import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/practice/sample-one',
      name: 'practice-sample-one',
      component: () => import('../components/practices/basic/SampleOne.vue'),
    },
    {
      path: '/practice/sample-two',
      name: 'practice-sample-two',
      component: () => import('../components/practices/basic/SampleTwo.vue'),
    },
    {
      path: '/practice/von-event-handler',
      name: 'practice-von-event-handler',
      component: () => import('../components/practices/basic/vonEventHandler.vue'),
    },
    {
      path: '/practice/event-object',
      name: 'practice-event-object',
      component: () => import('../components/practices/basic/EventObject.vue'),
    },
    {
      path: '/practice/event-modifier',
      name: 'practice-event-modifier',
      component: () => import('../components/practices/basic/EventModifier.vue'),
    },
    {
      path: '/practice/form-elements',
      name: 'practice-form-elements',
      component: () => import('../components/practices/basic/FormElementsHandling.vue'),
    },
    {
      path: '/practice/v-model-modifiers',
      name: 'practice-v-model-modifiers',
      component: () => import('../components/practices/basic/vModelModifiers.vue'),
    },
    {
      path: '/practice/vue-style',
      name: 'practice-vue-style',
      component: () => import('../components/practices/basic/VueStyle.vue'),
    },
    {
      path: '/practice/weather-mockup',
      name: 'practice-weather-mockup',
      component: () => import('../components/practices/basic/handson/WeatherMockup.vue'),
    },
    {
      path: '/practice/v-bind',
      name: 'practice-v-bind',
      component: () => import('../components/practices/basic/VueBind.vue'),
    },
    {
      path: '/practice/v-bind-shorthand',
      name: 'practice-v-bind-shorthand',
      component: () => import('../components/practices/basic/VueBindShorthand.vue'),
    },
    {
      path: '/practice/v-bind-class',
      name: 'practice-v-bind-class',
      component: () => import('../components/practices/basic/VueBindClass.vue'),
    },
    {
      path: '/practice/v-bind-style',
      name: 'practice-v-bind-style',
      component: () => import('../components/practices/basic/VueBindStyle.vue'),
    },
    {
      path: '/practice/v-for',
      name: 'practice-v-for',
      component: () => import('../components/practices/basic/VueFor.vue'),
    },
    {
      path: '/practice/v-if',
      name: 'practice-v-if',
      component: () => import('../components/practices/basic/VueIf.vue'),
    },
    {
      path: '/practice/ref-example',
      name: 'practice-ref-example',
      component: () => import('../components/practices/basic/RefExample.vue'),
    },
    {
      path: '/practice/reactive-example',
      name: 'practice-reactive-example',
      component: () => import('../components/practices/basic/ReactiveExample.vue'),
    },
  ],
})

export default router
