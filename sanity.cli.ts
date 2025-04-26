/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

// Hardcoded values instead of environment variables
const projectId = 'dz88krr6'
const dataset = 'production'

export default defineCliConfig({ 
  api: { projectId, dataset },
  studioHost: 'classment-blog'
})