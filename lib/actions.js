import * as coreModule from '@actions/core';
import * as execModule from '@actions/exec';
import * as githubModule from '@actions/github';
import * as ioModule from '@actions/io';
import fs from 'node:fs';

export const core = { ...coreModule };
export const exec = { ...execModule };
export const github = { ...githubModule };
export const io = { ...ioModule };

export function newContext() {
  if (!process.env.GITHUB_EVENT_PATH) {
    return github.context;
  }

  return {
    ...github.context,
    payload: JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
  };
}
