const baseUrl = "http://localhost:5102/api/Records";

Vue.createApp({
    data() {
        return {
            records: [],
            newRecord: {
                name: "",
                email: "",
            }
        }
    },
    methods: {
        async getRecords() {
            const response = await fetch(baseUrl);
            this.records = await response.json();
        }
    }
}).mount("#app")