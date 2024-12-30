<template>
  <div>
    <h1>Editar Agente</h1>
    <form @submit.prevent="submitForm" v-if="form">
      <div class="form-group">
        <label for="nombre">Nombre del agente:</label>
        <input type="text" id="nombre" v-model="form.nombre" :class="{ 'is-invalid': errors.nombre }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" v-model="form.email" :class="{ 'is-invalid': errors.email }"
          placeholder="Ingrese el correo electrónico" />
        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input type="text" id="telefono" v-model="form.telefono" :class="{ 'is-invalid': errors.telefono }"
          placeholder="Ingrese el teléfono" />
        <div v-if="errors.telefono" class="invalid-feedback">{{ errors.telefono }}</div>
      </div>

      <button type="submit" class="btn btn-primary">Actualizar</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'AgenteEdit',
  data() {
    return {
      errors: {},
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.nombre) {
        this.errors.nombre = 'El nombre es obligatorio.';
      }

      if (!this.form.email) {
        this.errors.email = 'El correo electrónico es obligatorio.';
      } else if (!this.validEmail(this.form.email)) {
        this.errors.email = 'El correo electrónico no es válido.';
      }

      if (!this.form.telefono) {
        this.errors.telefono = 'El teléfono es obligatorio.';
      }

      return Object.keys(this.errors).length === 0;
    },
    validEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
      }
    },
    save() {
      const vm = this;
      this.axios
        .patch(this.baseUrl + '/agentes/' + this.item.id, this.form)
        .then(function (response) {
          if (response.status === 200) {
            vm.$emit('on-update', response.data);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl;
    },
    form() {
      return Object.assign({}, this.item);
    },
  },
  props: ['item'],
};
</script>

<style scoped></style>