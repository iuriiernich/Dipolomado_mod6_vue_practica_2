<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <InmuebleNewView @on-register="onRegister($event)" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <InmuebleEditView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>
        <h1>Lista de Inmuebles</h1>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>

        <!-- Filtros y buscador -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <!-- Buscador general -->
            <div>
                <button @click="buscar()" class="btn btn-light" style="float:right">Buscar</button>
                <input 
                    type="search" 
                    style="float:right" 
                    v-model="textToSearch" 
                    @search="buscar()" 
                    placeholder="Buscar inmueble">
            </div>

            <!-- Filtro por disponibilidad -->
            <div class="form-group" style="margin-left: 20px;">
                <label for="filtro-disponibilidad">Filtrar disponibilidad:</label>
                <select 
                    id="filtro-disponibilidad" 
                    v-model="disponibilidadFiltro" 
                    style="width: 150px; margin-right: 10px;">
                    <option value="">Todos</option>
                    <option value="Disponible">Disponible</option>
                    <option value="No disponible">No disponible</option>
                </select>
                <button @click="aplicarFiltroPorDisponibilidad" class="btn btn-secondary">Aplicar</button>
            </div>
        </div>

        <!-- Tabla de inmuebles -->
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Dirección</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>Disponibilidad</th>
                    <th>Agente</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in inmueblesFiltrados" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.direccion }}</td>
                    <td>{{ item.tipo }}</td>
                    <td>{{ item.precio }}</td>
                    <td>{{ item.disponibilidad }}</td>
                    <td>{{ getAgentName(item.agenteId) }}</td>
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
import InmuebleNewView from './InmuebleNewView.vue';
import InmuebleEditView from './InmuebleEditView.vue';

export default {
    name: 'Inmueble',
    data() {
        return {
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            disponibilidadFiltro: '',
            itemList: [], // Lista completa de inmuebles
            agentes: []   // Lista de agentes
        };
    },
    components: {
        Modal,
        InmuebleNewView,
        InmuebleEditView
    },
    methods: {
        ...mapActions(['increment']),

        getList() {
            this.axios.get(this.baseUrl + "/inmuebles?&_expand=agente&q=" + this.textToSearch)
                .then((response) => {
                    this.itemList = response.data;
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
        getAgentName(agentId) {
            const agente = this.agentes.find((agente) => agente.id === agentId);
            return agente ? agente.nombre : 'No asignado';
        },
        aplicarFiltroPorDisponibilidad() {
            console.log(`Filtrando inmuebles con disponibilidad: ${this.disponibilidadFiltro}`);
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        eliminar(id) {
            if (confirm("¿Está seguro de eliminar el inmueble?")) {
                this.axios.delete(this.baseUrl + "/inmuebles/" + id)
                    .then(() => {
                        this.getList();
                        this.$toast.show("Inmueble eliminado.", "danger");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        },
        buscar() {
            this.getList();
        },
        onRegister() {
            this.getList();
            this.showModalNuevo = false;
            this.$toast.show('Inmueble registrado exitosamente', 'success');
        },
        onUpdate() {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Inmueble editado exitosamente', 'info');
        }
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl;
        },
        inmueblesFiltrados() {
            return this.itemList.filter(item => {
                return this.disponibilidadFiltro ? item.disponibilidad === this.disponibilidadFiltro : true;
            });
        }
    },
    mounted() {
        this.getList();
        this.fetchAgentes();
    }
};
</script>

<style></style>
