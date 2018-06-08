
import chalk from 'chalk'

const success = (...args) => {
  console.log(chalk.cyan('SUCCESS:'), ...args)
}

const info = (...args) => {
  console.info(chalk.blue('INFO:'), ...args)
}

const error = (...args) => {
  console.error(chalk.magenta('ERROR:'), ...args)
}

const warn = (...args) => {
  console.warn(chalk.yellow('WARN:'), ...args)
}

export default { success, info, error, warn }
