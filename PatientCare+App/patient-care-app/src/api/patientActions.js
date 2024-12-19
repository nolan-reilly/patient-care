// Base url for making all api calls
let base_url = 'https://localhost:7238/api/';

export async function fullPatientRegistration(info) {
    const extended_url = base_url + 'PatientAccount/register';

    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(info)
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }
}

export async function storePatientName() {
    const extended_url = base_url + 'PatientAccount/get-patient-login-info';

    const response = await fetch(extended_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }

    const data = await response.json();
    sessionStorage.setItem('name', `${data.firstName} ${data.lastName}`)
}

export async function submitHealthData(data) {
    const extended_url = base_url + 'PatientAccount/create/healthData';

    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }
}

export async function getHealthData() {
    const extended_url = base_url + 'PatientAccount/get-all-health-data'

    const response = await fetch(extended_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

   
    try {
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error: ${errorDetails}`)
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error(`Error: Response not in JSON format...`)
    }
}

export async function getAllDoctors() {
    const extended_url = base_url + 'PatientAccount/get-all-doctors';

    const response = await fetch(extended_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function getMyDoctors() {
    const extended_url = base_url + 'PatientAccount/get-my-doctors';

    const response = await fetch(extended_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function addDoctor(doctor_info) {
    const extended_url = base_url + 'PatientAccount/add/new-doctor';

    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(doctor_info)
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }
}

export async function getPatientProfileInfo() {
    const extended_url = base_url + 'PatientAccount/get-patient-display-profile';

    const response = await fetch(extended_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }

    const data = await response.json();
    return data;
}

export async function getPatientHealthRecord() {
    const extended_url = base_url + 'PatientAccount/get-health-record';

    const response = await fetch(extended_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }

    const data = await response.json();
    return data;
}

export async function removeDoctor(doctor_info) {
    const extended_url = base_url + 'PatientAccount/remove-from-patient-network';

    const response = await fetch(extended_url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(doctor_info)
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }
}