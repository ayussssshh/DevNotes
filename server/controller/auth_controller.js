const auth_functions = require('../auth')








// 1) controller for checking the DB that there is email is already exist or not 

const check_email_availability_controller = async (req, res, next) => {

    try {

        let email = req.body.user_email;

        let email_availability = await auth_functions.check_email_availability(email)

        if (email_availability) {

            res.json({
                exists: "available"
            })

        }

    } catch (error) {

        next(error)

    }

}






// 2) controller for checking phone.no

const check_phone_number_availability_controller = async (req, res, next) => {

    try {

        let phone_number = req.body.phone_no;

        let phone_no_availibility = await auth_functions.check_phone_number_availability(phone_number);

        if (phone_no_availibility) {

            res.json({
                phone_no: 'available'
            })

        }

    } catch (error) {

        next(error)

    }
}





// 3) controller for checking user name 

const check_username_availability_controller = async (req, res, next) => {

    try {

        let username = req.body.username;

        let username_availability = await auth_functions.check_username_availability(username);

        if (username_availability) {

            res.json({
                exists: "available"
            })

        }

    } catch (error) {
        next(error)
    }

}





// controller for making user signup

const user_signup_fnc = async (req, res, next) => {

    try {

        let user_email = req.body.user_email;
        let user_phone_no = req.body.phone_no;
        let user_username = req.body.user_username;
        let user_pass_unhash = req.body.user_pass;
        let device_info = req.user.os + ',' + ' ' + req.user.browser

        let signup_status = await auth_functions.making_user_signup(

            user_email,
            user_phone_no,
            user_username,
            user_pass_unhash,
            device_info
        )

        //console.log(signup_status)

        if (signup_status.making_user_signup_status) {

            let refresh_token = signup_status.refresh_token;
            let access_token = signup_status.access_token;

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                samesite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: false,
                samesite: "strict",
                maxAge: 1000 * 60 * 60
            })

            res.json({
                signup_status: "true"
            })

        }

    } catch (error) {
        next(error)
    }

}


















// LOGIN CODE

// controller for making user login

const user_login_fnc = async (req, res, next) => {

    try {

        let user_email_or_username = req.body.user_email_or_username;
        let password = req.body.password
        let device_info = req.user.os + ',' + ' ' + req.user.browser

        let login_status = await auth_functions.making_user_login(user_email_or_username, password, device_info)


        if (login_status.making_user_login_status) {

            let refresh_token = login_status.refresh_token;
            let access_token = login_status.access_token;

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                samesite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: false,
                samesite: "strict",
                maxAge: 1000 * 60 * 60
            })

            res.json({
                login_status: "true"
            })


        }

    } catch (error) {
        next(error)
    }

}





// Refresh token rotation controller

const rotate_Rtoken_cntl = async (req, res) => {


    console.log("starting controller for rotetion")

    const old_Atoken = req.cookies.access_token
    const old_Rtoken = req.cookies.refresh_token

    const old_Rtoken_payload = await auth_functions.Get_Email_and_USER_in_refreshT(old_Rtoken)

    console.log(old_Rtoken_payload)

    const username = old_Rtoken_payload.username
    // console.log(`controller ${username}`)
    const email = old_Rtoken_payload.email

    console.log(username, email)

    const rotate_Rtoken_fnc_status = await auth_functions.rotate_Rtoken_fnc(old_Rtoken, username, email)

    if (rotate_Rtoken_fnc_status.rotate_Rtoken_fnc_status) {

        let refresh_token = rotate_Rtoken_fnc_status.refresh_token;
        let access_token = rotate_Rtoken_fnc_status.access_token;

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false,
            samesite: "strict",
            maxAge: 1000 * 60 * 60
        })

        res.json({
            login_status: "true"
        })


    } else {
        res.json({
            rotation: "false"
        })
    }

}



// controller for making the user logout

const logout_user_cntl = async (req, res) => {

    console.log('logout contrl is being called')

    const R_token = req.cookies.refresh_token

    const logout_status = await auth_functions.logout_user_fnc(R_token)

    if (logout_status) {

        res.clearCookie('refresh_token')

        res.clearCookie('access_token')

        res.json({
            logout_status: "true"
        })

    } else {
        console.log('logut failed in controller')
        res.json({
            logout_status: "false"
        })
    }

}



module.exports = {

    check_email_availability_controller,
    check_phone_number_availability_controller,
    check_username_availability_controller,
    user_signup_fnc,
    user_login_fnc,
    rotate_Rtoken_cntl,
    logout_user_cntl
}



