from .celery_app import celery_app
@celery_app.task
def run():
    return {"task": "evaluation_tasks", "status": "queued"}
