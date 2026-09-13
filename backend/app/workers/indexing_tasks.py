from .celery_app import celery_app
@celery_app.task
def run():
    return {"task": "indexing_tasks", "status": "queued"}
