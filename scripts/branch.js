const { exec } = require('child_process')
const inquirer = require('inquirer')

inquirer.prompt([
    {
        type: 'list',
        name: 'branchType',
        message: () => 'Type of branch?',
        choices: [
            'Feature',
            'Hotfix',
            'Release',
            'Develop' // integration
        ],
        filter: function (val) {
            return val
        }
    },
    {
        type: 'input',
        name: 'branchName',
        message: 'Name your branch:'
    }
]).then(answers => {
    const { branchType, branchName } = answers
    const newBranch = `${branchType.toLowerCase()}/${branchName}`

    exec(`git checkout -b ${newBranch}`, (error, stdout, stderr) => {
        if (error) {
            return 1
        }
    })
})
