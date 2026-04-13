variable "domain_name" {
  description = "The domain name for the application"
  type        = string
  default     = "bgrfid.revolutiontech.ca"
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for the CloudFront distribution (must be in us-east-1)"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources that support tagging"
  type        = map(string)
  default = {
    Tool = "terraform"
    Repo = "RevolutionTech/bg-teach"
    Env  = "prod"
  }
}
