<template>
  <div>
    <h1>Registrar Inmueble</h1>
    <form @submit.prevent="submitForm()">
      <div class="form-group">
        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" v-model="form.direccion" :class="{ 'is-invalid': errors.direccion }"
          placeholder="Ingrese la dirección del inmueble" />
        <div v-if="errors.direccion" class="invalid-feedback">{{ errors.direccion }}</div>
      </div>

      <div class="form-group">
        <label for="tipo">Tipo:</label>
        <select id="tipo" v-model="form.tipo" :class="{ 'is-invalid': errors.tipo }">
          <option value="" disabled>Seleccione tipo</option>
          <option value="Casa">Casa</option>
          <option value="Terreno">Terreno</option>
          <option value="Departamento">Departamento</option>
        </select>
        <div v-if="errors.tipo" class="invalid-feedback">{{ errors.tipo }}</div>
      </div>

      <div class="form-group">
        <label for="precio">Precio:</label>
        <input type="number" id="precio" v-model="form.precio" :class="{ 'is-invalid': errors.precio }"
          placeholder="Ingrese el precio" />
        <div v-if="errors.precio" class="invalid-feedback">{{ errors.precio }}</div>
      </div>

      <div class="form-group">
        <label for="disponibilidad">Disponibilidad:</label>
        <select id="disponibilidad" v-model="form.disponibilidad" :class="{ 'is-invalid': errors.disponibilidad }">
          <option value="" disabled>Seleccione disponibilidad</option>
          <option value="Disponible">Disponible</option>
          <option value="No disponible">No disponible</option>
        </select>
        <div v-if="errors.disponibilidad" class="invalid-feedback">{{ errors.disponibilidad }}</div>
      </div>

      <div class="form-group">
        <label for="agente">Agente:</label>
        <select id="agente" v-model="form.agenteId" :class="{ 'is-invalid': errors.agenteId }">
          <option value="" disabled>Seleccione un agente</option>
          <option v-for="agente in agentes" :key="agente.id" :value="agente.id">
            {{ agente.nombre }}
          </option>
        </select>
        <div v-if="errors.agenteId" class="invalid-feedback">{{ errors.agenteId }}</div>
      </div>

      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'InmuebleNew',
  data() {
    return {
      form: {
        direccion: '',
        precio: '',
        disponibilidad: '',
        agenteId: ''
      },
      errors: {},
      agentes: [] // Lista de agentes
    };
  },
  methods: {
    ...mapActions(['increment']),
    
    validateForm() {
      this.errors = {};

      if (!this.form.direccion) {
        this.errors.direccion = 'La dirección del inmueble es obligatoria.';
      }

      if (!this.form.tipo) {
        this.errors.tipo = 'Debe seleccionar el tipo del inmueble.';
      }

      if (!this.form.precio || this.form.precio <= 0) {
        this.errors.precio = 'El precio debe ser mayor a 0.';
      }

      if (!this.form.disponibilidad) {
        this.errors.disponibilidad = 'Debe seleccionar la disponibilidad del inmueble.';
      }

      if (!this.form.agenteId) {
        this.errors.agenteId = 'Debe seleccionar un agente.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        this.save();
        this.form = {
          direccion: '',
          precio: '',
          disponibilidad: '',
          agenteId: ''
        };
      }
    },

    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/inmuebles", this.form)
        .then(function (response) {
          if (response.status == 201) {
            vm.$emit('on-register', response.data);
          }
          console.log(response);
        })
        .catch(function (error) {
          console.error(error);
        });
    },

    getAgentes() {
      const vm = this;
      this.axios.get(this.baseUrl + "/agentes")
        .then(function (response) {
          vm.agentes = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl;
    }
  },
  mounted() {
    this.getAgentes();
  }
}
</script>

<style scoped></style>
