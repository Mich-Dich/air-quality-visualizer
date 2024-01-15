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

// Vuetify-Icons initialisieren
//import { mdiAccount } from "@mdi/js"; // Hier kannst du die Icons nach Bedarf hinzufügen

// Vuetify-Instanz erstellen und konfigurieren
const vuetify = createVuetify({
  icons: {
    iconfont: "mdiSvg", // Dies setzt das Icon-Font auf die Material Design Icons
    /*values: {
      account: mdiAccount, // Beispielhaftes Hinzufügen eines Icons mit dem Namen "account"
      // Füge hier weitere Icons hinzu, wenn nötig
    },*/
  },
});

export default vuetify; // Exportiere die konfigurierte Vuetify-Instanz
