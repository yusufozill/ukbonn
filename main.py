import numpy as np

def isOdd(number):

    if type(number) != int:
        return "error"
    
    if number % 2 == 0:
        return False
    else:
        return True
    

print(isOdd(3)) # True
print(isOdd(4)) # False
print(isOdd("hello")) # error

    