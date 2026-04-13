const baseUrl = "http://localhost:5102/api/records";

Vue.createApp({
    data() {
        return {
            records: []
        }
    },
    methods: {
        async getRecords() {
            const response = await fetch(baseUrl);
            this.records = await response.json();
        }
    },
    mounted() {
        this.getRecords(); // loader automatisk når siden åbner
    }
}).mount("#app");