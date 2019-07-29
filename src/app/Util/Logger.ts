
import chalk from 'chalk'
import ILogger from '../ILogger'

export default class Logger implements ILogger {
  /*success(...args) => {
    console.log(chalk.cyan('SUCCESS:'), ...args)
  }*/

  info(...args: any[]) {
    console.info(chalk.blue('INFO:'), ...args)
  }

  /*error(...args) => {
    console.error(chalk.magenta('ERROR:'), ...args)
  }*/

  /*warn = (...args) => {
    console.warn(chalk.yellow('WARN:'), ...args)
  }*/
}
