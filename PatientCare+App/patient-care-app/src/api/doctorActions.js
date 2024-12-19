// Base url for making all api calls
let base_url = 'https://localhost:7238/api/';

export async function fullDoctorRegistration(info) {
    const extended_url = base_url + 'DoctorAccount/register';

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
        throw new Error(`Error: ${errorDetails}`)
    }
}

export async function storeDoctorName() {
    const extended_url = base_url + 'DoctorAccount/get-doctor-login-info';

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

export async function getDoctorUrgentCareList() {
    const extended_url = base_url + 'DoctorAccount/get-urgent-care-list';

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

export async function addPatientToUrgentCare(patient_info) {
    const extended_url = base_url + 'DoctorAccount/add-to-urgent-care';

    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(patient_info)
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }
}

export async function removePatientFromUrgentCare(patient_info) {
    const extended_url = base_url + 'DoctorAccount/remove-from-urgent-care';

    const response = await fetch(extended_url, {
        method: 'Delete',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(patient_info)
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }
}

export async function getDoctorProfileInfo() {
    const extended_url = base_url + 'DoctorAccount/get-doctor-display-profile'

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

export async function getMyPatientsData() {
    const extended_url = base_url + 'DoctorAccount/get/all-patients/profiles';

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

export async function addDoctorNote(info) {
    const extended_url = base_url + 'DoctorAccount/add-doctor-note';

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
        throw new Error(`Error: ${errorDetails}`)
    }
}

export async function addPrescription(prescription_info) {
    const extended_url = base_url + 'DoctorAccount/add-to-patient-precription';

    const response = await fetch(extended_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(prescription_info)
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails}`);
    }
}

export async function getHomeStatsData() {
    const extended_url = base_url + 'DoctorAccount/get/doctor-dashboard/stats';

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