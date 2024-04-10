import {
  addErrorHandler,
  getAppStatus,
  LOAD_ERROR,
  registerApplication,
  start,
} from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import { HTMLLayoutData } from "single-spa-layout/dist/types/isomorphic/constructRoutes";
import microfrontendLayout from "./microfrontend-layout.html";

addErrorHandler((err) => {
  if (getAppStatus(err.appOrParcelName) === LOAD_ERROR) {
    System.delete(System.resolve(err.appOrParcelName));
  }
});

const routes = constructRoutes(microfrontendLayout, {
  errors: {
    appError: "<h1>Oops! The application isn't working right now</h1>",
  },
} as unknown as HTMLLayoutData);

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();
