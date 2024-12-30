<template>
    <div>
      <h1>Registrar Nueva Cita</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="fecha">Fecha y hora:</label>
          <input
            type="datetime-local"
            id="fecha"
            v-model="form.fecha"
            :class="{ 'is-invalid': errors.fecha }"
          />
          <div v-if="errors.fecha" class="invalid-feedback">{{ errors.fecha }}</div>
        </div>
  
        <div class="form-group">
          <label for="prospectoId">Prospecto:</label>
          <select
            id="prospectoId"
            v-model="form.prospectoId"
            :class="{ 'is-invalid': errors.prospectoId }"
          >
            <option value="" disabled>Seleccione un prospecto</option>
            <option v-for="prospecto in prospectos" :key="prospecto.id" :value="prospecto.id">
              {{ prospecto.nombre }}
            </option>
          </select>
          <div v-if="errors.prospectoId" class="invalid-feedback">{{ errors.prospectoId }}</div>
        </div>
  
        <div class="form-group">
          <label for="inmuebleId">Inmueble:</label>
          <select
            id="inmuebleId"
            v-model="form.inmuebleId"
            :class="{ 'is-invalid': errors.inmuebleId }"
          >
            <option value="" disabled>Seleccione un inmueble</option>
            <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
              {{ inmueble.direccion }}
            </option>
          </select>
          <div v-if="errors.inmuebleId" class="invalid-feedback">{{ errors.inmuebleId }}</div>
        </div>
  
        <div class="form-group">
          <label for="agenteId">Agente:</label>
          <select
            id="agenteId"
            v-model="form.agenteId"
            :class="{ 'is-invalid': errors.agenteId }"
          >
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
  export default {
    name: "CitaNewView",
    data() {
      return {
        form: {
          fecha: "",
          prospectoId: "",
          inmuebleId: "",
          agenteId: "",
        },
        errors: {},
        prospectos: [],
        inmuebles: [],
        agentes: [],
      };
    },
    methods: {
      validateForm() {
        this.errors = {};
  
        if (!this.form.fecha) {
          this.errors.fecha = "La fecha y hora son obligatorias.";
        }
  
        if (!this.form.prospectoId) {
          this.errors.prospectoId = "Debe seleccionar un prospecto.";
        }
  
        if (!this.form.inmuebleId) {
          this.errors.inmuebleId = "Debe seleccionar un inmueble.";
        }
  
        if (!this.form.agenteId) {
          this.errors.agenteId = "Debe seleccionar un agente.";
        }
  
        return Object.keys(this.errors).length === 0;
      },
      submitForm() {
        if (this.validateForm()) {
          this.save();
        }
      },
      save() {
        const vm = this;
        this.axios
          .post(this.baseUrl + "/citas", this.form)
          .then(function (response) {
            if (response.status === 201) {
              vm.$emit("on-register", response.data);
              vm.$toast.show("Cita registrada con éxito.", "success");
              vm.form = {
                fecha: "",
                prospectoId: "",
                inmuebleId: "",
                agenteId: "",
              };
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      },
      fetchRelatedData() {
        const vm = this;
        this.axios.get(this.baseUrl + "/prospectos").then((response) => {
          vm.prospectos = response.data;
        });
        this.axios.get(this.baseUrl + "/inmuebles").then((response) => {
          vm.inmuebles = response.data;
        });
        this.axios.get(this.baseUrl + "/agentes").then((response) => {
          vm.agentes = response.data;
        });
      },
    },
    computed: {
      baseUrl() {
        return this.$store.getters.getBaseUrl;
      },
    },
    mounted() {
      this.fetchRelatedData();
    },
  };
  </script>
  
  <style scoped></style>
  