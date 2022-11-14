# EventHive 🐝

## About EventHive
EventHive is a centralised platform for grassroot events. We allow organisers of small-scale events to list their events publicly so that more people can find their events and participate in them.

## About the code
EventHive (frontend) is a **Vue** (Vue 2) project, build with **Vite**. This project also imports various libraries such as **Vuex**, **Vue Router** and **Vuetify** for state management, routing and components library.

EventHive (backend) is built with **ExpressJS** and deployed on Google Firebase. It is connected to our **MongoDB** on the cloud to retrieve information such as user data and event details.

## Getting started

You can run EventHive (frontend) locally with either **yarn** or **npm** 
<!-- ```bash
npx degit slime7/template-vite-vue2-vuetify my-project
``` -->
### npm:
```bash
npm install # install required dependencies in node_modules
npm run dev # runs the application
```

### Yarn:
```bash
yarn install --ignore-engines # install required dependencies in node_modules
yarn dev # runs the application
```
Once successful, you may view the application at http://localhost:8080/, else you can also see the deployed application at https://event-hive.netlify.app/
