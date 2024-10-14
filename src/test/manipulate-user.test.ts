import {User, UserData} from "./models";
import {ApiUtils} from "./api-utils";
import {getRandomEmail} from "./utils";

describe('Manipulate user operations', () => {

    let testUser: User;

    beforeEach(async () => {
        const testUserData: UserData = {
            name: 'Test User',
            email: getRandomEmail(),
            gender: 'male',
            status: 'active',
        }
        const response = await ApiUtils.createUser(testUserData);
        if (response.status !== 201) {
            throw Error(`Unable to create a test user: got the code ${response.status} (${response.body[0].field} | ${response.body[0].message})`);
        }
        testUser = response.body;
    });

    //Retrieve the list of users - GET - positive scenario
    it('should retrieve the list of users', async () => {
        const response = await ApiUtils.getPublicUsers();
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((user: User) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('gender');
            expect(user).toHaveProperty('status');
        });
        const firstUserInTheList: User = response.body[0];
        const responseGet = await ApiUtils.getUser(firstUserInTheList.id);
        expect(responseGet.status).toBe(200);
        expect(responseGet.body).toEqual(firstUserInTheList);
    });

    //Update the user - PUT - positive scenario
    it('should update the user', async () => {
        const testUserData: UserData = {
            name: 'Test User',
            email: getRandomEmail(),
            gender: 'male',
            status: 'active',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(testUserData);
        expect(response.body).toHaveProperty('id', testUser.id);
        const responseGet = await ApiUtils.getUser(testUser.id);
        expect(responseGet.body).toMatchObject(testUserData);
        expect(responseGet.body).toHaveProperty('id', testUser.id);
    });

    //Update one property of the user - PUT - positive scenario
    it('should update one property of the user', async () => {
        const testUserData: UserData = {
            status: 'inactive',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        // console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', testUserData.status);
        expect(response.body).toHaveProperty('id', testUser.id);
        expect(response.body).toHaveProperty('name', testUser.name);
        expect(response.body).toHaveProperty('email', testUser.email);
        expect(response.body).toHaveProperty('gender', testUser.gender);
        const responseGet = await ApiUtils.getUser(testUser.id);
        expect(responseGet.body).toMatchObject(response.body);
        expect(responseGet.body).toHaveProperty('id', testUser.id);
    });

    //Update two properties of the user - PUT - positive scenario
    it('should update two properties of the user', async () => {
        const testUserData: UserData = {
            name: 'Test User2',
            email: getRandomEmail()
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', testUserData.name);
        expect(response.body).toHaveProperty('email', testUserData.email);
        expect(response.body).toHaveProperty('id', testUser.id);
        expect(response.body).toHaveProperty('status', testUser.status);
        expect(response.body).toHaveProperty('gender', testUser.gender);
        const responseGet = await ApiUtils.getUser(testUser.id);
        expect(responseGet.body).toMatchObject(response.body);
        expect(responseGet.body).toHaveProperty('id', testUser.id);
    });

    //Update three properties of the user - PUT - positive scenario
    it('should update three properties of the user', async () => {
        const testUserData: UserData = {
            name: 'Test User2',
            email: getRandomEmail(),
            gender: 'female',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', testUserData.name);
        expect(response.body).toHaveProperty('email', testUserData.email);
        expect(response.body).toHaveProperty('gender', testUserData.gender);
        expect(response.body).toHaveProperty('id', testUser.id);
        expect(response.body).toHaveProperty('status', testUser.status);
        const responseGet = await ApiUtils.getUser(testUser.id);
        expect(responseGet.body).toMatchObject(response.body);
        expect(responseGet.body).toHaveProperty('id', testUser.id);
    });

    //Update the user with already used email- PUT - 422
    it('should update the user with already used email', async () => {
        const responseList = await ApiUtils.getPublicUsers();
        const firstUserInTheList: User = responseList.body[5];
        const testUserData: UserData = {
            name: 'Test User',
            email: firstUserInTheList.email,
            gender: 'female',
            status: 'inactive',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'email');
        expect(response.body[0]).toHaveProperty('message', 'has already been taken');
    });

    //Update the user with invalid email- PUT - 422
    it('should update the user with invalid email', async () => {
        const testUserData: UserData = {
            name: 'Anna',
            email: '123',
            gender: 'male',
            status: 'active',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'email');
        expect(response.body[0]).toHaveProperty('message', 'is invalid');
    });

    //Update the user with empty email- PUT - 422
    it('should update the user with empty email', async () => {
        const testUserData: UserData = {
            name: 'Anna',
            email: '',
            gender: 'male',
            status: 'active',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'email');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank');
    });

    //Update the user with empty name - PUT - 422
    it('should update the user with empty name', async () => {
        const testUserData: UserData = {
            name: '',
            email: getRandomEmail(),
            gender: 'male',
            status: 'active',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'name');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank');
    });

    //Update the user with invalid gender- PUT - 422
    it('should update the user with invalid gender', async () => {
        const testUserData: UserData = {
            name: 'Anna',
            email: getRandomEmail(),
            gender: 'cat',
            status: 'active',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'gender');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank, can be male of female');
    });

    //Update the user with invalid status- PUT - 422
    it('should update the user with invalid status', async () => {
        const testUserData: UserData = {
            name: 'Anna',
            email: getRandomEmail(),
            gender: 'male',
            status: 'owl',
        }
        const response = await ApiUtils.updateUser(testUser.id, testUserData);
        expect(response.status).toBe(422);
        expect(response.body[0]).toHaveProperty('field', 'status');
        expect(response.body[0]).toHaveProperty('message', 'can\'t be blank');
    });


});
