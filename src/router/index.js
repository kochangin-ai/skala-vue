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
      path: '/practice/weather-composition',
      name: 'practice-weather-composition',
      component: () => import('../components/practices/basic/handson/WeatherComposition.vue'),
    },
    {
      path: '/practice/weather-component',
      name: 'practice-weather-component',
      component: () => import('../components/practices/basic/handson/WeatherParent.vue'),
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
    {
      path: '/practice/reactive-ref',
      name: 'practice-reactive-ref',
      component: () => import('../components/practices/basic/ReactiveRef.vue'),
    },
    {
      path: '/practice/reactive-reactive',
      name: 'practice-reactive-reactive',
      component: () => import('../components/practices/basic/ReactiveReactive.vue'),
    },
    {
      path: '/practice/computed-basic',
      name: 'practice-computed-basic',
      component: () => import('../components/practices/basic/ComputedBasic.vue'),
    },
    {
      path: '/practice/watchers-basic',
      name: 'practice-watchers-basic',
      component: () => import('../components/practices/basic/WatchersBasic.vue'),
    },
    {
      path: '/practice/watchers-deep',
      name: 'practice-watchers-deep',
      component: () => import('../components/practices/basic/WatchersDeep.vue'),
    },
    {
      path: '/practice/watchers-multi',
      name: 'practice-watchers-multi',
      component: () => import('../components/practices/basic/WatchersMulti.vue'),
    },
    {
      path: '/practice/watchers-reactive',
      name: 'practice-watchers-reactive',
      component: () => import('../components/practices/basic/WatchersReactive.vue'),
    },
    {
      path: '/practice/watchers-reactive-array',
      name: 'practice-watchers-reactive-array',
      component: () => import('../components/practices/basic/WatchersReactiveArray.vue'),
    },
    {
      path: '/practice/watchers-ref-array',
      name: 'practice-watchers-ref-array',
      component: () => import('../components/practices/basic/WatchersRefArray.vue'),
    },
    {
      path: '/practice/watchers-watch-effect',
      name: 'practice-watchers-watch-effect',
      component: () => import('../components/practices/basic/WatchersWatchEffect.vue'),
    },
    {
      path: '/practice/component-lifecycle-hook',
      name: 'practice-component-lifecycle-hook',
      component: () => import('../components/practices/basic/ComponentLifecycleHook.vue'),
    },
    {
      path: '/practice/props-emits-parent',
      name: 'practice-props-emits-parent',
      component: () => import('../components/practices/basic/PropsEmitsParent.vue'),
    },
    // Provide/Inject 2단계 조상 예제의 진입점 (GrandParent -> Parent -> GrandChild)
    {
      path: '/practice/provide-inject-grandparent',
      name: 'practice-provide-inject-grandparent',
      component: () => import('../components/practices/basic/ProvideInjectGrandParent.vue'),
    },
    {
      path: '/practice/slot-default',
      name: 'practice-slot-default',
      component: () => import('../components/practices/basic/SlotDefaultParent.vue'),
    },
    {
      path: '/practice/slot-named',
      name: 'practice-slot-named',
      component: () => import('../components/practices/basic/SlotNamedParent.vue'),
    },
    {
      path: '/practice/slot-scoped',
      name: 'practice-slot-scoped',
      component: () => import('../components/practices/basic/SlotScopedParent.vue'),
    },
    // Vue Router 실습: 홈/소개/즐겨찾기/상세(:cityId) 다중 페이지 + Catch-all
    {
      path: '/weather-app',
      name: 'weather-app-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather-app/about',
      name: 'weather-app-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/weather-app/favorites',
      name: 'weather-app-favorites',
      component: () => import('../views/WeatherFavoritesView.vue'),
    },
    {
      path: '/weather-app/weather/:cityId',
      name: 'weather-app-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    // Pinia 실습: Weather Router(WeatherHomeView/WeatherDetailView)를 기반으로 분리 복제한 별도 페이지
    // (components/exercise-store/ + stores/feelsLikeStore.js), Weather Router 쪽 파일은 건드리지 않음
    {
      path: '/weather-store',
      name: 'weather-store-home',
      component: () => import('../views/WeatherStoreHomeView.vue'),
    },
    {
      path: '/weather-store/favorites',
      name: 'weather-store-favorites',
      component: () => import('../views/WeatherStoreFavoritesView.vue'),
    },
    {
      path: '/weather-store/about',
      name: 'weather-store-about',
      component: () => import('../views/WeatherStoreAboutView.vue'),
    },
    {
      path: '/weather-store/weather/:cityId',
      name: 'weather-store-detail',
      component: () => import('../views/WeatherStoreDetailView.vue'),
    },
    // Weather Axios 실습: Weather Store 페이지를 분리 복제(components/exercise-axios/, api/openWeatherApi.js,
    // stores/feelsLikeAxiosStore.js)한 뒤, mock 날씨 데이터를 OpenWeatherMap 실시간 API로 교체한 버전.
    // Weather Store 쪽 파일은 건드리지 않음.
    {
      path: '/weather-axios',
      name: 'weather-axios-home',
      component: () => import('../views/WeatherAxiosHomeView.vue'),
    },
    {
      path: '/weather-axios/favorites',
      name: 'weather-axios-favorites',
      component: () => import('../views/WeatherAxiosFavoritesView.vue'),
    },
    {
      path: '/weather-axios/about',
      name: 'weather-axios-about',
      component: () => import('../views/WeatherAxiosAboutView.vue'),
    },
    {
      path: '/weather-axios/weather/:cityId',
      name: 'weather-axios-detail',
      component: () => import('../views/WeatherAxiosDetailView.vue'),
    },
    // Weather Axios 확장(요구사항 3): 같은 OpenWeatherMap 데이터를 기업 온열질환 예방용으로 재활용.
    // 체감온도(heat/heatIndex.js) + 작업장 목록(stores/worksiteStore.js, localStorage)
    {
      path: '/weather-axios/heat-safety',
      name: 'heat-safety-home',
      component: () => import('../views/HeatSafetyHomeView.vue'),
    },
    {
      path: '/weather-axios/heat-safety/about',
      name: 'heat-safety-about',
      component: () => import('../views/HeatSafetyAboutView.vue'),
    },
    {
      path: '/weather-axios/heat-safety/site/:siteId',
      name: 'heat-safety-detail',
      component: () => import('../views/HeatSafetyDetailView.vue'),
    },
    // Handson: Weather UI Library — Weather Axios 단계를 PrimeVue로 재스킨(+ 계절 배경 테마).
    // 로직/API는 그대로 재사용하고 화면 표현만 교체. 파일은 views/weather-ui/, components/exercise-ui/ 로 분리 복제.
    {
      path: '/weather-ui',
      name: 'weather-ui-home',
      component: () => import('../views/weather-ui/WeatherUiHomeView.vue'),
    },
    {
      path: '/weather-ui/favorites',
      name: 'weather-ui-favorites',
      component: () => import('../views/weather-ui/WeatherUiFavoritesView.vue'),
    },
    {
      path: '/weather-ui/about',
      name: 'weather-ui-about',
      component: () => import('../views/weather-ui/WeatherUiAboutView.vue'),
    },
    {
      path: '/weather-ui/weather/:cityId',
      name: 'weather-ui-detail',
      component: () => import('../views/weather-ui/WeatherUiDetailView.vue'),
    },
    {
      path: '/weather-ui/heat-safety',
      name: 'weather-ui-heat-safety-home',
      component: () => import('../views/weather-ui/WeatherUiHeatSafetyHomeView.vue'),
    },
    {
      path: '/weather-ui/heat-safety/about',
      name: 'weather-ui-heat-safety-about',
      component: () => import('../views/weather-ui/WeatherUiHeatSafetyAboutView.vue'),
    },
    {
      path: '/weather-ui/heat-safety/site/:siteId',
      name: 'weather-ui-heat-safety-detail',
      component: () => import('../views/weather-ui/WeatherUiHeatSafetyDetailView.vue'),
    },
    // Code Challenge: Axios 라이브러리 실습 (CRUD 프로토타입 / 실시간 날씨 통신)
    {
      path: '/practice/axios-json',
      name: 'practice-axios-json',
      component: () => import('../components/practices/basic/library/AxiosJson.vue'),
    },
    {
      path: '/practice/axios-weather',
      name: 'practice-axios-weather',
      component: () => import('../components/practices/basic/library/AxiosWeather.vue'),
    },
    {
      path: '/practice/element-plus',
      name: 'practice-element-plus',
      component: () => import('../components/practices/basic/library/ElementPlus.vue'),
    },
    // Catch-all Route: 정의되지 않은 모든 경로를 404 페이지로 처리 (반드시 routes 배열 마지막에 위치)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
