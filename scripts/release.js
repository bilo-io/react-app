/* eslint-disable quotes */
console.log(`
NOTE: you might need to run this to get all dependencies:

yarn add semver readline file-system colors --dev

`)

// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const exec = require('child_process').exec
const inquirer = require('inquirer')
const fs = require('fs')
const npmPackage = require('../package.json')
const readline = require('readline')
const semver = require('semver')

console.log(`bump: "${npmPackage.name}"`.cyan + ` v ${npmPackage.version}`.green)

inquirer.prompt([
    {
        type: 'list',
        name: 'bumpType',
        message: () => 'Type of release?',
        choices: [
            { name: `Major`.red + ': ! a change that includes any backwards-incompatible change', value: 'major' },
            { name: `Minor`.yellow + ': ~ a change that has new features, but is backwards-compatible with any existing consumers', value: 'minor' },
            { name: `Patch`.green + ': ✓ a bugfix release or only has other minor changes with no changes to the interfaces', value: 'patch' }
        ]
    },
    {
        type: 'input',
        name: 'bumpMessage',
        message: 'Describe the release'
    }
])
    .then(answers => {
        const { bumpType, bumpMessage } = answers
        const newVersion = setNewVersion(bumpType)
        updateChangeLog(newVersion, bumpMessage)
    })

const updateFile = (fileName, update, callback) => {
    fs.readFile(fileName, (err1, data) => {
        fs.writeFile(fileName, `${update}\n\n${data}`, 'utf8', (err) => {
            if (err) {
                console.err('could not update changelog')
                process.exit(1)
            }
            callback()
        })
    })
}

const updateChangeLog = (newVersion, bumpMessage) => {
    const updateMessage = `## v${newVersion}\n\n- ${bumpMessage}`
    updateFile('CHANGELOG.md', updateMessage, () => {
        updatePackage(npmPackage.version, newVersion)
    })
}

const updatePackage = (oldVersion, newVersion) => {
    console.log(`\n- "version": "${npmPackage.version}"`.red + `\n+ "version": "${newVersion}"\n`.green)
    pushBump(newVersion)
    // fs.readFile('package.json', 'utf8', (err, data) => {
    //     // const fileUpdate = data.replace(
    //     //     `"version": "${oldVersion}"`,
    //     //     `"version": "${newVersion}"`
    //     // )
    //     fs.writeFile('package.json', fileUpdate, (err) => {
    //         if (err) {
    //             console.err('could not update package.json\n\n'.red, err)
    //         }

    //     })
    // })
}

const setNewVersion = (bumpType) => {
    const version = npmPackage.version
    let newVersion

    switch (bumpType) {
    case 'patch':
        newVersion = `${semver.major(version)}.${semver.minor(version)}.${Number(semver.patch(version)) + 1}`
        break
    case 'minor':
        newVersion = `${semver.major(version)}.${Number(semver.minor(version)) + 1}.0`
        break
    case 'major':
        newVersion = `${Number(semver.major(version)) + 1}.0.0`
        break
    default:
        console.error('An error occured while creating the release')
        process.exit(1)
    }

    console.log(`\n- ${npmPackage.version}`.red + `\n+ ${newVersion}\n`.green)
    return newVersion
}

const pushBump = (newVersion) => {
    exec(`git add -u`, (err, stdout, stderr) => {
        if (err) {
            process.exit(1)
        }
        exec(`git commit -m "version bump: v${newVersion}"`, (err, stdout, stderr) => {
            if (err) {
                process.exit(1)
            }
            exec(`git tag -a v${newVersion} -m "version bump: v${newVersion}"`, (err, stdout, stderr) => {
                if (err) {
                    process.exit(1)
                }
                exec(`git push origin master --tags`, (err, stdout, stderr) => {
                    if (err) {
                        process.exit(1)
                    }
                })
            })
        })
    })
}
