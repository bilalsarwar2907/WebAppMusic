const baseUrl = "http://localhost:5102/api/records";

Vue.createApp({
    data() {
        return {
            records: [],
            searchTitle: "",
            searchArtist: "",
            sortKey: "",
            sortOrder: 1  // 1 = ascending, -1 = descending
        };
    },
    computed: {
        sortedRecords() {
            if (!this.sortKey) return this.records;
            return [...this.records].sort((a, b) => {
                const valA = a[this.sortKey];
                const valB = b[this.sortKey];
                if (typeof valA === "string") {
                    return valA.localeCompare(valB) * this.sortOrder;
                }
                return (valA - valB) * this.sortOrder;
            });
        }
    },
    methods: {
        async getRecords() {
            const params = new URLSearchParams();
            if (this.searchTitle) params.append("title", this.searchTitle);
            if (this.searchArtist) params.append("artist", this.searchArtist);
            const url = params.toString() ? `${baseUrl}?${params}` : baseUrl;
            const response = await fetch(url);
            this.records = await response.json();
        },
        async clearFilters() {
            this.searchTitle = "";
            this.searchArtist = "";
            this.sortKey = "";
            this.sortOrder = 1;
            await this.getRecords();
        },
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortOrder *= -1;
            } else {
                this.sortKey = key;
                this.sortOrder = 1;
            }
        },
        sortIcon(key) {
            if (this.sortKey !== key) return "⇅";
            return this.sortOrder === 1 ? "↑" : "↓";
        }
    },
    mounted() {
        this.getRecords();
    }
}).mount("#app");