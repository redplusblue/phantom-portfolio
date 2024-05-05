import redis # type: ignore

cache = redis.Redis(host='localhost', port=6379, db=0)

# setex: Set the value and expiration of a key
def setex (key, duration, value):
    cache.setex(key, duration, value)

# get: Get the value of a key or None if the key does not exist
def get (key):
    return cache.get(key)

# delete: Delete a key
def delete (key):
    return cache.delete(key)

# flushall: Remove all keys from all databases
def flushall ():
    return cache.flushall()

# getAllKeys: Get all keys
def getAllKeys ():
    return cache.keys('*')
