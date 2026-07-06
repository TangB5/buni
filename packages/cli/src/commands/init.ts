import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

export const initCommand = new Command('init')
  .description('Initialize Buni Design System in your project')
  .action(async () => {
    console.log(chalk.cyan('\n Welcome to Buni Design System\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'srcDir',
        message: 'What is your source directory?',
        default: 'src',
      },
      {
        type: 'input',
        name: 'importAlias',
        message: 'What is your import alias?',
        default: '@/*',
      },
      {
        type: 'confirm',
        name: 'addPatterns',
        message: 'Add CSS patterns?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'addTokens',
        message: 'Add design tokens?',
        default: true,
      },
    ]);

    const spinner = ora('Initializing Buni Design System...').start();

    try {
      // Create directories
      const componentsDir = path.join(process.cwd(), answers.srcDir, 'components', 'ui');
      const libDir = path.join(process.cwd(), answers.srcDir, 'lib');
      const themeDir = path.join(process.cwd(), answers.srcDir, 'theme');

      await fs.ensureDir(componentsDir);
      await fs.ensureDir(libDir);
      await fs.ensureDir(themeDir);

      // Copy utility files
      const utilsPath = path.join(__dirname, '../../templates/utils');
      if (await fs.pathExists(utilsPath)) {
        await fs.copy(utilsPath, libDir);
      }

      // Copy patterns if requested
      if (answers.addPatterns) {
        const patternsPath = path.join(__dirname, '../../templates/patterns');
        if (await fs.pathExists(patternsPath)) {
          await fs.copy(patternsPath, path.join(themeDir, 'patterns'));
        }
      }

      // Copy tokens if requested
      if (answers.addTokens) {
        const tokensPath = path.join(__dirname, '../../templates/tokens');
        if (await fs.pathExists(tokensPath)) {
          await fs.copy(tokensPath, path.join(themeDir, 'tokens'));
        }
      }

      // Update tailwind.config
      await updateTailwindConfig(answers);

      // Update globals.css
      await updateGlobalsCss(answers);

      spinner.succeed(chalk.green('Buni Design System initialized successfully!'));
      console.log(chalk.cyan('\nNext steps:'));
      console.log(chalk.gray('  Run: buni add button'));
      console.log(chalk.gray('  Run: buni add badge'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize Buni Design System'));
      console.error(error);
    }
  });

async function updateTailwindConfig(answers: any) {
  const configPath = path.join(process.cwd(), 'tailwind.config.ts');
  let config = '';

  if (await fs.pathExists(configPath)) {
    config = await fs.readFile(configPath, 'utf-8');
  } else {
    config = defaultTailwindConfig(answers);
  }

  await fs.writeFile(configPath, config);
}

async function updateGlobalsCss(answers: any) {
  const cssPath = path.join(process.cwd(), answers.srcDir, 'app', 'globals.css');
  let css = '';

  if (await fs.pathExists(cssPath)) {
    css = await fs.readFile(cssPath, 'utf-8');
    
    // Add imports if not present
    if (!css.includes('@import')) {
      const imports = `@import '../theme/tokens/avs-tokens.css';
@import '../theme/patterns/patterns.css';

`;
      css = imports + css;
    }
  } else {
    css = defaultGlobalsCss(answers);
  }

  await fs.writeFile(cssPath, css);
}

function defaultTailwindConfig(answers: any): string {
  return `import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./${answers.srcDir}/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'avs-primary':   '#C0573E',
        'avs-secondary': '#F5EBE0',
        'avs-accent':    '#1D1D1B',
        'avs-kente':     '#D4A017',
        'avs-ndop':      '#4A6741',
        'avs-indigo':    '#2A4A6B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
    },
  },
};
export default config;`;
}

function defaultGlobalsCss(answers: any): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import '../theme/tokens/avs-tokens.css';
@import '../theme/patterns/patterns.css';`;
}
