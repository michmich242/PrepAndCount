import * as SecureStore from 'expo-secure-store';
import { encode } from 'base-64';

const clientID = '9aa5938538c74c77896d5d4d29c19109';
const clientSecret = '8e9d9a55c7784731b3efc511344be4e9';

const url = 'https://oauth.fatsecret.com/connect/token';
const check_token_url = 'https://platform.fatsecret.com/rest/foods/search/v3';

const credentials = encode(`${clientID}:${clientSecret}`);

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'premier'
    }).toString()
};

export async function fetchAccessToken() {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        try {
            await SecureStore.setItemAsync('token', data.access_token);
            return data.access_token;
        } catch (err) {
            console.error('Error storing token:', err);
            return data.access_token;
        }
    } catch (error) {
        console.error("Error Fetching access token:", error.message);
        throw error;
    }
}

export async function getStoredToken() {
    try {
        return await SecureStore.getItemAsync('token');
    } catch (error) {
        console.error('Error getting stored token:', error);
        return null;
    }
}

export async function CheckToken() {
    try {

        const token = await getStoredToken();

        if (!token) {
            console.error("Token not found. Fetching a new token...");
            await fetchAccessToken();
            return;
        }

        const QueryParameters = new URLSearchParams({
            method: "foods.search.v3",
            search_expression: "Chicken",
            format: "json"
        }).toString();

        const url_check = `${check_token_url}?${QueryParameters}`;

        const CheckTokenOptions = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        const response = await fetch(url_check, CheckTokenOptions);

        if (response.ok) {
            const data = await response.json();

            try {
                if (data.error) {
                    console.log("Token is invalid. Fetching a new token...");
                    await fetchAccessToken();
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.error("Failed to check token:", response.status);
        }
    } catch (error) {
        console.error("Error in CheckToken:", error);
    }
}
