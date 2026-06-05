const BASE_URL = "";

export async function getShelters(lat, lng) {
    const res = await fetch(
        `${BASE_URL}/api/shelters/nearest?tenantId=1&latitude=${lat}&longitude=${lng}`
    );

    console.log("FETCH STATUS:", res.status); // ✅ DEBUG

    const data = await res.json();

    console.log("RAW DATA:", data); // ✅ DEBUG

    return data;
}