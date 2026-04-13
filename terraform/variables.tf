variable "domain_name" {
  description = "The domain name for the application"
  type        = string
  default     = "bgrfid.revolutiontech.ca"
}

variable "tags" {
  description = "Tags to apply to all resources that support tagging"
  type        = map(string)
  default = {
    Tool = "terraform"
    Repo = "RevolutionTech/bg-rfid"
    Env  = "prod"
  }
}
