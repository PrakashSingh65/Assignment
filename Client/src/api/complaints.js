import api from "./axios";


export const getComplaints = async () => {
    const response = await api.get("/complaints");

    return response.data;
};


export const createComplaint = async (data) => {
    const response = await api.post(
        "/complaints",
        data
    );

    return response.data;
};