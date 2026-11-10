export const useAuth = () => {
    return localStorage.getItem("token");
};
// For small projects, reading localStorage.getItem("token") directly in AdminProtectedRoute is perfectly acceptable. For larger applications, an AuthContext is the recommended architecture.