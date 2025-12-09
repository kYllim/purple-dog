import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios'; // We'll use axios directly or a configured instance

// Helper to decode JWT payload (simple version, or use jwt-decode library if preferred)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);

    const isAuthenticated = computed(() => !!token.value);
    const userRole = computed(() => user.value?.role || null);
    const isAdmin = computed(() => userRole.value === 'ADMIN');
    const isPro = computed(() => userRole.value === 'PRO');

    function setToken(newToken) {
        token.value = newToken;
        localStorage.setItem('token', newToken);

        // Decode token to get basic user info (like role) if included in payload
        // OR we might want to fetch user profile from API instead
        const payload = parseJwt(newToken);
        if (payload) {
            // Assuming payload has { id, email, role }
            setUser({
                id: payload.userId || payload.id,
                email: payload.email,
                role: payload.role
            });
        }
    }

    function setUser(userData) {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(userData));
    }

    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: redirect to home handled by component calling this
    }

    // Example login action
    async function login(email, password) {
        try {
            // Replace with your actual API endpoint
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            const { token: apiToken, user: apiUser } = response.data;

            setToken(apiToken);
            // If the API returns the user object directly, use it. 
            // Otherwise setToken tries to decode it from JWT.
            if (apiUser) {
                setUser(apiUser);
            }

            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    }

    return {
        token,
        user,
        isAuthenticated,
        userRole,
        isAdmin,
        isPro,
        login,
        logout
    };
});
