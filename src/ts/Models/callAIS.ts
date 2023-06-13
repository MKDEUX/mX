import { APP_NAME, URL } from "../config";

class CallAIS {

    /**
     * Format the request to AIS
     * @param {string} method 'GET' or 'POST'
     * @param {string} route API service to consume
     * @param query input for POST request
     * @returns the result of the request
     */
    public static callAIS = async (method: 'GET' | 'POST', route: string, query?: any): Promise<any> => {
        // Token is retrieved from localstorage
        // In case token is beeing renewed, old_token is used instead
        let token = sessionStorage.getItem('token');
        if (!token)
            token = sessionStorage.getItem('old_token');

        // Credentials are added to the request input 
        let body = {
            "token": token ? token : "",
            "deviceName": APP_NAME,
            ...query
        };
        return await CallAIS.executeRequest(method, route, body);
    }

    /**
     * execute the request
     * @param {string} method 'GET' or 'POST'
     * @param {string} route API service to consume
     * @param body input for POST request
     * @returns the result of the request
     */
    private static executeRequest = async (method: 'GET' | 'POST', route: string, body: any): Promise<any> => {
        const url: string = URL.value + route;

        const response: Response = await fetch(url, {
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "access-control-allow-origin": "*"
            },
            body: (method === 'POST') ? JSON.stringify(body) : null,
        });
        return await response.json();
    };
}

export default CallAIS;