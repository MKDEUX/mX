import * as ko from "knockout";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import * as ResponsiveKnockoutUtils from "ojs/ojresponsiveknockoututils";
import CoreRouter = require("ojs/ojcorerouter");
import ModuleRouterAdapter = require("ojs/ojmodulerouter-adapter");
import KnockoutRouterAdapter = require("ojs/ojknockoutrouteradapter");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojmodule-element";
import { ojNavigationList } from "ojs/ojnavigationlist";
import Context = require("ojs/ojcontext");
import "ojs/ojdrawerpopup";
import { ojMenu } from "ojs/ojmenu";
import "ojs/ojmenu";
import TokenManager from "./Models/tokenManager";
import { APP_NAME } from "./config";


interface CoreRouterDetail {
  label: string;
  iconClass: string;
};

class RootViewModel {
  displayerHeader = ko.observable("");
  displayerFooter = ko.observable("");
  manner: ko.Observable<string>;
  message: ko.Observable<string | undefined>;
  smScreen: ko.Observable<boolean>;
  mdScreen: ko.Observable<boolean>;
  router: CoreRouter<CoreRouterDetail>;
  moduleAdapter: ModuleRouterAdapter<CoreRouterDetail>;
  sideDrawerOn: ko.Observable<boolean>;
  navDataProvider: ojNavigationList<string, CoreRouter.CoreRouterState<CoreRouterDetail>>["data"];
  appName: ko.Observable<string>;
  footerLinks: Array<object>;
  selection: KnockoutRouterAdapter<CoreRouterDetail>;
  userLogin: ko.Observable<string> = ko.observable("");


  constructor() {
    // handle announcements sent when pages change, for Accessibility.
    this.manner = ko.observable("polite");
    this.message = ko.observable();

    let globalBodyElement: HTMLElement = document.getElementById("globalBody") as HTMLElement;
    globalBodyElement.addEventListener("announce", this.announcementHandler, false);

    // media queries for repsonsive layouts
    let smQuery: string | null = ResponsiveUtils.getFrameworkQuery("sm-only");
    if (smQuery) {
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    }

    let mdQuery: string | null = ResponsiveUtils.getFrameworkQuery("md-up");
    if (mdQuery) {
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
    }

    const navData = [
      { path: "", redirect: "login" },
      { path: "login", detail: { label: "Connexion", iconClass: "" } },
      { path: "home", detail: { label: "Accueil", iconClass: "oj-ux-ico-bar-chart" } },
      { path: "itemTransfers", detail: { label: "Item Transfert", iconClass: "" } },
      { path: "itemAvailability", detail: { label: "Item Availability", iconClass: "" } },
      { path: "inventoryLocation", detail: { label: "Inventory by Location", iconClass: "" } }


    ];
    // router setup
    this.router = new CoreRouter(navData);
    this.router.sync();
    this.router.go({ path: "" })
    this.moduleAdapter = new ModuleRouterAdapter(this.router);
    this.selection = new KnockoutRouterAdapter(this.router);

    // Setup the navDataProvider with the routes, excluding the first redirected
    // route.
    this.navDataProvider = new ArrayDataProvider(navData.slice(2), { keyAttributes: "path" });

    // drawer
    this.sideDrawerOn = ko.observable(false);

    // close drawer on medium and larger screens
    this.mdScreen.subscribe(() => {
      this.sideDrawerOn(false);
    });
    // header
    // application Name used in Branding Area
    this.appName = ko.observable(APP_NAME);
    // footer
    this.footerLinks = [
      { name: 'About Oracle', linkId: 'aboutOracle', linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about' },
      { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
      { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
      { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
      { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
    ];
    // release the application bootstrap busy state
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  }

  public login = async (username: string, password: string) => {
    console.log("login");

    try {
      await TokenManager.login(username, password);
      this.userLogin(sessionStorage.getItem('alphaName'))
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  public logout = () => {
    console.log("You are disconnected");
    TokenManager.logout();
    this.displayerHeader("");
    this.router.go({ path: "" });
  }

  public checkIfConnected = () => {
    if (!TokenManager.isPlayerLoggedIn)
      this.logout();
    console.log("User is connected.");
  };

  //Fonction permettant de manipuler le menu 
  private menuItemAction = async (event: ojMenu.ojMenuAction) => {
    const body = document.querySelector('body') as HTMLElement;
    const themeToggleButton = document.getElementById('theme-toggle-button') as HTMLButtonElement;
    //Si l'user clique sur l'ongler preference 
    if (event.detail.selectedValue === "pref") {
      if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
      } else {
        body.classList.add('dark-mode');
      }
    } else {
      console.log("Page pas encore dispo");
    };
    //si l'utilisateur clique sur logout
    console.log(event.detail.selectedValue);
    if (event.detail.selectedValue === "out") {
      this.logout();
    } else { console.log("Page pas encore dispo"); } console.log(event.detail.selectedValue);
  }

  announcementHandler = (event: any): void => {
    this.message(event.detail.message);
    this.manner(event.detail.manner);
  }

  // called by navigation drawer toggle button and after selection of nav drawer item
  toggleDrawer = (): void => {
    this.sideDrawerOn(!this.sideDrawerOn());
  }

  // a close listener so we can move focus back to the toggle button when the drawer closes
  openedChangedHandler = (event: CustomEvent): void => {
    if (event.detail.value === false) {
      const drawerToggleButtonElement = document.querySelector("#drawerToggleButton") as HTMLElement;
      drawerToggleButtonElement.focus();
    }
  };
}

export default new RootViewModel();