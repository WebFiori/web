#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as path from 'path';

const DOMAIN = 'new.webfiori.com';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebFioriWebsiteProd', {
  description: 'WebFiori Framework website - S3 + CloudFront',
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});

const certificate = new acm.Certificate(stack, 'Cert', {
  domainName: DOMAIN,
  validation: acm.CertificateValidation.fromDns(),
});

const bucket = new s3.Bucket(stack, 'WebsiteBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  domainNames: [DOMAIN],
  certificate,
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
  },
  defaultRootObject: 'index.html',
  errorResponses: [
    {
      httpStatus: 403,
      responseHttpStatus: 200,
      responsePagePath: '/index.html',
    },
    {
      httpStatus: 404,
      responseHttpStatus: 200,
      responsePagePath: '/index.html',
    },
  ],
});

new s3deploy.BucketDeployment(stack, 'DeployWebsite', {
  sources: [s3deploy.Source.asset(path.join(__dirname, '../../website/dist'))],
  destinationBucket: bucket,
  distribution,
  distributionPaths: ['/*'],
});

new cdk.CfnOutput(stack, 'WebsiteURL', {
  value: `https://${DOMAIN}`,
  description: 'Website URL',
});

new cdk.CfnOutput(stack, 'CloudFrontDomain', {
  value: distribution.distributionDomainName,
  description: 'Add a CNAME record pointing new.webfiori.com to this value',
});

new cdk.CfnOutput(stack, 'CertificateArn', {
  value: certificate.certificateArn,
  description: 'ACM certificate ARN - check AWS Console for DNS validation CNAME',
});
