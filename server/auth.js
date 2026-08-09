const jwt = require("jsonwebtoken");
require('dotenv').config();
const db_functions = require('./db');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { create } = require("domain");
const isEmail = require("validator/lib/isEmail");

const {
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
} = require("./error");








// creating access token 

const access_create_token = (username, email) => {
    const token = jwt.sign(
        {
            username: username,
            email: email
        },
        process.env.ACCESS_JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )
    return token;
}

// creating refresh token 

const refresh_create_token = (username, email) => {
    const token = jwt.sign(
        {
            username: username,
            email: email,
            jti: crypto.randomUUID()
        },
        process.env.REFRESH_JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    return token;
}





// function for checking eamil availability by query the data base

async function check_email_availability(email) {

    let email_availability = await db_functions.check_email_indb(email);

    return email_availability;

}



// function for checking phone number availability by query the data base

async function check_phone_number_availability(phone_number) {

    let phone_no_availibility = db_functions.check_phone_number_indb(phone_number);

    return phone_no_availibility;

}




// function for checking username availability by query the data base

async function check_username_availability(username) {

    let username_availability = db_functions.check_username_indb(username);

    return username_availability;

}





// function for making user signup

async function making_user_signup(

    user_email,
    user_phone_no,
    user_username,
    user_pass_unhash,
    device_info

) {

    try {

        // hashing the password

        let user_pass_hash = await bcrypt.hash(user_pass_unhash, 10)

        const check_phone_no = await db_functions.check_phone_number_indb(user_phone_no)

        if(!check_phone_no){
            throw new ConflictError('This phone number is already associated with an account. Please use a different phone number.')
        }

        let inserted_cred_status = await db_functions.inserting_cred_indb(

            user_email,
            user_phone_no,
            user_username,
            user_pass_hash

        )

        if (inserted_cred_status.inserting_cred_indb_status) {

            const refresh_token_storing_service_status = await refresh_token_storing_service(user_username, user_email, device_info)

            // console.log(refresh_token_storing_service_status)

            let access_token = refresh_token_storing_service_status.access_token;
            let refresh_token = refresh_token_storing_service_status.refresh_token;

            // console.log(`refresh token ${refresh_token}
            // access token ${access_token}`)

            return {
                access_token: access_token,
                refresh_token: refresh_token,
                making_user_signup_status: true
            };

        }

    } catch (error) {

        throw error
        
    }

}







// function for hashing the refresh token

function creat_refresh_token_hash(refresh_token) {
    try {

        let refresh_token_hash = crypto
            .createHash('sha256')
            .update(refresh_token)
            .digest('hex')

        return {
            refresh_token_hash: refresh_token_hash
        }

    } catch (error) {

        console.log(error)

    }
}






// function for finding the creation time and expiry time of jwt refresh token

function get_create_at_and_expire_at(refresh_token) {

    const decoded = jwt.decode(refresh_token);

    const created_at = new Date(decoded.iat * 1000)
    const expire_at = new Date(decoded.exp * 1000)

    return {
        created_at: created_at,
        expire_at: expire_at
    }

}






// storing the refresh token in db with the created time and expriry time by making Orchestration

async function refresh_token_storing_service(username, user_email, device_info) {

    const access_token = access_create_token(username, user_email);

    const refresh_token = refresh_create_token(username, user_email);

    const created_time_and_expire_time = get_create_at_and_expire_at(refresh_token);

    const create_at = created_time_and_expire_time.created_at;

    const expire_at = created_time_and_expire_time.expire_at;

    const divice_info = device_info;

    const refresh_token_hash = creat_refresh_token_hash(refresh_token);

    //  console.log(`refresh token hash = ${refresh_token_hash.refresh_token_hash}`)

    const user_uuid = await db_functions.get_user_uuid(username);

    try {

        const inserted_refresh_token_status = await db_functions.insert_refresh_token_hash_indb(user_uuid, refresh_token_hash.refresh_token_hash, divice_info, create_at, expire_at)

        if (inserted_refresh_token_status.insert_refresh_token_hash_indb_status) {

            // console.log(`moving forword to return tokens`) 

            return {
                access_token: access_token,
                refresh_token: refresh_token,
                refresh_token_storing_service_status: true
            }

        } else {
            return {
                refresh_token_storing_service_status: false
            }
        }

    } catch (error) {
        console.log(error)
    }


}















//  LOGIN CODE

// function for finding the data is username or email

function check_isemail(email) {

    let is_email = isEmail(email);

    if (is_email) {

        return true;

    } else {

        return false;

    }

}





// verify password for succesfull login

async function verify_pass(password, hash_password) {

    let Is_vaild = await bcrypt.compare(
        password,
        hash_password
    );

    return Is_vaild;

}






// making the user login

async function making_user_login(email_or_username, password, device_info) {

    let is_email = check_isemail(email_or_username)
    let hash_password;
    let verify_password;

    // if user use email for login then this code will run
    if (is_email) {

        let username = await db_functions.get_username_by_email(email_or_username)

        hash_password = await db_functions.get_pass_hash_by_email(email_or_username)

        verify_password = await verify_pass(
            password,
            hash_password
        )

        if (verify_password) {

            const refresh_token_storing_service_status = await refresh_token_storing_service(username, email_or_username, device_info)

            // console.log(refresh_token_storing_service_status)

            let access_token = refresh_token_storing_service_status.access_token;
            let refresh_token = refresh_token_storing_service_status.refresh_token;

            // console.log(`refresh token ${refresh_token}
            // access token ${access_token}`)

            return {
                access_token: access_token,
                refresh_token: refresh_token,
                making_user_login_status: true
            };

        } else {

            throw new UnauthorizedError('Invalid credentials.')

        }

    } else {

        let email = await db_functions.get_email_by_username(email_or_username)

        hash_password = await db_functions.get_pass_hash_by_username(email_or_username)

        verify_password = await verify_pass(
            password,
            hash_password
        )

        if (verify_password) {

            const refresh_token_storing_service_status = await refresh_token_storing_service(email_or_username, email, device_info)

            // console.log(refresh_token_storing_service_status)

            let access_token = refresh_token_storing_service_status.access_token;
            let refresh_token = refresh_token_storing_service_status.refresh_token;

            // console.log(`refresh token ${refresh_token}
            // access token ${access_token}`)
            return {
                access_token: access_token,
                refresh_token: refresh_token,
                making_user_login_status: true
            };

        } else {

            throw new UnauthorizedError('Invalid credentials.')

        }
    }

}







// GETTING THE EMAIL FROM THE EXPIRY Atoken

async function Get_Email_and_USER_in_accessT(access_token) {

    const decode = await jwt.decode(access_token)

    const email = decode.email

    const username = decode.username

    return {
        email: email,
        username: username
    }

}



// getting the email from refresh token

async function Get_Email_and_USER_in_refreshT(refresh_token) {

    const decode = await jwt.decode(refresh_token)

    const email = decode.email

    const username = decode.username


    return {
        email: email,
        username: username
    }

}





// MAKING THE ROTATION LOGIC OF REFRESH TOKEN

async function rotate_Rtoken_fnc(old_Rtoken, username, email) {

    try {

        let old_Rtoken_hash = await creat_refresh_token_hash(old_Rtoken).refresh_token_hash

        let new_Rtoken = refresh_create_token(username, email)
        let new_Atoken = access_create_token(username, email)

        let new_Rtoken_hash = await creat_refresh_token_hash(new_Rtoken).refresh_token_hash

        //console.log(old_Rtoken_hash, new_Rtoken_hash)

        await db_functions.rotate_Rtoken_indb(old_Rtoken_hash, new_Rtoken_hash)

        return {
            access_token: new_Atoken,
            refresh_token: new_Rtoken,
            rotate_Rtoken_fnc_status: true
        }


    } catch (error) {
        console.log(error)
        // fix the error that when the new r token is updated it does not change the created time and expiry time
        return {
            rotate_Rtoken_fnc_status: false
        }
    }
}






// LOGIC FOR LOGOUT

async function logout_user_fnc(R_token) {

    try {

        const R_token_hash = await creat_refresh_token_hash(R_token).refresh_token_hash

        const delete_r_token_status = await db_functions.delete_r_token_indb(R_token_hash)

        console.log(delete_r_token_status, 'in auth.js')

        return delete_r_token_status

    } catch (error) {
        console.log(error)
    }
}














module.exports = {
    check_email_availability,
    check_phone_number_availability,
    check_username_availability,
    making_user_signup,
    making_user_login,
    Get_Email_and_USER_in_accessT,
    Get_Email_and_USER_in_refreshT,
    rotate_Rtoken_fnc,
    logout_user_fnc
}




