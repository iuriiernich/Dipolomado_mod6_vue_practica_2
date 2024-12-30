<template>
  <div>
    <Modal v-model:modelValue="showModalNuevo">
      <CitaNew @on-register="onRegister($event)" />
    </Modal>
    <Modal v-model:modelValue="showModalEdit">
      <CitaEdit @on-update="onUpdate($event)" :item="itemToEdit" />
    </Modal>
    <h1>Lista de Citas</h1>
    <button @click="showModalNuevo = true" class="btn btn-primary">Nueva Cita</button>
    
    <!-- Filtros de búsqueda -->
    <div style="margin-bottom: 10px;">
      <input
        type="search"
        v-model="textToSearch"
        @search="buscar()"
        placeholder="Buscar por prospecto, inmueble o agente"
        style="float:right; margin-right: 10px"
      />
      <button @click="buscar()" class="btn btn-light" style="float:right; margin-right: 10px">Buscar</button>
      
      <!-- Filtro de fechas -->
      <label for="fechaInicio" style="margin-right: 5px;">Fecha Inicio:</label>
      <input type="date" v-model="fechaInicio" @change="buscar" />
      <label for="fechaFin" style="margin-right: 5px;">Fecha Fin:</label>
      <input type="date" v-model="fechaFin" @change="buscar" />
    </div>

    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Fecha</th>
          <th>Prospecto</th>
          <th>Inmueble</th>
          <th>Agente</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredItemList" :key="index">
          <td>{{ 1 + index }}</td>
          <td>{{ formatDate(item.fecha) }}</td>
          <td>{{ getProspectoName(item.prospectoId) }}</td>
          <td>{{ getInmuebleName(item.inmuebleId) }}</td>
          <td>{{ getAgenteName(item.agenteId) }}</td>
          <td>
            <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
            <button @click="eliminar(item.id)" class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Modal from "../../components/Modal.vue";
import CitaNew from "./CitaNewView.vue";
import CitaEdit from "./CitaEditView.vue";

export default {
  name: "Cita",
  data() {
    return {
      showModalNuevo: false,
      showModalEdit: false,
      itemToEdit: null,
      textToSearch: "",
      fechaInicio: "",  // Filtro de fecha inicio
      fechaFin: "",     // Filtro de fecha fin
      itemList: [],
      prospectos: [],
      inmuebles: [],
      agentes: [],
    };
  },
  components: {
    Modal,
    CitaNew,
    CitaEdit,
  },
  methods: {
    ...mapActions(["increment"]),
    getList() {
      const vm = this;
      let url = `${this.baseUrl}/citas?q=${this.textToSearch}`;

      // Agregar filtros de fecha al URL
      if (this.fechaInicio) {
        url += `&fechaInicio=${this.fechaInicio}`;
      }
      if (this.fechaFin) {
        url += `&fechaFin=${this.fechaFin}`;
      }

      this.axios
        .get(url)
        .then(function (response) {
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });

      this.fetchRelatedData();
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
    getProspectoName(id) {
      const prospecto = this.prospectos.find((p) => p.id === id);
      return prospecto ? prospecto.nombre : "Desconocido";
    },
    getInmuebleName(id) {
      const inmueble = this.inmuebles.find((i) => i.id === id);
      return inmueble ? inmueble.direccion : "Dirección desconocida";
    },
    getAgenteName(id) {
      const agente = this.agentes.find((a) => a.id === id);
      return agente ? agente.nombre : "Desconocido";
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(date).toLocaleDateString("es-ES", options);
    },
    edit(item) {
      this.itemToEdit = Object.assign({}, item);
      this.showModalEdit = true;
    },
    eliminar(id) {
      if (confirm("¿Está seguro de eliminar la cita?")) {
        const vm = this;
        this.axios
          .delete(this.baseUrl + "/citas/" + id)
          .then(function (response) {
            vm.getList();
            vm.$toast.show("Cita eliminada.", "danger");
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    },
    buscar() {
      this.getList();
    },
    onRegister(event) {
      this.getList();
      this.showModalNuevo = false;
      this.$toast.show("Cita registrada con éxito.", "success");
    },
    onUpdate(event) {
      this.getList();
      this.showModalEdit = false;
      this.itemToEdit = null;
      this.$toast.show("Cita actualizada con éxito.", "info");
    },
  },
  computed: {
    ...mapState(["count"]),
    ...mapGetters(["doubleCount", "getBaseUrl"]),
    baseUrl() {
      return this.getBaseUrl;
    },
    // Filtrar las citas según el texto de búsqueda y las fechas
    filteredItemList() {
      let filteredList = this.itemList;

      // Filtrar por texto de búsqueda
      if (this.textToSearch) {
        filteredList = filteredList.filter(item => {
          const prospectoName = this.getProspectoName(item.prospectoId).toLowerCase();
          const inmuebleAddress = this.getInmuebleName(item.inmuebleId).toLowerCase();
          const agenteName = this.getAgenteName(item.agenteId).toLowerCase();
          const searchTerm = this.textToSearch.toLowerCase();
          
          return (
            prospectoName.includes(searchTerm) ||
            inmuebleAddress.includes(searchTerm) ||
            agenteName.includes(searchTerm)
          );
        });
      }

      // Filtrar por fecha de inicio y fin
      if (this.fechaInicio) {
        filteredList = filteredList.filter(item => new Date(item.fecha) >= new Date(this.fechaInicio));
      }
      if (this.fechaFin) {
        filteredList = filteredList.filter(item => new Date(item.fecha) <= new Date(this.fechaFin));
      }

      return filteredList;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style></style>
