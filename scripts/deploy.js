const { version, repository } = require('../package.json')
const { exec } = require('child_process')

const {
	GIT_CONFIG_NAME,
	GIT_CONFIG_EMAIL,
	GITHUB_TOKEN
} = process.env

const url = GITHUB_TOKEN ?
	`https://git:${GITHUB_TOKEN}@${repository}.git` :
	`git@${repository}.git`

const options = { cwd: 'build' }
const command = [
	"git init -b master",
	GIT_CONFIG_NAME && `git config user.name "${GIT_CONFIG_NAME}"`,
	GIT_CONFIG_EMAIL && `git config user.email "${GIT_CONFIG_EMAIL}"`,
	"git add -A",
	`git commit -m 'v${version}'`,
	`git push -f ${url} master:gh-pages`
].filter(cmd => !!cmd).join(" && ")

exec(command, options, (error, stdout, stderr) => {
	if (stdout) console.log(`STDOUT: ${stdout}`)
	if (stderr) console.error(`STDERR: ${stderr}`)
	if (error) {
		console.error(`ERROR: ${error}`)
		throw error
	}
})
