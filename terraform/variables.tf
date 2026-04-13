variable "domain_name" {
  description = "The domain name for the application (e.g. bgrfid.yourdomain.com)"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources that support tagging"
  type        = map(string)
  default     = {}
}
