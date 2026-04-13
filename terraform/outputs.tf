output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution (needed for cache invalidation in CI/CD)"
  value       = aws_cloudfront_distribution.cdn.id
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket hosting the frontend (needed for deploy step in CI/CD)"
  value       = aws_s3_bucket.frontend.id
}

output "lambda_function_name" {
  description = "The name of the Lambda function (needed for deploy step in CI/CD)"
  value       = aws_lambda_function.proxy.function_name
}
