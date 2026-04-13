#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as path from 'path';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebFioriWebsiteProd', {
  description: 'WebFiori Framework website - S3 + CloudFront',
});

const bucket = new s3.Bucket(stack, 'WebsiteBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

const distribution = new cloudfront.Distribution(stack, 'Distribution', {
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
  value: `https://${distribution.distributionDomainName}`,
  description: 'CloudFront URL for the WebFiori website',
});
