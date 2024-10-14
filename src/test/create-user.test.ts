import {User, UserData} from "./models";
import {ApiUtils} from "./api-utils";
import {getRandomEmail} from "./utils";
import request, {Response} from 'supertest';

describe('Create user operations', () => {

    let testUser: User;
    const api = request('https://gorest.co.in/public/v2');
    const testUserData: UserData = {
        name: 'Test User',
        email: getRandomEmail(),
        gender: 'male',
        status: 'active',
    }

    // Create a new user - POST - positive scenario
    it('should create a new user', async () => {
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
        expect(response.status).toBe(201);
        expect(testUser).toMatchObject(testUserData);
        expect(testUser).toHaveProperty('id');
        const responseGet = await ApiUtils.getUser(response.body.id);
        expect(responseGet.status).toBe(200);
        expect(responseGet.body).toHaveProperty('id', response.body.id);
        expect(responseGet.body).toMatchObject(testUserData);
    });

    // Create a new user with the same data - POST - Error 422
    it('error 422, create a new user with the same data', async () => {
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'email');
        expect(response.body[0]).toHaveProperty('message', 'has already been taken');
    });
     
    // Create a new user with invalid name - POST - Error 422
    it('error 422, with invalid name', async () => {
        const testUserData: UserData = {
            name:'',
            email: getRandomEmail(),
            gender: 'male',
            status: 'inactive'
        }
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'name');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank');
    });

    // Create a new user without email - POST - Error 422
    it('error 422, user without email', async () => {
        const testUserData: UserData = {
            name: 'Test User',
            gender: 'male',
            status: 'active'
        }
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'email');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank');
    });

    // Create a new user with invalid email - POST - Error 422
    it('error 422, user with invalid email', async () => {
        const testUserData: UserData = {
            name: 'Test User',
            email: 'cat',
            gender: 'male',
            status: 'active'
        }
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'email');
        expect(response.body[0]).toHaveProperty('message', 'is invalid');
    });

    // Create a new user with invalid gender - POST - Error 422
    it('error 422, with invalid gender', async () => {
        const testUserData: UserData = {
            name: 'Test User',
            email: getRandomEmail(),
            gender: 'dog',
            status: 'active'
        }
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'gender');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank, can be male of female');
    });

    // Create a new user with invalid status - POST - Error 422
    it('error 422, with invalid status', async () => {
        const testUserData: UserData = {
            name: 'Test User',
            email: getRandomEmail(),
            gender: 'male',
            status: 'owl'
        }
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'status');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank');
    });

    // Create a new user without token - POST - Error 401
    it('authentication error 401 while creating new user', async () => {
        const response = await api
            .post('/users/')
            .send(testUserData);
        expect(response.status).toBe(401);
    });

    // Send request to wrong URL - POST - Error 422
    it('error 404, the requested resource does not exist.', async () => {
        const response = await api
            .post('/users/123')
            .send(testUserData);
        expect(response.status).toBe(404);
    });


});
