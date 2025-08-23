import {ApiProvider, ApiProviderEventTypes} from "../ApiProvider";
import {GlobalEventHandler} from "../GlobalEventHandler";


export class LoginController {
    private static instance: LoginController;

    private container: HTMLDivElement = document.createElement('div');

    private constructor() {

        this.setUpDiv();

        GlobalEventHandler.getInstance().on(ApiProviderEventTypes.UNAUTHORIZED, () => {
            this.showLoginForm(true);
        });
        this.showLoginForm(false);
    }

    public static getInstance(): LoginController {
        if (!LoginController.instance) {
            LoginController.instance = new LoginController();
        }
        return LoginController.instance;
    }


    private setUpDiv(): void {
        this.container.classList.add('hidden')
        this.container.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-white', 'z-1001');
        this.container.classList.add("grid", "place-items-center")
        document.body.appendChild(this.container);

        let container = document.createElement('form');
        container.classList.add('grid')
        this.container.appendChild(container);

        let usernameDiv = document.createElement('div');
        usernameDiv.classList.add('mb-4');



        let label = document.createElement('label');
        label.classList.add('block', 'text-gray-700', 'text-sm', 'font-bold', 'mb-2');
        label.textContent = 'Username:';
        let input = document.createElement('input');
        input.classList.add('shadow', 'appearance-none', 'border', 'rounded', 'w-full', 'py-2', 'px-3', 'text-gray-700', 'leading-tight', 'focus:outline-none', 'focus:shadow-outline');
        input.type = 'text';
        usernameDiv.appendChild(label);
        usernameDiv.appendChild(input);

        let passwordDiv = document.createElement('div');
        passwordDiv.classList.add('mb-4');
        let labelPassword = document.createElement('label');
        labelPassword.classList.add('block', 'text-gray-700', 'text-sm', 'font-bold', 'mb-2');
        labelPassword.textContent = 'Password:';
        let inputPassword = document.createElement('input');
        inputPassword.classList.add('shadow', 'appearance-none', 'border', 'rounded', 'w-full', 'py-2', 'px-3', 'text-gray-700', 'leading-tight', 'focus:outline-none', 'focus:shadow-outline');

        inputPassword.type = 'password';

        passwordDiv.appendChild(labelPassword);
        passwordDiv.appendChild(inputPassword);

        let button = document.createElement('button');
        button.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'focus:outline-none', 'focus:shadow-outline');
        button.textContent = 'Login';
        button.onclick = async () => {
            let username = input.value;
            let password = inputPassword.value;
            button.disabled = true; // Disable the button to prevent multiple clicks
            try {
                await ApiProvider.getInstance().login(username, password);
            } catch (error) {
                console.error("Login failed:", error);
                alert("Login failed. Please check your credentials.");
                button.classList.add('bg-red-500'); // Change button color to indicate failure
            }
        };

        container.onsubmit = (e) => {
            e.preventDefault();
            button.click();
        }
        container.appendChild(usernameDiv);
        container.appendChild(passwordDiv);

        container.appendChild(button);
        let guestLogin = document.createElement('button');
        guestLogin.textContent = 'Guest Login';
        guestLogin.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'focus:outline-none', 'focus:shadow-outline', 'mt-1');
        guestLogin.onclick = async (e) => {
            e.preventDefault();
            button.disabled = true; // Disable the button to prevent multiple clicks
            guestLogin.disabled = true; // Disable the button to prevent multiple clicks
            guestLogin.classList.add('bg-yellow-500');
            try {
                await ApiProvider.getInstance().login("guest", "defgueps11");
            } catch (error) {
                console.error("Login failed:", error);
                alert("Login failed. Please check your credentials.");
                guestLogin.classList.add('bg-red-500'); // Change button color to indicate failure
            }
        }
        container.appendChild(guestLogin);


        GlobalEventHandler.getInstance().on(ApiProviderEventTypes.LOGIN_SUCCESS, () => {
            this.container.classList.add('hidden')
        });
        GlobalEventHandler.getInstance().on(ApiProviderEventTypes.LOGIN_FAILURE, () => {
            button.disabled = false; // Re-enable the button on failure
            button.classList.add('bg-red-500');
            guestLogin.disabled = false;
        });
    }

    private showLoginForm(isShown: boolean): void {
        if (isShown) {
            this.container.classList.remove('hidden');
        } else {
            this.container.classList.add('hidden');
        }
    }
}