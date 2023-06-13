import * as ko from "knockout";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojformlayout";
import "ojs/ojbutton";
import "ojs/ojlabelvalue";
import "ojs/ojbutton";
import "ojs/ojlabel";
import rootViewModel from "../appController";


class LoginViewModel {
    private readonly username = ko.observable("");
    private readonly password = ko.observable("");
    private readonly isValid = ko.computed(() => { return this.password().length === 0 || this.username().length === 0 }) /*Ajout de ma condition de vérification du formualaire*/

    constructor() {
    }

    private switchMode = () => {
        const body = document.querySelector('body') as HTMLElement;
        const themeToggleButton = document.getElementById('theme-toggle-button') as HTMLButtonElement;
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
        } else {
            body.classList.add('dark-mode');
        }
    }

    private submit = async () => {
        try {
            const response = await rootViewModel.login(this.username(), this.password());
            if (response)
                rootViewModel.router.go({ path: "home" });
        } catch (error) {
            console.error(error);
        }
    }

    connected(): void {
    }

    disconnected(): void {
    }

    transitionCompleted(): void {
    }
}

export = LoginViewModel;
