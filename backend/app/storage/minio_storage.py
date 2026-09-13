import boto3
from app.core.config import settings

class MinioStorage:
    def __init__(self):
        self.client = boto3.client(
            "s3", endpoint_url=settings.s3_endpoint,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key
        )
    def put(self, key, data, content_type=None):
        self.client.put_object(
            Bucket=settings.s3_bucket, Key=key, Body=data,
            ContentType=content_type or "application/octet-stream"
        )
    def get(self, key):
        return self.client.get_object(Bucket=settings.s3_bucket, Key=key)["Body"].read()
