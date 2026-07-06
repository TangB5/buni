import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

// Available components list
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

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Component names to add')
  .action(async (components: string[] = []) => {
    if (components.length === 0) {
      const { selected } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selected',
          message: 'Select components to add:',
          choices: AVAILABLE_COMPONENTS,
        },
      ]);
      components = selected;
    }

    if (components.length === 0) {
      console.log(chalk.yellow('No components selected'));
      return;
    }

    const spinner = ora('Adding components...').start();

    try {
      const componentsDir = path.join(process.cwd(), 'src', 'components', 'ui');
      await fs.ensureDir(componentsDir);

      for (const component of components) {
        if (!AVAILABLE_COMPONENTS.includes(component as any)) {
          console.log(chalk.yellow(`Component "${component}" not found, skipping...`));
          continue;
        }

        const componentPath = path.join(__dirname, '../../templates/components', component);
        const targetPath = path.join(componentsDir, component);

        if (await fs.pathExists(componentPath)) {
          await fs.copy(componentPath, targetPath, { overwrite: false });
          console.log(chalk.green(`✓ Added ${component}`));
        } else {
          console.log(chalk.yellow(`Component "${component}" template not found, skipping...`));
        }
      }

      spinner.succeed(chalk.green('Components added successfully!'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to add components'));
      console.error(error);
    }
  });
