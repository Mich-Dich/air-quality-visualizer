/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// Vuetify-Instanz erstellen und konfigurieren
const vuetify = createVuetify({
  icons: {
    iconfont: "mdiSvg", // Dies setzt das Icon-Font auf die Material Design Icons
  },
});

export default vuetify; // Exportiere die konfigurierte Vuetify-Instanz
