import axios from "axios";

const base_url = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: `${base_url}`,
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
    }
});

const TodoService = {

    getAll: () => axiosInstance.get("/"),
    add: (data: { description: string }) => axiosInstance.post("/", data),
    delete: (id: string) => axiosInstance.delete(`/${id}`),
    update: (id: string) => axiosInstance.put(`/${id}`),
    deleteAllByIds: (ids: string[]) => axiosInstance.delete(`/`, { data: { ids } }),
    updateAllByIds: (ids: string[]) => axiosInstance.put(`/`, { ids })

}

export default TodoService;