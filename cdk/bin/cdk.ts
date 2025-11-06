#!/home/linuxbrew/.linuxbrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib';
import { HelloCdkStack } from '../lib/hello-cdk';

const app = new cdk.App();
