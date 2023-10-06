import { InvalidDataError } from "../utils/error.js";
import { fetchAll, fetch } from "../utils/postgres.js";


export default class UserStatusService {
    static async getUserLastStatus (user_id) {
        if (!user_id) throw new InvalidDataError(500, "user_id is require!", "user_id");

        const last = await fetch(`
            SELECT * FROM statuses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1;
        `, user_id)

        return last;
    }

    static async getUserStatuses (user_id) {
        if (!user_id) throw new InvalidDataError(500, "user_id is require!", "user_id");

        const statuses = await fetchAll(`
            SELECT * FROM statuses WHERE user_id = $1 ORDER BY created_at DESC;
        `, user_id);

        return statuses;
    }

    static async insertUserStatus(user_id, status) {
        const foundUser = await fetch(`
            SELECT * FROM USERS WHERE id = $1 AND deleted_at IS NULL;
        `, user_id);
        if (!foundUser) throw new InvalidDataError(500, "user_id user is not found!", "user_id");
        
        const insertStatus = await fetch(`
            INSERT INTO statuses (user_id, status) VALUES ($1, $2) RETURNING *;
        `, user_id, status)
        
        return insertStatus; 
    }
}