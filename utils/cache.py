# Initialize cache object
import redis  

cache = redis.StrictRedis(decode_responses=True)

# setex: Set the value and expiration of a key
def setex (key, duration, value):
    return cache.setex(key, duration, value)

# get: Get the value of a key
def get (key):
    return cache.get(key)

# delete: Delete a key
def delete (key):
    return cache.delete(key)

# flushall: Remove all keys from all databases
def flushall ():
    return cache.flushall()
