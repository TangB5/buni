import { Command } from 'commander';
import chalk from 'chalk';

const AVAILABLE_COMPONENTS = [
  'button',
  'badge',
  'card',
  'input',
  'dialog',
  'dropdown-menu',
  'select',
  'checkbox',
  'switch',
  'avatar',
  'toast',
  'tooltip',
  'accordion',
  'tabs',
  'progress',
  'separator',
  'label',
] as const;

export const listCommand = new Command('list')
  .description('List all available components')
  .action(() => {
    console.log(chalk.cyan('\n📦 Available Components:\n'));
    
    AVAILABLE_COMPONENTS.forEach((component) => {
      console.log(chalk.gray('  •'), chalk.white(component));
    });
    
    console.log(chalk.cyan('\nUsage:'));
    console.log(chalk.gray('  buni add button'));
    console.log(chalk.gray('  buni add button badge card\n'));
  });
