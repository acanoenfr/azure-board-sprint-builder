require('dotenv').config();

const azureDevOps = require('azure-devops-node-api');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');
require('dayjs/locale/fr');
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.locale('fr');
dayjs.tz.setDefault('Europe/Paris');

// Parameters such as year and project name
const year = process.env.YEAR || 2024;
const project = process.env.PROJECT_NAME || 'project';

// Azure DevOps configuration
const orgUrl = process.env.ORGANIZATION_URL || 'https://dev.azure.com/yourorg';
const token = process.env.PERSONAL_ACCESS_TOKEN || 'yourPAT';
const authHandler = azureDevOps.getPersonalAccessTokenHandler(token);
const connection = new azureDevOps.WebApi(orgUrl, authHandler);

async function createIterations() {
    try {
        const newIterations = [];
        const workClient = await connection.getWorkApi();
        const itemClient = await connection.getWorkItemTrackingApi();
        const iterations = await workClient.getTeamIterations({
            project: project
        });

        // Find last sprint iteration and start 3 days after its finishDate
        let startDate;
        if (iterations.length > 0) {
            const lastIteration = iterations.pop();
            startDate = dayjs.utc(lastIteration.attributes.finishDate).add(3, 'days');
        } else {
            startDate = dayjs.utc(`${year}-01-01`);
            if ([0, 1, 6].indexOf(startDate.day()) === -1) {
                startDate.startOf('year').startOf('week'); // First Monday of the year
            }
        }

        // Create sprint iterations for selected year
        let currentIterationNumber = 1;
        console.log("---------------");
        while (startDate.year() == year) {
            const endDate = startDate.add(9, 'days').endOf('week').subtract(2, 'day'); // Friday, after 10 days
            const iterationName = `SP${year.toString().slice(2)}-${currentIterationNumber.toString().padStart(2, '0')} du ${startDate.format('DD-MMM')} au ${endDate.format('DD-MMM')}`;
            const iterationPath = project;

            console.log(`Iteration name: ${iterationName}`);
            console.log(`Iteration parent: ${iterationPath}`);
            console.log(`Iteration start: ${startDate.format('YYYY-MM-DD')}`);
            console.log(`Iteration end: ${endDate.format('YYYY-MM-DD')}`);
            console.log("---------------");

            const result = await itemClient.createOrUpdateClassificationNode({
                name: iterationName,
                path: iterationPath,
                attributes: {
                    startDate: startDate.toDate(),
                    finishDate: endDate.toDate()
                }
            }, project, 'Iterations');
            newIterations.push(result);

            startDate = endDate.add(3, 'days'); // Next sprint, next monday
            currentIterationNumber++;
        }

        console.log(`${newIterations.length} iterations are successfully created for project ${project}`);
    } catch (err) {
        console.error('An error are occured:', err);
    }
}

// Call function to creation sprint iterations
createIterations();
