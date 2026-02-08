const API = {
    async register(name, email, password, role = 'user') {
        const response = await fetch(API_ENDPOINTS.register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        return await response.json();
    },

    async login(email, password) {
        const response = await fetch(API_ENDPOINTS.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        
        return data;
    },

    async getAllTVs(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_ENDPOINTS.tvs}?${params}`);
        return await response.json();
    },

    async getTVById(id) {
        const response = await fetch(API_ENDPOINTS.tvById(id));
        return await response.json();
    },

    async createTV(tvData) {
        const response = await fetch(API_ENDPOINTS.tvs, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(tvData)
        });
        return await response.json();
    },

    async updateTV(id, tvData) {
        const response = await fetch(API_ENDPOINTS.tvById(id), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(tvData)
        });
        return await response.json();
    },

    async deleteTV(id) {
        const response = await fetch(API_ENDPOINTS.tvById(id), {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async updateStock(id, value) {
        const response = await fetch(API_ENDPOINTS.tvStock(id), {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ value })
        });
        return await response.json();
    },

    async addReview(tvId, rating, comment) {
        const response = await fetch(API_ENDPOINTS.tvReview(tvId), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ rating, comment })
        });
        return await response.json();
    },

    async deleteReview(tvId, reviewId) {
        const response = await fetch(API_ENDPOINTS.deleteReview(tvId, reviewId), {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async getBrandsStats() {
        const response = await fetch(API_ENDPOINTS.tvBrandsStats);
        return await response.json();
    },

    // Order APIs
    async createOrder(items) {
        const response = await fetch(API_ENDPOINTS.orders, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ items })
        });
        return await response.json();
    },

    async getMyOrders() {
        const response = await fetch(API_ENDPOINTS.myOrders, {
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async getAllOrders(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_ENDPOINTS.orders}?${params}`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async cancelOrder(orderId) {
        const response = await fetch(API_ENDPOINTS.cancelOrder(orderId), {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async updateOrderStatus(orderId, status) {
        const response = await fetch(API_ENDPOINTS.updateOrderStatus(orderId), {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        return await response.json();
    },

    async getOrderStats() {
        const response = await fetch(API_ENDPOINTS.orderStats, {
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    // Stats APIs
    async getSalesStats() {
        const response = await fetch(API_ENDPOINTS.salesStats, {
            headers: getAuthHeaders()
        });
        return await response.json();
    }
};