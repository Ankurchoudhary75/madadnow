const BASE_URL = "";

export async function triggerEmergency(lat, lng) {
    const res = await fetch(`${BASE_URL}/api/emergency`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            latitude: lat,
            longitude: lng,
            tenantId: 1,
        }),
    });

    return res.json();
}