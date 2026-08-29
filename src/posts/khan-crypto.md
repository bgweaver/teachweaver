---
title: "teachweaver: Khan Crypto Challenge"
postTitle: "Khan Crypto Challenge"
date: 2026-08-29
postDate: "August 29, 2026"
description: "In which I write a Python program to solve a cryptography challenge."
ogTitle: "Khan Crypto Challenge - teachweaver"
ogDescription: "In which I write a Python program to solve a cryptography challenge."
ogImage: "https://www.teachweaver.com/images/compass-clue.jpg"
ogUrl: "https://www.teachweaver.com/posts/khan-crypto/"
image: "/images/compass-clue.jpg"
imageAlt: "A message enciphered as a series of straight and diagonal lines."
listDescription: "About a month ago, I decided I wanted to understand cryptography better than 'and then some math magic happens that all my favorite things and the whole internet rely on.'"
---

![A message enciphered as a series of straight and diagonal lines](/images/compass-clue.jpg)

**This post will contain just so many spoilers for the Khan Academy Cryptography Challenge 101. Reading it will ruin most of the fun if you ever plan to try it on your own.**

About a month ago, I decided I wanted to understand cryptography slightly better than "and then some math magic happens that all my favorite things and the whole internet rely on." This was partially because I took an interest in Monero and tried to read some of the books and posts about it. I got it in a general sense, Monero is what I thought all cryptocurrency was originally supposed to be: a private, difficult to trace, non-reliant digital currency. When you spend XMR, you mix a bunch of random wallet addresses with yours, making it very hard to determine who spent the money. Separately, and same as any wallet, only you hold the keys that control your funds. Then a bunch of people write down that some wallet in this pool of wallets sent money to this one-time wallet so we can all agree that some money was spent but we're not positive where it came from or who it went to. Neat! Still basically magic to me though.

I haven't really needed the logic or math classes I took in school for so long that, unless an 11-year-old needed to learn it from me, I remember it only vaguely. So, I decided to take a Discrete Math class online and explore the history of cryptography. For crypto, I started with the Khan Academy course. The history was fascinating so I picked up __The Code Book__ by Simon Singh, also very cool. I've had to ping pong around with the math a lot because I'm having trouble pinning down what level I need to be at, where it isn't stuff I already know or full of symbols I have never seen.

After the Ancient Cryptography and Ciphers sections in Khan, there is Cryptography Challenge 101. There are four clues, each ramping up in difficulty. The first is a simple Caesar Cipher, which means that the letters have all been shifted over an equal number of places. There are tools online for this, but I wrote a simple one that brute forces every possible shift and lists them for you to check. It is inelegant, but if you know you're dealing with a Caesar Cipher then it will give you the right answer quickly.

The second clue took me forever, even though the first hinted at a key word and then Khan tells you that you're looking at a polyalphabetic cipher. The key should tell you how many places to shift each letter, but what I was pretty sure was the key just translated to a big mess. I spent a lot of time writing down letter frequency, then writing a program to find repeated two and three letter strings and trying to find the length of the key that way. I eventually looked at hints from other users, which revealed a trick I would not have gotten. I had been right about the key in the beginning, but missed something important.

The third clue was easy. It tells you what encryption technique is used, links to a video explaining this technique, and then uses that technique straight with no frills. Super speedy compared to the second. This clue revealed that the next cipher would be new and combine all the previous types.

![A dimly illuminated note page](/images/compass-rose.jpg)

The final clue was a beast. I couldn't go straight to writing any programs because the cipher is a series of straight and diagonal lines, rather than any numbers or letters. The notes "left behind by the criminals" revealed that each line mapped to a number 0-3 and were used to make a two-digit base-4 number. To translate to digits, you look at the cardinal direction and write down the corresponding number - N(0), E(1), S(2), W(3). Then you look at the diagonal line and write down the corresponding number - NE(3), SE(0), SW(1), NW(2). So, a symbol with a line pointing to S and a line pointing to SW would be 21 in base-4, which is 9 in base-10 or 1001 in binary.

![A note page with the word SAFE scratched out next to six symbols](/images/safe-clue.jpg)

Once I translated every symbol to base-4 and then to binary, I was stumped. I knew that some point I needed to XOR the binary with a string the criminals made from a newspaper clipping where every consonant was a 0 and every vowel was a 1, but the strings I got didn't match any letters. I had a breakthrough looking back through the notes and seeing that the criminals had mapped the word SAFE to 6 compass rose symbols. This meant that the symbols did not map cleanly to a letter. There were a number of 3-digit binary numbers on the notes, so I thought the criminals might have gone from three-digit binary, to four-digit binary, to base-4 and then mapping.

After several tries, I decided the full map was as follows:
1. Letters are turned to a pair of numbers (row, column) using a modified polybius square (0-5 rows/columns, letters spiraled inward beginning at bottom left corner)
2. Each number in each pair is converted to its 3-digit binary equivalent and joined in a long string with the other pairs.
3. Binary string is XOR'd against a one time pad (a string of letters converted to ones and zeroes where vowels are ones and consonants are zeroes).
4. XOR'd binary string is chunked into strings of 4 and the chunks are converted to 2-digit base 4 numbers.
5. Base 4 chunks are enciphered into a compass rose as follows - the first digit is drawn as a straight line pointing at N(0), E(1), S(2), or W(3). The second digit is drawn as a diagonal line pointing at NE(3), SE(0), SW(1), or NW(2)
6. The two line, rose symbols are drawn by hand and delivered to the recipient.

Decryption is then just the opposite of that:
1. Rose symbols are decrypted to two-digit, base 4 numbers (this must be done by hand).
2. Base 4 numbers are converted to 4-digit binary numbers and adjoined in a string.
3. Binary string is XORd against the same OTP as the original
4. Binary string is chunked into groups of three, which are then converted to base-10.
5. Base-10 digits are grouped into pairs and mapped to the modified polybius square.

The modified Polybius Square tripped me up twice, once when trying to map it cleanly to an unmodified version, I eventually had to look at a hint for this, and then when I left out the numbers 0-9. After catching that, I was able to write the following code that both encrypts and decrypts using this method and a few sentences of a one time pad. I am perhaps not the greatest cryptography mind of the century, but it's an awful lot of fun!

```

import re

polybiusMatch = {"00":"f", "01":"g", "02":"h", "03":"i", "04":"j", "05":"k", "10":"e", "11":"x", "12":"y", "13":"z", "15":"l", "20":"d", "21":"w", "25":"m", "30":"c", "31":"v", "35":"n", "40":"b", "41":"u", "45":"o", "50":"a", "51":"t", "52":"s", "53":"r", "54":"q", "55":"p", "14":"0", "24":"1", "34":"2", "44":"3", "43":"4", "42":"5", "32":"6", "22":"7", "23":"8", "33":"9"}
invertedPolybius = {v: k for k, v in polybiusMatch.items()}

tenToBinary = {"0":"000", "1":"001", "2":"010", "3":"011", "4":"100", "5":"101"}
binaryToTen = {v: k for k, v in tenToBinary.items()}

fourToBinary = {"00":"0000", "01":"0001", "02":"0010", "03":"0011", "10":"0100", "11":"0101", "12":"0110", "13":"0111", "20":"1000", "21":"1001", "22":"1010", "23":"1011", "30":"1100", "31":"1101", "32":"1110", "33":"1111"}
binaryToFour = {v: k for k, v in fourToBinary.items()}

fourToCompass = {"00":"NSE", "01":"NSW", "02":"NNW", "03":"NNE", "10":"ESE", "11":"ESW", "12":"ENW", "13":"ENE", "20":"SSE", "21":"SSW", "22":"SNW", "23":"SNE", "30":"WSE", "31":"WSW", "32":"WNW", "33":"WNE"}
compassToFour = {v: k for k, v in fourToCompass.items()}

def polybiusConvert(message):
    returnDigits=""
    message = re.sub(r'[^a-zA-Z0-9]', '', message.lower())
    for char in message:
        returnDigits += invertedPolybius[char]
    return(returnDigits)

def polybiusRevert(message):
    polybiusString = ""
    chunks = [message[i:i+2] for i in range(0, len(message), 2)]
    for chunk in chunks:
        polybiusString += polybiusMatch[chunk]
    return(polybiusString)

def polybiusToBinaryString(message):
    binaryReturn = ""
    for char in message:
        binaryReturn += tenToBinary[char]
    return binaryReturn

def binaryStringToTen(string):
    tenReturn = ""
    string = string[:len(string) - len(string) % 6]
    chunks = [string[i:i+3] for i in range(0, len(string), 3)]
    for chunk in chunks:
        tenReturn += binaryToTen[chunk]
    return(tenReturn)

def otpString(pad):
  pad = re.sub(r'[^a-zA-Z0-9]', '', pad.lower())
  vowels = ["a","e","i","o","u","y"]
  returnString = ""
  for l in pad:
    if l in vowels:
      returnString += "1"
    else:
      returnString += "0"
  return(returnString)

def xorString(message, pad):
    encipheredMessage = ""
    for index, char in enumerate(message):
        if char == pad[index]:
            encipheredMessage += "0"
        else:
            encipheredMessage += "1"
    return(encipheredMessage)

def binaryToBaseFour(binaryString):
    baseFourString = ""
    chunks = [binaryString[i:i+4] for i in range(0, len(binaryString), 4)]
    chunks[-1] = chunks[-1].ljust(4, "0")
    for chunk in chunks:
        baseFourString += binaryToFour[chunk]
    return(baseFourString)

def baseFourToBinary(baseFourString):
    binaryString = ""
    chunks = [baseFourString[i:i+2] for i in range(0, len(baseFourString), 2)]
    for chunk in chunks:
        binaryString += fourToBinary[chunk]
    return(binaryString)

def fourToCompassRose(fourString):
    roseString = ""
    chunks = [fourString[i:i+2] for i in range(0, len(fourString), 2)]
    for chunk in chunks:
      roseString += f"{fourToCompass[chunk]} "
    return(roseString)

def encrypt():
    plaintext = input("Input your message to encipher:\n")
    oneTimePad = input("Input the text of the one time pad:\n")
    polybiusMessage = polybiusConvert(plaintext)
    oneTimePad = otpString(oneTimePad)
    binaryPolybius = polybiusToBinaryString(polybiusMessage)
    binaryString = xorString(binaryPolybius,oneTimePad)
    fourString = binaryToBaseFour(binaryString)
    roseString = fourToCompassRose(fourString)
    print(f"Your message was: {plaintext}\n")
    print(f"After the polybius square, it was: {polybiusMessage}\n")
    print(f"In binary, that message is: {binaryPolybius}\n")
    print(f"Your OTP in binary was: {oneTimePad}\n")
    print(f"After XOR, your message read as: {binaryString}\n")
    print(f"In base four, your message was: {fourString}\n")
    print(f"Use this compass key to write out your encrypted message for delivery: {roseString}")

def decrypt():
    cipherText = input("Input the base 4 digits to decipher:\n")
    oneTimePad = input("Input the text of the one time pad:\n")
    oneTimePad = otpString(oneTimePad)
    binaryString = baseFourToBinary(cipherText)
    binaryXORString = xorString(binaryString, oneTimePad)
    polybiusString = binaryStringToTen(binaryXORString)
    plaintext = polybiusRevert(polybiusString)
    print(f"The deciphered message reads as follows: {plaintext}")



def main():
    while True:
        choice = input("Would you like to encrypt or decrypt?:\n")
        if choice.lower() == "e":
            encrypt()
        elif choice.lower() == "d":
            decrypt()
        else:
            pass

if __name__ == "__main__":
   main()
```
