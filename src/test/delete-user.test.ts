import {User, UserData} from "./models";
import {ApiUtils} from "./api-utils";
import {getRandomEmail} from "./utils";

describe('Delete user operations', () => {

    let testUser: User;

    beforeEach(async () => {
        const testUserData: UserData = {
            name: 'Test User',
            email: getRandomEmail(),
            gender: 'male',
            status: 'active',
        }
        const response = await ApiUtils.createUser(testUserData);
        testUser = response.body;
    });

    //Delete the user - DELETE - positive scenario
    it('should delete the user', async () => {
        const response = await ApiUtils.deleteUser(testUser.id);
        expect(response.status).toBe(204);
        const responseGet = await ApiUtils.getUser(testUser.id);
        expect(responseGet.status).toBe(404);
    });

    //Delete the user twice - DELETE - 404
    it('should delete the user twice', async () => {
        const response = await ApiUtils.deleteUser(testUser.id);
        expect(response.status).toBe(204);
        const responseGet = await ApiUtils.getUser(testUser.id);
        expect(responseGet.status).toBe(404);
        const response2 = await ApiUtils.deleteUser(testUser.id);
        expect(response2.status).toBe(404);
    });

});
