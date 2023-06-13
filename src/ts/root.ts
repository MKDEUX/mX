import * as ko from "knockout";
import { whenDocumentReady } from "ojs/ojbootstrap";
import rootViewModel from "./appController";
import "ojs/ojknockout";
import "ojs/ojmodule";
import "ojs/ojnavigationlist";
import "ojs/ojbutton";
import "ojs/ojtoolbar";
import TokenRequest from "./Models/tokenManager";

function init(): void {
  // bind your ViewModel for the content of the whole page body.
  ko.applyBindings(rootViewModel, document.getElementById("globalBody"));
}
 


whenDocumentReady().then(function(){
  // if (window.history && window.history.pushState) {
  //   window.history.pushState('forward', null);
  //   $(window).on('popstate', function() {
  //   window.location.reload();
  //   window.sessionStorage.clear();
  //   const logout = rootViewModel.logout()
  //   console.log(logout)
  //   alert("your are disconnected")
  //   });
  // }
  // if running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
  // event before executing any code that might interact with Cordova APIs or plugins.
  if (document.body.classList.contains("oj-hybrid")) {
    document.addEventListener("deviceready", init);
  } else {
    init();
  }
});
