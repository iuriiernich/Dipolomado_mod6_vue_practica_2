<template>
    <div>
      <Modal v-model:modelValue="showModalNuevo">
        <ProspectoNew @on-register="onRegister($event)" />
      </Modal>
      <Modal v-model:modelValue="showModalEdit">
        <ProspectoEdit @on-update="onUpdate($event)" :item="itemToEdit" />
      </Modal>
      <h1>Lista de Prospectos</h1>
      <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
      <button @click="buscar()" class="btn btn-light" style="float:right">Buscar</button>
      <input type="search" style="float:right" v-model="textToSearch" @search="buscar()" placeholder="Buscar prospecto" />
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Inmueble Interesado</th>
            <th>Agente</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in itemList" :key="index">
            <td>{{ 1 + index }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.telefono }}</td>
            <td>{{ getInmuebleDireccion(item.interesInmuebleId).direccion }}</td>
            <td>{{ getInmuebleDireccion(item.interesInmuebleId).agente }}</td>
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
import { mapState, mapGetters, mapActions } from 'vuex';
import Modal from '../../components/Modal.vue';
import ProspectoNew from './ProspectoNewView.vue';
import ProspectoEdit from './ProspectoEditView.vue';

export default {
  name: 'Prospecto',
  data() {
    return {
      currentPage: 1,
      totalPages: 100, // Este valor debe calcularse según los datos
      showModalNuevo: false,
      showModalEdit: false,
      itemToEdit: null,
      textToSearch: '',
      itemList: [],
      inmuebles: [], 
      agentes: [], 
    };
  },

  components: {
    Modal,
    ProspectoNew,
    ProspectoEdit,
  },

  methods: {
    ...mapActions(['increment']),
    getList() {
      const vm = this;
      this.axios
        .get(this.baseUrl + '/prospectos?q=' + this.textToSearch)
        .then(function (response) {
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    edit(item) {
      this.itemToEdit = Object.assign({}, item);
      this.showModalEdit = true;
    },
    eliminar(id) {
      if (confirm('¿Está seguro de eliminar el prospecto?')) {
        const vm = this;
        this.axios
          .delete(this.baseUrl + '/prospectos/' + id)
          .then(function (response) {
            vm.getList();
            vm.$toast.show('Prospecto eliminado.', 'danger');
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
      this.$toast.show('Prospecto registrado con éxito.', 'success');
    },
    onUpdate(event) {
      this.getList();
      this.showModalEdit = false;
      this.itemToEdit = null;
      this.$toast.show('Prospecto actualizado con éxito.', 'info');
    },
    showToast(message, type) {
      this.$toast.show(message, type);
    },

    fetchInmuebles() {
      this.axios
        .get(this.baseUrl + "/inmuebles")
        .then((response) => {
          this.inmuebles = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    
    fetchAgentes() {
      this.axios.get(this.baseUrl + "/agentes")
      .then((response) => {
      this.agentes = response.data;
      })
    .catch((error) => {
       console.error(error);
    });
   },

    getInmuebleDireccion(interesInmuebleId) {
    const inmueble = this.inmuebles.find((inmueble) => inmueble.id === interesInmuebleId);
     if (inmueble) {
       const agente = this.agentes.find((agente) => agente.id === inmueble.agenteId);
       return {
          direccion: inmueble.direccion,
          agente: agente ? agente.nombre : 'Agente no encontrado'
        };
      }
        return { direccion: 'No encontrado', agente: 'No encontrado' };
    },
    
  },

  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl;
    },
  },

   mounted() {
  this.getList();
  this.fetchInmuebles(); // Llamar a la función para cargar inmuebles
  this.fetchAgentes();    // Llamar a la función para cargar agentes
  },
};
</script>
  
  <style></style>
  