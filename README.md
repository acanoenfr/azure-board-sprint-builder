# Azure Board Sprint Builder

This Azure DevOps tool is helping projects administrators for creating sprint iterations for their projects.

## Getting started

To use this helping tool, you need to install Node.js (v16 or higher).

First, launch the following command to install dependencies.

```bash
npm install
```

Next, you need to change value on .env file with your values:

```env
ORGANIZATION_URL="https://dev.azure.com/your-organization"
PERSONAL_ACCESS_TOKEN="your-personal-access-token"
PROJECT_NAME="your-project-name"
YEAR=2024
```

ORGANIZATION_URL is the base URL address of your Azure DevOps organization.
PERSONAL_ACCESS_TOKEN needs to be generate in your Azure DevOps profile.
PROJECT_NAME is the name of the project where you want to generate sprint iterations.
YEAR is the year you wants to generate sprint iteration.

Finally, launch the helping tool with following command:

```bash
npm start
```

After execution, you need to register sprints iterations in teams configuration page (iterations tab) on your Azure DevOps project:

```text
https://dev.azure.com/[organization]/[project]/_settings/work-team?_a=iterations
```

Click on "Select iteration(s)" to select each sprint iteration you want to use in Azure Boards.

## Credits

Distributed by Alexandre C. <alexandre@acanoen.fr>

If you want to share code modification, please initiate a pull-request (merge-request) in this git repository.
