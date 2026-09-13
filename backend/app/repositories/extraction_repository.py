def get(db, model, item_id):
    return db.get(model, item_id)

def create(db, obj):
    db.add(obj); db.commit(); db.refresh(obj); return obj
