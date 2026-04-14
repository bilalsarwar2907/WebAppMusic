const baseUrl = "http://localhost:5102/api/records";
const localAuthUrl = "http://localhost:5102/api/auth/login";

Vue.createApp({
    data() {
        return {
              token: localStorage.getItem("token") || null,
        role: localStorage.getItem("role") || null,
            records: [],
            searchTitle: "",
            searchArtist: "",
            sortKey: "",
            sortOrder: 1,
            isLocal: true,
            token: null,
            role: null,
            loginData: { username: "", password: "" },
            loginMessage: ""
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
        toggleServer() {
            this.isLocal = !this.isLocal;
            this.getRecords();
        },
        async getRecords() {
            const params = new URLSearchParams();
            if (this.searchTitle) params.append("title", this.searchTitle);
            if (this.searchArtist) params.append("artist", this.searchArtist);
            const url = params.toString() ? `${baseUrl}?${params}` : baseUrl;
            const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
            const response = await fetch(url, { headers });
            
            this.records = await response.json();
        },
        async login() {
            try {
                // ✅ FIX 1: pass the correct URL and loginData as the request body
                const authUrl = this.isLocal ? localAuthUrl : localAuthUrl;
                const response = await axios.post(authUrl, this.loginData);
                this.token = response.data.token;
                this.role = response.data.role;
                        // ✅ Persist to localStorage
        localStorage.setItem("token", this.token);
        localStorage.setItem("role", this.role);
                this.loginMessage = "Login successful!";
                await this.getRecords();
            } catch (ex) {
                // ✅ FIX 2: lowercase loginMessage (was LoginMessage)
                this.loginMessage = ex.message;
            }
        },
        logout() {
            this.token = null;
            this.role = null;
            this.records = [];
            // ✅ FIX 3: lowercase loginMessage (was LoginMessage)
            this.loginMessage = "Logged out.";
            localStorage.removeItem("token");
    localStorage.removeItem("role");
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