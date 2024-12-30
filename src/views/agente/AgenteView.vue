<template>
  <div>
    <Modal v-model:modelValue="showModalNuevo">
      <AgenteNew @on-register="onRegister($event)" />
    </Modal>
    <Modal v-model:modelValue="showModalEdit">
      <AgenteEdit @on-update="onUpdate($event)" :item="itemToEdit" />
    </Modal>
    <h1>Lista de Agentes</h1>
    <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
    <button @click="buscar()" class="btn btn-light" style="float:right">Buscar</button>
    <input type="search" style="float:right" v-model="textToSearch" @search="buscar()" placeholder="Buscar agente" />
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in itemList" :key="index">
          <td>{{ 1 + index }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.telefono }}</td>
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
import AgenteNew from './AgenteNewView.vue';
import AgenteEdit from './AgenteEditView.vue';

export default {
  name: 'Agente',
  data() {
    return {
      currentPage: 1,
      totalPages: 100, // Este valor debe calcularse según los datos
      showModalNuevo: false,
      showModalEdit: false,
      itemToEdit: null,
      textToSearch: '',
      itemList: [],
    };
  },
  components: {
    Modal,
    AgenteNew,
    AgenteEdit,
  },
  methods: {
    ...mapActions(['increment']),
    getList() {
      const vm = this;
      this.axios
        .get(this.baseUrl + '/agentes?q=' + this.textToSearch)
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
      if (confirm('¿Está seguro de eliminar el agente?')) {
        const vm = this;
        this.axios
          .delete(this.baseUrl + '/agentes/' + id)
          .then(function (response) {
            vm.getList();
            vm.$toast.show('Agente eliminado.', 'danger');
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
      this.$toast.show('Agente registrado con éxito.', 'success');
    },
    onUpdate(event) {
      this.getList();
      this.showModalEdit = false;
      this.itemToEdit = null;
      this.$toast.show('Agente actualizado con éxito.', 'info');
    },
    showToast(message, type) {
      this.$toast.show(message, type);
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
  },
};
</script>

<style></style>
