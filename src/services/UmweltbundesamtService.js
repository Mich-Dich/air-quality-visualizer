import axios from "axios";

class UmweltbundesamtService {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:3000/proxy/api/air_data/v2",
    });
  }

  getMeta(use, lang, date_from, date_to, time_from, time_to) {
    return this.api.get(
      `/meta/json?use=${use}&lang=${lang}&date_from=${date_from}&date_to=${date_to}&time_from=${time_from}&time_to=${time_to}`
    );
  }

  getNetworks(lang, index) {
    return this.api.get(`/networks/json?lang=${lang}&index=${index}`);
  }

  // Add more methods for other API endpoints here
}

export default new UmweltbundesamtService();
