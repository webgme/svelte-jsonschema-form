import { exec } from 'child_process';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version, repository } = require("../package.json");

const {
	GIT_CONFIG_NAME,
	GIT_CONFIG_EMAIL,
	GITHUB_TOKEN
} = process.env

const url = new URL(repository.url);
url.username = "git";
url.password = GITHUB_TOKEN;

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
