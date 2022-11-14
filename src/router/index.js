import Vue from 'vue';
import VueRouter from 'vue-router';
import Base from '@/views/Layout/Base.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    component: Base,
    meta: { requiresAuth: true },
    children: [
      // {
      //   path: '/',
      //   name: 'Landing',
      //   component: () => import('@/views/Landing.vue'),
      // },
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/events/create',
        name: 'Create Event',
        component: () => import('@/views/CreateEvent.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register.vue')
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('../components/ForgotPassword.vue')
      },
      {
        path: '/events',
        name: 'Events',
        component: () => import('@/views/FullEvents.vue'),
      },
      {
        path: '/hostview',
        name: 'HostProfile',
        component: () => import('@/views/HostProfile.vue'),
      },
      {
        path: '/hostmgmt',
        name: 'HostManagement',
        component: () => import('@/views/HostManagement.vue'),
      },
      {
        path: '/user/',
        name: 'user-events',
        component: () => import('../views/UserEvents.vue'),
      },
      {
        path: '/profile',
        name: 'User Profile',
        component: () => import('@/views/UserProfile.vue'),
      },
      {
        path: '/event',
        name: 'Event',
        component: () => import('@/views/IndivEvent.vue'),
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
      },
      {
        path: '/buzzing',
        name: 'Buzzing',
        component: () => import('@/views/BuzzingForYou.vue'),
        props: true
      },
      {
        path: '/for-you',
        name: 'For You',
        component: () => import('@/views/BuzzingForYou.vue'),
        props: true
      },
      {
        path: '/gmaps',
        name: 'Gmaps Test',
        component: () => import('@/views/GoogleMap.vue'),
        props: true
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.Base,
  routes,
});

export default router;
