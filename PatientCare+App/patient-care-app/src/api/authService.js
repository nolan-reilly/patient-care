import { storeDoctorName } from "./doctorActions";
import { storePatientName } from "./patientActions";

// set the environment to dev for development
const env = "prod"; // change to 'prod' for production

// FUNCTIONS FOR HANDLING LOGIN AND REGISTRATION ATTEMPTS
let base_url = 'https://localhost:7238/api/'

// generic function that the react page will use on form completion
export async function register(register_info) {
    try {
        if (register_info.role === 'Doctor') {
            await httpDoctorRegister(register_info);
        }
        else {
            await httpPatientRegister(register_info);
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// only register() can call this function, specific for doctor registration
async function httpDoctorRegister(register_info) {
    const extended_url = base_url + 'Account/register';
    
    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(register_info)
    });

    if (!response.ok) {
        // Extract error message
        const errorDetails = await response.json();
        throw new Error(`Doctor registration failed: ${errorDetails[0].code} ${errorDetails[0].description}`);
    }

    // register successful so we will automatically log user in
    await httpDoctorLogin({
        username: register_info.email,
        password: register_info.password
    });

}

// only register() can call this function, specific for patient registration
async function httpPatientRegister(register_info) {
    const extended_url = base_url + 'Account/register';
    
    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(register_info)
    });

    if (!response.ok) {
        // Extract the error message from the response
        const errorDetails = await response.json();
        throw new Error(`Patient registration failed: \n  ${errorDetails[0].code}\n  ${errorDetails[0].description}`);
    }

    // register successful so we will automatically log user in
    await httpPatientLogin({
        username: register_info.email,
        password: register_info.password
    });
}

// generic function that the react page will use on form completion
export async function login(user_type, account_info) {
    try {
        if (user_type === 'Doctor') {
            await httpDoctorLogin(account_info);
        }
        else {
            await httpPatientLogin(account_info);
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// only login() can call this function, specific for doctor login attempt
async function httpDoctorLogin(account_info) {

    if (env === 'dev') {
        sessionStorage.setItem('token', 'dev_token');
        sessionStorage.setItem('role', 'Doctor');
        sessionStorage.setItem('email', 'dev@test.com');
        return;
    }
    const extended_url = base_url + 'Account/login';

    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(account_info)
    });

    if (!response.ok) {
        // Extract error message from response
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails.title}`);
    }

    // else get the token and save it to session storage
    const data = await response.json();
    const token = data.token;
    const role = data.userRole;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('email', account_info.username);

    try {
        await storeDoctorName();
    }
    catch (error) {
        console.log(error.message);
    }
}

// only login() can call this function, specific for patient login attempt
async function httpPatientLogin(account_info) {
    const extended_url = base_url + 'Account/login';

    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(account_info)
    });

    if (!response.ok) {
        // Extract error message from response
        const errorDetails = await response.json();
        throw new Error(`Patient login failed: ${errorDetails.title}`);
    }

    // since request was successful, extract token and store it
    const data = await response.json();
    const token = data.token;
    const role = data.userRole;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('email', account_info.username);

    try {
        await storePatientName();
    }
    catch (error) {
        console.log(error.message);
    }
}
