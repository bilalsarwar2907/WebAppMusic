const baseUrl = "http://restmusicrepoapi.azurewebsites.net/api/records";
const localUrl = "http://localhost:5102/api/records";
const localAuthUrl = "https://restmusicrepoapi.azurewebsites.net/api/auth/login";

Vue.createApp({
    data() {
        return {
            token: localStorage.getItem("token") || null,
            role: localStorage.getItem("role") || null,

            addData: { title: "", artist: "", durationInSeconds: null, publicationYear: null },
            addMessage: "",

            deleteId: null,
            deleteMessage: "",

            records: [],
            searchTitle: "",
            searchArtist: "",
            sortKey: "",
            sortOrder: 1,
            isLocal: true,
            loginData: { username: "", password: "" },
            loginMessage: "",
        updateData: {
            id: null,
            title: "",
            artist: "",
            publicationYear: null,
            durationInSeconds: null
        },
        updateMessage: "",
     };
    },

    computed: {
        sortedRecords() {
            if (!this.sortKey) return this.records;

            // ✅ FIX: indentation corrected inside sort()
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
                const authUrl = this.isLocal ? localAuthUrl : localAuthUrl;
                const response = await axios.post(authUrl, this.loginData);

                this.token = response.data.token;
                this.role = response.data.role;

                localStorage.setItem("token", this.token);
                localStorage.setItem("role", this.role);

                this.loginMessage = "Login successful!";
                await this.getRecords();
            } catch (ex) {
                this.loginMessage = ex.message;
            }
        },

        logout() {
            this.token = null;
            this.role = null;
            this.records = [];
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
        },

        // ---------- Add Record ----------
        async addRecord() {
            // ❌ FIX: indentation + missing semicolons
            if (!this.addData.title || !this.addData.artist ||
                this.addData.durationInSeconds === null || this.addData.durationInSeconds <= 0 ||
                !this.addData.publicationYear) {
                alert("Please fill in all fields with valid values");
                return;
            }

            try {
                const response = await axios.post(
                    this.isLocal ? localUrl : azureUrl,
                    this.addData,
                    { headers: { Authorization: "Bearer " + this.token } }
                );

                this.addMessage = "Response " + response.status + " " + response.statusText;
                this.getRecords();
            } catch (ex) {
                alert(ex.message);
            }
        },

        clearAddForm() {
           
            this.addData = {
                title: "",
                artist: "",
                publicationYear: "",
                durationInSeconds: null
            };
            this.addMessage = "";
        },

        // ---------- Delete Record ----------
        async deleteRecord(id) {
            if (id === null || id === undefined || isNaN(id) || id <= 0) {
                alert("Please enter a valid record ID");
                return;
            }

            const url = (this.isLocal ? localUrl : azureUrl) + "/" + id;

            try {
                const response = await axios.delete(url, {
                    headers: { Authorization: "Bearer " + this.token }
                });

                this.deleteMessage = "Response " + response.status + " " + response.statusText;
                this.getRecords();
            } catch (ex) {
                alert(ex.message);
            }
        },

async updateRecord() {
    // Validate ID
    if (!this.updateData.id || isNaN(this.updateData.id) || this.updateData.id <= 0) {
        alert("Please enter a valid record ID");
        return;
    }

    // Validate fields
    if (!this.updateData.title ||
        !this.updateData.artist ||
        !this.updateData.publicationYear ||
        this.updateData.publicationYear < 1900 ||
        this.updateData.publicationYear > 2025 ||
        !this.updateData.durationInSeconds ||
        this.updateData.durationInSeconds <= 0) {

        alert("Please fill in all fields with valid values. PublicationYear must be 1900–2025");
        return;
    }

    // Artist length check
    if (this.updateData.artist.trim().length < 2) {
        alert("Artist name must be at least 2 characters");
        return;
    }

    const url = baseUrl + "/" + this.updateData.id;

    try {
        const response = await axios.put(
            url,
            this.updateData,
            { headers: { Authorization: "Bearer " + this.token } }
        );

        this.updateMessage = "Response " + response.status + " " + response.statusText;

        // Reset form
        this.updateData = {
            id: null,
            title: "",
            artist: "",
            publicationYear: null,
            durationInSeconds: null
        };

        // Refresh list
        this.getRecords();

    } catch (ex) {
        alert(ex.message);
    }
}

    },

    mounted() {
        this.getRecords();
    }
}).mount("#app");