<template>
    <div>
      <h1>Editar Prospecto</h1>
      <form @submit.prevent="submitForm" v-if="form">
        <!-- Nombre del prospecto -->
        <div class="form-group">
          <label for="nombre">Nombre del prospecto:</label>
          <input type="text" id="nombre" v-model="form.nombre" :class="{ 'is-invalid': errors.nombre }"
            placeholder="Ingrese el nombre" />
          <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
        </div>
  
        <!-- Correo Electrónico -->
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" v-model="form.email" :class="{ 'is-invalid': errors.email }"
            placeholder="Ingrese el correo electrónico" />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
        </div>
  
        <!-- Teléfono -->
        <div class="form-group">
          <label for="telefono">Teléfono:</label>
          <input type="text" id="telefono" v-model="form.telefono" :class="{ 'is-invalid': errors.telefono }"
            placeholder="Ingrese el teléfono" />
          <div v-if="errors.telefono" class="invalid-feedback">{{ errors.telefono }}</div>
        </div>
  
        <!-- Selección de Inmueble -->
        <div class="form-group">
          <label for="inmueble">Inmueble Interesado:</label>
          <select id="inmueble" v-model="form.interesInmuebleId" :class="{ 'is-invalid': errors.interesInmuebleId }">
            <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
              {{ inmueble.direccion }}
            </option>
          </select>
          <div v-if="errors.interesInmuebleId" class="invalid-feedback">{{ errors.interesInmuebleId }}</div>
        </div>
  
        <!-- Agente Correspondiente (solo lectura) -->
        <div class="form-group">
          <label for="agente">Agente:</label>
          <input type="text" id="agente" :value="agenteName" readonly class="form-control" />
        </div>
  
        <button type="submit" class="btn btn-primary">Actualizar</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'ProspectoEdit',
    data() {
      return {
        errors: {},
        inmuebles: [], // Lista de inmuebles
        agentes: [],   // Lista de agentes
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
  
        if (!this.form.interesInmuebleId) {
          this.errors.interesInmuebleId = 'Debe seleccionar un inmueble.';
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
          .patch(this.baseUrl + '/prospectos/' + this.item.id, this.form)
          .then(function (response) {
            if (response.status === 200) {
              vm.$emit('on-update', response.data);
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      },
      fetchInmuebles() {
        this.axios
          .get(this.baseUrl + '/inmuebles')
          .then((response) => {
            this.inmuebles = response.data;
          })
          .catch((error) => {
            console.error(error);
          });
      },
      fetchAgentes() {
        this.axios
          .get(this.baseUrl + '/agentes')
          .then((response) => {
            this.agentes = response.data;
          })
          .catch((error) => {
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
      agenteName() {
        const inmueble = this.inmuebles.find((inmueble) => inmueble.id === this.form.interesInmuebleId);
        if (inmueble) {
          const agente = this.agentes.find((agente) => agente.id === inmueble.agenteId);
          return agente ? agente.nombre : 'Agente no encontrado';
        }
        return 'Agente no encontrado';
      },
    },
    props: ['item'],
    mounted() {
      this.fetchInmuebles();
      this.fetchAgentes();
    },
  };
  </script>
  
  <style scoped></style>
  