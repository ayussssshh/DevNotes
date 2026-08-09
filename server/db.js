const pool = require("./dbconfig");

const {
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
} = require("./error")



// running a query in data base for checking the emai

async function check_email_indb(email) {

    try {
        const result = await pool.query("SELECT email FROM users WHERE email = $1 LIMIT 1",
            [email]
        )
        if (result.rows.length > 0) {

            throw new ConflictError('This email address is already associated with an account. Please use a different email address.')

            return false;

        } else {

            return true;

        }
    } catch (error) {
        throw error
    }

}




// running a query in data base for checking the phone number is exist more then 3 times or not

async function check_phone_number_indb(phone_number) {

    try {

        let result = await pool.query("SELECT COUNT(*) FROM users WHERE phone_number = $1",
            [phone_number]
        )
        count = Number(result.rows[0].count);
        if (count < 3) {

            return true

        } else {

            throw new ConflictError('This phone number is already associated with an account. Please use a different phone number.')

            return false
        }

    } catch (error) {

        throw error

    }
}




// running a query in data base for checking the username is exist already or not

async function check_username_indb(username) {

    try {
        const result = await pool.query("SELECT username FROM users WHERE username = $1 LIMIT 1",
            [username]
        )
        if (result.rows.length > 0) {

            throw new ConflictError('This username is already taken. Please choose a different username.')

            return false

        } else {

            return true

        }
    } catch (error) {
        throw error
    }

}




// function for inserting the user cred in data base 


async function inserting_cred_indb(
    user_email,
    user_phone_no,
    user_username,
    user_pass_hash
) {

    try {

        const result = await pool.query("INSERT INTO users(email , username , phone_number , hash_password) VALUES($1,$2,$3,$4)",
            [user_email, user_username, user_phone_no, user_pass_hash]
        )

        return {
            inserting_cred_indb_status: true
        };

    } catch (error) {

            if (error.code === "23505") {
                switch (error.constraint) {
                    case "users_email_key":
                        throw new ConflictError("Email is already registered.");

                    case "users_username_key":
                        throw new ConflictError("Username is already taken.");

                    default:
                        throw new ConflictError("Duplicate value.");
                }
            }

            throw error;
        }

}




// function for storing the refresh token in Data base

async function insert_refresh_token_hash_indb(user_id, refresh_token_hash, device_info, created_time, expire_time) {

    try {

        //console.log(`starting the function for inserting the refresh token in db ${user_id} ${refresh_token_hash} ${device_info} ${created_time} ${expire_time}`)

        const result = await pool.query("INSERT INTO refresh_tokens(user_id , token_hash , device_info , created_at , expires_at) VALUES($1,$2,$3,$4,$5)",
            [user_id, refresh_token_hash, device_info, created_time, expire_time]
        )

        return {
            insert_refresh_token_hash_indb_status: true
        }

    } catch (error) {

        console.log(error)

        return {
            insert_refresh_token_hash_indb_status: false
        }

    }

}





// function for getting user uuid by query the database by username

async function get_user_uuid(username) {
    try {

        console.log(username)

        const result = await pool.query("SELECT user_id FROM users WHERE username = $1 LIMIT 1",
            [username]
        )

        //console.log(result)

        // make a if statment for preventing when user not found and rows are null

        let user_id = result.rows[0].user_id;

        console.log(user_id)

        return user_id;

    } catch (error) {
        console.log(error)
    }
}




// getting the pass hash by email

async function get_pass_hash_by_email(email) {

    try {

        const result = await pool.query("SELECT hash_password FROM users WHERE email = $1 LIMIT 1",
            [email]
        )

        return result.rows[0].hash_password;

    } catch (error) {
        console.log(error)
    }

}






// getting password hash by username

async function get_pass_hash_by_username(username) {

    try {

        const result = await pool.query("SELECT hash_password FROM users WHERE username = $1 LIMIT 1",
            [username]
        )

        return result.rows[0].hash_password

    } catch (error) {
        console.log(error)
    }

}




// function for getting the username by email

async function get_username_by_email(email) {

    try {

        const result = await pool.query('SELECT username FROM users WHERE email = $1',
            [email]
        )

        if(result.rowCount == 0) {
            throw new UnauthorizedError('Invalid credentials.')
        }

        return result.rows[0].username

    } catch (error) {
        throw error
    }

}



// function for getting the email by username

async function get_email_by_username(username) {

    try {

        const result = await pool.query('SELECT email FROM users WHERE username = $1',
            [username]
        )

        if(result.rowCount == 0){
            throw new UnauthorizedError('Invalid credentials.')
        }

        return result.rows[0].email

    } catch (error) {
        
        throw error
    }

}



// function for updating the refresh token

async function rotate_Rtoken_indb(old_Rtoken_hash, new_Rtoken_hash) {

    try {

        const result = await pool.query("UPDATE refresh_tokens SET token_hash = $1 WHERE token_hash = $2",
            [new_Rtoken_hash, old_Rtoken_hash]
        )

    } catch (error) {
        console.log(error)
    }

}





// function for deleteing the refresh token in db

async function delete_r_token_indb(R_token_hash) {

    try {

        const result = await pool.query("DELETE FROM refresh_tokens WHERE token_hash = $1",
            [R_token_hash]
        )

        console.log(result)

        if (result.rowCount === 1) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }

}













// LOGIC FOR NOTES 

// getting the notes for a perticular user

async function get_notes_indb(user_id, last_update_time, note_id) {

    if (last_update_time == null) {

        console.log('last upedated note is not workig in db')

        try {

            const result = await pool.query("SELECT note_id, content, title, subject, tags, TO_CHAR(created_at, 'DD/MM/YY') AS created_date, TO_CHAR(created_at, 'HH24:MI') AS created_time, favorite, archived, trashed FROM notes WHERE user_id = $1 AND pinned = 'false' AND trashed = 'false' ORDER BY updated_at DESC LIMIT 40",
                [user_id]
            )

            return result.rows

        } catch (error) {
            console.log(error)
        }
    }

    if (last_update_time !== null) {

        console.log('last upedated note is workig in db')

        console.log(user_id, last_update_time, note_id)

        try {

            const result = await pool.query("SELECT note_id, content, title, subject, tags, TO_CHAR(created_at, 'DD/MM/YY') AS created_date, TO_CHAR(created_at, 'HH24:MI') AS created_time, favorite FROM notes WHERE user_id = $1 AND pinned = 'false' AND trashed = 'false' AND (updated_at, note_id) < ($2, $3) ORDER BY updated_at DESC LIMIT 40",
                [user_id, last_update_time, note_id]
            )

            //console.log(result.rows)

            return result.rows

        } catch (error) {
            console.log(error)
        }

    }

}



// function for getting the archive note in db


async function get_archive_note_indb(user_id) {

    try {

        const result = await pool.query("SELECT note_id, content, title, subject, tags, TO_CHAR(created_at, 'DD/MM/YY') AS created_date, TO_CHAR(created_at, 'HH24:MI') AS created_time, favorite FROM notes WHERE user_id = $1 AND pinned = 'false' AND archived = 'true' ORDER BY updated_at DESC LIMIT 40",
            [user_id]
        )

        return result.rows

    } catch (error) {
        console.log(error)
    }

}



// getting trash note in db

async function get_trash_note_indb(user_id) {

    try {

        const result = await pool.query("SELECT note_id, content, title, subject, tags, TO_CHAR(created_at, 'DD/MM/YY') AS created_date, TO_CHAR(created_at, 'HH24:MI') AS created_time, favorite FROM notes WHERE user_id = $1 AND pinned = 'false' AND trashed = 'true' ORDER BY updated_at DESC LIMIT 40",
            [user_id]
        )

        return result.rows

    } catch (error) {
        console.log(error)
    }

}



// function for getting the pinned note in db

async function get_pinned_notes_indb(user_id) {

    try {

        const result = await pool.query("SELECT note_id, content, title, subject, tags, TO_CHAR(created_at, 'DD/MM/YY') AS created_date, TO_CHAR(created_at, 'HH24:MI') AS created_time, favorite FROM notes WHERE user_id = $1 AND pinned = 'true' ORDER BY updated_at DESC LIMIT 40",
            [user_id]
        )

        return result.rows

    } catch (error) {
        console.log(error)
    }

}


// function for getting timestamp using the note id

async function get_timestamp_by_note_id(note_id) {

    try {

        const result = await pool.query("SELECT updated_at FROM notes WHERE note_id = $1",
            [note_id]
        )

        return result.rows[0].updated_at

    } catch (error) {
        console.log(error)
    }

}





// function for saving a new note in db

async function save_note_indb(user_id, title, subject, note_main_contant) {

    try {

        const result = pool.query("INSERT INTO notes (user_id, title, subject, content) VALUES ($1, $2, $3, $4)",
            [user_id, title, subject, note_main_contant]
        )

    } catch (error) {
        console.log(error)
    }

}





// function for updating the note updating/saving changes

async function update_note_indb(note_id, title, subject, note_main_contant) {

    try {

        console.log(note_id)

        const result = await pool.query(" UPDATE notes SET title = $1, subject = $2, content = $3, updated_at = NOW() WHERE note_id = $4",
            [title, subject, note_main_contant, note_id]
        )

    } catch (error) {
        console.log(error)
    }

}




// function for deleting the note

async function delete_note_indb(note_id) {

    try {

        const result = await pool.query("DELETE FROM notes WHERE note_id = $1",
            [note_id]
        )

        if (result.rowCount == 1) {

            return true

        } else {
            return false
        }

    } catch (error) {

    }

}


// funtion for making the note to trash 

async function set_trash_indb(note_id, trash_status) {

    try {

        const result = await pool.query("UPDATE notes SET trashed = $1, delete_at = NOW() + INTERVAL '30 days' WHERE note_id = $2",
            [trash_status, note_id]
        )

        if (result.rowCount == 1) {

            return true

        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }

}




// deleting the trash note after 30 days

async function delete_trash_note_indb(user_id) {

    try {

        const result = await pool.query("DELETE FROM notes WHERE user_id = $1 AND delete_at IS NOT NULL AND delete_at <= NOW();", [user_id])

    } catch (error) {
        console.log(error)
    }

}


// function for making note to archive

async function set_archive_indb(note_id, archive_status) {

    try {

        const result = pool.query("UPDATE notes SET archived = $1  WHERE note_id = $2",
            [archive_status, note_id]
        )

        if (result.rowCount == 1) {

            return true

        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }

}


// function for making note to pinned

async function set_pinned_indb(note_id, pinned_status) {

    try {

        const result = pool.query("UPDATE notes SET pinned = $1  WHERE note_id = $2",
            [pinned_status, note_id]
        )

        if (result.rowCount == 1) {

            return true

        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }

}


// function for making note to fav

async function set_fav_indb(note_id, fav_status) {

    try {

        const result = pool.query("UPDATE notes SET favorite = $1  WHERE note_id = $2",
            [fav_status, note_id]
        )

        if (result.rowCount == 1) {

            return true

        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }

}



// function for getting only one note

async function get_one_note_indb(note_id) {

    try {

        const result = await pool.query("SELECT content, title, subject, tags, TO_CHAR(created_at, 'DD/MM/YY') AS created_date, TO_CHAR(created_at, 'HH24:MI') AS created_time, favorite, pinned, archived, trashed FROM notes WHERE note_id = $1",
            [note_id]
        )

        return result.rows

    } catch (error) {
        console.log(error)
    }

}





// function for add tags in db

async function add_tag_indb(note_id, tag_name) {

    try {

        const result = await pool.query("UPDATE notes SET tags = array_append(tags, $2) WHERE note_id = $1 AND cardinality(tags) < 3 AND NOT ($2 = ANY(tags))", [note_id, tag_name])

        console.log(result.rowCount)

        if (result.rowCount == 1) {

            return true

        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }

}






// function for deleting the tags in db


async function delete_tags_indb(note_id, tag_name) {

    try {

        const result = pool.query("UPDATE notes SET tags = array_remove(tags, $2) WHERE note_id = $1",
            [note_id, tag_name]
        )

        console.log(result.rowCount)

        if (result.rowCount == 1) {

            return true

        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }

}





// logic for searching the by title

async function search_note_by_title_indb(user_id, query_string) {

    try {

        const result = await pool.query("SELECT note_id, content, title, subject, tags, TO_CHAR(created_at, 'DD/MM/YY') AS created_date, TO_CHAR(created_at, 'HH24:MI') AS created_time, favorite, ts_rank(title_search, to_tsquery('english', $2)) AS rank FROM notes WHERE user_id = $1 AND title_search @@to_tsquery('english', $2) ORDER BY rank DESC LIMIT 20",
            [user_id, query_string]
        )

        return result.rows

    } catch (error) {
        console.log(error)
    }

}




module.exports = {
    check_email_indb,
    check_phone_number_indb,
    check_username_indb,
    inserting_cred_indb,
    insert_refresh_token_hash_indb,
    get_user_uuid,
    get_pass_hash_by_email,
    get_pass_hash_by_username,
    rotate_Rtoken_indb,
    get_notes_indb,
    get_archive_note_indb,
    get_trash_note_indb,
    update_note_indb,
    get_username_by_email,
    get_email_by_username,
    get_one_note_indb,
    get_timestamp_by_note_id,
    delete_r_token_indb,
    save_note_indb,
    delete_note_indb,
    set_trash_indb,
    set_archive_indb,
    set_pinned_indb,
    set_fav_indb,
    get_pinned_notes_indb,
    search_note_by_title_indb,
    add_tag_indb,
    delete_tags_indb,
    delete_trash_note_indb
}