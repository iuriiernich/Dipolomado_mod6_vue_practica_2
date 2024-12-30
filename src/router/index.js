import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgenteView from '../views/agente/AgenteView'
import InmuebleView from '../views/inmueble/InmuebleView'
import ProspectoView from '@/views/prospecto/ProspectoView.vue'
import CitaView from '@/views/cita/CitaView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/agentes',
    name: 'agente',
    component: AgenteView
  },
  {
    path: '/inmuebles',
    name: 'inmueble',
    component: InmuebleView
  },
  {
    path: '/prospectos',
    name: 'prospecto',
    component: ProspectoView
  },
  {
    path: '/citas',
    name: 'cita',
    component: CitaView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
