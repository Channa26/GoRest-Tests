import request, {Response} from 'supertest';
import {UserData} from "./models";

const api = request('https://gorest.co.in/public/v2');
const token = process.env["TOKEN"];
if (!token) {
    throw Error("No TOKEN variable provided");
}

export namespace ApiUtils {

    export async function createUser(userData: UserData): Promise<Response> {
        return api
            .post('/users/')
            .set('Authorization', `Bearer ${token}`)
            .send(userData);
    }

    export async function getUser(id: number): Promise<Response> {
        return api
            .get('/users/' + id)
            .set('Authorization', `Bearer ${token}`)
            .send();
    }

    export async function updateUser(id: number, userData: UserData): Promise<Response> {
        return api
            .put('/users/' + id)
            .set('Authorization', `Bearer ${token}`)
            .send(userData);
    }

    export async function getPublicUsers(): Promise<Response> {
        return api.get('/users/');
    }

    export async function deleteUser(id: number): Promise<Response> {
        return api
            .delete(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);
    }

}
