<template>
  <div>
    <h1 class="display-4">Práctica 2</h1>
      <p class="lead">Práctica 2 del módulo VUE del diplomado en FullStack </p>
      <p>Integrante(s):</p>
      <ul>
        <li>Iurii Chernichenko</li>
      </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

<style>
  .home{
    text-align: center
  }
</style>