import CallAIS from "./callAIS";

class TokenManager {

    isPlayerLoggedIn: boolean;
    username: string;
    private myInterval: NodeJS.Timer;
    private password: string;
    private timeout: number = 1800000; // default 30 min

    constructor() {
        this.isPlayerLoggedIn = false;
        this.username = '';
        this.password = '';
        this.getDefaultConfig();
    }

    public login = async (username: string, password: string) => {
        try {
            const response = await this.askToken(username, password);
            this.myInterval = setInterval(() => {
                this.renewToken();
            }, this.timeout);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Disconnect the user and clear the session storage
     */
    public logout = async () => {
        clearInterval(this.myInterval);
        const token = sessionStorage.getItem("token");
        await this.releaseToken(token);
        sessionStorage.clear();
        this.isPlayerLoggedIn = false;
    };

    /**
     * Request a token
     * @param username
     * @param password
     */
    private askToken = async (username: string, password: string) => {
        const route = "/jderest/v3/orchestrator/jde-login";
        const body = {
            username: username,
            password: password,
        };
        const response = await CallAIS.callAIS("POST", route, body);
        if (!response.userInfo) {
            throw "Credentials invalids.";
        }
        this.username = username;
        this.password = password;
        console.log(response);
        
        window.sessionStorage.setItem('username', response.username);
        window.sessionStorage.setItem('token', response.userInfo.token);
        window.sessionStorage.setItem('alphaName', response.userInfo.alphaName);
        // sessionStorage.setItem('userInfo', response.userInfo);
        this.isPlayerLoggedIn = true;
    };

    /**
     * Ask a new token then end the current session
     */
    private renewToken = async () => {
        const token = sessionStorage.getItem("token");
        sessionStorage.setItem('old_token', token);
        try {
            await this.askToken(this.username, this.password);
            this.releaseToken(token);
            sessionStorage.removeItem("old_token");
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * End a token session
     * @param {string} token token to logout
     */
    private releaseToken = (token) => {
        const route = "/jderest/v3/orchestrator/jde-logout";
        const body = {
            token: token
        };
        CallAIS.callAIS("POST", route, body);
    };

    /**
     * Get the session timeout from AIS
     * then convert it from minutes to ms
     */
    private getDefaultConfig = async () => {
        const response = await CallAIS.callAIS("GET", "/jderest/v2/defaultconfig");
        window.sessionStorage.setItem("timeout", response.sessionTimeout);
        this.timeout = parseInt(response.sessionTimeout) * 60000;
        console.log(response)
    };
}
export default new TokenManager();