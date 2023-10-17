<template>
  <v-container>
    <v-data-table
      :headers="cabeceras"
      :items="registros"
      :items-per-page="10"
      class="elevation-1"
    >
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      cabeceras: [],
      registros: [],
      propiedades: [],
    };
  },
  computed: {
    encabezado() {
      return this.cabeceras;
    },
  },
  mounted() {
    //Si lo vamos a probar en el PC dejamos localhost. Pero si desplegamos en IBM i
    //elegimos la dirección IP del Servidor IBM i (en mi caso 172.16.210.40)
    axios.get("http://172.16.210.40:8033/consulta/").then((response) => {
      this.registros = response.data;
      //Sacamos las cabeceras de los atributos de la primera fila
      this.propiedades = Object.keys(response.data[0]);
      let miarray = [];
      this.propiedades.forEach(function (elemento, indice, array) {
        miarray.push({ text: elemento, value: elemento });
      });
      this.cabeceras = miarray;
    });
  },
};
</script>
