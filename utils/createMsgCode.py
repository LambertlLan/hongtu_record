# __author: Lambert
# __date: 2018/4/19 15:32
import random


def create_msg_code():
    chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    x = random.choice(chars), random.choice(chars), random.choice(chars), random.choice(chars)
    verify_code = "".join(x)
    return verify_code
