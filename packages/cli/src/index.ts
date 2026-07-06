#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';

const program = new Command();

program
  .name('buni')
  .description('CLI for Buni Design System - Copy & Paste components to your project')
  .version('0.0.1');

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);

program.parse();
