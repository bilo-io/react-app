const { exec } = require('child_process')
const inquirer = require('inquirer')

inquirer.prompt([
    {
        type: 'list',
        name: 'commitType',
        message: 'Type of commit?',
        choices: [
            '[A] Additions, New Features',
            '[B] Known Bugs',
            '[C] Changes, Updates',
            '[I] Improvements',
            '[F] Bugs Fixed',
            '[X] Misc. (omit from ChangeLog)'
        ],
        filter: function (val) {
            return val.substring(0, 3);
        }
    },
    {
        type: 'input',
        name: 'commitMessage',
        message: 'Commit Message:'
    }
]).then(answers => {
    const { commitType, commitMessage } = answers
    const finalMessage = `${commitType} ${commitMessage}`

    exec('git status', (error, stdout, stderr) => {
        if (error) {
            return 1
        }
        exec('git add -A', (error, stdout, stderr) => {
            if (error) {
                return 1
            }
            exec(`git commit -m "${finalMessage}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error({ error })
                }
            })
        })
    })
})
